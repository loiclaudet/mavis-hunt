import { Work_Sans } from "next/font/google";
import "styles/globals.css"; // These styles apply to every route in the application
import Switch from "components/Switch";
import Social from "components/Social";
import Menu from "components/Menu";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Axie.Wine 🍷",
  description: "Axie Infinity arena leaderboard and stats 🔥",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
  ],
  openGraph: {
    type: "website",
    url: "https://axie.wine",
    title: "Axie.Wine 🍷",
    description: "Axie Infinity arena leaderboard and stats 🔥",
    images: [
      {
        url: "https://www.axie.wine/og-image.jpg",
        width: 428,
        height: 388,
        alt: "Axie.Wine 🍷",
      },
    ],
  },
  twitter: {
    title: "Axie.Wine 🍷",
    description: "Axie Infinity arena leaderboard and stats 🔥",
    card: "summary_large_image",
    images: [
      {
        url: "https://www.axie.wine/og-image.jpg",
        width: 428,
        height: 388,
        alt: "Axie.Wine 🍷",
      },
    ],
    site: "@0xLodz",
    creator: "@0xLodz",
  },
};

const workSans = Work_Sans({
  variable: "--font-work-sans",
  weight: ["200", "300", "400", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${workSans.variable}`}>
      <body>
        <main className="flex w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat">
          <Menu />
          <Switch />
          {children}
          <Social />
          <Analytics />
        </main>
      </body>
    </html>
  );
}
