import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

export function daysSince(dateString: string | null | undefined): number | null {
  if (!dateString) return null
  const ms = Date.now() - new Date(dateString).getTime()
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
}

export function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function initials(name: string | undefined | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase() || '?'
}

export interface PasswordRequirement {
  key: 'length' | 'number' | 'lowercase' | 'uppercase'
  label: string
  met: boolean
}

// Shared between server-side enforcement and the live client-side checklist —
// keep this dependency-free (no Node-only APIs) so it's safe in both.
export function checkPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { key: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { key: 'number', label: 'At least 1 number', met: /[0-9]/.test(password) },
    { key: 'lowercase', label: 'At least 1 lowercase letter', met: /[a-z]/.test(password) },
    { key: 'uppercase', label: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
  ]
}

export function passwordMeetsRequirements(password: string): boolean {
  return checkPasswordRequirements(password).every((r) => r.met)
}
