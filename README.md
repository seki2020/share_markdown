# Markdown Share

A Next.js application for sharing markdown files through generated links. Upload multiple `.md` files and get instant shareable URLs with beautiful rendering.

## Features

- 📄 **Multi-file Upload**: Drag & drop or select multiple markdown files
- 🔗 **Instant Share Links**: Get shareable URLs immediately after upload
- ✨ **Rich Rendering**: Beautiful markdown rendering with syntax highlighting
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive**: Works great on desktop and mobile
- 🚀 **Fast**: Built with Next.js and Supabase for optimal performance

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Markdown**: react-markdown with plugins
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd markdown-share
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the SQL from `database.sql` in your Supabase SQL editor

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- See database.sql file for complete setup
```

## Usage

1. **Upload Files**: Drag and drop `.md` files or click to browse
2. **Get Links**: Receive shareable URLs for each uploaded file
3. **Share**: Send the links to anyone - no account required to view
4. **View**: Beautiful rendered markdown with syntax highlighting

## File Limitations

- **File Types**: Only `.md` and `.markdown` files
- **File Size**: Maximum 5MB per file
- **Storage**: Uses Supabase free tier (500MB total)

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## API Endpoints

- `POST /api/upload` - Upload markdown files
- `GET /api/md/[token]` - Retrieve markdown content by share token

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- File size limit: 5MB per file
- Supported formats: `.md`, `.markdown`
- Free tier limitations apply (Supabase free plan)

---

Built with ❤️ using Next.js and Supabase