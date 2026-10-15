import { NGOProposal } from './types';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import jsPDF from 'jspdf';

/**
 * Generate and download a real DOCX file
 */
export async function downloadProposalDocx(proposal: NGOProposal): Promise<void> {
  const docSections: Paragraph[] = [];

  // Title
  docSections.push(
    new Paragraph({
      text: proposal.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    })
  );

  // Subtitle / Metadata
  docSections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({ text: `Target Donor: ${proposal.targetDonor} | `, bold: true }),
        new TextRun({ text: `Sector: ${proposal.sector} | ` }),
        new TextRun({ text: `Budget: ${proposal.requestedAmount} | ` }),
        new TextRun({ text: `Duration: ${proposal.durationMonths} Months` })
      ]
    })
  );

  // Horizontal divider
  docSections.push(
    new Paragraph({
      border: {
        bottom: { color: '2563EB', space: 1, style: BorderStyle.SINGLE, size: 6 }
      },
      spacing: { after: 300 }
    })
  );

  // Proposal Sections
  for (const section of proposal.sections) {
    if (!section.content.trim()) continue;

    docSections.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 150 }
      })
    );

    // Split content into paragraphs
    const paras = section.content.split('\n\n');
    for (const p of paras) {
      const cleanP = p.replace(/^###?\s+/g, '').replace(/\*\*/g, '').trim();
      if (!cleanP) continue;

      docSections.push(
        new Paragraph({
          text: cleanP,
          spacing: { after: 120 }
        })
      );
    }

    // Append section citations if any
    if (section.citations && section.citations.length > 0) {
      docSections.push(
        new Paragraph({
          spacing: { before: 100, after: 100 },
          children: [
            new TextRun({ text: 'Citations & Sources: ', bold: true, italics: true, color: '0891B2' }),
            new TextRun({
              text: section.citations.map(c => `[${c.documentTitle}, p.${c.page || 1}]`).join('; '),
              italics: true,
              color: '555555'
            })
          ]
        })
      );
    }
  }

  // Appendix / Citations Summary
  docSections.push(
    new Paragraph({
      text: 'Annex A: Institutional Evidence & References',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 150 }
    })
  );

  const allCitations = proposal.sections.flatMap(s => s.citations || []);
  const uniqueTitles = Array.from(new Set(allCitations.map(c => c.documentTitle)));

  if (uniqueTitles.length > 0) {
    uniqueTitles.forEach((title, idx) => {
      docSections.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: `[${idx + 1}] `, bold: true }),
            new TextRun({ text: title, bold: true }),
            new TextRun({ text: ' - Internal NGO Historical Evidence Archive' })
          ]
        })
      );
    });
  } else {
    docSections.push(
      new Paragraph({
        text: 'All data points derived from internal program baselines and field monitoring telemetry.',
        spacing: { after: 100 }
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docSections
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${proposal.title.replace(/[^\w\s-]/gi, '').slice(0, 40)}_Proposal.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download a PDF
 */
export function downloadProposalPdf(proposal: NGOProposal): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let y = margin + 20;

  // Header banner
  doc.setFillColor(15, 23, 42); // Navy
  doc.rect(margin, y, contentWidth, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('NGO PROPOSAL INTELLIGENCE DRAFT', margin + 15, y + 30);

  y += 75;

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(proposal.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 22 + 10;

  // Metadata block
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Target Donor: ${proposal.targetDonor}   |   Sector: ${proposal.sector}`, margin, y);
  y += 14;
  doc.text(`Requested Amount: ${proposal.requestedAmount}   |   Duration: ${proposal.durationMonths} Months   |   Region: ${proposal.targetRegion}`, margin, y);
  y += 20;

  // Line
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 25;

  // Sections
  for (const section of proposal.sections) {
    if (!section.content.trim()) continue;

    if (y > pageHeight - 120) {
      doc.addPage();
      y = margin + 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text(section.title, margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);

    const cleanContent = section.content.replace(/^###?\s+/gm, '').replace(/\*\*/g, '');
    const lines = doc.splitTextToSize(cleanContent, contentWidth);

    for (const line of lines) {
      if (y > pageHeight - margin - 20) {
        doc.addPage();
        y = margin + 20;
      }
      doc.text(line, margin, y);
      y += 14;
    }

    y += 15;
  }

  doc.save(`${proposal.title.replace(/[^\w\s-]/gi, '').slice(0, 40)}_Proposal.pdf`);
}

/**
 * Download Markdown format
 */
export function downloadProposalMarkdown(proposal: NGOProposal): void {
  let md = `# ${proposal.title}\n\n`;
  md += `**Target Donor:** ${proposal.targetDonor}\n`;
  md += `**Sector:** ${proposal.sector}\n`;
  md += `**Requested Amount:** ${proposal.requestedAmount}\n`;
  md += `**Duration:** ${proposal.durationMonths} Months\n`;
  md += `**Region:** ${proposal.targetRegion}\n\n`;
  md += `---\n\n`;

  for (const section of proposal.sections) {
    if (!section.content.trim()) continue;
    md += `## ${section.title}\n\n`;
    md += `${section.content}\n\n`;
    if (section.citations && section.citations.length > 0) {
      md += `*Sources & Citations:*\n`;
      section.citations.forEach(c => {
        md += `- [${c.documentTitle}](${c.section || 'General'}, Page ${c.page || 1}): "${c.snippet}"\n`;
      });
      md += `\n`;
    }
  }

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${proposal.title.replace(/[^\w\s-]/gi, '').slice(0, 40)}_Proposal.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
