import { VercelRequest, VercelResponse } from '@vercel/node';

// Authentication configuration
const AUTH_TOKEN = process.env.AUTH_TOKEN || '4abe737b2ddf71ec5381f29cbd1495ee';
const MY_NUMBER = process.env.MY_NUMBER || '9101284785'; // Your WhatsApp number

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
        // Handle MCP protocol over Server-Sent Events
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed. MCP requires POST.' });
          return;
        }

        const mcpRequest = req.body;
        
        // Handle MCP JSON-RPC 2.0 requests
        if (mcpRequest.method === 'initialize') {
          res.json({
            jsonrpc: '2.0',
            id: mcpRequest.id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: {
                tools: {}
              },
              serverInfo: {
                name: 'content-optimizer',
                version: '1.0.0'
              }
            }
          });
        } else if (mcpRequest.method === 'tools/list') {
          res.json({
            jsonrpc: '2.0',
            id: mcpRequest.id,
            result: {
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
              ]
            }
          });
        } else if (mcpRequest.method === 'tools/call') {
          const { name, arguments: args } = mcpRequest.params;
          
          if (name === 'validate') {
            const { token } = args;
            
            if (token !== AUTH_TOKEN) {
              res.json({
                jsonrpc: '2.0',
                id: mcpRequest.id,
                error: {
                  code: -32602,
                  message: 'Invalid bearer token'
                }
              });
              return;
            }
            
            res.json({
              jsonrpc: '2.0',
              id: mcpRequest.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: MY_NUMBER,
                  },
                ],
              }
            });
          } else if (name === 'post_wizard') {
            const { topic, tone, hashtags = [] } = args;
            
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
              jsonrpc: '2.0',
              id: mcpRequest.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: result,
                  },
                ],
              }
            });
          } else if (name === 'tldr_actions') {
            const { transcript } = args;
            
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
              jsonrpc: '2.0',
              id: mcpRequest.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: `## Summary\n\n${summary}\n\n## Action Items\n\n${actionItems.map(item => `- ${item}`).join('\n')}`,
                  },
                ],
              }
            });
          } else {
            res.json({
              jsonrpc: '2.0',
              id: mcpRequest.id,
              error: {
                code: -32601,
                message: `Unknown tool: ${name}`
              }
            });
          }
        } else {
          res.json({
            jsonrpc: '2.0',
            id: mcpRequest.id,
            error: {
              code: -32601,
              message: `Method not found: ${mcpRequest.method}`
            }
          });
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