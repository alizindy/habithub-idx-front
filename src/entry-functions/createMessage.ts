import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";

export type CreateMessageArguments = {
  content: string; // the content of the message
};

export const createMessage = (
  args: CreateMessageArguments
): InputTransactionData => {
  const { content } = args;
  return {
    data: {
      function: `0x1ca6e301cd10d0245a1952a6d376654f3cbb208ddef826be65ffe9503061b0cb::custom_indexer_ex_message_board::create_message`,
      functionArguments: [content],
    },
  };
};
