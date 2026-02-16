export function formatDuration(ms: number): string {
  if (ms < 0) ms = 0;
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');

  return `${h}:${m}:${s}`;
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateDurationMs(
  start: string,
  end?: string | null
): number {
  const startTime = new Date(start).getTime();
  const endTime = end ? new Date(end).getTime() : Date.now();
  // Handle invalid dates or future start times
  if (isNaN(startTime) || isNaN(endTime)) return 0;
  return Math.max(0, endTime - startTime);
}

export function parseDurationString(str: string): number | null {
  const parts = str.split(':');
  if (parts.length !== 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) return null;
  return (hours * 60 + minutes) * 60 * 1000;
}
