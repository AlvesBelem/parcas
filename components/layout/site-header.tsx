"use client";
 
 import { useState } from "react";
 import Link from "next/link";
 import Image from "next/image";
 import { Menu, X } from "lucide-react";
 
 import { cn } from "@/lib/utils";
 import { buttonVariants } from "@/lib/styles/button";
 
 const navLinks = [
   { href: "/#rede", label: "Rede Oficial" },
   { href: "/#categorias", label: "Categorias" },
 ];
 
 export function SiteHeader() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
 
   const toggleMenu = () => setIsMenuOpen((prev) => !prev);
   const closeMenu = () => setIsMenuOpen(false);
 
   return (
     <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
       <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
         <Link href="/" className="flex items-center gap-3 text-white" onClick={closeMenu}>
           <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-lime-300/20">
             <Image
               src="/LOGO_VETOR_CPAD_FOGO.svg"
               alt="Logomarca CPAD Belem"
               width={32}
               height={32}
               priority
             />
           </div>
           <div>
             <p className="text-sm uppercase tracking-[0.25em] text-white/50">CPAD Belem</p>
             <p className="text-lg font-semibold">programa de parceiros cpad belem</p>
           </div>
         </Link>
 
         <nav className="hidden items-center gap-3 text-sm text-white/70 sm:flex">
           {navLinks.map((link) => (
             <Link key={link.href} href={link.href} className="hover:text-white">
               {link.label}
             </Link>
           ))}
           <Link
             href="/admin/overview"
             className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
           >
             Area do admin
           </Link>
         </nav>
 
         <button
           type="button"
           onClick={toggleMenu}
           className="inline-flex items-center justify-center rounded-2xl border border-white/10 p-2 text-white sm:hidden"
           aria-label="Abrir menu"
         >
           {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
         </button>
 
         <div
           className={cn(
             "absolute left-4 right-4 top-[calc(100%+0.75rem)] rounded-3xl border border-white/10 bg-zinc-950/95 p-6 text-sm text-white/80 transition-all sm:hidden",
             isMenuOpen
               ? "pointer-events-auto opacity-100 translate-y-0"
               : "pointer-events-none opacity-0 -translate-y-3",
           )}
         >
           <div className="space-y-4">
             {navLinks.map((link) => (
               <Link
                 key={link.href}
                 href={link.href}
                 onClick={closeMenu}
                 className="block rounded-2xl border border-white/5 px-4 py-3 text-center font-medium hover:border-white/20"
               >
                 {link.label}
               </Link>
             ))}
             <Link
               href="/admin/overview"
               onClick={closeMenu}
               className={cn(
                 buttonVariants({ variant: "secondary", size: "sm" }),
                 "block w-full text-center",
               )}
             >
               Area do admin
             </Link>
           </div>
         </div>
       </div>
     </header>
   );
 }
