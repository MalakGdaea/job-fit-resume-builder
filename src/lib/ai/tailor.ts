/**
 * Core AI resume tailoring logic
 * Uses Claude to transform a user's profile into a job-specific resume
 */

import { DEFAULT_MODEL, getAnthropicClient } from "./client";
import { createTailoringPrompt } from "./prompts";
import {
  parseJsonObjectFromAiResponse,
  validateTailoredResumeResponse,
} from "./validation";
import type { Profile } from "@/types/profile";
import type { Resume } from "@/types/resume";

/**
 * Tailors a user's profile to match a specific job description
 * Returns a job-specific resume using only authentic information
 */
export async function tailorResume(
  profile: Profile,
  jobDescription: string,
  jobTitle?: string,
  company?: string
): Promise<Resume> {
  try {
    // Create the tailoring prompt
    const prompt = createTailoringPrompt(profile, jobDescription);
    const anthropic = getAnthropicClient();

    // Call Claude API
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
    const tailoredData = validateTailoredResumeResponse(parsedResponse, profile);

    // Build the complete Resume object
    const resume: Resume = {
      id: crypto.randomUUID(),
      profileId: profile.id,
      jobTitle: jobTitle || "Position",
      company,
      personalInfo: {
        fullName: profile.personalInfo.fullName,
        email: profile.personalInfo.email,
        phone: profile.personalInfo.phone,
        location: profile.personalInfo.location,
        linkedin: profile.personalInfo.linkedin,
        github: profile.personalInfo.github,
        portfolio: profile.personalInfo.portfolio,
      },
      summary: tailoredData.summary,
      workExperience: tailoredData.workExperience,
      education: tailoredData.education,
      skills: tailoredData.skills,
      projects: tailoredData.projects,
      certifications: tailoredData.certifications,
      fitScore: tailoredData.fitScore,
      createdAt: new Date().toISOString(),
      jobDescription,
    };

    return resume;
  } catch (error) {
    console.error("Error tailoring resume:", error);
    throw error;
  }
}
