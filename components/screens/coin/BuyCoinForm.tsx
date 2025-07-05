import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BuyCoinFormProps {
    coinImage: string;
    coinName: string;
    coinSymbol: string;
    balance: number;
    onBuy: () => void;
    presetAmounts?: string[];
}

export const BuyCoinForm: React.FC<BuyCoinFormProps> = ({
    coinImage,
    coinName,
    coinSymbol,
    balance,
    onBuy,
    presetAmounts = ["0.001", "0.01", "0.1"],
}) => {
    const [amount, setAmount] = React.useState("0.001");

    return (
        <Card className="w-full max-w-md mx-auto p-0">
            <CardContent className="px-4 py-6 flex flex-col items-center">
                {/* Coin details */}
                <div className="flex flex-col space-y-4 items-center w-full mb-6">
                    <div className="flex flex-col items-center justify-center">
                        <img
                            src={coinImage}
                            alt={coinName}
                            className="w-32 h-32 rounded-lg object-cover border mr-4"
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
                            {balance.toFixed(6)} ETH
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
                    className="w-full text-base font-bold py-6 rounded-xl bg-[#00FF00] text-white hover:bg-[#00e600] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#00FF00", color: "#fff" }}
                    size="lg"
                    onClick={onBuy}
                    // disabled={!isBuyingAvailable}
                >
                    Buy
                </Button>
            </CardContent>
        </Card>
    );
};

export default BuyCoinForm;
