import { Cast } from "@/components/screens/coin/types";
import { config } from "@/components/wallet-provider";
import { PAYOUT_RECIPIENT, PLATFORM_REFERRER } from "@/lib/constants";
import { sdk } from "@farcaster/frame-sdk";
import { createCoinCall, DeployCurrency, getCoinCreateFromLogs, validateMetadataURIContent, ValidMetadataURI } from "@zoralabs/coins-sdk";
import { useState, useCallback, useEffect } from "react";
import { base } from "viem/chains";
import { getTransactionReceipt, simulateContract } from "wagmi/actions";
import { useOnboardingState } from "./useOnboardingState";
import { useFrame } from "@/components/farcaster-provider";
import { storeMintRecord } from "@/lib/database";
import { encodeFunctionData, parseEther } from "viem";
import { useSendTransaction } from "wagmi";

async function heavyHapticImpact() {
    const capabilities = await sdk.getCapabilities();
    if(capabilities.includes("haptics.impactOccurred")) {
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

    console.log("metadataURI", metadataURI);
    const metadataURIContent = await validateMetadataURIContent(
        metadataURI as ValidMetadataURI
    );

    if (!metadataURIContent) {
        throw new Error("Metadata is not valid. Please try again.");
    }

    return metadataURI;
}

async function generateTransactionRequest(name: string, symbol: string, metadataURI: string) {
    const coinParams = {
        name,
        symbol,
        uri: metadataURI,
        payoutRecipient: PAYOUT_RECIPIENT,
        platformReferrer:PLATFORM_REFERRER,
        chainId: base.id,
        currency: DeployCurrency.ETH,
    };
    const contractCallParams = await createCoinCall(coinParams);

    console.log("contractCallParams", contractCallParams);
    
    const { request, result } = await simulateContract(config, {
        ...contractCallParams,
    });

    console.log("simulateContract", request, result);

    return request;
}


export default function useCoinMint(cast: Cast | null, image: string) {
    const { context } = useFrame();
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
    const [isWaitingForUserToConfirm, setIsWaitingForUserToConfirm] = useState(false);
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
        if (!validateForm() || !cast) return;

        await heavyHapticImpact();

        setIsUploadingMetadata(true);
        try {
            console.log("Uploading metadata to IPFS");
            const metadataURI = await uploadMetadataToIPFS(cast, image);
            setIsUploadingMetadata(false);
            console.log("Metadata uploaded to IPFS");

            console.log("Generating transaction request");
            const request = await generateTransactionRequest(name, symbol, metadataURI);
            console.log("Transaction request generated");

            const { abi, functionName, args, address} = request;
            const functionData = encodeFunctionData({ abi, functionName, args });

            setIsWaitingForUserToConfirm(true);
            console.log("Waiting for user to confirm");
            console.log("config for writeContract", config);
            await sendTransaction({
                to: address,
                data: functionData,
                value: parseEther("0"),
            });

            setIsWaitingForUserToConfirm(false);
          
            
           
        } catch (err) {
            console.error(err);
            sdk.haptics.notificationOccurred("error");
        } finally {
            setIsUploadingMetadata(false);
            setIsWaitingForUserToConfirm(false);
            setIsMinting(false);
        }
    }, [cast, name, symbol, validateForm, image]);

    useEffect(() => {
        async function init() {
            if(error) {
                console.error(error);
                sdk.haptics.notificationOccurred("error");
            }

            if(hash) {
                console.log("hash", hash);
                setIsMinting(true);
                
                let receipt = await getTransactionReceipt(config, {
                    hash,
                })
    
                const coinDeployment = await getCoinCreateFromLogs(receipt);
                if(coinDeployment) {
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
    
                            console.log("mintSuccess", mintSuccess);
    
                            if (mintSuccess) {
                                // Mark that the user has completed their first mint
                            } else {
                                console.error('Failed to store mint record in database');
                            }
                        } catch (error) {
                            console.error('Error storing mint record:', error);
                        }
                    } else {
                        
                    }
                }
                sdk.haptics.notificationOccurred("success");
            } else {
                console.log(hash)
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