# Database Documentation

## 🗄️ Database Overview

The system uses **Supabase** (PostgreSQL) to store real New Orleans construction permit data. The database contains current permit records with GPS coordinates, construction values, and detailed permit information.

## 📊 Data Source

**Source**: New Orleans city permit records  
**Coverage**: Greater New Orleans metropolitan area  
**Update Frequency**: Regular updates with new permit filings  
**Data Quality**: Official government records with validated information

## 🏗️ Database Schema

### **Main Table: `permit_leads`**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `permit_id` | VARCHAR | Unique permit identifier | "25-08468-ETMP" |
| `issuedate` | TIMESTAMP | When permit was issued | "2025-03-25T08:42:35" |
| `filed_date` | TIMESTAMP | When permit was filed | "2025-03-18T09:37:59" |
| `code` | VARCHAR | Permit type code | "RNVS", "FENC", "ROOF" |
| `type` | VARCHAR | Permit type description | "Structural Renovation" |
| `description` | TEXT | Project description | "Setting up Electrical for French Quarter Fest 2025" |
| `address` | VARCHAR | Project address | "754 Decatur St" |
| `location_1` | JSON | GPS coordinates | `{"latitude":"29.956","longitude":"-90.061"}` |
| `constrval` | INTEGER | Construction value in USD | 150000 |
| `applicant` | VARCHAR | Permit applicant name | "William J. Shelton Jr." |
| `contractors` | VARCHAR | Contractor name(s) | "Mighty Air Conditioning & Heating LLC" |
| `currentstatus` | VARCHAR | Current permit status | "Permit Issued", "Finaled" |
| `raw` | JSONB | Complete original permit data | Full permit record |

## 🔍 Key Data Points

### **Current Dataset Statistics**
- **Total Permits**: 200+ records
- **With GPS Coordinates**: 100% (all permits mappable)
- **Date Range**: Last 3-6 months of permit activity
- **Geographic Coverage**: Orleans Parish and surrounding areas
- **Construction Values**: $1,000 - $1,000,000+

### **Permit Code Distribution**
Based on current data analysis:

| Code | Count | Description | Orleans Steel Relevance |
|------|-------|-------------|------------------------|
| HVAC | 45 | HVAC work | Low (equipment supports) |
| SERV | 44 | Service work | Low (too general) |
| FGAS | 34 | Fuel gas | Low (not steel-related) |
| **RNVN** | **19** | **Non-structural renovation** | **High** (roofing/siding) |
| ACCS | 15 | Accessory structures | Medium (small steel work) |
| **RNVS** | **13** | **Structural renovation** | **High** (steel reinforcement) |
| ERPR | 11 | Electrical repair | Low (not steel-related) |
| EGEN | 5 | Emergency generator | Low (small steel supports) |
| **NEWC** | **4** | **New commercial** | **High** (steel construction) |
| **DEMO** | **2** | **Demolition** | **Medium** (future rebuilding) |

## 🌍 Geographic Distribution

**Orleans Steel Location**: 1641 Poland Ave (29.9584°N, 90.0192°W)

**Lead Distribution by Distance**:
- **0-5 miles**: ~35 permits (prime delivery zone)
- **6-15 miles**: ~65 permits (standard service area)  
- **16-25 miles**: ~48 permits (extended service area)
- **25+ miles**: Limited coverage (special projects only)

## 🔧 Database Connection

### **Supabase Configuration**
```bash
# Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://pvxgnsxubwjopcpxreuk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_KEY=[service_key]

# Connection Strings
DATABASE_URL=postgresql://postgres.pvxgnsxubwjopcpxreuk:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.pvxgnsxubwjopcpxreuk:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### **Connection Features**
- **Pooled connections** for better performance
- **Real-time subscriptions** for live updates
- **Row-level security** for data protection
- **Automatic backups** and point-in-time recovery

## 📈 Query Performance

### **Optimized Queries**
The application uses several optimized queries:

```sql
-- Main leads query with filtering
SELECT * FROM permit_leads 
WHERE location_1 IS NOT NULL 
  AND constrval >= 1000
  AND code IN ('RNVS', 'RNVN', 'MBLD', 'FENC', 'ROOF')
