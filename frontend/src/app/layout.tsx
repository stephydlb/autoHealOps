import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoHealOps",
  description: "Tableau de bord de surveillance et de réparation système",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-blue-600 text-white p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">AutoHealOps</h1>
            <ul className="flex space-x-4">
              <li><a href="/" className="hover:underline">Tableau de bord</a></li>
              <li><a href="/processes" className="hover:underline">Processus</a></li>
              <li><a href="/scripts" className="hover:underline">Scripts</a></li>
              <li><a href="/ai" className="hover:underline">IA/ML</a></li>
              <li><a href="/about" className="hover:underline">À propos</a></li>
            </ul>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
