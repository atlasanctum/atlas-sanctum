import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart, MessageCircle, Share2, PlusCircle, Trophy, Star, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { toast } from 'sonner';
import { fetchStories, submitStory, likeStory, initializeData } from '@/app/utils/api';

export const ImpactStories = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
      title: '',
      category: '',
      story: ''
  });

  // Load stories on mount
  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setIsLoading(true);
      const response = await fetchStories();
      
      if (response.success) {
        setStories(response.data);
        
        // If no stories exist, initialize with default data
        if (response.data.length === 0) {
          await initializeData();
          const retryResponse = await fetchStories();
          if (retryResponse.success) {
            setStories(retryResponse.data);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load stories:', error);
      toast.error('Failed to load stories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.title || !formData.category || !formData.story) {
          toast.error("Please fill in all fields");
          return;
      }

      setIsSubmitting(true);

      try {
        const response = await submitStory({
          title: formData.title,
          category: formData.category,
          story: formData.story,
          author: "Community Member", // Could be from user context
          authorImage: "",
        });

        if (response.success) {
          setOpen(false);
          toast.success("Story submitted successfully!", {
              description: "Your impact story has been published."
          });
          setFormData({ title: '', category: '', story: '' });
          
          // Reload stories to show the new one
          await loadStories();
        }
      } catch (error) {
        console.error('Failed to submit story:', error);
        toast.error("Failed to submit story. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
  };

  const handleLike = async (storyId: string) => {
    try {
      const response = await likeStory(storyId);
      if (response.success) {
        // Update the story in the local state
        setStories(stories.map(story => 
          story.id === storyId ? response.data : story
        ));
      }
    } catch (error) {
      console.error('Failed to like story:', error);
      toast.error("Failed to like story. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Global Impact Stories</h2>
          <p className="text-muted-foreground max-w-2xl">
            Discover how communities around the world are leveraging knowledge and technology for positive change.
          </p>
        </div>
        <div className="flex gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Contribute Story
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Share Your Impact</DialogTitle>
                <DialogDescription>
                    Tell us about a project or initiative that's making a difference.
                </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                        Title
                        </Label>
                        <Input 
                            id="title" 
                            placeholder="Project Title" 
                            className="col-span-3" 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                        Category
                        </Label>
                        <Input 
                            id="category" 
                            placeholder="e.g. Environment" 
                            className="col-span-3"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="story" className="text-right">
                        Story
                        </Label>
                        <Textarea 
                            id="story" 
                            placeholder="Tell your story..." 
                            className="col-span-3"
                            value={formData.story}
                            onChange={(e) => setFormData({...formData, story: e.target.value})}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Story"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            </Dialog>
            <Button variant="outline">View All Stories</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card key={story.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.title} 
                  className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
                <Badge className="absolute top-4 right-4 bg-background/80 hover:bg-background/90 text-foreground backdrop-blur">
                  {story.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer">{story.title}</CardTitle>
                <CardDescription className="line-clamp-3">{story.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto border-t p-4 pt-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={story.authorImage} />
                          <AvatarFallback>{story.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {story.likes > 100 && (
                          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-[2px] border border-background" title="Top Contributor">
                              <Trophy className="h-2 w-2 text-white" />
                          </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground leading-none">{story.author}</span>
                      {story.likes > 200 && <span className="text-[10px] text-primary flex items-center gap-0.5"><Star className="h-2 w-2" /> Impact Leader</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <button 
                      onClick={() => handleLike(story.id)}
                      className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-4 w-4" /> {story.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" /> {story.comments}
                    </button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};