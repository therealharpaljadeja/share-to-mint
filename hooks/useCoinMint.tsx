import { Cast } from "@/components/screens/coin/types";
import { config } from "@/components/wallet-provider";
import { PLATFORM_REFERRER } from "@/lib/constants";
import { sdk } from "@farcaster/miniapp-sdk";
import {
    createCoinCall,
    DeployCurrency,
    getCoinCreateFromLogs,
    validateMetadataURIContent,
    ValidMetadataURI,
} from "@zoralabs/coins-sdk";
import { useState, useCallback, useEffect } from "react";
import { base } from "viem/chains";
import { getTransactionReceipt, simulateContract } from "wagmi/actions";
import { useFrame } from "@/components/farcaster-provider";
import { storeMintRecord } from "@/lib/database";
import { Address, encodeFunctionData, Hash, parseEther } from "viem";
import { useAccount, useSendTransaction } from "wagmi";

async function heavyHapticImpact() {
    const capabilities = await sdk.getCapabilities();
    if (capabilities.includes("haptics.impactOccurred")) {
        await sdk.haptics.impactOccurred("heavy");
    }
}

async function uploadMetadataToIPFS(cast: Cast, image: string) {
    const metadata = {
        name: cast.hash,
        description: cast.text,
        image,
        properties: { category: "social" },
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

    const { cid } = await metadataUploadResponse.json();
    const metadataURI = `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${cid}`;

    const metadataURIContent = await validateMetadataURIContent(
        metadataURI as ValidMetadataURI
    );

    if (!metadataURIContent) {
        throw new Error("Metadata is not valid. Please try again.");
    }

    return metadataURI;
}

async function generateTransactionRequest(
    name: string,
    symbol: string,
    metadataURI: string,
    recipient: Address
) {
    const coinParams = {
        name,
        symbol,
        uri: metadataURI as ValidMetadataURI,
        payoutRecipient: recipient,
        platformReferrer: PLATFORM_REFERRER,
        chainId: base.id,
        // currency: DeployCurrency.ZORA,
    };
    const contractCallParams = await createCoinCall(coinParams);


    const { request, result } = await simulateContract(config, {
        ...contractCallParams,
    });


    return request;
}

// Helper to poll for transaction receipt
async function waitForTransactionReceipt(
    config: any,
    { hash }: { hash: Hash },
    interval = 1000,
    timeout = 3000
) {
    const start = Date.now();
    while (true) {
        try {
            const receipt = await getTransactionReceipt(config, { hash });
            if (receipt) return receipt;
        } catch (error) {
            if (error instanceof Error && error.message.includes("TransactionReceiptNotFoundError")) {
                // Try again on next iteration
                if (Date.now() - start > timeout)
                    throw new Error(
                        "Timed out waiting for transaction receipt"
                    );
                await new Promise((res) => setTimeout(res, interval));
                continue;
            }
        }
    }
}

export default function useCoinMint(cast: Cast | null, image: string) {
    const { context } = useFrame();
    const { address: recipient } = useAccount();
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [formErrors, setFormErrors] = useState({
        name: false,
        symbol: false,
    });
    const [isMinting, setIsMinting] = useState(false);
    const [coinAddress, setCoinAddress] = useState<string | null>(null);
    const [referrer, setReferrer] = useState<string | null>(null);
    const [isUploadingMetadata, setIsUploadingMetadata] = useState(false);
    const [isWaitingForUserToConfirm, setIsWaitingForUserToConfirm] =
        useState(false);
    const { sendTransaction, data: hash, error } = useSendTransaction();

    const validateForm = useCallback(() => {
        const errors = {
            name: name.trim() === "",
            symbol: symbol.trim() === "",
        };
        setFormErrors(errors);
        return !Object.values(errors).some(Boolean);
    }, [name, symbol]);

    const handleCoinIt = useCallback(async () => {
        if (!validateForm() || !cast || !recipient) return;

        await heavyHapticImpact();

        setIsUploadingMetadata(true);
        try {
            const metadataURI = await uploadMetadataToIPFS(cast, image);
            setIsWaitingForUserToConfirm(true);
            setIsUploadingMetadata(false);

            const request = await generateTransactionRequest(
                name,
                symbol,
                metadataURI,
                recipient
            );

            const { abi, functionName, args, address } = request;
            const functionData = encodeFunctionData({
                abi,
                functionName,
                args,
            });

           
            await sendTransaction({
                to: address,
                data: functionData,
                value: parseEther("0"),
            });
        } catch (err) {
            console.error(err);
            sdk.haptics.notificationOccurred("error");
        } finally {
            setIsUploadingMetadata(false);

            setIsMinting(false);
        }
    }, [cast, name, symbol, validateForm, image]);

    useEffect(() => {
        async function init() {
            if (error) {
                setIsWaitingForUserToConfirm(false);
                console.error(error);
                sdk.haptics.notificationOccurred("error");
            }

            if (hash) {
                setIsMinting(true);
                setIsWaitingForUserToConfirm(false);

                // Wait for transaction receipt to be available
                let receipt = await waitForTransactionReceipt(config, {
                    hash,
                });

                if (!receipt) {
                    sdk.haptics.notificationOccurred("error");
                    setIsMinting(false);
                    setIsWaitingForUserToConfirm(false);
                    return;
                }

                const coinDeployment = await getCoinCreateFromLogs(receipt);
                if (coinDeployment) {
                    setCoinAddress(coinDeployment.coin);
                    setReferrer(coinDeployment.platformReferrer);
                    setIsMinting(false);

                    // Store mint record in database
                    if (context?.user?.fid && cast) {
                        try {
                            const mintSuccess = await storeMintRecord({
                                coinDescription: cast.text,
                                coinImage: image,
                                userFid: context.user.fid,
                                castHash: cast.hash,
                                coinAddress: coinDeployment.coin,
                                coinName: name,
                                coinSymbol: symbol,
                                transactionHash: hash,
                                referrer: coinDeployment.platformReferrer,
                                zoraLink: `${process.env.NEXT_PUBLIC_ZORA_URL}/coin/base:${coinDeployment.coin}?referrer=${PLATFORM_REFERRER}`,
                            });


                            if (mintSuccess) {
                                // Mark that the user has completed their first mint
                            } else {
                                console.error(
                                    "Failed to store mint record in database"
                                );
                            }
                        } catch (error) {
                            console.error("Error storing mint record:", error);
                        }
                    } else {
                    }
                }
                sdk.haptics.notificationOccurred("success");
            } else {
                sdk.haptics.notificationOccurred("error");
            }
        }
        init();
    }, [hash, error]);

    return {
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
    };
}
