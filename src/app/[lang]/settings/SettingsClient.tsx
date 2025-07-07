'use client';

import { useAppStore } from '@/stores/cosmetics';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { type Dictionary } from '@/types/dictionary';
import { useRef } from 'react';

interface SettingsClientProps {
  dict: Dictionary;
}

export default function SettingsClient({ dict }: SettingsClientProps) {
  const store = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    const state = store;
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const fileName = `my-cosme-zukan-backup-${new Date().toISOString().split('T')[0]}.json`;

    // Use the File System Access API if available
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {
        // Handle errors, e.g., user canceling the save dialog
        if (err instanceof DOMException && err.name === 'AbortError') {
          console.log('File save cancelled by user.');
        } else {
          console.error('Error saving file:', err);
        }
      }
    }

    // Fallback for browsers that do not support the API
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          const restoredState = JSON.parse(json);
          if (window.confirm(dict.restoreConfirmation || 'Are you sure you want to restore the data? This will overwrite your current data.')) {
            store.restoreState(restoredState);
            alert(dict.restoreSuccess || 'Data restored successfully!');
          }
        } catch (error) {
          alert(dict.restoreError || 'Error restoring data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{dict.settings || 'Settings'}</CardTitle>
          <CardDescription>{dict.settingsDescription || 'Manage your application data.'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{dict.backupAndRestore || 'Backup & Restore'}</h3>
            <p className="text-sm text-gray-500">{dict.backupDescription || 'Save your data to a file or restore it from a backup.'}</p>
            <div className="flex space-x-2">
              <Button onClick={handleBackup}>{dict.backup || 'Backup'}</Button>
              <Button onClick={handleRestoreClick}>{dict.restore || 'Restore'}</Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
