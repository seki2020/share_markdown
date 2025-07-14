import { useState } from 'react'
import { copyToClipboard } from '../lib/utils'
import QRCodeDisplay from './QRCodeDisplay'

export default function UploadResults({ results, onReset }) {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const handleCopy = async (url, index) => {
    try {
      await copyToClipboard(url)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleCopyAll = async () => {
    const allUrls = results.results.map(result => result.shareUrl).join('\n')
    try {
      await copyToClipboard(allUrls)
      setCopiedIndex('all')
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error('Failed to copy all:', error)
    }
  }

  if (!results || (!results.results?.length && !results.errors?.length)) {
    return null
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* 上传摘要 */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
          Upload Complete
        </h2>
        <div className="text-blue-800 dark:text-blue-200">
          <p>Total files: {results.summary.total}</p>
          <p>Successful: {results.summary.successful}</p>
          {results.summary.failed > 0 && (
            <p className="text-red-600 dark:text-red-400">Failed: {results.summary.failed}</p>
          )}
        </div>
      </div>

      {/* 成功上传的文件 */}
      {results.results?.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Share Links ({results.results.length})
            </h3>
            {results.results.length > 1 && (
              <button
                onClick={handleCopyAll}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
              >
                {copiedIndex === 'all' ? '✓ Copied All' : 'Copy All Links'}
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {results.results.map((result, index) => (
              <div
                key={index}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-green-900 dark:text-green-100 truncate">
                      {result.title}
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                      {result.filename}
                    </p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={result.shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleCopy(result.shareUrl, index)}
                        className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        {copiedIndex === index ? '✓ Copied' : 'Copy'}
                      </button>
                      <a
                        href={result.shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                      >
                        View
                      </a>
                      <QRCodeDisplay url={result.shareUrl} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 失败的文件 */}
      {results.errors?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-4">
            Failed Uploads ({results.errors.length})
          </h3>
          <div className="space-y-2">
            {results.errors.map((error, index) => (
              <div
                key={index}
                className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
              >
                <p className="font-medium text-red-900 dark:text-red-100">
                  {error.filename}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error.error}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 重置按钮 */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Upload More Files
        </button>
      </div>
    </div>
  )
}