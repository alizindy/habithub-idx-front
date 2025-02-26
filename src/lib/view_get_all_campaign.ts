import { movement } from "./movement_utils";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";

const CAMPAIGN_ACCOUNT = "0xa3b5c51391716af38f845a6a19b7f6a831ea242600f2bca584ad8af63042c5a7";
const MODULE = "Campaign";

export const viewModuleFunction: any = async () => {
    const payload: InputViewFunctionData = {
        function: `${CAMPAIGN_ACCOUNT}::${MODULE}::get_all_campaign`,
        typeArguments: [],
        functionArguments: []
    };
    const output = (await movement.view({payload}));
    return output;
}