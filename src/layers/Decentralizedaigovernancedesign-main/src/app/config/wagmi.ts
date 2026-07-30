import { http, createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// WalletConnect Project ID - Replace with your own from https://cloud.walletconnect.com
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

export const config = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
});
