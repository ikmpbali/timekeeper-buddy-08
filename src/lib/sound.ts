// Utility to play a notification sound using Web Audio API
export const playAlarmSound = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const playBeep = (time: number, freq: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
    osc.start(time);
    osc.stop(time + duration);
  };

  // Three ascending beeps
  const now = ctx.currentTime;
  playBeep(now, 660, 0.15);
  playBeep(now + 0.2, 880, 0.15);
  playBeep(now + 0.4, 1100, 0.3);
};
