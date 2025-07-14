-- 创建 markdown_files 表
CREATE TABLE markdown_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  file_size INTEGER DEFAULT 0
);

-- 创建索引
CREATE INDEX idx_markdown_files_share_token ON markdown_files(share_token);
CREATE INDEX idx_markdown_files_created_at ON markdown_files(created_at);

-- 启用 RLS (Row Level Security)
ALTER TABLE markdown_files ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取（通过share_token）
CREATE POLICY "Allow public read access" ON markdown_files
  FOR SELECT USING (true);

-- 创建策略：允许所有人插入
CREATE POLICY "Allow public insert" ON markdown_files
  FOR INSERT WITH CHECK (true);

-- 创建策略：允许所有人更新view_count
CREATE POLICY "Allow public update view_count" ON markdown_files
  FOR UPDATE USING (true);