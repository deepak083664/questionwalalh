const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Path to store dynamic fonts
const fontDir = path.join(__dirname, '../../assets/fonts');
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
}
const regularFontPath = path.join(fontDir, 'Poppins-Regular.ttf');
const boldFontPath = path.join(fontDir, 'Poppins-Bold.ttf');

// Function to download Poppins fonts if not present
const ensureFonts = () => {
  return new Promise((resolve) => {
    const regularExists = fs.existsSync(regularFontPath);
    const boldExists = fs.existsSync(boldFontPath);

    if (regularExists && boldExists) {
      return resolve({ regular: regularFontPath, bold: boldFontPath });
    }

    console.log('Downloading Poppins fonts from Google Fonts...');
    const regUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf';
    const boldUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf';

    const download = (url, dest) => {
      return new Promise((res) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              res(dest);
            });
          } else {
            file.close();
            fs.unlink(dest, () => {});
            res(null);
          }
        }).on('error', () => {
          file.close();
          fs.unlink(dest, () => {});
          res(null);
        });
      });
    };

    Promise.all([
      download(regUrl, regularFontPath),
      download(boldUrl, boldFontPath)
    ]).then(([regPath, bldPath]) => {
      resolve({
        regular: regPath || 'Helvetica',
        bold: bldPath || 'Helvetica-Bold'
      });
    });
  });
};

/**
 * Generate a PDF for the question paper
 * @param {Object} paperData - Document metadata and questions array
 * @returns {Promise<Buffer>} - Resolves with PDF file buffer
 */
const generatePaperPDF = async (paperData) => {
  const fonts = await ensureFonts();

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

      const regularFont = hasHindi ? fonts.regular : 'Helvetica';
      const boldFont = hasHindi ? fonts.bold : 'Helvetica-Bold';

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

        // Check page overflow for section title
        if (doc.y > 730) doc.addPage();

        doc.font(boldFont).fontSize(12).text(title, 50);
        doc.moveDown(0.4);

        items.forEach((q) => {
          let currentY = doc.y;
          doc.font(regularFont).fontSize(10.5);

          // Render Question text and marks alignment
          const marksText = `[${q.marks} Mark${q.marks > 1 ? 's' : ''}]`;
          
          // Calculate heights to check for page overflow beforehand
          doc.font(regularFont).fontSize(10.5);
          const questionHeight = doc.heightOfString(`${qIndex}. ${q.text}`, { width: 430 });
          doc.font(boldFont).fontSize(10.5);
          const marksHeight = doc.heightOfString(marksText, { width: 60 });
          const qHeight = Math.max(questionHeight, marksHeight);

          // Check page overflow (leave some padding)
          if (currentY + qHeight > 750) {
            doc.addPage();
            currentY = doc.y;
          }

          // Render at calculated currentY
          doc.font(regularFont).fontSize(10.5).text(`${qIndex}. ${q.text}`, 50, currentY, { width: 430 });
          doc.font(boldFont).fontSize(10.5).text(marksText, 485, currentY, { align: 'right', width: 60 });
          
          // Move doc.y to the bottom of the question text/marks
          doc.y = currentY + qHeight;
          doc.moveDown(0.3);

          // Render MCQ options if applicable
          if (q.type === 'MCQ' && q.options && q.options.length > 0) {
            const op1 = q.options[0];
            const op2 = q.options[1];
            const op3 = q.options[2];
            const op4 = q.options[3];

            if (op1 && op2 && op3 && op4) {
              doc.font(regularFont).fontSize(10);
              const h1 = doc.heightOfString(op1, { width: 220 });
              const h2 = doc.heightOfString(op2, { width: 220 });
              const row1Height = Math.max(h1, h2);

              if (doc.y + row1Height > 750) {
                doc.addPage();
              }

              const startY = doc.y;
              doc.text(op1, 70, startY, { width: 220 });
              doc.text(op2, 300, startY, { width: 220 });
              
              doc.y = startY + row1Height;
              doc.moveDown(0.2);

              const h3 = doc.heightOfString(op3, { width: 220 });
              const h4 = doc.heightOfString(op4, { width: 220 });
              const row2Height = Math.max(h3, h4);

              if (doc.y + row2Height > 750) {
                doc.addPage();
              }

              const secondY = doc.y;
              doc.text(op3, 70, secondY, { width: 220 });
              doc.text(op4, 300, secondY, { width: 220 });
              
              doc.y = secondY + row2Height;
              doc.moveDown(0.5);
            } else {
              // Fallback to vertical layout if options are not exactly 4
              doc.font(regularFont).fontSize(10);
              q.options.forEach((opt) => {
                const optHeight = doc.heightOfString(opt, { width: 450 });
                if (doc.y + optHeight > 750) {
                  doc.addPage();
                }
                const startY = doc.y;
                doc.text(opt, 70, startY, { width: 450 });
                doc.y = startY + optHeight;
                doc.moveDown(0.2);
              });
              doc.moveDown(0.3);
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
