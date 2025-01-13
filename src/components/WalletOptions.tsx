
import {
    useConnect,
  } from "wagmi";

const WalletOptions : React.FC = () => {
    const { connectors, connect } = useConnect()
  
    return connectors.map((connector) => (
      <button key={connector.uid} onClick={() => connect({ connector })} className="button">
      {connector.name}
    </button>
    ))
}

export default WalletOptions;