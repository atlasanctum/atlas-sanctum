import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MoreHorizontal, FileEdit, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { CreateProjectModal } from './CreateProjectModal';

const projects = [
  {
    id: "PROJ-001",
    title: "AI in Agriculture: A Sustainable Approach",
    status: "Published",
    type: "Research Paper",
    lastEdited: "2 hours ago",
    views: 234
  },
  {
    id: "PROJ-002",
    title: "The Last Weaver: Preserving Heritage",
    status: "Draft",
    type: "Story",
    lastEdited: "Yesterday",
    views: 0
  },
  {
    id: "PROJ-003",
    title: "Community Data Trust Model",
    status: "Review",
    type: "Whitepaper",
    lastEdited: "3 days ago",
    views: 56
  },
  {
    id: "PROJ-004",
    title: "Oral History of the Amazon",
    status: "Published",
    type: "Collection",
    lastEdited: "1 week ago",
    views: 1205
  },
];

export const MyProjects = () => {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Projects</h2>
        <CreateProjectModal 
            trigger={<Button>Create New</Button>}
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Edited</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.type}</TableCell>
                <TableCell>
                  <Badge variant={
                    project.status === "Published" ? "default" : 
                    project.status === "Draft" ? "secondary" : "outline"
                  }>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>{project.lastEdited}</TableCell>
                <TableCell className="text-right">{project.views}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <FileEdit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" /> View Live
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
