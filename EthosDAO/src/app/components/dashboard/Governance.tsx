import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Check, Shield, TriangleAlert, Zap, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export function Governance() {
  const { values, proposals, voteOnProposal } = useDashboard();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Ethical Governance Console</h2>
          <p className="text-slate-400">Decentralized decision-making aligned with infinite purpose</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
            <Zap className="w-4 h-4 mr-2" />
            AI Analysis
           </Button>
           <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            New Proposal
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Values Engine */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Shield className="w-5 h-5 text-indigo-400" />
                Values Engine
              </CardTitle>
              <CardDescription className="text-slate-400">Current DAO ethical weighting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {values.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-slate-400">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-2 bg-slate-800" indicatorClassName={item.color} />
                </div>
              ))}
              
              <div className="mt-6 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-indigo-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-300">AI Consensus</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Based on current metrics, the AI recommends increasing weight on "Social Equity" for the upcoming Q3 voting cycle to balance recent aggressive ecological investments.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
           </Card>
        </div>

        {/* Right Column: Proposals */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="bg-slate-900 border border-slate-800">
              <TabsTrigger value="active" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Active Votes</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Pending Review</TabsTrigger>
              <TabsTrigger value="passed" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Passed History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4 mt-4">
              {proposals.filter(p => p.status === 'active').map((proposal) => (
                <Card key={proposal.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="mb-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          {proposal.category}
                        </Badge>
                        <CardTitle className="text-slate-100 text-lg">Proposal #{proposal.id}: {proposal.title}</CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                          {proposal.description}
                        </CardDescription>
                      </div>
                      <Badge className="bg-indigo-600 hover:bg-indigo-700">Voting Open</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-2 text-emerald-400 font-medium">
                            <ThumbsUp className="w-4 h-4" /> For
                          </span>
                          <span className="text-slate-300">{proposal.supportFor}%</span>
                        </div>
                        <Progress value={proposal.supportFor} className="h-2 bg-slate-800" indicatorClassName="bg-emerald-500" />
                      </div>
                       <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-2 text-rose-400 font-medium">
                            <ThumbsDown className="w-4 h-4" /> Against
                          </span>
                          <span className="text-slate-300">{proposal.supportAgainst}%</span>
                        </div>
                        <Progress value={proposal.supportAgainst} className="h-2 bg-slate-800" indicatorClassName="bg-rose-500" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={proposal.proposerImage} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span>Proposer: <strong>{proposal.proposer}</strong></span>
                      <span className="mx-2">•</span>
                      <span>Ends in {proposal.endsIn}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-slate-800 pt-4 flex gap-3">
                    <Button 
                      onClick={() => voteOnProposal(proposal.id, 'for')}
                      disabled={proposal.hasVoted}
                      className={`flex-1 ${proposal.hasVoted ? 'opacity-50' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                    >
                      {proposal.hasVoted ? 'Voted' : 'Vote For'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => voteOnProposal(proposal.id, 'against')}
                      disabled={proposal.hasVoted}
                      className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-300"
                    >
                      Vote Against
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="pending">
               <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm p-8 text-center">
                 <div className="flex flex-col items-center justify-center space-y-3">
                   <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                     <TriangleAlert className="w-6 h-6 text-slate-400" />
                   </div>
                   <h3 className="text-lg font-medium text-slate-200">No pending proposals</h3>
                   <p className="text-slate-400 max-w-sm">All submitted proposals have been processed by the Moral AI Protocol and moved to voting or returned for revision.</p>
                 </div>
               </Card>
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  );
}
