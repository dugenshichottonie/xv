'use client';

import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PersonalColor } from '@/stores/cosmetics';
import { type Dictionary } from '@/types/dictionary';

interface NewColorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colorName: string;
  onSave: (colorName: string, personalColor: PersonalColor, aliases: string[]) => void;
  dict: Dictionary;
}

export function NewColorDialog({ open, onOpenChange, colorName, onSave, dict }: NewColorDialogProps) {
  const [selectedPersonalColor, setSelectedPersonalColor] = useState<PersonalColor>('neutral');
  const [aliasesInput, setAliasesInput] = useState('');

  const handleSave = () => {
    const aliases = aliasesInput.split(',').map(alias => alias.trim()).filter(alias => alias.length > 0);
    // Add the canonical colorName to aliases if it's not already there
    if (!aliases.some(alias => alias.toLowerCase() === colorName.toLowerCase())) {
      aliases.unshift(colorName);
    }
    onSave(colorName, selectedPersonalColor, aliases);
    onOpenChange(false);
    setAliasesInput(''); // Clear aliases input on close
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dict.addNewColor}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{dict.color}</Label>
            <span className="col-span-3">{colorName}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{dict.personalColor}</Label>
            <RadioGroup
              value={selectedPersonalColor} // Add this line
              onValueChange={(value: PersonalColor) => setSelectedPersonalColor(value)}
              className="flex col-span-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blue" id="blue" />
                <Label htmlFor="blue">{dict.blueBase || 'ブルべ'}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yellow" id="yellow" />
                <Label htmlFor="yellow">{dict.yellowBase || 'イエベ'}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="neutral" />
                <Label htmlFor="neutral">{dict.neutral || 'ニュートラル'}</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="aliases" className="text-right">{dict.aliases}</Label>
            <Input
              id="aliases"
              value={aliasesInput}
              onChange={(e) => setAliasesInput(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Blue, 青, あお (comma separated)"
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