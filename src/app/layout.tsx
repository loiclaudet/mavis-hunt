import { Work_Sans } from "@next/font/google";
import "styles/globals.css"; // These styles apply to every route in the application
import Head from "app/head";
import Switch from "components/Switch";
import Social from "components/Social";

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
      <Head />
      <body>
        <main className="bg- flex h-screen w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat">
          <Switch />
          {children}
          <Social />
        </main>
      </body>
    </html>
  );
}
