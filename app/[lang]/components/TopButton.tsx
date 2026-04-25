"use client";

import { useState } from "react";
import { topBoulderAction } from "../actions/topBoulder";

type Props = {
  boulderId: string;
  initialTopped: boolean;
  toppedLabel: string;
  topLabel: string;
  loginToTopLabel: string;
  isAuthenticated: boolean;
};

export default function TopButton({
  boulderId,
  initialTopped,
  toppedLabel,
  topLabel,
  loginToTopLabel,
  isAuthenticated,
}: Props) {
  const [topped, setTopped] = useState(initialTopped);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return <span className="text-sm text-stone-500">{loginToTopLabel}</span>;
  }

  async function handleClick() {
    const next = !topped;
    setTopped(next);
    setSubmitting(true);
    try {
      await topBoulderAction(boulderId, next);
    } catch {
      setTopped(!next);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={submitting}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50 ${
        topped
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-white/10 bg-white/5 text-stone-400 hover:text-white"
      }`}
    >
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`h-4 w-4 ${topped ? "text-accent" : "text-stone-500"}`}
      >
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
          clipRule="evenodd"
        />
      </svg>
      {topped ? toppedLabel : topLabel}
    </button>
  );
}
