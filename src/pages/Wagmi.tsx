import React, { useEffect, useState } from 'react';
import {
  WagmiProvider,
  useAccount,
  useBalance,
  useDisconnect,
  useSwitchChain,
} from 'wagmi';

import { wagmiConfig } from '../walletConfig';
import { formatUnits } from 'viem';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import WalletOptions from '../components/WalletOptions';
import NetworkSelector from '../components/NetworkSelector';
import NativeTokenTransfer from '../components/NativeTokenTransfer';
import ContractInteraction from '../components/ContractInteraction';

import './Wagmi.css';

const queryClient = new QueryClient();

function Wagmi() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <div className="container">
          <h1 className="title">Wagmi Wallet</h1>
          <WalletManager />
        </div>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

function WalletManager() {
  //   const { data: ensName } = useEnsName({ address })
  //   const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();
  const [componentKey, setComponentKey] = useState(0);

  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    unit: 'ether',
  });

  useEffect(() => {
    if (address) {
      console.log(`Address changed to ${address} `);
    }
  }, [address]);

  useEffect(() => {
    if (chain) {
      console.log(`Network changed to ${chain.name} (${chain.id})`);
      setComponentKey((prevKey) => prevKey + 1);
    }
  }, [chain]);

  if (!isConnected) return <WalletOptions />;

  const handleChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const chainId = parseInt(event.target.value, 10);
    switchChain({ chainId });
  };

  return (
    <div>
      <div className="walletInfo">
        {/* {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
        {address && <div>{ensName ? `${ensName} (${address})` : address}</div>} */}
        <button onClick={() => disconnect()} className="button">
          Disconnect
        </button>
      </div>
      <h3>Connected Wallet: {address}</h3>
      <h2 className="balance">
        Balance:{' '}
        {balance
          ? parseFloat(formatUnits(balance.value, 18)).toFixed(7)
          : '0.0'}{' '}
        {balance?.symbol}
      </h2>
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
        <ContractInteraction key={`contract-${componentKey}`} chain={chain} />
      )}
    </div>
  );
}

export default Wagmi;
