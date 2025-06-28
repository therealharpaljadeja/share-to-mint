import { Cast } from "@/components/screens/coin/types";

export const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';

if (!NEYNAR_API_KEY) {
  console.warn('NEYNAR_API_KEY is not set');
}

export const NEYNAR_API_BASE = 'https://api.neynar.com/v2/farcaster';

export async function fetchCastContent(castHash: string, viewerFid?: number) {
  try {
    const response = await fetch(
      `${NEYNAR_API_BASE}/cast?identifier=${castHash}&type=hash${viewerFid ? `&viewer_fid=${viewerFid}` : ''}`,
      {
        headers: {
          'accept': 'application/json',
          'api_key': NEYNAR_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch cast');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cast:', error);
    throw error;
  }
} 


export async function fetchCastContentFromFrontend(
  castHash: string,
  viewerFid?: number
): Promise<{ cast: Cast }> {
  const params = new URLSearchParams({
      identifier: castHash,
      type: "hash",
  });
  if (viewerFid) {
      params.set("viewerFid", viewerFid.toString());
  }
  const response = await fetch(`/api/cast?${params.toString()}`);

  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch cast");
  }

  return response.json();
}