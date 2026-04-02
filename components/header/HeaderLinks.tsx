"use client";

import { Link as I18nLink, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const HeaderLinks = () => {
  const pathname = usePathname();
  const t = useTranslations("DevToolKit");

  const links = [
    { name: t("all_tools"), href: "/" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <div className="hidden lg:flex items-center gap-1">
      {links.map((link) => (
        <I18nLink
          key={link.href}
          href={link.href}
          title={link.name}
          prefetch
          className={cn(
            "rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent",
            pathname === link.href && "text-foreground bg-accent"
          )}
        >
          {link.name}
        </I18nLink>
      ))}
    </div>
  );
};

export default HeaderLinks;
