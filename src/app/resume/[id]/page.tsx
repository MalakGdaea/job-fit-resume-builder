"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Resume } from "@/types/resume";

export default function ResumePage() {
  const params = useParams();
  const resumeId = params.id as string;

  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resume/${resumeId}`);
        if (!response.ok) throw new Error("Failed to load resume");

        const data = await response.json();
        setResume(data.resume);
      } catch (err) {
        console.error("Error loading resume:", err);
        setError(err instanceof Error ? err.message : "Failed to load resume");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  const handleExport = async (format: "pdf" | "docx") => {
    setIsExporting(true);

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, format }),
      });

      if (!response.ok) throw new Error("Failed to export resume");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${resumeId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error exporting resume:", err);
      alert("Failed to export resume. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-50 mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || "Resume not found"}</p>
          <a href="/builder" className="text-zinc-900 dark:text-zinc-50 underline">
            Back to Builder
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with actions */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Your Tailored Resume
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {resume.jobTitle} {resume.company && `at ${resume.company}`}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleExport("pdf")}
              disabled={isExporting}
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
            >
              Download PDF
            </button>
            <button
              onClick={() => handleExport("docx")}
              disabled={isExporting}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-md font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              Download DOCX
            </button>
          </div>
        </div>

        {/* Fit Score Badge */}
        <div className="mb-6 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Job Fit Score
              </h3>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {resume.fitScore.overall}%
                </span>
                <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                  <span>Skills: {resume.fitScore.breakdown.skills}%</span>
                  <span>Experience: {resume.fitScore.breakdown.experience}%</span>
                  <span>Education: {resume.fitScore.breakdown.education}%</span>
                </div>
              </div>
            </div>
          </div>

          {resume.fitScore.missingSkills.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-2">
                Skills gap identified:
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                {resume.fitScore.missingSkills.join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Resume Preview */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 md:p-12">
          {/* Personal Info */}
          <div className="mb-8 text-center border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
              {resume.personalInfo.fullName}
            </h1>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span>{resume.personalInfo.email}</span>
              {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
              {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
            </div>
            {(resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.portfolio) && (
              <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm">
                {resume.personalInfo.linkedin && (
                  <a href={resume.personalInfo.linkedin} className="text-zinc-700 dark:text-zinc-300 hover:underline">
                    LinkedIn
                  </a>
                )}
                {resume.personalInfo.github && (
                  <a href={resume.personalInfo.github} className="text-zinc-700 dark:text-zinc-300 hover:underline">
                    GitHub
                  </a>
                )}
                {resume.personalInfo.portfolio && (
                  <a href={resume.personalInfo.portfolio} className="text-zinc-700 dark:text-zinc-300 hover:underline">
                    Portfolio
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Summary */}
          {resume.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 uppercase tracking-wide border-b-2 border-zinc-900 dark:border-zinc-50 pb-1">
                Professional Summary
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {resume.summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {resume.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 uppercase tracking-wide border-b-2 border-zinc-900 dark:border-zinc-50 pb-1">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {resume.workExperience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 uppercase tracking-wide border-b-2 border-zinc-900 dark:border-zinc-50 pb-1">
                Work Experience
              </h2>
              <div className="space-y-6">
                {resume.workExperience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                          {exp.position}
                        </h3>
                        <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-right text-sm text-zinc-600 dark:text-zinc-400">
                        <p>{exp.startDate} - {exp.endDate || "Present"}</p>
                        {exp.location && <p>{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-zinc-600 dark:text-zinc-400 mb-2 italic">
                        {exp.description}
                      </p>
                    )}
                    {exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="ml-2">
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 uppercase tracking-wide border-b-2 border-zinc-900 dark:border-zinc-50 pb-1">
                Education
              </h2>
              <div className="space-y-4">
                {resume.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-zinc-700 dark:text-zinc-300">
                          {edu.institution}
                        </p>
                        {edu.gpa && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            GPA: {edu.gpa}
                          </p>
                        )}
                        {edu.honors && edu.honors.length > 0 && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {edu.honors.join(", ")}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {edu.startDate} - {edu.endDate || "Present"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 uppercase tracking-wide border-b-2 border-zinc-900 dark:border-zinc-50 pb-1">
                Projects
              </h2>
              <div className="space-y-4">
                {resume.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      {project.name}
                      {project.url && (
                        <a
                          href={project.url}
                          className="ml-2 text-sm text-zinc-600 dark:text-zinc-400 hover:underline"
                        >
                          [link]
                        </a>
                      )}
                    </h3>
                    <p className="text-zinc-700 dark:text-zinc-300 mb-1">
                      {project.description}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      <strong>Technologies:</strong> {project.technologies.join(", ")}
                    </p>
                    {project.highlights.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                        {project.highlights.map((highlight, i) => (
                          <li key={i} className="ml-2">
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 uppercase tracking-wide border-b-2 border-zinc-900 dark:border-zinc-50 pb-1">
                Certifications
              </h2>
              <div className="space-y-3">
                {resume.certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                      {cert.name}
                      {cert.url && (
                        <a
                          href={cert.url}
                          className="ml-2 text-sm text-zinc-600 dark:text-zinc-400 hover:underline"
                        >
                          [verify]
                        </a>
                      )}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {cert.issuer} • {cert.dateIssued}
                      {cert.credentialId && ` • ID: ${cert.credentialId}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="mt-6 text-center">
          <a
            href="/builder"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 underline"
          >
            Generate another resume
          </a>
        </div>
      </div>
    </div>
  );
}
