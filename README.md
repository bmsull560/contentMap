# contentMap

A React + TypeScript web application for content mapping and audit services, built with Vite, Tailwind CSS, and Supabase.

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker (for local Supabase instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd contentMap
```

2. Install dependencies:
```bash
npm install
```

3. Install Supabase CLI locally:
```bash
npm install supabase --save-dev
```

4. Initialize and start local Supabase:
```bash
npx supabase init
npx supabase start
```

This will start a local Supabase instance with Docker and output connection details.

5. Create environment configuration:
Create a `.env.local` file with:
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

6. Apply database migrations:
```bash
cat supabase/migrations/20251012155458_create_content_mapping_schema.sql | docker exec -i supabase_db_contentMap psql -U postgres -d postgres
cat supabase/migrations/20251012160251_add_audit_service_tables.sql | docker exec -i supabase_db_contentMap psql -U postgres -d postgres
```

7. Load seed data (optional):
```bash
cat supabase/seed.sql | docker exec -i supabase_db_contentMap psql -U postgres -d postgres
```

8. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npx playwright test` - Run Playwright tests

## Database Management

### View Supabase Studio
Access the local Supabase Studio at http://127.0.0.1:54323

### Reset Database
```bash
npx supabase db reset
```

### Check Supabase Status
```bash
npx supabase status
```

### Stop Supabase
```bash
npx supabase stop
```

## Project Structure

```
contentMap/
├── src/
│   ├── components/       # React components
│   ├── lib/             # Utilities and integrations
│   │   ├── supabase.ts  # Supabase client
│   │   └── database.types.ts  # Database types
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── supabase/
│   ├── migrations/      # Database migrations
│   ├── seed.sql         # Seed data
│   └── config.toml      # Supabase configuration
├── tests/               # Playwright tests
└── playwright.config.ts # Playwright configuration
```

## Technologies

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Testing**: Playwright
- **Icons**: Lucide React

## Features

- Content audit request system
- Automated content analysis
- Buyer journey mapping
- Content gap identification
- AI-powered recommendations
- Comprehensive audit reports

## Development Notes

### Supabase Configuration
The app uses local Supabase for development. The default anon key is provided for local instances. For production deployment, update the environment variables with your actual Supabase project credentials.

### Database Schema
The database includes tables for:
- Companies and products
- Content items and value drivers
- Prospects and value models
- Audit requests and reports
- Content recommendations

See `supabase/migrations/` for the complete schema.

## Troubleshooting

### Supabase Connection Issues
1. Ensure Docker is running
2. Check Supabase status: `npx supabase status`
3. Restart Supabase: `npx supabase stop && npx supabase start`

### Environment Variables Not Loading
1. Ensure `.env.local` exists in the project root
2. Restart the dev server after creating/modifying `.env.local`
3. Variables must be prefixed with `VITE_` to be accessible in the app

### Database Schema Issues
If tables are missing, manually apply migrations:
```bash
cat supabase/migrations/*.sql | docker exec -i supabase_db_contentMap psql -U postgres -d postgres
```

## License

[Add your license here]
