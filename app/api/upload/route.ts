export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/auth-helpers";
import { put } from "@vercel/blob";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_MULTIPART_OVERHEAD_BYTES = 128 * 1024;

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !isAdminEmail(session.user?.email)) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN nao configurada" },
      { status: 500 }
    );
  }

  const contentLength = Number(req.headers.get("content-length"));
  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_UPLOAD_BYTES + MAX_MULTIPART_OVERHEAD_BYTES
  ) {
    return NextResponse.json(
      { error: "A imagem pode ter no maximo 5 MB." },
      { status: 413 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
  }

  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "A imagem pode ter no maximo 5 MB." },
      { status: 413 },
    );
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const image = detectImageType(bytes);
    if (!image) {
      return NextResponse.json(
        { error: "Envie uma imagem PNG, JPEG ou WebP valida." },
        { status: 415 },
      );
    }

    const key = `products/${Date.now()}-${randomUUID()}.${image.extension}`;

    const blob = await put(key, new Blob([bytes], { type: image.contentType }), {
      access: "public",
      contentType: image.contentType,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Erro no upload para Vercel Blob", error);
    return NextResponse.json({ error: "Falha ao enviar imagem" }, { status: 500 });
  }
}

function detectImageType(bytes: Uint8Array) {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { contentType: "image/png", extension: "png" };
  }

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { contentType: "image/webp", extension: "webp" };
  }

  return null;
}
