import React, { useEffect, useState, ReactNode } from 'react';

import { formatUnits, parseUnits } from 'viem';
import './Appkit.css';

import { createAppKit } from '@reown/appkit/react';

import {
  WagmiProvider,
  useAccount,
  useBalance,
  useSendTransaction,
} from 'wagmi';
import { AppKitNetwork, arbitrum, mainnet } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.reown.com
const projectId = 'YOUR_PROJECT_ID';

// 2. Create a metadata object - optional
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// 3. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, arbitrum];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

function ConnectButton() {
  return <appkit-button />;
}

const AppkitPage: React.FC = () => {
  return (
    <>
      <div className="appkit-container">
        <h1 className="center-title">Appkit Wallet</h1>
        <ConnectButton />
        <MainApp />
      </div>
    </>
  );
};

const MainApp: React.FC = () => {
  const { address } = useAccount();
  const { data: balance, refetch: refetchBalance } = useBalance({ address });
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const {
    sendTransaction,
    data: txHash,
    isPending,
    isSuccess,
  } = useSendTransaction();

  const handleTransfer = () => {
    if (
      !recipient ||
      !recipient.startsWith('0x') ||
      !amount ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0
    ) {
      alert('Please enter a valid recipient address and amount.');
      return;
    }

    const amountInWei = parseUnits(amount, 18);

    sendTransaction({
      to: recipient as `0x${string}`,
      value: amountInWei,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
    }
  }, [isSuccess]);

  return (
    <div>
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
            ETH
          </p>
          <div>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="Amount to Transfer"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
            />
            <button
              onClick={handleTransfer}
              disabled={isPending}
              className="button"
            >
              {isPending ? 'Processing...' : 'Transfer Tokens'}
            </button>
          </div>
          {txHash && (
            <div className="transaction-info">
              <p>Transaction Hash: {txHash}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppkitPage;
