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
import { colors } from '@/lib/colors';

interface ColorComboboxProps {
  value: string;
  onChange: (value: string, personalColor: 'blue' | 'yellow' | 'neutral') => void;
}

export function ColorCombobox({ value, onChange }: ColorComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  const handleSelect = (currentValue: string) => {
    const selectedColor = colors.find((color) => color.value === currentValue);
    if (selectedColor) {
      setInputValue(selectedColor.label);
      onChange(selectedColor.value, selectedColor.personalColor);
    } else {
      // If no matching color is found, treat the input value as a custom color
      // and assign a default personalColor (e.g., 'neutral')
      onChange(currentValue, 'neutral');
    }
    setOpen(false);
  };

  

  const handleInputBlur = () => {
    const matchedColor = colors.find(
      (color) => color.label.toLowerCase() === inputValue.toLowerCase()
    );
    if (matchedColor) {
      onChange(matchedColor.value, matchedColor.personalColor);
    } else {
      onChange(inputValue, 'neutral'); // Treat as neutral if not in list
    }
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
          {value
            ? colors.find((color) => color.value === value)?.label || value
            : 'Select color...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Search color..."
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={handleInputBlur}
          />
          <CommandEmpty>No color found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {colors
                .filter((color) =>
                  color.label.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((color) => (
                  <CommandItem
                    key={color.value}
                    value={color.value}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === color.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {color.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
