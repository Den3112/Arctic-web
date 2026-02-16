'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, Paintbrush } from 'lucide-react';
import { useState } from 'react';

const COLORS = [
  '#000000', // Black
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#ec4899', // Pink
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <div className="flex w-full items-center gap-2">
            {value ? (
              <div
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: value }}
              />
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <span className="flex-1 truncate">
              {value ? value : 'Pick a color'}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 z-300">
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              className={cn(
                'group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                value === color && 'ring-2 ring-ring ring-offset-2'
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color);
                setOpen(false);
              }}
              type="button"
            >
              {value === color && (
                <Check className="h-4 w-4 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
