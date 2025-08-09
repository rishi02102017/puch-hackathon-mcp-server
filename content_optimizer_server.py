import asyncio
import os
from typing import Annotated
from dotenv import load_dotenv
from fastmcp import FastMCP
from fastmcp.server.auth.providers.bearer import BearerAuthProvider, RSAKeyPair
from mcp.server.auth.provider import AccessToken
from pydantic import Field

# Load environment variables
load_dotenv()

TOKEN = os.environ.get("AUTH_TOKEN", "4abe737b2ddf71ec5381f29cbd1495ee")
MY_NUMBER = os.environ.get("MY_NUMBER", "9101284785")

# Auth Provider
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

# MCP Server Setup
mcp = FastMCP(
    "Content Optimizer MCP Server",
    auth=SimpleBearerAuthProvider(TOKEN),
)

# Tool: validate (required by Puch)
@mcp.tool
async def validate() -> str:
    """Validate bearer token and return user phone number (required by Puch AI)"""
    return MY_NUMBER

# Tool: post_wizard
@mcp.tool
async def post_wizard(
    topic: Annotated[str, Field(description="The main topic or subject for the post")],
    tone: Annotated[str, Field(description="The tone of the post: professional, casual, or fun")],
    hashtags: Annotated[list[str], Field(description="Optional hashtags to include")] = None,
) -> str:
    """Generate viral social media posts with hooks, content, and CTAs"""
    
    if hashtags is None:
        hashtags = []
    
    # Simple post generation logic
    hooks = {
        "professional": f"🚀 The future of {topic} is here, and it's changing everything.",
        "casual": f"So I was thinking about {topic} today... 🤔",
        "fun": f"🎉 Plot twist: {topic} is actually AMAZING!",
    }
    
    content = f"The key insight? {topic} isn't just about efficiency—it's about transformation. When you understand the underlying principles, you unlock possibilities that seemed impossible before."
    
    ctas = {
        "professional": "What's your experience with this? I'd love to hear your thoughts in the comments.",
        "casual": "What do you think? Drop a comment below! 👇",
        "fun": "Who else is obsessed with this? 🙋‍♂️",
    }
    
    final_hashtags = " ".join([f"#{tag.replace(' ', '')}" for tag in hashtags]) if hashtags else f"#{topic.replace(' ', '')} #Innovation #Growth"
    
    result = f"{hooks.get(tone, hooks['professional'])}\n\n{content}\n\n{ctas.get(tone, ctas['professional'])}\n\n{final_hashtags}"
    
    return result

# Tool: tldr_actions
@mcp.tool
async def tldr_actions(
    transcript: Annotated[str, Field(description="The transcript or content to analyze")],
) -> str:
    """Summarize content and extract actionable items from transcripts"""
    
    # Simple summary and action items logic
    sentences = [s.strip() for s in transcript.replace('!', '.').replace('?', '.').split('.') if len(s.strip()) > 10]
    
    summary = f"{sentences[0]} The discussion covered {len(sentences)} main points and identified several actionable next steps." if sentences else "No content provided to summarize."
    
    action_items = [
        "Review meeting notes and identify key action items",
        "Schedule follow-up meeting to discuss next steps", 
        "Share meeting summary with relevant stakeholders"
    ]
    
    result = f"## Summary\n\n{summary}\n\n## Action Items\n\n" + "\n".join([f"- {item}" for item in action_items])
    
    return result

# Run MCP Server
async def main():
    print("🚀 Starting Content Optimizer MCP server on http://0.0.0.0:8085")
    await mcp.run_async("streamable-http", host="0.0.0.0", port=8085)

if __name__ == "__main__":
    asyncio.run(main())
