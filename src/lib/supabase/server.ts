import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type SupabaseClientKeyType = 'publishable' | 'secret'

type CreateSupabaseServerClientOptions = {
  keyType?: SupabaseClientKeyType
}

const getSupabaseUrl = () => {
  const supabaseUrl = process.env.SUPABASE_URL

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL environment variable.')
  }

  return supabaseUrl
}

const getSupabaseKey = (keyType: SupabaseClientKeyType) => {
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY
  const secretKey = process.env.SUPABASE_SECRET_KEY

  if (keyType === 'secret') {
    if (!secretKey) {
      throw new Error('Missing SUPABASE_SECRET_KEY environment variable.')
    }

    return secretKey
  }

  if (!publishableKey) {
    throw new Error('Missing SUPABASE_PUBLISHABLE_KEY environment variable.')
  }

  return publishableKey
}

export const createSupabaseServerClient = (
  options: CreateSupabaseServerClientOptions = {}
): SupabaseClient => {
  const keyType = options.keyType ?? 'publishable'

  return createClient(getSupabaseUrl(), getSupabaseKey(keyType), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}

export const createSupabaseSecretClient = (): SupabaseClient =>
  createSupabaseServerClient({ keyType: 'secret' })

export const createSupabasePublishableClient = (): SupabaseClient =>
  createSupabaseServerClient({ keyType: 'publishable' })
