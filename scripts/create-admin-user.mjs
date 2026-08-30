#!/usr/bin/env node
// One-time bootstrap for the very first admin account. Run manually:
//   node --env-file=.env.local scripts/create-admin-user.mjs
// Deliberately not a web-accessible flow — there should never be a public
// account-creation surface. Every account after this one goes through the
// in-app invite flow (Team tab under /admin/settings) instead.
//
// This intentionally duplicates the hashing/encryption logic from
// lib/password.ts and lib/crypto.ts rather than importing them, so the
// script stays a plain, dependency-free Node file with no build step.

import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { randomBytes, scrypt, createCipheriv } from 'node:crypto'
import { promisify } from 'node:util'
import { createClient } from '@sanity/client'

const scryptAsync = promisify(scrypt)

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const key = await scryptAsync(password, salt, 64, { N: 16384, r: 8, p: 1 })
  return `scrypt:16384:8:1:${salt}:${key.toString('hex')}`
}

function encryptField(plaintext) {
  const key = Buffer.from(process.env.ENCRYPTION_KEY ?? '', 'hex')
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be a 32-byte hex string — set it in .env.local first.')
  }
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext.toString('hex')}`
}

async function main() {
  if (!process.env.SANITY_ADMIN_DATASET || !process.env.SANITY_ADMIN_TOKEN || !process.env.ENCRYPTION_KEY) {
    console.error(
      'Missing env vars. Make sure SANITY_ADMIN_DATASET, SANITY_ADMIN_TOKEN, and ENCRYPTION_KEY are set in .env.local, ' +
        'and run this with: node --env-file=.env.local scripts/create-admin-user.mjs'
    )
    process.exit(1)
  }

  const rl = createInterface({ input: stdin, output: stdout })
  console.log("Note: the password you type here will be visible in your terminal — it's a one-time local setup step.")
  const name = (await rl.question('Name: ')).trim()
  const email = (await rl.question('Email: ')).trim()
  const password = await rl.question('Password: ')
  rl.close()

  if (!name || !email || !password) {
    console.error('Name, email, and password are all required.')
    process.exit(1)
  }

  const client = createClient({
    projectId: 'mx9td2to',
    dataset: process.env.SANITY_ADMIN_DATASET,
    apiVersion: '2025-01-01',
    token: process.env.SANITY_ADMIN_TOKEN,
    useCdn: false,
  })

  const passwordHash = await hashPassword(password)

  const doc = await client.create({
    _type: 'adminUser',
    email: encryptField(email.toLowerCase()),
    name,
    passwordHash: encryptField(passwordHash),
    status: 'active',
    invitedAt: new Date().toISOString(),
  })

  console.log(`\nCreated admin account for ${email} (${doc._id}). You can log in at /admin/login now.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
