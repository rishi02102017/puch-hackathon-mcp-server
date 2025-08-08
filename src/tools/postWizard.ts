import { PostWizardInput } from '../lib/schema';
import { logger } from '../lib/logger';

export async function postWizard(input: PostWizardInput): Promise<string> {
  return logger.time('postWizard', async () => {
    const { topic, tone, hashtags } = input;

    // Generate a hook based on the topic and tone
    const hooks = {
      professional: [
        `🚀 The future of ${topic} is here, and it's changing everything.`,
        `💡 Here's what most people get wrong about ${topic}:`,
        `📈 The ${topic} industry is evolving faster than ever. Here's why:`,
      ],
      casual: [
        `So I was thinking about ${topic} today... 🤔`,
        `You won't believe what I just learned about ${topic}!`,
        `Okay, hear me out about ${topic}...`,
      ],
      fun: [
        `🎉 Plot twist: ${topic} is actually AMAZING!`,
        `🔥 Hot take: ${topic} is the best thing since sliced bread!`,
        `✨ The ${topic} hack that changed my life:`,
      ],
    };

    const hook = hooks[tone][Math.floor(Math.random() * hooks[tone].length)];

    // Generate the main content
    const content = generateContent(topic, tone);

    // Generate hashtags if not provided
    const finalHashtags = (hashtags && hashtags.length > 0)
      ? hashtags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ')
      : generateHashtags(topic, tone);

    // Generate CTA based on tone
    const cta = generateCTA(tone);

    return `${hook}

${content}

${cta}

${finalHashtags}`;
  });
}

function generateContent(topic: string, tone: string): string {
  const contents = {
    professional: [
      `The key insight? ${topic} isn't just about efficiency—it's about transformation. When you understand the underlying principles, you unlock possibilities that seemed impossible before.`,
      `Here's the framework I use: 1) Identify the core challenge, 2) Apply systematic thinking, 3) Iterate rapidly. The results speak for themselves.`,
      `The data is clear: organizations that embrace ${topic} see 3x better outcomes. But it's not about the tools—it's about the mindset shift.`,
    ],
    casual: [
      `Turns out, ${topic} is way more interesting than I thought. The best part? It actually works in real life, not just in theory.`,
      `I've been experimenting with ${topic} for a while now, and honestly? It's a game-changer. Here's what I wish I knew earlier.`,
      `Fun fact: ${topic} is everywhere once you start looking for it. And when you get it right, the results are pretty amazing.`,
    ],
    fun: [
      `Y'all, ${topic} is literally the best thing ever! I can't believe I went so long without knowing about this. Mind = blown! 🤯`,
      `Okay, so ${topic} is basically magic. I'm not even kidding—it's like having a superpower that actually works!`,
      `Plot twist: ${topic} is actually super easy once you get the hang of it. And the results? Absolutely incredible!`,
    ],
  };

  return contents[tone][Math.floor(Math.random() * contents[tone].length)];
}

function generateCTA(tone: string): string {
      const ctas = {
      professional: [
        "What's your experience with this? I'd love to hear your thoughts in the comments.",
        'Ready to take this to the next level? Let\'s connect and explore the possibilities.',
        'The future is now. Are you ready to be part of it?',
      ],
          casual: [
        'What do you think? Drop a comment below! 👇',
        "Anyone else tried this? I'd love to hear your stories!",
        'This is just the beginning. What should we explore next?',
      ],
          fun: [
        'Who else is obsessed with this? 🙋‍♂️',
        "Drop a \"🔥\" if you're as excited as I am!",
        'This is too good not to share! Tag someone who needs to see this!',
      ],
  };

  return ctas[tone][Math.floor(Math.random() * ctas[tone].length)];
}

function generateHashtags(topic: string, tone: string): string {
  const baseHashtags = {
    professional: ['Innovation', 'Leadership', 'Strategy', 'Growth', 'FutureOfWork'],
    casual: ['Learning', 'Tips', 'Insights', 'Community', 'Sharing'],
    fun: ['Viral', 'Trending', 'Amazing', 'MustKnow', 'GameChanger'],
  };

  const topicHashtag = topic.replace(/\s+/g, '');
  const toneHashtags = baseHashtags[tone];
  
  return `#${topicHashtag} ${toneHashtags.map(tag => `#${tag}`).join(' ')}`;
} 