import { FC } from "react";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  volume: number;
  setVolume: (val: number) => void;
};

const VolumeSlider: FC<Props> = ({ volume, setVolume }) => {
  const muted = volume === 0;

  return (
    <div className="flex items-center gap-2">
      {muted ? (
        <VolumeX className="h-5 w-5 text-zinc-600 dark:text-zinc-100" />
      ) : (
        <Volume2 className="h-5 w-5 text-zinc-600 dark:text-zinc-100" />
      )}
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={[volume]}
        onValueChange={([val]) => setVolume(val)}
        className="w-32 cursor-pointer"
      />
    </div>
  );
};

export default VolumeSlider;
