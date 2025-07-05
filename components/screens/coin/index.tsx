"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import useCast from "@/hooks/useCast";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorAlert from "./ErrorAlert";
import useCoinMint from "@/hooks/useCoinMint";
import NotFoundAlert from "./NotFoundAlert";
import CastView from "./CastView";
import PageContent from "./PageContent";
import { isCastAlreadyMinted } from "@/lib/database";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import React from "react";
import BuyCoinForm from "./BuyCoinForm";

function CastAlreadyMintedWarning() {
    return (
        <Alert
            variant="default"
            className="border-yellow-400 bg-yellow-50"
        >
            <AlertTitle>Already Minted</AlertTitle>
            <AlertDescription>
                This cast has already been minted. You cannot mint it again.
            </AlertDescription>
        </Alert>
    );
}

export default function Coin() {
    const searchParams = useSearchParams();
    const castHash = searchParams.get("castHash") || "";
    const viewerFid = Number(searchParams.get("viewerFid")) || 0;
    const [coin, setCoin] = React.useState<any>(null);

    const { cast, isLoading, error, imageEmbedURL } = useCast(
        castHash,
        viewerFid
    );
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

    React.useEffect(() => {
        if (!castHash) return;
        isCastAlreadyMinted(castHash).then(setCoin);
    }, [castHash]);

    if (isLoading) return <LoadingSkeleton />;
    if (error === "No cast found." || !cast) return <NotFoundAlert />;
    if (error) return <ErrorAlert error={error} />;

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans py-12 px-4 sm:px-6 lg:px-8 mt-8">
            <div className="max-w-2xl flex flex-col justify-center items-center flex-1 mx-auto">
                {coin ? (
                    // <CastAlreadyMintedWarning />
                    <BuyCoinForm coinImage={coin.coin_image} coinName={cast.text} coinSymbol={cast.text} balance={0} onBuy={() => {}} isBuyingAvailable={false} />
                ) : (
                    <Card>
                        <CastView cast={cast} />
                        <CardContent className="pt-4">
                            <PageContent
                                isUploadingMetadata={isUploadingMetadata}
                                isWaitingForUserToConfirm={
                                    isWaitingForUserToConfirm
                                }
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
                )}
            </div>
        </div>
    );
}
