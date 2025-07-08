import React, { useCallback, useMemo } from "react";
import { createTradeCall, tradeCoin, TradeParameters } from "@zoralabs/coins-sdk";
import { useAccount, usePublicClient, useSendTransaction, useWalletClient } from "wagmi";
import { Account, PublicClient, WalletClient } from "viem";

export default function useCoinTrade(coinAddress: string) {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const account = useAccount();
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
                slippage: 0.1,
                sender: address,
            } as unknown as TradeParameters),
        [coinAddress, amount, address]
    );


    const buyCoin = useCallback(async () => {
        // const quote = await createTradeCall(tradeParams);
        // console.log("quote", quote);
        const receipt = await tradeCoin({
            tradeParameters: tradeParams,
            walletClient: walletClient as WalletClient,
            account: account as unknown as Account,
            publicClient: publicClient as PublicClient,
            validateTransaction: false, // Skip validation and gas estimation
          });
          console.log("receipt", receipt);
    }, [coinAddress, amount, address, tradeParams]);

    return {
        amount,
        setAmount,
        buyCoin,
        hash,
        error
    };
}
