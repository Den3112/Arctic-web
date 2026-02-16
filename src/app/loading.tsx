export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Arctic Pulse */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-[ping_1.5s_infinite]" />
          <div className="absolute inset-0 rounded-full border-4 border-primary animate-[pulse_2s_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse tracking-widest uppercase">
          ArcticTime
        </p>
      </div>
    </div>
  );
}
