import { Metadata } from 'next';

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolaqbitters.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'KOLAQ ALAGBO BITTERS - Premium Herbal Wellness',
    template: '%s | KOLAQ ALAGBO BITTERS'
  },
  description: 'Experience premium herbal wellness with KOLAQ ALAGBO BITTERS. Traditional herbal blend with modern convenience. Shop now with international delivery.',
  keywords: ['herbal bitters', 'wellness drink', 'traditional medicine', 'herbal supplement', 'digestive health', 'kolaq bitters', 'alagbo bitters', 'herbal remedy'],
  authors: [{ name: 'KOLAQ ALAGBO BITTERS' }],
  creator: 'KOLAQ ALAGBO BITTERS',
  publisher: 'KOLAQ ALAGBO BITTERS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'KOLAQ ALAGBO BITTERS',
    title: 'KOLAQ ALAGBO BITTERS - Premium Herbal Wellness',
    description: 'Experience premium herbal wellness with KOLAQ ALAGBO BITTERS. Traditional herbal blend with modern convenience.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KOLAQ ALAGBO BITTERS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KOLAQ ALAGBO BITTERS - Premium Herbal Wellness',
    description: 'Experience premium herbal wellness with KOLAQ ALAGBO BITTERS. Traditional herbal blend with modern convenience.',
    images: ['/images/twitter-image.jpg'],
    creator: '@kolaqbitters',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '',
  image?: string
): Metadata {
  const url = `${BASE_URL}${path}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  sku: string;
  availability: 'InStock' | 'OutOfStock';
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: product.currency,
      price: product.price,
      availability: `https://schema.org/${product.availability}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    brand: {
      '@type': 'Brand',
      name: 'KOLAQ ALAGBO BITTERS',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KOLAQ ALAGBO BITTERS',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    description: 'Premium herbal wellness products and traditional herbal bitters',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-815-706-5742',
      contactType: 'Customer Service',
      email: 'support@kolaqalagbo.org',
    },
    sameAs: [
      'https://facebook.com/kolaqbitters',
      'https://twitter.com/kolaqbitters',
      'https://instagram.com/kolaqbitters',
    ],
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KOLAQ ALAGBO BITTERS',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/shop?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
