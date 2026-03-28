import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Klar — Property Intelligence",
  description: "AI-powered property intelligence for Austrian real estate agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${spaceGrotesk.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-space)] antialiased">
        {children}
      </body>
    </html>
  );
}
