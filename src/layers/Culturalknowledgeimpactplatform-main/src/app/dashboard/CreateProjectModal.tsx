import React from 'react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { CirclePlus } from 'lucide-react';
import { toast } from 'sonner';

interface CreateProjectModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreateProjectModal = ({ trigger, open, onOpenChange }: CreateProjectModalProps) => {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = () => {
    // In a real app, this would send data to backend
    toast.success('Project created successfully', {
        description: `${title} has been added to your projects.`
    });
    
    // Reset form
    setTitle('');
    setType('');
    setDescription('');
    
    if (onOpenChange) {
        onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <CirclePlus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new contribution to the global knowledge ecosystem.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input 
                id="title" 
                placeholder="Project Title" 
                className="col-span-3" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="research">Research Paper</SelectItem>
                <SelectItem value="whitepaper">Whitepaper</SelectItem>
                <SelectItem value="collection">Collection</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea 
                id="description" 
                placeholder="Brief description..." 
                className="col-span-3" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
