"use client";

import { useState } from "react";
import type { Stars } from "@/lib/types/rating";
import { rateBoulderAction } from "../actions/rateBoulder";

type Props = {
  boulderId: string;
  initialStars: Stars | null;
  loginToRateLabel: string;
  isAuthenticated: boolean;
};

export default function StarRating({
  boulderId,
  initialStars,
  loginToRateLabel,
  isAuthenticated,
}: Props) {
  const [selected, setSelected] = useState(initialStars);
  const [hovered, setHovered] = useState<Stars | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return <span className="text-sm text-stone-500">{loginToRateLabel}</span>;
  }

  async function handleRate(stars: Stars) {
    setSubmitting(true);
    setSelected(stars);

    try {
      await rateBoulderAction(boulderId, stars);
    } finally {
      setSubmitting(false);
    }
  }

  const display = hovered ?? selected ?? 0;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rate this boulder">
      {([1, 2, 3, 4, 5] as const).map((star) => (
        <button
          key={star}
          type="button"
          disabled={submitting}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="p-0.5 transition-transform hover:scale-110 disabled:opacity-50"
          role="radio"
          aria-checked={selected === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <svg
            className={`h-5 w-5 ${
              star <= display ? "text-accent" : "text-stone-600"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
