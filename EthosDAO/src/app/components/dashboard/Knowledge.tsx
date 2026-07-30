import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BookOpen, Share2, Heart, Clock, Award, BrainCircuit } from 'lucide-react';

export function Knowledge() {
  const stories = [
    {
      title: "Ancient Wisdom, Modern Code",
      category: "Cultural Heritage",
      author: "Maya J.",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1572996381632-29f2bec4f758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ2Vub3VzJTIwcGVvcGxlJTIwZGlnaXRhbCUyMHRhYmxldCUyMG5hdHVyZSUyMHN1c3RhaW5hYmxlJTIwdGVjaG5vbG9neSUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjY1NzkzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "How indigenous knowledge systems are informing the next generation of ethical AI algorithms for environmental stewardship."
    },
    {
      title: "The Mycelium Network Model",
      category: "Biomimicry",
      author: "Dr. Aris T.",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=800",
      excerpt: "Applying fungal network distribution patterns to decentralized data storage optimization."
    },
    {
      title: "Reclaiming the Commons",
      category: "Social Impact",
      author: "Elena S.",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?auto=format&fit=crop&q=80&w=800",
      excerpt: "Case studies from urban gardening projects that have successfully transitioned to DAO governance structures."
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden min-h-[400px] border border-slate-800 group">
        <img 
          src={stories[0].image} 
          alt="Featured Story" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
          <Badge className="bg-emerald-500 hover:bg-emerald-600 mb-4 text-white border-none">Featured Story</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{stories[0].title}</h1>
          <p className="text-slate-200 text-lg mb-6 line-clamp-2">{stories[0].excerpt}</p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-emerald-500">
                <AvatarImage src="https://i.pravatar.cc/150?u=maya" />
                <AvatarFallback>MJ</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium text-white">{stories[0].author}</p>
                <p className="text-slate-400">{stories[0].readTime}</p>
              </div>
            </div>
            <Button className="bg-white text-slate-950 hover:bg-slate-200">Read Article</Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stories" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Knowledge Ecosystem
          </h2>
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="stories">Impact Stories</TabsTrigger>
            <TabsTrigger value="research">AI Research Library</TabsTrigger>
            <TabsTrigger value="methods">Methodologies</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="stories">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.slice(1).concat(stories[0]).map((story, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden hover:border-slate-700 transition-all hover:-translate-y-1">
                <div className="h-48 overflow-hidden">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">{story.category}</Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {story.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-slate-100 text-lg">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm line-clamp-3">{story.excerpt}</p>
                </CardContent>
                <CardFooter className="border-t border-slate-800 pt-4 flex justify-between text-slate-400">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium hover:text-white cursor-pointer">{story.author}</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="hover:text-rose-400 transition-colors"><Heart className="w-4 h-4" /></button>
                    <button className="hover:text-blue-400 transition-colors"><Share2 className="w-4 h-4" /></button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="research">
          <div className="space-y-4">
             {[
               { title: "Ethical AI Framework v2.1", type: "PDF", size: "2.4 MB", downloads: 1240 },
               { title: "Decentralized Oracle Consensus Mechanisms", type: "Whitepaper", size: "1.1 MB", downloads: 850 },
               { title: "Regenerative Finance (ReFi) Taxonomy", type: "Dataset", size: "45 MB", downloads: 3200 },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                     <BrainCircuit className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-medium text-slate-200">{item.title}</h4>
                     <p className="text-xs text-slate-500">{item.type} • {item.size}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-6">
                   <div className="text-right hidden sm:block">
                     <p className="text-sm font-bold text-slate-300">{item.downloads}</p>
                     <p className="text-xs text-slate-500">Downloads</p>
                   </div>
                   <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white border border-slate-700">Download</Button>
                 </div>
               </div>
             ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
