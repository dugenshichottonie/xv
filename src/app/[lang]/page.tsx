import { getDictionary } from './dictionaries';
import { type Locale } from '@root/i18n-config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { type Dictionary } from '@/types/dictionary';

export default async function Home({ params }: { params: any }) {
  const lang = params.lang as Locale;
  console.log('Current lang:', lang);
  const dict: Dictionary = await getDictionary(lang);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">{dict.title}</h1>
      <p className="text-lg mb-8">{dict.description}</p>
      <div className="space-x-4">
        <Button asChild>
          <Link href={`/${lang}/cosmetics`}>{dict.viewCosmetics}</Link>
        </Button>
        <Button asChild>
          <Link href={`/${lang}/makeup-looks/new`}>{dict.addMakeupLook}</Link>
        </Button>
        <Button asChild>
          <Link href={`/${lang}/makeup-looks`}>{dict.viewMakeupLooks}</Link>
        </Button>
      </div>
    </div>
  );
}