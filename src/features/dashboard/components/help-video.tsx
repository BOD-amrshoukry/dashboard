import { Play } from 'lucide-react';
import { useRef, useState } from 'react';

const HelpVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play video and set state to playing
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
    setIsPlaying(true);
  };

  return (
    <div className="relative rounded-level1 overflow-hidden flex items-center justify-center border-[1px] border-solid border-main">
      <video
        ref={videoRef}
        // onClick={handlePlay}
        // onPlay={handlePlay}
        // onPause={handlePause}
        className="w-full"
        controls={isPlaying} // Show controls only when playing
        preload="none" // Prevent preloading
        poster="/help.png">
        <source src="/help.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {!isPlaying && (
        <button
          className="w-[100%] absolute h-[100%] left-0 top-0 bg-black/60 flex items-center justify-center"
          onClick={handlePlay}>
          <div className="w-[40px] h-[40px] sm:w-[144px] sm:h-[144px] rounded-full bg-main-background flex items-center justify-center">
            <div className="">
              <Play size={32} />
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

export default HelpVideo;

