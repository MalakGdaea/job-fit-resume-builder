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
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: null,
      location: "",
      description: "",
      achievements: [],
    };

    setWorkExperience((current) => [...current, newExperience]);
  };

  const updateWorkExperience = (
    id: string,
    updates: Partial<WorkExperience>
  ) => {
    setWorkExperience((current) =>
      current.map((experience) =>
        experience.id === id ? { ...experience, ...updates } : experience
      )
    );
  };

  const removeWorkExperience = (id: string) => {
    setWorkExperience((current) =>
      current.filter((experience) => experience.id !== id)
    );
  };

  const parseAchievementLines = (value: string) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: null,
      gpa: "",
      honors: [],
    };

    setEducation((current) => [...current, newEducation]);
  };

  const updateEducation = (
    id: string,
    updates: Partial<Education>
  ) => {
    setEducation((current) =>
      current.map((educationItem) =>
        educationItem.id === id ? { ...educationItem, ...updates } : educationItem
      )
    );
  };

  const removeEducation = (id: string) => {
    setEducation((current) =>
      current.filter((educationItem) => educationItem.id !== id)
    );
  };

  const parseLineList = (value: string) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
      highlights: [],
    };

    setProjects((current) => [...current, newProject]);
  };

  const updateProject = (
    id: string,
    updates: Partial<Project>
  ) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const removeProject = (id: string) => {
    setProjects((current) =>
      current.filter((project) => project.id !== id)
    );
  };

  const parseCommaList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const addCertification = () => {
    const newCertification: Certification = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      dateIssued: "",
      expirationDate: null,
      credentialId: "",
      url: "",
    };

    setCertifications((current) => [...current, newCertification]);
  };

  const updateCertification = (
    id: string,
    updates: Partial<Certification>
  ) => {
    setCertifications((current) =>
      current.map((certification) =>
        certification.id === id ? { ...certification, ...updates } : certification
      )
    );
  };

  const removeCertification = (id: string) => {
    setCertifications((current) =>
      current.filter((certification) => certification.id !== id)
    );
  };

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
                <div key={exp.id} className="space-y-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                        Experience {index + 1}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {exp.position || exp.company
                          ? [exp.position, exp.company].filter(Boolean).join(" at ")
                          : "Add role details"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWorkExperience(exp.id)}
                      className="text-red-600 dark:text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(event) =>
                          updateWorkExperience(exp.id, { position: event.target.value })
                        }
                        placeholder="Software Engineer"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Company *
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(event) =>
                          updateWorkExperience(exp.id, { company: event.target.value })
                        }
                        placeholder="Company name"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location ?? ""}
                      onChange={(event) =>
                        updateWorkExperience(exp.id, { location: event.target.value })
                      }
                      placeholder="City, country or Remote"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={exp.endDate === null}
                      onChange={(event) =>
                        updateWorkExperience(exp.id, {
                          endDate: event.target.checked ? null : "",
                        })
                      }
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    I am currently working in this role
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Start date *
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(event) =>
                          updateWorkExperience(exp.id, { startDate: event.target.value })
                        }
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        End date
                      </label>
                      <input
                        type="month"
                        value={exp.endDate ?? ""}
                        disabled={exp.endDate === null}
                        onChange={(event) =>
                          updateWorkExperience(exp.id, { endDate: event.target.value })
                        }
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(event) =>
                        updateWorkExperience(exp.id, { description: event.target.value })
                      }
                      rows={3}
                      placeholder="Briefly describe your role and scope."
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Achievements
                    </label>
                    <textarea
                      value={exp.achievements.join("\n")}
                      onChange={(event) =>
                        updateWorkExperience(exp.id, {
                          achievements: parseAchievementLines(event.target.value),
                        })
                      }
                      rows={5}
                      placeholder="One achievement per line"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Use real accomplishments only. These become resume bullet points.
                    </p>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addWorkExperience}
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
                <div key={edu.id} className="space-y-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                        Education {index + 1}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {edu.degree || edu.institution
                          ? [edu.degree, edu.institution].filter(Boolean).join(" at ")
                          : "Add school details"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-600 dark:text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      School *
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(event) =>
                        updateEducation(edu.id, { institution: event.target.value })
                      }
                      placeholder="University or school name"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Degree *
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(event) =>
                          updateEducation(edu.id, { degree: event.target.value })
                        }
                        placeholder="Bachelor's, Master's, Certificate"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Field of study *
                      </label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(event) =>
                          updateEducation(edu.id, { field: event.target.value })
                        }
                        placeholder="Computer Science"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={edu.endDate === null}
                      onChange={(event) =>
                        updateEducation(edu.id, {
                          endDate: event.target.checked ? null : "",
                        })
                      }
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    I am currently studying here
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Start date *
                      </label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(event) =>
                          updateEducation(edu.id, { startDate: event.target.value })
                        }
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        End date
                      </label>
                      <input
                        type="month"
                        value={edu.endDate ?? ""}
                        disabled={edu.endDate === null}
                        onChange={(event) =>
                          updateEducation(edu.id, { endDate: event.target.value })
                        }
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Grade or GPA
                    </label>
                    <input
                      type="text"
                      value={edu.gpa ?? ""}
                      onChange={(event) =>
                        updateEducation(edu.id, { gpa: event.target.value })
                      }
                      placeholder="3.8 GPA, First Class Honors, 90%"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Activities, honors, or awards
                    </label>
                    <textarea
                      value={(edu.honors ?? []).join("\n")}
                      onChange={(event) =>
                        updateEducation(edu.id, {
                          honors: parseLineList(event.target.value),
                        })
                      }
                      rows={4}
                      placeholder="One activity, honor, or award per line"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addEducation}
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

              {projects.map((project, index) => (
                <div key={project.id} className="space-y-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                        Project {index + 1}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {project.name || "Add project details"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(project.id)}
                      className="text-red-600 dark:text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Project name *
                    </label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(event) =>
                        updateProject(project.id, { name: event.target.value })
                      }
                      placeholder="Portfolio website, analytics dashboard, mobile app"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Project URL
                    </label>
                    <input
                      type="url"
                      value={project.url ?? ""}
                      onChange={(event) =>
                        updateProject(project.id, { url: event.target.value })
                      }
                      placeholder="https://github.com/username/project"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Start date
                      </label>
                      <input
                        type="month"
                        value={project.startDate ?? ""}
                        onChange={(event) =>
                          updateProject(project.id, { startDate: event.target.value })
                        }
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        End date
                      </label>
                      <input
                        type="month"
                        value={project.endDate ?? ""}
                        onChange={(event) =>
                          updateProject(project.id, { endDate: event.target.value })
                        }
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={project.description}
                      onChange={(event) =>
                        updateProject(project.id, { description: event.target.value })
                      }
                      rows={3}
                      placeholder="Describe what the project does, who it serves, and your role."
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Technologies
                    </label>
                    <input
                      type="text"
                      value={project.technologies.join(", ")}
                      onChange={(event) =>
                        updateProject(project.id, {
                          technologies: parseCommaList(event.target.value),
                        })
                      }
                      placeholder="React, TypeScript, PostgreSQL"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Highlights
                    </label>
                    <textarea
                      value={project.highlights.join("\n")}
                      onChange={(event) =>
                        updateProject(project.id, {
                          highlights: parseLineList(event.target.value),
                        })
                      }
                      rows={5}
                      placeholder="One project highlight per line"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addProject}
                className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 py-3 px-4 rounded-md text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
              >
                + Add Project
              </button>

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

              {certifications.map((certification, index) => (
                <div key={certification.id} className="space-y-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                        Certification {index + 1}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {certification.name || certification.issuer
                          ? [certification.name, certification.issuer].filter(Boolean).join(" from ")
                          : "Add certification details"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCertification(certification.id)}
                      className="text-red-600 dark:text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={certification.name}
                      onChange={(event) =>
                        updateCertification(certification.id, { name: event.target.value })
                      }
                      placeholder="AWS Certified Developer, Google Data Analytics"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Issuing organization *
                    </label>
                    <input
                      type="text"
                      value={certification.issuer}
                      onChange={(event) =>
                        updateCertification(certification.id, { issuer: event.target.value })
                      }
                      placeholder="Amazon Web Services, Coursera, Microsoft"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={certification.expirationDate === null}
                      onChange={(event) =>
                        updateCertification(certification.id, {
                          expirationDate: event.target.checked ? null : "",
                        })
                      }
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    This credential does not expire
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Issue date *
                      </label>
                      <input
                        type="month"
                        value={certification.dateIssued}
                        onChange={(event) =>
                          updateCertification(certification.id, { dateIssued: event.target.value })
                        }
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Expiration date
                      </label>
                      <input
                        type="month"
                        value={certification.expirationDate ?? ""}
                        disabled={certification.expirationDate === null}
                        onChange={(event) =>
                          updateCertification(certification.id, { expirationDate: event.target.value })
                        }
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      value={certification.credentialId ?? ""}
                      onChange={(event) =>
                        updateCertification(certification.id, { credentialId: event.target.value })
                      }
                      placeholder="Credential number or license ID"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Credential URL
                    </label>
                    <input
                      type="url"
                      value={certification.url ?? ""}
                      onChange={(event) =>
                        updateCertification(certification.id, { url: event.target.value })
                      }
                      placeholder="https://www.credential.net/..."
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addCertification}
                className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 py-3 px-4 rounded-md text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
              >
                + Add Certification
              </button>

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
