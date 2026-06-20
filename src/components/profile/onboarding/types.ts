import type { Profile } from "@/types/profile";

export const onboardingSteps = [
  "personal",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
] as const;

export type OnboardingStep = (typeof onboardingSteps)[number];
export type PersonalInfo = Profile["personalInfo"];
export type SkillGroups = Profile["skills"];
