import type { Metadata } from 'next';
import { Poppins, DM_Sans } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CalorieMate - Smart Calorie Tracking',
  description: 'AI-powered calorie tracking with photo analysis and personalized nutrition advice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${poppins.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
