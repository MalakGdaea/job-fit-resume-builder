/**
 * Anthropic Claude API client
 * Centralized SDK client factory with environment variable validation
 */

import Anthropic from "@anthropic-ai/sdk";

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY environment variable is required. " +
      "Please add it to your .env.local file."
    );
  }

  anthropicClient ??= new Anthropic({
    apiKey,
  });

  return anthropicClient;
}

// Export model constants for consistency
export const MODELS = {
  CLAUDE_3_5_SONNET: "claude-3-5-sonnet-20241022",
  CLAUDE_3_OPUS: "claude-3-opus-20240229",
  CLAUDE_3_HAIKU: "claude-3-haiku-20240307",
} as const;

// Default model for resume tailoring
export const DEFAULT_MODEL = MODELS.CLAUDE_3_5_SONNET;
