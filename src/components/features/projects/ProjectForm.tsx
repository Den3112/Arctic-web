'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createProjectAction, updateProjectAction } from '@/actions/projects'; // Fixed import
import { Project } from '@/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ColorPicker } from './ColorPicker';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

export function ProjectForm({ open, onOpenChange, project }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { t } = useLanguage();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: t.projects.validationName,
    }),
    color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, {
      message: t.projects.validationColor,
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: '#3b82f6', // Default blue
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        color: project.color,
      });
    } else {
      form.reset({
        name: '',
        color: '#3b82f6',
      });
    }
  }, [project, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      if (project) {
        await updateProjectAction(project.id, {
          name: values.name,
          color: values.color,
        });
        toast.success(t.projects.toastSaved);
      } else {
        await createProjectAction({ name: values.name, color: values.color });
        toast.success(t.projects.toastCreated);
      }
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(
        project ? t.projects.toastUpdateError : t.projects.toastError
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] z-200">
        <DialogHeader>
          <DialogTitle>
            {project ? t.projects.editTitle : t.projects.newProject}
          </DialogTitle>
          <DialogDescription>
            {project ? t.projects.editDesc : t.projects.createDesc}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.projects.nameLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.projects.namePlaceholder}
                      {...field}
                      data-testid="project-name-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.projects.colorLabel}</FormLabel>
                  <FormControl>
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending}
                data-testid="save-project-button"
              >
                {isPending ? t.projects.saving : t.projects.toastSaved}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
