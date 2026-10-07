'use client';

import React, { useMemo, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Printer, ArrowLeft, Download, ShieldCheck, 
  CheckCircle2, Building2, Phone, Mail, Globe, 
  MapPin, QrCode, FileText, Share2, Copy
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { 
  DEFAULT_INVOICE_SETTINGS, 
  buildInvoiceFromOrder, 
  Invoice 
} from '../../../lib/invoiceUtils';

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = (params?.id as string) || '';

  const { 
    invoices, 
    orders, 
    invoiceSettings, 
    siteSettings,
    showToast 
  } = useStore();

  const printAreaRef = useRef<HTMLDivElement>(null);

  // Find invoice by ID, Invoice Number, or Order ID
  const invoice: Invoice = useMemo(() => {
    // 1. Match from existing invoices
    const decodedId = decodeURIComponent(invoiceId);
    const existing = invoices.find(
      (inv) => inv.id === decodedId || 
               inv.invoiceNumber === decodedId || 
               inv.invoiceNumber.replace(/\//g, '-') === decodedId ||
               inv.orderId === decodedId
    );
    if (existing) return existing;

    // 2. Match from orders if invoice not yet indexed
    const matchedOrder = orders.find(
      (o) => o.orderId === decodedId || o.id === decodedId
    );
    if (matchedOrder) {
      return buildInvoiceFromOrder({
        order: matchedOrder,
        settings: invoiceSettings || DEFAULT_INVOICE_SETTINGS
      });
    }

    // 3. Fallback demo invoice
    return buildInvoiceFromOrder({
      order: {
        orderId: decodedId || 'LS-10248',
        customerName: 'Rahul Kumar',
        phone: '+91 94311 28941',
        email: 'rahul.kumar@gmail.com',
        address: 'Near Old Bus Stand, Chiniya Road, Garhwa, Jharkhand - 822114',
        paymentMethod: 'UPI / Counter Settle',
        paymentStatus: 'Paid',
        totalAmount: 52999,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        items: [
          {
            id: 'demo-1',
            name: 'HP 15s Intel Core i5 12th Gen (16GB RAM / 512GB NVMe SSD / 15.6" FHD)',
            category: 'Laptops',
            price: 52999,
            quantity: 1,
            sku: 'LS-HP-15S-12TH'
          }
        ]
      },
      settings: invoiceSettings || DEFAULT_INVOICE_SETTINGS
    });
  }, [invoiceId, invoices, orders, invoiceSettings]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Invoice link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] py-4 sm:py-8 print:p-0 print:bg-white text-gray-800">
      
      {/* 1. TOP ACTION TOOLBAR (Hidden when Printing) */}
      <div className="max-w-4xl mx-auto px-4 mb-4 sm:mb-6 print:hidden">
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => router.back()}
              className="h-9 px-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <Link
              href="/account"
              className="h-9 px-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>My Orders</span>
            </Link>

            <span className="text-xs text-gray-400 font-mono hidden sm:inline">|</span>
            <span className="text-xs text-gray-500 font-bold hidden sm:inline">
              Tax Invoice #{invoice.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="h-9 px-3.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Copy shareable invoice link"
            >
              <Share2 className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handlePrint}
              className="h-9 px-4 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 flex-1 sm:flex-none justify-center"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. A4 PRINT-READY INVOICE CONTAINER */}
      <div 
        ref={printAreaRef}
        className="max-w-4xl mx-auto bg-white border border-gray-200 print:border-none shadow-md print:shadow-none rounded-2xl print:rounded-none p-6 sm:p-10 font-sans"
        style={{
          boxSizing: 'border-box'
        }}
      >
        
        {/* HEADER: Business Info & Title */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-5 border-b-2 border-gray-800">
          <div className="space-y-1 max-w-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#1A56DB] text-white font-extrabold flex items-center justify-center text-sm shadow-xs print:border print:border-black">
                LS
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 leading-tight">
                  {invoice.sellerName || siteSettings?.siteName || 'Lappy Solution'}
                </h1>
                <p className="text-[11px] font-semibold text-gray-500">
                  {invoiceSettings?.tagline || 'Technology • Security • Complete Hardware Solutions'}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed pt-1">
              {invoice.sellerAddress}
            </p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 pt-0.5">
              <span><strong>Phone:</strong> {invoice.sellerPhone}</span>
              <span><strong>Email:</strong> {invoice.sellerEmail}</span>
            </div>

            {invoiceSettings?.showGstin && (
              <div className="flex flex-wrap items-center gap-x-4 text-xs font-bold text-gray-900 pt-0.5">
                <span className="text-[#1A56DB] bg-blue-50 print:bg-transparent print:text-black px-1.5 py-0.5 rounded border border-blue-200 print:border-none">
                  GSTIN: {invoice.sellerGstin}
                </span>
                <span>PAN: {invoice.sellerPan}</span>
              </div>
            )}
          </div>

          <div className="sm:text-right space-y-1.5 min-w-[200px]">
            <div className="inline-block px-3 py-1 bg-gray-900 text-white font-extrabold text-xs tracking-wider uppercase rounded print:border print:border-black">
              TAX INVOICE
            </div>
            <div className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
              ORIGINAL FOR RECIPIENT
            </div>

            <div className="text-xs space-y-0.5 pt-1">
              <div>
                <span className="text-gray-500">Invoice No: </span>
                <strong className="text-gray-900 font-mono text-[13px]">{invoice.invoiceNumber}</strong>
              </div>
              <div>
                <span className="text-gray-500">Date: </span>
                <strong className="text-gray-900">{invoice.date}</strong>
              </div>
              {invoice.orderId && (
                <div>
                  <span className="text-gray-500">Order Ref: </span>
                  <strong className="text-gray-900 font-mono">#{invoice.orderId}</strong>
                </div>
              )}
              <div>
                <span className="text-gray-500">Place of Supply: </span>
                <strong className="text-gray-900">{invoice.placeOfSupply}</strong>
              </div>
              <div>
                <span className="text-gray-500">Reverse Charge: </span>
                <strong className="text-gray-900">{invoice.reverseCharge}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* BUYER & CONSIGNEE DETAILS (BILL TO / SHIP TO) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-gray-200 text-xs">
          
          {/* Bill To */}
          <div className="bg-gray-50 print:bg-transparent p-3.5 rounded-lg border border-gray-200 print:border-gray-300 space-y-1">
            <span className="font-extrabold uppercase tracking-wider text-gray-500 text-[10px] block">
              BILLED TO (BUYER DETAILS)
            </span>
            <div className="text-sm font-bold text-gray-900">
              {invoice.buyerName}
            </div>
            <div className="text-gray-600">
              Phone: <strong>{invoice.buyerPhone}</strong>
            </div>
            {invoice.buyerEmail && (
              <div className="text-gray-600 truncate">
                Email: {invoice.buyerEmail}
              </div>
            )}
            <div className="text-gray-700 leading-snug">
              Address: {invoice.buyerAddress}
            </div>
            <div className="text-gray-600">
              State: <strong>{invoice.buyerState} (Code: {invoice.buyerStateCode})</strong>
            </div>
            {invoice.buyerGstin && (
              <div className="text-xs font-bold text-blue-800 pt-0.5">
                Buyer GSTIN: {invoice.buyerGstin}
              </div>
            )}
          </div>

          {/* Ship To / Settlement */}
          <div className="bg-gray-50 print:bg-transparent p-3.5 rounded-lg border border-gray-200 print:border-gray-300 space-y-1">
            <span className="font-extrabold uppercase tracking-wider text-gray-500 text-[10px] block">
              SHIPPED TO & PAYMENT SETTLEMENT
            </span>
            <div className="text-sm font-bold text-gray-900">
              {invoice.buyerName}
            </div>
            <div className="text-gray-700 leading-snug">
              Delivery Destination: {invoice.buyerAddress}
            </div>
            <div className="pt-1 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Mode:</span>
                <strong className="text-gray-900">{invoice.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status:</span>
                <span className={`font-bold px-1.5 py-0.2 rounded text-[10.5px] ${
                  invoice.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {invoice.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dispatch Hub:</span>
                <strong className="text-gray-900">Chiniya Road Showroom, Garhwa</strong>
              </div>
            </div>
          </div>

        </div>

        {/* ITEMS TABLE (CBIC Rule 46 Compliant) */}
        <div className="py-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 print:bg-gray-200 text-gray-800 font-extrabold uppercase text-[10.5px] border-y border-gray-300">
                  <th className="py-2.5 px-2 text-center w-8">#</th>
                  <th className="py-2.5 px-3">Description of Goods</th>
                  <th className="py-2.5 px-2 text-center">HSN/SAC</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2.5 text-right">Unit Rate</th>
                  <th className="py-2.5 px-2 text-right">Discount</th>
                  <th className="py-2.5 px-2.5 text-right">Taxable Val</th>
                  <th className="py-2.5 px-2 text-center">GST %</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-gray-50/50 print:hover:bg-transparent">
                    <td className="py-3 px-2 text-center text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-900 leading-snug">
                        {item.productName}
                      </div>
                      {item.sku && (
                        <div className="text-[10px] text-gray-400 font-mono">
                          SKU: {item.sku}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-gray-700">
                      {item.hsn}
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-gray-900">
                      {item.quantity} {item.unit || 'PCS'}
                    </td>
                    <td className="py-3 px-2.5 text-right text-gray-700 font-mono">
                      ₹{item.unitPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-500 font-mono">
                      {item.discount > 0 ? `₹${item.discount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-3 px-2.5 text-right font-bold text-gray-900 font-mono">
                      ₹{item.taxableValue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-gray-700">
                      {item.gstRate}%
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-gray-900 font-mono">
                      ₹{item.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TAX SUMMARY & GRAND TOTAL CALCULATION */}
        <div className="pt-2 pb-4 border-t-2 border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* Amount in words & Bank info (span 7) */}
            <div className="sm:col-span-7 space-y-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block mb-0.5">
                  Invoice Amount in Words:
                </span>
                <div className="text-xs font-extrabold text-gray-900 bg-gray-50 print:bg-transparent p-2.5 rounded border border-gray-200 italic">
                  {invoice.amountInWords}
                </div>
              </div>

              {/* Dynamic UPI Payment QR + Bank Details */}
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/70 print:bg-transparent flex flex-col sm:flex-row items-center gap-3">
                {invoiceSettings?.showUpiQr && invoice.upiQrData && (
                  <div className="flex-shrink-0 text-center">
                    <img 
                      src={invoice.upiQrData} 
                      alt="UPI Payment QR Code" 
                      className="w-24 h-24 rounded border border-gray-300 bg-white p-1 mx-auto"
                    />
                    <span className="text-[9px] font-extrabold text-gray-500 block mt-0.5 uppercase tracking-wider">
                      Scan to Pay ₹{invoice.grandTotal}
                    </span>
                  </div>
                )}

                <div className="text-[11px] space-y-0.5 text-gray-700 min-w-0">
                  <div className="font-extrabold text-gray-900 text-xs flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#1A56DB]" />
                    <span>Bank & UPI Settlement Details</span>
                  </div>
                  <div><strong>UPI VPA:</strong> <span className="font-mono text-blue-700">{invoice.upiId}</span></div>
                  <div><strong>Bank:</strong> {invoiceSettings?.bankName || 'State Bank of India'}</div>
                  <div><strong>A/C No:</strong> <span className="font-mono">{invoiceSettings?.accountNumber || '38947291048'}</span></div>
                  <div><strong>IFSC Code:</strong> <span className="font-mono">{invoiceSettings?.ifscCode || 'SBIN0000080'}</span> ({invoiceSettings?.branch || 'Garhwa'})</div>
                </div>
              </div>

            </div>

            {/* Calculations breakdown (span 5) */}
            <div className="sm:col-span-5 bg-gray-50 print:bg-transparent p-3.5 rounded-lg border border-gray-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (Gross):</span>
                <span className="font-mono">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {invoice.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Special Discount:</span>
                  <span className="font-mono">-₹{invoice.discountTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-800 font-bold border-t border-gray-200 pt-1">
                <span>Taxable Value:</span>
                <span className="font-mono">₹{invoice.taxableAmount.toLocaleString('en-IN')}</span>
              </div>

              {invoice.cgstTotal > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>CGST (9%):</span>
                  <span className="font-mono">₹{invoice.cgstTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              {invoice.sgstTotal > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>SGST (9%):</span>
                  <span className="font-mono">₹{invoice.sgstTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              {invoice.igstTotal > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>IGST (18%):</span>
                  <span className="font-mono">₹{invoice.igstTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery / Shipping:</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>

              {invoice.roundOff !== 0 && (
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Round Off:</span>
                  <span className="font-mono">{invoice.roundOff > 0 ? `+₹${invoice.roundOff}` : `-₹${Math.abs(invoice.roundOff)}`}</span>
                </div>
              )}

              <div className="flex justify-between items-center border-t-2 border-gray-900 pt-2 text-base font-black text-gray-900">
                <span>Grand Total:</span>
                <span className="text-[#1A56DB] print:text-black font-mono text-lg">
                  ₹{invoice.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[10px] text-right text-gray-500">
                (Inclusive of all applicable GST)
              </div>
            </div>

          </div>
        </div>

        {/* TERMS & SIGNATURE FOOTER */}
        <div className="pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end text-xs">
          
          <div className="sm:col-span-8 space-y-1.5 text-gray-600">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block">
              TERMS & CONDITIONS:
            </span>
            <ol className="list-decimal pl-4 space-y-0.5 text-[11px] leading-relaxed text-gray-600">
              {(invoice.terms || DEFAULT_INVOICE_SETTINGS.termsAndConditions).map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ol>
            <p className="text-[10px] text-gray-400 italic pt-1">
              {invoice.declaration}
            </p>
          </div>

          <div className="sm:col-span-4 text-center sm:text-right space-y-2 pt-4 sm:pt-0">
            <div className="h-14 flex items-end justify-center sm:justify-end">
              <div className="border-b-2 border-gray-400 w-44 pb-1 text-center font-serif italic text-gray-700 font-bold text-sm">
                Rupesh Kumar
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="font-extrabold text-gray-900 text-[11.5px]">
                For LAPPY SOLUTION
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                {invoice.signatoryTitle || 'Authorized Signatory'}
              </div>
            </div>
          </div>

        </div>

        {/* SYSTEM GENERATED AUDIT STAMP */}
        <div className="mt-6 pt-3 border-t border-gray-200 text-center text-[10px] text-gray-400">
          This is a computer generated legal tax invoice under Rule 46 of CGST Rules 2017. Original brand manufacturer warranty honored across India.
        </div>

      </div>

      {/* PRINT CSS STYLES INJECTION */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 12pt;
          }
          nav, footer, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
