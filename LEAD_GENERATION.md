# Lead Generation System Documentation

## 🎯 Lead Scoring Algorithm

The system uses an intelligent scoring algorithm to prioritize construction permit leads based on their potential value to Orleans Steel. Leads are scored from 0-120+ points, with higher scores indicating better opportunities.

## 📊 Scoring Components

### **1. Base Construction Value (0-30 points)**
```
Score = min(Construction Value / $10,000, 30)
```
- **$10k project** = 1 point
- **$100k project** = 10 points  
- **$300k+ project** = 30 points (maximum)

*Rationale: Higher construction values typically mean larger steel orders and better profit margins.*

### **2. Permit Type Relevance (0-40 points)**

**HIGH PRIORITY (40 points)**:
- **FENC** - Fencing/Gates (direct product match)
- **MBLD** - Major Building (structural steel needed)
- **RNVS** - Structural Renovation (steel reinforcement)
- **RNVN** - Non-Structural Renovation (roofing/siding potential)
- **ADDN** - Building Addition (framing required)
- **NEWC** - New Commercial (steel construction)

**MEDIUM PRIORITY (25 points)**:
- **ROOF** - Roofing (metal panels/trim)
- **DEMO** - Demolition (often leads to rebuilding)
- **RERR** - Re-roofing (metal roof replacement)

**LOW PRIORITY (10 points)**:
- **HVAC** - HVAC work (equipment supports needed)
- **MECH** - Mechanical (steel platforms/supports)

### **3. Product Category Bonuses**

**Fencing & Gates**: +20 points (direct sales opportunity)  
**Metal Roofing**: +15 points (growing market segment)  
**Structural Steel**: +15 points (core business strength)

### **4. High-Value Project Bonuses**
- **$50k+**: +10 points
- **$100k+**: +15 points  
- **$250k+**: +20 points
- **$500k+**: +25 points

*Rationale: Large projects justify sales effort and often lead to ongoing relationships.*

### **5. Distance Scoring (5-25 points)**

Distance from Orleans Steel (1641 Poland Ave):
- **≤ 5 miles**: +25 points (excellent for delivery)
- **6-10 miles**: +20 points (good delivery efficiency)  
- **11-15 miles**: +15 points (moderate delivery cost)
- **16-25 miles**: +10 points (acceptable range)
- **26-35 miles**: +5 points (far but manageable)

*Rationale: Closer projects have lower delivery costs and faster response times.*

## 🏆 Lead Categories & Expected Scores

### **🔥 Hot Leads (80+ points)**
- Large structural projects nearby
- High-value fencing/roofing projects
- Major renovations within 10 miles
- **Example**: $500k structural renovation, 3 miles away = 95 points

### **🎯 Warm Leads (50-79 points)**  
- Medium-value relevant projects
- Smaller structural work
- Metal roofing projects
- **Example**: $150k roofing project, 8 miles away = 65 points

### **📋 Cold Leads (20-49 points)**
- Lower-value projects
- Less relevant permit types
- Distant locations
- **Example**: $25k HVAC project, 20 miles away = 28 points

### **❄️ Poor Leads (<20 points)**
- Very small projects
- Irrelevant permit types  
- Very distant locations

## 🗺️ Geographic Targeting

**Orleans Steel Location**: 1641 Poland Ave, New Orleans, LA 70117

**Service Radius Recommendations**:
- **Primary Zone (≤10 miles)**: Daily delivery capability
- **Secondary Zone (11-25 miles)**: Regular delivery routes
- **Extended Zone (26-50 miles)**: Special delivery for large orders

## 📈 Lead Prioritization Strategy

### **Immediate Action (90+ points)**
1. Call within 24 hours
2. Site visit if appropriate
3. Custom quote preparation
4. Relationship building with contractor

### **Short-term Follow-up (60-89 points)**
1. Call within 48-72 hours
2. Email product information
3. Add to CRM pipeline
4. Monitor project progress

### **Long-term Nurturing (30-59 points)**
1. Add to monthly newsletter
2. Periodic check-ins
3. Seasonal product promotions
4. Future opportunity tracking

### **Low Priority (<30 points)**
1. Bulk email campaigns
2. Quarterly follow-up
3. General marketing materials

## 🎯 Product-Specific Lead Qualification

### **Fencing Projects (FENC)**
**Questions to Ask**:
- Fence type and material preference?
- Linear footage required?
- Gate requirements?
- Timeline for completion?
- Decision maker contact?

**Orleans Steel Advantages**:
- Custom ornamental ironwork
- Standard security fencing
- Gate automation capabilities
- Local fabrication = faster delivery

### **Roofing Projects (ROOF)**
**Questions to Ask**:
- Building square footage?
- Current roofing material?
- Preferred metal panel profile?
- Color requirements?
- Timeline and weather considerations?

**Orleans Steel Advantages**:
- R-panels in stock
- Complete trim package
- Color-matched accessories
- Technical support

### **Structural Projects (MBLD, RNVS, ADDN)**
**Questions to Ask**:
- Structural engineer involved?
- Steel specifications available?
- Project timeline?
- General contractor name?
- Budget range?

**Orleans Steel Advantages**:
- Custom fabrication capability
- Engineering support
- Quick turnaround
- Quality certifications

## 📊 Success Metrics

**Lead Quality Indicators**:
- **Conversion Rate**: % of leads that become customers
- **Average Order Value**: Revenue per converted lead
- **Time to Close**: Days from lead to first order
- **Customer Lifetime Value**: Long-term relationship value

**System Performance**:
- **Lead Volume**: New qualified leads per week
- **Geographic Coverage**: Leads across service area
- **Score Accuracy**: High-scoring leads convert better
- **Response Time**: Speed of initial contact

## 🔄 Continuous Improvement

**Monthly Reviews**:
- Analyze conversion rates by lead score
- Review geographic distribution
- Update scoring weights based on results
- Identify new relevant permit types

**Quarterly Updates**:
- Expand permit code coverage
- Refine distance calculations
- Update construction value thresholds
- Add seasonal adjustments

This lead generation system transforms Orleans Steel from reactive order-taking to proactive business development, systematically identifying the best opportunities and prioritizing sales efforts for maximum ROI.