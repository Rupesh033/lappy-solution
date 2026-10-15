import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ClientShell } from "../components/ClientShell";

export const metadata: Metadata = {
  title: "Lapiez Garhwa | Genuine Laptops, Computers & CCTV Deals",
  description: "Official Lapiez technology showroom in Garhwa, Jharkhand. Deals in 100% genuine laptops (HP, Dell, Lenovo, ASUS), custom PC rigs, CP-PLUS & Hikvision CCTV systems, printers, SSDs & original spare parts with 18% GST invoice & same-day delivery.",
  keywords: [
    "Lapiez Garhwa",
    "Lapiez Chiniya Road",
    "laptop shop in garhwa",
    "second hand laptop garhwa",
    "cctv camera garhwa",
    "computer repair garhwa",
    "cp plus cctv garhwa",
    "custom gaming pc garhwa",
    "lapiez computer solutions",
    "Jharkhand laptop store"
  ],
  authors: [{ name: "Lapiez Garhwa" }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
  openGraph: {
    title: "Lapiez Garhwa | Best Deals on Laptops, Desktops & CCTV",
    description: "100% Original Products, 18% GST Invoicing, Direct Brand Warranty & Showroom Counter in Garhwa.",
    url: "https://www.lapiez.in",
    siteName: "Lapiez",
    locale: "en_IN",
    type: "website",
  }
};


const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${plusJakartaSans.variable} ${inter.variable}`}>
      <head>
        </head>
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col bg-[#F1F3F6] text-[#111827]`}>
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
