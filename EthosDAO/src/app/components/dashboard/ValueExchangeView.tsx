import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ArrowRightLeft, Sprout, Wind, Droplets } from "lucide-react";

export function ValueExchangeView() {
  return (
    <div className="space-y-6 p-6">
       <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Regenerative Assets</h2>
        <p className="text-muted-foreground">Manage and exchange value backed by real-world ecological restoration.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Carbon Credits</CardTitle>
                <Wind className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">450.5 TCO2</div>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">Verified by Verra</p>
            </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Water Restoration</CardTitle>
                <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">12,000 gal</div>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Active in Colorado Basin</p>
            </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">Biodiversity Tokens</CardTitle>
                <Sprout className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">85 BIO</div>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Supporting Amazon Sector 7</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>History of asset exchanges and regenerative impacts.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[
                            { asset: "Carbon Credits", type: "Purchase", amount: "+50 TCO2", date: "Oct 24, 2023", status: "Completed" },
                            { asset: "BIO Token", type: "Transfer", amount: "-10 BIO", date: "Oct 22, 2023", status: "Completed" },
                            { asset: "Water Credits", type: "Stake", amount: "5,000 gal", date: "Oct 20, 2023", status: "Staked" },
                            { asset: "Regen Coin", type: "Swap", amount: "200 RGN", date: "Oct 18, 2023", status: "Completed" },
                        ].map((tx, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium">{tx.asset}</TableCell>
                                <TableCell>{tx.type}</TableCell>
                                <TableCell>{tx.amount}</TableCell>
                                <TableCell>{tx.date}</TableCell>
                                <TableCell className="text-right">{tx.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
         </Card>
      </div>

      <div className="flex justify-end">
         <Button className="gap-2">
            <ArrowRightLeft className="h-4 w-4"/>
            Initiate New Transfer
         </Button>
      </div>
    </div>
  );
}
