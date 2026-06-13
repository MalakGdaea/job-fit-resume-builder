/**
 * Profile — User's permanent, complete work history and experience
 * This is the source of truth. Never mutate this with AI-generated content.
 */

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string; // ISO date or "YYYY-MM"
  endDate: string | null; // null = current
  location?: string;
  description: string;
  achievements: string[]; // Bullet points of real accomplishments
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  gpa?: string;
  honors?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateIssued: string;
  expirationDate?: string | null;
  credentialId?: string;
  url?: string;
}

export interface Profile {
  id: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    summary?: string; // Professional summary/bio
  };
  workExperience: WorkExperience[];
  education: Education[];
  skills: {
    technical: string[]; // Programming languages, frameworks, tools
    soft: string[]; // Communication, leadership, etc.
    languages: string[]; // English (native), Spanish (fluent), etc.
  };
  projects: Project[];
  certifications: Certification[];
  createdAt: string;
  updatedAt: string;
}
