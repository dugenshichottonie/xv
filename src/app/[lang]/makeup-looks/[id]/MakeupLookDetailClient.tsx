'use client';

import { useAppStore, MakeupLook } from '../../../../stores/cosmetics';
import { type Locale } from '@root/i18n-config';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CosmeticCategorySelector } from '@/components/ui/cosmetic-category-selector';
import { useState } from 'react';

import { type Dictionary } from '@/types/dictionary';

interface MakeupLookDetailClientProps {
  dict: Dictionary;
  lang: Locale;
  id: string;
}

export default function MakeupLookDetailClient({ dict, lang, id }: MakeupLookDetailClientProps) {
  const { makeupLooks, cosmetics, updateMakeupLook } = useAppStore();
  const initialMakeupLook = makeupLooks.find((look) => look.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialMakeupLook?.title || '');
  const [photos, setPhotos] = useState<string[]>(initialMakeupLook?.photo || []);
  const [usedCosmeticIds, setUsedCosmeticIds] = useState<string[]>(initialMakeupLook?.usedCosmetics || []);
  const [situation, setSituation] = useState(initialMakeupLook?.situation || '');
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter' | 'all'>(initialMakeupLook?.season || 'all');
  const [tags, setTags] = useState<string[]>(initialMakeupLook?.tags || []);
  const [newTagInput, setNewTagInput] = useState(''); // New state for tag input
  const [memo, setMemo] = useState(initialMakeupLook?.memo || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allCosmetics = cosmetics; // 全てのコスメデータ

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
    { value: 'autumn', label: dict.autumn },
    { value: 'winter', label: dict.winter },
    { value: 'all', label: dict.seasonAll },
  ];

  if (!initialMakeupLook) {
    return <div className="container mx-auto p-4 text-center">{dict.makeupLookNotFound}</div>;
  }

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

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleCosmeticSelection = (cosmeticId: string) => {
    setUsedCosmeticIds((prev) =>
      prev.includes(cosmeticId) ? prev.filter((id) => id !== cosmeticId) : [...prev, cosmeticId]
    );
  };

  const handleAddTagButtonClick = () => {
    if (newTagInput.trim() !== '') {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput(''); // Clear the input field
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    const updatedMakeupLook: MakeupLook = {
      ...initialMakeupLook,
      title,
      photo: photos,
      usedCosmetics: usedCosmeticIds,
      situation,
      season,
      tags,
      memo,
    };
    updateMakeupLook(updatedMakeupLook);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset states to initial makeup look values
    setTitle(initialMakeupLook.title || '');
    setPhotos(initialMakeupLook.photo || []);
    setUsedCosmeticIds(initialMakeupLook.usedCosmetics || []);
    setSituation(initialMakeupLook.situation || '');
    setSeason(initialMakeupLook.season || 'all');
    setTags(initialMakeupLook.tags || []);
    setMemo(initialMakeupLook.memo || '');
  };

  const personalColorMap = {
    blue: 'bg-blue-100',
    yellow: 'bg-yellow-100',
    neutral: 'bg-pink-100',
  };

  const personalColorLabels = {
    blue: {
      ja: 'ブルべ',
      en: dict.blueBase,
    },
    yellow: {
      ja: 'イエベ',
      en: dict.yellowBase,
    },
    neutral: {
      ja: 'ニュートラル',
      en: dict.neutral,
    },
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{initialMakeupLook.title || dict.makeupLookDetails}</CardTitle>
          <CardDescription>{dict.makeupLookDetails}</CardDescription>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-4">
              <p><strong>{dict.makeupLookTitle}:</strong> {title}</p>
              {situation && <p><strong>{dict.situation}:</strong> {situations.find(s => s.value === situation)?.label || situation}</p>}
              {season && <p><strong>{dict.season}:</strong> {seasons.find(s => s.value === season)?.label || season}</p>}
              {tags && tags.length > 0 && (
                <p><strong>{dict.tags}:</strong> {tags.join(', ')}</p>
              )}
              {memo && <p><strong>{dict.memo}:</strong> {memo}</p>}

              {photos && photos.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{dict.makeupLookPhotos}</h3>
                  <div className="flex flex-wrap gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative w-48 h-48 rounded-md overflow-hidden">
                        <Image
                          src={photo}
                          alt="Makeup Look"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">{dict.usedCosmetics}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {usedCosmeticIds.map((cosmeticId) => {
                    const cosmetic = allCosmetics.find(c => c.id === cosmeticId);
                    if (!cosmetic) return null;
                    const personalColorLabel = personalColorLabels[cosmetic.personalColor][lang];

                    return (
                      <Link href={`/${lang}/cosmetics/${cosmetic.id}`} key={cosmetic.id}>
                        <Card
                          className={`flex items-center p-2 hover:shadow-md transition-shadow duration-200 ${
                            personalColorMap[cosmetic.personalColor] || 'bg-gray-100'
                          }`}
                        >
                          {cosmetic.photo && cosmetic.photo.length > 0 && (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden mr-3 border border-gray-300">
                              <Image
                                src={cosmetic.photo[0]}
                                alt={cosmetic.name}
                                layout="fill"
                                objectFit="cover"
                                unoptimized
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{cosmetic.name}</p>
                            <p className="text-sm text-gray-500">{cosmetic.brand}</p>
                            <p className="text-sm text-gray-500">{cosmetic.category}</p>
                            <p className="text-xs text-gray-600">{personalColorLabel}</p>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)}>{dict.edit}</Button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{dict.makeupLookTitle}</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
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
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    placeholder={dict.addTagPlaceholder}
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="button" onClick={handleAddTagButtonClick}>{dict.addTagButton}</Button>
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
                <Textarea id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photos">{dict.makeupLookPhotos}</Label>
                <input type="file" id="photos" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
                <Label htmlFor="photos" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                  {dict.addPhotos}
                </Label>
                <span className="ml-2 text-sm text-gray-500">
                  {photos.length > 0 ? `${photos.length} files selected` : dict.noFileSelected}
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative w-24 h-24 group">
                      <Image
                        src={photo}
                        alt="Makeup look preview"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        X
                      </button>
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
                    {allCosmetics
                      .filter((cosmetic) => !selectedCategory || cosmetic.category === selectedCategory)
                      .map((cosmetic) => (
                        <div
                          key={cosmetic.id}
                          className="flex items-center justify-between p-2 rounded-md"
                        >
                          <label htmlFor={`select-${cosmetic.id}`} className="flex-grow cursor-pointer">{cosmetic.brand} - {cosmetic.name}</label>
                          <Checkbox
                            id={`select-${cosmetic.id}`}
                            checked={usedCosmeticIds.includes(cosmetic.id)}
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
                    {usedCosmeticIds.length > 0 ? (
                      allCosmetics
                        .filter((cosmetic) => usedCosmeticIds.includes(cosmetic.id))
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
              <div className="flex space-x-2">
                <Button type="submit">{dict.save}</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>{dict.cancel}</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
