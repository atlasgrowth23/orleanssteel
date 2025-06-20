# Orleans Steel Lead Generation System

## 🏗️ Project Overview

This is a **construction permit lead generation application** built specifically for **Orleans Steel**, a New Orleans-based metal fabrication and supply company. The system analyzes real construction permit data to identify potential sales opportunities for Orleans Steel's products and services.

## 🎯 Business Purpose

Orleans Steel needs to find construction projects in the New Orleans area that might need their products:
- **Metal fencing and gates**
- **Metal roofing and siding** 
- **Structural steel components**
- **Custom fabrication services**

Instead of cold calling or random prospecting, this system uses **public permit data** to identify active construction projects that are likely to need steel products, prioritized by location, project value, and relevance to Orleans Steel's offerings.

## 🏢 About Orleans Steel

**Location**: 1641 Poland Ave, New Orleans, LA 70117  
**Website**: https://orleanssteel.com/  
**Business**: Full-service metal supplier and custom fabrication

**Key Products & Services**:
- Structural steel (I-beams, channels, angles, tubing)
- Metal roofing panels (R-panels) and siding
- Wrought iron and steel fencing/gates
- Custom metal fabrication
- Light-gauge framing (metal studs, tracks)
- Construction hardware and accessories

See [ORLEANS_STEEL.md](./ORLEANS_STEEL.md) for complete company details.

## 🔍 How It Works

1. **Data Source**: Real New Orleans construction permit data from Supabase database
2. **Geographic Filtering**: Shows projects within specified radius of Orleans Steel's location
3. **Smart Scoring**: AI-powered lead scoring based on:
   - Permit type relevance to steel products
   - Project construction value
   - Distance from Orleans Steel
   - Likelihood of needing steel components

4. **Visual Interface**: 
   - Interactive map showing lead locations
   - Sortable table with lead scores
   - Smart filtering by permit type, value, radius

## 🏆 Lead Categories

**🚪 Direct Product Matches**:
- **FENC** - Fencing permits (direct sales opportunity)
- **ROOF** - Roofing permits (metal panels, trim)

**🏗️ High-Value Structural**:
- **MBLD** - Major building construction
- **RNVS** - Structural renovations  
- **NEWC** - New commercial construction
- **ADDN** - Building additions

**🔨 General Construction**:
- **RNVN** - Non-structural renovations (potential for roofing/siding)

See [LEAD_GENERATION.md](./LEAD_GENERATION.md) for detailed lead scoring logic.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Maps**: Google Maps API
- **Data**: Real New Orleans construction permit records
- **UI Components**: shadcn/ui, TanStack React Table, @dnd-kit/core
- **Deployment**: Designed for Vercel/similar platforms

## 📊 Current Data

The system contains **200+ recent New Orleans construction permits** with:
- GPS coordinates for mapping
- Construction values ($1K - $1M+)
- Permit types, applicants, contractors
- Issue dates and current status
- **148 relevant leads** identified within 25-mile radius

## 🚀 Quick Start

See [DEVELOPMENT.md](./DEVELOPMENT.md) for complete setup instructions.

```bash
# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env.local

# Start development server
npm run dev
```

## 📁 Key Files

- `/app/permits/page.tsx` - Main lead generation interface
- `/lib/supabase.ts` - Database queries and lead scoring logic
- `/components/permits/` - Lead table, map, and filtering components
- `ORLEANS_STEEL.md` - Complete company information
- `DATABASE.md` - Database schema and setup

## 💡 Business Impact

This system transforms Orleans Steel's sales approach from:
- ❌ Cold calling random contractors
- ❌ Driving around looking for construction sites
- ❌ Waiting for customers to find them

To:
- ✅ **Targeted outreach** to active construction projects
- ✅ **Prioritized leads** based on project value and relevance  
- ✅ **Geographic efficiency** focusing on nearby projects
- ✅ **Data-driven sales** with applicant/contractor contact info

The result: **Higher conversion rates, reduced sales costs, and systematic lead generation.**

## 📚 Complete Documentation

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Executive overview and business case
- **[ORLEANS_STEEL.md](./ORLEANS_STEEL.md)** - Complete company information and products
- **[LEAD_GENERATION.md](./LEAD_GENERATION.md)** - Lead scoring algorithm and strategy
- **[DATABASE.md](./DATABASE.md)** - Database schema, setup, and data analysis
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Technical setup and development guide
