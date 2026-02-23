import { useState, useRef, useEffect, useCallback } from "react";
import { CalendarClock, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface ScheduledEntry {
  id: number;
  startTime: Date;
  durationMin: number;
  status: "waiting" | "running" | "done";
  remaining: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

const ScheduledTimer = () => {
  const [startTimeStr, setStartTimeStr] = useState("");
  const [durationMin, setDurationMin] = useState("5");
  const [entries, setEntries] = useState<ScheduledEntry[]>([]);
  const intervalRef = useRef<number | null>(null);

  const addEntry = useCallback(() => {
    if (!startTimeStr || !durationMin) return;
    const [h, m] = startTimeStr.split(":").map(Number);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    if (start <= now) {
      start.setDate(start.getDate() + 1);
    }
    setEntries((prev) => [
      ...prev,
      {
        id: Date.now(),
        startTime: start,
        durationMin: parseInt(durationMin) || 1,
        status: "waiting",
        remaining: 0,
      },
    ]);
  }, [startTimeStr, durationMin]);

  const removeEntry = useCallback((id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setEntries((prev) =>
        prev.map((entry) => {
          const now = Date.now();
          if (entry.status === "waiting" && now >= entry.startTime.getTime()) {
            return {
              ...entry,
              status: "running" as const,
              remaining: entry.durationMin * 60 * 1000,
            };
          }
          if (entry.status === "running") {
            const endTime = entry.startTime.getTime() + entry.durationMin * 60 * 1000;
            const left = Math.max(0, endTime - now);
            return {
              ...entry,
              remaining: left,
              status: left <= 0 ? ("done" as const) : ("running" as const),
            };
          }
          return entry;
        })
      );
    }, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const formatRemaining = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${pad(m)}:${pad(s)}`;
  };

  const formatTimeUntil = (date: Date) => {
    const diff = date.getTime() - Date.now();
    if (diff <= 0) return "Starting...";
    const totalSec = Math.ceil(diff / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `Starts in ${h}h ${pad(m)}m`;
    if (m > 0) return `Starts in ${m}m ${pad(s)}s`;
    return `Starts in ${s}s`;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-widest">
        <CalendarClock className="w-4 h-4" />
        Schedule Timer
      </div>

      <div className="flex flex-wrap gap-3 items-end justify-center">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Start At</Label>
          <Input
            type="time"
            value={startTimeStr}
            onChange={(e) => setStartTimeStr(e.target.value)}
            className="w-36 font-mono bg-secondary border-border"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Duration (min)</Label>
          <Input
            type="number"
            min="1"
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
            className="w-24 font-mono bg-secondary border-border"
          />
        </div>
        <Button onClick={addEntry} className="gap-2">
          <Play className="w-4 h-4" /> Schedule
        </Button>
      </div>

      {entries.length > 0 && (
        <div className="w-full max-w-md flex flex-col gap-2">
          {entries.map((entry) => (
            <Card key={entry.id} className="bg-secondary/50 border-border">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-mono text-foreground">
                    {entry.startTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                    · {entry.durationMin} min
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      entry.status === "waiting"
                        ? "text-muted-foreground"
                        : entry.status === "running"
                        ? "text-primary"
                        : "text-destructive"
                    }`}
                  >
                    {entry.status === "waiting" && formatTimeUntil(entry.startTime)}
                    {entry.status === "running" && `⏱ ${formatRemaining(entry.remaining)} left`}
                    {entry.status === "done" && "⏰ Done!"}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)}>
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {entries.length === 0 && (
        <p className="text-muted-foreground text-sm">No scheduled timers yet.</p>
      )}
    </div>
  );
};

export default ScheduledTimer;
