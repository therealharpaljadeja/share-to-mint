import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCoinTrade from "@/hooks/useCoinTrade";
import { useFrame } from "@/components/farcaster-provider";
import { useAccount } from "wagmi";
import ErrorAlert from "./ErrorAlert";
import { config } from "@/components/wallet-provider";
import { getBalance } from "wagmi/actions";
import { formatUnits } from "viem";

interface BuyCoinFormProps {
    coinImage: string;
    coinAddress: string;
    coinName: string;
    coinSymbol: string;
    onBuy: () => void;
    presetAmounts?: string[];
}

export const BuyCoinForm: React.FC<BuyCoinFormProps> = ({
    coinImage,
    coinAddress,
    coinName,
    coinSymbol,
    onBuy,
    presetAmounts = ["0.001", "0.01", "0.1"],
}) => {
    const { buyCoin, setAmount, amount, swapResponse } =
        useCoinTrade(coinAddress);
    const [balance, setBalance] = useState("0");
    const { actions } = useFrame();
    const {address} = useAccount();

    useEffect(() => {
        if(address) {
            getBalanceOfConnectedWallet();
        }
    }, [address]);

    async function getBalanceOfConnectedWallet() {
        if(!address) return;

        const { value, decimals } = await getBalance(config, {
            address,
        })
        setBalance(formatUnits(value, Number(decimals)));
    }

    if (swapResponse && swapResponse.success) {
        return <div className="w-full flex flex-1 flex-col items-center justify-center p-8 mt-16 space-y-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    Coin Purchased!
                </h1>
                <p className="mt-2 text-gray-600">
                    View your coin in your farcaster wallet.
                </p>
            </div>
            <Button
                onClick={async () => {
                    await actions?.viewToken({ token: `eip155:8453/erc20:${coinAddress}` });
                }}
                className="w-full bg-black text-white hover:bg-gray-800"
            >
                View Coin
            </Button>
        </div>
    }

    return (
        <Card className="w-full max-w-md mx-auto p-0">
            <CardContent className="px-4 py-6 flex flex-col items-center">
                {/* Error Alert */}
                {swapResponse && !swapResponse.success && (
                    <div className="w-full mb-4">
                        <ErrorAlert
                            error={
                                swapResponse.reason
                            }
                        />
                    </div>
                )}
                {/* Coin details */}
                <div className="flex flex-col space-y-4 items-center w-full mb-6">
                    <div className="flex flex-col items-center justify-center">
                        <img
                            src={coinImage}
                            alt={coinName}
                            className="w-48 h-48 rounded-lg object-cover border"
                        />
                    </div>
                    <div className="flex flex-col text-center space-y-2 min-w-0 break-words">
                        <div className="text-base font-semibold leading-tight break-words whitespace-normal">
                            {coinName}
                        </div>
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide break-words whitespace-normal">
                            {coinSymbol}
                        </div>
                    </div>
                </div>
                {/* Balance */}
                <div className="w-full flex justify-end mb-2">
                    <span className="text-xs text-gray-400 font-medium">
                        Balance{" "}
                        <span className="text-black font-semibold">
                            {balance} ETH
                        </span>
                    </span>
                </div>
                {/* Amount input */}
                <div className="w-full mb-4">
                    <div
                        className={`flex items-center border rounded-lg px-4 py-4 bg-gray-50 border-gray-200`}
                        style={{ minWidth: 0 }}
                    >
                        <Input
                            type="number"
                            min="0"
                            step="any"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            // disabled={!isBuyingAvailable}
                            className="text-2xl font-semibold border-0 bg-transparent focus:ring-0 focus:outline-none p-0 h-auto shadow-none flex-grow min-w-0"
                            placeholder="0.00"
                            style={{ width: "100px", minWidth: 0 }}
                        />
                        <span className="ml-2 text-base font-bold text-gray-500 select-none">
                            ETH
                        </span>
                    </div>
                </div>
                {/* Preset amount buttons */}
                <div className="w-full flex gap-2 mb-6">
                    {presetAmounts.map((amt) => (
                        <Button
                            key={amt}
                            type="button"
                            variant="outline"
                            size="lg"
                            className="min-w-[100px] text-xs px-0"
                            onClick={() => setAmount(amt)}
                            // disabled={!isBuyingAvailable}
                        >
                            {amt} ETH
                        </Button>
                    ))}
                </div>
                {/* Buy button */}
                <Button
                    className="w-full text-base font-bold py-6 rounded-xl bg-[#08d808] text-white hover:bg-[#00e600] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#08d808", color: "#fff" }}
                    size="lg"
                    onClick={buyCoin}
                    // disabled={!isBuyingAvailable}
                >
                    Buy
                </Button>
            </CardContent>
        </Card>
    );
};

export default BuyCoinForm;
