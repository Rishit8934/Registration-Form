import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail } from '@/lib/mailer'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    GitHub,
    Credentials({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!passwordMatch) return null

        return {
          id:    String(user.id),
          name:  user.name,
          email: user.email,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log('Sign in callback fired:', account?.provider, user?.email)

      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const email = user.email!
          const name  = user.name!

          console.log('Checking if user exists:', email)

          const existing = await prisma.user.findUnique({
            where: { email },
          })

          console.log('User exists:', !!existing)

          if (!existing) {
            await prisma.user.create({
              data: {
                name,
                email,
                password:    '',
                phone:       '',
                dateOfBirth: new Date(),
                address:     '',
              },
            })
            await sendWelcomeEmail(name, email)
            console.log('Email sent to:', email)
          } else {
            console.log('User already exists, skipping email')
          }
        } catch (error) {
          console.error('Error:', error)
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})