import { scrypt, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

// `util.promisify` doesn't reliably pick up crypto.scrypt's options-object
// overload, so the signature needs to be asserted explicitly.
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
  options: { N: number; r: number; p: number }
) => Promise<Buffer>

const N = 16384
const r = 8
const p = 1
const KEY_LENGTH = 64

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH, { N, r, p })
  return `scrypt:${N}:${r}:${p}:${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, nStr, rStr, pStr, salt, hashHex] = stored.split(':')
  if (algo !== 'scrypt' || !salt || !hashHex) return false

  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH, {
    N: Number(nStr),
    r: Number(rStr),
    p: Number(pStr),
  })
  const expected = Buffer.from(hashHex, 'hex')
  return expected.length === derivedKey.length && timingSafeEqual(expected, derivedKey)
}
