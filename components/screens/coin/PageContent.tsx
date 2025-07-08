import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import MintForm from "./MintForm";
import MintSuccessAlert from "./MintSuccessAlert";
import miniAppConnector from "@farcaster/miniapp-wagmi-connector";
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

function UploadingMetadata() {
    return (
        <Alert>
            <AlertTitle>Uploading Metadata</AlertTitle>
            <AlertDescription>
                Please wait while we upload the metadata.
            </AlertDescription>
        </Alert>
    );
}

function WaitingForUserToConfirm() {
    return (
        <Alert>
            <AlertTitle className="mb-0">
                Waiting for user to confirm
            </AlertTitle>
        </Alert>
    );
}

function ConnectWallet() {
    const { connect } = useConnect();
    return (
        <Alert>
            <AlertTitle>Connect Your Wallet</AlertTitle>
            <AlertDescription>
                Please connect your wallet to coin this cast.
            </AlertDescription>
            <Button
                className="mt-4 bg-black text-white font-sans hover:bg-black hover:text-white"
                onClick={() => connect({ connector: miniAppConnector() })}
            >
                Connect Wallet
            </Button>
        </Alert>
    );
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

    if (isUploadingMetadata) return <UploadingMetadata />;

    if (isWaitingForUserToConfirm) return <WaitingForUserToConfirm />;

    if (coinAddress && referrer)
        return <MintSuccessAlert coinAddress={coinAddress} />;

    if (isConnected)
        return (
            <MintForm
                name={name}
                setName={setName}
                symbol={symbol}
                setSymbol={setSymbol}
                formErrors={formErrors}
                isMinting={
                    isMinting ||
                    isUploadingMetadata ||
                    isWaitingForUserToConfirm
                }
                handleCoinIt={handleCoinIt}
            />
        );

    return <ConnectWallet />;
}
