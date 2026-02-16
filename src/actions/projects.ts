'use server';

import {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
  ProjectWithStats,
} from '@/types';
import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import * as projectService from '@/services/projectService';

export async function getProjects(): Promise<ProjectWithStats[]> {
  return projectService.getProjectsWithStats() as Promise<ProjectWithStats[]>;
}

export async function createProjectAction(
  input: CreateProjectInput
): Promise<Project> {
  const schema = z.object({
    name: z.string().min(2),
    color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i),
  });
  const validated = schema.parse(input);
  const project = await projectService.createProject(
    validated.name,
    validated.color
  );
  revalidatePath('/');
  revalidatePath('/projects');
  return project;
}

export async function updateProjectAction(
  id: string,
  input: UpdateProjectInput
): Promise<Project> {
  const schema = z.object({
    name: z.string().min(2).optional(),
    color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i)
      .optional(),
  });
  const validated = schema.parse(input);
  const project = (await projectService.updateProject(
    id,
    validated.name!,
    validated.color!
  )) as unknown as Project;
  revalidatePath('/');
  revalidatePath('/projects');
  return project;
}

export async function deleteProjectAction(id: string): Promise<void> {
  await projectService.deleteProject(id);
  revalidatePath('/');
  revalidatePath('/projects');
}
