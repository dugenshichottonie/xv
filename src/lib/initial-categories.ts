import { CategoryAlias } from '@/stores/cosmetics';

export const initialCategories: CategoryAlias[] = [
  { canonicalName: 'Face', aliases: ['Face', 'フェイス'] },
  { canonicalName: 'Eyes', aliases: ['Eyes', 'アイ', '目元'] },
  { canonicalName: 'Lips', aliases: ['Lips', 'リップ', '口元'] },
  { canonicalName: 'Cheeks', aliases: ['Cheeks', 'チーク', '頬'] },
  { canonicalName: 'Nails', aliases: ['Nails', 'ネイル', '爪'] },
  { canonicalName: 'Skincare', aliases: ['Skincare', 'スキンケア'] },
  { canonicalName: 'Bodycare', aliases: ['Bodycare', 'ボディケア'] },
  { canonicalName: 'Haircare', aliases: ['Haircare', 'ヘアケア'] },
  { canonicalName: 'Fragrance', aliases: ['Fragrance', 'フレグランス', '香水'] },
  { canonicalName: 'Tools', aliases: ['Tools', 'ツール', 'メイク道具'] },
  { canonicalName: 'Other', aliases: ['Other', 'その他'] },
];
