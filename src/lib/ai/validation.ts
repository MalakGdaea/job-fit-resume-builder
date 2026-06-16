import type { Profile } from "@/types/profile";
import type {
  FitScore,
  TailoredCertification,
  TailoredEducation,
  TailoredProject,
  TailoredWorkExperience,
} from "@/types/resume";

export interface TailoredResumeResponse {
  summary: string;
  workExperience: TailoredWorkExperience[];
  education: TailoredEducation[];
  skills: string[];
  projects: TailoredProject[];
  certifications: TailoredCertification[];
  fitScore: FitScore;
}

type JsonObject = Record<string, unknown>;

export class AiResponseValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`AI response failed validation: ${issues.join("; ")}`);
    this.name = "AiResponseValidationError";
  }
}

export function parseJsonObjectFromAiResponse(responseText: string): JsonObject {
  const trimmed = responseText.trim();

  if (!trimmed) {
    throw new AiResponseValidationError(["Response was empty"]);
  }

  const unfenced = stripMarkdownFence(trimmed);
  const parsed = parseJson(unfenced) ?? parseJson(extractJsonObject(unfenced));

  if (!isJsonObject(parsed)) {
    throw new AiResponseValidationError(["Response was not a JSON object"]);
  }

  return parsed;
}

export function validateTailoredResumeResponse(
  value: unknown,
  profile: Profile
): TailoredResumeResponse {
  const issues: string[] = [];

  if (!isJsonObject(value)) {
    throw new AiResponseValidationError(["Response root must be an object"]);
  }

  const knownSkills = new Set(
    [
      ...profile.skills.technical,
      ...profile.skills.soft,
      ...profile.skills.languages,
    ].map(normalize)
  );

  const response: TailoredResumeResponse = {
    summary: readRequiredString(value, "summary", issues),
    workExperience: readArray(value, "workExperience", issues).map((item, index) =>
      validateWorkExperience(item, index, profile, issues)
    ),
    education: readArray(value, "education", issues).map((item, index) =>
      validateEducation(item, index, profile, issues)
    ),
    skills: readStringArray(value, "skills", issues).filter((skill, index) => {
      if (!knownSkills.has(normalize(skill))) {
        issues.push(`skills[${index}] is not present in the source profile`);
        return false;
      }

      return true;
    }),
    projects: readArray(value, "projects", issues).map((item, index) =>
      validateProject(item, index, profile, issues)
    ),
    certifications: readArray(value, "certifications", issues).map((item, index) =>
      validateCertification(item, index, profile, issues)
    ),
    fitScore: validateFitScore(value.fitScore, issues, knownSkills),
  };

  if (issues.length > 0) {
    throw new AiResponseValidationError(issues);
  }

  return response;
}

function validateWorkExperience(
  value: unknown,
  index: number,
  profile: Profile,
  issues: string[]
): TailoredWorkExperience {
  const path = `workExperience[${index}]`;
  const item = readObject(value, path, issues);
  const workExperience: TailoredWorkExperience = {
    company: readRequiredString(item, "company", issues, path),
    position: readRequiredString(item, "position", issues, path),
    startDate: readRequiredString(item, "startDate", issues, path),
    endDate: readNullableString(item, "endDate", issues, path),
    location: readOptionalString(item, "location", issues, path),
    description: readRequiredString(item, "description", issues, path),
    achievements: readStringArray(item, "achievements", issues, path),
  };

  const sourceExists = profile.workExperience.some(
    (source) =>
      source.company === workExperience.company &&
      source.position === workExperience.position &&
      source.startDate === workExperience.startDate &&
      source.endDate === workExperience.endDate
  );

  if (!sourceExists) {
    issues.push(`${path} does not match a source work experience entry`);
  }

  return workExperience;
}

function validateEducation(
  value: unknown,
  index: number,
  profile: Profile,
  issues: string[]
): TailoredEducation {
  const path = `education[${index}]`;
  const item = readObject(value, path, issues);
  const education: TailoredEducation = {
    institution: readRequiredString(item, "institution", issues, path),
    degree: readRequiredString(item, "degree", issues, path),
    field: readRequiredString(item, "field", issues, path),
    startDate: readRequiredString(item, "startDate", issues, path),
    endDate: readNullableString(item, "endDate", issues, path),
    gpa: readOptionalString(item, "gpa", issues, path),
    honors: readOptionalStringArray(item, "honors", issues, path),
  };

  const sourceExists = profile.education.some(
    (source) =>
      source.institution === education.institution &&
      source.degree === education.degree &&
      source.field === education.field &&
      source.startDate === education.startDate &&
      source.endDate === education.endDate
  );

  if (!sourceExists) {
    issues.push(`${path} does not match a source education entry`);
  }

  return education;
}

