"use client";

import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { Card, CardContent} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useCast from "@/hooks/useCast";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorAlert from "./ErrorAlert";
import useCoinMint from "@/hooks/useCoinMint";
import NotFoundAlert from "./NotFoundAlert";
import CastView from "./CastView";
import MintForm from "./MintForm";
import MintSuccessAlert from "./MintSuccessAlert";

export default function Coin() {
    const searchParams = useSearchParams();
    const castHash = searchParams.get("castHash") || "";
    const viewerFid = Number(searchParams.get("viewerFid")) || 0;

    const { isConnected } = useAccount();
    const { cast, isLoading, error, imageEmbedURL } = useCast(castHash, viewerFid);
    const {
        name,
        setName,
        symbol,
        setSymbol,
        formErrors,
        isMinting,
        handleCoinIt,
        coinAddress,
        referrer,
    } = useCoinMint(cast, imageEmbedURL ?? "");

    if (isLoading) return <LoadingSkeleton />;
    if (error === "No cast found." || !cast) return <NotFoundAlert />;
    if (error) return <ErrorAlert error={error} />;

    return (
        <div className="min-h-screen bg-background font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CastView cast={cast} />
                    <CardContent className="pt-4">
                        {isConnected ? (
                            <MintForm
                                name={name}
                                setName={setName}
                                symbol={symbol}
                                setSymbol={setSymbol}
                                formErrors={formErrors}
                                isMinting={isMinting}
                                handleCoinIt={handleCoinIt}
                            />
                        ) : (
                            <Alert>
                                <AlertTitle>Connect Your Wallet</AlertTitle>
                                <AlertDescription>
                                    Please connect your wallet to coin this
                                    cast.
                                </AlertDescription>
                            </Alert>
                        )}
                        {coinAddress && referrer && (
                            <MintSuccessAlert referrer={referrer} coinAddress={coinAddress} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
