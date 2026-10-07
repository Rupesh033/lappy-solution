'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../context/StoreContext';

export const CheckoutModal: React.FC = () => {
  const router = useRouter();
  const { isCheckoutOpen, setIsCheckoutOpen } = useStore();

  useEffect(() => {
    if (isCheckoutOpen) {
      setIsCheckoutOpen(false);
      router.push('/checkout');
    }
  }, [isCheckoutOpen, router, setIsCheckoutOpen]);

  return null;
};
