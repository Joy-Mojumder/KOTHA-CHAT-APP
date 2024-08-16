"use client";
import { MoonIcon, SunIcon, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { usePreferences, useVolume } from "@/hooks/usePreferences";
import useSound from "use-sound";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useEffect } from "react";

const Preferences = () => {
  const { setTheme } = useTheme();
  const { volume, setVolume } = useVolume();

  const { soundEnabled, setSoundEnabled } = usePreferences();

  const [playSoundClick] = useSound("/sounds/mouse-click.mp3", { volume });
  const [playSoundOn] = useSound("/sounds/sound-on.mp3", { volume });
  const [playSoundOff] = useSound("/sounds/sound-off.mp3", { volume: 0.3 });

  useEffect(() => {
    if (volume === 0) {
      setSoundEnabled(false);
      playSoundOff();
    } else {
      setSoundEnabled(true);
    }
  }, [volume, setSoundEnabled, playSoundOff]);
  return (
    <div className="flex flex-wrap gap-2 px-1 md:px-2">
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => {
          setTheme("light");
          soundEnabled && playSoundClick();
        }}
      >
        <SunIcon className="size-[1.2rem] text-muted-foreground" />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => {
          setTheme("dark");
          soundEnabled && playSoundClick();
        }}
      >
        <MoonIcon className="size-[1.2rem] text-muted-foreground" />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <Volume2 className="size-[1.2rem] text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex justify-center items-center gap-2">
            <input
              type="range"
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              min={0}
              value={volume * 100}
              max={100}
              className="bg-muted-foreground h-2 w-full rounded-lg appearance-none"
            />
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                soundEnabled ? playSoundOff() : playSoundOn();
              }}
            >
              {soundEnabled ? (
                <Volume2 className="size-[1.2rem] text-muted-foreground" />
              ) : (
                <VolumeX className="size-[1.2rem] text-muted-foreground" />
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Preferences;
