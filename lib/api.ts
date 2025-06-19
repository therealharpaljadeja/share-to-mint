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