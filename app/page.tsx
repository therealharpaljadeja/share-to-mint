import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'
import { MainApp } from "@/components/MainApp";

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: 'Share To Mint',
    action: {
      type: 'launch_frame',
      name: 'Share To Mint',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: '#f7f7f7',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Share To Mint',
    openGraph: {
      title: 'Share To Mint',
      description: 'Farcaster Mini App that allows you to mint content on Zora just by sharing it on Farcaster',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}


export default function Home() {
  return <MainApp />;
}
