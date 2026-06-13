"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile, WorkExperience, Education, Project, Certification } from "@/types/profile";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"personal" | "experience" | "education" | "skills" | "projects" | "certifications">("personal");

  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
  });

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState({
    technical: [] as string[],
    soft: [] as string[],
    languages: [] as string[],
  });
  const [projects] = useState<Project[]>([]);
  const [certifications] = useState<Certification[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  // Handle save profile
  const handleSaveProfile = async () => {
    setIsSaving(true);

    const profile: Profile = {
      id: crypto.randomUUID(),
      personalInfo,
      workExperience,
      education,
      skills,
      projects,
      certifications,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error("Failed to save profile");

      router.push("/builder");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Build Your Master Profile
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Enter your real work history, skills, and achievements. This is your source of truth.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 flex gap-2">
          {["personal", "experience", "education", "skills", "projects", "certifications"].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s as typeof step)}
              className={`flex-1 h-2 rounded-full transition-colors ${
                step === s ? "bg-zinc-900 dark:bg-zinc-50" : "bg-zinc-200 dark:bg-zinc-800"
              }`}
              aria-label={`Go to ${s} step`}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
          {/* Personal Info Step */}
          {step === "personal" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Personal Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  GitHub
                </label>
                <input
                  type="url"
                  value={personalInfo.github}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Portfolio
                </label>
                <input
                  type="url"
                  value={personalInfo.portfolio}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  placeholder="https://yoursite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Professional Summary
                </label>
                <textarea
                  value={personalInfo.summary}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  placeholder="A brief overview of your professional background..."
                />
              </div>

              <button
                onClick={() => setStep("experience")}
                disabled={!personalInfo.fullName || !personalInfo.email}
                className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 py-2 px-4 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Work Experience
              </button>
            </div>
          )}

          {/* Work Experience Step */}
          {step === "experience" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Work Experience
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Add your work history. You can skip this and add it later.
              </p>

              {workExperience.map((exp, index) => (
                <div key={exp.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">{exp.position}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{exp.company}</p>
                    </div>
                    <button
                      onClick={() => setWorkExperience(workExperience.filter((_, i) => i !== index))}
                      className="text-red-600 dark:text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newExp: WorkExperience = {
                    id: crypto.randomUUID(),
                    company: "",
                    position: "",
                    startDate: "",
                    endDate: null,
                    description: "",
                    achievements: [],
                  };
                  setWorkExperience([...workExperience, newExp]);
                }}
                className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 py-3 px-4 rounded-md text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
              >
                + Add Work Experience
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("personal")}
                  className="flex-1 border border-zinc-300 dark:border-zinc-700 py-2 px-4 rounded-md font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("education")}
                  className="flex-1 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 py-2 px-4 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                  Next: Education
                </button>
              </div>
            </div>
          )}

          {/* Education Step */}
          {step === "education" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Education
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Add your educational background.
              </p>

              {education.map((edu, index) => (
                <div key={edu.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">{edu.degree} in {edu.field}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{edu.institution}</p>
                    </div>
                    <button
                      onClick={() => setEducation(education.filter((_, i) => i !== index))}
                      className="text-red-600 dark:text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newEdu: Education = {
                    id: crypto.randomUUID(),
                    institution: "",
                    degree: "",
                    field: "",
                    startDate: "",
                    endDate: null,
                  };
                  setEducation([...education, newEdu]);
                }}
                className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 py-3 px-4 rounded-md text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
              >
                + Add Education
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("experience")}
                  className="flex-1 border border-zinc-300 dark:border-zinc-700 py-2 px-4 rounded-md font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("skills")}
                  className="flex-1 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 py-2 px-4 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                  Next: Skills
                </button>
              </div>
            </div>
          )}

          {/* Skills Step */}
          {step === "skills" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Skills
              </h2>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Technical Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g., JavaScript, React, Node.js (comma-separated)"
                  onBlur={(e) => {
                    if (e.target.value) {
                      setSkills({
                        ...skills,
                        technical: e.target.value.split(",").map((s) => s.trim()),
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                {skills.technical.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skills.technical.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-sm text-zinc-700 dark:text-zinc-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Soft Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g., Leadership, Communication (comma-separated)"
                  onBlur={(e) => {
                    if (e.target.value) {
                      setSkills({
                        ...skills,
                        soft: e.target.value.split(",").map((s) => s.trim()),
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                {skills.soft.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skills.soft.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-sm text-zinc-700 dark:text-zinc-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Languages
                </label>
                <input
                  type="text"
                  placeholder="e.g., English (Native), Spanish (Fluent)"
                  onBlur={(e) => {
                    if (e.target.value) {
                      setSkills({
                        ...skills,
                        languages: e.target.value.split(",").map((s) => s.trim()),
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                {skills.languages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skills.languages.map((lang, i) => (
                      <span key={i} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-sm text-zinc-700 dark:text-zinc-300">
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("education")}
                  className="flex-1 border border-zinc-300 dark:border-zinc-700 py-2 px-4 rounded-md font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("projects")}
                  className="flex-1 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 py-2 px-4 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                  Next: Projects
                </button>
              </div>
            </div>
          )}

          {/* Projects Step */}
          {step === "projects" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Projects (Optional)
              </h2>

              {projects.length === 0 && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No projects added yet.
                </p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("skills")}
                  className="flex-1 border border-zinc-300 dark:border-zinc-700 py-2 px-4 rounded-md font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("certifications")}
                  className="flex-1 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 py-2 px-4 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                  Next: Certifications
                </button>
              </div>
            </div>
          )}

          {/* Certifications Step */}
          {step === "certifications" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Certifications (Optional)
              </h2>

              {certifications.length === 0 && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No certifications added yet.
                </p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("projects")}
                  className="flex-1 border border-zinc-300 dark:border-zinc-700 py-2 px-4 rounded-md font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 py-2 px-4 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Complete & Continue"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
