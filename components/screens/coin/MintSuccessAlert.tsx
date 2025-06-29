import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import sdk from "@farcaster/frame-sdk";
import { getCoin } from "@zoralabs/coins-sdk";
import { baseSepolia } from "wagmi/chains";

export default function MintSuccessAlert({
    referrer,
    coinAddress,
}: {
    referrer: string | null;
    coinAddress: string | null;
}) {
    async function openLink(url: string) {
        await sdk.actions.openUrl(url);
    }

    async function composeCast() {
        const response = await getCoin({
            address: coinAddress as string,
            chain: baseSepolia.id,
        });

        const coin = response.data?.zora20Token;

        await sdk.actions.composeCast({
            text: coin ? `Trade ${coin.name}` : "",
            embeds: [
                `https://testnet.zora.co/coin/bsep:${coinAddress}?referrer=${referrer}`,
            ],
        });
    }

    return (
        <div>
            <Alert variant="default">
                <AlertTitle>Successfully Coined!</AlertTitle>
                <AlertDescription>Your coin has been minted!</AlertDescription>
                <div className="mt-4 flex flex-col gap-2">
                    <Button
                        className="rounded-xl bg-black text-white font-sans hover:bg-black hover:text-white"
                        onClick={() =>
                            openLink(
                                `https://testnet.zora.co/coin/bsep:${coinAddress}?referrer=${referrer}`
                            )
                        }
                    >
                        View on Zora
                    </Button>
                    <Button
                        className="rounded-xl bg-[#855DCC] text-white font-sans flex items-center gap-2 hover:bg-[#855DCC] hover:text-white"
                        onClick={composeCast}
                    >
                        <img
                            src="/images/farcaster-transparent-white.png"
                            alt="Farcaster"
                            style={{ height: "1.5em", width: "auto" }}
                        />
                        Share on Farcaster
                    </Button>
                </div>
            </Alert>
        </div>
    );
}
