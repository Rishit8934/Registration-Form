'use client'

import { useState } from 'react'
import { scrapeWebsite } from './scrape-action'
import { signOut } from 'next-auth/react'

interface ScrapedLink {
  url: string
  text: string
}

interface ScrapeResult {
  success?: boolean
  error?: string
  pageTitle?: string
  url?: string
  summary?: string
  links?: ScrapedLink[]
  totalLinks?: number
}

export default function DashboardClient({ userName }: { userName: string }) {
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<ScrapeResult | null>(null)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    const response = await scrapeWebsite(website)

    if (response.error) {
      setError(response.error)
    } else {
      setResult(response)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Welcome, {userName} 👋</h1>
            <p className="text-sm text-gray-400">Enter a website URL to analyze its pages</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Sign out
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              required
              placeholder="example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg mt-3">{error}</p>
          )}
        </div>

        {/* Results */}
        {result && result.success && (
          <div className="space-y-4">

            {/* Summary card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{result.pageTitle}</h2>
              <p className="text-xs text-gray-400 mb-3">{result.url}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{result.summary}</p>
            </div>

            {/* Links list */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Pages found ({result.totalLinks})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {result.links?.map((link, i) => (
                  
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-gray-100 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-sm text-gray-700 font-medium truncate">{link.text}</p>
                    <p className="text-xs text-gray-400 truncate">{link.url}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}