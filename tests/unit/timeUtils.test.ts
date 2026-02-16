import { describe, it, expect } from 'vitest';
import { formatDuration } from '@/services/timeUtils';

describe('timeUtils', () => {
  describe('formatDuration', () => {
    it('formats milliseconds into HH:mm:ss', () => {
      // 1 hour, 1 minute, 1 second = 3600 + 60 + 1 = 3661 seconds = 3661000 ms
      expect(formatDuration(3661000)).toBe('01:01:01');
      // 1 minute = 60000 ms
      expect(formatDuration(60000)).toBe('00:01:00');
      expect(formatDuration(0)).toBe('00:00:00');
    });

    it('handles large durations', () => {
      // 100 hours = 100 * 3600 * 1000 = 360,000,000 ms
      expect(formatDuration(360000000)).toBe('100:00:00');
    });
  });
});
