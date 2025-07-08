import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuSparkle } from "react-icons/lu";

export default function MintForm({
    name,
    setName,
    symbol,
    setSymbol,
    formErrors,
    isMinting,
    handleCoinIt,
}: any) {

    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Coin Name</Label>
                <Input
                    id="name"
                    placeholder="My Awesome Content Coin"
                    value={name}
                    disabled={isMinting}
                    onChange={(e) => setName(e.target.value)}
                    className={formErrors.name ? "border-destructive" : ""}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                    id="symbol"
                    placeholder="COIN"
                    value={symbol}
                    disabled={isMinting}
                    onChange={(e) => setSymbol(e.target.value)}
                    className={formErrors.symbol ? "border-destructive" : ""}
                />
            </div>
            <Button
                onClick={handleCoinIt}
                disabled={isMinting}
                className="w-full bg-black text-white py-6 text-lg hover:bg-gray-900 active:scale-95 transition-transform duration-100"
            >
                {isMinting ? (
                    "Coining it..."
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <LuSparkle />
                        <span>Coin it</span>
                    </span>
                )}
            </Button>
        </div>
    );
}
