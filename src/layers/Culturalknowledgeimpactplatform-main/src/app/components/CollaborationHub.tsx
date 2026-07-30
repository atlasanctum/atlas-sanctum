import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, ThumbsUp, Plus, Search, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { fetchDiscussions, createDiscussion, initializeData } from '@/app/utils/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { toast } from 'sonner';

export const CollaborationHub = () => {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tag: 'General',
  });

  useEffect(() => {
    loadDiscussions();
  }, []);

  const loadDiscussions = async () => {
    try {
      setIsLoading(true);
      const response = await fetchDiscussions();
      
      if (response.success) {
        setDiscussions(response.data);
        
        // If no discussions exist, initialize with default data
        if (response.data.length === 0) {
          await initializeData();
          const retryResponse = await fetchDiscussions();
          if (retryResponse.success) {
            setDiscussions(retryResponse.data);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load discussions:', error);
      toast.error('Failed to load discussions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createDiscussion({
        title: formData.title,
        content: formData.content,
        tag: formData.tag,
        author: "Community Member",
        authorImage: "",
      });

      if (response.success) {
        setOpen(false);
        toast.success("Discussion created successfully!", {
          description: "Your topic has been posted."
        });
        setFormData({ title: '', content: '', tag: 'General' });
        
        // Reload discussions to show the new one
        await loadDiscussions();
      }
    } catch (error) {
      console.error('Failed to create discussion:', error);
      toast.error("Failed to create discussion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Collaboration Hub</h2>
        <p className="text-muted-foreground max-w-2xl">
          Connect with researchers, developers, and activists. Start a project or join an existing one.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filter Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start font-normal">All Topics</Button>
                    <Button variant="ghost" className="w-full justify-start font-normal">My Projects</Button>
                    <Button variant="ghost" className="w-full justify-start font-normal">Saved</Button>
                    <div className="pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase">Tags</div>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Collaboration</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Help Wanted</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Events</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Tooling</Badge>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                    <Plus className="mr-2 h-4 w-4" /> Start New Topic
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Start a New Discussion</DialogTitle>
                  <DialogDescription>
                    Share a project, ask a question, or start a conversation.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discussion-title">
                      Title
                    </Label>
                    <Input 
                      id="discussion-title" 
                      placeholder="e.g., Project: AI for Climate Research" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discussion-tag">
                      Tag
                    </Label>
                    <Input 
                      id="discussion-tag" 
                      placeholder="e.g., Collaboration, Help Wanted, Event" 
                      value={formData.tag}
                      onChange={(e) => setFormData({...formData, tag: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discussion-content">
                      Description
                    </Label>
                    <Textarea 
                      id="discussion-content" 
                      placeholder="Describe your topic..." 
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Discussion"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search discussions..."
                        className="pl-8 bg-background"
                    />
                </div>
                <div className="flex gap-2">
                     <Button variant="outline">Newest</Button>
                     <Button variant="ghost">Top</Button>
                </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                  {discussions.map((item) => (
                      <Card key={item.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                          <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-3">
                                      <Avatar>
                                          <AvatarImage src={item.authorImage} />
                                          <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                          <h4 className="font-semibold text-sm">{item.author}</h4>
                                          <span className="text-xs text-muted-foreground">{item.time}</span>
                                      </div>
                                  </div>
                                  <Badge>{item.tag}</Badge>
                              </div>
                              
                              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                              <p className="text-muted-foreground mb-4 line-clamp-2">
                                  {item.content}
                              </p>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                      <MessageSquare className="h-4 w-4" /> {item.replies} Replies
                                  </button>
                                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                      <ThumbsUp className="h-4 w-4" /> Like
                                  </button>
                              </div>
                          </div>
                      </Card>
                  ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};