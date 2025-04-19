import { FC } from "react";

type Props = {
  trackName: string;
  playlistName: string;
  artist: string;
  year: number;
};

const TrackInfo: FC<Props> = ({ trackName, playlistName, artist, year }) => {
  return (
    <div className="text-center space-y-1">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        {trackName}
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {artist} ・ {playlistName} ・ {year}
      </p>
    </div>
  );
};

export default TrackInfo;
