import { useState } from 'react'
import Head from 'next/head'
import FileUpload from '../components/FileUpload'
import UploadResults from '../components/UploadResults'
import ThemeToggle from '../components/ThemeToggle'

export default function Home() {
  const [uploadResults, setUploadResults] = useState(null)

  const handleUploadComplete = (results) => {
    setUploadResults(results)
  }

  const handleReset = () => {
    setUploadResults(null)
  }

  return (
    <>
      <Head>
        <title>Markdown Share - Share your markdown files easily</title>
        <meta name="description" content="Upload and share markdown files with generated links" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeToggle />

      <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <div className="container mx-auto py-8">
          {/* 头部 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              📄 Markdown Share
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Upload your markdown files and get shareable links instantly. 
              Perfect for sharing documentation, notes, and articles with friends and colleagues.
            </p>
          </div>

          {/* 主要内容 */}
          {uploadResults ? (
            <UploadResults 
              results={uploadResults} 
              onReset={handleReset}
            />
          ) : (
            <>
              <FileUpload onUploadComplete={handleUploadComplete} />
              
              {/* 功能说明 */}
              <div className="max-w-4xl mx-auto mt-12 p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-3xl mb-3">🚀</div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Fast Upload
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drag & drop multiple markdown files or click to browse
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-3xl mb-3">🔗</div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Instant Links
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get shareable links immediately after upload
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-3xl mb-3">✨</div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Rich Rendering
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Beautiful markdown rendering with syntax highlighting
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 页脚 */}
        <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="container mx-auto py-8 px-6 text-center text-gray-600 dark:text-gray-400">
            <p>
              Built with Next.js and Supabase • 
              <span className="ml-2">
                Support: .md and .markdown files up to 5MB
              </span>
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}