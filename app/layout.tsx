import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'thebasicgame.com — Powered by Codyza.com',
  description:
    'A futuristic multi-game gaming console in your browser. Powered by Codyza.com. Founder: Ayush Gaire.',
  authors: [{ name: 'Ayush Gaire', url: 'https://ayushgaire.com' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">{children}</body>
    </html>
  );
}
