import { createConfig, http } from 'wagmi';
import {
  bscTestnet,
  fantomTestnet,
  base,
  mainnet,
  polygon,
  optimism,
  arbitrum,
} from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [bscTestnet, fantomTestnet, mainnet, base],
  // connectors: [injected(), walletConnect({ projectId }), metaMask(), safe()],
  connectors: [metaMask(), walletConnect({ projectId })],
  transports: {
    [bscTestnet.id]: http(),
    [fantomTestnet.id]: http(),
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

export const rainbowConfig = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: projectId,
  chains: [bscTestnet, fantomTestnet, mainnet, polygon, optimism, arbitrum],
});
