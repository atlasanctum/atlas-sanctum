import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const ResearchAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your Research AI. I can help you synthesize information from the papers in the hub, find connections between topics, or summarize key findings. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const responses = [
        "That's an interesting connection. Based on the 'Ethical Frameworks' paper, we can see a clear correlation with...",
        "I've analyzed the recent uploads. The consensus seems to be shifting towards decentralized governance models.",
        "Could you elaborate on how that relates to Indigenous Data Sovereignty? There might be some overlapping principles.",
        "I can summarize that whitepaper for you. Essentially, it argues for a community-first approach to data collection."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Card className="h-[600px] flex flex-col border-none shadow-none md:shadow-md bg-background">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-primary" />
          Research Assistant
        </CardTitle>
        <CardDescription>
          Powered by Global Knowledge Graph
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden relative">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.role === 'assistant' ? (
                    <div className="bg-primary h-full w-full flex items-center justify-center text-primary-foreground">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  ) : (
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  )}
                </Avatar>
                
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                   <div className="bg-primary h-full w-full flex items-center justify-center text-primary-foreground">
                      <Sparkles className="h-4 w-4" />
                    </div>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2 text-sm text-muted-foreground animate-pulse">
                  Analyzing knowledge base...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-3 border-t">
        <form 
          className="flex w-full items-center space-x-2"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <Input 
            type="text" 
            placeholder="Ask about research trends..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
