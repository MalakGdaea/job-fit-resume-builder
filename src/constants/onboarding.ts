import type { OnboardingStep } from "@/types/onboarding";

export const onboardingSteps = [
  "personal",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
] as const satisfies readonly OnboardingStep[];
