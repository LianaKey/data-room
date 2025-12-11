# Data Room

A secure, modern file management system built with Next.js and Supabase for organizing and sharing PDF documents in dedicated data rooms.

## Features

- 🔐 **Authentication** - Secure user authentication with Supabase Auth
- 📁 **Multi-Room Organization** - Create and manage multiple data rooms
- 📂 **Folder Structure** - Organize files in nested folders
- 📄 **PDF Upload** - Drag-and-drop or click to upload PDF files
- 🔄 **File Management** - Rename, download, and delete files/folders
- 📦 **Bulk Operations** - Select multiple files for batch download or delete
- 🗜️ **Folder Download** - Download entire folders as ZIP archives
- 🔍 **Sorting & Pagination** - Sort by name, type, or size with paginated views
- 🎨 **Dark Mode** - Automatic dark/light theme support
- 🔒 **Row Level Security** - User-scoped data access with Supabase RLS

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Database**: [Supabase](https://supabase.com)
- **Storage**: Supabase Storage
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Linting**: [Biome](https://biomejs.dev)
- **Archive**: JSZip

## Project Structure

```
data-room/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── datarooms/
│   │   ├── [id]/
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── hooks/      # Custom React hooks
│   │   │   ├── utils/      # Utility functions
│   │   │   └── page.tsx    # Room detail page
│   │   ├── actions.ts      # Server actions
│   │   └── page.tsx        # Rooms list page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── lib/
│   ├── supabaseClient.ts   # Browser Supabase client
│   └── supabaseServer.ts   # Server Supabase client
├── middleware.ts           # Auth middleware
└── supabase/
    └── migrations/         # Database migrations
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- Supabase account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/LianaKey/data-room.git
cd data-room
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run database migrations**

Apply the migrations to set up the database schema:

```bash
pnpm db:push
```

Or manually run the SQL in `apply_to_production.sql` in your Supabase SQL Editor.

5. **Start the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tables

**datarooms**
- `id` (uuid, primary key)
- `name` (text)
- `user_id` (uuid, foreign key to auth.users)
- `created_at` (timestamp)

### Storage

**Bucket**: `userimages-prod`
- Structure: `{user_id}/{room_id}/{path}/{filename}`
- RLS policies enforce user-scoped access

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
pnpm db:push      # Push database migrations
```

## Key Components

### Custom Hooks

- `useAuth` - Manages user authentication state
- `useFiles` - Loads and manages file listings
- `useRoom` - Fetches room metadata
- `useFileUpload` - Handles file upload with validation
- `useFileOperations` - CRUD operations for files/folders
- `useZipDownload` - Generates ZIP archives for folder downloads
- `useFileSelection` - Manages bulk file selection
- `useFileSorting` - Sorting and pagination logic

### UI Components

- `RoomHeader` - Room title and navigation
- `ErrorDisplay` - Error message display
- `ActionToolbar` - Upload, create folder, bulk actions
- `CreateFolderForm` - Folder creation form
- `DropZone` - Drag-and-drop upload area
- `FileTable` - Sortable file/folder table with inline rename
- `Pagination` - Page navigation controls
- `EmptyState` - Empty folder message

## Security

- **Row Level Security (RLS)** - All database queries are scoped to authenticated users
- **User-scoped storage** - Files are organized by user ID and protected by storage policies
- **Server-side validation** - File uploads and operations validated on the server
- **Authentication middleware** - Protected routes require valid session

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Supabase](https://supabase.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
