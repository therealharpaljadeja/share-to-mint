# Supabase Setup for Share to Mint

This guide explains how to set up Supabase database integration for storing user mint records and controlling tutorial visibility.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Database Schema

Run the following SQL in your Supabase SQL editor to create the required table:

```sql
-- Create the user_mints table
CREATE TABLE user_mints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_fid INTEGER NOT NULL,
    cast_hash TEXT NOT NULL,
    coin_address TEXT NOT NULL,
    coin_name TEXT NOT NULL,
    coin_symbol TEXT NOT NULL,
    coin_description TEXT,
    transaction_hash TEXT NOT NULL,
    referrer TEXT,
    zora_link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_user_mints_user_fid ON user_mints(user_fid);
CREATE INDEX idx_user_mints_cast_hash ON user_mints(cast_hash);
CREATE INDEX idx_user_mints_coin_address ON user_mints(coin_address);
CREATE INDEX idx_user_mints_created_at ON user_mints(created_at);

-- Create a unique constraint to prevent duplicate mints of the same cast by the same user
CREATE UNIQUE INDEX idx_user_mints_unique_user_cast ON user_mints(user_fid, cast_hash);
```

## Row Level Security (RLS)

For production use, you should enable Row Level Security (RLS) on the table:

```sql
-- Enable RLS
ALTER TABLE user_mints ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own mints
CREATE POLICY "Users can view own mints" ON user_mints
    FOR SELECT USING (true); -- For now, allow read access to all records

-- Create policy to allow users to insert their own mints
CREATE POLICY "Users can insert own mints" ON user_mints
    FOR INSERT WITH CHECK (true); -- For now, allow all inserts
```

## Features

After setup, the app will:

1. **Store mint records**: When a user successfully mints a coin, the transaction details are stored in the database
2. **Hide tutorial for returning users**: Users who have previously minted will not see the tutorial
3. **Fallback support**: If database operations fail, the app falls back to localStorage
4. **User identification**: Uses Farcaster FID to identify users across sessions

## Database Functions

The following functions are available in `lib/database.ts`:

- `hasUserCompletedMinting(userFid: number)`: Check if user has any mints
- `storeMintRecord(mintData: MintRecord)`: Store a new mint record
- `getUserMints(userFid: number)`: Get all mints for a user (for future features)
- `getUserMintCount(userFid: number)`: Get total mint count for a user

## Migration from localStorage

Existing users who have minted using the localStorage system will see the tutorial until they mint again, at which point their status will be stored in the database and persist across devices. 