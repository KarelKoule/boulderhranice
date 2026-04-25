import type { Boulder } from "@/lib/types/boulder";
import type { Dictionary } from "@/lib/getDictionary";
import type { Stars } from "@/lib/types/rating";
import type { Grade, GradeDistribution as GradeDistributionType } from "@/lib/types/grade";
import GradeCircle from "./GradeCircle";
import StarDisplay from "./StarDisplay";
import StarRating from "./StarRating";
import GradeDistribution from "./GradeDistribution";
import GradeSelector from "./GradeSelector";
import TopButton from "./TopButton";

type Props = {
  boulder: Boulder;
  dict: Dictionary["boulders"];
  userStars: Stars | null;
  gradeDistribution: GradeDistributionType;
  userGrade: Grade | null;
  isAuthenticated: boolean;
  topped: boolean;
  ascentCount: number;
};

export default function BoulderCard({
  boulder,
  dict,
  userStars,
  gradeDistribution,
  userGrade,
  isAuthenticated,
  topped,
  ascentCount,
}: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-accent/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <GradeCircle grade={boulder.grade} color={boulder.color} />
          <h3 className="text-lg font-semibold text-white">#{boulder.name}</h3>
        </div>
        <div className="text-right">
          <StarDisplay
            rating={boulder.averageRating}
            count={boulder.ratingCount}
            noRatingLabel={dict.noRating}
          />
          {ascentCount > 0 && (
            <p className="mt-1 text-sm text-stone-500">
              {dict.toppedCount.replace("{count}", String(ascentCount))}
            </p>
          )}
        </div>
      </div>
      {boulder.description && (
        <p className="mt-3 text-sm text-stone-400">{boulder.description}</p>
      )}
      <div className="mt-4">
        <GradeDistribution distribution={gradeDistribution} />
      </div>
      <div className="mt-3">
        <GradeSelector
          boulderId={boulder.id}
          initialGrade={userGrade}
          suggestGradeLabel={dict.suggestGrade}
          loginToGradeLabel={dict.loginToGrade}
          isAuthenticated={isAuthenticated}
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-stone-500">{dict.rating}:</span>
        <StarRating
          boulderId={boulder.id}
          initialStars={userStars}
          loginToRateLabel={dict.loginToRate}
          isAuthenticated={isAuthenticated}
        />
      </div>
      <div className="mt-3">
        <TopButton
          boulderId={boulder.id}
          initialTopped={topped}
          toppedLabel={dict.topped}
          topLabel={dict.top}
          loginToTopLabel={dict.loginToTop}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}
