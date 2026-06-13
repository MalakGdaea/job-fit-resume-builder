/**
 * AI Prompt Templates
 * All prompts must be defined here — never hardcode prompts elsewhere
 */

import type { Profile } from "@/types/profile";

/**
 * Core resume tailoring prompt
 * Takes user's complete profile and a job description, outputs a tailored resume
 */
export function createTailoringPrompt(
  profile: Profile,
  jobDescription: string
): string {
  return `You are an expert resume writer specializing in tailoring resumes to match specific job descriptions.

CRITICAL RULES:
1. NEVER fabricate, invent, or exaggerate any experience, skills, or credentials
2. ONLY use information explicitly provided in the user's profile
3. If a required skill is missing from the profile, note it in the gaps analysis — DO NOT add it to the resume
4. Reframe and reprioritize real experience to align with the job description
5. Reorder and rephrase achievements to emphasize relevant accomplishments
6. Keep all dates, companies, and titles exactly as provided

---

USER'S PROFILE:

Name: ${profile.personalInfo.fullName}
Email: ${profile.personalInfo.email}
${profile.personalInfo.phone ? `Phone: ${profile.personalInfo.phone}` : ""}
${profile.personalInfo.location ? `Location: ${profile.personalInfo.location}` : ""}
${profile.personalInfo.linkedin ? `LinkedIn: ${profile.personalInfo.linkedin}` : ""}
${profile.personalInfo.github ? `GitHub: ${profile.personalInfo.github}` : ""}
${profile.personalInfo.portfolio ? `Portfolio: ${profile.personalInfo.portfolio}` : ""}

${profile.personalInfo.summary ? `Professional Summary:\n${profile.personalInfo.summary}\n` : ""}

WORK EXPERIENCE:
${profile.workExperience
  .map(
    (exp) => `
- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})
  ${exp.location ? `Location: ${exp.location}` : ""}
  ${exp.description}
  Achievements:
${exp.achievements.map((ach) => `  • ${ach}`).join("\n")}
`
  )
  .join("\n")}

EDUCATION:
${profile.education
  .map(
    (edu) => `
- ${edu.degree} in ${edu.field}
  ${edu.institution} (${edu.startDate} - ${edu.endDate || "Present"})
  ${edu.gpa ? `GPA: ${edu.gpa}` : ""}
  ${edu.honors?.length ? `Honors: ${edu.honors.join(", ")}` : ""}
`
  )
  .join("\n")}

SKILLS:
Technical: ${profile.skills.technical.join(", ")}
Soft Skills: ${profile.skills.soft.join(", ")}
Languages: ${profile.skills.languages.join(", ")}

${
  profile.projects.length > 0
    ? `PROJECTS:
${profile.projects
  .map(
    (proj) => `
- ${proj.name}
  ${proj.description}
  Technologies: ${proj.technologies.join(", ")}
  ${proj.url ? `URL: ${proj.url}` : ""}
  Highlights:
${proj.highlights.map((h) => `  • ${h}`).join("\n")}
`
  )
  .join("\n")}`
    : ""
}

${
  profile.certifications.length > 0
    ? `CERTIFICATIONS:
${profile.certifications
  .map(
    (cert) => `
- ${cert.name} (${cert.issuer}, ${cert.dateIssued})
  ${cert.credentialId ? `ID: ${cert.credentialId}` : ""}
  ${cert.url ? `URL: ${cert.url}` : ""}
`
  )
  .join("\n")}`
    : ""
}

---

JOB DESCRIPTION:

${jobDescription}

---

TASK:

Create a tailored resume that:
1. Highlights the most relevant experience and skills for this specific role
2. Reorders achievements to put job-relevant accomplishments first
3. Rephrases bullet points to mirror language and keywords from the job description (WITHOUT lying or exaggerating)
4. Writes a compelling professional summary tailored to this role
5. Selects and prioritizes the most relevant projects and skills
6. Analyzes fit and identifies any gaps

Return your response as valid JSON matching this exact structure:

{
  "summary": "A 2-3 sentence professional summary tailored to this role",
  "workExperience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or null",
      "location": "City, State",
      "description": "One-line role description",
      "achievements": ["Rephrased achievement 1", "Rephrased achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "field": "Field of Study",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or null",
      "gpa": "3.8",
      "honors": ["Honor 1"]
    }
  ],
  "skills": ["Prioritized skill 1", "Prioritized skill 2"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Tailored description",
      "technologies": ["Tech 1"],
      "url": "https://...",
      "highlights": ["Highlight 1"]
    }
  ],
  "certifications": [
    {
      "name": "Cert Name",
      "issuer": "Issuing Org",
      "dateIssued": "YYYY-MM",
      "credentialId": "ID",
      "url": "https://..."
    }
  ],
  "fitScore": {
    "overall": 85,
    "breakdown": {
      "skills": 90,
      "experience": 85,
      "education": 80
    },
    "matchedSkills": ["Skill 1", "Skill 2"],
    "missingSkills": ["Skill 3"],
    "gaps": ["Gap analysis point 1", "Gap analysis point 2"]
  }
}

Return ONLY valid JSON. Do not include any explanatory text before or after the JSON.`;
}

/**
 * Job description extraction prompt
 * Parses a job description to extract key requirements
 */
export function createJobDescriptionExtractionPrompt(
  jobDescription: string
): string {
  return `Analyze this job description and extract the key requirements.

JOB DESCRIPTION:
${jobDescription}

Return a JSON object with:
{
  "jobTitle": "extracted job title",
  "company": "company name if mentioned",
  "requiredSkills": ["skill1", "skill2"],
  "preferredSkills": ["skill1", "skill2"],
  "experienceLevel": "entry/mid/senior",
  "keyResponsibilities": ["responsibility1", "responsibility2"],
  "educationRequirements": ["requirement1"]
}

Return ONLY valid JSON.`;
}
