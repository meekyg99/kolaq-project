import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Shop Premium Herbal Bitters',
  'Browse our collection of premium herbal bitters and wellness products. Traditional herbal blends with modern convenience and international shipping.',
  '/shop'
);

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
