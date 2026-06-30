/**
 * Resume export utilities.
 * Generates resume-like PDF and DOCX files from the same resume data shown in
 * the preview page.
 */

import PDFDocument from "pdfkit";
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { normalizeExternalUrl } from "@/lib/url";
import { getDescriptionBulletItems } from "@/lib/resume/bullets";
import type { Resume } from "@/types/resume";

type ContactItem = {
  label: string;
  url?: string;
};

const PAGE_MARGIN = 44;
const PDF_TEXT_WIDTH = 504;

export async function generatePDF(resume: Resume): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: PAGE_MARGIN,
      size: "LETTER",
      bufferPages: true,
    });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    renderPdfResume(doc, resume);
    doc.end();
  });
}

export async function generateDOCX(resume: Resume): Promise<Buffer> {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 20,
          },
          paragraph: {
            spacing: { after: 120 },
          },
        },
      },
      paragraphStyles: [
        {
          id: "ResumeHeading",
          name: "Resume Heading",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            bold: true,
            allCaps: true,
            size: 24,
          },
          paragraph: {
            border: {
              bottom: {
                color: "111827",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 8,
              },
            },
            spacing: { before: 220, after: 120 },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: renderDocxResume(resume),
      },
    ],
  });

  return Packer.toBuffer(doc);
}

function renderPdfResume(doc: PDFKit.PDFDocument, resume: Resume): void {
  doc.fillColor("#111827").font("Helvetica-Bold").fontSize(24);
  doc.text(resume.personalInfo.fullName, { align: "center" });
  doc.moveDown(0.25);
  renderPdfContactLine(doc, getContactItems(resume));
  doc.moveDown(0.9);

  addPdfSection(doc, "Professional Summary");
  addPdfParagraph(doc, resume.summary);

  if (resume.skills.length > 0) {
    addPdfSection(doc, "Skills");
    addPdfParagraph(doc, resume.skills.join(", "));
  }

  if (resume.workExperience.length > 0) {
    addPdfSection(doc, "Work Experience");
    resume.workExperience.forEach((experience) => {
      addPdfRoleHeader(doc, experience.position, [
        experience.company,
        `${experience.startDate} - ${experience.endDate || "Present"}`,
        experience.location,
      ]);
      addPdfBullets(
        doc,
        getDescriptionBulletItems(
          experience.description,
          experience.achievements
        )
      );
      doc.moveDown(0.35);
    });
  }

  if (resume.education.length > 0) {
    addPdfSection(doc, "Education");
    resume.education.forEach((education) => {
      addPdfRoleHeader(doc, `${education.degree} in ${education.field}`, [
        education.institution,
        `${education.startDate} - ${education.endDate || "Present"}`,
      ]);
      if (education.gpa) {
        addPdfParagraph(doc, `GPA: ${education.gpa}`);
      }
      if (education.honors?.length) {
        addPdfParagraph(doc, education.honors.join(", "));
      }
      doc.moveDown(0.25);
    });
  }

  if (resume.projects.length > 0) {
    addPdfSection(doc, "Projects");
    resume.projects.forEach((project) => {
      addPdfLinkedTitle(doc, project.name, project.url);
      if (project.technologies.length > 0) {
        addPdfParagraph(doc, `Technologies: ${project.technologies.join(", ")}`);
      }
      addPdfBullets(
        doc,
        getDescriptionBulletItems(project.description, project.highlights)
      );
      doc.moveDown(0.35);
    });
  }

  if (resume.certifications.length > 0) {
    addPdfSection(doc, "Certifications");
    resume.certifications.forEach((certification) => {
      addPdfLinkedTitle(doc, certification.name, certification.url);
      addPdfParagraph(
        doc,
        [
          certification.issuer,
          certification.dateIssued,
          certification.credentialId ? `ID: ${certification.credentialId}` : undefined,
        ]
          .filter(Boolean)
          .join(" | ")
      );
      doc.moveDown(0.25);
    });
  }
}

