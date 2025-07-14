import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github.css'

export default function MarkdownRenderer({ content, title, metadata }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 文件信息头部 */}
      {metadata && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>📄 {metadata.filename}</span>
            {metadata.fileSize && (
              <span>📊 {formatFileSize(metadata.fileSize)}</span>
            )}
            {metadata.createdAt && (
              <span>📅 {new Date(metadata.createdAt).toLocaleDateString()}</span>
            )}
            {metadata.viewCount && (
              <span>👁️ {metadata.viewCount} views</span>
            )}
          </div>
        </div>
      )}

      {/* Markdown 内容 */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            // 自定义代码块样式
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <code className={className} {...props}>
                  {children}
                </code>
              ) : (
                <code
                  className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
                  {...props}
                >
                  {children}
                </code>
              )
            },
            // 自定义链接样式
            a({ children, href, ...props }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  {...props}
                >
                  {children}
                </a>
              )
            },
            // 自定义表格样式
            table({ children, ...props }) {
              return (
                <div className="overflow-x-auto">
                  <table
                    className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                    {...props}
                  >
                    {children}
                  </table>
                </div>
              )
            },
            // 自定义引用块样式
            blockquote({ children, ...props }) {
              return (
                <blockquote
                  className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300"
                  {...props}
                >
                  {children}
                </blockquote>
              )
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  )
}

// 辅助函数
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}