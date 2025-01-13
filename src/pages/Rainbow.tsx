import React, { useEffect, useState } from 'react';
import {
  //   getDefaultWallets,
  //   connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
  ConnectButton,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { useAccount, useBalance, WagmiProvider, useSwitchChain } from 'wagmi';
import { formatUnits } from 'viem';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NetworkSelector from '../components/NetworkSelector';
import NativeTokenTransfer from '../components/NativeTokenTransfer';
import ContractInteraction from '../components/ContractInteraction';

import { rainbowConfig } from '../walletConfig';

import './Rainbow.css';

const queryClient = new QueryClient();

const Rainbow: React.FC = () => {
  return (
    <WagmiProvider config={rainbowConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale="en"
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
  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    unit: 'ether',
  });
  const { chains, switchChain } = useSwitchChain();
  const [componentKey, setComponentKey] = useState(0);

  useEffect(() => {
    if (address) {
      console.log(`Address changed to ${address}`);
    }
  }, [address]);

  useEffect(() => {
    if (chain) {
      console.log(`Network changed to ${chain.name} (${chain.id})`);
      // Update component key to force remount
      setComponentKey((prevKey) => prevKey + 1);
    }
  }, [chain]);

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
          {chain && (
            <NativeTokenTransfer
              key={`native-${componentKey}`}
              chain={chain}
              refetchBalance={refetchBalance}
            />
          )}
          <hr className="divider" />
          {chain && (
            <ContractInteraction
              key={`contract-${componentKey}`}
              chain={chain}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Rainbow;
