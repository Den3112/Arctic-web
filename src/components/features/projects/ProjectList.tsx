'use client';

import { deleteProjectAction } from '@/actions/projects';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProjectWithStats } from '@/types';
import { Edit, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ProjectForm } from './ProjectForm';
import { formatDuration } from '@/services/timeUtils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectListProps {
  projects: ProjectWithStats[];
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithStats | null>(null);
  const [projectToDelete, setProjectToDelete] =
    useState<ProjectWithStats | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useLanguage();

  const handleDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProjectAction(projectToDelete.id);
      toast.success(t.projects.toastDeleted);
      setProjectToDelete(null); // Close dialog
      router.refresh();
    } catch {
      toast.error(t.errors.deletingProject);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (project: ProjectWithStats) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedProject(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          {t.projects.header}
        </h2>
        <Button onClick={handleCreate} data-testid="create-project-button">
          <Plus className="mr-2 h-4 w-4" /> {t.projects.newProject}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="relative overflow-hidden transition-all hover:shadow-lg"
          >
            <div
              className="absolute left-0 top-0 h-full w-2"
              style={{ backgroundColor: project.color }}
            />
            <CardHeader className="pl-6">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription className="flex flex-col gap-1 mt-1">
                    <span className="text-xs opacity-70">
                      {t.projects.createdAt}{' '}
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-primary/80">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(project.total_duration)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {project.tasks_count} {t.projects.tasksCount}
                      </div>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid="edit-project-button"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setProjectToDelete(project)}
                    data-testid="delete-project-button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            {t.projects.noProjects}
          </div>
        )}
      </div>

      {isDialogOpen && (
        <ProjectForm
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedProject(null);
          }}
          project={selectedProject}
        />
      )}

      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open: boolean) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.projects.confirmDeleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.projects.confirmDeleteDesc.replace(
                '{name}',
                projectToDelete?.name || ''
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  await handleDelete();
                }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.projects.deleting}
                  </>
                ) : (
                  t.common.delete
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
