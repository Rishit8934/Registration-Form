'use server'

import * as cheerio from 'cheerio'
import { openai } from '@/lib/openai'

interface ScrapedLink {
  url: string
  text: string
} 



export async function scrapeWebsite(inputUrl: string) {
  try {
    // Normalize URL
    let url = inputUrl.trim()
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }


    // 1. Fetch the website HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      return { error: `Failed to fetch website (status ${response.status})` }
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // 2. Extract page title
    const pageTitle = $('title').text() || 'Untitled'

    // 3. Extract all links
    const baseUrl = new URL(url)
    const links: ScrapedLink[] = []
    const seen = new Set<string>()

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')
      const text = $(el).text().trim().slice(0, 100)
      if (!href) return

      try {
        const absoluteUrl = new URL(href, baseUrl).href

        // Only same-domain links, skip duplicates and anchors
        if (
          absoluteUrl.includes(baseUrl.hostname) &&
          !seen.has(absoluteUrl) &&
          !absoluteUrl.includes('#')
        ) {
          seen.add(absoluteUrl)
          links.push({ url: absoluteUrl, text: text || absoluteUrl })
        }
      } catch {
        // skip invalid URLs
      }
    })


    // Limit to first 50 links to keep things fast
    const limitedLinks = links.slice(0, 50)

    // 4. Send to OpenAI for a summary
    const linksListText = limitedLinks
      .map((l) => `- ${l.text}: ${l.url}`)
      .join('\n')

    let summary = '⚠️ AI summary unavailable — OpenAI quota exceeded. Add billing at platform.openai.com to enable AI summaries.'

    try {
      const aiResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You analyze website link structures and provide a short, helpful summary of what the website offers and how its pages are organized.',
          },
          {
            role: 'user',
            content: `Website: ${url}\nTitle: ${pageTitle}\n\nLinks found:\n${linksListText}\n\nGive a short summary (3-4 sentences) of what this website is about and how it's structured.`,
          },
        ],
      })

      summary = aiResponse.choices[0]?.message?.content || summary
    } catch (err) {
      console.error('OpenAI error (continuing without AI summary):', err)
    }

    return {
      success: true,
      pageTitle,
      url,
      summary,
      links: limitedLinks,
      totalLinks: links.length,
    }
  } catch (error) {
    console.error('Scrape error:', error)
    return { error: 'Something went wrong while analyzing the website' }
  }
}