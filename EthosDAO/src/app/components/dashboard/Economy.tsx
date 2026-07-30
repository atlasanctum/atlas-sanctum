import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Globe, TrendingUp, DollarSign, Users, ArrowUpRight, ChartPie } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';

const portfolioData = [
  { name: 'Reforestation', value: 400, color: '#10b981' },
  { name: 'Clean Energy', value: 300, color: '#3b82f6' },
  { name: 'Education', value: 200, color: '#f59e0b' },
  { name: 'Microfinance', value: 100, color: '#8b5cf6' },
];

export function Economy() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
      
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100">Impact Investment Portfolio</CardTitle>
            <CardDescription className="text-slate-400">Total Asset Value: $124,500.00</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
             <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <RePieChart>
                   <Pie
                     data={portfolioData}
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {portfolioData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                     ))}
                   </Pie>
                   <ReTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                 </RePieChart>
               </ResponsiveContainer>
             </div>
             <div className="space-y-4">
               {portfolioData.map((item, i) => (
                 <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                     <span className="text-slate-300 text-sm">{item.name}</span>
                   </div>
                   <span className="text-slate-100 font-medium text-sm">{((item.value / 1000) * 100).toFixed(0)}%</span>
                 </div>
               ))}
               <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                 <span className="text-sm text-slate-400">Annualized Yield (APY)</span>
                 <span className="text-emerald-400 font-bold flex items-center gap-1">
                   <TrendingUp className="w-4 h-4" /> 8.4%
                 </span>
               </div>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm bg-gradient-to-br from-indigo-900/20 to-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              Global Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-100 mb-1">14,203</div>
              <p className="text-sm text-slate-400">Lives Positively Impacted</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                <span className="text-slate-400">Jobs Created</span>
                <span className="text-slate-200">142</span>
              </div>
              <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                <span className="text-slate-400">Trees Planted</span>
                <span className="text-slate-200">8,500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">CO2 Offset (Tons)</span>
                <span className="text-slate-200">420</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invest" className="w-full">
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-100">Marketplace Opportunities</h3>
            <TabsList className="bg-slate-900 border border-slate-800">
              <TabsTrigger value="invest">Impact Funds</TabsTrigger>
              <TabsTrigger value="micro">Microfinance</TabsTrigger>
            </TabsList>
         </div>

         <TabsContent value="invest" className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { name: "Green Yield Fund IV", risk: "Low", return: "6-8%", min: "$500", type: "Energy" },
             { name: "Ocean Cleanup DAO", risk: "High", return: "12-15%", min: "$100", type: "Oceanic" },
             { name: "RegenAgri Venture", risk: "Medium", return: "8-10%", min: "$1000", type: "Agriculture" },
           ].map((fund, i) => (
             <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
               <CardHeader>
                 <Badge variant="outline" className="w-fit mb-2 bg-slate-800 text-slate-300 border-slate-700">{fund.type}</Badge>
                 <CardTitle className="text-slate-100">{fund.name}</CardTitle>
                 <div className="flex gap-2 text-xs text-slate-400 mt-2">
                   <span className="bg-slate-800 px-2 py-1 rounded">Risk: {fund.risk}</span>
                   <span className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded">Target: {fund.return}</span>
                 </div>
               </CardHeader>
               <CardFooter className="pt-0">
                 <Button className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200">Invest Now</Button>
               </CardFooter>
             </Card>
           ))}
         </TabsContent>

         <TabsContent value="micro" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Maria's Organic Farm", loc: "Peru", goal: 1200, current: 850, img: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=400" },
              { name: "Solar Lanterns Project", loc: "Kenya", goal: 500, current: 480, img: "https://images.unsplash.com/photo-1548613053-220e3f2a8907?auto=format&fit=crop&q=80&w=400" },
              { name: "Clean Water Well", loc: "Cambodia", goal: 2500, current: 1200, img: "https://images.unsplash.com/photo-1574482620266-9a572a5b6f0f?auto=format&fit=crop&q=80&w=400" },
            ].map((loan, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden">
                <div className="h-32 overflow-hidden relative">
                   <img src={loan.img} alt={loan.name} className="w-full h-full object-cover" />
                   <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                     <Users className="w-3 h-3" /> {loan.loc}
                   </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-100">{loan.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>${loan.current} raised</span>
                    <span>Goal: ${loan.goal}</span>
                  </div>
                  <Progress value={(loan.current / loan.goal) * 100} className="h-2 bg-slate-800" indicatorClassName="bg-emerald-500" />
                </CardContent>
                <CardFooter>
                   <Button variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">Lend $50</Button>
                </CardFooter>
              </Card>
            ))}
         </TabsContent>
      </Tabs>
    </div>
  );
}
