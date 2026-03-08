// Set test encryption secret (32 chars) BEFORE importing the module
process.env.GROQ_ENCRYPTION_SECRET = 'ed7f2a9b4c1e8d3f6a0b5c2e9d4f7a1b'

import { encryptKey, decryptKey } from '@/lib/crypto/encryptKey'

describe('encryptKey / decryptKey', () => {
  it('round-trips a plaintext key', () => {
    const original = 'gsk_test_key_abc123'
    const encrypted = encryptKey(original)
    const decrypted = decryptKey(encrypted)
    expect(decrypted).toBe(original)
  })

  it('produces different ciphertext each time (IV randomness)', () => {
    const key = 'gsk_test_key'
    const enc1 = encryptKey(key)
    const enc2 = encryptKey(key)
    expect(enc1).not.toBe(enc2)
  })

  it('encrypted format contains IV and ciphertext separated by colon', () => {
    const encrypted = encryptKey('test')
    expect(encrypted).toContain(':')
    const parts = encrypted.split(':')
    expect(parts).toHaveLength(2)
    expect(parts[0]).toHaveLength(32) // 16 bytes as hex
  })
})
