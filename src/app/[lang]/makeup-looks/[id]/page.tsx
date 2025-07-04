import { getDictionary } from '../../dictionaries';
import { type Locale } from '../../../../../i18n-config';
import MakeupLookDetailClient from './MakeupLookDetailClient';
import { type Dictionary } from '@/types/dictionary';

export default async function MakeupLookDetailPage({ params }: { params: any }) {
  const lang = params.lang as Locale;
  const id = params.id as string;
  const dict: Dictionary = await getDictionary(lang);

  return <MakeupLookDetailClient dict={dict} lang={lang} id={id} />;
}
