"use client";

import { useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type AdminTheme = "light" | "dark";

const ADMIN_THEME_STORAGE_KEY = "cpad-admin-theme";
const ADMIN_THEME_COOKIE_KEY = "cpad-admin-theme";
const ADMIN_THEME_ROOT_ID = "admin-theme-root";

function getSavedTheme(): AdminTheme {
  const documentTheme = document.documentElement.dataset.adminTheme;
  if (documentTheme === "dark" || documentTheme === "light") {
    return documentTheme;
  }

  const cookieTheme = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${ADMIN_THEME_COOKIE_KEY}=`))
    ?.split("=")[1];

  if (cookieTheme === "dark" || cookieTheme === "light") {
    return cookieTheme;
  }

  try {
    return window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY) === "dark"
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

function applyTheme(theme: AdminTheme) {
  document.documentElement.setAttribute("data-admin-theme", theme);
  document.getElementById(ADMIN_THEME_ROOT_ID)?.setAttribute("data-admin-theme", theme);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ADMIN_THEME_COOKIE_KEY}=${theme}; Path=/admin; Max-Age=31536000; SameSite=Lax${secure}`;

  try {
    window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme);
  } catch {
    // O painel continua funcional quando o navegador bloqueia o armazenamento local.
  }
}

export function AdminThemeToggle() {
  const [theme, setTheme] = useState<AdminTheme>("light");

  useLayoutEffect(() => {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);

    const frame = window.requestAnimationFrame(() => setTheme(savedTheme));
    return () => {
      window.cancelAnimationFrame(frame);
      document.documentElement.removeAttribute("data-admin-theme");
    };
  }, []);

  function selectTheme(nextTheme: AdminTheme) {
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-white/25 bg-black/10 p-1"
      role="group"
      aria-label="Tema do painel administrativo"
    >
      <button
        type="button"
        onClick={() => selectTheme("light")}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--color-gold-light) ${theme === "light" ? "bg-(--color-gold-light) text-(--color-wine-dark) shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
        aria-label="Usar modo claro"
        aria-pressed={theme === "light"}
        title="Modo claro"
      >
        <Sun className="h-4 w-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => selectTheme("dark")}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold-light) ${theme === "dark" ? "bg-(--color-gold-light) text-(--color-wine-dark) shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
        aria-label="Usar modo escuro"
        aria-pressed={theme === "dark"}
        title="Modo escuro"
      >
        <Moon className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
