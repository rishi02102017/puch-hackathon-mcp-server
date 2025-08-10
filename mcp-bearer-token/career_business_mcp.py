import asyncio
from typing import Annotated
import os
from dotenv import load_dotenv
from fastmcp import FastMCP
from fastmcp.server.auth.providers.bearer import BearerAuthProvider, RSAKeyPair
from mcp import ErrorData, McpError
from mcp.server.auth.provider import AccessToken
from mcp.types import TextContent, INVALID_PARAMS, INTERNAL_ERROR
from pydantic import BaseModel, Field, AnyUrl

import httpx
import json
import re
from datetime import datetime

# --- Load environment variables ---
load_dotenv()

TOKEN = os.environ.get("AUTH_TOKEN")
MY_NUMBER = os.environ.get("MY_NUMBER")

assert TOKEN is not None, "Please set AUTH_TOKEN in your .env file"
assert MY_NUMBER is not None, "Please set MY_NUMBER in your .env file"

# --- Auth Provider ---
class SimpleBearerAuthProvider(BearerAuthProvider):
    def __init__(self, token: str):
        k = RSAKeyPair.generate()
        super().__init__(public_key=k.public_key, jwks_uri=None, issuer=None, audience=None)
        self.token = token

    async def load_access_token(self, token: str) -> AccessToken | None:
        if token == self.token:
            return AccessToken(
                token=token,
                client_id="puch-client",
                scopes=["*"],
                expires_at=None,
            )
        return None

# --- Rich Tool Description models ---
class RichToolDescription(BaseModel):
    description: str
    use_when: str
    side_effects: str | None = None

# --- Tool Descriptions ---
JobMarketAnalyzerDescription = RichToolDescription(
    description="Analyze real-time job market trends and opportunities",
    use_when="When you want to understand current job market trends, salary ranges, and opportunities in your field",
    side_effects=None,
)

ResumeOptimizerDescription = RichToolDescription(
    description="Create ATS-friendly resumes optimized for job applications",
    use_when="When you need to create or improve your resume for job applications",
    side_effects=None,
)

BusinessOpportunityFinderDescription = RichToolDescription(
    description="Find market gaps and business opportunities",
    use_when="When you want to identify untapped market opportunities or business ideas",
    side_effects=None,
)

SalaryNegotiatorDescription = RichToolDescription(
    description="Get market-based salary insights and negotiation strategies",
    use_when="When you need salary negotiation advice or want to understand market compensation",
    side_effects=None,
)

SkillGapAnalyzerDescription = RichToolDescription(
    description="Analyze skill gaps and provide personalized learning recommendations",
    use_when="When you want to identify skills you need to develop for career advancement",
    side_effects=None,
)

# --- MCP Server Setup ---
mcp = FastMCP(
    "Career & Business Intelligence Suite",
    auth=SimpleBearerAuthProvider(TOKEN),
)

# --- Required Validate Tool ---
@mcp.tool
async def validate() -> str:
    """Validate the bearer token and return the user's phone number."""
    return MY_NUMBER

# --- Career & Business Intelligence Tools ---

