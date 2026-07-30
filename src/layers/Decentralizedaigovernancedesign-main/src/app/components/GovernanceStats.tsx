import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Users, FileText, CheckCircle2, Activity } from "lucide-react";

interface GovernanceStatsProps {
  totalProposals: number;
  activeVoters: number;
  proposalsPassed: number;
  participationRate: number;
}

export function GovernanceStats({
  totalProposals,
  activeVoters,
  proposalsPassed,
  participationRate,
}: GovernanceStatsProps) {
  const categoryData = [
    { name: "Ethics", value: 28, color: "#8b5cf6" },
    { name: "Governance", value: 35, color: "#3b82f6" },
    { name: "Technical", value: 22, color: "#10b981" },
    { name: "Funding", value: 15, color: "#f59e0b" },
  ];

  const participationTrend = [
    { month: "Jan", participation: 45, proposals: 8 },
    { month: "Feb", participation: 52, proposals: 12 },
    { month: "Mar", participation: 58, proposals: 15 },
    { month: "Apr", participation: 63, proposals: 18 },
    { month: "May", participation: 71, proposals: 22 },
    { month: "Jun", participation: 68, proposals: 19 },
  ];

  const ethicsScoreData = [
    { category: "Human Dignity", score: 95 },
    { category: "Fairness", score: 88 },
    { category: "Transparency", score: 92 },
    { category: "Privacy", score: 87 },
    { category: "Welfare", score: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="mt-3">
            <p className="text-gray-600 text-sm">Total Proposals</p>
            <p className="text-3xl mt-1">{totalProposals}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="mt-3">
            <p className="text-gray-600 text-sm">Active Voters</p>
            <p className="text-3xl mt-1">{activeVoters.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="mt-3">
            <p className="text-gray-600 text-sm">Proposals Passed</p>
            <p className="text-3xl mt-1">{proposalsPassed}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="mt-3">
            <p className="text-gray-600 text-sm">Participation Rate</p>
            <p className="text-3xl mt-1">{participationRate}%</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proposals by Category */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="mb-4">Proposals by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ethics Compliance Scores */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="mb-4">Ethics Compliance Average</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ethicsScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" fontSize={12} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Participation Trend */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="mb-4">Participation & Proposal Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={participationTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="participation"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Participation %"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="proposals"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Proposals"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
