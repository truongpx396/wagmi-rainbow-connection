import React, { useEffect } from "react";
import {
  WagmiProvider,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect, 
  useSwitchChain,

} from "wagmi";

import './Wagmi.css';
import { config } from "../wagmiConfig"; 
import { formatUnits } from "viem";
// import { formatUnits } from "ethers/lib/utils";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import NetworkSelector from '../components/NetworkSelector';
import ContractInteraction from "../components/ContractInteraction";


const queryClient = new QueryClient();

function Wagmi() {
  return (
    <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
            <div className="container">
                <h1 className="title">Wagmi Wallet</h1>
                <WalletManager />
            </div>
        </WagmiProvider>
    </QueryClientProvider>
  );
}

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })} className="button">
    {connector.name}
  </button>
  ))
}

function WalletManager() {
  const { address, isConnected,chain } = useAccount()
  const { disconnect } = useDisconnect()
//   const { data: ensName } = useEnsName({ address })
//   const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
  const { chains, switchChain } = useSwitchChain()

  const { data: balance } = useBalance({
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
      <button onClick={() => disconnect()} className="button">Disconnect</button>
    </div>
      <h3>Connected Wallet: {address}</h3>
      <h2 className="balance">
            Balance: {balance ?  parseFloat(formatUnits(balance.value,18)).toFixed(7) : '0.0'} {balance?.symbol}
      </h2>
      <NetworkSelector chains={chains} selectedChainId={chain?.id} handleChainChange={handleChainChange} />
      {chain && <ContractInteraction chain={chain} />}
    </div>
  );
}


export default Wagmi;
