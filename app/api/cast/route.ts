import { NextRequest, NextResponse } from 'next/server';
import { fetchCastContent } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const identifier = searchParams.get('identifier');
    const viewerFid = searchParams.get('viewerFid');

    if (!identifier) {
      return NextResponse.json(
        { error: 'Missing required parameter: identifier' },
        { status: 400 }
      );
    }

    const castData = await fetchCastContent(
      identifier,
      viewerFid ? parseInt(viewerFid) : undefined
    );

    return NextResponse.json(castData);
  } catch (error) {
    console.error('Error in /api/cast:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cast data' },
      { status: 500 }
    );
  }
} 