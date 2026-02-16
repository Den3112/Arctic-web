import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as projectService from '@/services/projectService';
import { createClient } from '@/lib/supabase-server';

vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('projectService', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  };

  const createChain = (
    resolveValue: { data: unknown; error: unknown } = {
      data: null,
      error: null,
    }
  ) => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    };
    (chain as unknown as { then: unknown }).then = (
      onFullfilled: (value: unknown) => unknown
    ) => Promise.resolve(resolveValue).then(onFullfilled);
    return chain;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);
  });

  describe('getProjectsWithStats', () => {
    it('should aggregate stats correctly', async () => {
      const mockProjects = [
        { id: 'p1', name: 'Project 1', color: 'red', created_at: '2023-01-01' },
      ];
      const mockEntries = [
        {
          project_id: 'p1',
          start_time: '2023-01-01T10:00:00Z',
          end_time: '2023-01-01T11:00:00Z',
        }, // 1 hour
        {
          project_id: 'p1',
          start_time: '2023-01-01T12:00:00Z',
          end_time: '2023-01-01T12:30:00Z',
        }, // 30 mins
      ];

      const projectsChain = createChain();
      projectsChain.order.mockResolvedValue({
        data: mockProjects,
        error: null,
      });

      const entriesChain = createChain();
      entriesChain.not.mockResolvedValue({ data: mockEntries, error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'projects') return projectsChain;
        if (table === 'time_entries') return entriesChain;
        return createChain();
      });

      const result = await projectService.getProjectsWithStats();

      expect(result).toHaveLength(1);
      expect(result[0].total_duration).toBe(1.5 * 60 * 60 * 1000); // 1.5 hours in ms
      expect(result[0].tasks_count).toBe(2);
    });
  });

  describe('deleteProject', () => {
    it('should perform manual cascade delete', async () => {
      const chain = createChain();
      chain.eq.mockResolvedValue({ error: null });
      mockSupabase.from.mockReturnValue(chain);

      await projectService.deleteProject('p1');

      expect(mockSupabase.from).toHaveBeenCalledWith('time_entries');
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(chain.delete).toHaveBeenCalledTimes(2);
    });
  });
});
