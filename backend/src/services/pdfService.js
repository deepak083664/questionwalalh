const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Path to store dynamic fonts
const fontDir = path.join(__dirname, '../../assets/fonts');
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
}
const hindiFontPath = path.join(fontDir, 'NotoSansDevanagari.ttf');

// Function to download Hindi Unicode font if not present
const ensureHindiFont = () => {
  return new Promise((resolve) => {
    if (fs.existsSync(hindiFontPath)) {
      return resolve(hindiFontPath);
    }

    // First try standard Windows fonts
    const windowsFontPath = 'C:\\Windows\\Fonts\\mangal.ttf';
    if (fs.existsSync(windowsFontPath)) {
      console.log('Using Windows Mangal Devanagari font.');
      return resolve(windowsFontPath);
    }

    console.log('Downloading Noto Sans Devanagari font from Google Fonts...');
    const fontUrl = 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf';
    
    const file = fs.createWriteStream(hindiFontPath);
    https.get(fontUrl, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Devanagari font downloaded successfully.');
        resolve(hindiFontPath);
      });
    }).on('error', (err) => {
      console.error('Failed to download font:', err.message);
      fs.unlink(hindiFontPath, () => {});
      resolve(null); // Fallback to standard fonts (which might not render Devanagari properly, but avoids crash)
    });
  });
};

/**
 * Generate a PDF for the question paper
 * @param {Object} paperData - Document metadata and questions array
 * @returns {Promise<Buffer>} - Resolves with PDF file buffer
 */
const generatePaperPDF = async (paperData) => {
  const customFont = await ensureHindiFont();

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        bufferPages: true, // Required for dynamic page numbers
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Select font based on language/content
      const hasHindi = paperData.questions.some(q => 
        /[\u0900-\u097F]/.test(q.text)
      );

      const regularFont = hasHindi && customFont ? customFont : 'Helvetica';
      const boldFont = hasHindi && customFont ? customFont : 'Helvetica-Bold';

      // ----------------------------------------------------
      // HEADER SECTION (School & Exam Details)
      // ----------------------------------------------------
      if (paperData.schoolName) {
        doc.font(boldFont).fontSize(18).text(paperData.schoolName.toUpperCase(), { align: 'center' });
        doc.moveDown(0.3);
      }
      
      if (paperData.examName) {
        doc.font(boldFont).fontSize(14).text(paperData.examName, { align: 'center' });
        doc.moveDown(0.5);
      }

      // Metadata Row
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#4B5563').lineWidth(1.5).stroke();
      doc.moveDown(0.5);

      const yPosition = doc.y;
      doc.font(boldFont).fontSize(11).text(`Class: ${paperData.class}`, 50, yPosition);
      doc.text(`Subject: ${paperData.subject}`, 200, yPosition);
      doc.text(`Max Marks: ${paperData.totalMarks}`, 380, yPosition);
      doc.text(`Time: ${paperData.duration} Mins`, 480, yPosition, { align: 'right' });

      doc.moveDown(0.8);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#9CA3AF').lineWidth(1).stroke();
      doc.moveDown(0.8);

      // ----------------------------------------------------
      // GENERAL INSTRUCTIONS
      // ----------------------------------------------------
      if (paperData.instructions && paperData.instructions.length > 0) {
        doc.font(boldFont).fontSize(11).text('General Instructions:', 50);
        doc.moveDown(0.2);
        
        doc.font(regularFont).fontSize(10).strokeColor('#000');
        paperData.instructions.forEach((inst, index) => {
          doc.text(`${index + 1}. ${inst}`, 60, doc.y, { width: 485 });
          doc.moveDown(0.15);
        });
        doc.moveDown(0.8);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#E5E7EB').lineWidth(1).stroke();
        doc.moveDown(0.8);
      }

      // ----------------------------------------------------
      // QUESTIONS SECTIONS
      // ----------------------------------------------------
      // Categorize questions
      const mcqs = paperData.questions.filter((q) => q.type === 'MCQ');
      const shorts = paperData.questions.filter((q) => q.type === 'Short');
      const longs = paperData.questions.filter((q) => q.type === 'Long');

      let qIndex = 1;

      // Section Renderer Helper
      const renderSection = (title, items) => {
        if (items.length === 0) return;

        doc.font(boldFont).fontSize(12).text(title, 50);
        doc.moveDown(0.4);

        items.forEach((q) => {
          // Check page overflow (leave some padding)
          if (doc.y > 750) doc.addPage();

          const currentY = doc.y;
          doc.font(regularFont).fontSize(10.5);

          // Render Question text and marks alignment
          const marksText = `[${q.marks} Mark${q.marks > 1 ? 's' : ''}]`;
          
          doc.text(`${qIndex}. ${q.text}`, 50, currentY, { width: 430 });
          
          // Place marks text on the right
          doc.font(boldFont).text(marksText, 485, currentY, { align: 'right', width: 60 });
          doc.moveDown(0.3);

          // Render MCQ options if applicable
          if (q.type === 'MCQ' && q.options && q.options.length > 0) {
            doc.font(regularFont).fontSize(10);
            
            // Format options: if text fits, render 2 columns side-by-side
            const op1 = q.options[0];
            const op2 = q.options[1];
            const op3 = q.options[2];
            const op4 = q.options[3];

            if (op1 && op2 && op3 && op4) {
              const startY = doc.y;
              doc.text(op1, 70, startY, { width: 220 });
              doc.text(op2, 300, startY, { width: 220 });
              doc.moveDown(0.2);
              const secondY = doc.y;
              doc.text(op3, 70, secondY, { width: 220 });
              doc.text(op4, 300, secondY, { width: 220 });
              doc.moveDown(0.5);
            }
          } else {
            doc.moveDown(0.5);
          }

          qIndex++;
        });
        doc.moveDown(0.5);
      };

      // Render actual Sections
      renderSection('SECTION A: MULTIPLE CHOICE QUESTIONS (MCQs)', mcqs);
      renderSection('SECTION B: SHORT ANSWER QUESTIONS', shorts);
      renderSection('SECTION C: LONG ANSWER QUESTIONS', longs);

      // ----------------------------------------------------
      // FOOTER & PAGE NUMBERING
      // ----------------------------------------------------
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        
        // Footer line
        doc.moveTo(50, 770).lineTo(545, 770).strokeColor('#E5E7EB').lineWidth(0.5).stroke();
        
        // Footer text
        doc.font(regularFont).fontSize(8.5).fillColor('#6B7280');
        doc.text('Generated by Question Wallah', 50, 778);
        doc.text(`Page ${i + 1} of ${range.count}`, 450, 778, { align: 'right', width: 95 });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generatePaperPDF,
};
