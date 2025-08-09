import { VercelRequest, VercelResponse } from '@vercel/node';

// Authentication configuration  
const AUTH_TOKEN = process.env.AUTH_TOKEN || '4abe737b2ddf71ec5381f29cbd1495ee';
const MY_NUMBER = process.env.MY_NUMBER || '9101284785'; // Your WhatsApp number

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);
  
  // Extract bearer token from Authorization header
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

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

      case '/tools/list':
        res.json({
          tools: [
            {
              name: 'validate',
              description: 'Validate bearer token and return user phone number (required by Puch AI)',
              inputSchema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    description: 'Bearer token for authentication',
                  },
                },
                required: ['token'],
              },
            },
            {
              name: 'post_wizard',
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
            {
              name: 'tldr_actions',
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
          ],
        });
        break;

      case '/tools/call':
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }
        
        const { name, arguments: args } = req.body;
        
        switch (name) {
          case 'validate': {
            const { token } = args;
            
            // Validate the bearer token
            if (token !== AUTH_TOKEN) {
              res.status(401).json({ error: 'Invalid bearer token' });
              return;
            }
            
            // Return the phone number in the required format
            res.json({
              content: [
                {
                  type: 'text',
                  text: MY_NUMBER, // Returns phone number like "919876543210"
                },
              ],
            });
            break;
          }
          
          case 'post_wizard': {
            const { topic, tone, hashtags = [] } = args;
            
            // Simple post generation
            const hooks = {
              professional: `🚀 The future of ${topic} is here, and it's changing everything.`,
              casual: `So I was thinking about ${topic} today... 🤔`,
              fun: `🎉 Plot twist: ${topic} is actually AMAZING!`,
            };
            
            const content = `The key insight? ${topic} isn't just about efficiency—it's about transformation. When you understand the underlying principles, you unlock possibilities that seemed impossible before.`;
            
            const ctas = {
              professional: 'What\'s your experience with this? I\'d love to hear your thoughts in the comments.',
              casual: 'What do you think? Drop a comment below! 👇',
              fun: 'Who else is obsessed with this? 🙋‍♂️',
            };
            
            const finalHashtags = hashtags.length > 0 
              ? hashtags.map((tag: string) => `#${tag.replace(/\s+/g, '')}`).join(' ')
              : `#${topic.replace(/\s+/g, '')} #Innovation #Growth`;
            
            const result = `${hooks[tone]}\n\n${content}\n\n${ctas[tone]}\n\n${finalHashtags}`;
            
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
            const { transcript } = args;
            
            // Simple summary and action items
            const sentences = transcript.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
            const summary = sentences.length > 0 
              ? `${sentences[0].trim()} The discussion covered ${sentences.length} main points and identified several actionable next steps.`
              : 'No content provided to summarize.';
            
            const actionItems = [
              'Review meeting notes and identify key action items',
              'Schedule follow-up meeting to discuss next steps',
              'Share meeting summary with relevant stakeholders'
            ];
            
            res.json({
              content: [
                {
                  type: 'text',
                  text: `## Summary\n\n${summary}\n\n## Action Items\n\n${actionItems.map(item => `- ${item}`).join('\n')}`,
                },
              ],
            });
            break;
          }
          
          default:
            res.status(400).json({ error: `Unknown tool: ${name}` });
        }
        break;

      case '/mcp':
        // Handle MCP protocol - support GET, POST, and SSE
        if (req.method === 'GET') {
          // Check if client wants SSE
          const acceptHeader = req.headers.accept;
          if (acceptHeader?.includes('text/event-stream')) {
            // Set up SSE
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            });
            
            // Send initial server info
            const serverInfo = {
              jsonrpc: '2.0',
              result: {
                protocolVersion: '2024-11-05',
                capabilities: { tools: {} },
                serverInfo: { name: 'content-optimizer', version: '1.0.0' }
              }
            };
            res.write(`data: ${JSON.stringify(serverInfo)}\n\n`);
            
            // Keep connection alive
            const heartbeat = setInterval(() => {
              res.write(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`);
            }, 30000);
            
            req.on('close', () => {
              clearInterval(heartbeat);
            });
          } else {
            // Regular JSON response
            res.json({
              jsonrpc: '2.0',
              result: {
                protocolVersion: '2024-11-05',
                capabilities: { tools: {} },
                serverInfo: { name: 'content-optimizer', version: '1.0.0' }
              }
            });
          }
        } else if (req.method === 'POST') {
          const mcpRequest = req.body;
          const method = mcpRequest?.method;
          const requestId = mcpRequest?.id;
          const params = mcpRequest?.params || {};
          
          if (method === 'initialize') {
            res.json({
              jsonrpc: '2.0',
              id: requestId,
              result: {
                protocolVersion: '2024-11-05',
                capabilities: { tools: {} },
                serverInfo: { name: 'content-optimizer', version: '1.0.0' }
              }
            });
          } else if (method === 'tools/list') {
            res.json({
              jsonrpc: '2.0',
              id: requestId,
              result: {
                tools: [
                  {
                    name: 'validate',
                    description: 'Validate bearer token and return user phone number',
                    inputSchema: {
                      type: 'object',
                      properties: { token: { type: 'string' } },
                      required: ['token']
                    }
                  },
                  {
                    name: 'post_wizard',
                    description: 'Generate viral social media posts',
                    inputSchema: {
                      type: 'object',
                      properties: {
                        topic: { type: 'string' },
                        tone: { type: 'string', enum: ['professional', 'casual', 'fun'] },
                        hashtags: { type: 'array', items: { type: 'string' } }
                      },
                      required: ['topic', 'tone']
                    }
                  },
                  {
                    name: 'tldr_actions',
                    description: 'Summarize transcripts and extract action items',
                    inputSchema: {
                      type: 'object',
                      properties: { transcript: { type: 'string' } },
                      required: ['transcript']
                    }
                  }
                ]
              }
            });
          } else if (method === 'tools/call') {
            const toolName = params.name;
            const args = params.arguments || {};
            
            if (toolName === 'validate') {
              // Check token from args or Authorization header
              const tokenToCheck = args.token || bearerToken;
              if (tokenToCheck === AUTH_TOKEN) {
                res.json({
                  jsonrpc: '2.0',
                  id: requestId,
                  result: { content: [{ type: 'text', text: MY_NUMBER }] }
                });
              } else {
                res.json({
                  jsonrpc: '2.0',
                  id: requestId,
                  error: { code: -32602, message: 'Invalid bearer token' }
                });
              }
            } else if (toolName === 'post_wizard') {
              const { topic, tone, hashtags = [] } = args;
              const hooks = {
                professional: `🚀 The future of ${topic} is here, and it's changing everything.`,
                casual: `So I was thinking about ${topic} today... 🤔`,
                fun: `🎉 Plot twist: ${topic} is actually AMAZING!`
              };
              const content = `The key insight? ${topic} isn't just about efficiency—it's about transformation.`;
              const ctas = {
                professional: "What's your experience with this? I'd love to hear your thoughts.",
                casual: 'What do you think? Drop a comment below! 👇',
                fun: 'Who else is obsessed with this? 🙋‍♂️'
              };
              const finalHashtags = hashtags.length > 0 
                ? hashtags.map((tag: string) => `#${tag}`).join(' ')
                : `#${topic} #Innovation`;
              const result = `${hooks[tone]}\n\n${content}\n\n${ctas[tone]}\n\n${finalHashtags}`;
              
              res.json({
                jsonrpc: '2.0',
                id: requestId,
                result: { content: [{ type: 'text', text: result }] }
              });
            } else if (toolName === 'tldr_actions') {
              const { transcript } = args;
              const summary = `Summary of discussion about ${transcript.substring(0, 50)}...`;
              const actionItems = ['Review notes', 'Schedule follow-up', 'Share summary'];
              const result = `## Summary\n${summary}\n\n## Action Items\n${actionItems.map(item => `- ${item}`).join('\n')}`;
              
              res.json({
                jsonrpc: '2.0',
                id: requestId,
                result: { content: [{ type: 'text', text: result }] }
              });
            } else {
              res.json({
                jsonrpc: '2.0',
                id: requestId,
                error: { code: -32601, message: `Unknown tool: ${toolName}` }
              });
            }
          } else {
            res.json({
              jsonrpc: '2.0',
              id: requestId,
              error: { code: -32601, message: `Unknown method: ${method}` }
            });
          }
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      default:
        res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Request failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 