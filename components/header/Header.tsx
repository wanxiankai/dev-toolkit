import CommandPalette from "@/components/search/command-palette";
import HeaderLinks from "@/components/header/HeaderLinks";
import MobileMenu from "@/components/header/MobileMenu";
import { UserAvatar } from "@/components/header/UserAvatar";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link as I18nLink } from "@/i18n/routing";
import { getSession } from "@/lib/auth/server";
import { user as userSchema } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

type User = typeof userSchema.$inferSelect;

const Header = async () => {
  const session = await getSession();
  const user = session?.user;

  return (
    <header className="py-2 backdrop-blur-md sticky top-0 z-50 border-b bg-background/80">
      <nav className="flex justify-between items-center container max-w-8xl mx-auto px-4">
        <div className="flex items-center space-x-6">
          <I18nLink
            href="/"
            title={siteConfig.name}
            prefetch={true}
            className="flex items-center space-x-2"
          >
            <span className="text-xl">🔧</span>
            <span className="text-xl font-semibold">{siteConfig.name}</span>
          </I18nLink>

          <HeaderLinks />
        </div>

        <div className="flex items-center gap-x-2 flex-1 justify-end">
          <div className="hidden lg:flex items-center gap-x-2">
            <CommandPalette />
            <LocaleSwitcher />
            <ThemeToggle />
            <UserAvatar user={user as User} />
          </div>

          <div className="flex lg:hidden items-center gap-x-2">
            <CommandPalette iconOnly />
            <UserAvatar user={user as User} />
            <MobileMenu />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
