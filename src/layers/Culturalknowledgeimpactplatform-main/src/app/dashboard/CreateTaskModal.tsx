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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Plus } from 'lucide-react';

interface CreateTaskModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onTaskCreate?: (task: any) => void;
}

export const CreateTaskModal = ({ trigger, open, onOpenChange, onTaskCreate }: CreateTaskModalProps) => {
  const [title, setTitle] = React.useState('');
  const [tag, setTag] = React.useState('Admin');
  const [date, setDate] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTaskCreate) {
        onTaskCreate({ 
            title: title || "New Task", 
            tag: tag, 
            date: date ? new Date(date).toLocaleDateString() : "Due Soon" 
        });
    }
    // Reset form
    setTitle('');
    setTag('Admin');
    setDate('');
    
    if (onOpenChange) {
        onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for your board.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-title" className="text-right">
                Title
              </Label>
              <Input 
                id="task-title" 
                placeholder="Task title" 
                className="col-span-3" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag" className="text-right">
                Tag
              </Label>
               <Select value={tag} onValueChange={setTag}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="due-date" className="text-right">
                Due Date
              </Label>
              <Input 
                id="due-date" 
                type="date" 
                className="col-span-3"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
