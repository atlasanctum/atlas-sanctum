import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Plus, MoreHorizontal, Filter, CheckCircle2, FlaskConical } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CreateTaskModal } from './CreateTaskModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../components/ui/dropdown-menu';

// Task Type Definition
interface Task {
  id: number | string;
  title: string;
  tag: string;
  date: string;
  status: 'todo' | 'inProgress' | 'done';
}

// Initial Data
const initialTasks: Task[] = [
  { id: 1, title: "Draft Proposal for Ethics Board", tag: "Admin", date: "Due Tomorrow", status: 'todo' },
  { id: 2, title: "Review Community Guidelines", tag: "Policy", date: "Due Dec 30", status: 'todo' },
  { id: 3, title: "Interview Indigenous Leaders", tag: "Research", date: "Ongoing", status: 'inProgress' },
  { id: 4, title: "Data Cleaning for Language Model", tag: "Tech", date: "50% Complete", status: 'inProgress' },
  { id: 5, title: "Submit Monthly Report", tag: "Admin", date: "Completed", status: 'done' },
  { id: 6, title: "Update Profile Bio", tag: "Personal", date: "Completed", status: 'done' },
  { id: 7, title: "Analyze Knowledge Graph Data", tag: "Research", date: "New", status: 'todo' },
];

const ItemType = 'TASK';

interface DraggableTaskProps {
  task: Task;
}

const DraggableTask = ({ task }: DraggableTaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag as unknown as React.LegacyRef<HTMLDivElement>} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card className="mb-4 cursor-grab hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Badge variant={task.tag === 'Research' ? 'secondary' : 'outline'} className="text-xs">
                {task.tag === 'Research' && <FlaskConical className="w-3 h-3 mr-1" />}
                {task.tag}
            </Badge>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 cursor-pointer">
                <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
          <h4 className="font-semibold text-sm mb-3">{task.title}</h4>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{task.date}</span>
            <Avatar className="h-5 w-5">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface DroppableColumnProps {
  status: 'todo' | 'inProgress' | 'done';
  title: string;
  tasks: Task[];
  onDrop: (id: number | string, status: 'todo' | 'inProgress' | 'done') => void;
}

const DroppableColumn = ({ status, title, tasks, onDrop }: DroppableColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { id: number | string }) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
        ref={drop as unknown as React.LegacyRef<HTMLDivElement>} 
        className={`flex-1 rounded-lg p-4 flex flex-col transition-colors ${isOver ? 'bg-slate-100 dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900/50'}`}
    >
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">{title}</h3>
            <Badge variant="secondary">{tasks.length}</Badge>
        </div>
        <div className="flex-1 overflow-y-auto min-h-[100px]">
            {tasks.map(task => <DraggableTask key={task.id} task={task} />)}
            {tasks.length === 0 && (
                <div className="flex items-center justify-center h-20 text-xs text-muted-foreground border-2 border-dashed rounded-md">
                    No tasks
                </div>
            )}
        </div>
    </div>
  );
};

export const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<string>('all');

  const handleDrop = (id: number | string, status: 'todo' | 'inProgress' | 'done') => {
    setTasks((prevTasks) => {
        return prevTasks.map(task => 
            task.id === id ? { ...task, status } : task
        );
    });
  };

  const handleCreateTask = (newTask: any) => {
      // In a real app, this would come from the modal form data
      const task: Task = {
          id: Math.random(), // simple ID generation
          title: newTask.title || "New Task",
          tag: newTask.tag || "General",
          date: newTask.date || "Due Soon",
          status: 'todo'
      };
      setTasks([...tasks, task]);
  };

  const filteredTasks = tasks.filter(task => {
      if (filter === 'all') return true;
      if (filter === 'research') return task.tag === 'Research';
      if (filter === 'admin') return task.tag === 'Admin';
      return task.tag.toLowerCase() === filter;
  });

  return (
    <DndProvider backend={HTML5Backend}>
        <div className="flex-1 space-y-6 p-8 pt-6 overflow-x-auto h-full">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Task Board</h2>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                            <Filter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Filter
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                            <DropdownMenuRadioItem value="all">All Tasks</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="research">Research</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="tech">Tech</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <CreateTaskModal 
                    onTaskCreate={handleCreateTask}
                />
            </div>
        </div>
        
        <div className="flex gap-6 min-w-[800px] h-[calc(100vh-200px)]">
            <DroppableColumn 
                status="todo" 
                title="To Do" 
                tasks={filteredTasks.filter(t => t.status === 'todo')} 
                onDrop={handleDrop} 
            />
            <DroppableColumn 
                status="inProgress" 
                title="In Progress" 
                tasks={filteredTasks.filter(t => t.status === 'inProgress')} 
                onDrop={handleDrop} 
            />
            <DroppableColumn 
                status="done" 
                title="Done" 
                tasks={filteredTasks.filter(t => t.status === 'done')} 
                onDrop={handleDrop} 
            />
        </div>
        </div>
    </DndProvider>
  );
};
