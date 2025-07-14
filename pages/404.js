import Head from 'next/head'
import ThemeToggle from '../components/ThemeToggle'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - Markdown Share</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Head>

      <ThemeToggle />

      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-8xl mb-6">🔍</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            404
          </h1>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-3">
            <a
              href="/"
              className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Go Home
            </a>
            <a
              href="/"
              className="block w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg transition-colors"
            >
              Upload Files
            </a>
          </div>
        </div>
      </div>
    </>
  )
}