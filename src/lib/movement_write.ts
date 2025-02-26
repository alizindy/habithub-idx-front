import { getSigner, movement } from "./movement_utils";

const CAMPAIGN_ACCOUNT = "0xa3b5c51391716af38f845a6a19b7f6a831ea242600f2bca584ad8af63042c5a7";
const MODULE = "Campaign";

const CAMPAIGN_NAME = "Campaign Name 1 Naja";
const DURATION = 9000;
const REWARD_POOL = 3000;
const REWARD_PER_SUBMIT = 300;
const MAX_PARTICIPANT = 10;

export const writeModuleFunction = async () => {
    const signer = await getSigner();
    const txn = await movement.transaction.build.simple({
        sender: signer.accountAddress,
        data: {
            function: `${CAMPAIGN_ACCOUNT}::${MODULE}::create_campaign`,
            typeArguments: [],
            functionArguments: [CAMPAIGN_NAME, DURATION, REWARD_POOL, REWARD_PER_SUBMIT, MAX_PARTICIPANT]
        },
    });

    const commitedTxn = await movement.signAndSubmitTransaction({
        signer: signer,
        transaction: txn
    })

    await movement.waitForTransaction({transactionHash: commitedTxn.hash});
    console.log(`Commited Transaction: ${commitedTxn.hash}`)
}

// writeModuleFunction();
// ACCOUNT::MODULE::FUNCTION_NAME
