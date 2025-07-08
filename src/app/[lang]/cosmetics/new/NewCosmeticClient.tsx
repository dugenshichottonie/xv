'use client';

import { useState } from 'react';
import React from 'react';
import { useAppStore, PersonalColor } from '../../../../stores/cosmetics';
import { useRouter } from 'next/navigation';
import { type Locale } from '@root/i18n-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ColorCombobox } from '@/components/ui/color-combobox';
import { BrandCombobox } from '@/components/ui/brand-combobox';
import { Textarea } from '@/components/ui/textarea';
import { CosmeticCategorySelector } from '@/components/ui/cosmetic-category-selector';
import { ImageTextExtractor } from '@/components/ui/image-text-extractor';

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
  const [personalColor, setPersonalColor] = useState<PersonalColor>('neutral');
  const [photos, setPhotos] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  const addCosmetic = useAppStore((state) => state.addCosmetic);
  const { checkDuplicateCosmetic, updateCosmeticWithDuplicate } = useAppStore();
  const router = useRouter();

  const [duplicateCosmetic, setDuplicateCosmetic] = useState<Cosmetic | undefined>(undefined);
  const [showDuplicateCheckResult, setShowDuplicateCheckResult] = useState(false);

  const calculateRemainingDays = (expiryDate: string | undefined) => {
    if (!expiryDate) return dict.notSet;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `${Math.abs(diffDays)} ${dict.daysAgo}`;
    return `${diffDays} ${dict.daysRemaining}`;
  };

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

    const newCosmeticData = {
      brand, name, category, color, colorNumber, remainingAmount, price, purchaseDate, expiryDate, purchaseCount, personalColor, photo: photos, memo
    };

    const duplicate = checkDuplicateCosmetic(newCosmeticData);

    if (duplicate) {
      setDuplicateCosmetic(duplicate);
      setShowDuplicateCheckResult(true);
    } else {
      setDuplicateCosmetic(undefined);
      setShowDuplicateCheckResult(true);
    }
  };

  const handleConfirmAdd = async () => {
    const newCosmeticData = {
      brand, name, category, color, colorNumber, remainingAmount, price, purchaseDate, expiryDate, purchaseCount, personalColor, photo: photos, memo
    };

    if (duplicateCosmetic) {
      // Update existing cosmetic
      updateCosmeticWithDuplicate(duplicateCosmetic.id, newCosmeticData);
    } else {
      // Add new cosmetic
      await addCosmetic({ ...newCosmeticData, purchaseCount: 1 });
    }
    router.push(`/${lang}/cosmetics`);
  };

  const handleCancelAdd = () => {
    setShowDuplicateCheckResult(false);
    setDuplicateCosmetic(undefined);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{dict.addNewCosmetic}</CardTitle>
        </CardHeader>
        <CardContent>
          {!showDuplicateCheckResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">{dict.brand}</Label>
                <BrandCombobox
                  value={brand}
                  onChange={setBrand}
                  dict={dict}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{dict.category}</Label>
                <CosmeticCategorySelector
                  value={category}
                  onChange={setCategory}
                  dict={dict}
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
                <ImageTextExtractor dict={dict} onTextExtracted={(text) => console.log('Extracted:', text)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">{dict.color}</Label>
                <ColorCombobox
                  value={color}
                  onChange={(value, pc) => {
                    setColor(value);
                    setPersonalColor(pc);
                  }}
                  dict={dict}
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
          ) : (
            <div className="space-y-4">
              {duplicateCosmetic ? (
                <div className="text-center">
                  <p className="text-lg font-semibold mb-4">{dict.duplicateCosmeticFound}</p>
                  <Card className="p-4">
                    <p><strong>{dict.brand}:</strong> {duplicateCosmetic.brand}</p>
                    <p><strong>{dict.name}:</strong> {duplicateCosmetic.name}</p>
                    <p><strong>{dict.category}:</strong> {duplicateCosmetic.category}</p>
                    <p><strong>{dict.color}:</strong> {duplicateCosmetic.color}</p>
                    {duplicateCosmetic.colorNumber && <p><strong>{dict.colorNumber}:</strong> {duplicateCosmetic.colorNumber}</p>}
                    {duplicateCosmetic.expiryDate && <p><strong>{dict.expiryDate}:</strong> {duplicateCosmetic.expiryDate} ({calculateRemainingDays(duplicateCosmetic.expiryDate)})</p>}
                    {duplicateCosmetic.remainingAmount && <p><strong>{dict.remainingAmount}:</strong> {duplicateCosmetic.remainingAmount}</p>}
                    {duplicateCosmetic.price !== undefined && <p><strong>{dict.price}:</strong> {duplicateCosmetic.price}</p>}
                    {duplicateCosmetic.photo && duplicateCosmetic.photo.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {duplicateCosmetic.photo.map((photo, index) => (
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
                    )}
                  </Card>
                  <div className="flex justify-center space-x-4 mt-4">
                    <Button onClick={handleConfirmAdd}>{dict.confirmAdd}</Button>
                    <Button variant="outline" onClick={handleCancelAdd}>{dict.cancel}</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg font-semibold mb-4">{dict.noDuplicateCosmeticFound}</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <Button onClick={handleConfirmAdd}>{dict.addCosmetic}</Button>
                    <Button variant="outline" onClick={handleCancelAdd}>{dict.cancel}</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}