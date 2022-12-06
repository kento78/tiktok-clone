import React, { useState, useEffect, useRef } from "react";
import SoundOff from "../../icons/SoundOff";
import SoundOn from "../../icons/SoundOn";
import { formatVideoTime } from "../../utils/contants";
import { GiPauseButton } from "react-icons/gi";
import { FaPlay } from "react-icons/fa";

interface ControlsProps {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  showSeekTime?: boolean;
  setSound: Function;
  isSoundOn: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  videoRef,
  showSeekTime,
  isSoundOn,
  setSound,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlay, setIsPlay] = useState(false);

  const progressRef = useRef<HTMLDivElement | null>(null);

  const handleSeekTime = (e: MouseEvent) => {
    const clientX = e.clientX;
    const left = progressRef.current?.getBoundingClientRect().left;
    const width = progressRef.current?.getBoundingClientRect().width;
    const percent = (clientX - left!) / width!;

    document.body.style.userSelect = "none";

    if (videoRef !== null && videoRef?.current !== null) {
      videoRef.current.currentTime = percent * videoRef.current?.duration!;
    }

    setCurrentTime(percent * videoRef?.current?.duration!);
  };

  const handleSeekTimeMobile = (e: TouchEvent) => {
    const clientX = e.touches[0]?.clientX!;
    const left = progressRef.current?.getBoundingClientRect().left;
    const width = progressRef.current?.getBoundingClientRect().width;
    const percent = (clientX - left!) / width!;

    document.body.style.userSelect = "none";

    if (videoRef !== null && videoRef?.current !== null) {
      videoRef.current.currentTime = percent * videoRef.current?.duration!;
    }

    setCurrentTime(percent * videoRef?.current?.duration!);
  };

  const handlePlayPause = () => {
    if (isPlay && videoRef.current?.play) {
      videoRef.current?.pause();
      setIsPlay(false);
    } else {
      videoRef.current?.play();
      setIsPlay(true);
    }
  };

  // handle seek when click progressbar
  useEffect(() => {
    progressRef?.current?.addEventListener("click", handleSeekTime);

    return () => {
      progressRef?.current?.addEventListener("click", handleSeekTime);
    };
  }, []);

  // handle toggle sound
  useEffect(() => {
    if (isSoundOn) {
      if (videoRef !== null && videoRef?.current !== null) {
        videoRef.current.muted = false;
      }
    } else {
      if (videoRef !== null && videoRef?.current !== null) {
        videoRef.current.muted = true;
      }
    }
  }, [isSoundOn]);

  // handle time update
  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(videoRef?.current?.currentTime!);
    };

    videoRef?.current?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoRef?.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // handle seek time in pc with mouse event
  useEffect(() => {
    progressRef?.current?.addEventListener("mousedown", () => {
      document.addEventListener("mousemove", handleSeekTime);
    });

    return () => {
      progressRef?.current?.removeEventListener("mousedown", () => {
        document.addEventListener("mousemove", handleSeekTime);
      });
    };
  }, []);

  // remove mouse move when mouse up
  useEffect(() => {
    document?.addEventListener("mouseup", () => {
      document.body.style.userSelect = "auto";
      document.removeEventListener("mousemove", handleSeekTime);
    });

    return () => {
      document?.removeEventListener("mouseup", () => {
        document.body.style.userSelect = "auto";
        document.removeEventListener("mousemove", handleSeekTime);
      });
    };
  }, []);

  // handle state isPlay when audio onPlay, onPause
  useEffect(() => {
    videoRef?.current?.addEventListener("play", () => {
      setIsPlay(true);
    });

    videoRef?.current?.addEventListener("pause", () => {
      setIsPlay(false);
    });

    return () => {
      videoRef?.current?.removeEventListener("play", () => {
        setIsPlay(true);
      });

      videoRef?.current?.removeEventListener("pause", () => {
        setIsPlay(false);
      });
    };
  }, []);

  // handle seek time in mobile with touch event
  useEffect(() => {
    progressRef?.current?.addEventListener("touchstart", () => {
      document.addEventListener("touchmove", handleSeekTimeMobile);
    });

    return () => {
      progressRef?.current?.removeEventListener("touchstart", () => {
        document.addEventListener("touchmove", handleSeekTimeMobile);
      });
    };
  }, []);

  useEffect(() => {
    progressRef?.current?.addEventListener("touchend", () => {
      document.removeEventListener("touchmove", handleSeekTimeMobile);
    });

    return () => {
      progressRef?.current?.removeEventListener("touchend", () => {
        document.removeEventListener("touchmove", handleSeekTimeMobile);
      });
    };
  }, []);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-[9998] flex items-center p-2 lg:p-5"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className="flex flex-1 items-center">
        <div
          onClick={handlePlayPause}
          className="mr-2 flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full bg-[#2f2f2f] lg:mr-4"
        >
          {isPlay ? <GiPauseButton fontSize={15} /> : <FaPlay fontSize={15} />}
        </div>

        <div
          style={{ display: showSeekTime ? "flex" : "none" }}
          className="flex flex-1 items-center"
        >
          <p className="text-sm font-semibold">
            {formatVideoTime(currentTime)}
          </p>
          <div
            ref={progressRef}
            className="mx-2 flex-1 cursor-pointer py-3 lg:mx-4"
          >
            <div className="relative h-[3px] w-full overflow-hidden rounded-sm bg-[#2f2f2f]">
              <div
                style={{
                  width: `${
                    (currentTime * 100) / videoRef?.current?.duration!
                  }%`,
                }}
                className={`absolute top-0 bottom-0 bg-white`}
              />
            </div>
          </div>
          <p className="text-sm font-semibold">
            {formatVideoTime(videoRef?.current?.duration!)}
          </p>
        </div>
      </div>
      <div
        onClick={() => setSound()}
        className="ml-2 flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full bg-[#2f2f2f] lg:ml-5"
      >
        {isSoundOn ? <SoundOn /> : <SoundOff />}
      </div>
    </div>
  );
};

export default Controls;
