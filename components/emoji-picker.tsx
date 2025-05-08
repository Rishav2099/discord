"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPickerButton = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" || resolvedTheme === "dark" ? (resolvedTheme as Theme) : undefined;

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={180}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <EmojiPicker
          theme={theme}
          onEmojiClick={(emoji) => onChange(emoji.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};