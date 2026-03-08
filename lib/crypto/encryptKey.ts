import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const SECRET = process.env.GROQ_ENCRYPTION_SECRET!

if (SECRET && Buffer.byteLength(SECRET, 'utf8') !== 32) {
  throw new Error('GROQ_ENCRYPTION_SECRET must be exactly 32 bytes for AES-256-CBC')
}

/**
 * Encrypts a plaintext Groq API key using AES-256-CBC.
 * @param plaintext - The plaintext API key to encrypt
 * @returns Hex-encoded IV and encrypted text separated by ':'
 */
export function encryptKey(plaintext: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET), iv)
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

/**
 * Decrypts an encrypted Groq API key — only call server-side.
 * @param encrypted - The encrypted key in IV:ciphertext hex format
 * @returns The plaintext API key
 */
export function decryptKey(encrypted: string): string {
  const [ivHex, encryptedHex] = encrypted.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encryptedText = Buffer.from(encryptedHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET), iv)
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()])
  return decrypted.toString()
}
