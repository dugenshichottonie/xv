import SettingsClient from './SettingsClient';
import { getDictionary } from '../dictionaries';
import { type Locale } from '@root/i18n-config';

export default async function SettingsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  return <SettingsClient dict={dict} />;
}
