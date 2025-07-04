
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAppStore } from '@/stores/cosmetics';
import { type Dictionary } from '../../types/dictionary';

interface CosmeticCategorySelectorProps {
  selectedCosmetics: string[];
  onCosmeticChange: (cosmeticId: string) => void;
  dict: Dictionary;
}

export function CosmeticCategorySelector({
  selectedCosmetics,
  onCosmeticChange,
  dict,
}: CosmeticCategorySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const { cosmetics } = useAppStore();

  const categories = [...new Set(cosmetics.map((c) => c.category))];

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSelectCosmetic = (cosmeticId: string) => {
    onCosmeticChange(cosmeticId);
    // Optionally close the popover after selection
    // setOpen(false); 
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {dict.selectCosmetics || 'Select cosmetics...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          {!selectedCategory ? (
            <>
              <CommandInput placeholder={dict.searchCategory || "Search category..."} />
              <CommandEmpty>{dict.noCategoryFound || "No category found."}</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category}
                      value={category}
                      onSelect={() => handleSelectCategory(category)}
                    >
                      {category}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </>
          ) : (
            <>
              <CommandInput placeholder={dict.searchCosmetic || "Search cosmetic..."} />
              <CommandEmpty>{dict.noCosmeticFound || "No cosmetic found."}</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <Button variant="link" onClick={() => setSelectedCategory(null)}>{dict.backToCategories || "Back to categories"}</Button>
                  {cosmetics
                    .filter((c) => c.category === selectedCategory)
                    .map((cosmetic) => (
                      <CommandItem
                        key={cosmetic.id}
                        value={cosmetic.id}
                        onSelect={() => handleSelectCosmetic(cosmetic.id)}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedCosmetics.includes(cosmetic.id)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {cosmetic.brand} - {cosmetic.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
