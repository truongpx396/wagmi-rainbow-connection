import React, { useState, useEffect } from 'react';
import {
//   getDefaultWallets,
//   connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
  ConnectButton,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {  useAccount,WagmiProvider } from 'wagmi';
import { bscTestnet, fantomTestnet,mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { createPublicClient, createWalletClient, custom, formatUnits, parseUnits } from 'viem';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const projectId = import.meta.env.REOWN_PROJECT_ID;

export const config1 = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: {projectId},
  chains: [bscTestnet, fantomTestnet,mainnet, polygon, optimism, arbitrum],
});

const CONTRACT_ADDRESS = '0xYourContractAddressHere'; // Replace with your contract address
const CONTRACT_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
  },
];


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
}

function MainApp() {
  const { address } = useAccount();
//   const provider = useProvider();
//   const { data: signer } = useSigner();
  const [balance, setBalance] = useState<string | null>(null);
  const [contractBalance, setContractBalance] = useState<string | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  // Detect wallet changes and update provider
  useEffect(() => {
    if (address) {
    //   provider.getBalance(address).then((userBalance) => {
    //     setBalance(formatUnits(userBalance, 18));
    //   });
    }
  }, [address]);

  // Read ERC-20 balance from contract
  const fetchContractBalance = async () => {
    if (!address) return;

    const publicClient = createPublicClient({
      chain: mainnet,
      transport: custom(provider),
    });

    const balance = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    setContractBalance(formatUnits(balance, 18));
  };

  // Transfer ERC-20 tokens
  const handleTransfer = async () => {
    if (!signer || !recipient || !amount) return;

    try {
      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(signer),
      });

      const tx = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'transfer',
        args: [recipient, parseUnits(amount, 18)],
      });

      await tx.wait();
      alert('Transfer successful!');
    } catch (error) {
      console.error('Error transferring tokens:', error);
      alert('Transfer failed!');
    }
  };

  // Handle wallet disconnection
  const disconnectWallet = () => {
    setBalance(null);
    setContractBalance(null);
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      <h1>RainbowKit + viem Example</h1>
      <ConnectButton />

      {address && (
        <div>
          <p>
            <strong>Connected Address:</strong> {address}
          </p>
          <p>
            <strong>Native Balance:</strong> {balance} ETH
          </p>

          <button onClick={fetchContractBalance} style={{ margin: '10px 0', padding: '10px' }}>
            Fetch ERC-20 Balance
          </button>

          {contractBalance && (
            <p>
              <strong>Token Balance:</strong> {contractBalance} Tokens
            </p>
          )}

          <div>
            <h3>Transfer Tokens</h3>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{ margin: '5px' }}
            />
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ margin: '5px' }}
            />
            <button onClick={handleTransfer} style={{ margin: '10px 0', padding: '10px' }}>
              Transfer
            </button>
          </div>

          <button onClick={disconnectWallet} style={{ margin: '10px 0', padding: '10px' }}>
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}

export default Rainbow;