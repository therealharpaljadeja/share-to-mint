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
  isBuyingAvailable: boolean;
  presetAmounts?: string[];
}

export const BuyCoinForm: React.FC<BuyCoinFormProps> = ({
  coinImage,
  coinName,
  coinSymbol,
  balance,
  onBuy,
  isBuyingAvailable,
  presetAmounts = ["0.001", "0.01", "0.1"],
}) => {

    const [amount, setAmount] = React.useState("0.001");

  return (
    <Card className="w-full max-w-md mx-auto p-0">
      <CardContent className="p-6 flex flex-col items-center">
        {/* Coin details */}
        <div className="flex items-center w-full mb-6">
          <img
            src={coinImage}
            alt={coinName}
            className="w-14 h-14 rounded-lg object-cover border mr-4"
          />
          <div>
            <div className="text-xl font-bold leading-tight">{coinName}</div>
            <div className="text-gray-500 text-base font-medium uppercase tracking-wide">{coinSymbol}</div>
          </div>
        </div>
        {/* Balance */}
        <div className="w-full flex justify-end mb-2">
          <span className="text-gray-400 text-sm font-medium">
            Balance <span className="text-black font-semibold">{balance.toFixed(6)} ETH</span>
          </span>
        </div>
        {/* Amount input */}
        <div className="w-full mb-4">
          <div className={`flex items-center border rounded-lg px-4 py-4 bg-gray-50 ${!isBuyingAvailable ? 'border-red-400' : 'border-gray-200'}`}>
            <Input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              disabled={!isBuyingAvailable}
              className="text-3xl font-semibold border-0 bg-transparent focus:ring-0 focus:outline-none flex-1 p-0 h-auto shadow-none"
              placeholder="0.00"
            />
            <span className="ml-2 text-lg font-bold text-gray-500 select-none">ETH</span>
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
              className="flex-1"
              onClick={() => setAmount(amt)}
              disabled={!isBuyingAvailable}
            >
              {amt} ETH
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => setAmount(balance.toString())}
            disabled={!isBuyingAvailable}
          >
            Max
          </Button>
        </div>
        {/* Buy button */}
        <Button
          className="w-full text-lg font-bold py-6 rounded-xl bg-[#00FF00] text-white hover:bg-[#00e600] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#00FF00', color: '#fff' }}
          size="lg"
          onClick={onBuy}
          disabled={!isBuyingAvailable}
        >
          Buy
        </Button>
      </CardContent>
    </Card>
  );
};

export default BuyCoinForm; 