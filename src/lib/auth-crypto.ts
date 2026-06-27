import { pbkdf2Sync, randomBytes } from 'crypto';

/**
 * Node.js-specific crypto helpers for password hashing.
 * Separated from auth.ts to avoid bundling Node native modules in the Next.js Edge Middleware runtime.
 */
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
