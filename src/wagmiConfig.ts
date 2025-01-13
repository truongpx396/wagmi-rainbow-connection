import { createConfig, http } from "wagmi";
import { bscTestnet, fantomTestnet, base, mainnet } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

const projectId = import.meta.env.REOWN_PROJECT_ID;


export const config = createConfig({
  chains: [bscTestnet, fantomTestnet, mainnet, base],
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