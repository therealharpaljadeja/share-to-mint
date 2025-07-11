"use client";

import { useFrame } from "@/components/farcaster-provider";
import { Button } from "@/components/ui/button";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { MintingTutorial } from "./MintingTutorial";
import { useEffect } from "react";
import { getAllMints, getUserMints } from "@/lib/database";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import React from "react";
import { FiExternalLink, FiEye } from "react-icons/fi";
import sdk from "@farcaster/miniapp-sdk";
import { GoMegaphone } from "react-icons/go";


// MintedCoinsList component for showing user's minted coins
function MintedCoinsList({ coins }: { coins: any[] }) {
    const { actions, haptics } = useFrame();
    const [openIdx, setOpenIdx] = React.useState<number | null>(null);

  const openZoraLink = (url: string) => {
      haptics?.impactOccurred("heavy");
      sdk.actions?.openUrl(url);
  }

  const openCast = (castHash: string) => {
    haptics?.impactOccurred("heavy");
    actions?.viewCast({ 
      hash: castHash,
    })
  }

  const composeCastOnFarcaster = (coin: any) => {
    haptics?.impactOccurred("heavy");
    sdk.actions?.composeCast({
      text: `I just minted a coin on Zora using Share to Mint! Check it out!`,
      embeds: [
        coin.zora_link
      ],
      parent: {
        type: 'cast',
        hash: coin.cast_hash
      }
    })
  }

    if (!coins.length) return null;
    return (
        <div className="space-y-2 mt-16 w-full max-w-md">
            {coins.map((coin, idx) => (
                <div key={coin.id || idx}>
                    <Card
                        className="flex flex-row items-center p-4 cursor-pointer select-none"
                        onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    >
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
                        <div className="ml-4">
                            {openIdx === idx ? (
                                <span className="text-gray-500">▲</span>
                            ) : (
                                <span className="text-gray-500">▼</span>
                            )}
                        </div>
                    </Card>
                    {openIdx === idx && (
                        <div className="flex flex-row justify-end gap-4 bg-gray-50 border-x border-t border-t-gray-200 border-b rounded-b-lg p-4">
                            <button
                                onClick={e => { e.stopPropagation(); composeCastOnFarcaster(coin); }}
                                className="flex flex-col items-center p-2 rounded hover:bg-gray-100"
                                aria-label="Cast"
                            >
                                <GoMegaphone size={20} />
                                <span className="text-xs text-gray-500 mt-1">Cast on Farcaster</span>
                            </button>
                            <button
                                onClick={e => { e.stopPropagation(); openZoraLink(coin.zora_link); }}
                                className="flex flex-col items-center p-2 rounded hover:bg-gray-100"
                                aria-label="External Link"
                            >
                                <FiExternalLink size={20} />
                                <span className="text-xs text-gray-500 mt-1">View on Zora</span>
                            </button>
                            <button
                                onClick={e => { e.stopPropagation(); openCast(coin.cast_hash); }}
                                className="flex flex-col items-center p-2 rounded hover:bg-gray-100"
                                aria-label="View Cast"
                            >
                                <FiEye size={20} />
                                <span className="text-xs text-gray-500 mt-1">View Cast</span>
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export function Onboarding() {
    const { context, haptics } = useFrame();
    const { shouldShowTutorial, isLoading } = useOnboardingState();
    const [mintedCoins, setMintedCoins] = React.useState<any[]>([]);

    useEffect(() => {
        async function init() {

            if(context?.user?.fid) {
                const mints = await getUserMints(context?.user?.fid);
                setMintedCoins(mints);
            }
        }
        init();
    }, [context]);

    const addMiniApp = () => {
        haptics?.impactOccurred("heavy");
        sdk.actions?.addMiniApp();
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
                <div className="w-full flex flex-1 flex-col items-center justify-center p-8 mt-16 space-y-6 bg-white rounded-lg shadow-md">
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
                        onClick={addMiniApp}
                        className="w-full bg-black text-white hover:bg-gray-800"
                    >
                        Add Mini App
                    </Button>
                </div>
            )}
        </div>
    );
}
