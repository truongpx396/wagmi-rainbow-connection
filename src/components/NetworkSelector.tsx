import React from 'react';
import { Chain } from 'wagmi/chains';
import './NetworkSelector.css';

interface NetworkSelectorProps {
  chains: readonly Chain[];
  selectedChainId: number | undefined;
  handleChainChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ chains, selectedChainId, handleChainChange }) => {
  return (
    <div>
      <label htmlFor="chainSelect" className="label">Select Network:</label>
      <select id="chainSelect" onChange={handleChainChange} className="select" value={selectedChainId}>
        {chains.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NetworkSelector;