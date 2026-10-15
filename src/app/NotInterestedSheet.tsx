"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function formatCard(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function detectBrand(card: string): string | null {
  if (card.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(card) || /^2[2-7]/.test(card)) return "Mastercard";
  if (/^3[47]/.test(card)) return "Amex";
  if (/^35/.test(card)) return "JCB";
  if (/^6/.test(card)) return "Discover";
  return null;
}

function CardBrands(): React.JSX.Element {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <span className="text-sm font-black italic tracking-tight text-[#1a1f71]">
        VISA
      </span>
      <span className="relative inline-flex h-5 w-7">
        <span className="absolute left-0 h-5 w-5 rounded-full bg-[#eb001b]" />
        <span className="absolute right-0 h-5 w-5 rounded-full bg-[#f79e1b] mix-blend-multiply" />
      </span>
      <span className="rounded-sm bg-[#2e77bb] px-1 py-0.5 text-[8px] font-bold leading-none text-white">
        AMEX
      </span>
      <span className="rounded-sm bg-[#0b4ea2] px-1 py-0.5 text-[9px] font-bold leading-none text-white">
        JCB
      </span>
      <span className="rounded-sm border border-stone-300 px-1 py-0.5 text-[8px] font-bold leading-none text-[#f76f20]">
        DISCOVER
      </span>
    </div>
  );
}

function InfoIcon(): React.JSX.Element {
  return (
    <span
      aria-hidden
      className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-stone-700 text-[10px] font-semibold leading-none"
    >
      i
    </span>
  );
}

const inputClass =
  "mt-1 w-full border border-stone-400 bg-white px-3 py-3 text-base outline-none focus:border-black focus:ring-1 focus:ring-black";

export default function NotInterestedSheet(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [joke, setJoke] = useState(false);

  const brand = detectBrand(card.replace(/\s/g, ""));

  function close(): void {
    setOpen(false);
  }

  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Joke sheet: nothing is sent anywhere, card details are never stored.
  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    setCard("");
    setExpiry("");
    setCvv("");
    setJoke(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setJoke(false);
          setOpen(true);
        }}
        className="flex-1 whitespace-nowrap rounded-full border border-stone-300 px-4 py-3 sm:px-6 font-semibold text-stone-600 transition hover:bg-stone-100"
      >
        Not Interested
      </button>

      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirm your decision"
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-full max-w-md flex-col rounded-t-2xl bg-white text-left text-black shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "invisible translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="relative flex shrink-0 items-center justify-center border-b border-stone-200 px-4 py-4">
          <button
            type="button"
            onClick={close}
            aria-label="Back"
            className="absolute left-4 text-2xl leading-none"
          >
            ‹
          </button>
          <h2 className="text-sm font-bold uppercase tracking-wide">
            Confirm your decision
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {joke ? (
          <div className="overflow-y-auto px-6 py-10 text-center">
            <div className="text-6xl" aria-hidden>
              😂
            </div>
            <h3 className="mt-4 text-2xl font-bold">Just kidding!</h3>
            <p className="mt-2 text-stone-600">
              Nothing was charged and nothing was saved. But seriously...
              coffee?
            </p>
            <Link
              href="/pick"
              className="mt-8 block bg-black px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-stone-800"
            >
              Okay fine, I&apos;m in ☕
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {/* 1. Order */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg">
                    1. Decision{" "}
                    <span className="text-red-600" aria-hidden>
                      ✓
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-stone-600">
                    Not Interested™ Lifetime Plan
                  </p>
                </div>
                <p className="text-lg font-bold">₱200,000</p>
              </div>

              <hr className="my-5 border-stone-200" />

              {/* 2. Payment option */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg">
                  2. Payment option{" "}
                  <span className="text-red-600" aria-hidden>
                    ✓
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={close}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Change
                </button>
              </div>

              <hr className="my-5 border-stone-200" />

              <h4 className="text-base font-medium">Add a credit card</h4>
              <div className="mt-3 flex items-center justify-between">
                <CardBrands />
                <InfoIcon />
              </div>

              <p className="mt-4 text-right text-xs text-stone-600">
                Required *
              </p>

              <label className="block text-sm" htmlFor="card">
                Credit card number <span aria-hidden>*</span>
              </label>
              <input
                id="card"
                inputMode="numeric"
                autoComplete="off"
                value={card}
                onChange={(e) => setCard(formatCard(e.target.value))}
                required
                minLength={19}
                className={`${inputClass} font-mono tracking-wider`}
              />

              {brand && (
                <p className="mt-4 text-sm font-semibold italic text-[#1a1f71]">
                  {brand}
                </p>
              )}

              <label
                className={`block text-sm ${brand ? "mt-1" : "mt-4"}`}
                htmlFor="expiry"
              >
                Expiration date <span aria-hidden>*</span>
              </label>
              <input
                id="expiry"
                inputMode="numeric"
                autoComplete="off"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                required
                minLength={5}
                className={inputClass}
              />

              <label className="mt-4 block text-sm" htmlFor="cvv">
                Security code <span aria-hidden>*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="cvv"
                  inputMode="numeric"
                  autoComplete="off"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  required
                  minLength={3}
                  className={`${inputClass} w-28`}
                />
                <div className="flex items-center gap-3" aria-hidden>
                  <span className="relative h-7 w-10 rounded-sm border border-stone-400 bg-stone-100">
                    <span className="absolute inset-x-0 top-1.5 h-1.5 bg-stone-400" />
                    <span className="absolute bottom-1 right-1 h-2 w-3 rounded-sm border border-red-500" />
                  </span>
                  <span className="relative h-7 w-10 rounded-sm bg-teal-600/80">
                    <span className="absolute bottom-1 right-1 h-2 w-3 rounded-sm border border-red-500" />
                  </span>
                  <InfoIcon />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-stone-200 px-5 pt-4">
              <p className="text-xs leading-relaxed text-stone-700">
                Please only click submit once to avoid being charged ₱200,000
                twice. (Don&apos;t worry, this is all a joke. Nothing is sent or
                saved.)
              </p>
            </div>
            <button
              type="submit"
              className="mt-4 w-full shrink-0 bg-black px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-stone-800"
            >
              Pay (₱200,000) &amp; Proceed
            </button>
          </form>
        )}
      </div>
    </>
  );
}
