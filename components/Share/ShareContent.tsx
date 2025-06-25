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
        console.log("loading");
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
            // 1. Construct the final metadata using the direct image URL
            const metadata = {
                name: cast.hash,
                description: cast.text,
                image: imageEmbed.url,
                properties: {
                    category: "social",
                },
            };

            // 2. Upload the metadata JSON
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

            // Define coin parameters
            const coinParams = {
                name: name,
                symbol: symbol,
                uri: `ipfs://bafkreihng4dfywdws3xp6mp5d25vn5o4txrod7oosh4xefylc262odujyi`,
                payoutRecipient:
                    "0xc0708E7852C64eE695e94Ad92E2aB7221635944d" as Address,
                platformReferrer:
                    "0xc0708E7852C64eE695e94Ad92E2aB7221635944d" as Address,
                chainId: baseSepolia.id, // Optional: defaults to base.id
                currency: DeployCurrency.ETH, // Optional: ZORA or ETH
            };

            const contractCallParams = await createCoinCall(coinParams);

            // Set the arguments in state to trigger the simulation hook
            const { request } = await simulateContract(config, {
                ...contractCallParams,
            });
            console.log(request);

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white shadow sm:rounded-lg p-6 max-w-lg w-full">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-red-600">
                            Error Loading Cast
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!cast) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white shadow sm:rounded-lg p-6 max-w-lg w-full">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            No Cast Found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            The cast you're looking for could not be found.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-card shadow-lg rounded-lg overflow-hidden">
                    {/* Author Section */}
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-10 h-10">
                                <img
                                    src={cast.author.pfp_url}
                                    alt={cast.author.display_name}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground">
                                    {cast.author.display_name}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    @{cast.author.username}
                                </p>
                            </div>
                        </div>

                        {/* Cast Content */}
                        <div className="mt-4">
                            <p className="text-foreground text-base break-words">
                                {cast.text}
                            </p>

                            {/* Embeds */}
                            {cast.embeds && cast.embeds.length > 0 && (
                                <div className="mt-4 space-y-4">
                                    {cast.embeds.map((embed, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border p-4"
                                        >
                                            {embed.metadata?.content_type?.startsWith(
                                                "image/"
                                            ) ? (
                                                <div className="relative w-full">
                                                    <img
                                                        src={embed.url}
                                                        alt="Cast image"
                                                        className="rounded-lg w-full h-auto"
                                                        style={{
                                                            aspectRatio: embed
                                                                .metadata.image
                                                                ? `${embed.metadata.image.width_px} / ${embed.metadata.image.height_px}`
                                                                : "auto",
                                                        }}
                                                    />
                                                </div>
                                            ) : embed.url ? (
                                                <a
                                                    href={embed.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline break-all"
                                                >
                                                    {embed.url}
                                                </a>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {isConnected && (
                                <div className="mt-4">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className={
                                                formErrors.name
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                                        <Label htmlFor="symbol">Symbol</Label>
                                        <Input
                                            id="symbol"
                                            placeholder="Symbol"
                                            value={symbol}
                                            onChange={(e) =>
                                                setSymbol(e.target.value)
                                            }
                                            className={
                                                formErrors.symbol
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                    </div>
                                    {/* Mint Button */}
                                    <div className="mt-6">
                                        <Button
                                            onClick={handleCoinIt}
                                            disabled={isMinting}
                                            className="w-full"
                                        >
                                            {isMinting
                                                ? "Coining it..."
                                                : "Coin it"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Mint Result */}
                            {mintResult && (
                                <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg">
                                    <h3 className="text-lg font-bold text-green-800">
                                        Successfully Coined!
                                    </h3>
                                    <p className="text-sm text-green-700 mt-1">
                                        Your content metadata has been uploaded
                                        to IPFS.
                                    </p>
                                    <div className="mt-4 bg-gray-100 p-3 rounded-md overflow-x-auto">
                                        <pre className="text-xs text-gray-800">
                                            <code>
                                                {JSON.stringify(
                                                    mintResult,
                                                    null,
                                                    2
                                                )}
                                            </code>
                                        </pre>
                                    </div>
                                    <a
                                        href={`https://green-defeated-warbler-251.mypinata.cloud/ipfs/${mintResult.cid}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-block text-sm text-blue-600 hover:underline"
                                    >
                                        View on IPFS Gateway
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
