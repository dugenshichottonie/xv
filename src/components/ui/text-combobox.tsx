'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TextComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[]; // Make options optional and provide a default empty array
  placeholder?: string;
  emptyMessage?: string;
  onNewItem?: (newItem: string) => void;
}

export function TextCombobox({
  value,
  onChange,
  options = [], // Default to empty array
  placeholder = 'Select or add...',
  emptyMessage = 'No item found. Press Enter to add.',
  onNewItem,
}: TextComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSelect = (currentValue: string) => {
    const finalValue = currentValue.trim();
    if (finalValue) {
      onChange(finalValue);
    }
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedInputValue = inputValue.trim();
      if (trimmedInputValue) {
        const foundItem = options.find(item => item.toLowerCase() === trimmedInputValue.toLowerCase());
        if (foundItem) {
          onChange(foundItem);
        } else if (onNewItem) {
          onNewItem(trimmedInputValue);
        } else {
          onChange(trimmedInputValue);
        }
      }
      setOpen(false);
    }
  };

  // Ensure value is a string before calling toLowerCase
  const normalizedValue = typeof value === 'string' ? value : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {normalizedValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command
          filter={(itemValue, search) => {
            // Ensure search is a string before calling toLowerCase
            if (typeof search !== 'string') {
              return 0; // Or handle as appropriate, e.g., return 1 to show all if search is empty
            }
            if (itemValue.toLowerCase().startsWith(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((item) => {
                // item が文字列でない場合はスキップ
                if (typeof item !== 'string') {
                  return null;
                }
                return (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={() => handleSelect(item)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        normalizedValue.toLowerCase() === item.toLowerCase() ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {item}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}