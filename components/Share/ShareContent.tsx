"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    validateMetadataURIContent,
    ValidMetadataURI,
} from "@zoralabs/coins-sdk";
import { createCoinCall, DeployCurrency } from "@zoralabs/coins-sdk";
import { base, baseSepolia } from "viem/chains";
import { Address } from "viem";
import { simulateContract, writeContract } from "wagmi/actions";
import { config } from "../wallet-provider";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface CastAuthor {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
}

interface CastEmbed {
    url?: string;
    metadata?: {
        content_type?: string;
        image?: {
            width_px: number;
            height_px: number;
        };
    };
}

interface Cast {
    hash: string;
    text: string;
    author: CastAuthor;
    embeds: CastEmbed[];
    timestamp: string;
    reactions: {
        likes: number;
        recasts: number;
    };
}

async function fetchCastContent(castHash: string, viewerFid?: number) {
    const response = await fetch(
        `/api/cast?identifier=${castHash}&type=hash${
            viewerFid ? `&viewerFid=${viewerFid}` : ""
        }`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch cast");
    }

    return response.json();
}

export default function ShareContent() {
    const searchParams = useSearchParams();
    const [cast, setCast] = useState<Cast | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMinting, setIsMinting] = useState(false);
    const [mintResult, setMintResult] = useState<any | null>(null);
    const { isConnected, address, chainId } = useAccount();
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [formErrors, setFormErrors] = useState({
        name: false,
        symbol: false,
    });

    const castHash = searchParams.get("castHash") || "";
    const viewerFid = Number(searchParams.get("viewerFid")) || 0;

    useEffect(() => {
        async function loadCast() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetchCastContent(castHash, viewerFid);
                setCast(response.cast);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to load cast"
                );
            } finally {
                setIsLoading(false);
            }
        }

        if (castHash) {
            loadCast();
        }
    }, [castHash, viewerFid]);

    const validateForm = () => {
        const errors = {
            name: name.trim() === "",
            symbol: symbol.trim() === "",
        };
        setFormErrors(errors);
        return !Object.values(errors).some(Boolean);
    };

    const handleCoinIt = async () => {
        if (!validateForm() || !cast) return;

        const imageEmbed = cast.embeds.find((embed) =>
            embed.metadata?.content_type?.startsWith("image/")
        );
        if (!imageEmbed?.url) {
            alert("This cast doesn't have an image to mint.");
            return;
        }

        setMintResult(null);
        setIsMinting(true);
        try {
            const metadata = {
                name: cast.hash,
                description: cast.text,
                image: imageEmbed.url,
                properties: {
                    category: "social",
                },
            };

            const metadataUploadResponse = await fetch("/api/uploadJSON", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonData: metadata,
                    filename: cast.hash,
                }),
            });

            if (!metadataUploadResponse.ok) {
                throw new Error("Failed to upload metadata to IPFS.");
            }

            const metadataUploadResult = await metadataUploadResponse.json();
            setMintResult(metadataUploadResult);

            const metadataURI = `https://green-defeated-warbler-251.mypinata.cloud/ipfs/${metadataUploadResult.cid}`;
            const metadataURIContent = await validateMetadataURIContent(
                metadataURI as ValidMetadataURI
            );

            if (!metadataURIContent) {
                throw new Error("Metadata is not valid. Please try again.");
            }

            const coinParams = {
                name: name,
                symbol: symbol,
                uri: `${metadataURI}`,
                payoutRecipient:
                    "0xc0708E7852C64eE695e94Ad92E2aB7221635944d" as Address,
                platformReferrer:
                    "0xc0708E7852C64eE695e94Ad92E2aB7221635944d" as Address,
                chainId: baseSepolia.id,
                currency: DeployCurrency.ETH,
            };

            const contractCallParams = await createCoinCall(coinParams);

            const { request } = await simulateContract(config, {
                ...contractCallParams,
            });

            const result = await writeContract(config, request);
            console.log(result);
        } catch (err) {
            console.error(err);
            alert(
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred during minting."
            );
        } finally {
            setIsMinting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-lg">
                    <AlertTitle>Error Loading Cast</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!cast) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Alert className="max-w-lg">
                    <AlertTitle>No Cast Found</AlertTitle>
                    <AlertDescription>
                        The cast you're looking for could not be found.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <img
                                src={cast.author.pfp_url}
                                alt={cast.author.display_name}
                                className="h-12 w-12 rounded-full"
                            />
                            <div>
                                <CardTitle>{cast.author.display_name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    @{cast.author.username}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground text-base break-words">
                            {cast.text}
                        </p>

                        {cast.embeds && cast.embeds.length > 0 && (
                            <div className="mt-4 space-y-4">
                                {cast.embeds.map((embed, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border overflow-hidden"
                                    >
                                        {embed.metadata?.content_type?.startsWith(
                                            "image/"
                                        ) ? (
                                            <img
                                                src={embed.url}
                                                alt="Cast image"
                                                className="w-full h-auto"
                                            />
                                        ) : embed.url ? (
                                            <a
                                                href={embed.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline p-4 block break-all"
                                            >
                                                {embed.url}
                                            </a>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        )}

                        <Separator className="my-6" />

                        {isConnected ? (
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Coin Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="My Awesome Coin"
                                        value={name}
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
                                        onChange={(e) => setSymbol(e.target.value)}
                                        className={formErrors.symbol ? "border-destructive" : ""}
                                    />
                                </div>
                                <Button
                                    onClick={handleCoinIt}
                                    disabled={isMinting}
                                    className="w-full"
                                >
                                    {isMinting ? "Coining it..." : "Coin it"}
                                </Button>
                            </div>
                        ) : (
                            <Alert>
                                <AlertTitle>Connect Your Wallet</AlertTitle>
                                <AlertDescription>
                                    Please connect your wallet to coin this cast.
                                </AlertDescription>
                            </Alert>
                        )}

                        {mintResult && (
                            <div className="mt-6">
                                <Alert variant="default">
                                    <AlertTitle>Successfully Coined!</AlertTitle>
                                    <AlertDescription>
                                        Your content metadata has been uploaded to IPFS.
                                        <a
                                            href={`https://green-defeated-warbler-251.mypinata.cloud/ipfs/${mintResult.cid}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-primary hover:underline mt-2 block"
                                        >
                                            View on IPFS Gateway
                                        </a>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
