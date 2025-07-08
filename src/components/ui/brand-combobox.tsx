'use client';

import * as React from 'react';
import { TextCombobox } from './text-combobox';
import { useAppStore, BrandAlias } from '@/stores/cosmetics';
import { initialBrands } from '@/lib/initial-brands';
import { NewBrandCategoryDialog } from './new-brand-category-dialog'; // Import NewBrandCategoryDialog
import { type Dictionary } from '@/types/dictionary'; // Import Dictionary type

interface BrandComboboxProps {
  value: string;
  onChange: (value: string) => void;
  dict: Dictionary; // Add dict prop
}

export function BrandCombobox({ value, onChange, dict }: BrandComboboxProps) {
  const { userBrands, addUserBrand } = useAppStore();
  const [showNewBrandDialog, setShowNewBrandDialog] = React.useState(false);
  const [newBrandName, setNewBrandName] = React.useState('');

  const allBrandAliases = React.useMemo(() => {
    const combined = [...initialBrands, ...userBrands];
    // Ensure uniqueness based on canonicalName, prioritizing userBrands if canonical names are the same
    const uniqueMap = new Map<string, BrandAlias>();
    combined.forEach(brandAlias => {
      if (brandAlias && typeof brandAlias === 'object' && 'canonicalName' in brandAlias && typeof brandAlias.canonicalName === 'string') {
        uniqueMap.set(brandAlias.canonicalName.toLowerCase(), brandAlias);
      }
    });
    return Array.from(uniqueMap.values());
  }, [userBrands]);

  const allDisplayBrands = React.useMemo(() => {
    const displayNames = new Set<string>();
    allBrandAliases.forEach(brandAlias => {
      brandAlias.aliases.forEach(alias => displayNames.add(alias));
    });
    return Array.from(displayNames).sort((a, b) => a.localeCompare(b));
  }, [allBrandAliases]);

  const handleNewBrand = (newBrandName: string) => {
    setNewBrandName(newBrandName);
    setShowNewBrandDialog(true);
  };

  const handleSaveNewBrand = (brandName: string, aliases: string[]) => {
    addUserBrand({ canonicalName: brandName, aliases: aliases });
    onChange(brandName); // Set the new brand as the selected value
    setShowNewBrandDialog(false);
  };

  const handleBrandChange = (selectedBrand: string) => {
    let canonicalName = selectedBrand; // Default to the selected brand itself

    // Iterate through all known brand aliases to find a match
    for (const brandAlias of allBrandAliases) {
      if (brandAlias.aliases.some(alias => alias.toLowerCase() === selectedBrand.toLowerCase())) {
        onChange(selectedBrand); // Pass the selected brand directly to the parent
  };

  return (
    <>
      <TextCombobox
        value={value}
        onChange={handleBrandChange}
        options={allDisplayBrands}
        placeholder="Select or add brand..."
        emptyMessage="No brand found. Press Enter to add."
        onNewItem={handleNewBrand}
      />
      <NewBrandCategoryDialog
        open={showNewBrandDialog}
        onOpenChange={setShowNewBrandDialog}
        itemName={newBrandName}
        onSave={handleSaveNewBrand}
        dict={dict}
        type="brand"
      />
    </>
  );
}
