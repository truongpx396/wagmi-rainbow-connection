import React, { useEffect } from 'react';
import {
  //   getDefaultWallets,
  //   connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
  ConnectButton,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, WagmiProvider, useSwitchChain } from 'wagmi';
import {
  bscTestnet,
  fantomTestnet,
  mainnet,
  polygon,
  optimism,
  arbitrum,
} from 'wagmi/chains';
import { formatUnits } from 'viem';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NetworkSelector from '../components/NetworkSelector';
import ContractInteraction from '../components/ContractInteraction';
import './Rainbow.css';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

console.log('projectId', projectId);
export const config1 = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: projectId,
  chains: [bscTestnet, fantomTestnet, mainnet, polygon, optimism, arbitrum],
});

const queryClient = new QueryClient();

const Rainbow: React.FC = () => {
  return (
    <WagmiProvider config={config1}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale="en"
          // chains={chains}
          theme={darkTheme({
            accentColor: '#7b3fe4',
            accentColorForeground: 'white',
            borderRadius: 'small',
            fontStack: 'system',
          })}
        >
          <MainApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

function MainApp() {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({
    address,
    unit: 'ether',
  });
  const { chains, switchChain } = useSwitchChain();

  useEffect(() => {
    if (address) {
      //   provider.getBalance(address).then((userBalance) => {
      //     setBalance(formatUnits(userBalance, 18));
      //   });
    }
  }, [address]);

  const handleChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const chainId = parseInt(event.target.value, 10);
    switchChain({ chainId });
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      <h1 className="center-title">RainbowKit Wallet</h1>
      <ConnectButton />

      {address && (
        <div>
          <p>
            <strong>Connected Address:</strong> {address}
          </p>
          <p>
            <strong>Native Balance:</strong>{' '}
            {balance
              ? parseFloat(formatUnits(balance.value, 18)).toFixed(7)
              : '0.0'}{' '}
            {balance?.symbol} ETH
          </p>

          <NetworkSelector
            chains={chains}
            selectedChainId={chain?.id}
            handleChainChange={handleChainChange}
          />
          {chain && <ContractInteraction chain={chain} />}
        </div>
      )}
    </div>
  );
}

export default Rainbow;
