"use client";
import { HiMail, HiMenuAlt3, HiX } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import ThemeToggle from "./ThemeToggle";

interface NavLink {
  href: string;
  translationKey: string;
}

const navKeys: NavLink[] = [
  { href: "/", translationKey: "home" },
  { href: "/services", translationKey: "services" },
  { href: "/works", translationKey: "works" },
  { href: "/pricing", translationKey: "pricing" },
  { href: "/blogs", translationKey: "blogs" },
];

const Nav = () => {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => { setMenuOpen(false); setIsClosing(false); }, 280);
  };

  const toggleMenu = () => {
    if (menuOpen) closeMenu();
    else setMenuOpen(true);
  };

  const linkClass = (href: string): string =>
    `relative inline-flex items-center px-3 py-1.5 rounded-lg font-medium
    transition-all duration-300 ease-out
    ${pathname === href
      ? `text-primary
          before:absolute before:-bottom-1 before:left-0
          before:w-full before:h-[1px]
          before:bg-gradient-to-r before:from-primary before:to-accent
          before:scale-x-100 before:origin-left
          before:transition-transform before:duration-300`
      : `text-muted-foreground
          before:absolute before:-bottom-1 before:left-0
          before:w-full before:h-[1px]
          before:bg-gradient-to-r before:from-primary before:to-accent
          before:shadow-[0_0_8px_rgba(146,56,248,0.5)]
          before:scale-x-0 before:origin-center
          before:transition-transform before:duration-300
          hover:before:scale-x-100`
    }`;

  return (
    <>
      <style>{`
        @keyframes menuSlideDown {
          from { opacity:0; transform:translateY(-24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes menuSlideUp {
          from { opacity:1; transform:translateY(0); }
          to   { opacity:0; transform:translateY(-24px); }
        }
        @keyframes linkFadeIn {
          from { opacity:0; transform:translateX(-10px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes swingBulb {
          0%,100% { transform:rotate(-4deg); }
          50%     { transform:rotate(4deg); }
        }
        .menu-enter   { animation:menuSlideDown 0.28s cubic-bezier(0.16,1,0.3,1) forwards; }
        .menu-exit    { animation:menuSlideUp   0.28s cubic-bezier(0.4,0,1,1)    forwards; }
        .link-fade-in { opacity:0; animation:linkFadeIn 0.3s ease forwards; }

        .bulb-hang-wrap {
          display:flex;
          flex-direction:column;
          align-items:center;
          transform-origin:top center;
          animation:swingBulb 5s ease-in-out infinite;
        }
        .bulb-wire {
          width:1px;
          height:20px;
          background:linear-gradient(to bottom,rgba(148,163,184,0.6),rgba(148,163,184,0.15));
        }
        .bulb-hang-wrap .bulb-toggle svg {
          transform: rotate(180deg);
        }
      `}</style>

      <nav
        aria-label="Main navigation"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl backdrop-blur-xl rounded-4xl border border-primary/30 transition-all duration-300"
        style={{
          background: "color-mix(in srgb, var(--background) 70%, transparent)",
          overflow: "visible",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo + لمبة معلقة تحته دايماً */}
          <div className="relative">
            <Link href="/" className="flex items-center gap-2 " aria-label="DeverCrowd home">
              <span className="font-semibold text-xl text-foreground">
                <span className="text-primary ">Dever</span>Crowd
              </span>
            </Link>

            {/* اللمبة الخارجية — تحت اللوجو على الموبايل والديسكتوب */}
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="bulb-hang-wrap">
                <div className="bulb-wire" />
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navKeys.map(({ href, translationKey }) => (
              <Link
                key={href}
                href={href}
                className={`${linkClass(href)} text-sm`}
                aria-current={pathname === href ? "page" : undefined}
              >
                {t(translationKey)}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Desktop: Language + Contact */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                href="/contact"
                className="relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent shadow-[0_2px_10px_rgba(146,56,248,0.3)] transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_3px_15px_rgba(146,56,248,0.3)] active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <HiMail className="text-base" />
                  {t("contact")}
                </span>
              </Link>
            </div>

            {/* Mobile: hamburger only */}
            <button
              className="md:hidden p-2 rounded-lg transition-all duration-200"
              style={{ border: "1px solid var(--border)", background: "transparent", color: "var(--foreground)" }}
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              <span
                className="block transition-all duration-200"
                style={{ transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                {menuOpen ? <HiX className="text-xl" /> : <HiMenuAlt3 className="text-xl" />}
              </span>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {(menuOpen || isClosing) && (
          <div
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            className={`md:hidden px-6 pb-6 pt-2 flex flex-col gap-2 ${isClosing ? "menu-exit" : "menu-enter"}`}
            style={{
              borderTop: "1px solid var(--border)",
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
              maxHeight: "calc(100vh - 80px)",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* اللمبة داخل المنيو — في أقصى اليمين من أعلى المنيو */}
            {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div className="bulb-hang-wrap">
                <div className="bulb-wire" />
                <ThemeToggle />
              </div>
            </div> */}

            {/* Nav links */}
            <div className="flex flex-col gap-1 py-2 pt-10">
              {navKeys.map(({ href, translationKey }, i) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`${linkClass(href)} text-lg link-fade-in`}
                  style={{ animationDelay: isClosing ? "0ms" : `${i * 55}ms` }}
                  aria-current={pathname === href ? "page" : undefined}
                >
                  {t(translationKey)}
                </Link>
              ))}
            </div>

            {/* Language + Contact */}
            <div
              className="link-fade-in flex flex-col gap-3 pt-3"
              style={{
                animationDelay: isClosing ? "0ms" : `${navKeys.length * 55}ms`,
                borderTop: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-start px-1">
                <LanguageSwitcher />
              </div>

              <Link
                href="/contact"
                onClick={closeMenu}
                className="w-full relative flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent shadow-[0_2px_10px_rgba(146,56,248,0.3)] transition-all duration-300 ease-out active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <HiMail className="text-base" />
                  {t("contact")}
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Nav;