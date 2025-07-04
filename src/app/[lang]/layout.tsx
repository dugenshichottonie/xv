import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { i18n, type Locale } from '@root/i18n-config';
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getDictionary } from "./dictionaries";
import { Button } from "@/components/ui/button";
import { type Dictionary } from '@/types/dictionary';

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const lang = params.lang as Locale;
  const dict: Dictionary = await getDictionary(lang);
  return {
    title: dict.title,
    description: dict.description,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const lang = params.lang as Locale;
  const dict: Dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto flex justify-between items-center p-4">
            <Link href={`/${lang}`} className="text-2xl font-bold">
              {dict.title}
            </Link>
            <div className="flex items-center gap-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href={`/${lang}/cosmetics`} className={navigationMenuTriggerStyle()}>
                      {dict.cosmeticsList}
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href={`/${lang}/makeup-looks`} className={navigationMenuTriggerStyle()}>
                      {dict.makeupLooksList}
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <Link href={lang === "en" ? "/ja" : "/en"} passHref>
                <Button variant="outline">{lang === "en" ? "日本語" : "English"}</Button>
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
