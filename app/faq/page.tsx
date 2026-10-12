import React from 'react';
import type { Metadata } from 'next';
import { FaqSection } from '@/components/FaqSection';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | Lapiez Garhwa Showroom',
  description: 'Common questions about warranty, certified refurbished laptops, 18% GST invoices, same-day delivery, and showroom services at Lapiez Garhwa.',
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0A1633] text-white py-12 px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Helpdesk & Frequently Asked Questions
        </h1>
        <p className="text-sm text-blue-200 mt-2 max-w-xl mx-auto">
          Clear answers about laptop warranty, 18% GST input credit bills, certified refurbished testing, and same-day delivery in Garhwa & Palamu.
        </p>
      </div>

      <FaqSection />
    </div>
  );
}
