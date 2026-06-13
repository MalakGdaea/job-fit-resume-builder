/**
 * Resume — Generated, job-specific tailored output
 * Derived from Profile, shaped to fit a specific job description.
 * Always disposable and regeneratable.
 */

export interface TailoredWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  location?: string;
  description: string;
  achievements: string[]; // Reordered/rephrased from profile to match JD
}

export interface TailoredEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  gpa?: string;
  honors?: string[];
}

export interface TailoredProject {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  highlights: string[];
}

export interface TailoredCertification {
  name: string;
  issuer: string;
  dateIssued: string;
  expirationDate?: string | null;
  credentialId?: string;
  url?: string;
}

export interface FitScore {
  overall: number; // 0-100
  breakdown: {
    skills: number;
    experience: number;
    education: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  gaps: string[]; // Human-readable gap analysis
}

export interface Resume {
  id: string;
  profileId: string; // Reference to source profile
  jobTitle: string; // From job description
  company?: string; // From job description
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string; // AI-tailored professional summary
  workExperience: TailoredWorkExperience[];
  education: TailoredEducation[];
  skills: string[]; // Prioritized skills relevant to JD
  projects: TailoredProject[];
  certifications: TailoredCertification[];
  fitScore: FitScore;
  createdAt: string;
  jobDescription?: string; // Optional: store the JD for reference
}
