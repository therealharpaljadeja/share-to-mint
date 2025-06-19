import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
    const farcasterConfig = {
        accountAssociation: {
            header: "eyJmaWQiOjUxMDcwMSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEMwNDUxQTNENjMyYmMzQzJlYmQ1OTZGOEU5NTM3YUM4Njc2ZEIwRjgifQ",
            payload: "eyJkb21haW4iOiJzaGFyZS10by1taW50LnZlcmNlbC5hcHAifQ",
            signature:
                "MHhlZTk4Zjc4OWI1ZTBlYzRkYjg1ZTVlZjY3ZWExYTA4M2VkYTc5YTJhNTZhOTI5MmY2ZDQwYWVhYTg0NDUxNDkwNzg3YTA3NTZkY2MwNGRhODljNDMyYzUyNTVhYjVkMDRmODRlOThhNjlhYmYxOGEyOGUxMGIwNjI4NTVkMjU0YjFi",
        },
        frame: {
            version: "1",
            name: "Share to Mint",
            iconUrl: `${APP_URL}/images/icon.png`,
            homeUrl: `${APP_URL}`,
            imageUrl: `${APP_URL}/images/feed.png`,
            screenshotUrls: [],
            tags: ["zora", "farcaster", "miniapp", "share-to-mint"],
            primaryCategory: "developer-tools",
            buttonTitle: "Share to Mint",
            splashImageUrl: `${APP_URL}/images/splash.png`,
            splashBackgroundColor: "#ffffff",
            webhookUrl: `${APP_URL}/api/webhook`,
        },
    };

    return NextResponse.json(farcasterConfig);
}
