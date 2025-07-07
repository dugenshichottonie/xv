'use client';

import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { type Dictionary } from '@/types/dictionary';

interface NewBrandCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onSave: (itemName: string, aliases: string[]) => void;
  dict: Dictionary;
  type: 'brand' | 'category';
}

export function NewBrandCategoryDialog({ open, onOpenChange, itemName, onSave, dict, type }: NewBrandCategoryDialogProps) {
  const [aliasesInput, setAliasesInput] = useState('');

  const handleSave = () => {
    const aliases = aliasesInput.split(',').map(alias => alias.trim()).filter(alias => alias.length > 0);
    // Add the canonical itemName to aliases if it's not already there
    if (!aliases.some(alias => alias.toLowerCase() === itemName.toLowerCase())) {
      aliases.unshift(itemName);
    }
    onSave(itemName, aliases);
    onOpenChange(false);
    setAliasesInput(''); // Clear aliases input on close
  };

  const dialogTitle = type === 'brand' ? dict.addNewBrand : dict.addNewCategory;
  const itemLabel = type === 'brand' ? dict.brand : dict.category;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{itemLabel}</Label>
            <span className="col-span-3">{itemName}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="aliases" className="text-right">{dict.aliases}</Label>
            <Input
              id="aliases"
              value={aliasesInput}
              onChange={(e) => setAliasesInput(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Alias1, Alias2 (comma separated)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>{dict.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
