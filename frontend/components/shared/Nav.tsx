"use client";
import Link from "next/link";
import { HiMail, HiMenuAlt3, HiX } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavLink {
  href: string;
  label: string;
}

const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/works", label: "Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blogs", label: "Blogs" },
];

const Nav = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // ── قفل سكرول الصفحة لما المنيو يفتح
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ── إغلاق مع أنيميشن
  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);
    }, 280); // نفس مدة الأنيميشن
  };

  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
    } else {
      setMenuOpen(true);
    }
  };

  const linkClass = (href: string): string =>
    `relative inline-flex items-center px-3 py-1.5 rounded-lg font-medium
    transition-all duration-300 ease-out
    ${
      pathname === href
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
      {/* ── CSS الأنيميشن */}
      <style>{`
        @keyframes menuSlideDown {
          from {
            opacity: 0;
            transform: translateY(-24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes menuSlideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-24px);
          }
        }

        @keyframes linkFadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .menu-enter {
          animation: menuSlideDown 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .menu-exit {
          animation: menuSlideUp 0.28s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        .link-fade-in {
          opacity: 0;
          animation: linkFadeIn 0.3s ease forwards;
        }
      `}</style>

      <nav
        aria-label="Main navigation"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl backdrop-blur-xl rounded-4xl border border-primary/30 transition-all duration-300"
        style={{
          background: "color-mix(in srgb, var(--background) 70%, transparent)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="DeverCrowd home"
          >
            <span className="font-semibold text-xl text-foreground">
              <span className="text-primary">Dever</span>Crowd
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`${linkClass(href)} text-sm`}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/contact"
              className="relative md:flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent shadow-[0_2px_10px_rgba(146,56,248,0.3)] transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_3px_15px_rgba(146,56,248,0.3)] active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <HiMail className="text-base" />
                Contact
              </span>
            </Link>

            <button
              className="md:hidden p-2 rounded-lg transition-all duration-200"
              style={{
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--foreground)",
              }}
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              {/* ── أيقونة بتتحول مع أنيميشن */}
              <span
                className="block transition-all duration-200"
                style={{
                  transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                {menuOpen ? (
                  <HiX className="text-xl" />
                ) : (
                  <HiMenuAlt3 className="text-xl" />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu */}
        {(menuOpen || isClosing) && (
          <div
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            className={`md:hidden px-6 pb-6 pt-3 flex flex-col gap-2 ${
              isClosing ? "menu-exit" : "menu-enter"
            }`}
            style={{
              borderTop: "1px solid var(--border)",
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
              // ── السكرول داخل المنيو لو المحتوى أطول من الشاشة
              maxHeight: "calc(100vh - 80px)",
              overflowY: "auto",
            }}
          >
            <div className="flex flex-col gap-1 py-2">
              {links.map(({ href, label }, i) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`${linkClass(href)} text-lg link-fade-in`}
                  style={{
                    animationDelay: isClosing ? "0ms" : `${i * 55}ms`,
                  }}
                  aria-current={pathname === href ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div
              className="link-fade-in pt-2"
              style={{
                animationDelay: isClosing ? "0ms" : `${links.length * 55}ms`,
                borderTop: "1px solid var(--border)",
              }}
            >
              <Link
                href="/contact"
                onClick={closeMenu}
                className="w-full relative flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent shadow-[0_2px_10px_rgba(146,56,248,0.3)] transition-all duration-300 ease-out active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <HiMail className="text-base" />
                  Contact
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