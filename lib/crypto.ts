import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

// Field-level encryption for data stored in the (necessarily public) Sanity
// "admin" dataset — see the auth plan. AES-256-GCM, key never leaves the server.
const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) throw new Error('ENCRYPTION_KEY is not set')
  const buf = Buffer.from(key, 'hex')
  if (buf.length !== 32) throw new Error('ENCRYPTION_KEY must be a 32-byte hex string')
  return buf
}

export function encryptField(plaintext: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, getKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext.toString('hex')}`
}

export function decryptField(stored: string): string {
  const [ivHex, authTagHex, ciphertextHex] = stored.split(':')
  if (!ivHex || !authTagHex || !ciphertextHex) throw new Error('Malformed encrypted field')
  const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'))
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
  const plaintext = Buffer.concat([decipher.update(Buffer.from(ciphertextHex, 'hex')), decipher.final()])
  return plaintext.toString('utf8')
}
