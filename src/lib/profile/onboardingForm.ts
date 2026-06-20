import type {
  Certification,
  Education,
  Project,
  WorkExperience,
} from "@/types/profile";

export function parseLineList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createEmptyWorkExperience(): WorkExperience {
  return {
    id: crypto.randomUUID(),
    company: "",
    position: "",
    startDate: "",
    endDate: null,
    location: "",
    description: "",
    achievements: [],
  };
}

export function createEmptyEducation(): Education {
  return {
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: null,
    gpa: "",
    honors: [],
  };
}

export function createEmptyProject(): Project {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    technologies: [],
    url: "",
    startDate: "",
    endDate: "",
    highlights: [],
  };
}

export function createEmptyCertification(): Certification {
  return {
    id: crypto.randomUUID(),
    name: "",
    issuer: "",
    dateIssued: "",
    expirationDate: null,
    credentialId: "",
    url: "",
  };
}
