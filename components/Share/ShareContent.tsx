"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CastAuthor {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
}

interface CastEmbed {
    url?: string;
    metadata?: {
        content_type?: string;
        image?: {
            width_px: number;
            height_px: number;
        };
    };
}

interface Cast {
    hash: string;
    text: string;
    author: CastAuthor;
    embeds: CastEmbed[];
    timestamp: string;
    reactions: {
        likes: number;
        recasts: number;
    };
}

async function fetchCastContent(castHash: string, viewerFid?: number) {
    const response = await fetch(
        `/api/cast?identifier=${castHash}&type=hash${viewerFid ? `&viewerFid=${viewerFid}` : ''}`
    );
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch cast');
    }
    
    return response.json();
}

const testResponse = {
    cast: {
        object: "cast",
        hash: "0x4781e22f24da53666be998ada44f32d88f035902",
        author: {
            object: "user",
            fid: 499783,
            username: "tako-unik",
            display_name: "Tako is based in Los Fomos",
            pfp_url:
                "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/c23806fc-7b65-466e-75ad-d5b1642f3500/rectcrop3",
            custody_address: "0xb3195fd127dc66493934357e0a270243e0cd2155",
            profile: {
                bio: {
                    text: "LFer. Based in /los-fomos • Making onchain spicy | Building /uniklabs - a portable community graph. /cinema-mon-amour simp",
                    mentioned_channels: [
                        {
                            object: "channel_dehydrated",
                            id: "los-fomos",
                            name: "Los Fomos",
                            image_url:
                                "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/15709126-e03b-4e36-3d57-55c54511de00/original",
                        },
                        {
                            object: "channel_dehydrated",
                            id: "uniklabs",
                            name: "Future of fandom",
                            image_url:
                                "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/df4fda88-1901-485a-4f66-8b558f65ab00/original",
                        },
                        {
                            object: "channel_dehydrated",
                            id: "cinema-mon-amour",
                            name: "Cinéma, Mon Amour",
                            image_url:
                                "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/59e9ec9c-167f-4638-7910-546277f23800/original",
                        },
                    ],
                    mentioned_channels_ranges: [
                        {
                            start: 15,
                            end: 25,
                        },
                        {
                            start: 62,
                            end: 71,
                        },
                        {
                            start: 102,
                            end: 119,
                        },
                    ],
                },
            },
            follower_count: 6698,
            following_count: 227,
            verifications: [
                "0x0de1bf69e2c04e6cb948cb51bc70e13d159a0917",
                "0x545275e6098eb53b964a4787f14e49446568ad0b",
            ],
            verified_addresses: {
                eth_addresses: [
                    "0x0de1bf69e2c04e6cb948cb51bc70e13d159a0917",
                    "0x545275e6098eb53b964a4787f14e49446568ad0b",
                ],
                sol_addresses: [
                    "8v4sa5XCqV534dkoG57CJML871c3MnLu1dDVsoAbTbMe",
                    "7MA2yqMEMPNVKRDzDd4EaFsw3bvS5jmnEtScvK14Z58",
                ],
                primary: {
                    eth_address: "0x545275e6098eb53b964a4787f14e49446568ad0b",
                    sol_address: "7MA2yqMEMPNVKRDzDd4EaFsw3bvS5jmnEtScvK14Z58",
                },
            },
            verified_accounts: [
                {
                    platform: "x",
                    username: "tako_unik",
                },
            ],
            power_badge: true,
            experimental: {
                neynar_user_score: 0.98,
                deprecation_notice:
                    "The `neynar_user_score` field under `experimental` will be deprecated after June 1, 2025, as it will be formally promoted to a stable field named `score` within the user object.",
            },
            score: 0.98,
        },
        app: {
            object: "user_dehydrated",
            fid: 9152,
            username: "warpcast",
            display_name: "Warpcast",
            pfp_url: "https://i.imgur.com/3d6fFAI.png",
            custody_address: "0x02ef790dd7993a35fd847c053eddae940d055596",
        },
        thread_hash: "0x4781e22f24da53666be998ada44f32d88f035902",
        parent_hash: null,
        parent_url: "https://warpcast.com/~/channel/los-fomos",
        root_parent_url: "https://warpcast.com/~/channel/los-fomos",
        parent_author: {
            fid: null,
        },
        text: "Pau and I drafting something exciting",
        timestamp: "2025-06-19T13:21:47.000Z",
        embeds: [
            {
                url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/99730f4d-a329-4487-dbe4-17fd1fab7100/original",
                metadata: {
                    content_type: "image/jpeg",
                    content_length: 132608,
                    _status: "RESOLVED",
                    image: {
                        width_px: 1320,
                        height_px: 1229,
                    },
                },
            },
        ],
        channel: {
            object: "channel_dehydrated",
            id: "los-fomos",
            name: "Los Fomos",
            image_url:
                "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/15709126-e03b-4e36-3d57-55c54511de00/original",
        },
        reactions: {
            likes_count: 9,
            recasts_count: 0,
            likes: [],
            recasts: [],
        },
        replies: {
            count: 4,
        },
        mentioned_profiles: [],
        mentioned_profiles_ranges: [],
        mentioned_channels: [],
        mentioned_channels_ranges: [],
        author_channel_context: {
            role: "moderator",
            following: true,
        },
    },
};

