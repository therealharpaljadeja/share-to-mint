"use client";

import { useSearchParams } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
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
import { Button } from "@/components/ui/button";
import farcasterFrame from "@farcaster/frame-wagmi-connector";
import PageContent from "./PageContent";

export default function Coin() {
    const searchParams = useSearchParams();
    const castHash = searchParams.get("castHash") || "";
    const viewerFid = Number(searchParams.get("viewerFid")) || 0;

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
        isUploadingMetadata,
        isWaitingForUserToConfirm,
    } = useCoinMint(cast, imageEmbedURL ?? "");

    if (isLoading) return <LoadingSkeleton />;
    if (error === "No cast found." || !cast) return <NotFoundAlert />;
    if (error) return <ErrorAlert error={error} />;

    return (
        <div className="min-h-screen bg-background font-sans py-12 px-4 sm:px-6 lg:px-8 mt-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CastView cast={cast} />
                    <CardContent className="pt-4">
                        <PageContent
                            isUploadingMetadata={isUploadingMetadata}
                            isWaitingForUserToConfirm={isWaitingForUserToConfirm}
                            coinAddress={coinAddress}
                            referrer={referrer}
                            name={name}
                            setName={setName}
                            symbol={symbol}
                            setSymbol={setSymbol}
                            formErrors={formErrors}
                            isMinting={isMinting}
                            handleCoinIt={handleCoinIt}
                            />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
