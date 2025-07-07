import { getDictionary } from '../../dictionaries';
import { type Locale } from '../../../../../i18n-config';
import CosmeticDetailClient from './CosmeticDetailClient';
import { type Dictionary } from '@/types/dictionary';

export default async function CosmeticDetailPage({ params: { lang, id } }: { params: { lang: Locale; id: string } }) {
  const dict: Dictionary = await getDictionary(lang);

  return <CosmeticDetailClient dict={dict} lang={lang} id={id} />;
}
