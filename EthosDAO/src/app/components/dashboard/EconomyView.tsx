import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { TrendingUp, DollarSign, ChartPie, ArrowUpRight } from "lucide-react";

export function EconomyView() {
  return (
    <div className="space-y-6 p-6">
       <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Regenerative Economy</h2>
        <p className="text-muted-foreground">Impact investing, DeFi yields, and microfinance opportunities.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Investment Portfolio</CardTitle>
                <CardDescription>Your current holdings in the regenerative finance ecosystem.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Instrument</TableHead>
                            <TableHead>APY</TableHead>
                            <TableHead>Risk Score</TableHead>
                            <TableHead>Impact</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[
                            { name: "Green Bond (Series A)", apy: "5.2%", risk: "Low", impact: "High", value: "$12,450" },
                            { name: "Oceanic Cleanup DAO", apy: "12.5%", risk: "Med", impact: "Very High", value: "$3,200" },
                            { name: "Agroforestry Yield Farm", apy: "8.4%", risk: "Low", impact: "High", value: "$8,100" },
                            { name: "Carbon Removal Liq. Pool", apy: "18.2%", risk: "High", impact: "Med", value: "$1,500" },
                        ].map((inv, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium">{inv.name}</TableCell>
                                <TableCell className="text-green-600 font-bold">{inv.apy}</TableCell>
                                <TableCell>{inv.risk}</TableCell>
                                <TableCell>{inv.impact}</TableCell>
                                <TableCell className="text-right font-mono">{inv.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
                <CardTitle>Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                    <div className="text-3xl font-bold tracking-tight">$25,250.00</div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">+4.5% this week</Badge>
                </div>
                <div className="pt-4 border-t space-y-2">
                     <div className="flex justify-between items-center text-sm">
                        <span>USDC</span>
                        <span className="font-mono">1,250.00</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span>REGEN</span>
                        <span className="font-mono">14,000.00</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span>ETH</span>
                        <span className="font-mono">2.45</span>
                     </div>
                </div>
                <Button className="w-full mt-4">
                    <ArrowUpRight className="mr-2 h-4 w-4"/> Deposit
                </Button>
            </CardContent>
         </Card>
      </div>

      <div className="space-y-4">
          <h3 className="text-xl font-semibold">Microfinance Opportunities</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {[
                { title: "Women's Craft Coop", location: "Kenya", goal: "$5,000", raised: "$3,200", return: "3% APY" },
                { title: "Solar Pump for Village", location: "India", goal: "$2,500", raised: "$1,100", return: "5% APY" },
                { title: "Organic Seed Bank", location: "Peru", goal: "$8,000", raised: "$6,500", return: "4% APY" },
            ].map((opp, i) => (
                <Card key={i}>
                    <CardHeader>
                        <CardTitle className="text-base">{opp.title}</CardTitle>
                        <CardDescription>{opp.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Funding Goal</span>
                            <span className="font-semibold">{opp.goal}</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${(parseInt(opp.raised.replace(/[^0-9]/g, '')) / parseInt(opp.goal.replace(/[^0-9]/g, ''))) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Raised: {opp.raised}</span>
                            <span>Return: {opp.return}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="secondary" className="w-full">Invest</Button>
                    </CardFooter>
                </Card>
            ))}
          </div>
      </div>
    </div>
  );
}
