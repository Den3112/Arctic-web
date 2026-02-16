-- 1. Infrastructure: ModDatetime Trigger Function
-- Automatically updates 'updated_at' column on row updates
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    new.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Schema Enhancements: Soft Deletes & Audit Columns
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.time_entries ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.time_entries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;

-- 3. Automation: Apply updated_at trigger
CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER handle_updated_at_projects
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER handle_updated_at_time_entries
    BEFORE UPDATE ON public.time_entries
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. New Feature: User Settings Table
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    theme TEXT DEFAULT 'dark',
    timezone TEXT DEFAULT 'UTC',
    week_start INTEGER DEFAULT 1, -- 1 = Monday
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER handle_updated_at_settings
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Performance & Analytics: Reporting View
-- Specialized view for high-performance daily summaries
CREATE OR REPLACE VIEW public.v_daily_time_summary AS
SELECT 
    user_id,
    project_id,
    date_trunc('day', start_time) as entry_date,
    SUM(EXTRACT(EPOCH FROM (COALESCE(end_time, now()) - start_time))) as total_seconds,
    COUNT(*) as entry_count
FROM 
    public.time_entries
WHERE 
    deleted_at IS NULL
GROUP BY 
    user_id, project_id, date_trunc('day', start_time);

-- 6. Granular Security: Refine RLS Policies
-- (We keep the existing simple ones for now but ensure 'deleted_at' is handled in queries)

-- 7. Documentation
COMMENT ON TABLE public.user_settings IS 'Individual user preferences and configuration.';
COMMENT ON VIEW public.v_daily_time_summary IS 'Real-time daily aggregation for performance dashboards.';
COMMENT ON COLUMN public.projects.deleted_at IS 'Timestamp for soft deletion to prevent accidental data loss.';
