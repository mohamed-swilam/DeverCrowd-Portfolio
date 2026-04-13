"use client";

import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    if (!pathname) return;
    const pathParts = pathname.split('/');
    const currentLocale = pathParts[1];
    
    // If not on an internationalized route, do nothing
    if (currentLocale !== 'en' && currentLocale !== 'ar') {
      return;
    }
    
    const newLocale = currentLocale === 'en' ? 'ar' : 'en';
    pathParts[1] = newLocale;
    const newPath = pathParts.join('/');
    
    // Persist locale directly mimicking next-intl default cookie behavior
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.replace(newPath);
  };

  // Safely check if pathname is available and starts with /ar
  const isAr = typeof pathname === 'string' && pathname.startsWith('/ar');

  return (
    <button
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className="text-sm font-bold uppercase rounded-full border border-foreground/10 px-3 py-1 hover:bg-foreground/5 transition-colors flex items-center justify-center shrink-0"
    >
      {isAr ? "EN" : "Ar"}
    </button>
  );
}
