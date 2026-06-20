import type { Profile } from "@/types/profile";

export type OnboardingStep =
  | "personal"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications";
export type PersonalInfo = Profile["personalInfo"];
export type SkillGroups = Profile["skills"];
