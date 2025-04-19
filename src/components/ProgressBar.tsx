import { FC } from "react";
import { Slider } from "@/components/ui/slider";

type Props = {
  progress: number; // 0 to 100
  onSeek: (value: number) => void;
  duration: number;
};

const ProgressBar: FC<Props> = ({ progress, onSeek, duration }) => {
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-zinc-500 px-1 pb-1">
        <span>{formatTime((progress / 100) * duration)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <Slider
        value={[progress]}
        max={100}
        step={1}
        onValueChange={([val]) => onSeek(val)}
        className="cursor-pointer"
      />
    </div>
  );
};

export default ProgressBar;
