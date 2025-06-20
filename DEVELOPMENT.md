# Development Setup Guide

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or pnpm
- Git

### **Installation**
```bash
# Clone the repository
git clone [repository-url]
cd orleans-steel-leads

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 🔧 Environment Configuration

### **Required Environment Variables**

Create `.env.local` file in the root directory:

```bash
# Google Maps API Key (for map functionality)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pvxgnsxubwjopcpxreuk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Database Connection URLs
DATABASE_URL=postgresql://postgres.pvxgnsxubwjopcpxreuk:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.pvxgnsxubwjopcpxreuk:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Force port (for Replit compatibility)
PORT=3000

# Optional: GitHub token for deployments
GITHUB_TOKEN=your_github_token
```

### **Getting API Keys**

**Google Maps API**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create API key with Maps restrictions
4. Add your domain to authorized origins

**Supabase**:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project or use existing
3. Copy URL and anon key from Settings > API
4. Copy service key for backend operations

## 📁 Project Structure

```
orleans-steel-leads/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and Tailwind
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Home page (redirects to permits)
│   ├── permits/                 # Lead generation pages
│   │   └── page.tsx            # Main permits/leads interface
│   └── pipelines/               # Pipeline management
│       └── page.tsx            # Kanban board for lead management
├── components/                   # React components
│   ├── permits/                 # Lead generation components
│   │   ├── data-table.tsx      # Lead table with sorting/filtering
│   │   ├── filter-ribbon.tsx   # Search and filter controls  
│   │   ├── map-panel.tsx       # Interactive Google Maps
│   │   └── permit-drawer.tsx   # Lead detail sidebar
│   ├── pipelines/               # Pipeline management components
│   │   ├── kanban-board.tsx    # Drag-and-drop lead board
│   │   ├── pipeline-card.tsx   # Individual lead cards
│   │   └── card-drawer.tsx     # Lead detail editor
│   ├── ui/                      # Reusable UI components (shadcn/ui)
│   ├── sidebar.tsx              # Main navigation
│   └── top-bar.tsx             # Header with search
├── lib/                         # Utility functions
│   ├── supabase.ts             # Database queries and lead scoring
│   ├── utils.ts                # General utilities
│   └── cn.ts                   # Tailwind class merging
├── types/                       # TypeScript type definitions
│   └── index.ts                # Permit and pipeline types
├── data/                        # Static/sample data
│   ├── stub-permits.json       # Sample permit data for development
│   └── stub-pipelines.json     # Sample pipeline data
├── docs/                        # Documentation
│   ├── README.md               # Main project documentation
│   ├── ORLEANS_STEEL.md        # Company information
│   ├── LEAD_GENERATION.md      # Lead scoring documentation
│   ├── DATABASE.md             # Database schema and setup
│   └── DEVELOPMENT.md          # This file
└── public/                      # Static assets
```

## 🛠️ Technology Stack

### **Frontend Framework**
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety and developer experience

### **Styling**
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Icon library

### **Database & Backend**
- **Supabase** - PostgreSQL database with real-time features
- **Server Components** - Next.js server-side rendering

### **Maps & Visualization**
- **Google Maps API** - Interactive mapping
- **@react-google-maps/api** - React Google Maps integration

### **Data Management**
- **TanStack React Table** - Powerful table component
- **@dnd-kit** - Drag and drop for Kanban board

## 🎯 Key Features Implementation

### **Lead Scoring Algorithm**
Location: `/lib/supabase.ts`

```typescript
function calculateLeadScore(permit: any): number {
  let score = 0;
  
  // Construction value (0-30 points)
  score += Math.min(permit.constrval / 10000, 30);
  
  // Permit type relevance (0-40 points)
  const codeInfo = ORLEANS_STEEL_RELEVANT_CODES[permit.code];
  if (codeInfo) {
    switch (codeInfo.priority) {
      case 'high': score += 40; break;
      case 'medium': score += 25; break; 
      case 'low': score += 10; break;
    }
  }
  
  // Distance scoring (5-25 points)
  if (permit.distance <= 5) score += 25;
  else if (permit.distance <= 15) score += 15;
  // ... etc
  
  return Math.round(score);
}
```

### **Geographic Filtering**
```typescript
// Orleans Steel location
const ORLEANS_STEEL_LOCATION = {
  lat: 29.9584,
  lng: -90.0192,
  address: "1641 Poland Ave, New Orleans, LA 70117"
};

// Haversine distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth radius in miles
  // ... Haversine formula implementation
}
```

### **Real-time Filtering**
Location: `/components/permits/filter-ribbon.tsx`

Implements debounced search with URL state management:
```typescript
useEffect(() => {
  const timer = setTimeout(updateFilters, 500);
  return () => clearTimeout(timer);
}, [selectedCodes, keyword, valueRange, radius, status]);
```

## 🧪 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Database
npm run db:generate     # Generate database types (if using Prisma)
npm run db:push         # Push schema changes
npm run db:seed         # Seed development data

# Testing (if implemented)
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests
npm run test:watch      # Watch mode
```

## 🔍 Debugging & Development Tools

### **Database Debugging**
```typescript
// Enable query logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase query:', query);
}
```

### **Component Development**
- Use React DevTools for component inspection
- Tailwind CSS IntelliSense for styling
- TypeScript strict mode for type checking

### **Performance Monitoring**
```typescript
// Lead scoring performance
console.time('leadScoring');
const scoredLeads = calculateLeadScores(permits);
console.timeEnd('leadScoring');
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: 320px-768px (stacked layout)
- **Tablet**: 768px-1024px (adaptive layout)  
- **Desktop**: 1024px+ (full side-by-side layout)

Key responsive features:
- Collapsible sidebar on mobile
- Responsive data table with horizontal scroll
- Touch-friendly map controls
- Mobile-optimized filter panels

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add domain configuration for Google Maps
```

### **Other Platforms**
- **Netlify**: Works with Next.js static export
- **Railway**: Supports full-stack Next.js
- **Digital Ocean**: App Platform deployment
- **Self-hosted**: Docker containerization available

### **Environment Variables for Production**
Ensure all environment variables are set in your deployment platform:
- Database URLs with production credentials
- Google Maps API key with production domains
- Supabase keys for production instance

## 🐛 Common Issues & Solutions

### **Port Issues (Replit)**
```bash
# Force port 3000
PORT=3000 npm run dev

# Or update package.json
"dev": "next dev -p 3000"
```

### **Google Maps Not Loading**
1. Check API key validity
2. Verify domain restrictions
3. Enable required APIs (Maps JavaScript API)
4. Check browser console for errors

### **Database Connection Issues**
1. Verify Supabase credentials
2. Check network connectivity  
3. Validate database URL format
4. Test with Supabase dashboard

### **Tailwind Styles Not Working**
1. Check postcss.config.js configuration
2. Verify Tailwind v4 syntax (@import vs @tailwind)
3. Clear Next.js cache: `rm -rf .next`
4. Restart development server

## 🔒 Security Considerations

### **API Key Security**
- Never commit API keys to repository
- Use environment variables for all secrets
- Restrict Google Maps API to specific domains
- Use Supabase RLS (Row Level Security) policies

### **Database Security**
```sql
-- Example RLS policy for permit data
CREATE POLICY "Public permits are viewable by everyone" 
ON permit_leads FOR SELECT 
TO authenticated, anon 
USING (true);
```

### **Client-Side Security**
- Validate all user inputs
- Sanitize search parameters  
- Rate limit API requests
- Use HTTPS in production

This development guide provides everything needed to set up, develop, and deploy the Orleans Steel lead generation system.