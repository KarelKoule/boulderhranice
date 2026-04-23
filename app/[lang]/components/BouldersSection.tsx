import type { Boulder } from "@/lib/types/boulder";
import type { Dictionary } from "@/lib/getDictionary";
import type { UserProfile } from "@/lib/types/auth";
import type { Stars } from "@/lib/types/rating";
import type { Grade, GradeDistribution } from "@/lib/types/grade";
import BoulderList from "./BoulderList";
import LoginButton from "./LoginButton";

type Props = {
  boulders: Boulder[];
  dict: Dictionary["boulders"];
  authDict: Dictionary["auth"];
  userRatings: Record<string, Stars>;
  gradeDistributions: Record<string, GradeDistribution>;
  userGrades: Record<string, Grade>;
  user: UserProfile | null;
};

export default function BouldersSection({
  boulders,
  dict,
  authDict,
  userRatings,
  gradeDistributions,
  userGrades,
  user,
}: Props) {
  return (
    <section id="boulders" className="bg-stone-950 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {dict.title}
            </h2>
            <p className="mt-2 text-lg text-stone-400">{dict.subtitle}</p>
          </div>
          {!user && (
            <LoginButton
              provider="google"
              label={authDict.signInWithGoogle}
            />
          )}
        </div>
        <div className="mt-12">
          <BoulderList
            boulders={boulders}
            dict={dict}
            userRatings={userRatings}
            gradeDistributions={gradeDistributions}
            userGrades={userGrades}
            isAuthenticated={user !== null}
          />
        </div>
      </div>
    </section>
  );
}
