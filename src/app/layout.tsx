import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DINA · Nail Atelier — The Bright Beauty",
  description:
    "DINA is a modern nail atelier founded by Dina — sculpted gel, chrome, BIAB and hand-painted art. Book your session online in under a minute.",
  keywords: ["nail salon", "gel manicure", "BIAB", "nail art", "Dina", "manicure booking"],
  openGraph: {
    title: "DINA · Nail Atelier",
    description: "The Bright Beauty — sculpted gel, chrome and hand-painted art. Book online.",
    images: ["/gallery/nail-06.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${grotesk.variable} ${instrument.variable} font-sans`}>
        <div className="noise" aria-hidden />
        {children}
      </body>
    </html>
  );
}
