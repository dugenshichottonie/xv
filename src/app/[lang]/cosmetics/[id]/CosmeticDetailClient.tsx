'use client';

import { useAppStore, Cosmetic } from '../../../../stores/cosmetics';
import { type Locale } from '@root/i18n-config';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ColorCombobox } from '@/components/ui/color-combobox';
import { useState } from 'react';

import { type Dictionary } from '@/types/dictionary';

interface CosmeticDetailClientProps {
  dict: Dictionary;
  lang: Locale;
  id: string;
}

export default function CosmeticDetailClient({ dict, lang, id }: CosmeticDetailClientProps) {
  const { cosmetics, makeupLooks, updateCosmetic } = useAppStore();
  const initialCosmetic = cosmetics.find((c) => c.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [brand, setBrand] = useState(initialCosmetic?.brand || '');
  const [name, setName] = useState(initialCosmetic?.name || '');
  const [category, setCategory] = useState(initialCosmetic?.category || '');
  const [color, setColor] = useState(initialCosmetic?.color || '');
  const [colorNumber, setColorNumber] = useState(initialCosmetic?.colorNumber || '');
  const [remainingAmount, setRemainingAmount] = useState(initialCosmetic?.remainingAmount || '');
  const [price, setPrice] = useState<number | undefined>(initialCosmetic?.price);
  const [purchaseDate, setPurchaseDate] = useState(initialCosmetic?.purchaseDate || '');
  const [expiryDate, setExpiryDate] = useState(initialCosmetic?.expiryDate || '');
  const [purchaseCount, setPurchaseCount] = useState<number | undefined>(initialCosmetic?.purchaseCount);
  const [personalColor, setPersonalColor] = useState<'blue' | 'yellow' | 'neutral'>(initialCosmetic?.personalColor || 'neutral');
  const [photos, setPhotos] = useState<string[]>(initialCosmetic?.photo || []);
  const [memo, setMemo] = useState(initialCosmetic?.memo || '');

  if (!initialCosmetic) {
    return <div className="container mx-auto p-4 text-center">{dict.cosmeticNotFound}</div>;
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

  const handleSave = () => {
    const updatedCosmetic: Cosmetic = {
      ...initialCosmetic,
      brand,
      name,
      category,
      color,
      colorNumber,
      remainingAmount,
      price,
      purchaseDate,
      expiryDate,
      purchaseCount,
      personalColor,
      photo: photos,
      memo,
    };
    updateCosmetic(updatedCosmetic);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset states to initial cosmetic values
    setBrand(initialCosmetic.brand);
    setName(initialCosmetic.name);
    setCategory(initialCosmetic.category);
    setColor(initialCosmetic.color);
    setColorNumber(initialCosmetic.colorNumber || '');
    setRemainingAmount(initialCosmetic.remainingAmount || '');
    setPrice(initialCosmetic.price);
    setPurchaseDate(initialCosmetic.purchaseDate || '');
    setExpiryDate(initialCosmetic.expiryDate || '');
    setPurchaseCount(initialCosmetic.purchaseCount);
    setPersonalColor(initialCosmetic.personalColor);
    setPhotos(initialCosmetic.photo || []);
    setMemo(initialCosmetic.memo || '');
  };

  const personalColorMap = {
    blue: 'bg-blue-100',
    yellow: 'bg-yellow-100',
    neutral: 'bg-pink-100',
  };

  const personalColorLabels = {
    blue: {
      ja: dict.blueBase,
      en: dict.blueBase,
    },
    yellow: {
      ja: dict.yellowBase,
      en: dict.yellowBase,
    },
    neutral: {
      ja: dict.neutral,
      en: dict.neutral,
    },
  };

  const getDominantPersonalColor = (usedCosmetics: string[], allCosmetics: Cosmetic[]): keyof typeof personalColorMap => {
    const personalColors = usedCosmetics.map(cosmeticId => {
      const cosmetic = allCosmetics.find(c => c.id === cosmeticId);
      return cosmetic ? cosmetic.personalColor : null;
    }).filter(Boolean) as (keyof typeof personalColorMap)[];

    if (personalColors.length === 0) return 'neutral';

    const counts = personalColors.reduce((acc, color) => {
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {} as Record<keyof typeof personalColorMap, number>);

    const sortedColors = Object.keys(counts).sort((a, b) => counts[b as keyof typeof personalColorMap] - counts[a as keyof typeof personalColorMap]);

    return sortedColors[0] as keyof typeof personalColorMap;
  };

  const relatedMakeupLooks = makeupLooks.filter((look) =>
    look.usedCosmetics.includes(initialCosmetic.id)
  );

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{initialCosmetic.brand} - {initialCosmetic.name}</CardTitle>
          <CardDescription>{dict.category}: {initialCosmetic.category}</CardDescription>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-4">
              <div className="mb-4">
                <p><strong>{dict.brand}:</strong> {brand}</p>
                <p><strong>{dict.name}:</strong> {name}</p>
                <p><strong>{dict.category}:</strong> {category}</p>
                <p><strong>{dict.color}:</strong> {color}</p>
                {colorNumber && <p><strong>{dict.colorNumber}:</strong> {colorNumber}</p>}
                {remainingAmount && <p><strong>{dict.remainingAmount}:</strong> {remainingAmount}</p>}
                {price !== undefined && <p><strong>{dict.price}:</strong> {price}</p>}
                {purchaseDate && <p><strong>{dict.purchaseDate}:</strong> {purchaseDate}</p>}
                {expiryDate && <p><strong>{dict.expiryDate}:</strong> {expiryDate}</p>}
                {purchaseCount !== undefined && <p><strong>{dict.purchaseCount}:</strong> {purchaseCount}</p>}
                <p><strong>{dict.personalColor}:</strong> {personalColorLabels[personalColor][lang]}</p>
              </div>

              {photos && photos.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{dict.cosmeticPhotos}</h3>
                  <div className="flex flex-wrap gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative w-48 h-48 rounded-md overflow-hidden">
                        <Image
                          src={photo}
                          alt="Cosmetic"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">{dict.memo}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{memo}</p>
              </div>
              <Button onClick={() => setIsEditing(true)}>{dict.edit}</Button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">{dict.brand}</Label>
                <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{dict.name}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{dict.category}</Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">{dict.color}</Label>
                <ColorCombobox
                  value={color}
                  onChange={(value, pc) => {
                    setColor(value);
                    setPersonalColor(pc);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorNumber">{dict.colorNumber}</Label>
                <Input id="colorNumber" value={colorNumber} onChange={(e) => setColorNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remainingAmount">{dict.remainingAmount}</Label>
                <Input id="remainingAmount" value={remainingAmount} onChange={(e) => setRemainingAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{dict.price}</Label>
                <Input
                  id="price"
                  type="number"
                  value={price !== undefined ? price : ''}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">{dict.purchaseDate}</Label>
                <Input id="purchaseDate" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">{dict.expiryDate}</Label>
                <Input id="expiryDate" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseCount">{dict.purchaseCount}</Label>
                <Input
                  id="purchaseCount"
                  type="number"
                  value={purchaseCount !== undefined ? purchaseCount : ''}
                  onChange={(e) => setPurchaseCount(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memo">{dict.memo}</Label>
                <Textarea id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photos">{dict.cosmeticPhotos}</Label>
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
                        alt="Cosmetic preview"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
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
              <div className="flex space-x-2">
                <Button type="submit">{dict.save}</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>{dict.cancel}</Button>
              </div>
            </form>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">{dict.relatedMakeupLooks}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedMakeupLooks.map((look) => {
                const dominantPersonalColor = getDominantPersonalColor(look.usedCosmetics, cosmetics);
                const personalColorLabel = personalColorLabels[dominantPersonalColor][lang];

                return (
                  <Link href={`/${lang}/makeup-looks/${look.id}`} key={look.id}>
                    <Card
                      className={`flex items-center p-2 hover:shadow-md transition-shadow duration-200 ${
                        personalColorMap[dominantPersonalColor] || 'bg-gray-100'
                      }`}
                    >
                      {look.photo && look.photo.length > 0 && (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-3 border border-gray-300">
                          <Image
                            src={look.photo[0]}
                            alt={look.title || 'Makeup Look'}
                            layout="fill"
                            objectFit="cover"
                          />
                          
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{look.title || look.id}</p>
                        <p className="text-xs text-gray-600">{personalColorLabel}</p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}