ORDER BY constrval DESC 
LIMIT 300;

-- Geographic filtering (handled in application)
-- Distance calculations using Haversine formula
-- Lead scoring computed in real-time
```

### **Performance Considerations**
- **Indexes**: On `code`, `constrval`, `issuedate`
- **JSON parsing**: Efficient extraction of GPS coordinates
- **Caching**: Application-level caching for frequently accessed data
- **Pagination**: Limits results to prevent overwhelming UI

## 🎯 Lead Identification Logic

### **Relevance Filtering**
```javascript
// Orleans Steel relevant permit codes
const RELEVANT_CODES = {
  'FENC': { priority: 'high', category: 'Fencing & Gates' },
  'ROOF': { priority: 'medium', category: 'Metal Roofing' },
  'RNVS': { priority: 'high', category: 'Structural Steel' },
  'RNVN': { priority: 'high', category: 'General Construction' },
  'MBLD': { priority: 'high', category: 'Structural Steel' },
  'NEWC': { priority: 'high', category: 'Structural Steel' },
  'DEMO': { priority: 'medium', category: 'Opportunity' }
}
```

### **Geographic Filtering**
```javascript
// Distance calculation from Orleans Steel
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth radius in miles
  // Haversine formula implementation
  return distance_in_miles;
}
```

### **Lead Scoring**
```javascript
function calculateLeadScore(permit) {
  let score = 0;
  
  // Base score from construction value (0-30 points)
  score += Math.min(permit.constrval / 10000, 30);
  
  // Permit type relevance (0-40 points)
  // Distance bonus (5-25 points)  
  // Category bonuses (10-20 points)
  // High-value bonuses (10-25 points)
  
  return Math.round(score);
}
```

## 🔄 Data Management

### **Data Freshness**
- **Current Data**: Last 3-6 months of permits
- **Update Schedule**: Weekly/bi-weekly refresh
- **Data Validation**: Automated checks for GPS coordinates and required fields
- **Archive Strategy**: Older permits moved to archive table

### **Data Quality Assurance**
- **GPS Validation**: All permits must have valid coordinates
- **Value Validation**: Construction values must be reasonable ($1k-$10M range)
- **Address Standardization**: Consistent address formatting
- **Duplicate Detection**: Prevention of duplicate permit entries

### **Backup and Recovery**
- **Automated Backups**: Daily Supabase backups
- **Point-in-Time Recovery**: Can restore to any point in last 7 days
- **Data Export**: Regular exports for external analysis
- **Disaster Recovery**: Multi-region backup strategy

## 📊 Analytics and Reporting

### **Available Metrics**
- **Lead Volume**: New permits by week/month
- **Geographic Distribution**: Heat maps of permit activity
- **Value Distribution**: Construction value analysis
- **Permit Type Trends**: Popular project types over time
- **Conversion Tracking**: Which leads become customers

### **Dashboard Queries**
```sql
-- Weekly lead summary
SELECT 
  DATE_TRUNC('week', issuedate) as week,
  COUNT(*) as total_permits,
  SUM(CASE WHEN code IN ('RNVS','FENC','ROOF') THEN 1 ELSE 0 END) as relevant_permits,
  AVG(constrval) as avg_value
FROM permit_leads 
WHERE issuedate >= NOW() - INTERVAL '3 months'
GROUP BY week
ORDER BY week DESC;
```

## 🚀 Future Enhancements

### **Planned Improvements**
- **Real-time Updates**: Live permit feed integration
- **Historical Analysis**: Trend analysis and forecasting
- **Contractor Intelligence**: Track contractor permit history
- **Competitive Analysis**: Monitor competitor project involvement
- **API Integration**: Direct city permit system integration

### **Scalability Considerations**
- **Horizontal Scaling**: Supabase auto-scaling
- **Caching Layer**: Redis for frequently accessed data
- **CDN Integration**: Global content delivery
- **Load Balancing**: Multi-region deployment capability

This database foundation provides Orleans Steel with a robust, scalable platform for systematic lead generation and business intelligence.