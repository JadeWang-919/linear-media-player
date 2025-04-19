import { FC } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
};

const Controls: FC<Props> = ({ isPlaying, onPlayPause, onNext, onPrev }) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Previous Button */}
      <Button
        onClick={onPrev}
        variant="ghost"
        size="icon"
        aria-label="Previous track"
        className="cursor-pointer dark:text-zinc-100"
      >
        <SkipBack />
      </Button>

      {/* Play / Pause Button */}
      <Button
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="cursor-pointer h-12 w-12 rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200 transition-all flex items-center justify-center"
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>

      {/* Next Button */}
      <Button
        onClick={onNext}
        variant="ghost"
        size="icon"
        aria-label="Next track"
        className="cursor-pointer dark:text-zinc-100"
      >
        <SkipForward />
      </Button>
    </div>
  );
};

export default Controls;
