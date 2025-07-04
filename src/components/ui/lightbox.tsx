'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from './button';

interface LightboxProps {
  photos: string[];
  initialIndex?: number;
  onClose: () => void;
}

export const Lightbox = ({ photos, initialIndex = 0, onClose }: LightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
  }, [photos.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  }, [onClose, handlePrev, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <Button
          className="absolute top-4 right-4 z-10 text-white bg-transparent hover:bg-gray-700"
          onClick={onClose}
          variant="ghost"
          size="icon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>

        {photos.length > 1 && (
          <Button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-transparent hover:bg-gray-700"
            onClick={handlePrev}
            variant="ghost"
            size="icon"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Button>
        )}

        <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full">
          <Image
            src={photos[currentIndex]}
            alt="Lightbox image"
            layout="fill"
            objectFit="contain"
            className="rounded-md"
          />
        </div>

        {photos.length > 1 && (
          <Button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-transparent hover:bg-gray-700"
            onClick={handleNext}
            variant="ghost"
            size="icon"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};
