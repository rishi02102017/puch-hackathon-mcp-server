 <h1 align="center"> Content Optimizer MCP Server</h1>

<p align="center">
  <img src="puch_ai_banner.jpeg" alt="Banner image" width="500"/>
</p>

🚀 **GenZ's MCP Server for the Puch AI Hackathon**

A powerful content optimization tool that helps creators, marketers, and professionals generate viral social media posts and extract actionable insights from meetings. Built with TypeScript and deployed on Vercel.

## 👥 Team GenZ

**Team Members:**
- **Suvadip Chakraborty** 
- **Jyotishman Das** 

## 🎯 What We Built

Two tools that solve real problems people face every day:

### 1. Post Wizard
Generate viral social media posts with hooks, content, and CTAs. Perfect for:
- Content creators who need engaging posts
- Marketers who want higher engagement
- Professionals who want to build their personal brand

### 2. TLDR Actions
Summarize meetings and extract actionable items. Great for:
- Project managers who need meeting summaries
- Teams who want to track action items
- Professionals who attend lots of meetings

## 🛠️ Tech Stack

- **TypeScript** - Type safety and better development experience
- **Vercel** - Serverless deployment for global performance
- **Express.js** - Fast and reliable API framework
- **Zod** - Runtime type validation
- **Vitest** - Fast unit testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🧪 Test Your Server

Our server is live at: `https://puch-hackathon-mcp-server-hi6w.vercel.app`

### Health Check
```bash
curl https://puch-hackathon-mcp-server-hi6w.vercel.app/health
```

### Test Post Wizard
```bash
curl -X POST https://puch-hackathon-mcp-server-hi6w.vercel.app/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "post_wizard", "arguments": {"topic": "AI", "tone": "professional"}}'
```

### Test TLDR Actions
```bash
curl -X POST https://puch-hackathon-mcp-server-hi6w.vercel.app/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "tldr_actions", "arguments": {"transcript": "We need to implement the new feature by next week."}}'
```

## 🎯 Hackathon Submission

### Submit to Leaderboard
```bash
/hackathon submission add content-optimizer https://github.com/rishi02102017/puch-hackathon-mcp-server
```

### Use Your Tool
```bash
/mcp use content-optimizer
```

### Share with Others
```
https://puch.ai/mcp/content-optimizer
```

## 💡 Our Approach

We focused on building something people actually need:
- **Content creation** is a daily struggle for creators and marketers
- **Meeting summaries** are time-consuming but essential for teams
- **Simple, focused tools** that do one thing really well

The goal was to create tools that we'd want to use ourselves, and that others would find genuinely helpful.

## 📊 Project Structure

```
/
├── api/
│   └── index.ts              # Vercel serverless function
├── src/
│   ├── tools/
│   │   ├── postWizard.ts     # Post generation tool
│   │   └── tldrActions.ts    # Content analysis tool
│   └── lib/
│       ├── schema.ts         # Zod validation schemas
│       ├── logger.ts         # Logging and timing utilities
│       └── rateLimit.ts      # Rate limiting middleware
├── tests/
│   ├── tools.test.ts         # Unit tests for tools
│   └── __snapshots__/        # Test snapshots
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vercel.json              # Vercel deployment config
├── .eslintrc.cjs            # ESLint configuration
├── .prettierrc              # Prettier configuration
└── README.md                # This file
```

## 🚨 Troubleshooting

**If you get a "Not found" error:**
- Make sure you're using the correct endpoints (`/health`, `/tools/call`, etc.)
- The root URL (`/`) returns "Not found" by design

**If the server crashes:**
- Check that all dependencies are installed
- Ensure TypeScript is compiled correctly
- Verify the Vercel deployment is successful

## 🎉 Next Steps

Once submitted, we'll focus on:
- Getting feedback from real users
- Improving the tools based on usage
- Making it easier for others to discover and use

---

**Built with ❤️ by Team GenZ for the Puch AI Hackathon** 
