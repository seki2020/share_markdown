import { supabase } from '../../lib/supabase'
import { generateShareToken } from '../../lib/utils'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { files } = req.body

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' })
    }

    const results = []
    const errors = []

    for (const file of files) {
      try {
        const { filename, content, title } = file

        // 验证文件名
        if (!filename.toLowerCase().endsWith('.md') && !filename.toLowerCase().endsWith('.markdown')) {
          errors.push({ filename, error: 'Only .md and .markdown files are allowed' })
          continue
        }

        // 验证内容
        if (!content || content.trim().length === 0) {
          errors.push({ filename, error: 'File content is empty' })
          continue
        }

        // 验证文件大小 (5MB limit)
        const fileSizeBytes = new Blob([content]).size
        if (fileSizeBytes > 5 * 1024 * 1024) {
          errors.push({ filename, error: 'File size exceeds 5MB limit' })
          continue
        }

        const shareToken = generateShareToken()

        const { data, error } = await supabase
          .from('markdown_files')
          .insert({
            title: title || filename.replace(/\.(md|markdown)$/i, ''),
            filename,
            content,
            share_token: shareToken,
            file_size: fileSizeBytes
          })
          .select()

        if (error) {
          console.error('Database error:', error)
          errors.push({ filename, error: 'Failed to save file' })
          continue
        }

        results.push({
          filename,
          title: data[0].title,
          shareToken,
          shareUrl: `${req.headers.origin || 'http://localhost:3000'}/share/${shareToken}`,
          fileSize: fileSizeBytes
        })

      } catch (fileError) {
        console.error('File processing error:', fileError)
        errors.push({ filename: file.filename || 'unknown', error: 'Failed to process file' })
      }
    }

    res.status(200).json({
      success: results.length > 0,
      results,
      errors,
      summary: {
        total: files.length,
        successful: results.length,
        failed: errors.length
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}