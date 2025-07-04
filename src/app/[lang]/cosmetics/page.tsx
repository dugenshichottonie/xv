import { getDictionary } from '../dictionaries';
import { type Locale } from '@root/i18n-config';
import CosmeticsListClient from './CosmeticsListClient';
import { type Dictionary } from '@/types/dictionary';

export default async function CosmeticsListPage({ params }: { params: any }) {
  const lang = params.lang as Locale;
  const dict: Dictionary = await getDictionary(lang);

  return <CosmeticsListClient dict={dict} lang={lang} />;
}