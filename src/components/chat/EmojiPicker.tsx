"use client";

import { SmileIcon } from "lucide-react";
import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  onEmojiChange: (emoji: string) => void;
}
const EmojiPicker = ({ onEmojiChange }: EmojiPickerProps) => {
  const { theme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="size-5 text-muted-foreground hover:text-foreground transition cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Picker
          emojiSize={18}
          data={data}
          maxFrequentRows={1}
          theme={theme === "dark" ? "dark" : "light"}
          onEmojiSelect={(emoji: any) => onEmojiChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
