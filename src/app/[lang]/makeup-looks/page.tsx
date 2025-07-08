import { getDictionary } from '../dictionaries';
import { type Locale } from '@root/i18n-config';
import MakeupLooksListClient from './MakeupLooksListClient';
import { type Dictionary } from '@/types/dictionary';

export default async function MakeupLooksListPage({ params }: { params: { lang: Locale } }) {
  const lang = params.lang as Locale;
  const dict: Dictionary = await getDictionary(lang);

  return <MakeupLooksListClient dict={dict} lang={lang} />;
}