function renderDocxResume(resume: Resume): Paragraph[] {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: resume.personalInfo.fullName,
          bold: true,
          size: 36,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 260 },
      children: joinRunsWithSeparators(getDocxContactRuns(getContactItems(resume))),
    }),
    sectionHeading("Professional Summary"),
    new Paragraph({
      spacing: { after: 180 },
      children: [new TextRun(resume.summary)],
    }),
  ];

  if (resume.skills.length > 0) {
    children.push(sectionHeading("Skills"));
    children.push(new Paragraph(resume.skills.join(", ")));
  }

  if (resume.workExperience.length > 0) {
    children.push(sectionHeading("Work Experience"));
    resume.workExperience.forEach((experience) => {
      children.push(itemTitle(experience.position));
      children.push(
        metadataParagraph([
          experience.company,
          `${experience.startDate} - ${experience.endDate || "Present"}`,
          experience.location,
        ])
      );
      children.push(
        ...bulletParagraphs(
          getDescriptionBulletItems(
            experience.description,
            experience.achievements
          )
        )
      );
    });
  }

  if (resume.education.length > 0) {
    children.push(sectionHeading("Education"));
    resume.education.forEach((education) => {
      children.push(itemTitle(`${education.degree} in ${education.field}`));
      children.push(
        metadataParagraph([
          education.institution,
          `${education.startDate} - ${education.endDate || "Present"}`,
        ])
      );
      if (education.gpa) {
        children.push(new Paragraph(`GPA: ${education.gpa}`));
      }
      if (education.honors?.length) {
        children.push(new Paragraph(education.honors.join(", ")));
      }
    });
  }

  if (resume.projects.length > 0) {
    children.push(sectionHeading("Projects"));
    resume.projects.forEach((project) => {
      children.push(itemTitle(project.name, project.url));
      if (project.technologies.length > 0) {
        children.push(new Paragraph(`Technologies: ${project.technologies.join(", ")}`));
      }
      children.push(
        ...bulletParagraphs(
          getDescriptionBulletItems(project.description, project.highlights)
        )
      );
    });
  }

  if (resume.certifications.length > 0) {
    children.push(sectionHeading("Certifications"));
    resume.certifications.forEach((certification) => {
      children.push(itemTitle(certification.name, certification.url));
      children.push(
        metadataParagraph([
          certification.issuer,
          certification.dateIssued,
          certification.credentialId ? `ID: ${certification.credentialId}` : undefined,
        ])
      );
    });
  }

  return children;
}

function getContactItems(resume: Resume): ContactItem[] {
  const items: ContactItem[] = [
    {
      label: resume.personalInfo.email,
      url: `mailto:${resume.personalInfo.email}`,
    },
  ];

  if (resume.personalInfo.phone) {
    items.push({ label: resume.personalInfo.phone });
  }

  if (resume.personalInfo.location) {
    items.push({ label: resume.personalInfo.location });
  }

  if (resume.personalInfo.linkedin) {
    items.push({
      label: "LinkedIn",
      url: normalizeExternalUrl(resume.personalInfo.linkedin),
    });
  }

  if (resume.personalInfo.github) {
    items.push({
      label: "GitHub",
      url: normalizeExternalUrl(resume.personalInfo.github),
    });
  }

  if (resume.personalInfo.portfolio) {
    items.push({
      label: "Portfolio",
      url: normalizeExternalUrl(resume.personalInfo.portfolio),
    });
  }

  return items;
}

function renderPdfContactLine(
  doc: PDFKit.PDFDocument,
  contactItems: ContactItem[]
): void {
  doc.font("Helvetica").fontSize(9).fillColor("#4b5563");
  const separator = " | ";
  const textWidth = contactItems.reduce((width, item, index) => {
    const separatorWidth = index === 0 ? 0 : doc.widthOfString(separator);

    return width + separatorWidth + doc.widthOfString(item.label);
  }, 0);
  let x = PAGE_MARGIN + Math.max(0, (PDF_TEXT_WIDTH - textWidth) / 2);
  const y = doc.y;

  contactItems.forEach((item, index) => {
    if (index > 0) {
      doc.fillColor("#6b7280").text(separator, x, y, { lineBreak: false });
      x += doc.widthOfString(separator);
    }

    const labelWidth = doc.widthOfString(item.label);
    if (item.url) {
      doc.fillColor("#374151").text(item.label, x, y, { lineBreak: false });
      doc.underline(x, y + 10, labelWidth, 1, { color: "#374151" });
      doc.link(x, y, labelWidth, 12, item.url);
    } else {
      doc.fillColor("#4b5563").text(item.label, x, y, { lineBreak: false });
    }
    x += labelWidth;
  });

  doc.x = PAGE_MARGIN;
  doc.y = y + 12;
}

