import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Track Your Order',
  'Track your KOLAQ ALAGBO BITTERS order in real-time. Enter your order ID to see the current status and delivery information.',
  '/track-order'
);

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
