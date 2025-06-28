import { Cast } from "@/components/screens/coin/types";
import { fetchCastContentFromFrontend } from "@/lib/api";
import { useEffect, useState } from "react";

function getImageToEmbed(cast: Cast) {
    const imageEmbed = cast.embeds.find((embed) =>
        embed.metadata?.content_type?.startsWith("image/")
    );

    if (imageEmbed) {
        if (imageEmbed.url) {
            return imageEmbed.url;
        }
    }
    return `https://client.farcaster.xyz/v2/og-image?castHash=${cast.hash}`;
}

export default function useCast(castHash: string, viewerFid: number) {
    const [cast, setCast] = useState<Cast | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageEmbedURL, setImageEmbedURL] = useState<string | null>(null);

    useEffect(() => {
        const loadCast = async () => {
            if (!castHash) {
                setError("No cast hash provided.");
                return;
            }
            try {
                setIsLoading(true);
                const response = await fetchCastContentFromFrontend(
                    castHash,
                    viewerFid
                );
                if (response.cast) {
                    const cast = response.cast as Cast;
                    const imageEmbedURL = getImageToEmbed(cast);
                    if (imageEmbedURL) {
                        setImageEmbedURL(imageEmbedURL);
                    }
                    setCast(response.cast as Cast);
                } else {
                    setError("No cast found.");
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to load cast"
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadCast();
    }, [castHash, viewerFid]);

    return { cast, isLoading, error, imageEmbedURL };
}
