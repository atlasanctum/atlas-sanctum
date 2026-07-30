import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAllProjects } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PROJECT_TYPE_LABELS, PROJECT_TYPE_ICONS } from "@/types/marketplace";
import ProjectFormModal from "./ProjectFormModal";
import type { CarbonProject } from "@/types/marketplace";

const ProjectsTable = () => {
   const { data: projects, isLoading } = useAllProjects();
   const queryClient = useQueryClient();
   const [deleteId, setDeleteId] = useState<string | null>(null);
   const [editProject, setEditProject] = useState<CarbonProject | null>(null);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const tableRef = useRef<HTMLTableElement>(null);

   useEffect(() => {
     const table = tableRef.current;
     if (!table) return;

     const handleKeyDown = (event: KeyboardEvent) => {
       const target = event.target as HTMLElement;
       if (!table.contains(target)) return;

       const cells = Array.from(table.querySelectorAll('td, th'));
       const currentIndex = cells.indexOf(target.closest('td, th') as HTMLElement);

       if (currentIndex === -1) return;

       let newIndex = currentIndex;

       switch (event.key) {
         case 'ArrowRight':
           newIndex = Math.min(currentIndex + 1, cells.length - 1);
           break;
         case 'ArrowLeft':
           newIndex = Math.max(currentIndex - 1, 0);
           break;
         case 'ArrowDown':
           // Assuming 6 columns
           newIndex = Math.min(currentIndex + 6, cells.length - 1);
           break;
         case 'ArrowUp':
           newIndex = Math.max(currentIndex - 6, 0);
           break;
         default:
           return;
       }

       event.preventDefault();
       (cells[newIndex] as HTMLElement).focus();
     };

     table.addEventListener('keydown', handleKeyDown);
     return () => table.removeEventListener('keydown', handleKeyDown);
   }, [projects]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    const { error } = await supabase
      .from('carbon_projects')
      .delete()
      .eq('id', deleteId);
    
    if (error) {
      toast.error("Failed to delete project");
    } else {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
    }
    setDeleteId(null);
  };

  const statusColors: Record<string, string> = {
    active: "bg-primary/10 text-primary border-primary/20",
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    completed: "bg-ocean/10 text-ocean border-ocean/20",
    suspended: "bg-destructive/10 text-destructive border-destructive/20",
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-full" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Carbon Projects</h2>
          <Button onClick={() => { setEditProject(null); setIsFormOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table ref={tableRef} tabIndex={0} aria-label="Carbon projects table">
            <TableHeader>
              <TableRow>
                <TableHead tabIndex={0}>Project</TableHead>
                <TableHead tabIndex={0}>Type</TableHead>
                <TableHead tabIndex={0}>Status</TableHead>
                <TableHead tabIndex={0}>Price</TableHead>
                <TableHead tabIndex={0}>Credits</TableHead>
                <TableHead tabIndex={0} className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell tabIndex={0}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                        {PROJECT_TYPE_ICONS[project.project_type]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{project.title}</p>
                        <p className="text-sm text-muted-foreground">{project.location}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell tabIndex={0}>
                    <span className="text-sm text-muted-foreground">
                      {PROJECT_TYPE_LABELS[project.project_type]}
                    </span>
                  </TableCell>
                  <TableCell tabIndex={0}>
                    <Badge variant="outline" className={statusColors[project.status]}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell tabIndex={0}>
                    <span className="font-medium">${project.price_per_credit}</span>
                  </TableCell>
                  <TableCell tabIndex={0}>
                    <span className="text-sm">
                      {project.available_credits.toLocaleString()} / {project.total_credits.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell tabIndex={0} className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/marketplace/${project.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditProject(project); setIsFormOpen(true); }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Project Form Modal */}
      <ProjectFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        project={editProject}
      />
    </>
  );
};

export default ProjectsTable;
