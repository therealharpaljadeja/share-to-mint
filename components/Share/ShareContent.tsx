"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
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
import { LuSparkle } from "react-icons/lu";
import { sdk } from "@farcaster/frame-sdk";

// --- TYPE DEFINITIONS --- //

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
}

// --- API HELPERS --- //

async function fetchCastContent(castHash: string, viewerFid?: number): Promise<{ cast: Cast }> {
    const params = new URLSearchParams({
        identifier: castHash,
        type: 'hash',
    });
    if (viewerFid) {
        params.set('viewerFid', viewerFid.toString());
    }
    const response = await fetch(`/api/cast?${params.toString()}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch cast");
    }

    return response.json();
}

// --- CUSTOM HOOKS --- //

function useCast(castHash: string, viewerFid: number) {
    const [cast, setCast] = useState<Cast | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!castHash) {
            setIsLoading(false);
            setError("No cast hash provided.");
            return;
        };

        const loadCast = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetchCastContent(castHash, viewerFid);
                setCast(response.cast);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load cast");
            } finally {
                setIsLoading(false);
            }
        };

        loadCast();
    }, [castHash, viewerFid]);

    return { cast, isLoading, error };
}

function useCoinMint(cast: Cast | null) {
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [formErrors, setFormErrors] = useState({ name: false, symbol: false });
    const [isMinting, setIsMinting] = useState(false);
    const [mintResult, setMintResult] = useState<any | null>(null);

    const validateForm = useCallback(() => {
        const errors = {
            name: name.trim() === "",
            symbol: symbol.trim() === "",
        };
        setFormErrors(errors);
        return !Object.values(errors).some(Boolean);
    }, [name, symbol]);

    const handleCoinIt = useCallback(async () => {
        if (!validateForm() || !cast) return;

        sdk.haptics.impactOccurred('heavy');

        const imageEmbed = cast.embeds.find((embed) =>
            embed.metadata?.content_type?.startsWith("image/")
        );
        if (!imageEmbed?.url) {
            alert("This cast doesn't have an image to mint.");
            return;
        }

        setIsMinting(true);
        setMintResult(null);
        try {
            const metadata = {
                name: cast.hash,
                description: cast.text,
                image: imageEmbed.url,
                properties: { category: "social" },
            };

            const metadataUploadResponse = await fetch("/api/uploadJSON", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jsonData: metadata, filename: cast.hash }),
            });

            if (!metadataUploadResponse.ok) {
                throw new Error("Failed to upload metadata to IPFS.");
            }

            const { cid } = await metadataUploadResponse.json();
            const metadataURI = `ipfs://${cid}`;
            
            const metadataURIContent = await validateMetadataURIContent(metadataURI as ValidMetadataURI);
            if (!metadataURIContent) {
                throw new Error("Metadata is not valid. Please try again.");
            }

            const coinParams = {
                name,
                symbol,
                uri: metadataURI,
                payoutRecipient: "0xc0708E7852C64eE695e94Ad92E2aB7221635944d" as Address,
                platformReferrer: "0xc0708E7852C64eE695e94Ad92E2aB7221635944d" as Address,
                chainId: baseSepolia.id,
                currency: DeployCurrency.ETH,
            };

            const contractCallParams = await createCoinCall(coinParams);
            const { request } = await simulateContract(config, { ...contractCallParams });
            const result = await writeContract(config, request);
            
            setMintResult({ cid, transactionHash: result });
            sdk.haptics.notificationOccurred('success');

        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "An unknown error occurred during minting.");
            sdk.haptics.notificationOccurred('error');
        } finally {
            setIsMinting(false);
        }
    }, [cast, name, symbol, validateForm]);

    return {
        name,
        setName,
        symbol,
        setSymbol,
        formErrors,
        isMinting,
        mintResult,
        handleCoinIt,
    };
}


// --- UI COMPONENTS --- //

const LoadingSkeleton = () => (
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

const ErrorAlert = ({ error }: { error: string }) => (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-lg">
            <AlertTitle>Error Loading Cast</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    </div>
);

const NotFoundAlert = () => (
     <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert className="max-w-lg">
            <AlertTitle>No Cast Found</AlertTitle>
            <AlertDescription>
                The cast you're looking for could not be found.
            </AlertDescription>
        </Alert>
    </div>
)

const CastView = ({ cast }: { cast: Cast }) => (
    <>
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
                            {embed.metadata?.content_type?.startsWith("image/") ? (
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
        </CardContent>
    </>
);

const MintForm = ({ name, setName, symbol, setSymbol, formErrors, isMinting, handleCoinIt }: any) => (
    <div className="space-y-4">
        <div className="grid gap-2">
            <Label htmlFor="name">Coin Name</Label>
            <Input
                id="name"
                placeholder="My Awesome Coin"
                value={name}
                disabled={isMinting}
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
                disabled={isMinting}
                onChange={(e) => setSymbol(e.target.value)}
                className={formErrors.symbol ? "border-destructive" : ""}
            />
        </div>
        <Button
            onClick={handleCoinIt}
            disabled={isMinting}
            className="w-full bg-black text-white py-6 text-lg hover:bg-gray-900 active:scale-95 transition-transform duration-100"
        >
            {isMinting ? (
                "Coining it..."
            ) : (
                <span className="flex items-center justify-center gap-2">
                    <LuSparkle />
                    <span>Coin it</span>
                </span>
            )}
        </Button>
    </div>
);

const MintSuccessAlert = ({ cid }: { cid: string }) => (
    <div className="mt-6">
        <Alert variant="default">
            <AlertTitle>Successfully Coined!</AlertTitle>
            <AlertDescription>
                Your content metadata has been uploaded to IPFS.
                <a
                    href={`https://ipfs.io/ipfs/${cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline mt-2 block"
                >
                    View on IPFS Gateway
                </a>
            </AlertDescription>
        </Alert>
    </div>
);


// --- MAIN COMPONENT --- //

export default function ShareContent() {
    const searchParams = useSearchParams();
    const castHash = searchParams.get("castHash") || "";
    const viewerFid = Number(searchParams.get("viewerFid")) || 0;

    const { isConnected } = useAccount();
    const { cast, isLoading, error } = useCast(castHash, viewerFid);
    const {
        name,
        setName,
        symbol,
        setSymbol,
        formErrors,
        isMinting,
        mintResult,
        handleCoinIt,
    } = useCoinMint(cast);

    if (isLoading) return <LoadingSkeleton />;
    if (error) return <ErrorAlert error={error} />;
    if (!cast) return <NotFoundAlert />;

    return (
        <div className="min-h-screen bg-background font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CastView cast={cast} />
                    <CardContent>
                        <Separator className="my-6" />
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
                                    Please connect your wallet to coin this cast.
                                </AlertDescription>
                            </Alert>
                        )}
                        {mintResult && <MintSuccessAlert cid={mintResult.cid} />}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

