import dotenv from 'dotenv';

// Ensure dotenv config is called at the very top of the file
dotenv.config();

import { Ed25519PrivateKey, Aptos, AptosConfig, Network, NetworkToNetworkName } from '@aptos-labs/ts-sdk';

// Now you can safely access the environment variable
const OWNER_PRIVATE_KEY = "0xaec6e4ec0ebde2a77376a3a247debd49b64b1e805fae441dcdddd76b88f42594";//process.env.OWNER_PRIVATE_KEY ?? "TEST";

if (!OWNER_PRIVATE_KEY) {
    throw new Error('OWNER_PRIVATE_KEY is not defined in the environment variables');
}

const config = new AptosConfig({
    network: Network.CUSTOM,
    fullnode: 'https://aptos.testnet.porto.movementlabs.xyz/v1',
    faucet: 'https://fund.testnet.porto.movementlabs.xyz/',
});

const movement = new Aptos(config);

const getSigner = async () => {
    const privateKey = new Ed25519PrivateKey(OWNER_PRIVATE_KEY);
    const signer = await movement.deriveAccountFromPrivateKey({ privateKey });
    return signer;
};

export { getSigner, movement };
