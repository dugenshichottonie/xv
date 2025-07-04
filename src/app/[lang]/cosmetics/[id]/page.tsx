import { getDictionary } from '../../dictionaries';
import { type Locale } from '../../../../../i18n-config';
import CosmeticDetailClient from './CosmeticDetailClient';
import { type Dictionary } from '@/types/dictionary';

export default async function CosmeticDetailPage({ params }: { params: any }) {
  const lang = params.lang as Locale;
  const id = params.id as string;
  const dict: Dictionary = await getDictionary(lang);

  return <CosmeticDetailClient dict={dict} lang={lang} id={id} />;
}
