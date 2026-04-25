import type { Boulder } from "@/lib/types/boulder";
import type { Dictionary } from "@/lib/getDictionary";
import type { Stars } from "@/lib/types/rating";
import type { Grade, GradeDistribution } from "@/lib/types/grade";
import BoulderList from "./BoulderList";

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

export default function BouldersSection({
  boulders,
  dict,
  userRatings,
  gradeDistributions,
  userGrades,
  userAscents,
  ascentCounts,
  isAuthenticated,
}: Props) {
  return (
    <section id="boulders" className="bg-stone-950 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {dict.title}
          </h2>
          <p className="mt-2 text-lg text-stone-400">{dict.subtitle}</p>
        </div>
        <div className="mt-12">
          <BoulderList
            boulders={boulders}
            dict={dict}
            userRatings={userRatings}
            gradeDistributions={gradeDistributions}
            userGrades={userGrades}
            userAscents={userAscents}
            ascentCounts={ascentCounts}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </section>
  );
}
