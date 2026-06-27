"use server"

import db from '@/lib/db'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { signSession, SESSION_EXPIRY_MS, SessionPayload } from '@/lib/auth'
import { verifyPassword } from '@/lib/auth-crypto'

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi")
})

/**
 * Server Action for authenticating the panitia admin.
 */
export async function loginAction(prevState: any, formData: FormData) {
  try {
    const usernameInput = formData.get('username')
    const passwordInput = formData.get('password')

    // Validate fields with Zod
    const validated = loginSchema.safeParse({
      username: usernameInput?.toString(),
      password: passwordInput?.toString()
    })

    if (!validated.success) {
      const errorMap = validated.error.flatten().fieldErrors
      const firstError = Object.values(errorMap).flat()[0] || "Validasi input gagal."
      return { success: false, error: firstError }
    }

    const { username, password } = validated.data

    // Find user in database
    const user = await db.user.findUnique({
      where: { username: username.toLowerCase().trim() }
    })

    if (!user) {
      return { success: false, error: "Username atau password salah." }
    }

    // Verify hashed password
    const isPasswordCorrect = verifyPassword(password, user.password)
    if (!isPasswordCorrect) {
      return { success: false, error: "Username atau password salah." }
    }

    // Create session payload
    const expiresAt = Date.now() + SESSION_EXPIRY_MS
    const sessionPayload: SessionPayload = {
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      expiresAt
    }

    // Sign session token
    const token = await signSession(JSON.stringify(sessionPayload))

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(expiresAt)
    })

  } catch (error) {
    console.error("Login action error:", error)
    return { success: false, error: "Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi atau hubungi pembuat sistem." }
  }

  // Redirect on success (needs to be outside the try-catch block to avoid catching redirect exception)
  redirect('/admin/pemasukan')
}

/**
 * Server Action to logout and clear session cookie.
 */
export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/login')
}