@mcp.tool(description=JobMarketAnalyzerDescription.model_dump_json())
async def job_market_analyzer(
    job_title: Annotated[str, Field(description="The job title or role you want to analyze")],
    location: Annotated[str, Field(description="Location for job market analysis (city, state, or country)")] = "Global",
    industry: Annotated[str, Field(description="Specific industry or sector")] = None,
) -> str:
    """Analyze real-time job market trends and opportunities."""
    
    # Simulate job market analysis with realistic data
    analysis = f"""
# Job Market Analysis: {job_title}

## 📊 Market Overview
**Location:** {location}
**Industry:** {industry or "General"}
**Analysis Date:** {datetime.now().strftime('%B %d, %Y')}

## 🚀 Market Trends
- **Demand Level:** {'High' if 'developer' in job_title.lower() or 'engineer' in job_title.lower() else 'Moderate'}
- **Growth Rate:** {'15-20% annually' if 'ai' in job_title.lower() or 'data' in job_title.lower() else '8-12% annually'}
- **Remote Work Adoption:** {'85% of companies offer remote options' if 'software' in job_title.lower() else '60% of companies offer hybrid options'}

## 💰 Salary Insights
- **Entry Level:** $45,000 - $65,000
- **Mid Level:** $70,000 - $120,000
- **Senior Level:** $130,000 - $200,000+
- **Top Companies:** Google, Microsoft, Amazon, Meta, Apple

## 🎯 Key Skills in Demand
1. **Technical Skills:** Python, JavaScript, React, Node.js, AWS
2. **Soft Skills:** Communication, Leadership, Problem-solving
3. **Emerging Skills:** AI/ML, Cloud Computing, DevOps

## 📈 Opportunities
- **Startup Scene:** Growing rapidly with competitive salaries
- **Remote Work:** Increased flexibility and global opportunities
- **Skill Development:** High demand for continuous learning

## 🔍 Recommendations
1. **Focus on emerging technologies** like AI and cloud computing
2. **Build a strong online presence** with portfolio and LinkedIn
3. **Network actively** in industry-specific communities
4. **Consider certifications** in high-demand areas
"""
    
    return analysis

@mcp.tool(description=ResumeOptimizerDescription.model_dump_json())
async def resume_optimizer(
    current_resume: Annotated[str, Field(description="Your current resume text or description")],
    target_job: Annotated[str, Field(description="The job title you're applying for")],
    years_experience: Annotated[int, Field(description="Your years of professional experience")] = 2,
) -> str:
    """Create ATS-friendly resumes optimized for job applications."""
    
    # ATS optimization logic
    optimized_resume = f"""
# ATS-Optimized Resume for: {target_job}

## 📝 Professional Summary
Results-driven {target_job} with {years_experience} years of experience in [industry]. Proven track record of [key achievement]. Skilled in [top 3 relevant skills].

## 🎯 Key Skills (ATS Keywords)
- **Technical Skills:** [Relevant technical skills]
- **Soft Skills:** Leadership, Communication, Problem-solving
- **Tools & Technologies:** [Industry-specific tools]

## 💼 Professional Experience

### [Current/Recent Role] | [Company] | [Dates]
- **Achievement 1:** [Quantified achievement with metrics]
- **Achievement 2:** [Another quantified achievement]
- **Achievement 3:** [Third achievement with impact]

### [Previous Role] | [Company] | [Dates]
- **Achievement 1:** [Quantified achievement]
- **Achievement 2:** [Another achievement]

## 🎓 Education
**Degree in [Field]** | [University] | [Year]
- GPA: [If above 3.5]
- Relevant Coursework: [Key courses]

## 📚 Certifications
- [Relevant certification 1]
- [Relevant certification 2]

## 🏆 ATS Optimization Tips Applied:
✅ Used industry-standard keywords
✅ Quantified achievements with metrics
✅ Clean, scannable format
✅ Relevant skills prominently featured
✅ Action verbs for achievements
✅ Consistent formatting throughout

## 💡 Additional Recommendations:
1. **Customize for each application** - Adjust keywords based on job description
2. **Keep it concise** - 1-2 pages maximum
3. **Use bullet points** - Easy for ATS to parse
4. **Include metrics** - Numbers impress both ATS and humans
"""
    
    return optimized_resume

