import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Parceiros CPAD Belém",
    short_name: "CPAD Belém",
    description: "Diretório de lojas, produtos afiliados e serviços parceiros da CPAD Belém.",
    start_url: "/parceiros",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#750B2A",
    lang: "pt-BR",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
