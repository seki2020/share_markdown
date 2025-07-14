import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function QRCodeDisplay({ url, size = 150 }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const generateQRCode = async () => {
    if (qrCodeUrl) {
      setIsVisible(!isVisible)
      return
    }

    setLoading(true)
    try {
      // 检测当前主题
      const isDark = document.documentElement.classList.contains('dark')
      
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: size,
        margin: 1,
        color: {
          dark: isDark ? '#ffffff' : '#000000',
          light: isDark ? '#1f2937' : '#ffffff'
        }
      })
      setQrCodeUrl(qrDataUrl)
      setIsVisible(true)
    } catch (error) {
      console.error('Failed to generate QR code:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={generateQRCode}
        className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors flex items-center space-x-1"
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <span>📱</span>
            <span>{isVisible ? 'Hide QR' : 'QR Code'}</span>
          </>
        )}
      </button>

      {isVisible && qrCodeUrl && (
        <div className="absolute top-full right-0 mt-2 z-50 sm:right-0 right-auto left-0 sm:left-auto">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-lg min-w-max">
            <div className="text-center">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="mx-auto mb-2 rounded"
                width={size}
                height={size}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                Scan to open link
              </p>
              <button
                onClick={() => setIsVisible(false)}
                className="mt-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                Close
              </button>
            </div>
            {/* 小箭头 - 响应式位置 */}
            <div className="absolute -top-2 right-4 sm:right-4 left-4 sm:left-auto w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-600 transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  )
}