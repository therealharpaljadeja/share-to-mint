import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import MintForm from "./MintForm";
import MintSuccessAlert from "./MintSuccessAlert";
import farcasterFrame from "@farcaster/frame-wagmi-connector";
import { useAccount, useConnect } from "wagmi";

interface PageContentProps {
    isUploadingMetadata: boolean;
    isWaitingForUserToConfirm: boolean;
    coinAddress: string | null;
    referrer: string | null;
    // Form state
    name: string;
    setName: (v: string) => void;
    symbol: string;
    setSymbol: (v: string) => void;
    formErrors: any;
    isMinting: boolean;
    handleCoinIt: () => void;
}

export default function PageContent({
    isUploadingMetadata,
    isWaitingForUserToConfirm,
    coinAddress,
    referrer,
    name,
    setName,
    symbol,
    setSymbol,
    formErrors,
    isMinting,
    handleCoinIt,
}: PageContentProps) {
    const { isConnected } = useAccount();
    const { connect } = useConnect();
    let content = null;

    if (isUploadingMetadata) {
        content = (
            <Alert>
                <AlertTitle>Uploading Metadata</AlertTitle>
                <AlertDescription>
                    Please wait while we upload the metadata to IPFS.
                </AlertDescription>
            </Alert>
        );
    } else if (isWaitingForUserToConfirm) {
        content = (
            <Alert>
                <AlertTitle>Waiting for user to confirm</AlertTitle>
                <AlertDescription>
                    Please wait while we wait for the user to confirm the transaction.
                </AlertDescription>
            </Alert>
        );
    } else if (coinAddress && referrer) {
        content = <MintSuccessAlert referrer={referrer} coinAddress={coinAddress} />;
    } else if (isConnected) {
        content = (
            <MintForm
                name={name}
                setName={setName}
                symbol={symbol}
                setSymbol={setSymbol}
                formErrors={formErrors}
                isMinting={isMinting || isUploadingMetadata || isWaitingForUserToConfirm}
                handleCoinIt={handleCoinIt}
            />
        );
    } else {
        content = (
            <Alert>
                <AlertTitle>Connect Your Wallet</AlertTitle>
                <AlertDescription>
                    Please connect your wallet to coin this cast.
                </AlertDescription>
                <Button
                    className="bg-black text-white font-sans"
                    onClick={() => connect({ connector: farcasterFrame() })}
                >
                    Connect Wallet
                </Button>
            </Alert>
        );
    }

    return content;
}