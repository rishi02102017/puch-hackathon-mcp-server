# Puch AI Hackathon MCP Server

🚀 **Production-ready MCP server for the Puch AI Hackathon**

A TypeScript-based Model Context Protocol (MCP) server that provides two powerful tools for content creation and analysis. Built with production-grade practices including validation, rate limiting, observability, and comprehensive testing.

## 🎯 What We're Building

**Content Optimization MCP Server** with two viral tools:

1. **Post Wizard** (`post_wizard`) - Generate viral social media posts with hooks, content, and CTAs
2. **TLDR Actions** (`tldr_actions`) - Summarize content and extract actionable items from transcripts

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **MCP SDK**: @modelcontextprotocol/sdk
- **Validation**: Zod
- **Testing**: Vitest
- **Linting**: ESLint + Prettier
- **Deployment**: Vercel
- **HTTP Client**: Undici

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Testing
```bash
npm test
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

## 📦 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Your server will be available at:**
   ```
   https://your-project-name.vercel.app
   ```

### Alternative Deployments

- **Railway**: Connect your GitHub repo
- **Render**: Deploy as a web service
- **Heroku**: Push to Heroku
- **Cloudflare Workers**: Convert to worker format

## 🔧 API Endpoints

### Health Check
```bash
curl https://your-deploy-url.vercel.app/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "version": "1.0.0"
}
```

### MCP Stream
```bash
curl -N https://your-deploy-url.vercel.app/mcp
```

Example event stream:
```
data: {"type": "connection", "message": "MCP Server connected"}

data: {"type": "heartbeat", "timestamp": "2024-01-01T00:00:30.000Z"}
```

### Analytics Tracking
```bash
curl -X POST https://your-deploy-url.vercel.app/track \
  -H "Content-Type: application/json" \
  -d '{"tool": "post_wizard", "success": true, "duration": 1500}'
```

## 🎯 Hackathon Submission

### Step 1: Deploy Your Server
1. Deploy to Vercel using the instructions above
2. Note your deployment URL: `https://your-project-name.vercel.app`

### Step 2: Register for Hackathon
```bash
/hackathon
```
This will show your status and register you if needed.

### Step 3: Create or Join Team
```bash
# Create a new team
/hackathon create <team_name>

# Or join existing team
/hackathon join <team_code>
```

### Step 4: Submit Your MCP Server
```bash
/hackathon submission add <server_id> https://github.com/yourusername/your-repo
```

Replace:
- `<server_id>` with your unique server identifier
- `https://github.com/yourusername/your-repo` with your GitHub repository URL

### Step 5: Share Your Tool
```bash
# In Puch AI
/mcp use <server_id>

# Or share the direct link
https://puch.ai/mcp/<server_id>
```

## 🛠️ Tool Usage Examples

### Post Wizard Tool

**Input:**
```json
{
  "topic": "artificial intelligence",
  "tone": "professional",
  "hashtags": ["AI", "Innovation"]
}
```

**Output:**
```
🚀 The future of artificial intelligence is here, and it's changing everything.

The key insight? artificial intelligence isn't just about efficiency—it's about transformation. When you understand the underlying principles, you unlock possibilities that seemed impossible before.

What's your experience with this? I'd love to hear your thoughts in the comments.

#artificialintelligence #AI #Innovation #Innovation #Leadership #Strategy #Growth #FutureOfWork
```

### TLDR Actions Tool

**Input:**
```json
{
  "transcript": "We need to implement the new feature by next week. The team should review the requirements and create a timeline. We will need to test the implementation thoroughly."
}
```

**Output:**
```
## Summary

Key topics discussed: implement, feature, team, review, requirements, timeline, test, implementation. We need to implement the new feature by next week. The discussion covered 3 main points and identified several actionable next steps.

## Action Items

- Action: We need to implement the new feature by next week.
- Action: The team should review the requirements and create a timeline.
- Action: We will need to test the implementation thoroughly.
```

## 🏗️ Project Structure

```
/
├── src/
│   ├── server.ts          # Main server with MCP SSE implementation
│   ├── tools/
│   │   ├── postWizard.ts  # Post generation tool
│   │   └── tldrActions.ts # Content analysis tool
│   └── lib/
│       ├── schema.ts      # Zod validation schemas
│       ├── logger.ts      # Observability and timing
│       └── rateLimit.ts   # Rate limiting utility
├── tests/
│   └── tools.test.ts      # Comprehensive unit tests
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

## 🔍 Features

### Production-Ready
- ✅ TypeScript with strict type checking
- ✅ Zod schema validation
- ✅ Rate limiting (30 req/min per IP)
- ✅ Comprehensive error handling
- ✅ Request logging and timing
- ✅ Health check endpoint
- ✅ Analytics tracking

### MCP Compliance
- ✅ Streamable HTTP (SSE) at `/mcp`
- ✅ Tool registry with JSON schemas
- ✅ Structured tool results
- ✅ Heartbeat mechanism
- ✅ Proper error responses

### Testing
- ✅ Unit tests for all tools
- ✅ Schema validation tests
- ✅ Golden file snapshots
- ✅ Vitest test runner

## 🚀 Phase 2: Viral Growth Strategy

### Content Marketing
- Share your tool on LinkedIn/Twitter with #BuildWithPuch
- Create demo videos showing the tools in action
- Write blog posts about the problems your tools solve

### Community Engagement
- Share in relevant Discord/Slack communities
- Post on Reddit (r/artificial, r/MachineLearning)
- Engage with other hackathon participants

### User Acquisition
- Create simple landing page explaining the tools
- Offer free demos to potential users
- Collect feedback and iterate quickly

## 🏆 Judging Criteria

Your project will be judged on:
- **Traction**: How many people actually use your tool
- **Virality**: How well it spreads and gets adopted
- **Real-world value**: Does it solve a real problem?

## 🎁 Prizes

- **1st Place**: $25k + OpenAI Credits
- **2nd Place**: $15k + OpenAI Credits
- **3rd Place**: $10k + OpenAI Credits

## 🔗 Useful Links

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Puch AI Platform](https://puch.ai/)
- [Hackathon Rules](https://puch.ai/hackathon)
- [Vercel Documentation](https://vercel.com/docs)

## 🚨 Troubleshooting

### CORS Issues
- The server includes CORS headers for cross-origin requests
- If you encounter issues, check the browser console for specific errors

### SSE Connection Issues
- Ensure your deployment supports Server-Sent Events
- Check that proxies don't buffer the stream
- Verify the `/mcp` endpoint returns `text/event-stream`

### Cold Starts
- Vercel functions may have cold starts
- Consider using edge functions for better performance
- Monitor function execution times

### Rate Limiting
- Default limit: 30 requests per minute per IP
- Check response headers for rate limit info
- Implement exponential backoff in your client

## 📊 Analytics

The server tracks tool usage automatically. You can monitor:
- Tool call frequency
- Success/failure rates
- Response times
- Error patterns

## 🎯 Success Tips

1. **Focus on real problems** - Build something people actually need
2. **Make it viral** - Easy to share and adopt
3. **Test with users** - Get feedback early and often
4. **Document well** - Clear instructions for users
5. **Deploy early** - Get it live and start tracking usage
6. **Iterate quickly** - Use analytics to improve

---

**Good luck with your hackathon project! 🚀**

Remember: The goal is to build something people would actually want to use. Focus on solving real problems and making it easy for others to adopt your tool. 