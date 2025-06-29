import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MintSuccessAlert({
    referrer,
    coinAddress,
}: {
    referrer: string | null;
    coinAddress: string | null;
}) {
    return (
        <div>
            <Alert variant="default">
                <AlertTitle>Successfully Coined!</AlertTitle>
                <AlertDescription>
                    Your content metadata has been uploaded to IPFS.
                    <a
                        href={`https://testnet.zora.co/coin/bsep:${coinAddress}?referrer=${referrer}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-black font-sans hover:underline mt-2 block"
                    >
                        View on Zora
                    </a>
                </AlertDescription>
            </Alert>
        </div>
    );
}
