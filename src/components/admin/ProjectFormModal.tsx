import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PROJECT_TYPE_LABELS } from "@/types/marketplace";
import type { CarbonProject, ProjectType, ProjectStatus } from "@/types/marketplace";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  country: z.string().min(1, "Country is required"),
  project_type: z.enum(['reforestation', 'renewable_energy', 'methane_capture', 'ocean_restoration', 'soil_carbon', 'direct_air_capture']),
  status: z.enum(['active', 'pending', 'completed', 'suspended']),
  price_per_credit: z.number().min(0.01, "Price must be greater than 0"),
  total_credits: z.number().min(1, "Must have at least 1 credit"),
  available_credits: z.number().min(0, "Cannot be negative"),
  vintage_year: z.number().min(2000).max(2100),
  certification: z.string().min(1, "Certification is required"),
  developer_name: z.string().min(1, "Developer name is required"),
  co2_offset_per_credit: z.number().min(0.01),
  methodology: z.string().optional(),
  image_url: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: CarbonProject | null;
}

const ProjectFormModal = ({ open, onOpenChange, project }: ProjectFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!project;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      country: "",
      project_type: "reforestation" as ProjectType,
      status: "active" as ProjectStatus,
      price_per_credit: 15,
      total_credits: 1000,
      available_credits: 1000,
      vintage_year: new Date().getFullYear(),
      certification: "Verra VCS",
      developer_name: "",
      co2_offset_per_credit: 1,
      methodology: "",
      image_url: "",
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description,
        location: project.location,
        country: project.country,
        project_type: project.project_type,
        status: project.status,
        price_per_credit: project.price_per_credit,
        total_credits: project.total_credits,
        available_credits: project.available_credits,
        vintage_year: project.vintage_year,
        certification: project.certification,
        developer_name: project.developer_name,
        co2_offset_per_credit: project.co2_offset_per_credit,
        methodology: project.methodology || "",
        image_url: project.image_url || "",
      });
    } else {
      form.reset();
    }
  }, [project, form]);

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      if (isEditing && project) {
        const { error } = await supabase
          .from('carbon_projects')
          .update({
            title: values.title,
            description: values.description,
            location: values.location,
            country: values.country,
            project_type: values.project_type,
            status: values.status,
            price_per_credit: values.price_per_credit,
            total_credits: values.total_credits,
            available_credits: values.available_credits,
            vintage_year: values.vintage_year,
            certification: values.certification,
            developer_name: values.developer_name,
            co2_offset_per_credit: values.co2_offset_per_credit,
            methodology: values.methodology || null,
            image_url: values.image_url || null,
          })
          .eq('id', project.id);
        
        if (error) throw error;
        toast.success("Project updated successfully");
      } else {
        const { error } = await supabase
          .from('carbon_projects')
          .insert({
            title: values.title,
            description: values.description,
            location: values.location,
            country: values.country,
            project_type: values.project_type,
            status: values.status,
            price_per_credit: values.price_per_credit,
            total_credits: values.total_credits,
            available_credits: values.available_credits,
            vintage_year: values.vintage_year,
            certification: values.certification,
            developer_name: values.developer_name,
            co2_offset_per_credit: values.co2_offset_per_credit,
            methodology: values.methodology || null,
            image_url: values.image_url || null,
          });
        
        if (error) throw error;
        toast.success("Project created successfully");
      }
      
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Create New Project"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
           <div aria-live="polite" aria-atomic="true" className="sr-only">
             {Object.keys(form.formState.errors).length > 0 && "Form contains errors. Please review and correct the highlighted fields."}
           </div>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <fieldset className="space-y-4">
               <legend className="text-lg font-semibold text-foreground">Basic Information</legend>
               <div className="grid grid-cols-2 gap-4">
                 <FormField
                   control={form.control}
                   name="title"
                   render={({ field }) => (
                     <FormItem className="col-span-2">
                       <FormLabel>Title</FormLabel>
                       <FormControl>
                         <Input {...field} placeholder="Amazon Rainforest Conservation" autoComplete="name" />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="description"
                   render={({ field }) => (
                     <FormItem className="col-span-2">
                       <FormLabel>Description</FormLabel>
                       <FormControl>
                         <Textarea {...field} rows={3} placeholder="Describe the project..." autoComplete="off" />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>
             </fieldset>

             <fieldset className="space-y-4">
               <legend className="text-lg font-semibold text-foreground">Location</legend>
               <div className="grid grid-cols-2 gap-4">
                 <FormField
                   control={form.control}
                   name="location"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Location</FormLabel>
                       <FormControl>
                         <Input {...field} placeholder="Amazon Basin" autoComplete="address-level2" />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="country"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Country</FormLabel>
                       <FormControl>
                         <Input {...field} placeholder="Brazil" autoComplete="country" />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>
             </fieldset>

             <fieldset className="space-y-4">
               <legend className="text-lg font-semibold text-foreground">Project Details</legend>
               <div className="grid grid-cols-2 gap-4">
                 <FormField
                   control={form.control}
                   name="project_type"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Project Type</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                         <FormControl>
                           <SelectTrigger>
                             <SelectValue />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
                             <SelectItem key={value} value={value}>{label}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="status"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Status</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                         <FormControl>
                           <SelectTrigger>
                             <SelectValue />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           <SelectItem value="active">Active</SelectItem>
                           <SelectItem value="pending">Pending</SelectItem>
                           <SelectItem value="completed">Completed</SelectItem>
                           <SelectItem value="suspended">Suspended</SelectItem>
                         </SelectContent>
                       </Select>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="vintage_year"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Vintage Year</FormLabel>
                       <FormControl>
                         <Input
                           type="number"
                           {...field}
                           onChange={e => field.onChange(parseInt(e.target.value))}
                           autoComplete="off"
                         />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="certification"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Certification</FormLabel>
                       <FormControl>
                         <Input {...field} placeholder="Verra VCS" autoComplete="off" />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="developer_name"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Developer Name</FormLabel>
                       <FormControl>
                         <Input {...field} placeholder="Conservation International" autoComplete="organization" />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="methodology"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Methodology (Optional)</FormLabel>
                       <FormControl>
                         <Input {...field} placeholder="VM0007" autoComplete="off" />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>
             </fieldset>

             <fieldset className="space-y-4">
               <legend className="text-lg font-semibold text-foreground">Financial Information</legend>
               <div className="grid grid-cols-2 gap-4">
                 <FormField
                   control={form.control}
                   name="price_per_credit"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Price per Credit ($)</FormLabel>
                       <FormControl>
                         <Input
                           type="number"
                           step="0.01"
                           {...field}
                           onChange={e => field.onChange(parseFloat(e.target.value))}
                           autoComplete="off"
                         />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="total_credits"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Total Credits</FormLabel>
                       <FormControl>
                         <Input
                           type="number"
                           {...field}
                           onChange={e => field.onChange(parseInt(e.target.value))}
                           autoComplete="off"
                         />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="available_credits"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Available Credits</FormLabel>
                       <FormControl>
                         <Input
                           type="number"
                           {...field}
                           onChange={e => field.onChange(parseInt(e.target.value))}
                           autoComplete="off"
                         />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="co2_offset_per_credit"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>CO2 Offset per Credit (tons)</FormLabel>
                       <FormControl>
                         <Input
                           type="number"
                           step="0.01"
                           {...field}
                           onChange={e => field.onChange(parseFloat(e.target.value))}
                           autoComplete="off"
                         />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>
             </fieldset>

             <fieldset className="space-y-4">
               <legend className="text-lg font-semibold text-foreground">Media</legend>
               <div className="grid grid-cols-2 gap-4">
                 <FormField
                   control={form.control}
                   name="image_url"
                   render={({ field }) => (
                     <FormItem className="col-span-2">
                       <FormLabel>Image URL (Optional)</FormLabel>
                       <FormControl>
                         <Input {...field} placeholder="https://example.com/image.jpg" autoComplete="url" />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>
             </fieldset>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormModal;
