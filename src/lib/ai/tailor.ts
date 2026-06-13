/**
 * Core AI resume tailoring logic
 * Uses Claude to transform a user's profile into a job-specific resume
 */

import { DEFAULT_MODEL, getAnthropicClient } from "./client";
import { createTailoringPrompt } from "./prompts";
import type { Profile } from "@/types/profile";
import type { Resume, FitScore, TailoredWorkExperience, TailoredEducation, TailoredProject, TailoredCertification } from "@/types/resume";

interface TailoredResumeResponse {
  summary: string;
  workExperience: TailoredWorkExperience[];
  education: TailoredEducation[];
  skills: string[];
  projects: TailoredProject[];
  certifications: TailoredCertification[];
  fitScore: FitScore;
}

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

    // Extract the response text
    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : "";

    // Parse the JSON response
    let tailoredData: TailoredResumeResponse;
    try {
      tailoredData = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse AI response:", responseText);
      throw new Error("AI returned invalid JSON response");
    }

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
