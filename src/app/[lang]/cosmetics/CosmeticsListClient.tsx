'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '../../../stores/cosmetics';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { type Locale } from '@root/i18n-config';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type Dictionary } from '@/types/dictionary';
import { SlidersHorizontal } from 'lucide-react';

interface CosmeticsListClientProps {
  dict: Dictionary;
  lang: Locale;
}

const personalColorMap = {
  blue: 'bg-blue-100',
  yellow: 'bg-yellow-100',
  neutral: 'bg-pink-100',
};

const personalColorLabels: { [key: string]: { [key: string]: string } } = {
    blue: { en: 'Blue Base', ja: 'ブルーベース' },
    yellow: { en: 'Yellow Base', ja: 'イエローベース' },
    neutral: { en: 'Neutral', ja: 'ニュートラル' },
};

const CosmeticsListClient: React.FC<CosmeticsListClientProps> = ({ dict, lang }) => {
  const { cosmetics, deleteCosmetic, cosmeticListViewMode, setCosmeticListViewMode } = useAppStore();
  
  const [selectedCosmetics, setSelectedCosmetics] = useState<string[]>([]);
  const [filterBrand, setFilterBrand] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('purchaseDate-desc');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const handleSelectCosmetic = (id: string) => {
    setSelectedCosmetics((prev) =>
      prev.includes(id) ? prev.filter((cosmeticId) => cosmeticId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    selectedCosmetics.forEach((id) => deleteCosmetic(id));
    setSelectedCosmetics([]);
  };

  const getRandomSpanClasses = () => {
    const spanOptions = [
      'col-span-1 row-span-1',
      'col-span-2 row-span-1',
      'col-span-1 row-span-2',
      'col-span-2 row-span-2',
      'col-span-3 row-span-1',
      'col-span-1 row-span-3',
    ];
    return spanOptions[Math.floor(Math.random() * spanOptions.length)];
  };

  const filteredAndSortedCosmetics = useMemo(() => {
    let filtered = cosmetics;

    if (filterBrand) {
      filtered = filtered.filter(c => c.brand === filterBrand);
    }

    if (filterCategory) {
      filtered = filtered.filter(c => c.category === filterCategory);
    }

    const [sortKey, sortOrder] = sortBy.split('-');

    return [...filtered].sort((a, b) => {
      const aValue = a[sortKey as keyof typeof a];
      const bValue = b[sortKey as keyof typeof b];

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [cosmetics, filterBrand, filterCategory, sortBy]);

  const allBrands = useMemo(() => Array.from(new Set(cosmetics.map(c => c.brand))), [cosmetics]);
  const allCategories = useMemo(() => Array.from(new Set(cosmetics.map(c => c.category))), [cosmetics]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{dict.cosmeticsList}</h1>
        <div className="flex items-center space-x-2">
            <Button onClick={() => setCosmeticListViewMode('grid')} variant={cosmeticListViewMode === 'grid' ? 'default' : 'outline'}>{dict.gridDisplay}</Button>
            <Button onClick={() => setCosmeticListViewMode('list')} variant={cosmeticListViewMode === 'list' ? 'default' : 'outline'}>{dict.listDisplay}</Button>
            <Button onClick={() => setCosmeticListViewMode('collage')} variant={cosmeticListViewMode === 'collage' ? 'default' : 'outline'}>{dict.collageDisplay}</Button>
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

      <div className="flex items-center justify-end space-x-4 mb-4">
        <Button
          variant="outline"
          className="md:hidden"
          onClick={() => setIsFilterVisible(!isFilterVisible)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          {dict.filterAndSort || 'Filter & Sort'}
        </Button>
      </div>

      <div className={`${isFilterVisible ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-4`}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{filterBrand ? `${dict.brand}: ${filterBrand}` : dict.filterByBrand}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <Button variant="ghost" onClick={() => setFilterBrand(null)}>{dict.allBrands}</Button>
            {allBrands.map(brand => (
              <Button key={brand} variant="ghost" onClick={() => setFilterBrand(brand)}>{brand}</Button>
            ))}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{filterCategory ? `${dict.category}: ${filterCategory}` : dict.filterByCategory}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <Button variant="ghost" onClick={() => setFilterCategory(null)}>{dict.allCategories}</Button>
            {allCategories.map(category => (
              <Button key={category} variant="ghost" onClick={() => setFilterCategory(category)}>{category}</Button>
            ))}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{dict.sortBy}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <Button variant="ghost" onClick={() => setSortBy('purchaseDate-desc')}>{dict.purchaseDateDesc}</Button>
            <Button variant="ghost" onClick={() => setSortBy('purchaseDate-asc')}>{dict.purchaseDateAsc}</Button>
            <Button variant="ghost" onClick={() => setSortBy('expiryDate-desc')}>{dict.expiryDateDesc}</Button>
            <Button variant="ghost" onClick={() => setSortBy('expiryDate-asc')}>{dict.expiryDateAsc}</Button>
            <Button variant="ghost" onClick={() => setSortBy('name-asc')}>{dict.nameAsc}</Button>
            <Button variant="ghost" onClick={() => setSortBy('name-desc')}>{dict.nameDesc}</Button>
          </PopoverContent>
        </Popover>
      </div>

      {cosmeticListViewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAndSortedCosmetics.map((cosmetic) => {
            const personalColorLabel = personalColorLabels[cosmetic.personalColor]?.[lang] ?? cosmetic.personalColor;

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
      )}
      {cosmeticListViewMode === 'list' && (
        <div className="space-y-4">
          {filteredAndSortedCosmetics.map((cosmetic) => {
            const personalColorLabel = personalColorLabels[cosmetic.personalColor]?.[lang] ?? cosmetic.personalColor;
            return (
              <div key={cosmetic.id} className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-2 z-10">
                  <Checkbox
                    checked={selectedCosmetics.includes(cosmetic.id)}
                    onCheckedChange={() => handleSelectCosmetic(cosmetic.id)}
                  />
                </div>
                <Link href={`/${lang}/cosmetics/${cosmetic.id}`}>
                  <Card className={`hover:shadow-lg transition-shadow duration-200 pl-10 ${personalColorMap[cosmetic.personalColor] || 'bg-gray-100'}`}>
                    <div className="flex items-start p-4">
                      {cosmetic.photo && cosmetic.photo.length > 0 && (
                        <div className="relative w-24 h-24 mr-4 flex-shrink-0">
                          <Image
                            src={cosmetic.photo[0]}
                            alt={`${cosmetic.brand} - ${cosmetic.name}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <CardHeader className="p-0">
                          <CardTitle>{cosmetic.name}</CardTitle>
                          <CardDescription>{cosmetic.brand}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-2 space-y-1 text-sm">
                          <p><span className="font-semibold">{dict.color}:</span> {cosmetic.color}</p>
                          <p><span className="font-semibold">{dict.category}:</span> {cosmetic.category}</p>
                          <p className="text-xs text-gray-600">{personalColorLabel}</p>
                          {cosmetic.memo && <p className="truncate"><span className="font-semibold">{dict.memo}:</span> {cosmetic.memo}</p>}
                          {sortBy.startsWith('purchaseDate') && cosmetic.purchaseDate && (
                            <p>{dict.purchaseDate}: {cosmetic.purchaseDate}</p>
                          )}
                          {sortBy.startsWith('expiryDate') && cosmetic.expiryDate && (
                            <p>{dict.expiryDate}: {cosmetic.expiryDate}</p>
                          )}
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
      )}
      {cosmeticListViewMode === 'collage' && (
        <div className="p-4">
          {cosmetics.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 auto-rows-[100px] md:auto-rows-[150px] lg:auto-rows-[200px]">
              {filteredAndSortedCosmetics.flatMap((cosmetic) =>
                cosmetic.photo?.map((photo, index) => {
                  const spanClasses = getRandomSpanClasses();
                  return (
                    <div
                      key={`${cosmetic.id}-${index}`}
                      className={`relative w-full h-full overflow-hidden rounded-md group ${spanClasses} ${personalColorMap[cosmetic.personalColor]} cursor-pointer`}
                    >
                      <Image
                        src={photo}
                        alt={cosmetic.name || 'Cosmetic'}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-bold">{cosmetic.name}</p>
                        <p className="text-white text-xs mb-1">{cosmetic.brand}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] bg-gray-50 rounded-lg p-4">
              <p className="text-lg text-gray-500">{dict.noCosmetics}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CosmeticsListClient;