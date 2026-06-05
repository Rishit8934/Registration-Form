'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function registerUser(formData: FormData) {
  const name        = formData.get('name') as string
  const email       = formData.get('email') as string
  const password    = formData.get('password') as string
  const phone       = formData.get('phone') as string
  const dateOfBirth = formData.get('dateOfBirth') as string
  const address     = formData.get('address') as string

  if (!name || !email || !password || !phone || !dateOfBirth || !address) {
    return { error: 'All fields are required' }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: 'Email already registered' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      address,
    },
  })

  return { success: 'Registration successful!' }
}