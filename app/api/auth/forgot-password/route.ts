import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/mailer'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const token = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 60 * 60 * 1000)

      await prisma.user.update({
        where: { email },
        data: {
          passwordResetToken: token,
          passwordResetExpires: expires,
        },
      })

      void sendPasswordResetEmail(user.name || 'User', email, token).catch((error) => {
        console.error('Password reset email failed:', error)
      })
    }

    return NextResponse.json({ success: 'If an account exists, a reset link has been sent to your email.' })
  } catch (error) {
    console.error('Forgot password API error:', error)
    return NextResponse.json({ error: 'Unable to process request right now' }, { status: 500 })
  }
}