function addPdfSection(doc: PDFKit.PDFDocument, title: string): void {
  ensurePdfSpace(doc, 55);
  doc.moveDown(0.35);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827");
  doc.text(title.toUpperCase(), { characterSpacing: 0.4 });
  const y = doc.y + 1;
  doc.moveTo(PAGE_MARGIN, y).lineTo(PAGE_MARGIN + PDF_TEXT_WIDTH, y).strokeColor("#111827").lineWidth(1).stroke();
  doc.moveDown(0.45);
  doc.font("Helvetica").fontSize(10).fillColor("#374151");
}

function addPdfRoleHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  metadata: Array<string | undefined>
): void {
  ensurePdfSpace(doc, 45);
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#111827").text(title);
  doc.font("Helvetica").fontSize(9).fillColor("#4b5563");
  doc.text(metadata.filter(Boolean).join(" | "));
  doc.moveDown(0.25);
}

function addPdfLinkedTitle(
  doc: PDFKit.PDFDocument,
  title: string,
  url?: string
): void {
  ensurePdfSpace(doc, 35);
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#111827");
  const x = doc.x;
  const y = doc.y;
  doc.text(title);

  if (url) {
    const titleWidth = doc.widthOfString(title);
    doc.link(x, y, titleWidth, 13, normalizeExternalUrl(url));
  }
}

function addPdfParagraph(doc: PDFKit.PDFDocument, text: string): void {
  ensurePdfSpace(doc, 32);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#374151")
    .text(text, { lineGap: 2 });
  doc.moveDown(0.35);
}

function addPdfBullets(doc: PDFKit.PDFDocument, items: string[]): void {
  items.forEach((item) => {
    ensurePdfSpace(doc, 24);
    doc.font("Helvetica").fontSize(10).fillColor("#374151");
    doc.text(`- ${item}`, { indent: 12, lineGap: 2 });
  });
}

function ensurePdfSpace(doc: PDFKit.PDFDocument, requiredHeight: number): void {
  if (doc.y + requiredHeight > doc.page.height - PAGE_MARGIN) {
    doc.addPage();
  }
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    style: "ResumeHeading",
  });
}

function itemTitle(text: string, url?: string): Paragraph {
  const normalizedUrl = url ? normalizeExternalUrl(url) : undefined;

  return new Paragraph({
    spacing: { before: 120, after: 40 },
    children: [
      normalizedUrl
        ? docxLink(text, normalizedUrl, true)
        : new TextRun({ text, bold: true }),
    ],
  });
}

function metadataParagraph(values: Array<string | undefined>): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: values.filter(Boolean).join(" | "),
        color: "4B5563",
        size: 18,
      }),
    ],
  });
}

function bulletParagraphs(items: string[]): Paragraph[] {
  return items.map(
    (item) =>
      new Paragraph({
        text: item,
        bullet: { level: 0 },
        spacing: { after: 60 },
      })
  );
}

function getDocxContactRuns(
  contactItems: ContactItem[]
): Array<TextRun | ExternalHyperlink> {
  return contactItems.map((item) =>
    item.url
      ? docxLink(item.label, item.url)
      : new TextRun({ text: item.label, color: "4B5563", size: 18 })
  );
}

function joinRunsWithSeparators(
  runs: Array<TextRun | ExternalHyperlink>
): Array<TextRun | ExternalHyperlink> {
  return runs.flatMap((run, index) =>
    index === 0
      ? [run]
      : [new TextRun({ text: " | ", color: "6B7280", size: 18 }), run]
  );
}

function docxLink(
  text: string,
  link: string,
  bold = false
): ExternalHyperlink {
  return new ExternalHyperlink({
    link,
    children: [
      new TextRun({
        text,
        bold,
        color: "374151",
        underline: {},
      }),
    ],
  });
}
