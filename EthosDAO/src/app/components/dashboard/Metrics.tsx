import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Map, ChartBar, Activity, Wind, Droplets, Leaf } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';

export function Metrics() {
  const { forecastData, sectorData } = useDashboard();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      
      {/* Ecosystem Map */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden relative min-h-[400px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1712508818413-76a31994b525?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBtYXAlMjBlYXJ0aCUyMGRhcmslMjBtb2RlJTIwZGF0YSUyMHZpc3VhbGl6YXRpb258ZW58MXx8fHwxNzY2NTc5MzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="Global Ecosystem Map" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
        
        <CardHeader className="relative z-10">
          <div className="flex justify-between items-start">
             <div>
               <CardTitle className="text-slate-100 flex items-center gap-2">
                 <Map className="w-5 h-5 text-emerald-400" />
                 Global Ecosystem Mapping
               </CardTitle>
               <CardDescription className="text-slate-300 max-w-lg">
                 Real-time sensor data from IoT devices, satellite imagery, and community reports visualizing planetary health.
               </CardDescription>
             </div>
             <div className="flex gap-2">
               <Button variant="outline" className="bg-slate-950/50 border-slate-700 text-slate-300 hover:text-white">Live Feed</Button>
               <Button variant="outline" className="bg-slate-950/50 border-slate-700 text-slate-300 hover:text-white">Heatmap Mode</Button>
             </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 mt-auto h-[250px] flex items-end justify-end p-6">
           <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 p-4 rounded-xl w-64 space-y-3">
             <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">Live Anomalies</h4>
             <div className="flex items-center gap-2 text-xs text-rose-400">
               <Activity className="w-3 h-3" />
               <span>High CO2 Spike - Zone 4</span>
             </div>
             <div className="flex items-center gap-2 text-xs text-emerald-400">
               <Leaf className="w-3 h-3" />
               <span>Reforestation Target Met - Zone 12</span>
             </div>
             <div className="flex items-center gap-2 text-xs text-amber-400">
               <Wind className="w-3 h-3" />
               <span>Methane Leak - Zone 7</span>
             </div>
           </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sector Performance */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100">Regenerative Sector Performance</CardTitle>
            <CardDescription className="text-slate-400">Current impact score vs Target (Real-time)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="score" name="Current Score" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  <Bar dataKey="target" name="Target" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Forecasting */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-slate-100">AI Forecasting Model</CardTitle>
                <CardDescription className="text-slate-400">Projected Carbon Sequestration (Tons)</CardDescription>
              </div>
              <Badge variant="outline" className="h-6 bg-purple-500/10 text-purple-400 border-purple-500/20">Confidence: 94%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                  <Legend />
                  <Line type="monotone" dataKey="actual" name="Actual" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                  <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#a855f7' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}