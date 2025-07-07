'use client';

import * as React from 'react';
import { TextCombobox } from './text-combobox';
import { useAppStore, CategoryAlias } from '@/stores/cosmetics';
import { initialCategories } from '@/lib/initial-categories';
import { NewBrandCategoryDialog } from './new-brand-category-dialog'; // Import NewBrandCategoryDialog
import { type Dictionary } from '@/types/dictionary'; // Import Dictionary type

interface CosmeticCategorySelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  onCategoryChange?: (value: string | null) => void;
  dict: Dictionary; // Add dict prop
}

export function CosmeticCategorySelector({ value, onChange, onCategoryChange, dict }: CosmeticCategorySelectorProps) {
  const { userCategories, addUserCategory } = useAppStore();
  const [showNewCategoryDialog, setShowNewCategoryDialog] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');

  const allCategoryAliases = React.useMemo(() => {
    const combined = [...initialCategories, ...userCategories];
    // Ensure uniqueness based on canonicalName, prioritizing userCategories if canonical names are the same
    const uniqueMap = new Map<string, CategoryAlias>();
    combined.forEach(categoryAlias => {
      if (categoryAlias && typeof categoryAlias === 'object' && 'canonicalName' in categoryAlias && typeof categoryAlias.canonicalName === 'string') {
        uniqueMap.set(categoryAlias.canonicalName.toLowerCase(), categoryAlias);
      }
    });
    return Array.from(uniqueMap.values());
  }, [userCategories]);

  const allDisplayCategories = React.useMemo(() => {
    const displayNames = new Set<string>();
    allCategoryAliases.forEach(categoryAlias => {
      categoryAlias.aliases.forEach(alias => displayNames.add(alias));
    });
    return Array.from(displayNames).sort((a, b) => a.localeCompare(b));
  }, [allCategoryAliases]);

  const handleNewCategory = (newCategoryName: string) => {
    setNewCategoryName(newCategoryName);
    setShowNewCategoryDialog(true);
  };

  const handleSaveNewCategory = (categoryName: string, aliases: string[]) => {
    addUserCategory({ canonicalName: categoryName, aliases: aliases });
    if (onChange) {
      onChange(categoryName); // Set the new category as the selected value
    }
    if (onCategoryChange) {
      onCategoryChange(categoryName);
    }
    setShowNewCategoryDialog(false);
  };

  const handleCategoryChange = (selectedCategory: string) => {
    if (onChange) {
      onChange(selectedCategory);
    }
    if (onCategoryChange) {
      onCategoryChange(selectedCategory);
    }
  };

  return (
    <>
      <TextCombobox
        value={value}
        onChange={handleCategoryChange}
        options={allDisplayCategories}
        placeholder="Select or add category..."
        emptyMessage="No category found. Press Enter to add."
        onNewItem={handleNewCategory}
      />
      <NewBrandCategoryDialog
        open={showNewCategoryDialog}
        onOpenChange={setShowNewCategoryDialog}
        itemName={newCategoryName}
        onSave={handleSaveNewCategory}
        dict={dict}
        type="category"
      />
    </>
  );
}
