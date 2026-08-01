"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BookingModal } from "@/components/booking-modal";

type DbService = {
  id: string;
  name: string;
  price: string;
  duration: number;
  category_id: string | null;
  categories?: { name: string | null };
};

type BookingContextValue = {
  open: (service?: DbService | null) => void;
  close: () => void;
  isOpen: boolean;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetService, setPresetService] = useState<DbService | null>(null);

  const open = useCallback((service?: DbService | null) => {
    setPresetService(service ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingModal presetService={presetService} isOpen={isOpen} onClose={close} />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
