import { VercelRequest, VercelResponse } from '@vercel/node';
import { postWizard } from '../src/tools/postWizard';
import { tldrActions } from '../src/tools/tldrActions';
import { postWizardSchema, tldrActionsSchema, analyticsSchema } from '../src/lib/schema';
import { logger } from '../src/lib/logger';
import type { AnalyticsData } from '../src/lib/schema';

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

// Analytics tracking function
async function trackAnalytics(tool: string, success: boolean, error?: string) {
  try {
    const data: AnalyticsData = {
      tool,
      success,
      error,
    };
    
    logger.info('Tool usage tracked', data);
  } catch (err) {
    logger.error('Failed to track analytics', { error: String(err) });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);

  try {
    switch (pathname) {
      case '/health':
        res.json({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          version: '1.0.0'
        });
        break;

      case '/track':
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }
        try {
          const data = analyticsSchema.parse(req.body);
          logger.info('Analytics event', data);
          res.json({ success: true });
        } catch (error) {
          logger.error('Invalid analytics data', { error: String(error) });
          res.status(400).json({ error: 'Invalid analytics data' });
        }
        break;

      case '/mcp':
        if (req.method !== 'GET') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        });
        res.write('data: {"type": "connection", "message": "MCP Server connected"}\n\n');
        res.write('data: {"type": "heartbeat", "timestamp": "' + new Date().toISOString() + '"}\n\n');
        res.end();
        break;

      case '/tools/call':
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }
        const { name, arguments: args } = req.body;
        
        switch (name) {
          case 'post_wizard': {
            const validatedArgs = postWizardSchema.parse(args);
            const result = await postWizard(validatedArgs);
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
        break;

      case '/tools/list':
        if (req.method !== 'GET') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }
        res.json({
          tools: Object.entries(tools).map(([name, tool]) => ({
            name,
            description: tool.description,
            inputSchema: tool.inputSchema,
          })),
        });
        break;

      default:
        res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    logger.error('Request failed', { error: String(error), pathname });
    res.status(500).json({ error: 'Internal server error' });
  }
} 