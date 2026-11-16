"use client";

import { useEffect, useRef, useState } from "react";
import {
  Music2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function CustomSlider({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "relative h-1 w-full cursor-pointer rounded-full bg-white/20",
        className,
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full rounded-full bg-white"
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
}

export type AudioPlayerProps = {
  src: string;
  cover?: string;
  title?: string;
  artist?: string;
  showMusicIcon?: boolean;
  onPrev?: () => void;
  onNext?: (opts?: { shuffled?: boolean }) => void;
  className?: string;
};

export default function AudioPlayer({
  src,
  cover,
  title,
  artist,
  showMusicIcon = false,
  onPrev,
  onNext,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const resume = isPlaying;
    audio.pause();
    audio.load();
    setProgress(0);
    setCurrentTime(0);
    if (resume) {
      void audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(false);
    }
    // Only react to track changes; keep current play intent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = isRepeat;
  }, [isRepeat]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const next = (audio.currentTime / audio.duration) * 100;
    setProgress(isFinite(next) ? next : 0);
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio?.duration) return;
    const time = (value / 100) * audio.duration;
    if (!isFinite(time)) return;
    audio.currentTime = time;
    setProgress(value);
  };

  const handleSkip = (type: "prev" | "next") => {
    if (type === "prev" && onPrev) {
      onPrev();
      return;
    }
    if (type === "next" && onNext) {
      onNext({ shuffled: isShuffle });
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime =
      type === "prev"
        ? Math.max(0, audio.currentTime - 10)
        : Math.min(audio.duration || 0, audio.currentTime + 10);
  };

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "relative mx-auto flex h-auto w-[280px] flex-col overflow-hidden rounded-3xl bg-[#11111198] p-3 shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm",
          className,
        )}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
          delay: 0.1,
          type: "spring",
        }}
        layout
      >
        <audio
          ref={audioRef}
          src={src}
          className="hidden"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={() => {
            if (isRepeat) return;
            // Keep play intent so the next track auto-starts via the src effect.
            onNext?.({ shuffled: isShuffle });
          }}
        />

        <motion.div
          className="relative flex flex-col"
          layout
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {cover ? (
            <motion.div className="relative h-[180px] w-full overflow-hidden rounded-[16px] bg-white/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={title ? `${title} cover` : "cover"}
                className="h-full w-full object-cover"
                draggable={false}
              />
              {showMusicIcon ? (
                <div className="pointer-events-none absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm">
                  <Music2 className="size-4" strokeWidth={2.25} />
                </div>
              ) : null}
            </motion.div>
          ) : null}

          <motion.div className="flex w-full flex-col gap-y-2">
            {title ? (
              <motion.div className="mt-1 text-center">
                <h3 className="inline-flex items-center justify-center gap-1.5 text-base font-bold text-white">
                  {showMusicIcon ? (
                    <Music2
                      className="size-3.5 shrink-0 text-white/85"
                      strokeWidth={2.25}
                      aria-hidden
                    />
                  ) : null}
                  {title}
                </h3>
                {artist ? (
                  <p className="text-xs text-white/65">{artist}</p>
                ) : null}
              </motion.div>
            ) : null}

            <motion.div className="flex flex-col gap-y-1">
              <CustomSlider
                value={progress}
                onChange={handleSeek}
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">
                  {formatTime(currentTime)}
                </span>
                <span className="text-sm text-white">
                  {formatTime(duration)}
                </span>
              </div>
            </motion.div>

            <motion.div className="flex w-full items-center justify-center">
              <div className="flex w-fit items-center gap-2 rounded-[16px] bg-[#11111198] p-2">
                <ControlButton
                  active={isShuffle}
                  label="Shuffle"
                  onClick={() => setIsShuffle((v) => !v)}
                >
                  <Shuffle className="size-5" />
                </ControlButton>
                <ControlButton label="Previous" onClick={() => handleSkip("prev")}>
                  <SkipBack className="size-5" />
                </ControlButton>
                <ControlButton label={isPlaying ? "Pause" : "Play"} onClick={togglePlay}>
                  {isPlaying ? (
                    <Pause className="size-5" />
                  ) : (
                    <Play className="size-5" />
                  )}
                </ControlButton>
                <ControlButton label="Next" onClick={() => handleSkip("next")}>
                  <SkipForward className="size-5" />
                </ControlButton>
                <ControlButton
                  active={isRepeat}
                  label="Repeat"
                  onClick={() => setIsRepeat((v) => !v)}
                >
                  <Repeat className="size-5" />
                </ControlButton>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ControlButton({
  children,
  onClick,
  active = false,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active || undefined}
        data-ui-sound="click"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          "flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-[#111111d1] hover:text-white",
          active && "bg-[#111111d1] text-white",
        )}
      >
        {children}
      </button>
    </motion.div>
  );
}
