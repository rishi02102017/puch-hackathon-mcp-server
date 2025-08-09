#!/usr/bin/env python3
"""
Simple MCP Server for Puch AI Hackathon
Based on the official tutorial approach
"""

import json
import asyncio
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

# Configuration
AUTH_TOKEN = "4abe737b2ddf71ec5381f29cbd1495ee"
MY_NUMBER = "9101284785"
PORT = 8085

class MCPHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/mcp':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "jsonrpc": "2.0",
                "result": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {
                        "tools": {}
                    },
                    "serverInfo": {
                        "name": "content-optimizer",
                        "version": "1.0.0"
                    }
                }
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_error(404)

    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/mcp':
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                request_data = json.loads(post_data.decode('utf-8'))
                response = self.handle_mcp_request(request_data)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                self.send_error(500, str(e))
        else:
            self.send_error(404)

    def handle_mcp_request(self, request_data):
        """Handle MCP JSON-RPC requests"""
        method = request_data.get('method')
        request_id = request_data.get('id')
        params = request_data.get('params', {})
        
        if method == 'initialize':
            return {
                "jsonrpc": "2.0",
                "id": request_id,
                "result": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {
                        "tools": {}
                    },
                    "serverInfo": {
                        "name": "content-optimizer",
                        "version": "1.0.0"
                    }
                }
            }
        
        elif method == 'tools/list':
            return {
                "jsonrpc": "2.0",
                "id": request_id,
                "result": {
                    "tools": [
                        {
                            "name": "validate",
                            "description": "Validate bearer token and return user phone number",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "token": {"type": "string"}
                                },
                                "required": ["token"]
                            }
                        },
                        {
                            "name": "post_wizard",
                            "description": "Generate viral social media posts",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "topic": {"type": "string"},
                                    "tone": {"type": "string", "enum": ["professional", "casual", "fun"]},
                                    "hashtags": {"type": "array", "items": {"type": "string"}}
                                },
                                "required": ["topic", "tone"]
                            }
                        },
                        {
                            "name": "tldr_actions",
                            "description": "Summarize transcripts and extract action items",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "transcript": {"type": "string"}
                                },
                                "required": ["transcript"]
                            }
                        }
                    ]
                }
            }
        
        elif method == 'tools/call':
            tool_name = params.get('name')
            arguments = params.get('arguments', {})
            
            if tool_name == 'validate':
                token = arguments.get('token')
                if token == AUTH_TOKEN:
                    return {
                        "jsonrpc": "2.0",
                        "id": request_id,
                        "result": {
                            "content": [{"type": "text", "text": MY_NUMBER}]
                        }
                    }
                else:
                    return {
                        "jsonrpc": "2.0",
                        "id": request_id,
                        "error": {"code": -32602, "message": "Invalid bearer token"}
                    }
            
            elif tool_name == 'post_wizard':
                topic = arguments.get('topic', '')
                tone = arguments.get('tone', 'professional')
                hashtags = arguments.get('hashtags', [])
                
                hooks = {
                    "professional": f"🚀 The future of {topic} is here, and it's changing everything.",
                    "casual": f"So I was thinking about {topic} today... 🤔",
                    "fun": f"🎉 Plot twist: {topic} is actually AMAZING!"
                }
                
                content = f"The key insight? {topic} isn't just about efficiency—it's about transformation."
                
                ctas = {
                    "professional": "What's your experience with this? I'd love to hear your thoughts.",
                    "casual": "What do you think? Drop a comment below! 👇",
                    "fun": "Who else is obsessed with this? 🙋‍♂️"
                }
                
                final_hashtags = " ".join([f"#{tag}" for tag in hashtags]) if hashtags else f"#{topic} #Innovation"
                result = f"{hooks[tone]}\n\n{content}\n\n{ctas[tone]}\n\n{final_hashtags}"
                
                return {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": {
                        "content": [{"type": "text", "text": result}]
                    }
                }
            
            elif tool_name == 'tldr_actions':
                transcript = arguments.get('transcript', '')
                summary = f"Summary of discussion about {transcript[:50]}..."
                action_items = ["Review notes", "Schedule follow-up", "Share summary"]
                result = f"## Summary\n{summary}\n\n## Action Items\n" + "\n".join([f"- {item}" for item in action_items])
                
                return {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": {
                        "content": [{"type": "text", "text": result}]
                    }
                }
            
            else:
                return {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "error": {"code": -32601, "message": f"Unknown tool: {tool_name}"}
                }
        
        else:
            return {
                "jsonrpc": "2.0",
                "id": request_id,
                "error": {"code": -32601, "message": f"Unknown method: {method}"}
            }

def run_server():
    server = HTTPServer(('0.0.0.0', PORT), MCPHandler)
    print(f"🚀 Starting MCP server on http://0.0.0.0:{PORT}")
    print(f"📱 Authentication token: {AUTH_TOKEN}")
    print(f"📞 Phone number: {MY_NUMBER}")
    print(f"🌐 Use ngrok to expose: ngrok http {PORT}")
    server.serve_forever()

if __name__ == '__main__':
    run_server()
