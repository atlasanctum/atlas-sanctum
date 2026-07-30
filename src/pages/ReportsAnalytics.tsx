import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  Download,
  PieChart,
  LineChart
} from "lucide-react";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";

const ReportsAnalytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [reportType, setReportType] = useState("overview");

  // Mock data - in real app, this would come from API
  const portfolioData = {
    totalValue: 125000,
    totalReturn: 15200,
    returnPercentage: 13.8,
    projectsCount: 8,
    monthlyChange: 2.4
  };

  const transactionData = [
    { date: "2024-01-15", type: "Purchase", amount: 5000, project: "Amazon Restoration", status: "completed" },
    { date: "2024-01-10", type: "Sale", amount: 3200, project: "Urban Forest", status: "completed" },
    { date: "2024-01-08", type: "Purchase", amount: 7500, project: "Mangrove Protection", status: "pending" },
    { date: "2024-01-05", type: "Dividend", amount: 1200, project: "Solar Farm", status: "completed" },
  ];

  const performanceData = [
    { month: "Jan", value: 100000, return: 12000 },
    { month: "Feb", value: 108000, return: 13500 },
    { month: "Mar", value: 112000, return: 14200 },
    { month: "Apr", value: 118000, return: 14800 },
    { month: "May", value: 122000, return: 15100 },
    { month: "Jun", value: 125000, return: 15200 },
  ];

  const projectTypes = [
    { name: "Reforestation", value: 40, count: 3 },
    { name: "Solar Energy", value: 30, count: 2 },
    { name: "Mangrove", value: 20, count: 2 },
    { name: "Urban Forest", value: 10, count: 1 },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">Please sign in to view your reports and analytics.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
              <p className="text-muted-foreground">Track your portfolio performance and investment insights</p>
            </div>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                    <p className="text-2xl font-bold text-foreground">${portfolioData.totalValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+{portfolioData.monthlyChange}% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Return</p>
                    <p className="text-2xl font-bold text-foreground">${portfolioData.totalReturn.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-500">+{portfolioData.returnPercentage}% overall</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold text-foreground">{portfolioData.projectsCount}</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-muted-foreground">Across 4 categories</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Performance</p>
                    <p className="text-2xl font-bold text-foreground">+12.5%</p>
                  </div>
                  <LineChart className="w-8 h-8 text-orange-600" />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-muted-foreground">Above market average</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different views */}
          <Tabs value={reportType} onValueChange={setReportType} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Performance</CardTitle>
                    <CardDescription>Monthly value and returns over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                      <div className="text-center">
                        <LineChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Performance chart would be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Distribution</CardTitle>
                    <CardDescription>Breakdown by project type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projectTypes.map((type) => (
                        <div key={type.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span className="font-medium">{type.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">{type.value}%</span>
                            <span className="text-sm text-muted-foreground ml-2">({type.count})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Performance Metrics</CardTitle>
                  <CardDescription>Comprehensive analysis of your investment performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {performanceData.map((data) => (
                      <div key={data.month} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{data.month} 2024</p>
                            <p className="text-sm text-muted-foreground">Portfolio Value: ${data.value.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+${data.return.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Return</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>All your recent transactions and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactionData.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            transaction.type === 'Purchase' ? 'bg-blue-500' :
                            transaction.type === 'Sale' ? 'bg-green-500' :
                            transaction.type === 'Dividend' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}></div>
                          <div>
                            <p className="font-medium">{transaction.type} - {transaction.project}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'Sale' || transaction.type === 'Dividend' ? 'text-green-600' : 'text-foreground'
                          }`}>
                            {transaction.type === 'Sale' || transaction.type === 'Dividend' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </p>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Analytics</CardTitle>
                  <CardDescription>Detailed breakdown of your project investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Project analytics visualization would be displayed here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing detailed performance metrics for each project in your portfolio
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportsAnalytics;