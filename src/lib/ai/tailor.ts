/**
 * Core AI resume tailoring orchestration.
 */

import { createAnthropicTailoredData } from "./anthropic";
import { createMockTailoredData } from "./mock";
import type { TailoredResumeResponse } from "./validation";
import type { Profile } from "@/types/profile";
import type { Resume } from "@/types/resume";

type AiProvider = "mock" | "anthropic";

/**
 * Tailors a user's profile to match a specific job description.
 * Returns a job-specific resume using only authentic information.
 */
export async function tailorResume(
  profile: Profile,
  jobDescription: string,
  jobTitle?: string,
  company?: string
): Promise<Resume> {
  const tailoredData = await createTailoredData(profile, jobDescription);

  return {
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
}

async function createTailoredData(
  profile: Profile,
  jobDescription: string
): Promise<TailoredResumeResponse> {
  const provider = getAiProvider();

  if (provider === "mock") {
    return createMockTailoredData(profile, jobDescription);
  }

  return createAnthropicTailoredData(profile, jobDescription);
}

function getAiProvider(): AiProvider {
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();

  if (provider === "mock" || provider === "anthropic") {
    return provider;
  }

  throw new Error("AI_PROVIDER must be either 'mock' or 'anthropic'");
}
