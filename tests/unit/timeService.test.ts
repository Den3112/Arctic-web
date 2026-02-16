import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as timeService from '@/services/timeService';
import { createClient } from '@/lib/supabase-server';

vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('timeService', () => {
  let mockSupabase: {
    auth: { getUser: ReturnType<typeof vi.fn> };
    from: ReturnType<typeof vi.fn>;
  };

  const createChain = (resolveValue: unknown = { data: null, error: null }) => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
    };

    // Ensure resolveValue has the correct structure for Supabase calls
    const finalValue =
      (resolveValue as Record<string, unknown>).data === undefined &&
      (resolveValue as Record<string, unknown>).error === undefined
        ? { data: resolveValue, error: null }
        : resolveValue;

    (chain as unknown as { then: unknown }).then = (
      onFullfilled: (value: unknown) => unknown
    ) => Promise.resolve(finalValue).then(onFullfilled);

    return chain;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = {
      auth: {
        getUser: vi.fn(() =>
          Promise.resolve({ data: { user: { id: 'user-1' } }, error: null })
        ),
      },
      from: vi.fn().mockReturnValue(createChain()),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);
  });

  describe('getActiveEntry', () => {
    it('should return the active entry', async () => {
      const mockEntry = { id: '1', task_name: 'Existing' };
      mockSupabase.from.mockReturnValue(
        createChain({ data: mockEntry, error: null })
      );

      const result = await timeService.getActiveEntry();
      expect(result).toEqual(mockEntry);
    });
  });

  describe('startTimer', () => {
    it('should stop active timer and start new one', async () => {
      const activeEntry = { id: 'old-1' };
      mockSupabase.from
        .mockReturnValueOnce(createChain({ data: activeEntry, error: null }))
        .mockReturnValueOnce(createChain({ data: null, error: null }))
        .mockReturnValueOnce(
          createChain({ data: { id: 'new-1' }, error: null })
        );

      const result = await timeService.startTimer('New Task', null);
      expect(result).toEqual({ id: 'new-1' });
    });
  });
});
