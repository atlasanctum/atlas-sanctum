import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, BookOpen, Share2 } from "lucide-react";

const stories = [
    {
        title: "Reforesting the Amazon",
        author: "Maria Silva",
        category: "Ecosystem Restoration",
        image: "https://images.unsplash.com/photo-1760624683181-7570791efd52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWZvcmVzdGF0aW9uJTIwbmF0dXJlJTIwZm9yZXN0JTIwZ3JlZW58ZW58MXx8fHwxNzY2NTc5MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        excerpt: "How a community-led DAO restored 500 hectares of degraded land using smart contracts."
    },
    {
        title: "Ocean Plastic to Energy",
        author: "Kai Sato",
        category: "Circular Economy",
        image: "https://images.unsplash.com/photo-1706612204508-d48772f8731b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMGNsZWFudXAlMjBibHVlJTIwd2F0ZXIlMjBwbGFzdGljfGVufDF8fHx8MTc2NjU3OTA3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        excerpt: "New technologies funded by microfinance are turning the Pacific Garbage Patch into a resource."
    },
    {
        title: "Solar Farming Cooperatives",
        author: "Elena Rodriguez",
        category: "Renewable Energy",
        image: "https://images.unsplash.com/photo-1721137532037-c3686b77355f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGZhcm0lMjByZW5ld2FibGUlMjBlbmVyZ3klMjBzdW58ZW58MXx8fHwxNzY2NTc5MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        excerpt: "Decentralized energy grids are empowering rural communities to become energy independent."
    },
    {
        title: "Urban Permaculture",
        author: "John Doe",
        category: "Agriculture",
        image: "https://images.unsplash.com/photo-1708354056878-5bbdc1626a59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXJkZW4lMjBwZW9wbGUlMjBwbGFudGluZ3xlbnwxfHx8fDE3NjY1NzkwNzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        excerpt: "Transforming city rooftops into thriving food forests through collective action."
    }
];

export function KnowledgeView() {
  return (
    <div className="space-y-6 p-6">
       <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Global Knowledge Hub</h2>
        <p className="text-muted-foreground">Share impact stories and access the AI-curated library of regenerative research.</p>
      </div>

      <div className="relative w-full max-w-xl">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search the AI Library for research, case studies, or blueprints..." className="pl-8" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-4">
        {stories.map((story, i) => (
            <Card key={i} className="overflow-hidden flex flex-col h-full">
                <div className="relative h-48 w-full">
                    <img src={story.image} alt={story.title} className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105 duration-500" />
                </div>
                <CardHeader className="p-4">
                    <Badge variant="secondary" className="w-fit mb-2">{story.category}</Badge>
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                    <CardDescription className="text-xs">By {story.author}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">{story.excerpt}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                        <BookOpen className="mr-2 h-3 w-3" /> Read
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
      
      <div className="mt-8 rounded-xl bg-muted/50 p-6">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h3 className="text-lg font-semibold">Contributing to the Commons</h3>
                <p className="text-sm text-muted-foreground">Your project data is automatically anonymized and added to the Global Knowledge Graph to help others learn.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
