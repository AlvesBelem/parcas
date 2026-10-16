import { headers } from "next/headers";

import { jsonLdStringify } from "@/lib/seo";

export async function JsonLd({ data }: { data: Record<string, unknown> }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: jsonLdStringify(data) }}
    />
  );
}
