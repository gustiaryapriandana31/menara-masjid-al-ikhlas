import { pbkdf2Sync, randomBytes } from 'crypto';
import { cookies } from 'next/headers';

// Password Hashing (PBKDF2 SHA-512)
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    const hashedInput = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hashedInput === hash;
  } catch (error) {
    return false;
  }
}

// Session Management (Web Crypto HMAC-SHA256)
// This works in both Node.js server actions and Edge middleware.
const SESSION_SECRET = process.env.SESSION_SECRET || 'manara-masjid-al-ikhlas-super-secret-key-at-least-32-characters-long';
const COOKIE_NAME = 'session';
export const SESSION_EXPIRY_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

async function getCryptoKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSession(payload: string): Promise<string> {
  const key = await getCryptoKey();
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const sigHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${payload}.${sigHex}`;
}

export async function verifySession(token: string): Promise<string | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, sigHex] = parts;
    const key = await getCryptoKey();
    const enc = new TextEncoder();
    const sigBytes = new Uint8Array(
      sigHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(payload));
    return isValid ? payload : null;
  } catch (e) {
    return null;
  }
}

export interface SessionPayload {
  userId: string;
  username: string;
  name: string;
  role: string;
  expiresAt: number;
}

// Helper to get session from request headers (works in Server Components & Actions)
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;

    const payloadStr = await verifySession(sessionCookie.value);
    if (!payloadStr) return null;

    const session: SessionPayload = JSON.parse(payloadStr);
    if (Date.now() > session.expiresAt) {
      return null; // Expired
    }
    return session;
  } catch (e) {
    return null;
  }
}