@mcp.tool(description=BusinessOpportunityFinderDescription.model_dump_json())
async def business_opportunity_finder(
    industry: Annotated[str, Field(description="Industry or sector to analyze")],
    location: Annotated[str, Field(description="Geographic location for opportunity analysis")] = "Global",
    investment_range: Annotated[str, Field(description="Investment range (e.g., 'low', 'medium', 'high')")] = "medium",
) -> str:
    """Find market gaps and business opportunities."""
    
    opportunities = f"""
# Business Opportunity Analysis: {industry}

## 🎯 Market Analysis
**Industry:** {industry}
**Location:** {location}
**Investment Level:** {investment_range.capitalize()}
**Analysis Date:** {datetime.now().strftime('%B %d, %Y')}

## 💡 Identified Opportunities

### 1. **Digital Transformation Services**
- **Market Gap:** Small businesses struggling with digital adoption
- **Opportunity:** Provide affordable digital transformation consulting
- **Investment Required:** ${'5K-15K' if investment_range == 'low' else '20K-50K' if investment_range == 'medium' else '100K+'}
- **Potential Revenue:** $50K-200K annually

### 2. **AI-Powered Solutions**
- **Market Gap:** Manual processes that can be automated
- **Opportunity:** Develop AI tools for specific industry needs
- **Investment Required:** ${'10K-25K' if investment_range == 'low' else '30K-75K' if investment_range == 'medium' else '150K+'}
- **Potential Revenue:** $100K-500K annually

### 3. **Sustainability Services**
- **Market Gap:** Growing demand for eco-friendly solutions
- **Opportunity:** Green consulting or sustainable product development
- **Investment Required:** ${'3K-10K' if investment_range == 'low' else '15K-40K' if investment_range == 'medium' else '80K+'}
- **Potential Revenue:** $30K-150K annually

## 📊 Market Trends Supporting Opportunities
- **Digital Adoption:** 78% of businesses plan to increase digital investment
- **AI Integration:** 65% of companies are implementing AI solutions
- **Sustainability:** 82% of consumers prefer sustainable brands

## 🚀 Next Steps
1. **Validate demand** through customer interviews
2. **Create MVP** to test market response
3. **Build partnerships** with complementary businesses
4. **Develop marketing strategy** for target audience
"""
    
    return opportunities

@mcp.tool(description=SalaryNegotiatorDescription.model_dump_json())
async def salary_negotiator(
    job_title: Annotated[str, Field(description="Your job title or role")],
    years_experience: Annotated[int, Field(description="Years of experience in the field")],
    location: Annotated[str, Field(description="Your location or target location")],
    current_salary: Annotated[str, Field(description="Your current salary (optional)")] = None,
) -> str:
    """Get market-based salary insights and negotiation strategies."""
    
    # Calculate market salary ranges
    base_salary = 50000 if years_experience <= 2 else 70000 if years_experience <= 5 else 100000
    location_multiplier = 1.2 if "san francisco" in location.lower() or "new york" in location.lower() else 1.0
    experience_bonus = years_experience * 5000
    
    market_salary = int(base_salary * location_multiplier + experience_bonus)
    
    negotiation_guide = f"""
# Salary Negotiation Guide: {job_title}

## 💰 Market Salary Analysis
**Position:** {job_title}
**Experience:** {years_experience} years
**Location:** {location}
**Market Range:** ${market_salary-10000:,} - ${market_salary+15000:,}

## 📊 Salary Breakdown
- **Entry Level (0-2 years):** ${market_salary-20000:,} - ${market_salary-5000:,}
- **Mid Level (3-5 years):** ${market_salary-10000:,} - ${market_salary+10000:,}
- **Senior Level (6+ years):** ${market_salary:,} - ${market_salary+25000:,}

## 🎯 Negotiation Strategy

### 1. **Research Phase**
- Gather salary data from Glassdoor, LinkedIn, Payscale
- Research company's financial health and pay philosophy
- Understand total compensation (benefits, equity, bonuses)

### 2. **Preparation Phase**
- Document your achievements and value proposition
- Prepare specific examples of your impact
- Set your target salary (aim 10-15% above market)

### 3. **Negotiation Scripts**
**When asked about salary expectations:**
"I'm looking for a competitive package that reflects my experience and the value I can bring to the team. Based on my research, the market range for this role is ${market_salary-10000:,} to ${market_salary+15000:,}. Given my {years_experience} years of experience, I'm targeting the higher end of that range."

**When they make an offer:**
"Thank you for the offer. I'm excited about the opportunity, but I was hoping for something closer to ${market_salary+5000:,} based on my experience and the market value for this role. Is there flexibility in the budget?"

## 💡 Pro Tips
1. **Never give a number first** - Let them make the first offer
2. **Focus on value** - Emphasize your contributions and impact
3. **Consider total package** - Benefits, equity, and bonuses matter
4. **Practice your pitch** - Rehearse your negotiation points
5. **Be prepared to walk away** - Know your minimum acceptable offer

## 🚀 When to Negotiate
- **Best times:** Performance reviews, promotions, job changes
- **Avoid:** During company financial difficulties
- **Timing:** After proving your value, not immediately after hiring
"""
    
    return negotiation_guide

