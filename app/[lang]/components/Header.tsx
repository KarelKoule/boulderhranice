import type { Dictionary } from "@/lib/getDictionary";
import type { UserProfile } from "@/lib/types/auth";
import LanguageSwitcher from "./LanguageSwitcher";
import AuthStatus from "./AuthStatus";
import LoginButton from "./LoginButton";

type Props = {
  dict: Dictionary["header"];
  user?: UserProfile | null;
  authDict?: Dictionary["auth"];
};

export default function Header({ dict, user, authDict }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-dark/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <span className="text-lg font-bold tracking-tight text-white">
          {dict.title}
        </span>
        <nav className="flex items-center gap-6">
          <a
            href="#how-to"
            className="text-sm text-stone-400 transition-colors hover:text-glow"
          >
            {dict.nav.howTo}
          </a>
          <a
            href="#gallery"
            className="text-sm text-stone-400 transition-colors hover:text-glow"
          >
            {dict.nav.gallery}
          </a>
          <a
            href="#boulders"
            className="text-sm text-stone-400 transition-colors hover:text-glow"
          >
            {dict.nav.boulders}
          </a>
          {authDict && (
            user ? (
              <AuthStatus user={user} signOutLabel={authDict.signOut} />
            ) : (
              <LoginButton provider="google" label={authDict.signInWithGoogle} />
            )
          )}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
