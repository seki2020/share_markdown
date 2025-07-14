import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import ThemeToggle from '../../components/ThemeToggle'

export default function SharePage() {
  const router = useRouter()
  const { token } = router.query
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return

    const fetchMarkdown = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/md/${token}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('File not found')
          } else if (response.status === 410) {
            setError('File has expired')
          } else {
            setError('Failed to load file')
          }
          return
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to load file')
      } finally {
        setLoading(false)
      }
    }

    fetchMarkdown()
  }, [token])

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... - Markdown Share</title>
        </Head>
        <ThemeToggle />
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading markdown file...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error - Markdown Share</title>
        </Head>
        <ThemeToggle />
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {error}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The file you're looking for might have been removed or the link is invalid.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Upload New Files
            </a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{data?.title || 'Shared Markdown'} - Markdown Share</title>
        <meta name="description" content={`Shared markdown file: ${data?.title || data?.filename}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <ThemeToggle />

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        {/* 顶部导航 */}
        <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <a 
                href="/" 
                className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                📄 Markdown Share
              </a>
              <div className="flex items-center space-x-4">
                <a
                  href="/"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Upload New
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <main className="container mx-auto py-8">
          <MarkdownRenderer
            content={data.content}
            title={data.title}
            metadata={{
              filename: data.filename,
              fileSize: data.fileSize,
              createdAt: data.createdAt,
              viewCount: data.viewCount
            }}
          />
        </main>

        {/* 页脚 */}
        <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="container mx-auto py-8 px-6 text-center text-gray-600 dark:text-gray-400">
            <p>
              Shared via Markdown Share • 
              <a href="/" className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">
                Create your own
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}