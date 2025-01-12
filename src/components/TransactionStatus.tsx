import React from 'react';
import { WriteContractErrorType } from 'wagmi/actions';
import { Chain } from 'wagmi/chains';
import './TransactionStatus.css'; 

interface TransactionStatusProps {
  chain: Chain;
  hash: string | undefined;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: WriteContractErrorType | null;
//   getExplorerLink: (hash: string) => string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ chain, hash, isConfirming, isConfirmed, error }) => {

const getExplorerLink = (hash: string) => {
    const explorerUrls: { [key: number]: string } = {
        1: `https://etherscan.io/tx/${hash}`,
        5: `https://goerli.etherscan.io/tx/${hash}`,
        56: `https://bscscan.com/tx/${hash}`,
        97: `https://testnet.bscscan.com/tx/${hash}`,
        250: `https://ftmscan.com/tx/${hash}`,
        4002: `https://testnet.ftmscan.com/tx/${hash}`,
        8453: `https://basescan.org/tx/${hash}`,
        84531: `https://goerli.basescan.org/tx/${hash}`,
    };
    return explorerUrls[chain.id] || `https://etherscan.io/tx/${hash}`;
    };
    
  return (
    <div>
      {hash && (
        <div className="transactionInfo">
          Transaction Hash: <a href={getExplorerLink(hash)} target="_blank" rel="noopener noreferrer" className="link">{hash}</a>
        </div>
      )}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <p style={{ color: "red" }}>Transaction failed: {error.message}</p>
      )}
    </div>
  );
};


export default TransactionStatus;