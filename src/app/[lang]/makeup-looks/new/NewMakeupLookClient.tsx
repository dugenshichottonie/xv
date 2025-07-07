'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../../../stores/cosmetics';
import { type Locale } from '@root/i18n-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { CosmeticCategorySelector } from '@/components/ui/cosmetic-category-selector';
import { Textarea } from '@/components/ui/textarea';

import { type Dictionary } from '@/types/dictionary';

interface NewMakeupLookClientProps {
  dict: Dictionary;
  lang: Locale;
}

export default function NewMakeupLookClient({ dict, lang }: NewMakeupLookClientProps) {
  const [title, setTitle] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedCosmeticIds, setSelectedCosmeticIds] = useState<string[]>([]);
  const [situation, setSituation] = useState('');
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter' | 'all'>('all');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addMakeupLook = useAppStore((state) => state.addMakeupLook);
  const allCosmetics = useAppStore((state) => state.cosmetics);
  const router = useRouter();

  const filteredCosmetics = allCosmetics.filter(
    (cosmetic) => !selectedCategory || cosmetic.category === selectedCategory
  );

  const situations = [
    { value: 'daily', label: dict.situationDaily },
    { value: 'work', label: dict.situationWork },
    { value: 'date', label: dict.situationDate },
    { value: 'party', label: dict.situationParty },
    { value: 'special', label: dict.situationSpecial },
  ];

  const seasons = [
    { value: 'spring', label: dict.seasonSpring },
    { value: 'summer', label: dict.seasonSummer },
    { value: 'autumn', label: dict.seasonAutumn },
    { value: 'winter', label: dict.seasonWinter },
    { value: 'all', label: dict.seasonAll },
  ];

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFiles = Array.from(e.target.files || []);

    const newPhotoPromises = currentFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    const loadedNewPhotos = await Promise.all(newPhotoPromises);

    const combinedPhotos = [...photos, ...loadedNewPhotos];

    if (combinedPhotos.length > 5) {
      alert('合計で最大5枚まで選択できます。');
      setPhotos(combinedPhotos.slice(0, 5)); // 5枚に制限
      return;
    }

    setPhotos(combinedPhotos);
  };

  const handleCosmeticSelection = (cosmeticId: string) => {
    setSelectedCosmeticIds((prev) =>
      prev.includes(cosmeticId) ? prev.filter((id) => id !== cosmeticId) : [...prev, cosmeticId]
    );
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMakeupLook({ title, photo: photos, usedCosmetics: selectedCosmeticIds, situation, season, tags, memo });
    router.push(`/${lang}/makeup-looks`);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{dict.addMakeupLook}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{dict.makeupLookTitle}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="situation">{dict.situation}</Label>
              <select
                id="situation"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">{dict.selectSituation}</option>
                {situations.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="season">{dict.season}</Label>
              <select
                id="season"
                value={season}
                onChange={(e) => setSeason(e.target.value as 'spring' | 'summer' | 'autumn' | 'winter' | 'all')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {seasons.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">{dict.tags}</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder={dict.addTagPlaceholder}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <Button type="button" onClick={handleAddTag}>
                  {dict.addTagButton}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span key={index} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-gray-500 hover:text-gray-700">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="memo">{dict.memo}</Label>
              <Textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photos">{dict.makeupLookPhoto}</Label>
              <input type="file" id="photos" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
              <Label htmlFor="photos" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                {dict.makeupLookPhoto}
              </Label>
              <span className="ml-2 text-sm text-gray-500">
                {photos.length > 0 ? `${photos.length} files selected` : dict.noFileSelected}
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <Image
                      src={photo}
                      alt="Makeup look preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {/* Part 1: Selecting Cosmetics */}
              <div className="space-y-2">
                <Label>{dict.addUsedCosmetics || 'Add Used Cosmetics'}</Label>
                <CosmeticCategorySelector
                  onCategoryChange={setSelectedCategory}
                  dict={dict}
                />
                <div className="border rounded-md p-2 h-64 overflow-y-auto">
                  {filteredCosmetics.map((cosmetic) => (
                    <div
                      key={cosmetic.id}
                      className="flex items-center justify-between p-2 rounded-md"
                    >
                      <label htmlFor={`select-${cosmetic.id}`} className="flex-grow cursor-pointer">{cosmetic.brand} - {cosmetic.name}</label>
                      <Checkbox
                        id={`select-${cosmetic.id}`}
                        checked={selectedCosmeticIds.includes(cosmetic.id)}
                        onCheckedChange={() => handleCosmeticSelection(cosmetic.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Part 2: Staging Area (Selected Cosmetics) */}
              <div className="space-y-2">
                <Label>{dict.usedCosmetics}</Label>
                <div className="border rounded-md p-2 space-y-2">
                  {selectedCosmeticIds.length > 0 ? (
                    allCosmetics
                      .filter((cosmetic) => selectedCosmeticIds.includes(cosmetic.id))
                      .map((cosmetic) => (
                        <div key={cosmetic.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <span>{cosmetic.category} - {cosmetic.brand} - {cosmetic.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCosmeticSelection(cosmetic.id)}
                          >
                            {dict.remove || 'Remove'}
                          </Button>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-gray-500">{dict.noCosmeticsSelected || 'No cosmetics selected.'}</p>
                  )}
                </div>
              </div>
            </div>
            <Button type="submit">{dict.addMakeupLook}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}