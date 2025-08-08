import { describe, it, expect } from 'vitest';
import { postWizard } from '../src/tools/postWizard';
import { tldrActions } from '../src/tools/tldrActions';
import { postWizardSchema, tldrActionsSchema } from '../src/lib/schema';

describe('Post Wizard Tool', () => {
  it('should generate a professional post', async () => {
    const input = {
      topic: 'artificial intelligence',
      tone: 'professional' as const,
      hashtags: ['AI', 'Innovation'],
    };

    const result = await postWizard(input);
    
    expect(result).toContain('artificial intelligence');
    expect(result).toContain('#AI');
    expect(result).toContain('#Innovation');
    expect(result).toMatch(/🚀|💡|📈/);
  });

  it('should generate a casual post', async () => {
    const input = {
      topic: 'remote work',
      tone: 'casual' as const,
    };

    const result = await postWizard(input);
    
    expect(result).toContain('remote work');
    expect(result).toMatch(/🤔|!|\.\.\./);
  });

  it('should generate a fun post', async () => {
    const input = {
      topic: 'productivity hacks',
      tone: 'fun' as const,
    };

    const result = await postWizard(input);
    
    expect(result).toContain('productivity hacks');
    expect(result).toMatch(/🎉|🔥|✨|🤯/);
  });

  it('should validate input schema', () => {
    const validInput = {
      topic: 'test topic',
      tone: 'professional' as const,
    };

    expect(() => postWizardSchema.parse(validInput)).not.toThrow();
  });

  it('should reject invalid tone', () => {
    const invalidInput = {
      topic: 'test topic',
      tone: 'invalid' as any,
    };

    expect(() => postWizardSchema.parse(invalidInput)).toThrow();
  });

  it('should reject empty topic', () => {
    const invalidInput = {
      topic: '',
      tone: 'professional' as const,
    };

    expect(() => postWizardSchema.parse(invalidInput)).toThrow();
  });
});

describe('TLDR Actions Tool', () => {
  it('should summarize content and extract action items', async () => {
    const input = {
      transcript: 'We need to implement the new feature by next week. The team should review the requirements and create a timeline. We will need to test the implementation thoroughly.',
    };

    const result = await tldrActions(input);
    
    expect(result.summary).toBeDefined();
    expect(result.action_items).toBeInstanceOf(Array);
    expect(result.action_items.length).toBeGreaterThan(0);
  });

  it('should handle short content', async () => {
    const input = {
      transcript: 'Short content.',
    };

    const result = await tldrActions(input);
    
    expect(result.summary).toBeDefined();
    expect(result.action_items).toBeInstanceOf(Array);
  });

  it('should validate input schema', () => {
    const validInput = {
      transcript: 'This is a valid transcript with enough content to process.',
    };

    expect(() => tldrActionsSchema.parse(validInput)).not.toThrow();
  });

  it('should reject short transcript', () => {
    const invalidInput = {
      transcript: 'Short',
    };

    expect(() => tldrActionsSchema.parse(invalidInput)).toThrow();
  });

  it('should extract action items from action words', async () => {
    const input = {
      transcript: 'We should implement the new feature. The team must review the requirements. We will need to test everything.',
    };

    const result = await tldrActions(input);
    
    expect(result.action_items.some(item => 
      item.toLowerCase().includes('implement') ||
      item.toLowerCase().includes('review') ||
      item.toLowerCase().includes('test')
    )).toBe(true);
  });
});

// Golden file snapshots
describe('Golden File Snapshots', () => {
  it('should generate consistent professional post', async () => {
    const input = {
      topic: 'machine learning',
      tone: 'professional' as const,
      hashtags: ['ML', 'DataScience'],
    };

    const result = await postWizard(input);
    
    // This creates a snapshot that can be used for regression testing
    expect(result).toMatchSnapshot();
  });

  it('should generate consistent casual post', async () => {
    const input = {
      topic: 'work from home',
      tone: 'casual' as const,
    };

    const result = await postWizard(input);
    
    expect(result).toMatchSnapshot();
  });

  it('should generate consistent fun post', async () => {
    const input = {
      topic: 'life hacks',
      tone: 'fun' as const,
    };

    const result = await postWizard(input);
    
    expect(result).toMatchSnapshot();
  });

  it('should generate consistent TLDR output', async () => {
    const input = {
      transcript: 'In today\'s meeting, we discussed the quarterly goals. We need to increase sales by 20%. The marketing team should create new campaigns. We will review progress next month.',
    };

    const result = await tldrActions(input);
    
    expect(result).toMatchSnapshot();
  });
}); 