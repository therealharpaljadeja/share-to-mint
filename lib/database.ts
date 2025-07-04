import { supabase } from './supabase'

export interface MintRecord {
  coinDescription: string | null
  coinImage: string
  userFid: number
  castHash: string
  coinAddress: string
  coinName: string
  coinSymbol: string
  transactionHash: string
  referrer?: string | null
  zoraLink: string
}

// Check if user has completed any mints
export async function hasUserCompletedMinting(userFid: number): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_mints')
      .select('id')
      .eq('user_fid', userFid)
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking user minting status:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error in hasUserCompletedMinting:', error)
    return false
  }
}

// Store a new mint record
export async function storeMintRecord(mintData: MintRecord): Promise<boolean> {
  try {
    console.log("Storing mint record in database", mintData);
    const { error } = await supabase
      .from('user_mints')
      .insert({
        user_fid: mintData.userFid,
        cast_hash: mintData.castHash,
        coin_address: mintData.coinAddress,
        coin_name: mintData.coinName,
        coin_symbol: mintData.coinSymbol,
        coin_description: mintData.coinDescription,
        coin_image: mintData.coinImage,
        zora_link: mintData.zoraLink,
        transaction_hash: mintData.transactionHash,
        referrer: mintData.referrer,
      })

    if (error) {
      console.error('Error storing mint record:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in storeMintRecord:', error)
    return false
  }
}

// Get all mints for a user (optional - for future features)
export async function getUserMints(userFid: number) {
  try {
    const { data, error } = await supabase
      .from('user_mints')
      .select('*')
      .eq('user_fid', userFid)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user mints:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserMints:', error)
    return []
  }
}

// Get mint count for a user (optional - for analytics)
export async function getUserMintCount(userFid: number): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('user_mints')
      .select('*', { count: 'exact', head: true })
      .eq('user_fid', userFid)

    if (error) {
      console.error('Error getting user mint count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error in getUserMintCount:', error)
    return 0
  }
}

// Get all mints (for admin or analytics)
export async function getAllMints() {
  try {
    const { data, error } = await supabase
      .from('user_mints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all mints:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllMints:', error);
    return [];
  }
} 