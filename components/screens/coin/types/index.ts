export interface CastAuthor {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
}

export interface CastEmbed {
    url?: string;
    metadata?: {
        content_type?: string;
        image?: {
            width_px: number;
            height_px: number;
        };
    };
}

export interface Cast {
    hash: string;
    text: string;
    author: CastAuthor;
    embeds: CastEmbed[];
    timestamp: string;
}