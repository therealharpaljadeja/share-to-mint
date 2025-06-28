import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useCast from "@/hooks/useCast";
import { Cast } from "./types";

export default function CastView ({ cast }: { cast: Cast })  {
    const { imageEmbedURL } = useCast(cast.hash, cast.author.fid);

    return (
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
            <CardContent className="pb-0">
                <p className="text-foreground text-base break-words">
                    {cast.text}
                </p>

                <div className="mt-4 space-y-4">
                    {imageEmbedURL && (
                        <div className="rounded-lg border overflow-hidden">
                            <img
                                src={imageEmbedURL}
                                alt="Cast image"
                                className="w-full h-auto"
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </>
    );
};