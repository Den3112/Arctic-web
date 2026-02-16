-- Add indices for performance optimization
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON public.time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON public.time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_start_time ON public.time_entries(start_time DESC);

-- Add data integrity constraints
ALTER TABLE public.time_entries
ADD CONSTRAINT check_times_order 
CHECK (end_time IS NULL OR start_time <= end_time);

-- Add comments for documentation
COMMENT ON INDEX public.idx_projects_user_id IS 'Speeds up fetching projects for a specific user';
COMMENT ON INDEX public.idx_time_entries_user_id IS 'Speeds up fetching time entries for a specific user';
COMMENT ON INDEX public.idx_time_entries_start_time IS 'Optimizes sorting time entries by start time for dashboard and reports';
COMMENT ON CONSTRAINT check_times_order ON public.time_entries IS 'Ensures that end_time is always greater than or equal to start_time';
