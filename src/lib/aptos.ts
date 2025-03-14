import { APTOS_API_KEY, NETWORK } from "@/constants";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const APTOS_CLIENT = new Aptos(
  // new AptosConfig({
  //   network: NETWORK,
  //   clientConfig: { API_KEY: APTOS_API_KEY },
  // })
  new AptosConfig({
      network: Network.CUSTOM,
      fullnode: 'https://aptos.testnet.porto.movementlabs.xyz/v1',
      faucet: 'https://fund.testnet.porto.movementlabs.xyz/',
  })
);

export const getAptosClient = () => APTOS_CLIENT;

export { NETWORK }
