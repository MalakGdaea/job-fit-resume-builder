import type { Profile } from "@/types/profile";
import type { TailoredResumeResponse } from "./validation";

export function createMockTailoredData(
  profile: Profile,
  jobDescription: string
): TailoredResumeResponse {
  const allSkills = [
    ...profile.skills.technical,
    ...profile.skills.soft,
    ...profile.skills.languages,
  ];
  const matchedSkills = matchProfileSkills(allSkills, jobDescription);
  const selectedSkills = matchedSkills.length > 0 ? matchedSkills : allSkills.slice(0, 10);
  const missingSkills = findMissingCommonSkills(allSkills, jobDescription);
  const skillsScore = allSkills.length === 0
    ? 0
    : Math.min(100, Math.round((matchedSkills.length / Math.min(allSkills.length, 10)) * 100));
  const experienceScore = profile.workExperience.length > 0 ? 75 : 25;
  const educationScore = profile.education.length > 0 ? 75 : 40;

  return {
    summary: createMockSummary(profile, selectedSkills),
    workExperience: profile.workExperience.map((experience) => ({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate,
      endDate: experience.endDate,
      location: experience.location,
      description: experience.description,
      achievements: experience.achievements,
    })),
    education: profile.education.map((education) => ({
      institution: education.institution,
      degree: education.degree,
      field: education.field,
      startDate: education.startDate,
      endDate: education.endDate,
      gpa: education.gpa,
      honors: education.honors,
    })),
    skills: selectedSkills,
    projects: selectRelevantProjects(profile, jobDescription),
    certifications: profile.certifications.map((certification) => ({
      name: certification.name,
      issuer: certification.issuer,
      dateIssued: certification.dateIssued,
      expirationDate: certification.expirationDate,
      credentialId: certification.credentialId,
      url: certification.url,
    })),
    fitScore: {
      overall: Math.round((skillsScore + experienceScore + educationScore) / 3),
      breakdown: {
        skills: skillsScore,
        experience: experienceScore,
        education: educationScore,
      },
      matchedSkills,
      missingSkills,
      gaps: createMockGaps(missingSkills),
    },
  };
}

function matchProfileSkills(skills: string[], jobDescription: string): string[] {
  const normalizedJobDescription = normalize(jobDescription);

  return unique(skills).filter((skill) =>
    normalizedJobDescription.includes(normalize(skill))
  );
}

function selectRelevantProjects(
  profile: Profile,
  jobDescription: string
): TailoredResumeResponse["projects"] {
  const normalizedJobDescription = normalize(jobDescription);
  const rankedProjects = profile.projects
    .map((project) => ({
      project,
      relevance: project.technologies.filter((technology) =>
        normalizedJobDescription.includes(normalize(technology))
      ).length,
    }))
    .sort((left, right) => right.relevance - left.relevance);

  return rankedProjects
    .filter((entry, index) => entry.relevance > 0 || index < 2)
    .slice(0, 3)
    .map(({ project }) => ({
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      url: project.url,
      highlights: project.highlights,
    }));
}

function findMissingCommonSkills(skills: string[], jobDescription: string): string[] {
  const profileSkillSet = new Set(skills.map(normalize));
  const normalizedJobDescription = normalize(jobDescription);
  const commonSkills = [
    "typescript",
    "javascript",
    "react",
    "next.js",
    "node.js",
    "postgresql",
    "sql",
    "tailwind",
    "prisma",
    "python",
    "aws",
    "docker",
  ];

  return commonSkills.filter(
    (skill) =>
      normalizedJobDescription.includes(skill) &&
      !profileSkillSet.has(skill)
  );
}

function createMockSummary(profile: Profile, skills: string[]): string {
  if (profile.personalInfo.summary) {
    return profile.personalInfo.summary;
  }

  const currentRole = profile.workExperience.find((experience) => experience.endDate === null);
  const roleText = currentRole
    ? `${currentRole.position} with experience at ${currentRole.company}`
    : "Candidate with documented professional experience";
  const skillText = skills.length > 0
    ? ` Strengths highlighted for this role include ${skills.slice(0, 5).join(", ")}.`
    : "";

  return `${roleText}.${skillText}`;
}

function createMockGaps(missingSkills: string[]): string[] {
  if (missingSkills.length === 0) {
    return ["Mock mode found no common required skills missing from the profile."];
  }

  return missingSkills.map(
    (skill) => `The job description mentions ${skill}, but it is not listed in the profile.`
  );
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}
