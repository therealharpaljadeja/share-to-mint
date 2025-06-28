import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
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