/**
 * Atlas Sanctum Treasury Page
 * Reserve integrity and fund flow visualization
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  TrendingUp,
  Lock,
  Unlock
} from 'lucide-react';

interface ReserveAccount {
  id: string;
  name: string;
  assetSymbol: string;
  currentBalance: number;
  committedBalance: number;
  proofStatus: 'verified' | 'stale' | 'unverified';
  lastCheckedAt?: string;
}

interface Payout {
  id: string;
  covenantId: string;
  amount: number;
  recipient: string;
  timestamp: string;
  txHash: string;
}

interface TreasuryPageProps {
  reserves: ReserveAccount[];
  recentPayouts: Payout[];
  onVerifyReserve: (reserveId: string) => void;
}

export function TreasuryPage({
  reserves,
  recentPayouts,
  onVerifyReserve,
}: TreasuryPageProps) {
  const totalBalance = reserves.reduce((sum, r) => sum + r.currentBalance, 0);
  const totalCommitted = reserves.reduce((sum, r) => sum + r.committedBalance, 0);
  const totalAvailable = totalBalance - totalCommitted;

  const getProofStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500';
      case 'stale':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Treasury & Reserves</h1>
        <p className="text-slate-400 mt-2">
          Reserve integrity and fund flow monitoring
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalBalance.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Across all reserves</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Committed
            </CardTitle>
            <Lock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              ${totalCommitted.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Allocated to covenants</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Available
            </CardTitle>
            <Unlock className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ${totalAvailable.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Ready for deployment</p>
          </CardContent>
        </Card>
      </div>

      {/* Reserve Coverage Bar */}
      <Card className="mb-6 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Reserve Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Total Reserve</span>
                <span className="font-bold">${totalBalance.toLocaleString()}</span>
              </div>
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${(totalAvailable / totalBalance) * 100}%` }}
                />
                <div 
                  className="h-full bg-yellow-500"
                  style={{ width: `${(totalCommitted / totalBalance) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Available: ${totalAvailable.toLocaleString()}</span>
                <span>Committed: ${totalCommitted.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="text-center">
                <p className="text-sm text-slate-400">Coverage Ratio</p>
                <p className="text-xl font-bold text-green-400">
                  {totalBalance > 0 ? Math.round((totalAvailable / totalBalance) * 100) : 0}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">Active Reserves</p>
                <p className="text-xl font-bold">{reserves.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">Verified</p>
                <p className="text-xl font-bold text-green-400">
                  {reserves.filter(r => r.proofStatus === 'verified').length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reserve Accounts */}
      <Card className="mb-6 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-400" />
            Reserve Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reserves.map((reserve) => (
              <div
                key={reserve.id}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{reserve.name}</h3>
                    <p className="text-sm text-slate-500">{reserve.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getProofStatusColor(reserve.proofStatus)}>
                      {reserve.proofStatus}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onVerifyReserve(reserve.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Current Balance</p>
                    <p className="text-lg font-bold">
                      ${reserve.currentBalance.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">{reserve.assetSymbol}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Committed</p>
                    <p className="text-lg font-bold text-yellow-400">
                      ${reserve.committedBalance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Available</p>
                    <p className="text-lg font-bold text-green-400">
                      ${(reserve.currentBalance - reserve.committedBalance).toLocaleString()}
                    </p>
                  </div>
                </div>

                {reserve.lastCheckedAt && (
                  <p className="text-xs text-slate-500 mt-3">
                    Last verified: {new Date(reserve.lastCheckedAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Payouts */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Recent Payouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentPayouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Covenant
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Recipient
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Tx Hash
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayouts.map((payout) => (
                    <tr
                      key={payout.id}
                      className="border-b border-slate-800 hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4 text-sm">{payout.covenantId}</td>
                      <td className="py-3 px-4 text-sm font-medium text-green-400">
                        ${payout.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono">
                        {payout.recipient.substring(0, 10)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {new Date(payout.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-blue-400">
                        {payout.txHash.substring(0, 16)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payouts yet</p>
              <p className="text-sm mt-1">
                Payout history will appear here after covenant executions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
