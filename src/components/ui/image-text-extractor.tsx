'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { type Dictionary } from '@/types/dictionary';

interface ImageTextExtractorProps {
  dict: Dictionary;
  onTextExtracted: (text: string) => void; // This prop is for future OCR integration
}

export function ImageTextExtractor({ dict, onTextExtracted }: ImageTextExtractorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // Placeholder for actual OCR logic
        // In a real application, you would send this image to an OCR service or library
        // For now, we'll just put a placeholder text.
        setExtractedText(dict.ocrPlaceholder || 'Text extraction will appear here...');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText);
    alert(dict.copiedToClipboard || 'Copied to clipboard!');
  };

  const handleOpen = () => {
    setIsOpen(true);
    setSelectedImage(null);
    setExtractedText('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedImage(null);
    setExtractedText('');
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={handleOpen}>
        {dict.scanTextFromImage || 'Scan Text from Image'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dict.scanTextFromImage || 'Scan Text from Image'}</DialogTitle>
            <DialogDescription>
              {dict.scanTextDescription || 'Take a photo of the product package to extract text.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input
              type="file"
              accept="image/*"
              capture="environment" // 'environment' for rear camera, 'user' for front camera
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <Button type="button" onClick={() => fileInputRef.current?.click()}>
              {dict.takePhotoOrSelectImage || 'Take Photo / Select Image'}
            </Button>

            {selectedImage && (
              <div className="relative w-full h-48 border rounded-md overflow-hidden">
                <Image
                  src={selectedImage}
                  alt="Selected for OCR"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}

            <Textarea
              placeholder={dict.extractedTextPlaceholder || 'Extracted text will appear here...'}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCopyText} disabled={!extractedText || extractedText === (dict.ocrPlaceholder || 'Text extraction will appear here...')}>
              {dict.copyText || 'Copy Text'}
            </Button>
            <Button type="button" onClick={handleClose}>
              {dict.close || 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
