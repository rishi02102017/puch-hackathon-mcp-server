import { z } from 'zod';

// Post Wizard Tool Schema
export const postWizardSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(200, 'Topic too long'),
  tone: z.enum(['professional', 'casual', 'fun'], {
    errorMap: () => ({ message: 'Tone must be professional, casual, or fun' }),
  }),
  hashtags: z.array(z.string()).optional().default([]),
});

export type PostWizardInput = z.infer<typeof postWizardSchema>;

// TLDR Actions Tool Schema
export const tldrActionsSchema = z.object({
  transcript: z.string().min(10, 'Transcript must be at least 10 characters'),
});

export type TldrActionsInput = z.infer<typeof tldrActionsSchema>;

// Analytics tracking schema
export const analyticsSchema = z.object({
  tool: z.string(),
  duration: z.number().optional(),
  success: z.boolean(),
  error: z.string().optional(),
});

export type AnalyticsData = z.infer<typeof analyticsSchema>; 