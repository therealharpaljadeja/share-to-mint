import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NotFoundAlert() {
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
