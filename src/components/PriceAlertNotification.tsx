 /**
  * Price Alert Notification Component
  * Shows real-time connection status and recent price updates
  */
 
 import { motion, AnimatePresence } from 'framer-motion';
 import { Wifi, WifiOff, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
 import { useRealtimePriceAlerts } from '@/hooks/useRealtimePriceAlerts';
 import { Badge } from '@/components/ui/badge';
 
 export function PriceAlertNotification() {
   const { connectionStatus, lastPriceUpdate, isConnected } = useRealtimePriceAlerts();
 
   return (
     <div className="fixed bottom-4 right-4 z-50">
       <AnimatePresence>
         {/* Connection Status Indicator */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: 20 }}
           className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium shadow-lg ${
             isConnected
               ? 'bg-primary/10 text-primary border border-primary/20'
               : connectionStatus === 'connecting'
               ? 'bg-muted text-muted-foreground border border-border'
               : 'bg-destructive/10 text-destructive border border-destructive/20'
           }`}
         >
           {isConnected ? (
             <>
               <Wifi className="w-4 h-4" />
               <span>Price alerts active</span>
             </>
           ) : connectionStatus === 'connecting' ? (
             <>
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
               >
                 <AlertCircle className="w-4 h-4" />
               </motion.div>
               <span>Connecting...</span>
             </>
           ) : (
             <>
               <WifiOff className="w-4 h-4" />
               <span>Reconnecting...</span>
             </>
           )}
         </motion.div>
 
         {/* Price Update Toast */}
         {lastPriceUpdate && (
           <motion.div
             key={lastPriceUpdate.timestamp}
             initial={{ opacity: 0, x: 100, scale: 0.8 }}
             animate={{ opacity: 1, x: 0, scale: 1 }}
             exit={{ opacity: 0, x: 100, scale: 0.8 }}
             className="mt-2 p-4 bg-card border border-border rounded-xl shadow-lg"
           >
             <div className="flex items-center gap-3">
               {lastPriceUpdate.changePercent >= 0 ? (
                 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                   <TrendingUp className="w-5 h-5 text-primary" />
                 </div>
               ) : (
                 <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                   <TrendingDown className="w-5 h-5 text-destructive" />
                 </div>
               )}
               <div>
                 <p className="font-medium text-foreground">Price Updated</p>
                 <p className="text-sm text-muted-foreground">
                   ${lastPriceUpdate.price.toFixed(2)}
                   <Badge 
                     variant={lastPriceUpdate.changePercent >= 0 ? 'default' : 'destructive'}
                     className="ml-2"
                   >
                     {lastPriceUpdate.changePercent >= 0 ? '+' : ''}
                     {lastPriceUpdate.changePercent.toFixed(2)}%
                   </Badge>
                 </p>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   );
 }