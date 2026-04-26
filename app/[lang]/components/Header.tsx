import type { Dictionary } from "@/lib/getDictionary";
import type { UserProfile } from "@/lib/types/auth";
import LanguageSwitcher from "./LanguageSwitcher";
import AuthStatus from "./AuthStatus";
import LoginTrigger from "./LoginTrigger";
import MobileMenu from "./MobileMenu";

type Props = {
  dict: Dictionary["header"];
  user?: UserProfile | null;
  authDict?: Dictionary["auth"];
};

export default function Header({ dict, user, authDict }: Props) {
  const navItems = [
    { href: "#how-to", label: dict.nav.howTo },
    { href: "#gallery", label: dict.nav.gallery },
    { href: "#boulders", label: dict.nav.boulders },
    { href: "#map", label: dict.nav.map },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-dark/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <span className="text-lg font-bold tracking-tight text-white">
          {dict.title}
        </span>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-stone-400 transition-colors hover:text-glow"
            >
              {item.label}
            </a>
          ))}
          {authDict && (
            user ? (
              <AuthStatus user={user} signOutLabel={authDict.signOut} />
            ) : (
              <LoginTrigger label={authDict.logIn} authDict={authDict} />
            )
          )}
          <LanguageSwitcher />
        </nav>

        <MobileMenu navItems={navItems}>
          {authDict && (
            <div className="px-4">
              {user ? (
                <AuthStatus user={user} signOutLabel={authDict.signOut} />
              ) : (
                <LoginTrigger label={authDict.logIn} authDict={authDict} />
              )}
            </div>
          )}
        </MobileMenu>
      </div>
    </header>
  );
}
