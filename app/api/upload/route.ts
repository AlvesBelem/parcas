export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/auth-helpers";
import { put } from "@vercel/blob";

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

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
  }

  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "") || "image";
    const key = `products/${Date.now()}-${randomUUID()}-${safeName}`;

    const blob = await put(key, file, {
      access: "public",
      contentType: file.type || "application/octet-stream",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Erro no upload para Vercel Blob", error);
    return NextResponse.json({ error: "Falha ao enviar imagem" }, { status: 500 });
  }
}
