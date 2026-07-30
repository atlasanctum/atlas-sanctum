import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { Activity, ChartBar, TreePine } from "lucide-react";

const impactData = [
  { month: 'Jan', agriculture: 400, oceanic: 240, circular: 240 },
  { month: 'Feb', agriculture: 300, oceanic: 139, circular: 221 },
  { month: 'Mar', agriculture: 200, oceanic: 980, circular: 229 },
  { month: 'Apr', agriculture: 278, oceanic: 390, circular: 200 },
  { month: 'May', agriculture: 189, oceanic: 480, circular: 218 },
  { month: 'Jun', agriculture: 239, oceanic: 380, circular: 250 },
  { month: 'Jul', agriculture: 349, oceanic: 430, circular: 210 },
];

const forecastData = [
  { year: '2023', projected: 100, actual: 110 },
  { year: '2024', projected: 150, actual: 160 },
  { year: '2025', projected: 220, actual: null },
  { year: '2026', projected: 300, actual: null },
  { year: '2027', projected: 450, actual: null },
];

export function MetricsView() {
  return (
    <div className="space-y-6 p-6">
       <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Ecosystem Metrics</h2>
        <p className="text-muted-foreground">Real-time data integration measuring regenerative impact across key sectors.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Cross-Sector Impact</CardTitle>
            <CardDescription>Regenerative output by sector (Unit: Impact Points)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Legend />
                  <Bar dataKey="agriculture" name="Agriculture" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="oceanic" name="Oceanic" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="circular" name="Circular Econ" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
           <CardHeader>
            <CardTitle>AI Impact Forecasting</CardTitle>
            <CardDescription>Projected vs Actual Ecosystem Recovery Index</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="year" fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="projected" name="AI Forecast" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="actual" name="Actual Data" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
               <CardTitle className="text-sm font-medium">Data Sources Connected</CardTitle>
               <Activity className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">142</div>
               <p className="text-xs text-muted-foreground">Global sensors & satellite feeds</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
               <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
               <ChartBar className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">94.8%</div>
               <p className="text-xs text-muted-foreground">Last model training: 4h ago</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
               <CardTitle className="text-sm font-medium">Mapped Ecosystems</CardTitle>
               <TreePine className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">12 Regions</div>
               <p className="text-xs text-muted-foreground">High fidelity scanning active</p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
