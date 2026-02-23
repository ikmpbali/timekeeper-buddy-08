import { useState, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const pad = (n: number) => String(n).padStart(2, "0");

const formatTime = (ms: number) => {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(cs)}`;
};

const Stopwatch = () => {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const startRef = useRef(0);

  const start = useCallback(() => {
    startRef.current = Date.now() - elapsed;
    intervalRef.current = window.setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 31);
    setRunning(true);
  }, [elapsed]);

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsed(0);
    setRunning(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-widest">
        <Timer className="w-4 h-4" />
        Stopwatch
      </div>
      <div
        className="text-4xl md:text-6xl font-mono font-semibold text-foreground"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {formatTime(elapsed)}
      </div>
      <div className="flex gap-3">
        {!running ? (
          <Button onClick={start} className="gap-2 px-6">
            <Play className="w-4 h-4" /> Start
          </Button>
        ) : (
          <Button onClick={pause} variant="secondary" className="gap-2 px-6">
            <Pause className="w-4 h-4" /> Pause
          </Button>
        )}
        <Button onClick={reset} variant="outline" className="gap-2 px-6">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>
    </div>
  );
};

export default Stopwatch;
