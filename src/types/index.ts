export interface Project {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ProjectWithStats extends Project {
  total_duration: number; // in milliseconds
  tasks_count: number;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string | null;
  project?: Project | null;
  projects?: Project | null; // Database join field
  task_name: string;
  start_time: string;
  end_time: string | null;
  duration?: number; // Calculated in seconds
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type TimeEntryWithProject = TimeEntry & {
  projects: Project | null;
};

export type CreateProjectInput = Pick<Project, 'name' | 'color'>;
export type UpdateProjectInput = Partial<CreateProjectInput>;

export type CreateTimeEntryInput = {
  task_name: string;
  project_id?: string;
  start_time?: string;
};

export type UpdateTimeEntryInput = Partial<CreateTimeEntryInput> & {
  end_time?: string | null;
};
