import { getDictionary } from './dictionaries';
import { Locale } from '@root/i18n-config';

export default async function NotFound({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  return (
    <div>
      <h1>{dict.notFound.title}</h1>
      <p>{dict.notFound.description}</p>
    </div>
  );
}
