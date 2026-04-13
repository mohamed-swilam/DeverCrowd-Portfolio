import { Metadata } from 'next';

export function constructMetadata({
  title = 'DeverCrowd',
  description = 'Digital products studio — web, mobile, and growth.',
  image = '/og-image.png',
  icons = '/favicon.ico',
  noIndex = false,
  locale = 'en',
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  locale?: string;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
      type: "website",
      locale,
      alternateLocale: locale === 'en' ? ['ar'] : ['en']
    },
    alternates: {
      languages: {
        'en': '/en',
        'ar': '/ar',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    icons,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