function validateProject(
  value: unknown,
  index: number,
  profile: Profile,
  issues: string[]
): TailoredProject {
  const path = `projects[${index}]`;
  const item = readObject(value, path, issues);
  const project: TailoredProject = {
    name: readRequiredString(item, "name", issues, path),
    description: readRequiredString(item, "description", issues, path),
    technologies: readStringArray(item, "technologies", issues, path),
    url: readOptionalString(item, "url", issues, path),
    highlights: readStringArray(item, "highlights", issues, path),
  };

  const source = profile.projects.find(
    (sourceProject) => sourceProject.name === project.name
  );

  if (!source) {
    issues.push(`${path} does not match a source project`);
    return project;
  }

  if (project.url && source.url && project.url !== source.url) {
    issues.push(`${path}.url does not match the source project URL`);
  }

  const sourceTechnologies = new Set(source.technologies.map(normalize));
  project.technologies.forEach((technology, technologyIndex) => {
    if (!sourceTechnologies.has(normalize(technology))) {
      issues.push(`${path}.technologies[${technologyIndex}] is not in the source project`);
    }
  });

  return project;
}

function validateCertification(
  value: unknown,
  index: number,
  profile: Profile,
  issues: string[]
): TailoredCertification {
  const path = `certifications[${index}]`;
  const item = readObject(value, path, issues);
  const certification: TailoredCertification = {
    name: readRequiredString(item, "name", issues, path),
    issuer: readRequiredString(item, "issuer", issues, path),
    dateIssued: readRequiredString(item, "dateIssued", issues, path),
    expirationDate: readOptionalNullableString(item, "expirationDate", issues, path),
    credentialId: readOptionalString(item, "credentialId", issues, path),
    url: readOptionalString(item, "url", issues, path),
  };

  const sourceExists = profile.certifications.some(
    (source) =>
      source.name === certification.name &&
      source.issuer === certification.issuer &&
      source.dateIssued === certification.dateIssued
  );

  if (!sourceExists) {
    issues.push(`${path} does not match a source certification`);
  }

  return certification;
}

function validateFitScore(
  value: unknown,
  issues: string[],
  knownSkills: Set<string>
): FitScore {
  const item = readObject(value, "fitScore", issues);
  const breakdown = readObject(item.breakdown, "fitScore.breakdown", issues);
  const matchedSkills = readStringArray(item, "matchedSkills", issues, "fitScore");

  matchedSkills.forEach((skill, index) => {
    if (!knownSkills.has(normalize(skill))) {
      issues.push(`fitScore.matchedSkills[${index}] is not present in the source profile`);
    }
  });

  return {
    overall: readScore(item, "overall", issues, "fitScore"),
    breakdown: {
      skills: readScore(breakdown, "skills", issues, "fitScore.breakdown"),
      experience: readScore(breakdown, "experience", issues, "fitScore.breakdown"),
      education: readScore(breakdown, "education", issues, "fitScore.breakdown"),
    },
    matchedSkills,
    missingSkills: readStringArray(item, "missingSkills", issues, "fitScore"),
    gaps: readStringArray(item, "gaps", issues, "fitScore"),
  };
}

function stripMarkdownFence(value: string): string {
  const match = value.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match?.[1]?.trim() ?? value;
}

function extractJsonObject(value: string): string {
  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return value;
  }

  return value.slice(start, end + 1);
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function readObject(value: unknown, path: string, issues: string[]): JsonObject {
  if (isJsonObject(value)) {
    return value;
  }

  issues.push(`${path} must be an object`);
  return {};
}

function readRequiredString(
  source: JsonObject,
  key: string,
  issues: string[],
  path?: string
): string {
  const value = source[key];
  const fullPath = path ? `${path}.${key}` : key;

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  issues.push(`${fullPath} must be a non-empty string`);
  return "";
}

function readOptionalString(
  source: JsonObject,
  key: string,
  issues: string[],
  path?: string
): string | undefined {
  const value = source[key];
  const fullPath = path ? `${path}.${key}` : key;

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  issues.push(`${fullPath} must be a string when provided`);
  return undefined;
}

function readNullableString(
  source: JsonObject,
  key: string,
  issues: string[],
  path?: string
): string | null {
  const value = source[key];
  const fullPath = path ? `${path}.${key}` : key;

  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  issues.push(`${fullPath} must be a string or null`);
  return null;
}

function readOptionalNullableString(
  source: JsonObject,
  key: string,
  issues: string[],
  path?: string
): string | null | undefined {
  if (!(key in source)) {
    return undefined;
  }

  return readNullableString(source, key, issues, path);
}

function readArray(
  source: JsonObject,
  key: string,
  issues: string[],
  path?: string
): unknown[] {
  const value = source[key];
  const fullPath = path ? `${path}.${key}` : key;

  if (Array.isArray(value)) {
    return value;
  }

  issues.push(`${fullPath} must be an array`);
  return [];
}

function readStringArray(
  source: JsonObject,
  key: string,
  issues: string[],
  path?: string
): string[] {
  return readArray(source, key, issues, path)
    .map((value, index) => {
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }

      const fullPath = path ? `${path}.${key}` : key;
      issues.push(`${fullPath}[${index}] must be a non-empty string`);
      return "";
    })
    .filter(Boolean);
}

function readOptionalStringArray(
  source: JsonObject,
  key: string,
  issues: string[],
  path?: string
): string[] | undefined {
  if (!(key in source)) {
    return undefined;
  }

  return readStringArray(source, key, issues, path);
}

function readScore(
  source: JsonObject,
  key: string,
  issues: string[],
  path: string
): number {
  const value = source[key];
  const fullPath = `${path}.${key}`;

  if (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100) {
    return value;
  }

  issues.push(`${fullPath} must be a number from 0 to 100`);
  return 0;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}
