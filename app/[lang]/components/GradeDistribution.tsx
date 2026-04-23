import type { GradeDistribution as Distribution } from "@/lib/types/grade";

type Props = {
  distribution: Distribution;
};

export default function GradeDistribution({ distribution }: Props) {
  const entries = Object.entries(distribution).sort(
    ([a], [b]) => gradeOrder(a) - gradeOrder(b),
  );

  if (entries.length === 0) return null;

  const maxCount = Math.max(...entries.map(([, count]) => count));

  return (
    <div className="flex flex-col gap-1">
      {entries.map(([grade, count]) => (
        <div key={grade} className="flex items-center gap-2">
          <span className="w-8 text-right text-xs text-stone-400">{grade}</span>
          <div className="flex-1">
            <div
              className="h-4 rounded-sm bg-accent/70"
              style={{ width: `${(count / maxCount) * 100}%` }}
            />
          </div>
          <span className="w-4 text-xs text-stone-500">{count}</span>
        </div>
      ))}
    </div>
  );
}

function gradeOrder(grade: string): number {
  const order = [
    "3A", "3B", "3C",
    "4A", "4B", "4C",
    "5A", "5B", "5C",
    "6A", "6A+", "6B", "6B+", "6C", "6C+",
    "7A", "7A+", "7B", "7B+", "7C", "7C+",
    "8A",
  ];
  const idx = order.indexOf(grade);
  return idx === -1 ? 999 : idx;
}
