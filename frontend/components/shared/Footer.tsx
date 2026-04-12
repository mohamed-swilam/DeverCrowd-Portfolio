import Logo from "./Logo";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

const siteLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/works", label: "Works" },
  { href: "/contact", label: "Contact" },
];

const socialLinks: NavLink[] = [
  { href: "https://github.com/DeverCrowd", label: "GitHub" },
  { href: "https://www.instagram.com/devercrowd/", label: "Instagram" },
  { href: "https://www.tiktok.com/@devercrowd.com", label: "TikTok" },
  { href: "https://www.facebook.com/profile.php?id=61577937253222", label: "Facebook" },
  { href: "https://www.linkedin.com/company/devercrowd/", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative w-full border-t border-border bg-card/40 px-4 pb-10 pt-12 backdrop-blur-sm sm:px-6 lg:px-12"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="relative flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
          <div className="relative w-full max-w-md">
            <Logo width={400} height={64} className="mx-auto opacity-[0.08] lg:mx-0" priority={false} />
            <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 lg:left-0 lg:translate-x-0">
              <p className="text-2xl font-extrabold text-foreground md:text-3xl xl:text-4xl">
                Dever<span className="text-primary">Crowd</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                © {new Date().getFullYear()} Dever Crowd Ltd. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-lg flex-col justify-center gap-10 sm:flex-row sm:gap-16 lg:w-1/2 lg:justify-end">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <h3 className="pb-1 text-sm font-semibold uppercase tracking-wider text-foreground">Site</h3>
            {siteLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm text-muted-foreground transition hover:text-primary">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2 sm:items-start">
            <h3 className="pb-1 text-sm font-semibold uppercase tracking-wider text-foreground">Social</h3>
            {socialLinks.map(({ href, label }) => (
              <Link key={href} href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition hover:text-primary">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}