import type { Metadata } from "next";
import "./globals.css";
import { ClientShell } from "../components/ClientShell";

export const metadata: Metadata = {
  title: "Lappy Solution Garhwa | Genuine Laptops, Computers & CCTV Deals",
  description: "Official technology showroom in Garhwa, Jharkhand. Deals in 100% genuine laptops (HP, Dell, Lenovo, ASUS), custom PC rigs, CP-PLUS & Hikvision CCTV systems, printers, SSDs & original spare parts with 18% GST invoice & same-day delivery.",
  keywords: [
    "Lappy Solution Garhwa",
    "laptop shop in garhwa",
    "second hand laptop garhwa",
    "cctv camera garhwa",
    "computer repair garhwa",
    "cp plus cctv garhwa",
    "custom gaming pc garhwa",
    "lappy solution chiniya road",
    "Jharkhand laptop store"
  ],
  authors: [{ name: "Lappy Solution Garhwa" }],
  openGraph: {
    title: "Lappy Solution Garhwa | Best Deals on Laptops, Desktops & CCTV",
    description: "100% Original Products, 18% GST Invoicing, Direct Brand Warranty & Showroom Counter in Garhwa.",
    url: "https://www.lappysolution.com",
    siteName: "Lappy Solution",
    locale: "en_IN",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F1F3F6] text-[#111827]">
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
