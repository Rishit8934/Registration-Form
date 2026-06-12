'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ResetPasswordPageProps {
  params: {
    token: string
  }
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: params.token, password }),
    })

    const result = await response.json()
    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setMessage(result.success)
    setTimeout(() => router.push('/login'), 1200)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset your password</h1>
        <p className="text-sm text-gray-500 mb-6">
          Set a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">New password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
            />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}
          {message && <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-xl">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Back to{' '}
          <Link href="/login" className="text-blue-900 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
