import express from 'express';
import cors from 'cors';
import { createRateLimiter } from './lib/rateLimit';
import { logger } from './lib/logger';
import { postWizard } from './tools/postWizard';
import { tldrActions } from './tools/tldrActions';
import { postWizardSchema, tldrActionsSchema, analyticsSchema } from './lib/schema';
import type { AnalyticsData } from './lib/schema';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(createRateLimiter());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Analytics tracking endpoint
app.post('/track', async (req, res) => {
  try {
    const data = analyticsSchema.parse(req.body);
    logger.info('Analytics event', data);
    res.json({ success: true });
  } catch (error) {
    logger.error('Invalid analytics data', { error: String(error) });
    res.status(400).json({ error: 'Invalid analytics data' });
  }
});

// MCP SSE endpoint
app.get('/mcp', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  // Send initial connection message
  res.write('data: {"type": "connection", "message": "MCP Server connected"}\n\n');

  // Heartbeat every 30 seconds
  const heartbeat = setInterval(() => {
    res.write('data: {"type": "heartbeat", "timestamp": "' + new Date().toISOString() + '"}\n\n');
  }, 30000);

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    logger.info('Client disconnected from MCP stream');
  });
});

// Tool registry
const tools = {
  post_wizard: {
    description: 'Generate viral social media posts with hooks, content, and CTAs',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'The main topic or subject for the post',
        },
        tone: {
          type: 'string',
          enum: ['professional', 'casual', 'fun'],
          description: 'The tone of the post',
        },
        hashtags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional hashtags to include',
        },
      },
      required: ['topic', 'tone'],
    },
  },
  tldr_actions: {
    description: 'Summarize content and extract actionable items from transcripts',
    inputSchema: {
      type: 'object',
      properties: {
        transcript: {
          type: 'string',
          description: 'The transcript or content to analyze',
        },
      },
      required: ['transcript'],
    },
  },
};

// Tool call endpoint
app.post('/tools/call', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;
    
    switch (name) {
      case 'post_wizard': {
        const validatedArgs = postWizardSchema.parse(args);
        const result = await postWizard(validatedArgs);
        
        // Track analytics
        await trackAnalytics('post_wizard', true);
        
        res.json({
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        });
        break;
      }
      
      case 'tldr_actions': {
        const validatedArgs = tldrActionsSchema.parse(args);
        const result = await tldrActions(validatedArgs);
        
        // Track analytics
        await trackAnalytics('tldr_actions', true);
        
        res.json({
          content: [
            {
              type: 'text',
              text: `## Summary\n\n${result.summary}\n\n## Action Items\n\n${result.action_items.map(item => `- ${item}`).join('\n')}`,
            },
          ],
        });
        break;
      }
      
      default:
        res.status(400).json({ error: `Unknown tool: ${name}` });
    }
  } catch (error) {
    logger.error(`Tool call failed: ${req.body?.name}`, { error: String(error), args: req.body?.arguments });
    await trackAnalytics(req.body?.name || 'unknown', false, String(error));
    res.status(500).json({ error: String(error) });
  }
});

// Tool list endpoint
app.get('/tools/list', (_req, res) => {
  res.json({
    tools: Object.entries(tools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  });
});

// Analytics tracking function
async function trackAnalytics(tool: string, success: boolean, error?: string) {
  try {
    const data: AnalyticsData = {
      tool,
      success,
      error,
    };
    
    // In production, you might want to send this to an analytics service
    logger.info('Tool usage tracked', data);
  } catch (err) {
    logger.error('Failed to track analytics', { error: String(err) });
  }
}

// Start Express server
app.listen(PORT, () => {
  logger.info(`Express server running on port ${PORT}`);
  logger.info('MCP Server started! Ready for Puch AI Hackathon! 🚀');
}); 