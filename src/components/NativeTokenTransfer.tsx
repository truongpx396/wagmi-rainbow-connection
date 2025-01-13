import React, { useState } from 'react';
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseUnits } from 'viem';
import TransactionStatus from './TransactionStatus';
import { Chain } from 'wagmi/chains';

interface NativeTokenTransferProps {
  chain: Chain;
  refetchBalance: () => void;
}

const NativeTokenTransfer: React.FC<NativeTokenTransferProps> = ({
  chain,
  refetchBalance,
}) => {
  const { address } = useAccount();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const {
    data: hash,
    error: errorSendTransaction,
    sendTransaction,
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const handleTransfer = () => {
    if (
      !recipient ||
      !amount ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0
    ) {
      alert('Please enter a valid recipient address and amount.');
      return;
    }

    // Ensure the recipient address starts with '0x'
    const formattedRecipient = recipient.startsWith('0x')
      ? recipient
      : `0x${recipient}`;

    // Parse the amount to wei
    const amountInWei = parseUnits(amount, 18);

    sendTransaction({
      to: formattedRecipient,
      value: amountInWei,
    });
  };

  // Refetch balance after transaction is confirmed
  if (isConfirmed) {
    refetchBalance();
  }

  return (
    <div>
      <h2>Transfer Native Tokens</h2>
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
          disabled={isConfirming}
          className="button"
        >
          {isConfirming ? 'Processing...' : 'Transfer Tokens'}
        </button>
      </div>
      <TransactionStatus
        chain={chain}
        hash={hash}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={errorSendTransaction}
      />
    </div>
  );
};

export default NativeTokenTransfer;
