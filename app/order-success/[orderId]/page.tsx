'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, Printer, MessageSquare, ArrowRight, ArrowLeft,
  MapPin, Phone, ShieldCheck, Store, Clock, Package, Navigation, Check
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { STORE_INFO } from '../../../data/storeData';

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const { orders } = useStore();

  // Find order from StoreContext or build fallback
  const order = orders.find(o => o.orderId === orderId) || (orders.length > 0 ? orders[0] : null);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    if (!order) return;
    const itemsList = order.items.map((it: any) => `• ${it.name} (Qty: ${it.quantity}) - ₹${(it.price * it.quantity).toLocaleString('en-IN')}`).join('\n');
    const waText = `Hello Lappy Solution Garhwa!\n\nI have placed order *#${order.orderId}* on your website.\n\n*Customer:* ${order.customerName} (${order.phone})\n*Delivery:* ${order.address}\n*Total Amount:* ₹${order.totalAmount.toLocaleString('en-IN')}\n*Payment Mode:* ${order.paymentMethod}${order.utrNumber ? `\n*UTR / Ref No:* ${order.utrNumber}` : ''}\n\n*Items Ordered:*\n${itemsList}\n\nPlease confirm availability and delivery dispatch schedule.`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(waText)}`, '_blank');
  };

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Order Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          We could not locate this order ID in your current session. Please verify your order number in your account portal.
        </p>
        <Link
          href="/account"
          className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors shadow-xs"
        >
          <span>View My Account & Orders</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] py-8 sm:py-12 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Success Header Banner */}
        <div className="rounded-3xl bg-white border border-emerald-200 p-6 sm:p-10 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto animate-in zoom-in duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-block mb-2">
              Payment & Order Successful
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Thank You, {order.customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
              Your order <strong className="text-slate-900 font-mono">#{order.orderId}</strong> has been received by our Garhwa showroom team. We are preparing your sealed pack products and warranty documentation.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleWhatsApp}
              className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Notify Store on WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="h-11 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* Live Tracking Progress Stepper */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Live Order Tracking Status
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Estimated Delivery: Today
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {order.trackingSteps?.map((step: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                  step.done ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                }`}>
                  {step.done ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>
                <strong className={`text-xs block font-bold leading-tight ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.step}
                </strong>
                <span className="text-[10px] text-slate-500 mt-1">{step.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice & Order Breakdown Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Reference</span>
              <h2 className="text-xl font-black text-slate-900 font-mono">#{order.orderId}</h2>
              <span className="text-xs text-slate-500">{order.orderDate}</span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Amount Billed</span>
              <span className="text-2xl font-black text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              <span className="text-xs font-semibold text-emerald-700 block">{order.paymentStatus}</span>
            </div>
          </div>

          {/* Delivery & Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <strong className="block text-slate-900 font-bold text-sm">Customer Details:</strong>
              <p className="text-slate-600">Name: <strong className="text-slate-900">{order.customerName}</strong></p>
              <p className="text-slate-600">Phone: <strong className="text-slate-900">{order.phone}</strong></p>
              <p className="text-slate-600">Email: <strong className="text-slate-900">{order.email}</strong></p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <strong className="block text-slate-900 font-bold text-sm">Delivery & Invoicing:</strong>
              <p className="text-slate-600">Address: <strong className="text-slate-900">{order.address}</strong></p>
              <p className="text-slate-600">Payment Mode: <strong className="text-slate-900">{order.paymentMethod}</strong></p>
              {order.utrNumber && (
                <p className="text-slate-600">UTR Reference: <strong className="text-blue-700 font-mono">{order.utrNumber}</strong></p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Purchased Items
            </h4>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
              {order.items.map((it: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-white flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={it.image} alt={it.name} className="w-12 h-12 object-contain rounded-xl border border-slate-100 p-1 flex-shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-slate-900 block truncate">{it.name}</span>
                      <span className="text-slate-500 font-mono text-[11px]">Quantity: {it.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 font-mono flex-shrink-0">
                    ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Showroom Direct Pick-up & Support Card */}
          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-blue-900">
            <div className="space-y-1">
              <strong className="block font-bold text-sm">Lappy Solution Showroom Help Desk</strong>
              <p className="text-slate-600">In front of G P Plaza, Chiniya Road, Garhwa, Jharkhand</p>
              <p className="text-slate-500 text-[11px]">Visiting Hours: 10:00 AM - 8:30 PM (Mon-Sat)</p>
            </div>
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Showroom</span>
            </a>
          </div>

        </div>

        {/* Return to Shop CTA */}
        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping for More Technology</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
