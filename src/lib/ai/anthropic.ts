import { DEFAULT_MODEL, getAnthropicClient } from "./client";
import { createTailoringPrompt } from "./prompts";
import {
  parseJsonObjectFromAiResponse,
  validateTailoredResumeResponse,
  type TailoredResumeResponse,
} from "./validation";
import type { Profile } from "@/types/profile";

export async function createAnthropicTailoredData(
  profile: Profile,
  jobDescription: string
): Promise<TailoredResumeResponse> {
  try {
    const prompt = createTailoringPrompt(profile, jobDescription);
    const anthropic = getAnthropicClient();

    const message = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.content
      .filter((contentBlock) => contentBlock.type === "text")
      .map((contentBlock) => contentBlock.text)
      .join("\n")
      .trim();

    const parsedResponse = parseJsonObjectFromAiResponse(responseText);
    return validateTailoredResumeResponse(parsedResponse, profile);
  } catch (error) {
    console.error("Error tailoring resume with Anthropic:", error);
    throw error;
  }
}
