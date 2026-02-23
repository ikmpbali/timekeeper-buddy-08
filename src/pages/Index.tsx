import LiveClock from "@/components/LiveClock";
import Stopwatch from "@/components/Stopwatch";
import Countdown from "@/components/Countdown";
import ScheduledTimer from "@/components/ScheduledTimer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import logoBis from "@/assets/logo-bis.png";

const Index = () => {
  return (
    <div className="relative flex flex-col min-h-screen items-center bg-background px-4 py-8 md:py-12">
      <img src={logoBis} alt="BIS Logo" className="absolute top-4 right-4 w-14 h-14 md:w-16 md:h-16 rounded-full" />
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-1">
          ⏱ Timer BIS
        </h1>
        <p className="text-muted-foreground text-sm">Your all-in-one timing companion</p>
      </header>

      <div className="mb-10">
        <LiveClock />
      </div>

      <Tabs defaultValue="stopwatch" className="w-full max-w-xl">
        <TabsList className="grid w-full grid-cols-3 bg-secondary">
          <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
          <TabsTrigger value="countdown">Countdown</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="stopwatch" className="mt-8">
          <Stopwatch />
        </TabsContent>

        <TabsContent value="countdown" className="mt-8">
          <Countdown />
        </TabsContent>

        <TabsContent value="schedule" className="mt-8">
          <ScheduledTimer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
