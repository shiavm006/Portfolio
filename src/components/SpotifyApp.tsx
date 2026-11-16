"use client";

import { AnimatePresence, motion } from "motion/react";
import AudioPlayer from "@/components/ui/audio-player";

/** Official ~30s iTunes preview (not the full track). */
const SUNFLOWER = {
  title: "Sunflower",
  artist: "Post Malone, Swae Lee",
  src: "/audio/sunflower.m4a",
  cover:
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4b/30/2c/4b302cb6-7a14-5464-4e97-0577e9d0be49/18UMGIM82277.rgb.jpg/600x600bb.jpg",
};

type SpotifyAppProps = {
  open: boolean;
  onClose: () => void;
};

export default function SpotifyApp({ open, onClose }: SpotifyAppProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="mac-spotify-float"
          initial={{ opacity: 0, y: 24, scale: 0.96, x: "-50%" }}
          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
          exit={{ opacity: 0, y: 16, scale: 0.96, x: "-50%" }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="mac-spotify-float__close"
            aria-label="Close player"
            data-ui-sound="click"
            onClick={onClose}
          >
            ×
          </button>
          <AudioPlayer
            src={SUNFLOWER.src}
            cover={SUNFLOWER.cover}
            title={SUNFLOWER.title}
            artist={SUNFLOWER.artist}
            showMusicIcon
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
