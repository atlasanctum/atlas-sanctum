import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RefreshCw, ArrowRightLeft, Sprout, Droplets, Mountain, Code, ExternalLink, Wallet, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { motion, AnimatePresence } from 'motion/react';

export function Exchange() {
  const { assets, transactions, isWalletConnected, purchaseAsset, connectWallet } = useDashboard();
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState<string>('1');
  const [swapAmount, setSwapAmount] = useState<string>('1000');

  const handlePurchase = (assetId: number) => {
    const amount = parseInt(purchaseAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    purchaseAsset(assetId, amount);
    setPurchaseAmount('1');
    setSelectedAsset(null);
  };

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'Sprout': return Sprout;
      case 'Droplets': return Droplets;
      case 'Mountain': return Mountain;
      default: return Sprout;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Swap Interface */}
        <Card className="lg:col-span-1 bg-slate-900/50 border-slate-800 backdrop-blur-sm h-fit">
          <CardHeader>
            <CardTitle className="text-slate-100">Swap Assets</CardTitle>
            <CardDescription className="text-slate-400">Exchange tokens for impact credits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">From</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">U</div>
                   <span className="text-slate-200 font-medium">USDC</span>
                </div>
                <Input 
                  className="w-24 text-right border-none bg-transparent h-auto p-0 text-slate-100 placeholder:text-slate-600 focus-visible:ring-0" 
                  placeholder="0.00" 
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="ghost" size="icon" className="rounded-full bg-slate-800 text-slate-400 hover:text-white">
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">To</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                     <Sprout className="w-3.5 h-3.5" />
                   </div>
                   <span className="text-slate-200 font-medium">BioCredit</span>
                </div>
                <div className="text-right text-slate-100 font-medium">
                  {(parseFloat(swapAmount || '0') / 22.12).toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="pt-2 text-xs text-slate-500 flex justify-between">
              <span>Rate</span>
              <span>1 BioCredit = 22.12 USDC</span>
            </div>

            {!isWalletConnected ? (
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
                onClick={connectWallet}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet to Swap
              </Button>
            ) : (
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2">
                Confirm Exchange
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Asset Marketplace */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="all" className="w-full">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Available Regenerative Assets</h3>
                <TabsList className="bg-slate-900 border border-slate-800">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="forest">Forestry</TabsTrigger>
                  <TabsTrigger value="ocean">Oceanic</TabsTrigger>
                  <TabsTrigger value="carbon">Carbon</TabsTrigger>
                </TabsList>
             </div>
             
             <TabsContent value="all" className="space-y-4">
               {assets.map((asset) => {
                 const Icon = getIconComponent(asset.icon);
                 const isSelected = selectedAsset === asset.id;
                 
                 return (
                   <Card 
                     key={asset.id} 
                     className={`bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors cursor-pointer group ${isSelected ? 'border-emerald-500/50' : ''}`}
                   >
                     <CardContent className="p-4">
                       <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl bg-${asset.color}-500/10 flex items-center justify-center border border-${asset.color}-500/20`}>
                             <Icon className={`w-6 h-6 text-${asset.color}-500`} />
                           </div>
                           <div>
                             <h4 className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">{asset.name}</h4>
                             <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                               <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700">{asset.type}</Badge>
                               {asset.verified && (
                                 <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                   <CheckCircle2 className="w-3 h-3 mr-1" />
                                   Verified
                                 </Badge>
                               )}
                             </div>
                           </div>
                         </div>
                         <div className="text-right">
                           <div className="font-bold text-slate-100">{asset.priceFormatted}</div>
                           <div className={`text-xs ${asset.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                             {asset.change}
                           </div>
                         </div>
                       </div>
                       
                       <p className="text-sm text-slate-400 mb-3">{asset.desc}</p>
                       
                       <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                         <div className="text-xs text-slate-500">
                           Available: <span className="text-slate-300 font-medium">{asset.available.toLocaleString()}</span> credits
                         </div>
                         
                         {!isWalletConnected ? (
                           <Button 
                             size="sm" 
                             variant="outline"
                             className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20"
                             onClick={connectWallet}
                           >
                             <Wallet className="w-3 h-3 mr-1" />
                             Connect to Buy
                           </Button>
                         ) : (
                           <div className="flex items-center gap-2">
                             {isSelected && (
                               <Input
                                 type="number"
                                 min="1"
                                 max={asset.available}
                                 value={purchaseAmount}
                                 onChange={(e) => setPurchaseAmount(e.target.value)}
                                 className="w-20 h-8 text-sm bg-slate-950 border-slate-700"
                                 placeholder="1"
                               />
                             )}
                             <Button 
                               size="sm"
                               variant={isSelected ? "default" : "outline"}
                               className={isSelected 
                                 ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                                 : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                               }
                               onClick={() => {
                                 if (isSelected) {
                                   handlePurchase(asset.id);
                                 } else {
                                   setSelectedAsset(asset.id);
                                   setPurchaseAmount('1');
                                 }
                               }}
                             >
                               {isSelected ? 'Confirm Purchase' : 'Purchase'}
                             </Button>
                             {isSelected && (
                               <Button 
                                 size="sm"
                                 variant="ghost"
                                 className="text-slate-400 hover:text-white"
                                 onClick={() => setSelectedAsset(null)}
                               >
                                 Cancel
                               </Button>
                             )}
                           </div>
                         )}
                       </div>
                     </CardContent>
                   </Card>
                 );
               })}
             </TabsContent>
             
             <TabsContent value="forest" className="space-y-4">
               {assets.filter(a => a.type === 'Forestry').map((asset) => {
                 const Icon = getIconComponent(asset.icon);
                 return (
                   <Card key={asset.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                     <CardContent className="p-4">
                       <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-xl bg-${asset.color}-500/10 flex items-center justify-center border border-${asset.color}-500/20`}>
                           <Icon className={`w-6 h-6 text-${asset.color}-500`} />
                         </div>
                         <div className="flex-1">
                           <h4 className="font-semibold text-slate-200">{asset.name}</h4>
                           <p className="text-xs text-slate-400">{asset.desc}</p>
                         </div>
                         <div className="text-right">
                           <div className="font-bold text-slate-100">{asset.priceFormatted}</div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 );
               })}
             </TabsContent>
          </Tabs>
        </div>

      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100">Recent Transactions</CardTitle>
            <CardDescription className="text-slate-400">Your asset purchase history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/30 border border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tx.status === 'completed' ? 'bg-emerald-500/10' :
                      tx.status === 'pending' ? 'bg-amber-500/10' :
                      'bg-rose-500/10'
                    }`}>
                      {tx.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {tx.status === 'pending' && <Clock className="w-4 h-4 text-amber-400 animate-pulse" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Purchased {tx.amount} {tx.assetName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-100">${tx.price.toFixed(2)}</p>
                    <p className={`text-xs ${
                      tx.status === 'completed' ? 'text-emerald-400' :
                      tx.status === 'pending' ? 'text-amber-400' :
                      'text-rose-400'
                    }`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Living Smart Contracts */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-400" />
              <CardTitle className="text-slate-100">Living Smart Contract: Auto-Distribution</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ExternalLink className="w-4 h-4 mr-2" /> View on Etherscan
            </Button>
          </div>
          <CardDescription className="text-slate-400">
            This contract automatically disperses funds to project wallets when satellite oracle data verifies vegetation index growth (NDVI &gt; 0.6).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800 relative">
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-500 text-[10px] uppercase tracking-wider font-bold">Live Executing</span>
            </div>
            <pre>{`function verifyAndDistribute(bytes32 _projectId, uint256 _ndviScore) public onlyOracle {
    Project storage p = projects[_projectId];
    require(_ndviScore >= p.targetNDVI, "Target not met");
    
    uint256 payout = calculatePayout(p.stakedAmount, _ndviScore);
    
    // Auto-release to local community wallet
    (bool sent, ) = p.communityWallet.call{value: payout}("");
    require(sent, "Failed to send Ether");
    
    emit ImpactVerified(_projectId, _ndviScore, payout);
}`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}