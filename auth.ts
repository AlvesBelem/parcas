import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/auth-helpers";

const authResult = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // A conta precisa ser autorizada antes de criar um usuário ou uma sessão.
      // Ao negar, retornamos para a vitrine sem exibir a tela de erro do provedor.
      return isAdminEmail(user.email) || "/parceiros";
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isAdmin = isAdminEmail(session.user.email);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Sempre envia o usuário autenticado para /admin/overview, a não ser que a URL já seja interna
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === new URL(baseUrl).origin) {
        return url;
      }
      return baseUrl;
    },
  },
});

export const { handlers, auth, signIn, signOut } = authResult;
export const { GET, POST } = handlers;
