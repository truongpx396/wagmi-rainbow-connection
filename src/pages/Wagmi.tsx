import React, { useEffect } from "react";
import {
  WagmiProvider,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect, useEnsAvatar, useEnsName,

  useSwitchChain,
  http,
  createConfig,
} from "wagmi";


import { bscTestnet,fantomTestnet, base, mainnet } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
import './Wagmi.css'; // Import the CSS module

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ContractInteraction from "../components/ContractInteraction";



const projectId = import.meta.env.REOWN_PROJECT_ID;


export const config = createConfig({
  chains: [bscTestnet,fantomTestnet, mainnet, base],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [bscTestnet.id]: http(),
    [fantomTestnet.id]: http(),
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

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

export function ChainOptions() {   
    const { chains, switchChain } = useSwitchChain()
    
    return chains.map((chain) => (
        <button key={chain.id} onClick={() => switchChain({ chainId: chain.id })} className="button">
        {chain.name}
        </button>
    ))
}

function WalletManager() {
  const { address, isConnected,chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
  const { chains, switchChain } = useSwitchChain()

  const { data: balance } = useBalance({
    address,
  });

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
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <button onClick={() => disconnect()} className="button">Disconnect</button>
    </div>
      <h1>Connected Wallet: {address}</h1>
      <h2 className="balance">
        Balance: {balance?.formatted} {balance?.symbol}
      </h2>
      <div>
        <label htmlFor="chainSelect" className="label">Select Network:</label>
        <select id="chainSelect" onChange={handleChainChange} className="select">
          {chains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>
      {chain && <ContractInteraction chain={chain} />}
    </div>
  );
}


export default Wagmi;
