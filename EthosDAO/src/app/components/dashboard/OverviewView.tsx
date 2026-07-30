import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowUpRight, Leaf, ShieldCheck, Users, Globe } from "lucide-react";
import { motion } from "motion/react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 550 },
  { name: 'Apr', value: 480 },
  { name: 'May', value: 650 },
  { name: 'Jun', value: 780 },
];

export function OverviewView() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planetary Dashboard</h2>
          <p className="text-muted-foreground">Global regeneration status and personal impact overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Download Report</Button>
          <Button>Connect Wallet</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ethical Alignment
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last epoch
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Carbon Sequestered
            </CardTitle>
            <Leaf className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234 t</div>
            <p className="text-xs text-muted-foreground">
              +19% month over month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              DAO Participation
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Voted in 4 active proposals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Global Impact
            </CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">High</div>
            <p className="text-xs text-muted-foreground">
              Top 5% of contributors
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Regenerative Value Flow</CardTitle>
            <CardDescription>
              Your contribution to ecosystem restoration over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Actions</CardTitle>
            <CardDescription>
              Latest governance and financial activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Voted on Proposal #402", time: "2h ago", type: "Governance", icon: Users },
                { label: "Staked 500 REGENCoin", time: "5h ago", type: "Finance", icon: ArrowUpRight },
                { label: "Harvested Carbon Credits", time: "1d ago", type: "Assets", icon: Leaf },
                { label: "New Impact Story Published", time: "2d ago", type: "Social", icon: Globe },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-4 rounded-full bg-secondary p-2">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <Badge variant="secondary">{item.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
