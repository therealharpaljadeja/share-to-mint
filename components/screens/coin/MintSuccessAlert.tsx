import { useFrame } from "@/components/farcaster-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useCast from "@/hooks/useCast";
import { PLATFORM_REFERRER } from "@/lib/constants";
import { getCoin } from "@zoralabs/coins-sdk";
import { useSearchParams } from "next/navigation";
import { base } from "wagmi/chains";

export default function MintSuccessAlert({
    coinAddress,
}: {
    coinAddress: string | null;
}) {
    const { actions } = useFrame();
    const searchParams = useSearchParams();

    async function openLink(url: string) {
        console.log("openLink", url);
        await actions?.openUrl(url);
    }

    async function composeCast() {
        const response = await getCoin({
            address: coinAddress as string,
            chain: base.id,
        });

        const coin = response.data?.zora20Token;

        await actions?.composeCast({
            text: coin ? `Trade ${coin.name}` : "",
            embeds: [
                `${process.env.NEXT_PUBLIC_ZORA_URL}/coin/base:${coinAddress}?referrer=${PLATFORM_REFERRER}`,
            ],
            parent: searchParams.get("castHash") ? {
                type: 'cast',
                hash: searchParams.get("castHash") as string,
            } : undefined
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
                                `${process.env.NEXT_PUBLIC_ZORA_URL}/coin/base:${coinAddress}?referrer=${PLATFORM_REFERRER}`
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
