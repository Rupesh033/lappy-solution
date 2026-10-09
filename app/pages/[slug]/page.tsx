'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, ArrowLeft, ShieldCheck, 
  MessageSquare, FileText, Calendar, Clock,
  AlertTriangle, Video, Banknote, Store, Phone, CheckCircle2, Lock
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

  if (!page) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1A56DB] flex items-center justify-center mb-4 border border-blue-100 shadow-xs">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Page Not Located</h1>
        <p className="text-xs text-gray-500 max-w-md mb-6 leading-relaxed">
          The requested page &quot;{slug}&quot; could not be located in our system or might have been updated.
        </p>
        <Link
          href="/"
          className="h-10 px-5 rounded-xl bg-[#1A56DB] text-white font-bold text-xs inline-flex items-center gap-2 hover:bg-[#1E40AF] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  // Parse inline markdown bold: **text** -> <strong>text</strong>
  const formatInlineText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // High-End Structured Content Renderer
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        elements.push(<div key={`space-${i}`} className="h-2" />);
        continue;
      }

      // H2 Headings
      if (trimmed.startsWith('## ')) {
        const titleText = trimmed.replace(/^##\s+/, '');
        const isAlertHeading = titleText.includes('No Return') || titleText.includes('Refund') || titleText.includes('No COD') || titleText.includes('Unboxing');
        
        elements.push(
          <div key={`h2-${i}`} className="mt-8 mb-4 pt-4 first:mt-2 first:pt-0 border-t border-gray-100 first:border-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className={`w-2 h-5 rounded-full ${isAlertHeading ? 'bg-rose-600' : 'bg-[#1A56DB]'}`} />
              <h2 className="text-lg sm:text-xl font-black text-gray-950 tracking-tight">
                {titleText}
              </h2>
            </div>
          </div>
        );
        continue;
      }

      // H3 Headings
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-sm sm:text-base font-bold text-gray-900 mt-5 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB]" />
            <span>{trimmed.replace(/^###\s+/, '')}</span>
          </h3>
        );
        continue;
      }

      // Bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const bulletText = trimmed.replace(/^[\*\-]\s+/, '');
        const isStrictRule = bulletText.includes('No Return') || bulletText.includes('Strictly') || bulletText.includes('Single-Take') || bulletText.includes('MUST') || bulletText.includes('Important Notice');

        elements.push(
          <div 
            key={`bullet-${i}`} 
            className={`my-2 p-3 sm:p-3.5 rounded-xl border text-xs sm:text-[13.5px] leading-relaxed transition-all ${
              isStrictRule 
                ? 'bg-rose-50/70 border-rose-200/80 text-rose-950 font-medium' 
                : 'bg-white border-gray-200/90 text-gray-700 shadow-2xs hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                isStrictRule ? 'bg-rose-200 text-rose-800' : 'bg-blue-100 text-[#1A56DB]'
              }`}>
                ✓
              </span>
              <div className="flex-1">
                {formatInlineText(bulletText)}
              </div>
            </div>
          </div>
        );
        continue;
      }

      // Regular Paragraphs
      elements.push(
        <p key={`p-${i}`} className="text-xs sm:text-[13.5px] text-gray-700 leading-relaxed mb-3">
          {formatInlineText(trimmed)}
        </p>
      );
    }

    return elements;
  };

  const isTermsOrPolicy = slug.includes('terms') || slug.includes('policy') || slug.includes('return') || slug.includes('warranty');

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link href="/" className="hover:text-[#1A56DB] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/pages/terms-and-conditions" className="hover:text-[#1A56DB] transition-colors">Store Policies</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-bold text-gray-900 truncate">{page.title}</span>
        </nav>

        {/* Main Clean Document Card */}
        <article className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm p-6 sm:p-10 space-y-6">
          
          {/* Header (Share and Print buttons removed as requested) */}
          <div className="border-b border-gray-100 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1A56DB] px-3 py-1 rounded-full bg-blue-50 border border-blue-100 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1A56DB]" />
                Official Garhwa Showroom Policy
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Active & Enforced
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              {page.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 mt-3 pt-3 border-t border-gray-50">
              <span className="flex items-center gap-1.5 font-medium">
                <Store className="w-3.5 h-3.5 text-blue-600" />
                <span>Showroom: Chiniya Road, Garhwa, Jharkhand (822114)</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>GSTIN: 20AABCL1234F1Z5</span>
              </span>
            </div>
          </div>

          {/* Quick Notice Highlight for Strict Policies */}
          {isTermsOrPolicy && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gradient-to-r from-rose-50/80 via-amber-50/60 to-blue-50/80 border border-rose-200/80 rounded-2xl text-xs">
              <div className="flex items-start gap-2.5 text-rose-950 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black">STRICT NO RETURN / NO REFUND</span>
                  <span className="font-normal text-rose-800 text-[11px]">All hardware sales are final. Zero return, exchange, or refund post-dispatch.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-blue-950 font-bold">
                <Video className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black">MANDATORY 360° UNBOXING VIDEO</span>
                  <span className="font-normal text-blue-800 text-[11px]">Uncut video required from outer seal opening for any damage claim.</span>
                </div>
              </div>
            </div>
          )}

          {/* Formatted Content */}
          <div className="text-gray-800 leading-relaxed space-y-1">
            {renderFormattedContent(page.content)}
          </div>

          {/* Direct WhatsApp Helpline Card */}
          <div className="mt-10 pt-6 border-t border-gray-100 bg-[#F8FAFC] border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                  Need Help or Have Questions About Your Order?
                </h4>
              </div>
              <p className="text-[11.5px] sm:text-xs text-gray-500 leading-relaxed max-w-lg">
                For transit queries, unboxing video submissions, or warranty support, contact our Garhwa showroom team directly on WhatsApp.
              </p>
            </div>
            
            <div className="flex items-center gap-2.5 flex-wrap">
              <a
                href={`https://wa.me/${siteSettings?.whatsapp || STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hello Lapiez Garhwa, I have an inquiry regarding: ${page.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm whitespace-nowrap cursor-pointer active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Helpline</span>
              </a>

              <a
                href={`tel:${siteSettings?.phone || STORE_INFO.phone}`}
                className="h-10 px-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors border border-gray-200 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Showroom</span>
              </a>
            </div>
          </div>

        </article>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A56DB] hover:text-[#1E40AF] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>

      </div>
    </div>
  );
}
