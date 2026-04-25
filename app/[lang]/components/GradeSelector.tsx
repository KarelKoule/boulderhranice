"use client";

import { useState } from "react";
import type { Grade } from "@/lib/types/grade";
import { GRADES } from "@/lib/types/grade";
import { gradeBoulderAction } from "../actions/gradeBoulder";

type Props = {
  boulderId: string;
  initialGrade: Grade | null;
  loginToGradeLabel: string;
  suggestGradeLabel: string;
  isAuthenticated: boolean;
};

export default function GradeSelector({
  boulderId,
  initialGrade,
  loginToGradeLabel,
  suggestGradeLabel,
  isAuthenticated,
}: Props) {
  const [selected, setSelected] = useState<Grade | null>(initialGrade);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return <span className="text-sm text-stone-500">{loginToGradeLabel}</span>;
  }

  async function handleChange(grade: Grade) {
    setSubmitting(true);
    setSelected(grade);
    try {
      await gradeBoulderAction(boulderId, grade);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-stone-500">{suggestGradeLabel}:</span>
      <select
        value={selected ?? ""}
        onChange={(e) => handleChange(e.target.value as Grade)}
        disabled={submitting}
        className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm text-stone-300 disabled:opacity-50"
      >
        <option value="" disabled>
          —
        </option>
        {GRADES.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
    </div>
  );
}
