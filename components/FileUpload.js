import { useState, useRef } from 'react'
import { validateMarkdownFile, validateFileSize, readFileAsText, formatFileSize } from '../lib/utils'

export default function FileUpload({ onUploadComplete }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files)
    handleFiles(selectedFiles)
  }

  const handleFiles = (newFiles) => {
    const validFiles = []
    const invalidFiles = []

    newFiles.forEach(file => {
      if (!validateMarkdownFile(file)) {
        invalidFiles.push({ file, error: 'Only .md and .markdown files are allowed' })
        return
      }
      
      if (!validateFileSize(file)) {
        invalidFiles.push({ file, error: 'File size exceeds 5MB limit' })
        return
      }

      validFiles.push(file)
    })

    if (invalidFiles.length > 0) {
      alert(`Some files were rejected:\n${invalidFiles.map(f => `${f.file.name}: ${f.error}`).join('\n')}`)
    }

    setFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    
    try {
      const fileContents = await Promise.all(
        files.map(async (file) => {
          const content = await readFileAsText(file)
          return {
            filename: file.name,
            content,
            title: file.name.replace(/\.(md|markdown)$/i, '')
          }
        })
      )

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: fileContents }),
      })

      const result = await response.json()
      
      if (response.ok) {
        onUploadComplete(result)
        setFiles([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* 拖拽上传区域 */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".md,.markdown"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="text-6xl text-gray-400">📄</div>
          <div>
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
              Drop your Markdown files here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              or click to browse files
            </p>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Only .md and .markdown files • Max 5MB per file
          </div>
        </div>
      </div>

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Selected Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📄</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  disabled={uploading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 上传按钮 */}
      {files.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  )
}