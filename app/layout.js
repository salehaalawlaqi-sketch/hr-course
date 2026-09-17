import { Bebas_Neue, IBM_Plex_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "HR Learning Platform",
  description: "Read. Understand. Take the quiz. Track your growth.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${ibmPlexSans.variable} ${notoSansArabic.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
