import Groq from 'groq-sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { decryptKey } from '@/lib/crypto/encryptKey'

/**
 * Fetches and decrypts the user's Groq key from the database, returning a configured Groq client.
 * Returns null if no key exists for the user.
 * Call this in every API route that needs Groq.
 * If null: return 403 { error: 'no_api_key', redirect: '/onboarding/api-key' }
 * If Groq call returns 401: return { error: 'invalid_api_key', redirect: '/settings' }
 */
export async function getGroqClient(userId: string): Promise<Groq | null> {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('users')
    .select('groq_api_key')
    .eq('id', userId)
    .single()

  if (error || !data || !data.groq_api_key) {
    return null
  }

  const plainKey = decryptKey(data.groq_api_key)
  return new Groq({ apiKey: plainKey })
}
