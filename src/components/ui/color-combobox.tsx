'use client';

import * as React from 'react';
import { TextCombobox } from './text-combobox';
import { useAppStore, ColorAlias } from '@/stores/cosmetics';
import { initialColors } from '@/lib/colors';
import { NewColorDialog } from './new-color-dialog'; // Import NewColorDialog
import { type Dictionary } from '@/types/dictionary'; // Import Dictionary type

interface ColorComboboxProps {
  value: string;
  onChange: (value: string, personalColor: ColorAlias['personalColor']) => void;
  dict: Dictionary; // Add dict prop
}

export function ColorCombobox({ value, onChange, dict }: ColorComboboxProps) {
  const { userColors, addUserColor } = useAppStore();
  const [showNewColorDialog, setShowNewColorDialog] = React.useState(false);
  const [newColorName, setNewColorName] = React.useState('');

  const allColorAliases = React.useMemo(() => {
    const combined = [...initialColors, ...userColors];
    // Ensure uniqueness based on canonicalName, prioritizing userColors if canonical names are the same
    const uniqueMap = new Map<string, ColorAlias>();
    combined.forEach(colorAlias => {
      if (colorAlias && typeof colorAlias === 'object' && 'canonicalName' in colorAlias && typeof colorAlias.canonicalName === 'string') {
        uniqueMap.set(colorAlias.canonicalName.toLowerCase(), colorAlias);
      }
    });
    return Array.from(uniqueMap.values());
  }, [userColors]);

  const allDisplayColors = React.useMemo(() => {
    const displayNames = new Set<string>();
    allColorAliases.forEach(colorAlias => {
      colorAlias.aliases.forEach(alias => displayNames.add(alias));
    });
    return Array.from(displayNames).sort((a, b) => a.localeCompare(b));
  }, [allColorAliases]);

  const handleNewColor = (newColorName: string) => {
    setNewColorName(newColorName);
    setShowNewColorDialog(true);
  };

  const handleSaveNewColor = (colorName: string, personalColor: ColorAlias['personalColor'], aliases: string[]) => {
    addUserColor({ canonicalName: colorName, aliases: aliases, personalColor: personalColor });
    onChange(colorName, personalColor); // Set the new color as the selected value
    setShowNewColorDialog(false);
  };

  const handleColorChange = (selectedColor: string) => {
    let resolvedPersonalColor: ColorAlias['personalColor'] = 'neutral';

    // Iterate through all known color aliases to find a match and resolve personal color
    for (const colorAlias of allColorAliases) {
      if (colorAlias.aliases.some(alias => alias.toLowerCase() === selectedColor.toLowerCase())) {
        resolvedPersonalColor = colorAlias.personalColor;
        break; // Found a match, no need to continue searching
      }
    }
    onChange(selectedColor, resolvedPersonalColor); // Pass the selected color directly and its resolved personal color
  };

  return (
    <>
      <TextCombobox
        value={value}
        onChange={handleColorChange}
        options={allDisplayColors}
        placeholder="Select or add color..."
        emptyMessage="No color found. Press Enter to add."
        onNewItem={handleNewColor}
      />
      <NewColorDialog
        open={showNewColorDialog}
        onOpenChange={setShowNewColorDialog}
        colorName={newColorName}
        onSave={handleSaveNewColor}
        dict={dict}
      />
    </>
  );
}
