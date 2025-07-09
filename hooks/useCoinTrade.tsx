import React, { useCallback, useMemo, useState } from "react";
import { parseEther } from "viem";
import sdk from "@farcaster/miniapp-sdk";

type SwapTokenDetails = {
    /**
     * Array of tx identifiers in order of execution.
     * Some swaps will have both an approval and swap tx.
     */
    transactions: `0x${string}`[];
  };
   
  type SwapTokenErrorDetails = {
    /**
     * Error code.
     */
    error: string;
    /**
     * Error message.
     */
    message?: string;
  };
   
  export type SwapErrorReason = "rejected_by_user" | "swap_failed";
   
  export type SwapTokenResult =
    | {
        success: true;
        swap: SwapTokenDetails;
      }
    | {
        success: false;
        reason: SwapErrorReason;
        error?: SwapTokenErrorDetails;
      };

export default function useCoinTrade(coinAddress: string) {
    const [amount, setAmount] = React.useState("0.001");
    const [swapResponse, setSwapResponse] = useState<SwapTokenResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const buyCoin = useCallback(async () => {
        setIsLoading(true);
        const swapResponse = await sdk.actions.swapToken({ 
            sellToken: 'eip155:8453/native',
            buyToken: `eip155:8453/erc20:${coinAddress}`,
            sellAmount: parseEther(amount).toString(),
          })
          setSwapResponse(swapResponse);
          setIsLoading(false);
    }, [coinAddress, amount]);

    return {
        amount,
        setAmount,
        buyCoin,
        swapResponse,
        isLoading
    };
}
