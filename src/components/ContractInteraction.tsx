
import React, { useState,useEffect } from "react";
import {
  useAccount,

  useWaitForTransactionReceipt,
  useReadContracts,
//   useReadContract,
  useWriteContract,
  useBlockNumber,
  type BaseError,
} from "wagmi";

import { formatUnits, parseUnits } from "viem";

import tokenAbi from '../constants/abi/Token.json';
import TransactionStatus from "./TransactionStatus";

import { Chain } from 'wagmi/chains'

interface ContractInteractionProps {
  chain: Chain;
}

const ContractInteraction: React.FC<ContractInteractionProps> = ({ chain }) => {
    const { address } = useAccount();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState(0);
  
    const { data: hash,error, isPending, writeContract } = useWriteContract()
  
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })
  
    const { data: blockNumber } = useBlockNumber({ watch: true })
  
    useEffect(() => {
        // want to refetch every `n` block instead? use the modulo operator!
        // if (blockNumber % 5 === 0) refetch() // refetch every 5 blocks
        refetch()
    }, [blockNumber])
    
  
  
   // Fetch token balance and symbol
  const { data, error: errorContracts, isPending: isPendingContracts, refetch } = useReadContracts({
    contracts: [
      {
        abi: tokenAbi,
        address: '0x2486b14A10b5d396A3866955840D0bbB777AE6FD',
        functionName: "balanceOf",
        args: [address || '0x0000000000000000000000000000000000000000'],
      },
      {
        abi: tokenAbi,
        address: '0x2486b14A10b5d396A3866955840D0bbB777AE6FD',
        functionName: "symbol",
      },
    ],
  });

  const tokenBalance = data?.[0]?.result;
  const tokenSymbol = data?.[1]?.result;
  
  
    const handleTransfer =  () => {
      if (!recipient || !amount || isNaN(amount) || BigInt(amount) <= 0) {
        alert("Please enter a valid recipient address and amount.");
        return;
      }
  
      // Ensure the recipient address starts with '0x'
      const formattedRecipient = recipient.startsWith('0x') ? recipient : `0x${recipient}`;
  
      // Parse the amount to wei
    const amountInWei = parseUnits(amount.toString(), 18);

      writeContract({
          address: '0x2486b14A10b5d396A3866955840D0bbB777AE6FD',
          abi: tokenAbi,
          functionName: 'transfer',
          args: [formattedRecipient as `0x${string}`, amountInWei]
      })
       
     
    };
  
    // Format the token balance with commas as thousands separators
    const formattedTokenBalance = tokenBalance ? new Intl.NumberFormat().format(parseFloat(formatUnits(tokenBalance, 18))) : '0.0';

    return (
      <div>
        <h2>Token Balance: {formattedTokenBalance} {tokenSymbol}</h2>
        {/* <h3>Token Price: {priceInUSD ? `$${priceInUSD}` : "Fetching..."} USD</h3> */}
        <div>
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="input"
          />
          <input
            type="number"
            placeholder="Amount to Transfer"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="input"
          />
          <button onClick={handleTransfer} disabled={isPending} className="button">
            {isPending ? "Processing..." : "Transfer Tokens"}
          </button>
        </div>
        <TransactionStatus
            chain={chain}
            hash={hash}
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            error={error}
          />
        {
          isPendingContracts && <div>Loading Contract BalanceOf...</div>
        }
        {
          errorContracts && <div>Error: {(error as BaseError)?.shortMessage || error?.message}</div>
        }
      </div>
    );
  }

  export default ContractInteraction;