<h1 align="center"> Career & Business Intelligence Suite - MCP Server</h1>

<p align="center">
  <img src="puch_ai_banner.jpeg" alt="Banner image" width="500"/>
</p>

A powerful Model Context Protocol (MCP) server that provides AI-powered career and business intelligence tools for Puch AI.

## 🚀 Features

### Career Tools
- **Job Market Analyzer** - Real-time job market trends and opportunities
- **Resume Optimizer** - ATS-friendly resume creation and optimization
- **Salary Negotiator** - Market-based salary insights and negotiation strategies
- **Skill Gap Analyzer** - Personalized learning recommendations

### Business Tools
- **Business Opportunity Finder** - Market gap analysis and business opportunities

## 🛠️ Tech Stack

- **Python 3.11+**
- **FastMCP** - MCP server framework
- **Pydantic** - Data validation
- **HTTPX** - HTTP client
- **Python-dotenv** - Environment management

## 📋 Requirements

- Python 3.11 or higher
- Bearer token authentication (required by Puch AI)
- HTTPS deployment (required for production)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd puch-ai-hackathon
```

### 2. Set Up Environment
Create a `.env` file in the project root:
```env
AUTH_TOKEN=your_secret_token_here
MY_NUMBER=919101284785
```

### 3. Install Dependencies
```bash
pip install fastmcp httpx python-dotenv pydantic
```

### 4. Run the Server
```bash
cd mcp-bearer-token
python career_business_mcp.py
```

The server will start on `http://0.0.0.0:8086`

## 🔗 Connect to Puch AI

1. Deploy the server to a cloud platform (Render, Railway, etc.)
2. Get your public HTTPS URL
3. Connect using Puch AI:
```
/mcp connect https://your-deployed-url.com/mcp your_secret_token_here
```

## 🛠️ Available Tools

### 1. Job Market Analyzer
Analyzes real-time job market trends and opportunities.
- **Input:** Job title, location, industry
- **Output:** Market analysis, salary insights, trends

### 2. Resume Optimizer
Creates ATS-friendly resumes optimized for job applications.
- **Input:** Current resume, target job, experience
- **Output:** Optimized resume with ATS tips

### 3. Business Opportunity Finder
Identifies market gaps and business opportunities.
- **Input:** Industry, location, investment range
- **Output:** Market analysis and opportunity recommendations

### 4. Salary Negotiator
Provides market-based salary insights and negotiation strategies.
- **Input:** Job title, experience, location
- **Output:** Salary ranges and negotiation scripts

### 5. Skill Gap Analyzer
Analyzes skill gaps and provides personalized learning recommendations.
- **Input:** Current role, target role, skills, experience
- **Output:** Skill gap analysis and learning plan

## 🚀 Deployment

### Render (Recommended)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `cd mcp-bearer-token && python career_business_mcp.py`
5. Add environment variables in Render dashboard

### Railway
1. Connect your GitHub repository to Railway
2. Railway will auto-detect Python and deploy
3. Add environment variables in Railway dashboard

### Other Platforms
- **Heroku** - Use Procfile and requirements.txt
- **DigitalOcean App Platform** - Similar to Render setup

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH_TOKEN` | Secret token for authentication | `puch_hackathon_2025_jyotish` |
| `MY_NUMBER` | Phone number in format {country_code}{number} | `919101284785` |

## 📝 API Endpoints

- **MCP Endpoint:** `/mcp/` - Main MCP protocol endpoint
- **Health Check:** Available through MCP protocol

## 🤝 Contributing

This project was built for the Puch AI Hackathon. Feel free to fork and extend!

## 📄 License

This project is licensed under the Apache 2.0 License.

## 🏆 Hackathon Project

Built for **Puch AI Hackathon** - "What's the coolest way you can build with AI?"

**Team:** Jyotishman Das and Suvadip Chakraborty
**Project:** Career & Business Intelligence Suite
**Hashtag:** #BuildWithPuch

---

