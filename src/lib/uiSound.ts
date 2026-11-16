"use client";

const KEY_SAMPLES = [
  "/sounds/keys/key1.mp3",
  "/sounds/keys/key2.mp3",
  "/sounds/keys/key3.mp3",
  "/sounds/keys/key4.mp3",
  "/sounds/keys/key5.mp3",
] as const;

const FOLDER_SAMPLES = [
  "/sounds/folder/fold1.mp3",
  "/sounds/folder/fold2.mp3",
  "/sounds/folder/fold3.mp3",
  "/sounds/folder/fold4.mp3",
  "/sounds/folder/fold5.mp3",
] as const;

const MUTE_KEY = "portfolio-ui-sound-muted";

let ctx: AudioContext | null = null;
let keyBuffers: AudioBuffer[] = [];
let folderBuffers: AudioBuffer[] = [];
let loading: Promise<void> | null = null;
let muted = false;
let muteHydrated = false;
const muteListeners = new Set<(value: boolean) => void>();

function readStoredMute() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeStoredMute(value: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    /* ignore quota / private mode */
  }
}

function hydrateMute() {
  if (muteHydrated || typeof window === "undefined") return;
  muteHydrated = true;
  muted = readStoredMute();
}

export function isUiSoundMuted() {
  hydrateMute();
  return muted;
}

export function setUiSoundMuted(value: boolean) {
  hydrateMute();
  if (muted === value) return;
  muted = value;
  writeStoredMute(value);
  for (const listener of muteListeners) listener(value);
}

export function toggleUiSoundMuted() {
  setUiSoundMuted(!isUiSoundMuted());
  return muted;
}

export function subscribeUiSoundMuted(listener: (value: boolean) => void) {
  muteListeners.add(listener);
  return () => {
    muteListeners.delete(listener);
  };
}

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

async function decodeAll(audio: AudioContext, sources: readonly string[]) {
  return Promise.all(
    sources.map(async (src) => {
      const res = await fetch(src);
      const data = await res.arrayBuffer();
      return audio.decodeAudioData(data.slice(0));
    }),
  );
}

async function loadSamples() {
  const audio = getCtx();
  if (!audio) return;
  if (!keyBuffers.length) keyBuffers = await decodeAll(audio, KEY_SAMPLES);
  if (!folderBuffers.length)
    folderBuffers = await decodeAll(audio, FOLDER_SAMPLES);
}

function playFrom(
  buffers: AudioBuffer[],
  opts: { rate: number; rateJitter: number; volume: number; shelfGain: number },
) {
  const audio = getCtx();
  if (!audio || !buffers.length) return false;

  const buffer = buffers[Math.floor(Math.random() * buffers.length)]!;
  const source = audio.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = opts.rate + Math.random() * opts.rateJitter;

  const gain = audio.createGain();
  gain.gain.value = opts.volume;

  const high = audio.createBiquadFilter();
  high.type = "highshelf";
  high.frequency.value = 2500;
  high.gain.value = opts.shelfGain;

  source.connect(high);
  high.connect(gain);
  gain.connect(audio.destination);
  source.start(0);
  return true;
}

function ensureLoaded(then: () => void) {
  if (keyBuffers.length && folderBuffers.length) {
    then();
    return;
  }
  loading ??= loadSamples().catch(() => {
    loading = null;
  });
  void loading.then(then);
}

/** Cherry MX Blue — default UI / dock click. */
export function playClick() {
  hydrateMute();
  if (muted) return;
  ensureLoaded(() => {
    if (muted) return;
    playFrom(keyBuffers, {
      rate: 1.15,
      rateJitter: 0.2,
      volume: 0.85,
      shelfGain: 4,
    });
  });
}

/** Buckling-spring — deeper open sound for desktop folders. */
export function playFolderClick() {
  hydrateMute();
  if (muted) return;
  ensureLoaded(() => {
    if (muted) return;
    playFrom(folderBuffers, {
      rate: 0.92,
      rateJitter: 0.12,
      volume: 0.95,
      shelfGain: 1.5,
    });
  });
}

/** Soft macOS-style two-tone notification chime (synth). */
export function playNotify() {
  hydrateMute();
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;

  const now = audio.currentTime;
  const master = audio.createGain();
  master.gain.value = 0.22;
  master.connect(audio.destination);

  const tones: [number, number, number][] = [
    [880, 0, 0.18],
    [1174.7, 0.08, 0.28],
  ];

  for (const [freq, delay, dur] of tones) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.9, now + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + delay);
    osc.stop(now + delay + dur + 0.02);
  }
}

export function initUiSound() {
  hydrateMute();
  getCtx();
  loading ??= loadSamples().catch(() => {
    loading = null;
  });
}
