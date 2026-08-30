import { groq } from 'next-sanity'
import { adminClient } from '@/sanity/lib/admin-client'
import { encryptField, decryptField } from './crypto'
import { hashPassword, verifyPassword } from './password'

export interface AdminUser {
  id: string
  email: string
  name?: string
  status: 'pending' | 'active'
  invitedAt?: string
  invitedBy?: { name?: string; email: string }
  lastLoginAt?: string
}

interface AdminUserDoc {
  _id: string
  email: string // encrypted
  name?: string
  passwordHash?: string // encrypted
  status: 'pending' | 'active'
  invitedAt?: string
  invitedBy?: string // encrypted JSON
  lastLoginAt?: string
  passwordResetExpiresAt?: string
}

const FIELDS = groq`_id, email, name, passwordHash, status, invitedAt, invitedBy, lastLoginAt, passwordResetExpiresAt`

function toPublic(doc: AdminUserDoc): AdminUser {
  return {
    id: doc._id,
    email: decryptField(doc.email),
    name: doc.name,
    status: doc.status,
    invitedAt: doc.invitedAt,
    invitedBy: doc.invitedBy ? JSON.parse(decryptField(doc.invitedBy)) : undefined,
    lastLoginAt: doc.lastLoginAt,
  }
}

async function listDocs(): Promise<AdminUserDoc[]> {
  return adminClient.fetch<AdminUserDoc[]>(groq`*[_type == "adminUser"] | order(invitedAt desc) { ${FIELDS} }`)
}

// Fetches every account and decrypts in memory to find a match — see the auth
// plan for why this is fine at this app's scale (a handful of admins).
async function getDocByEmail(email: string): Promise<AdminUserDoc | null> {
  const normalized = email.trim().toLowerCase()
  const docs = await listDocs()
  return docs.find((d) => decryptField(d.email).toLowerCase() === normalized) ?? null
}

export async function list(): Promise<AdminUser[]> {
  return (await listDocs()).map(toPublic)
}

export async function getById(id: string): Promise<AdminUser | null> {
  const doc = await adminClient.fetch<AdminUserDoc | null>(
    groq`*[_type == "adminUser" && _id == $id][0] { ${FIELDS} }`,
    { id }
  )
  return doc ? toPublic(doc) : null
}

export async function getByEmail(email: string): Promise<AdminUser | null> {
  const doc = await getDocByEmail(email)
  return doc ? toPublic(doc) : null
}

export async function verifyCredentials(email: string, password: string): Promise<AdminUser | null> {
  const doc = await getDocByEmail(email)
  if (!doc || doc.status !== 'active' || !doc.passwordHash) return null
  const ok = await verifyPassword(password, decryptField(doc.passwordHash))
  return ok ? toPublic(doc) : null
}

export async function create(email: string, invitedBy?: { name?: string; email: string }): Promise<AdminUser> {
  const doc = await adminClient.create({
    _type: 'adminUser',
    email: encryptField(email.trim().toLowerCase()),
    status: 'pending',
    invitedAt: new Date().toISOString(),
    ...(invitedBy ? { invitedBy: encryptField(JSON.stringify(invitedBy)) } : {}),
  })
  return toPublic(doc as unknown as AdminUserDoc)
}

export async function activate(id: string, password: string, name?: string): Promise<void> {
  const passwordHash = await hashPassword(password)
  await adminClient
    .patch(id)
    .set({
      passwordHash: encryptField(passwordHash),
      status: 'active',
      ...(name ? { name } : {}),
    })
    .commit()
}

export async function setPassword(id: string, password: string): Promise<void> {
  const passwordHash = await hashPassword(password)
  await adminClient.patch(id).set({ passwordHash: encryptField(passwordHash) }).commit()
}

export async function setName(id: string, name: string): Promise<void> {
  await adminClient.patch(id).set({ name }).commit()
}

export async function recordLogin(id: string): Promise<void> {
  await adminClient.patch(id).set({ lastLoginAt: new Date().toISOString() }).commit()
}

export async function setPasswordResetToken(id: string, expiresAt: number): Promise<void> {
  await adminClient.patch(id).set({ passwordResetExpiresAt: String(expiresAt) }).commit()
}

export async function clearPasswordResetToken(id: string): Promise<void> {
  await adminClient.patch(id).unset(['passwordResetExpiresAt']).commit()
}

export async function isPasswordResetTokenValid(id: string, expiresAt: number): Promise<boolean> {
  const doc = await adminClient.fetch<{ passwordResetExpiresAt?: string } | null>(
    groq`*[_type == "adminUser" && _id == $id][0]{ passwordResetExpiresAt }`,
    { id }
  )
  return doc?.passwordResetExpiresAt === String(expiresAt)
}

export async function remove(id: string): Promise<void> {
  await adminClient.delete(id)
}
