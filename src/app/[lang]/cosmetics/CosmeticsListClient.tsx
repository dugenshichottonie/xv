'use client';

import { useState } from 'react';
import { useAppStore } from '../../../stores/cosmetics';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { type Locale } from '@root/i18n-config';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';

import { type Dictionary } from '@/types/dictionary';

interface CosmeticsListClientProps {
  dict: Dictionary;
  lang: Locale;
}

const personalColorMap = {
  blue: 'bg-blue-100',
  yellow: 'bg-yellow-100',
  neutral: 'bg-pink-100',
};

const personalColorLabels = {
  blue: {
    ja: 'ブルべ',
    en: 'BlueBase',
  },
  yellow: {
    ja: 'イエベ',
    en: 'YellowBase',
  },
  neutral: {
    ja: 'ニュートラル',
    en: 'Neutral',
  },
};

export default function CosmeticsListClient({ dict, lang }: CosmeticsListClientProps) {
  const { cosmetics, deleteCosmetic } = useAppStore();
  const [selectedCosmetics, setSelectedCosmetics] = useState<string[]>([]);

  const handleSelectCosmetic = (id: string) => {
    setSelectedCosmetics((prev) =>
      prev.includes(id) ? prev.filter((cosmeticId) => cosmeticId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    selectedCosmetics.forEach((id) => deleteCosmetic(id));
    setSelectedCosmetics([]);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{dict.cosmeticsList}</h1>
        <div>
          <Button asChild>
            <Link href={`/${lang}/cosmetics/new`}>{dict.addNewCosmetic}</Link>
          </Button>
          {selectedCosmetics.length > 0 && (
            <Button onClick={handleDeleteSelected} variant="destructive" className="ml-2">
              {dict.deleteSelected}
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cosmetics.map((cosmetic) => {
          const personalColorLabel = personalColorLabels[cosmetic.personalColor][lang];

          return (
            <div key={cosmetic.id} className="relative">
              <div className="absolute top-2 right-2 z-10">
                <Checkbox
                  checked={selectedCosmetics.includes(cosmetic.id)}
                  onCheckedChange={() => handleSelectCosmetic(cosmetic.id)}
                />
              </div>
              <Link href={`/${lang}/cosmetics/${cosmetic.id}`}>
                <Card
                  className={`hover:shadow-lg transition-shadow duration-200 h-full ${
                    personalColorMap[cosmetic.personalColor] || 'bg-gray-100'
                  }`}
                >
                  <CardHeader>
                    <CardTitle>{cosmetic.name}</CardTitle>
                    <CardDescription>{cosmetic.brand}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-bold">{cosmetic.color}</p>
                    <p className="text-xs text-gray-600">{personalColorLabel}</p>
                    {cosmetic.photo && cosmetic.photo.length > 0 && (
                      <div className="relative aspect-square mt-2">
                        <Image
                          src={cosmetic.photo[0]}
                          alt={`${cosmetic.brand} - ${cosmetic.name}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
