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

function CastAlreadyMintedWarning() {
    return (
        <div className="h-full flex flex-col justify-center">
        <Alert
            variant="default"
            className="border-yellow-400 bg-yellow-50"
        >
            <AlertTitle>Already Minted</AlertTitle>
            <AlertDescription>
                This cast has already been minted. You cannot mint it again.
            </AlertDescription>
        </Alert>
        </div>
    );
}

export default function Coin() {
    const searchParams = useSearchParams();
    const castHash = searchParams.get("castHash") || "";
    const viewerFid = Number(searchParams.get("viewerFid")) || 0;

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

    const [alreadyMinted, setAlreadyMinted] = React.useState(false);
    React.useEffect(() => {
        if (!castHash) return;
        isCastAlreadyMinted(castHash).then(setAlreadyMinted);
    }, [castHash]);

    if (isLoading) return <LoadingSkeleton />;
    if (error === "No cast found." || !cast) return <NotFoundAlert />;
    if (error) return <ErrorAlert error={error} />;

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans py-12 px-4 sm:px-6 lg:px-8 mt-8">
            <div className="max-w-2xl flex-1 mx-auto">
                {alreadyMinted ? (
                    <CastAlreadyMintedWarning />
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
