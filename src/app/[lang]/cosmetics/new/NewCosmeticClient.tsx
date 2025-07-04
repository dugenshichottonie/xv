'use client';

import { useState } from 'react';
import { useAppStore } from '../../../../stores/cosmetics';
import { useRouter } from 'next/navigation';
import { type Locale } from '@root/i18n-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ColorCombobox } from '@/components/ui/color-combobox';
import { Textarea } from '@/components/ui/textarea';

import { type Dictionary } from '@/types/dictionary';

interface NewCosmeticClientProps {
  dict: Dictionary;
  lang: Locale;
}

export default function NewCosmeticClient({ dict, lang }: NewCosmeticClientProps) {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [colorNumber, setColorNumber] = useState('');
  const [remainingAmount, setRemainingAmount] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [purchaseCount, setPurchaseCount] = useState<number | undefined>(undefined);
  const [personalColor, setPersonalColor] = useState<'blue' | 'yellow' | 'neutral'>('neutral');
  const [photos, setPhotos] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  const addCosmetic = useAppStore((state) => state.addCosmetic);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCosmetic({ brand, name, category, color, colorNumber, remainingAmount, price, purchaseDate, expiryDate, purchaseCount, personalColor, photo: photos, memo });
    router.push(`/${lang}/cosmetics`); // Redirect to the list page after submission
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{dict.addNewCosmetic}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand">{dict.brand}</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{dict.category}</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{dict.name}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">{dict.color}</Label>
              <ColorCombobox
                value={color}
                onChange={(value, personalColor) => {
                  setColor(value);
                  setPersonalColor(personalColor);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="colorNumber">{dict.colorNumber}</Label>
              <Input
                id="colorNumber"
                value={colorNumber}
                onChange={(e) => setColorNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remainingAmount">{dict.remainingAmount}</Label>
              <Input
                id="remainingAmount"
                value={remainingAmount}
                onChange={(e) => setRemainingAmount(e.target.value)}
              />
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
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">{dict.expiryDate}</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
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
              <Textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photos">{dict.cosmeticPhotos}</Label>
              <input type="file" id="photos" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
              <Label htmlFor="photos" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                {dict.cosmeticPhotos}
              </Label>
              <span className="ml-2 text-sm text-gray-500">
                {photos.length > 0 ? `${photos.length} files selected` : dict.noFileSelected}
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <Image
                      src={photo}
                      alt="Cosmetic preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit">{dict.addCosmetic}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
