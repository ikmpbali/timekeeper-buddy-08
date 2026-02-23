import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const LiveClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-widest">
        <Clock className="w-4 h-4" />
        Live Clock
      </div>
      <div
        className="text-5xl md:text-7xl font-mono font-bold tracking-tight text-primary drop-shadow-[0_0_24px_hsl(var(--glow-primary)/0.4)]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {timeStr}
      </div>
      <p className="text-muted-foreground text-sm">{dateStr}</p>
    </div>
  );
};

export default LiveClock;
