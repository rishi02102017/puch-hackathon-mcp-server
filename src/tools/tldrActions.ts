import { TldrActionsInput } from '../lib/schema';
import { logger } from '../lib/logger';

export interface TldrActionsOutput {
  summary: string;
  action_items: string[];
}

export async function tldrActions(input: TldrActionsInput): Promise<TldrActionsOutput> {
  return logger.time('tldrActions', async () => {
    const { transcript } = input;

    // Simple text analysis to extract key points
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const words = transcript.toLowerCase().split(/\s+/);
    
    // Identify action words and key topics
    const actionWords = ['should', 'must', 'need', 'will', 'going to', 'plan to', 'decide', 'implement', 'create', 'build', 'develop', 'launch', 'start', 'finish', 'complete', 'review', 'test', 'deploy'];
    const keyTopics = extractKeyTopics(words);
    
    // Generate summary
    const summary = generateSummary(sentences, keyTopics);
    
    // Extract action items
    const action_items = extractActionItems(sentences, actionWords, keyTopics);

    return {
      summary,
      action_items,
    };
  });
}

function extractKeyTopics(words: string[]): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
  
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
    if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
      wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
    }
  });

  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

function generateSummary(sentences: string[], keyTopics: string[]): string {
  if (sentences.length === 0) {
    return 'No content provided to summarize.';
  }

  // Take first few sentences and key topics
  const firstSentence = sentences[0].trim();
  const topicPhrase = keyTopics.length > 0 
    ? `Key topics discussed: ${keyTopics.slice(0, 3).join(', ')}. `
    : '';

  return `${topicPhrase}${firstSentence} The discussion covered ${sentences.length} main points and identified several actionable next steps.`;
}

function extractActionItems(sentences: string[], actionWords: string[], keyTopics: string[]): string[] {
  const actionItems: string[] = [];
  
  // Look for sentences with action words
  sentences.forEach(sentence => {
    const lowerSentence = sentence.toLowerCase();
    const hasActionWord = actionWords.some(word => lowerSentence.includes(word));
    
    if (hasActionWord) {
      // Clean up the sentence
      let actionItem = sentence.trim();
      if (!actionItem.endsWith('.')) actionItem += '.';
      
      // Make it more actionable if needed
      if (!actionItem.match(/^(we|i|they|you|team)/i)) {
        actionItem = `Action: ${actionItem}`;
      }
      
      actionItems.push(actionItem);
    }
  });

  // If no action items found, generate some based on key topics
  if (actionItems.length === 0 && keyTopics.length > 0) {
    actionItems.push(
      `Review and finalize plans related to ${keyTopics[0]}`,
      `Schedule follow-up discussion on ${keyTopics.slice(0, 2).join(' and ')}`,
      'Document key decisions and next steps from this meeting'
    );
  }

  // If still no action items, provide generic ones
  if (actionItems.length === 0) {
    actionItems.push(
      'Review meeting notes and identify key action items',
      'Schedule follow-up meeting to discuss next steps',
      'Share meeting summary with relevant stakeholders'
    );
  }

  return actionItems.slice(0, 5); // Limit to 5 action items
} 