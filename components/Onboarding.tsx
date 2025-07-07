"use client";

import { useFrame } from "@/components/farcaster-provider";
import { Button } from "@/components/ui/button";
import { sdk } from "@farcaster/frame-sdk";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { MintingTutorial } from "./MintingTutorial";
import { useEffect } from "react";
import { getAllMints } from "@/lib/database";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import React from "react";
import { FiExternalLink, FiEye } from "react-icons/fi";


// MintedCoinsList component for showing user's minted coins
function MintedCoinsList({ coins }: { coins: any[] }) {

  const openZoraLink = (url: string) => {
      sdk.haptics.impactOccurred("heavy");
      sdk.actions.openUrl(url);
  }

  const openCast = (castHash: string) => {
    sdk.haptics.impactOccurred("heavy");
    sdk.actions.viewCast({ 
      hash: castHash,
    })
  }

    if (!coins.length) return null;
    return (
        <div className="space-y-2 mt-16 w-full max-w-md">
            {coins.map((coin, idx) => (
                <div key={coin.id || idx}>
                    <Card className="flex flex-row items-center p-4">
                        <img
                            src={coin.coin_image}
                            alt={coin.coin_name}
                            className="w-20 h-20 rounded-lg object-cover mr-4 border"
                        />
                        <CardContent className="p-0 flex-1">
                            <CardTitle className="text-lg font-semibold">
                                {coin.coin_name}
                            </CardTitle>
                            <CardDescription className="capitalize text-gray-500">
                                {coin.coin_symbol}
                            </CardDescription>
                        </CardContent>
                        <button onClick={() => openZoraLink(coin.zora_link)} className="p-2 ml-4 rounded hover:bg-gray-100" aria-label="External Link">
                            <FiExternalLink size={20} />
                        </button>
                        <button onClick={() => openCast(coin.cast_hash)} className="p-2 ml-4 rounded hover:bg-gray-100" aria-label="View Cast">
                            <FiEye size={20} />
                        </button>
                    </Card>
                </div>
            ))}
        </div>
    );
}

export function Onboarding() {
    const { actions, context } = useFrame();
    const { shouldShowTutorial, isLoading } = useOnboardingState();
    const [mintedCoins, setMintedCoins] = React.useState<any[]>([]);

    useEffect(() => {
        console.log("getting mints");
        async function init() {
            const mints = await getAllMints();
            setMintedCoins(mints);
            console.log("All mints:", mints);
        }
        init();
    }, []);

    const addFrame = () => {
        sdk.haptics.impactOccurred("heavy");
        actions?.addMiniApp();
    };

    // Show loading state while checking onboarding status
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show tutorial if mini app is added but user hasn't seen tutorial or minted
    if (context?.client.added && shouldShowTutorial) {
        return <MintingTutorial />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4">
            {context?.client.added ? (
                <MintedCoinsList coins={mintedCoins} />
            ) : (
                <div className="max-w-md flex flex-1 flex-col items-center justify-center p-8 mt-16 space-y-6 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome!
                        </h1>
                        <p className="mt-2 text-gray-600">
                            To get started, add this Mini App using the button
                            below and refresh the mini app.
                        </p>
                    </div>
                    <Button
                        onClick={addFrame}
                        className="w-full bg-black text-white hover:bg-gray-800"
                    >
                        Add Mini App
                    </Button>
                </div>
            )}
        </div>
    );
}
