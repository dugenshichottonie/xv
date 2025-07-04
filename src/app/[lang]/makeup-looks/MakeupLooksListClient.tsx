'use client';

import { useState } from 'react';
import { useAppStore, Cosmetic } from '../../../stores/cosmetics';
import Link from 'next/link';
import { type Locale } from '@root/i18n-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Lightbox } from '@/components/ui/lightbox';
import { type Dictionary } from '@/types/dictionary';
import { MenuIcon, XIcon } from 'lucide-react';

interface MakeupLooksListClientProps {
  dict: Dictionary;
  lang: Locale;
}

export default function MakeupLooksListClient({ dict, lang }: MakeupLooksListClientProps) {
  const {
    makeupLooks,
    deleteMakeupLook,
    cosmetics,
    makeupListViewMode,
    lookbookIndex,
    lookbookPhotoIndex,
    setMakeupListViewMode,
  } = useAppStore();
  const [selectedLooks, setSelectedLooks] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterTagInput, setFilterTagInput] = useState('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // For mobile responsiveness

  // Lightbox states
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

  const handleTagFilterChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFilterTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTagInput(e.target.value);
  };

  const handleFilterTagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filterTagInput.trim() !== '') {
      handleTagFilterChange(filterTagInput.trim());
      setFilterTagInput('');
    }
  };

  const filteredMakeupLooks = makeupLooks.filter((look) => {
    if (selectedTags.length === 0) return true;
    if (!look.tags) return false;
    return selectedTags.every((tag) => look.tags!.includes(tag));
  });

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
    if (!usedCosmetics || usedCosmetics.length === 0) return 'neutral';

    const personalColors = usedCosmetics.map(cosmeticId => {
      const cosmetic = allCosmetics.find(c => c.id === cosmeticId);
      return cosmetic ? cosmetic.personalColor : null;
    }).filter(Boolean) as ('blue' | 'yellow' | 'neutral')[];

    if (personalColors.length === 0) return 'neutral';

    const counts = personalColors.reduce((acc, color) => {
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {} as Record<'blue' | 'yellow' | 'neutral', number>);

    const blueCount = counts.blue || 0;
    const yellowCount = counts.yellow || 0;

    if (blueCount > yellowCount) return 'blue';
    if (yellowCount > blueCount) return 'yellow';
    return 'neutral'; // Equal or neutral dominant
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

  const handleSelectLook = (id: string) => {
    setSelectedLooks((prev) => (prev.includes(id) ? prev.filter((lookId) => lookId !== id) : [...prev, id]));
  };

  const handleDeleteSelected = () => {
    selectedLooks.forEach((id) => deleteMakeupLook(id));
    setSelectedLooks([]);
  };

  const handleNextPhoto = () => {
    const currentLook = makeupLooks[lookbookIndex];
    if (!currentLook || !currentLook.photo || currentLook.photo.length === 0) return;

    if (lookbookPhotoIndex < currentLook.photo.length - 1) {
      useAppStore.setState({ lookbookPhotoIndex: lookbookPhotoIndex + 1 });
    } else {
      // Move to next look, reset photo index
      useAppStore.setState({ lookbookPhotoIndex: 0 });
      useAppStore.setState((state) => ({
        lookbookIndex: state.lookbookIndex === makeupLooks.length - 1 ? 0 : state.lookbookIndex + 1,
      }));
    }
  };

  const handlePrevPhoto = () => {
    const currentLook = makeupLooks[lookbookIndex];
    if (!currentLook || !currentLook.photo || currentLook.photo.length === 0) return;

    if (lookbookPhotoIndex > 0) {
      useAppStore.setState({ lookbookPhotoIndex: lookbookPhotoIndex - 1 });
    } else {
      // Move to previous look, set photo index to last photo of that look
      useAppStore.setState((state) => {
        const newIndex = state.lookbookIndex === 0 ? makeupLooks.length - 1 : state.lookbookIndex - 1;
        useAppStore.setState({ lookbookPhotoIndex: makeupLooks[newIndex].photo.length - 1 });
        return { lookbookIndex: newIndex };
      });
    }
  };

  const openLightbox = (photos: string[], initialIndex: number) => {
    setLightboxPhotos(photos);
    setLightboxInitialIndex(initialIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxPhotos([]);
    setLightboxInitialIndex(0);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h1 className="text-2xl font-bold">{dict.makeupLooksList}</h1>
        <Button variant="outline" size="icon" onClick={() => setIsHeaderVisible(!isHeaderVisible)}>
          {isHeaderVisible ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
        </Button>
      </div>

      <div className={`md:block ${isHeaderVisible ? 'block' : 'hidden'}`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{dict.makeupLooksList}</h1>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setMakeupListViewMode('grid')} variant={makeupListViewMode === 'grid' ? 'default' : 'outline'}>{dict.gridDisplay}</Button>
            <Button onClick={() => setMakeupListViewMode('lookbook')} variant={makeupListViewMode === 'lookbook' ? 'default' : 'outline'}>{dict.lookbookDisplay}</Button>
            <Button onClick={() => setMakeupListViewMode('collage')} variant={makeupListViewMode === 'collage' ? 'default' : 'outline'}>{dict.collageDisplay}</Button>
            <Button asChild>
              <Link href={`/${lang}/makeup-looks/new`}>{dict.addMakeupLook}</Link>
            </Button>
            {selectedLooks.length > 0 && (
              <Button onClick={handleDeleteSelected} variant="destructive" className="ml-2">
                {dict.deleteSelected}
              </Button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{dict.filterByTags}</h3>
          <Input
            type="text"
            placeholder={dict.addTagPlaceholder}
            value={filterTagInput}
            onChange={handleFilterTagInputChange}
            onKeyDown={handleFilterTagSubmit}
            className="mb-2"
          />
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(makeupLooks.flatMap(look => look.tags || []))).map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                onClick={() => handleTagFilterChange(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {makeupListViewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMakeupLooks.map((look) => {
            const dominantColor = getDominantPersonalColor(look.usedCosmetics, cosmetics);
            const personalColorLabel = personalColorLabels[dominantColor][lang];

            return (
              <div key={look.id} className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <Checkbox
                    checked={selectedLooks.includes(look.id)}
                    onCheckedChange={() => handleSelectLook(look.id)}
                  />
                </div>
                <Card
                  className={`hover:shadow-lg transition-shadow duration-200 h-full ${
                    personalColorMap[dominantColor]
                  }`}
                >
                  <CardHeader>
                    <CardTitle>{look.title || dict.makeupLookTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {look.photo && look.photo.length > 0 && (
                      <div className="relative aspect-square cursor-pointer" onClick={() => openLightbox(look.photo, 0)}>
                        <Image
                          src={look.photo[0]}
                          alt={look.title || 'Makeup Look'}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-600 mt-2">{personalColorLabel}</p>
                    <Link href={`/${lang}/makeup-looks/${look.id}`} className="text-blue-500 hover:underline text-sm mt-2 block">{dict.viewDetails}</Link>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {makeupListViewMode === 'lookbook' && (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-gray-50 rounded-lg p-4 relative">
          {filteredMakeupLooks.length > 0 ? (
            <>
              <div className="relative w-full max-w-xl h-full flex items-center justify-center cursor-pointer" onClick={() => openLightbox(filteredMakeupLooks[lookbookIndex].photo, lookbookPhotoIndex)}>
                <Image
                  src={filteredMakeupLooks[lookbookIndex].photo[lookbookPhotoIndex]}
                  alt={filteredMakeupLooks[lookbookIndex].title || 'Makeup Look'}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between items-center w-[calc(100%-32px)]">
                <Button
                  onClick={handlePrevPhoto}
                  variant="outline"
                  size="icon"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </Button>
                <Button
                  onClick={handleNextPhoto}
                  variant="outline"
                  size="icon"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Button>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold">{filteredMakeupLooks[lookbookIndex].title || dict.makeupLookTitle}</h3>
                <p className="text-sm text-gray-600 mb-2">{personalColorLabels[getDominantPersonalColor(filteredMakeupLooks[lookbookIndex].usedCosmetics, cosmetics)][lang]}</p>
                <Link href={`/${lang}/makeup-looks/${filteredMakeupLooks[lookbookIndex].id}`} className="text-blue-500 hover:underline text-sm">{dict.viewDetails}</Link>
              </div>
            </> 
          ) : (
            <p className="text-lg text-gray-500">メイク写真がありません。</p>
          )}
        </div>
      )}

      {makeupListViewMode === 'collage' && (
        <div className="p-4">
          {filteredMakeupLooks.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 auto-rows-[100px] md:auto-rows-[150px] lg:auto-rows-[200px]">
              {filteredMakeupLooks.flatMap((look) =>
                look.photo.map((photo, index) => {
                  const dominantColor = getDominantPersonalColor(look.usedCosmetics, cosmetics);
                  const personalColorLabel = personalColorLabels[dominantColor][lang];
                  const spanClasses = getRandomSpanClasses();
                  const usedCosmeticsDetails = look.usedCosmetics
                    .map(id => cosmetics.find(c => c.id === id))
                    .filter((c): c is Cosmetic => !!c);

                  return (
                    <div
                      key={`${look.id}-${index}`}
                      className={`relative w-full h-full overflow-hidden rounded-md group ${spanClasses} ${personalColorMap[dominantColor]} cursor-pointer`}
                      onClick={() => openLightbox(look.photo, index)}
                    >
                      <Image
                        src={photo}
                        alt={look.title || 'Makeup Look'}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-bold">{look.title || dict.makeupLookTitle}</p>
                        <p className="text-white text-xs mb-1">{personalColorLabel}</p>
                        <div className="overflow-y-auto max-h-20">
                          {usedCosmeticsDetails.map(cosmetic => (
                            <Link
                              key={cosmetic.id}
                              href={`/${lang}/cosmetics/${cosmetic.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-300 hover:text-blue-100 text-xs block truncate"
                            >
                              {cosmetic.category}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] bg-gray-50 rounded-lg p-4">
              <p className="text-lg text-gray-500">メイク写真がありません。</p>
            </div>
          )}
        </div>
      )}

      {isLightboxOpen && (
        <Lightbox
          photos={lightboxPhotos}
          initialIndex={lightboxInitialIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}