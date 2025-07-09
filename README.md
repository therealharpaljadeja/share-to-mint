# 🚀 Share To Mint

**A Farcaster Mini App that allow coining Farcaster cast content into tradeable coins on Zora**

### Try the Mini App [here](https://farcaster.xyz/miniapps/2rzmuYxkv2ZP/share-to-mint)

## 🎥 Demo Video

[![Share to Mint Demo](https://img.youtube.com/vi/_wyEmsB5Lo0/0.jpg)](https://youtu.be/_wyEmsB5Lo0?si=nxIiBqyRnWoQ89Da)


## 🎯 Project Overview

Share To Mint is a Farcaster Mini App that allows users to mint any Farcaster cast as a tradeable coin on Zora's protocol. By simply sharing content on Farcaster, users can create economic value and participate in the creator economy.

**Share to Mint leverages Farcaster's newest Share Extension feature**

### 🏆 What it does:
- **Coin**: Transform any cast into a tradeable coin on Zora
- **Trade**: Buy content coins with ETH
- **Share**: Spread awareness and drive engagement through social sharing

## 🛠️ Sponsor Technologies Used

### 🎨 **Zora** - NFT & Coin Infrastructure
**Location**: Core minting and trading functionality

**Key implementations**:
- [`hooks/useCoinMint.tsx`](./hooks/useCoinMint.tsx) - Coin minting logic using Zora's SDK
- [`hooks/useCoinTrade.tsx`](./hooks/useCoinTrade.tsx) - Trading functionality
- [`components/screens/coin/MintForm.tsx`](./components/screens/coin/MintForm.tsx) - Minting interface
- [`components/screens/coin/BuyCoinForm.tsx`](./components/screens/coin/BuyCoinForm.tsx) - Buying interface


### 🟣 **Farcaster**

Throughout the entire application, Share extensions, swapToken, viewToken, composeCast, etc...

  
**Key implementations**:
- [`components/farcaster-provider.tsx`](./components/farcaster-provider.tsx) - Farcaster context and frame management
- [`app/.well-known/farcaster.json/route.ts`](./app/.well-known/farcaster.json/route.ts) - Farcaster app configuration
- [`hooks/useCoinTrade.tsx`](./hooks/useCoinTrade.tsx) - Buying Coin

### 📦 **Pinata** - IPFS Storage

Metadata storage for minted coins


**Key implementations**:
- [`app/api/uploadJSON/route.ts`](./app/api/uploadJSON/route.ts) - Metadata upload to IPFS
- [`hooks/useCoinMint.tsx`](./hooks/useCoinMint.tsx#L30-50) - Metadata preparation and upload

### 🗄️ **Supabase** - Database & Backend
**Location**: User data and mint tracking

**Key implementations**:
- [`lib/supabase.ts`](./lib/supabase.ts) - Supabase client configuration
- [`lib/database.ts`](./lib/database.ts) - Database operations for mint records
- [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) - Complete database setup guide

## ✨ Key Features

### 🎯 User Experience
- **Extremely convenient coining experience**
- **Real-time haptic feedback** - Enhanced mobile experience
- **Easy to share content coins** 
- **Easy to buy content coins**

## 🏗️ Technical Architecture

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Wagmi** - Ethereum wallet integration
- **React Query** - Data fetching and caching
- **Neynar** - Cast data
- **Supabase** - Database
- **Zora SDK**

## 🎯 Future Roadmap

- [ ] **Creator Notifications** - Send notifications when someone buy the content coin
- [ ] **Creator Analytics** - Detailed mint and trading metrics

and many more features...

## 🔗 Links

- **Live Demo**: [Farcaster Mini App](https://farcaster.xyz/miniapps/2rzmuYxkv2ZP/share-to-mint)
- **Source Code**: This repository

## 🏆 Hackathon Submission

This project demonstrates innovative use of:
- **Farcaster's Mini App** for seamless social integration with Farcaster
- **Zora's coin protocol** for content monetization

Built with ❤️ for the creator economy and decentralized social media.
