import { getDictionary } from '../../dictionaries';
import { type Locale } from '@root/i18n-config';
import NewMakeupLookClient from './NewMakeupLookClient';
import { type Dictionary } from '@/types/dictionary';

export default async function NewMakeupLookPage({ params }: { params: { lang: Locale } }) {
  const lang = params.lang as Locale;
  const dict: Dictionary = await getDictionary(lang);

  return <NewMakeupLookClient dict={dict} lang={lang} />;
}
