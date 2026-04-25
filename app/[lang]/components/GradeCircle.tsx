import type { BoulderColor } from "@/lib/types/boulder";
import { BOULDER_COLOR_HEX } from "@/lib/types/boulder";

type Props = {
  grade: string;
  color: BoulderColor;
};

export default function GradeCircle({ grade, color }: Props) {
  const bg = BOULDER_COLOR_HEX[color];
  const textColor = color === "white" || color === "yellow" ? "#1c1917" : "#ffffff";

  return (
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold"
      style={{ backgroundColor: bg, color: textColor }}
      aria-label={`Grade ${grade}, ${color} route`}
    >
      <span className="text-xs leading-none">{grade || "?"}</span>
    </div>
  );
}
