import { appConfig } from "../config/appConfig";

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!appConfig.soundEnabled) return null;
  audioContext ??= new AudioContext();
  return audioContext;
};

const playTone = (frequency: number, start: number, duration: number, gainValue: number, type: OscillatorType = "sine") => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(ctx.currentTime + start);
  oscillator.stop(ctx.currentTime + start + duration + 0.03);
};

export const playGallopSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  [0, 0.12, 0.34, 0.46, 0.7, 0.82, 1.06, 1.18].forEach((time, index) => {
    playTone(index % 2 === 0 ? 150 : 115, time, 0.07, 0.13, "triangle");
  });

  playTone(520, 1.34, 0.2, 0.045, "sine");
  playTone(760, 1.44, 0.28, 0.04, "sine");
  playTone(620, 1.62, 0.22, 0.032, "sine");
};

export const playHappySound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  [523, 659, 784, 1046].forEach((frequency, index) => {
    playTone(frequency, index * 0.09, 0.15, 0.045, "sine");
  });
};
