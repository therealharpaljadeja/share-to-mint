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
import React, { useEffect } from "react";
import BuyCoinForm from "./BuyCoinForm";
import { Button } from "@/components/ui/button";
import { useFrame } from "@/components/farcaster-provider";

function PromptAuthorToCoinContent({ castHash }: { castHash: string }) {
    const { actions } = useFrame();
    function promptCast() {
        actions?.composeCast({
            text: "You should coin this cast using Share to Mint!",
            embeds: [
                "https://farcaster.xyz/miniapps/2rzmuYxkv2ZP/share-to-mint",
            ],
            parent: { type: "cast", hash: castHash },
        });
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4">
            <div className="w-full flex flex-1 flex-col items-center justify-center p-8 mt-16 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Ask Author to Coin
                    </h1>
                    <p className="mt-2 text-gray-600">
                        The author of this cast has not yet minted a coin.
                    </p>
                    <p className="mt-2 text-gray-600">
                        Ask them to coin it using the button below.
                    </p>
                </div>
                <Button
                    onClick={promptCast}
                    className="w-full bg-[#08d808] hover:bg-[#08d808] hover:text-white text-white"
                >
                    Ask by casting
                </Button>
            </div>
        </div>
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

    useEffect(() => {
        async function checkIfCastIsAlreadyMinted() {
            if (!castHash) return;
            const coin = await isCastAlreadyMinted(castHash);
            setCoin(coin);
        }

        checkIfCastIsAlreadyMinted();
    }, [castHash]);

    if (isLoading) return <LoadingSkeleton />;
    if (error === "No cast found." || !cast) return <NotFoundAlert />;
    if (error) return <ErrorAlert error={error} />;
    if (viewerFid !== cast.author.fid) {
        if (!coin) {
            return <PromptAuthorToCoinContent castHash={castHash} />;
        } else {
            return (
                <div className="min-h-screen flex flex-col bg-background font-sans py-12 px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="max-w-2xl flex flex-col justify-center items-center flex-1">
                        <BuyCoinForm
                            coinAddress={coin.coin_address}
                            coinImage={coin.coin_image}
                            coinName={coin.coin_name}
                            coinSymbol={coin.coin_symbol}
                            onBuy={() => {}}
                        />
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans py-12 px-4 sm:px-6 lg:px-8 mt-8">
            <div className="max-w-2xl flex flex-col justify-center items-center flex-1">
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
            </div>
        </div>
    );
}
