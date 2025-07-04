import { getDictionary } from '../../dictionaries';
import { type Locale } from '@root/i18n-config';
import NewCosmeticClient from './NewCosmeticClient';
import { type Dictionary } from '@/types/dictionary';

export default async function NewCosmeticPage({ params }: { params: any }) {
  const lang = params.lang as Locale;
  const dict: Dictionary = await getDictionary(lang);

  return <NewCosmeticClient dict={dict} lang={lang} />;
}
