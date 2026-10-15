"use client";

import { useEffect, useRef } from "react";

const ITEM_H = 44; // px
const VISIBLE = 5; // odd number so one item sits in the centre
const PAD = Math.floor(VISIBLE / 2);
const COPIES = 5; // used when looping, so the list feels endless

interface WheelColumnProps {
  label: string;
  options: string[];
  index: number;
  onChange: (index: number) => void;
  loop?: boolean;
  className?: string;
}

/** Android-alarm-style scroll wheel built on CSS scroll snapping. */
export default function WheelColumn({
  label,
  options,
  index,
  onChange,
  loop = false,
  className = "",
}: WheelColumnProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const n = options.length;
  const copies = loop ? COPIES : 1;
  const startOffset = loop ? Math.floor(COPIES / 2) * n : 0;

  // Position the wheel on the initial value (once).
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = (startOffset + index) * ITEM_H;
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleScroll(): void {
    const el = ref.current;
    if (!el) return;

    const raw = Math.round(el.scrollTop / ITEM_H);
    const next = ((raw % n) + n) % n;
    if (next !== index) onChange(next);

    // When scrolling stops in loop mode, jump back to the middle copy.
    // Same visual position, so the jump is invisible.
    if (loop) {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        const current = ref.current;
        if (!current) return;
        const r = Math.round(current.scrollTop / ITEM_H);
        if (r < n || r >= (COPIES - 1) * n) {
          current.scrollTop = (startOffset + (((r % n) + n) % n)) * ITEM_H;
        }
      }, 150);
    }
  }

  function scrollToItem(k: number): void {
    ref.current?.scrollTo({ top: k * ITEM_H, behavior: "smooth" });
  }

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      ref.current?.scrollBy({
        top: e.key === "ArrowDown" ? ITEM_H : -ITEM_H,
        behavior: "smooth",
      });
    }
  }

  const items = Array.from({ length: n * copies }, (_, k) => k);

  return (
    <div
      className={`relative ${className}`}
      style={{ height: ITEM_H * VISIBLE }}
    >
      {/* Highlight band for the selected row */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 rounded-xl bg-orange-100"
        style={{ top: ITEM_H * PAD, height: ITEM_H }}
      />

      <div
        ref={ref}
        role="listbox"
        aria-label={label}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="no-scrollbar relative h-full snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
      >
        <div style={{ height: ITEM_H * PAD }} aria-hidden />
        {items.map((k) => {
          const selected = k % n === index;
          return (
            <div
              key={k}
              role="option"
              aria-selected={selected}
              onClick={() => scrollToItem(k)}
              className={`flex cursor-pointer snap-center items-center justify-center select-none transition-all ${
                selected
                  ? "text-3xl font-bold text-orange-600"
                  : "text-xl text-stone-400"
              }`}
              style={{ height: ITEM_H }}
            >
              {options[k % n]}
            </div>
          );
        })}
        <div style={{ height: ITEM_H * PAD }} aria-hidden />
      </div>

      {/* Fade top & bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent"
      />
    </div>
  );
}
