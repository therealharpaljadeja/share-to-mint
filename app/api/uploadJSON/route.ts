import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

// It's recommended to use a dedicated gateway for production apps.
// Replace 'gateway.pinata.cloud' with your dedicated gateway domain for better performance.
const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT!,
    pinataGateway: "green-defeated-warbler-251.mypinata.cloud", 
});


export async function POST(request: NextRequest) {
  if (!process.env.PINATA_JWT) {
    return NextResponse.json(
      { error: 'Pinata API Key not configured. Please set the PINATA_API_KEY environment variable.' },
      { status: 500 }
    );
  }

  try {
    
    const { jsonData, filename } = await request.json();
    const fileName = `${filename}.json`;
    
    const result = await pinata.upload.public.json(jsonData).name(fileName);

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to upload JSON to Pinata', details: errorMessage },
      { status: 500 }
    );
  }
} 