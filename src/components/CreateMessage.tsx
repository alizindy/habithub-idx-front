"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

import { getAptosClient } from "@/lib/aptos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TransactionOnExplorer } from "@/components/ExplorerLink";
import { createMessage } from "@/entry-functions/createMessage";
import { writeModuleFunction } from "@/lib/write_create_campaign";
import { createCampaign } from "@/entry-functions/createCampaign";
import { Network } from "aptos";
import { movement } from "@/lib/movement_utils";

interface CreateCampaignData {
  name: string;
  duration: number;
  rewardPool: number;
  rewardPerSubmit: number;
  maxParticipant: number;
}

// ✅ **New state for campaign data**
const initialCampaignData: CreateCampaignData = {
  name: "",
  duration: 9000,
  rewardPool: 3000,
  rewardPerSubmit: 300,
  maxParticipant: 10,
};

const FormSchema = z.object({
  stringContent: z.string(),
  name: z.string(),
  duration: z.number(),
  rewardPool: z.number(),
  rewardPerSubmit: z.number(),
  maxParticipant: z.number(),
});

export function CreateMessage() {
  const { toast } = useToast();
  const { connected, account, signAndSubmitTransaction, changeNetwork } = useWallet();
  const queryClient = useQueryClient();

  // ✅ **Use state for campaign data**
  const [campaignData, setCampaignData] = useState<CreateCampaignData>(
    initialCampaignData
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      stringContent: "hello world",
      ...initialCampaignData, // ✅ Include campaign default values
    },
  });

  const onSignAndSubmitTransaction = async (
    data: z.infer<typeof FormSchema>
  ) => {
    if (!account) {
      console.error("Wallet not available");
      return;
    }

    writeModuleFunction({
      name: data.name,
      duration: data.duration,
      rewardPool: data.rewardPool,
      rewardPerSubmit: data.rewardPerSubmit,
      maxParticipant: data.maxParticipant,
    })

    // signAndSubmitTransaction(
    //   // createMessage({
    //   //   content: data.stringContent,
    //   // })
    //   createCampaign({
    //     name: data.name,
    //     duration: data.duration,
    //     rewardPool: data.rewardPool,
    //     rewardPerSubmit: data.rewardPerSubmit,
    //     maxParticipant: data.maxParticipant,
    //   })
    // )
    //   .then((committedTransaction) => {
    //     console.log(getAptosClient().faucet);
    //     return getAptosClient().waitForTransaction({
    //       transactionHash: committedTransaction.hash,
    //     });
    //   })
    //   .then((executedTransaction) => {
    //     toast({
    //       title: "Success",
    //       description: (
    //         <TransactionOnExplorer hash={executedTransaction.hash} />
    //       ),
    //     });
    //     return new Promise((resolve) => setTimeout(resolve, 3000));
    //   })
    //   .then(() => {
    //     return queryClient.invalidateQueries({ queryKey: ["messages"] });
    //   })
    //   .catch((error) => {
    //     console.error("Error", error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to create a message",
    //     });
    //   });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new campaign and message</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSignAndSubmitTransaction)}
            className="flex flex-col justify-between gap-4 w-1/2"
          >
            {/* ✅ Campaign Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Enter the campaign name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Duration in seconds.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Reward Pool */}
            <FormField
              control={form.control}
              name="rewardPool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward Pool</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Total reward pool.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Reward Per Submit */}
            <FormField
              control={form.control}
              name="rewardPerSubmit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward Per Submission</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Reward for each valid submission.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Max Participants */}
            <FormField
              control={form.control}
              name="maxParticipant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Participants</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Maximum participants allowed.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Message Field */}
            {/* <FormField
              control={form.control}
              name="stringContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>String Content</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Store a string content</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* ✅ Submit Button */}
            <Button
              type="submit"
              disabled={!connected}
              className="w-40 self-start col-span-2"
            >
              Create
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
