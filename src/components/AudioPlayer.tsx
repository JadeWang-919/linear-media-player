import { useRef, useState, useEffect, KeyboardEvent } from "react";
import playlistData from "@/data/playlists.json";
import TrackInfo from "./TrackInfo";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import VolumeSlider from "./VolumeSlider";
import { motion } from "motion/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);

  const selectedPlaylist = playlistData.playlists[selectedPlaylistIndex];
  const currentTrack = selectedPlaylist.tracks[currentTrackIndex];

  // Play when metadata is ready
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => {
      console.log("✅ Metadata loaded for", currentTrack.name);
      if (isPlaying) {
        audio
          .play()
          .then(() => console.log("🎵 Playback started:", currentTrack.name))
          .catch((err) =>
            console.warn("❌ Play failed after metadata loaded:", err)
          );
      }
    };

    audio.addEventListener("loadedmetadata", handleLoaded);
    return () => audio.removeEventListener("loadedmetadata", handleLoaded);
  }, [currentTrack.url, currentTrack.name, isPlaying]);

  // Reset progress when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
  }, [currentTrack.url]);

  // Progress bar update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100 || 0;
      setProgress(percent);
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [currentTrack.url]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentTrack.url]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (!isPlaying && audio.readyState < 2) {
      console.warn("⚠️ Audio not ready to play yet.");
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.warn("❌ Manual play blocked:", err));
    }

    setIsPlaying((prev) => !prev);
  };

  const playNext = () => {
    const trackCount = selectedPlaylist.tracks.length;
    setCurrentTrackIndex((prev) => (prev + 1) % trackCount);
  };

  const playPrev = () => {
    const trackCount = selectedPlaylist.tracks.length;
    setCurrentTrackIndex((prev) => (prev === 0 ? trackCount - 1 : prev - 1));
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = (value / 100) * (audio.duration || 0);
    setProgress(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Space") {
      e.preventDefault();
      togglePlay();
    }
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto p-6 space-y-6 rounded-2xl shadow-xl bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-800 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Playlist Selector */}
      <div className="flex justify-center items-center gap-4">
        <p>Current Playlist:</p>
        <Select
          value={String(selectedPlaylistIndex)}
          onValueChange={(val) => {
            setSelectedPlaylistIndex(Number(val));
            setCurrentTrackIndex(0);
            setIsPlaying(false);
            setProgress(0); // Also reset UI progress immediately
          }}
        >
          <SelectTrigger className="w-[220px] bg-white dark:bg-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-md">
            <SelectValue placeholder="Choose a playlist" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-100 border border-zinc-300 rounded-lg shadow-lg">
            {playlistData.playlists.map((p, i) => (
              <SelectItem
                key={i}
                value={String(i)}
                className="hover:bg-zinc-100 dark:hover:bg-zinc-200"
              >
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Track Info */}
      <motion.div
        key={`${selectedPlaylistIndex}-${currentTrackIndex}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <TrackInfo
          trackName={currentTrack.name}
          playlistName={selectedPlaylist.name}
          artist={selectedPlaylist["artist:"]}
          year={selectedPlaylist.year}
        />
      </motion.div>

      {/* Controls */}
      <Controls
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        onNext={playNext}
        onPrev={playPrev}
      />

      {/* Audio Element */}
      <audio
        key={currentTrack.url}
        ref={audioRef}
        src={currentTrack.url}
        onEnded={playNext}
        preload="metadata"
      />

      {/* Progress Bar */}
      <ProgressBar
        progress={progress}
        onSeek={handleSeek}
        duration={audioRef.current?.duration || 0}
      />

      {/* Volume + Track List */}
      <div className="flex items-center flex-col gap-6 md:flex-row md:justify-between">
        <VolumeSlider volume={volume} setVolume={setVolume} />

        <div className="w-full md:w-3/4 max-h-40 overflow-y-auto bg-zinc-200/50 dark:bg-zinc-800 rounded-lg px-4 py-2">
          <h3 className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-200">
            Tracks in playlist
          </h3>
          <ul className="space-y-1 text-sm">
            {selectedPlaylist.tracks.map((track, i) => (
              <li
                key={i}
                onClick={() => {
                  setCurrentTrackIndex(i);
                  setIsPlaying(true);
                }}
                className={cn(
                  "cursor-pointer px-3 py-1.5 rounded-md transition-colors",
                  i === currentTrackIndex
                    ? "bg-zinc-700 text-white dark:bg-zinc-100 dark:text-black"
                    : "dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                )}
              >
                {track.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
