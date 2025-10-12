# contentMap

A React + TypeScript web application for content mapping and audit analysis. Built with Vite, Tailwind CSS, and Supabase.

## Features

- **Content Audit Analysis**: AI-powered analysis of website content mapped to buyer journey stages
- **Content Library**: Manage and organize sales content assets
- **Content Recommendations**: AI-powered content suggestions for prospects
- **Buyer Journey Mapping**: Visualize content coverage across awareness, consideration, and decision stages
- **Gap Analysis**: Identify content gaps and opportunities

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

## Component Showcase

View all components in demo mode without needing Supabase credentials:

- Visit `http://localhost:5173/?showcase` or `http://localhost:5173/showcase`
- See [Component Showcase Documentation](docs/COMPONENT_SHOWCASE.md) for details

## Configuration

### Supabase (Optional)

The application can run in demo mode without Supabase. To enable live data:

1. Create a `.env` file in the project root
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Without these variables, the app runs in read-only demo mode.

## Project Structure

```
src/
├── components/        # React components
│   ├── ComponentShowcase.tsx
│   ├── LandingPage.tsx
│   ├── AuditRequestForm.tsx
│   ├── AuditProcessor.tsx
│   ├── AuditReport.tsx
│   ├── ContentAudit.tsx
│   ├── ContentLibrary.tsx
│   ├── ContentRecommendations.tsx
│   └── FAQ.tsx
├── lib/              # Utilities and integrations
│   ├── supabase.ts   # Supabase client setup
│   └── database.types.ts
└── main.tsx          # Application entry point

supabase/
└── migrations/       # Database schema migrations

tests/
└── smoke.spec.ts     # Playwright tests
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Testing

```bash
# Install Playwright browsers
npx playwright install

# Run tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Supabase** - Backend and database
- **Playwright** - End-to-end testing
- **Lucide React** - Icons

## License

See project license information.