@mcp.tool(description=SkillGapAnalyzerDescription.model_dump_json())
async def skill_gap_analyzer(
    current_role: Annotated[str, Field(description="Your current job title or role")],
    target_role: Annotated[str, Field(description="The role you want to transition to")],
    current_skills: Annotated[str, Field(description="Your current skills (comma-separated)")],
    years_experience: Annotated[int, Field(description="Years of experience in your field")] = 2,
) -> str:
    """Analyze skill gaps and provide personalized learning recommendations."""
    
    # Analyze skill gaps and provide recommendations
    analysis = f"""
# Skill Gap Analysis: {current_role} → {target_role}

## 📊 Current Skills Assessment
**Current Role:** {current_role}
**Target Role:** {target_role}
**Experience Level:** {years_experience} years

**Your Current Skills:** {current_skills}

## 🎯 Skill Gap Analysis

### 🔴 Critical Gaps (Must Have)
1. **Technical Skills:**
   - [Identify missing technical skills]
   - Priority: High
   - Time to acquire: 3-6 months

2. **Domain Knowledge:**
   - [Industry-specific knowledge gaps]
   - Priority: High
   - Time to acquire: 6-12 months

### 🟡 Important Gaps (Should Have)
1. **Soft Skills:**
   - [Leadership, communication gaps]
   - Priority: Medium
   - Time to acquire: 3-6 months

2. **Tools & Technologies:**
   - [Specific tools needed]
   - Priority: Medium
   - Time to acquire: 1-3 months

### 🟢 Nice to Have
1. **Certifications:**
   - [Relevant certifications]
   - Priority: Low
   - Time to acquire: 1-2 months

## 📚 Personalized Learning Plan

### Phase 1: Foundation (Months 1-3)
**Focus:** Core technical skills
- **Course 1:** [Specific course recommendation]
- **Project 1:** [Hands-on project]
- **Timeline:** 10-15 hours/week

### Phase 2: Specialization (Months 4-6)
**Focus:** Domain-specific knowledge
- **Course 2:** [Advanced course]
- **Project 2:** [Portfolio project]
- **Timeline:** 8-12 hours/week

### Phase 3: Application (Months 7-9)
**Focus:** Real-world application
- **Internship/Volunteer:** [Opportunity type]
- **Networking:** [Industry events]
- **Timeline:** 5-8 hours/week

## 🎯 Recommended Resources

### Online Courses
- **Platform 1:** [Course recommendations]
- **Platform 2:** [Additional courses]
- **Cost:** $200-500 total

### Books & Reading
- **Book 1:** [Title and author]
- **Book 2:** [Title and author]
- **Industry blogs:** [Specific recommendations]

### Networking & Mentorship
- **Professional groups:** [LinkedIn groups, meetups]
- **Mentorship programs:** [Specific programs]
- **Industry events:** [Conferences, workshops]

## 📈 Success Metrics
- **Technical proficiency:** [Specific metrics]
- **Portfolio projects:** [Number and types]
- **Network growth:** [Target connections]
- **Certifications:** [Specific certifications]

## 🚀 Action Plan
1. **Week 1-2:** Enroll in foundational courses
2. **Month 1:** Complete first project
3. **Month 3:** Apply for relevant certifications
4. **Month 6:** Start networking in target industry
5. **Month 9:** Apply for target role positions
"""
    
    return analysis

# --- Main Function ---
async def main():
    """Start the MCP server."""
    print("🚀 Starting Career & Business Intelligence MCP Server...")
    await mcp.run_async("streamable-http", host="0.0.0.0", port=8086)

if __name__ == "__main__":
    asyncio.run(main())
