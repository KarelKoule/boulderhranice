import type { Boulder } from "@/lib/types/boulder";
import type { Dictionary } from "@/lib/getDictionary";
import type { Stars } from "@/lib/types/rating";
import type { Grade, GradeDistribution } from "@/lib/types/grade";
import BoulderCard from "./BoulderCard";

type Props = {
  boulders: Boulder[];
  dict: Dictionary["boulders"];
  userRatings: Record<string, Stars>;
  gradeDistributions: Record<string, GradeDistribution>;
  userGrades: Record<string, Grade>;
  userAscents: Set<string>;
  ascentCounts: Record<string, number>;
  isAuthenticated: boolean;
};

export default function BoulderList({
  boulders,
  dict,
  userRatings,
  gradeDistributions,
  userGrades,
  userAscents,
  ascentCounts,
  isAuthenticated,
}: Props) {
  if (boulders.length === 0) {
    return <p className="text-stone-500">{dict.noBoulders}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {boulders.map((boulder) => (
        <BoulderCard
          key={boulder.id}
          boulder={boulder}
          dict={dict}
          userStars={userRatings[boulder.id] ?? null}
          gradeDistribution={gradeDistributions[boulder.id] ?? {}}
          userGrade={userGrades[boulder.id] ?? null}
          topped={userAscents.has(boulder.id)}
          ascentCount={ascentCounts[boulder.id] ?? 0}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}
