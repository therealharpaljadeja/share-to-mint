import React, { useCallback, useMemo } from "react";
import { createTradeCall, TradeParameters } from "@zoralabs/coins-sdk";
import { Address, parseEther } from "viem";
import { simulateContract, writeContract } from "wagmi/actions";
import { config } from "@/components/wallet-provider";
import { useAccount, useSendTransaction } from "wagmi";
import { PLATFORM_REFERRER } from "@/lib/constants";

export default function useCoinTrade(coinAddress: string) {
    const { address } = useAccount();
    const [amount, setAmount] = React.useState("0.001");
    const { sendTransaction, data: hash, error } = useSendTransaction();

    // Memoize trade params for wagmi
    const tradeParams = useMemo(
        () =>
            ({
                sell: { type: "eth" },
                buy: {
                    type: "erc20",
                    address: coinAddress,
                },
                amountIn: amount,
                slippage: 0.05, // 5% slippage tolerance
                sender: address,
            } as unknown as TradeParameters),
        [coinAddress, amount, address]
    );


    const buyCoin = useCallback(async () => {
        const quote = await createTradeCall(tradeParams);
        await sendTransaction({
            to: quote.call.target as `0x${string}`,
            data: quote.call.data as `0x${string}`,
            value: BigInt(quote.call.value),
        });
    }, [coinAddress, amount, address, tradeParams]);

    return {
        amount,
        setAmount,
        buyCoin,
        hash,
        error
    };
}
