import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({ error: 'Token is required' })
    }

    // 查询文件
    const { data, error } = await supabase
      .from('markdown_files')
      .select('*')
      .eq('share_token', token)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'File not found' })
    }

    // 检查是否过期
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return res.status(410).json({ error: 'File has expired' })
    }

    // 更新访问次数
    await supabase
      .from('markdown_files')
      .update({ view_count: data.view_count + 1 })
      .eq('share_token', token)

    res.status(200).json({
      id: data.id,
      title: data.title,
      filename: data.filename,
      content: data.content,
      createdAt: data.created_at,
      viewCount: data.view_count + 1,
      fileSize: data.file_size
    })

  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}