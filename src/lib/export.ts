/**
 * Resume export utilities.
 * Generates valid PDF and DOCX files from resume data.
 */

import PDFDocument from "pdfkit";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { Resume } from "@/types/resume";

export async function generatePDF(resume: Resume): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(22).text(resume.personalInfo.fullName, { align: "center" });
    doc.moveDown(0.4);
    doc.fontSize(10).text(contactLine(resume), { align: "center" });
    doc.moveDown();

    addPdfSection(doc, "Professional Summary");
    doc.fontSize(10).text(resume.summary);
    doc.moveDown();

    if (resume.skills.length > 0) {
      addPdfSection(doc, "Skills");
      doc.fontSize(10).text(resume.skills.join(", "));
      doc.moveDown();
    }

    if (resume.workExperience.length > 0) {
      addPdfSection(doc, "Work Experience");
      resume.workExperience.forEach((experience) => {
        doc.fontSize(11).font("Helvetica-Bold").text(experience.position);
        doc.fontSize(10).font("Helvetica").text(
          `${experience.company} | ${experience.startDate} - ${experience.endDate || "Present"}`
        );
        if (experience.location) {
          doc.text(experience.location);
        }
        if (experience.description) {
          doc.text(experience.description);
        }
        experience.achievements.forEach((achievement) => {
          doc.text(`- ${achievement}`, { indent: 12 });
        });
        doc.moveDown(0.5);
      });
    }

    if (resume.education.length > 0) {
      addPdfSection(doc, "Education");
      resume.education.forEach((education) => {
        doc.fontSize(11).font("Helvetica-Bold").text(`${education.degree} in ${education.field}`);
        doc.fontSize(10).font("Helvetica").text(
          `${education.institution} | ${education.startDate} - ${education.endDate || "Present"}`
        );
        if (education.gpa) {
          doc.text(`GPA: ${education.gpa}`);
        }
        doc.moveDown(0.5);
      });
    }

    if (resume.projects.length > 0) {
      addPdfSection(doc, "Projects");
      resume.projects.forEach((project) => {
        doc.fontSize(11).font("Helvetica-Bold").text(project.name);
        doc.fontSize(10).font("Helvetica").text(project.description);
        doc.text(`Technologies: ${project.technologies.join(", ")}`);
        project.highlights.forEach((highlight) => {
          doc.text(`- ${highlight}`, { indent: 12 });
        });
        doc.moveDown(0.5);
      });
    }

    if (resume.certifications.length > 0) {
      addPdfSection(doc, "Certifications");
      resume.certifications.forEach((certification) => {
        doc.fontSize(10).font("Helvetica").text(
          `${certification.name} - ${certification.issuer} (${certification.dateIssued})`
        );
      });
      doc.moveDown();
    }

    addPdfSection(doc, "Job Fit");
    doc.fontSize(10).font("Helvetica").text(`Overall: ${resume.fitScore.overall}%`);
    doc.text(
      `Skills: ${resume.fitScore.breakdown.skills}% | Experience: ${resume.fitScore.breakdown.experience}% | Education: ${resume.fitScore.breakdown.education}%`
    );

    doc.end();
  });
}

export async function generateDOCX(resume: Resume): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: resume.personalInfo.fullName, bold: true, size: 32 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun(contactLine(resume))],
    }),
    new Paragraph({ text: "" }),
    sectionHeading("Professional Summary"),
    new Paragraph(resume.summary),
  ];

  if (resume.skills.length > 0) {
    children.push(sectionHeading("Skills"));
    children.push(new Paragraph(resume.skills.join(", ")));
  }

  if (resume.workExperience.length > 0) {
    children.push(sectionHeading("Work Experience"));
    resume.workExperience.forEach((experience) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: experience.position, bold: true })],
      }));
      children.push(new Paragraph(
        `${experience.company} | ${experience.startDate} - ${experience.endDate || "Present"}`
      ));
      if (experience.location) {
        children.push(new Paragraph(experience.location));
      }
      if (experience.description) {
        children.push(new Paragraph(experience.description));
      }
      experience.achievements.forEach((achievement) => {
        children.push(new Paragraph({ text: achievement, bullet: { level: 0 } }));
      });
    });
  }

  if (resume.education.length > 0) {
    children.push(sectionHeading("Education"));
    resume.education.forEach((education) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: `${education.degree} in ${education.field}`, bold: true })],
      }));
      children.push(new Paragraph(
        `${education.institution} | ${education.startDate} - ${education.endDate || "Present"}`
      ));
      if (education.gpa) {
        children.push(new Paragraph(`GPA: ${education.gpa}`));
      }
    });
  }

  if (resume.projects.length > 0) {
    children.push(sectionHeading("Projects"));
    resume.projects.forEach((project) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: project.name, bold: true })],
      }));
      children.push(new Paragraph(project.description));
      children.push(new Paragraph(`Technologies: ${project.technologies.join(", ")}`));
      project.highlights.forEach((highlight) => {
        children.push(new Paragraph({ text: highlight, bullet: { level: 0 } }));
      });
    });
  }

  if (resume.certifications.length > 0) {
    children.push(sectionHeading("Certifications"));
    resume.certifications.forEach((certification) => {
      children.push(new Paragraph(
        `${certification.name} - ${certification.issuer} (${certification.dateIssued})`
      ));
    });
  }

  children.push(sectionHeading("Job Fit"));
  children.push(new Paragraph(`Overall: ${resume.fitScore.overall}%`));
  children.push(new Paragraph(
    `Skills: ${resume.fitScore.breakdown.skills}% | Experience: ${resume.fitScore.breakdown.experience}% | Education: ${resume.fitScore.breakdown.education}%`
  ));

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

function addPdfSection(doc: PDFKit.PDFDocument, title: string): void {
  doc.fontSize(13).font("Helvetica-Bold").text(title.toUpperCase());
  doc.moveDown(0.25);
  doc.font("Helvetica");
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
  });
}

function contactLine(resume: Resume): string {
  return [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
    resume.personalInfo.linkedin,
    resume.personalInfo.github,
    resume.personalInfo.portfolio,
  ].filter(Boolean).join(" | ");
}
