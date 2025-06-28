import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ErrorAlert({ error }: { error: string }) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-lg">
                <AlertTitle>Error Loading Cast</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
}
