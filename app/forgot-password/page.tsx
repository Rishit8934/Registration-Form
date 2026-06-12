'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        setError(result?.error || 'Unable to send reset link')
      } else if (result?.error) {
        setError(result.error)
      } else {
        setMessage(result?.success || 'If an account exists, a reset link has been sent to your email.')
      }
    } catch (error) {
      console.error('Forgot password request failed:', error)
      setError('Unable to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot your password?</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter the email address for your account and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              required
              placeholder="your@email.com"
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
            {loading ? 'Sending reset link...' : 'Send reset link'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Remembered your password?{' '}
          <Link href="/login" className="text-blue-900 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
