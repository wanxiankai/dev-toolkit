import { SiteConfig } from "@/types/siteConfig";

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const GITHUB_URL = "https://github.com/wanxiankai/dev-toolkit";
const TWITTER_URL = "";
const YOUTUBE_URL = "";
const INSTAGRAM_URL = "";
const TIKTOK_URL = "";
const DISCORD_URL = "";
const EMAIL_URL = "";

export const siteConfig: SiteConfig = {
  name: "DevToolKit",
  url: BASE_URL,
  authors: [
    {
      name: "wanxiankai",
      url: "https://github.com/wanxiankai",
    },
  ],
  creator: "@wanxiankai",
  socialLinks: {
    github: GITHUB_URL,
    twitter: TWITTER_URL,
    youtube: YOUTUBE_URL,
    instagram: INSTAGRAM_URL,
    tiktok: TIKTOK_URL,
    discord: DISCORD_URL,
    email: EMAIL_URL,
  },
  themeColors: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  defaultNextTheme: "light",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};
