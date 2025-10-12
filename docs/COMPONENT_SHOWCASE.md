# Component Showcase

The Component Showcase is an interactive gallery of all core ContentMap components, running in demo mode without requiring Supabase credentials.

## Accessing the Showcase

The showcase can be accessed in two ways:

1. **Query Parameter**: `http://localhost:5173/?showcase`
2. **Path**: `http://localhost:5173/showcase`

## Features

The showcase displays all major components with realistic demo data:

### Components Included

1. **Landing Page** - The main marketing page for the content audit service
2. **Audit Request Form** - Form for submitting audit requests (demo mode)
3. **Audit Processor** - Progress animation showing analysis steps
4. **Audit Report** - Complete audit report with:
   - Overall score and metrics
   - Buyer journey coverage
   - Content gaps
   - Prioritized recommendations
   - Competitive analysis
   - Content inventory
5. **Content Audit Dashboard** - Analytics dashboard showing:
   - Total content count
   - Content by buyer stage
   - Content by type
   - Gap identification
6. **Content Library** - Content management interface with filtering
7. **Content Recommendations** - AI-powered content suggestions for prospects
8. **FAQ** - Frequently asked questions component

### Demo Mode

All components run in demo mode, which means:
- No Supabase API calls are made
- All data is loaded from static demo objects
- Forms simulate successful submissions
- No actual data is persisted

### Use Cases

The component showcase is useful for:

- **Design Review**: Evaluate visual design and styling
- **Component Testing**: Test component behavior without backend
- **API Documentation**: Understand component props and interfaces
- **Development**: Develop UI features without Supabase setup
- **Demos**: Show stakeholders the application UI

## Implementation Details

### Location
- Component: `/src/components/ComponentShowcase.tsx`
- Routing: `/src/App.tsx` (lines 12-17, 23-24)

### Demo Data

Demo data is defined in `ComponentShowcase.tsx` (lines 11-165):
- `demoCompanyId`: Mock company identifier
- `demoAuditData`: Mock audit analytics (lines 13-30)
- `demoReport`: Mock audit report (lines 32-82)
- `demoContentItems`: Mock content library items (lines 84-111)
- `demoProspects`: Mock prospect data (lines 113-136)
- `demoRecommendations`: Mock content recommendations (lines 138-165)

### Adding New Components

To add a new component to the showcase:

1. Import the component in `ComponentShowcase.tsx`
2. Add demo data for the component (if needed)
3. Add a new section in the return JSX with appropriate styling
4. Include a heading and description for the component

Example:
```tsx
<section className="bg-white text-slate-900 rounded-2xl shadow-xl p-6">
  <h2 className="text-2xl font-semibold mb-4">Your Component Name</h2>
  <p className="text-sm text-slate-600 mb-4">
    Description of what the component does in demo mode.
  </p>
  <YourComponent demoMode {...demoProps} />
</section>
```

## Testing

Tests for the showcase are located in `/tests/smoke.spec.ts`:

```bash
# Run all tests
npm test

# Run showcase-specific tests
npm test -- --grep "showcase"

# Run tests in headed mode
npm run test:headed

# Run tests with UI mode
npm run test:ui
```

## Styling

The showcase uses:
- **Background**: Dark slate (`bg-slate-950`)
- **Sections**: White rounded cards with shadows
- **Typography**: Tailwind's font scale
- **Responsive**: Grid layouts that adapt to screen size
