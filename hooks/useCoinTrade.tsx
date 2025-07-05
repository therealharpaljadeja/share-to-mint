import React, { useCallback, useMemo } from "react";
import { tradeCoinCall } from "@zoralabs/coins-sdk";
import { Address, parseEther } from "viem";
import { simulateContract, writeContract } from "wagmi/actions";
import { config } from "@/components/wallet-provider";
import { useAccount } from "wagmi";
import { PLATFORM_REFERRER } from "@/lib/constants";

export default function useCoinTrade(
    coinAddress: string,
) {
    const { address } = useAccount();
    const [amount, setAmount] = React.useState("0.001");

    // Memoize trade params for wagmi
    const tradeParams = useMemo(
        () => ({
            direction: "buy" as const,
            target: coinAddress as Address,
            args: {
                recipient: address as Address,
                orderSize: parseEther(amount),
                minAmountOut: BigInt(0),
                tradeReferrer: PLATFORM_REFERRER as Address | undefined,
            },
        }),
        [coinAddress, amount, address]
    );

    const contractCallParams = useMemo(
        () => tradeCoinCall(tradeParams),
        [tradeParams]
    );

    const buyCoin = useCallback(async () => {
        const { request } = await simulateContract(config, contractCallParams);
        const tx = await writeContract(config, request);
        console.log("Coin bought", tx);
    }, [config]);

    return {
        amount,
        setAmount,
        buyCoin,
    };
}
