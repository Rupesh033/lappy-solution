'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, ArrowLeft, ShieldCheck, Printer, 
  MessageSquare, FileText, Calendar, Clock, Share2 
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { STORE_INFO } from '../../../data/storeData';

export default function DynamicCustomPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';
  const { customPages, siteSettings } = useStore();

  const page = useMemo(() => {
    return customPages.find((p) => p.slug === slug);
  }, [customPages, slug]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: page?.title || 'Lappy Solution',
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Page link copied to clipboard!');
    }
  };

  if (!page) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1A56DB] flex items-center justify-center mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-xs text-gray-500 max-w-md mb-6">
          The requested page &quot;{slug}&quot; could not be located in our system or might have been moved.
        </p>
        <Link
          href="/"
          className="h-10 px-5 rounded-lg bg-[#1A56DB] text-white font-bold text-xs inline-flex items-center gap-2 hover:bg-[#1E40AF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  // Parse markdown content simply for clean readability
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-lg sm:text-xl font-extrabold text-gray-900 mt-6 mb-2.5 pb-1 border-b border-gray-100 flex items-center gap-2">
            <span className="w-1.5 h-4.5 bg-[#1A56DB] rounded-full inline-block" />
            <span>{trimmed.replace(/^##\s+/, '')}</span>
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-sm sm:text-base font-bold text-gray-800 mt-4 mb-1.5">
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="text-xs sm:text-[13.5px] text-gray-600 ml-4 list-disc mb-1 leading-relaxed">
            {trimmed.replace(/^[\*\-]\s+/, '')}
          </li>
        );
      }
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-[13.5px] text-gray-700 leading-relaxed mb-2.5">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-5">
          <Link href="/" className="hover:text-[#1A56DB] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-400">Pages</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-gray-800 truncate">{page.title}</span>
        </nav>

        {/* Main Content Card */}
        <article className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs p-6 sm:p-10 space-y-6">
          
          {/* Header */}
          <div className="border-b border-gray-100 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#1A56DB] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100">
                Official Store Policy & Guide
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="h-8 px-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="h-8 px-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print Document</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {page.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-400 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Effective Date: 2026 Edition</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Verified Legal Document</span>
              </span>
            </div>
          </div>

          {/* Formatted Content */}
          <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
            {renderFormattedContent(page.content)}
          </div>

          {/* Help & Support Banner */}
          <div className="mt-8 pt-6 border-t border-gray-100 bg-[#F1F5F9]/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Have questions about this policy?</h4>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Our counter desk at Chiniya Road, Garhwa is happy to assist you with GST claims and warranty.
              </p>
            </div>
            <a
              href={`https://wa.me/${siteSettings?.whatsapp || STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hello Lappy Solution, I have an inquiry regarding: ${page.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-4 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors shadow-2xs whitespace-nowrap self-start sm:self-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Support</span>
            </a>
          </div>

        </article>

        {/* Back Link */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A56DB] hover:text-[#1E40AF]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>

      </div>
    </div>
  );
}
