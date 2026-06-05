'use client'

import { useState } from 'react'
import { registerUser } from './action'

export default function RegisterPage() {
  const [message, setMessage] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const formData = new FormData(e.currentTarget)
    const result   = await registerUser(formData)

    if (result.error)   setError(result.error)
    if (result.success) setMessage(result.success)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Create account</h1>
        <p className="text-sm text-gray-400 mb-6">Fill in your details to register</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full name</label>
            <input name="name" type="text" required placeholder="John Doe"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input name="email" type="email" required placeholder="john@example.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input name="password" type="password" required placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone number</label>
            <input name="phone" type="tel" required placeholder="+91 23445 67890"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date of birth</label>
            <input name="dateOfBirth" type="date" required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
            <textarea name="address" required placeholder="123 Main St, City, Country"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none" rows={3} />
          </div>

          {error   && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
          {message && <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">{message}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-gray-800 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </main>
  )
}