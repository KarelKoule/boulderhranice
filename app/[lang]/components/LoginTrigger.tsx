"use client";

import { useState } from "react";
import LoginDialog from "./LoginDialog";
import type { Dictionary } from "@/lib/getDictionary";

type Props = {
  label: string;
  authDict: Dictionary["auth"];
};

export default function LoginTrigger({ label, authDict }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        {label}
      </button>
      <LoginDialog open={open} onClose={() => setOpen(false)} dict={authDict} />
    </>
  );
}
