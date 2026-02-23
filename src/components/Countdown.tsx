import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause, RotateCcw, Hourglass } from "lucide-react";
import { playAlarmSound } from "@/lib/sound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const pad = (n: number) => String(n).padStart(2, "0");

const Countdown = () => {
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const endRef = useRef(0);

  const start = useCallback(() => {
    const totalMs = started
      ? remaining
      : (parseInt(hours) || 0) * 3600000 +
        (parseInt(minutes) || 0) * 60000 +
        (parseInt(seconds) || 0) * 1000;
    if (totalMs <= 0) return;
    if (!started) {
      setTotal(totalMs);
      setStarted(true);
    }
    endRef.current = Date.now() + totalMs;
    intervalRef.current = window.setInterval(() => {
      const left = Math.max(0, endRef.current - Date.now());
      setRemaining(left);
      if (left <= 0) {
        clearInterval(intervalRef.current!);
        setRunning(false);
        playAlarmSound();
      }
    }, 100);
    setRunning(true);
  }, [hours, minutes, seconds, remaining, started]);

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setStarted(false);
    setRemaining(0);
    setTotal(0);
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const displayMs = started ? remaining : 0;
  const totalSec = Math.ceil(displayMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const progress = total > 0 ? ((total - remaining) / total) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-widest">
        <Hourglass className="w-4 h-4" />
        Countdown
      </div>

      {!started ? (
        <div className="flex gap-3 items-end">
          {[
            { label: "Hours", value: hours, set: setHours },
            { label: "Minutes", value: minutes, set: setMinutes },
            { label: "Seconds", value: seconds, set: setSeconds },
          ].map(({ label, value, set }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Label className="text-xs text-muted-foreground">{label}</Label>
              <Input
                type="number"
                min="0"
                max={label === "Hours" ? "99" : "59"}
                value={value}
                onChange={(e) => set(e.target.value)}
                className="w-20 text-center font-mono text-lg bg-secondary border-border"
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div
            className={`text-4xl md:text-6xl font-mono font-semibold ${remaining <= 0 && total > 0 ? "text-destructive animate-pulse" : "text-foreground"}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {pad(h)}:{pad(m)}:{pad(s)}
          </div>
          <Progress value={progress} className="w-64 h-2" />
          {remaining <= 0 && total > 0 && (
            <p className="text-destructive font-medium animate-pulse">⏰ Time's up!</p>
          )}
        </>
      )}

      <div className="flex gap-3">
        {!running ? (
          <Button onClick={start} className="gap-2 px-6" disabled={started && remaining <= 0}>
            <Play className="w-4 h-4" /> {started ? "Resume" : "Start"}
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

export default Countdown;