export default function ShareContent() {
    const searchParams = useSearchParams();
    const [cast, setCast] = useState<Cast | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const castHash = searchParams.get("castHash") || "";
    const viewerFid = Number(searchParams.get("viewerFid")) || 0;

    useEffect(() => {
        async function loadCast() {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetchCastContent(castHash, viewerFid);
                setCast(response.cast);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to load cast"
                );
            } finally {
                setIsLoading(false);
            }
        }

        if (castHash) {
            loadCast();
        }
    }, [castHash, viewerFid]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white shadow sm:rounded-lg p-6 max-w-lg w-full">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-red-600">
                            Error Loading Cast
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!cast) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white shadow sm:rounded-lg p-6 max-w-lg w-full">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            No Cast Found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            The cast you're looking for could not be found.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                    {/* Author Section */}
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-12 h-12">
                                <img
                                    src={cast.author.pfp_url}
                                    alt={cast.author.display_name}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {cast.author.display_name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    @{cast.author.username}
                                </p>
                            </div>
                        </div>

                        {/* Cast Content */}
                        <div className="mt-4">
                            <p className="text-gray-900 text-lg">{cast.text}</p>

                            {/* Embeds */}
                            {cast.embeds && cast.embeds.length > 0 && (
                                <div className="mt-4 space-y-4">
                                    {cast.embeds.map((embed, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border border-gray-200 p-4"
                                        >
                                            {embed.metadata?.content_type?.startsWith('image/') ? (
                                                <div className="relative w-full">
                                                    <img
                                                        src={embed.url}
                                                        alt="Cast image"
                                                        className="rounded-lg w-full h-auto"
                                                        style={{
                                                            aspectRatio: embed.metadata.image ? 
                                                                `${embed.metadata.image.width_px} / ${embed.metadata.image.height_px}` : 
                                                                'auto'
                                                        }}
                                                    />
                                                </div>
                                            ) : embed.url ? (
                                                <a
                                                    href={embed.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline break-all"
                                                >
                                                    {embed.url}
                                                </a>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reactions */}
                            <div className="mt-6 flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <svg
                                        className="h-5 w-5 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    {cast.reactions.likes} likes
                                </div>
                                <div className="flex items-center">
                                    <svg
                                        className="h-5 w-5 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                        />
                                    </svg>
                                    {cast.reactions.recasts} recasts
                                </div>
                                <div>
                                    {new Date(
                                        cast.timestamp
                                    ).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
