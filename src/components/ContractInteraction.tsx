
import React, { useState,useEffect } from "react";
import {
  useAccount,

  useWaitForTransactionReceipt,
  useReadContract,
  useWriteContract,
  useBlockNumber,
  type BaseError,
} from "wagmi";

import tokenAbi from '../constants/abi/Token.json'; // Import the ABI from Token.json
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
    
  
  
    // Fetch token balance
    const { data: tokenBalance, error : errorBalance,
      isPending: isPendingLoad,refetch } = useReadContract({
      ...tokenAbi,
      functionName: "balanceOf",
      args: [address || '0x0000000000000000000000000000000000000000'],
    });
  
  
    const handleTransfer =  () => {
      if (!recipient || !amount || isNaN(amount) || BigInt(amount) <= 0) {
        alert("Please enter a valid recipient address and amount.");
        return;
      }
  
      // Ensure the recipient address starts with '0x'
      const formattedRecipient = recipient.startsWith('0x') ? recipient : `0x${recipient}`;
  
      writeContract({
          address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
          abi: tokenAbi,
          functionName: 'transfer',
          args: [formattedRecipient as `0x${string}`, BigInt(amount)]
      })
       
     
    };
  
  
    return (
      <div>
        <h2>Token Balance: {tokenBalance?.toString()}</h2>
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
          isPendingLoad && <div>Loading Contract BalanceOf...</div>
        }
        {
          errorBalance && <div>Error: {(error as BaseError)?.shortMessage || error?.message}</div>
        }
      </div>
    );
  }

  export default ContractInteraction;