const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Create a PDF buffer for a prescription object
 * @param {Object} prescription - Mongoose doc or plain object with populated patientId, doctorId and medicines
 * @returns {Promise<Buffer>} - PDF file buffer
 */
function createPrescriptionPdf(prescription) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];

      // Try to register a Unicode font (support Vietnamese). Place a TTF at one of the candidate locations.
      const candidates = [
        path.join(process.cwd(), 'public', 'fonts', 'NotoSans-Regular.ttf'),
        path.join(process.cwd(), 'public', 'fonts', 'NotoSansVN-Regular.ttf'),
        path.join(__dirname, 'fonts', 'NotoSans-Regular.ttf'),
        path.join(process.cwd(), 'fonts', 'NotoSans-Regular.ttf'),
        path.join(process.cwd(), 'Arial.ttf')
      ];

      let fontName = null;
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          try {
            doc.registerFont('CustomUnicode', p);
            fontName = 'CustomUnicode';
            break;
          } catch (err) {
            // ignore and try next
          }
        }
      }

      if (!fontName) {
        console.warn('No Unicode font found for PDF generation. Vietnamese characters may be garbled. Place a TTF (e.g. NotoSans-Regular.ttf) in public/fonts or fonts/.');
      }

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Header
      if (fontName) doc.font(fontName);
      doc.fontSize(18).text('Toa thuốc / Prescription', { align: 'center' });
      doc.moveDown(1);

      // Clinic / Doctor
      const doctorName = prescription.doctorId?.name || '';
      const doctorPhone = prescription.doctorId?.phoneNumber || '';
      const clinicName = prescription.doctorId?.clinicId?.name || '';
      if (fontName) doc.font(fontName).fontSize(12);
      doc.fontSize(12).text(`Bác sĩ: ${doctorName}`);
      if (clinicName) doc.text(`Phòng khám: ${clinicName}`);
      if (doctorPhone) doc.text(`Số điện thoại: ${doctorPhone}`);

      doc.moveDown(0.5);

      // Patient
      const patientName = `${prescription.patientId?.firstName || ''} ${prescription.patientId?.lastName || ''}`.trim();
      const patientPhone = prescription.patientId?.phoneNumber || '';
      const dob = prescription.patientId?.dateOfBirth ? new Date(prescription.patientId.dateOfBirth).toLocaleDateString() : '';

      doc.text(`Bệnh nhân: ${patientName}`);
      if (patientPhone) doc.text(`SĐT: ${patientPhone}`);
      if (dob) doc.text(`Ngày sinh: ${dob}`);

      doc.moveDown(0.5);

      // Diagnosis & notes
      // Use registered font for bold/regular if available
      if (fontName) doc.font(fontName).fontSize(12).text('Chẩn đoán:', { continued: false });
      else doc.font('Helvetica-Bold').text('Chẩn đoán:');
      if (fontName) doc.font(fontName).text(prescription.diagnosis || '', { indent: 10 });
      else doc.font('Helvetica').text(prescription.diagnosis || '', { indent: 10 });
      doc.moveDown(0.5);

      if (prescription.notes) {
        if (fontName) doc.font(fontName).fontSize(12).text('Ghi chú:');
        else doc.font('Helvetica-Bold').text('Ghi chú:');
        if (fontName) doc.font(fontName).text(prescription.notes || '', { indent: 10 });
        else doc.font('Helvetica').text(prescription.notes || '', { indent: 10 });
        doc.moveDown(0.5);
      }

      // Medicines table-like
      if (fontName) doc.font(fontName).fontSize(12).text('Danh sách thuốc:');
      else doc.font('Helvetica-Bold').text('Danh sách thuốc:');
      doc.moveDown(0.3);

      const meds = prescription.medicines || [];
      meds.forEach((m, idx) => {
        const name = m.name || m.medicineId?.name || '';
        const dosage = m.dosage || '';
        const duration = m.duration || '';
        const instr = m.instructions || '';

        if (fontName) doc.font(fontName).fontSize(11).text(`${idx + 1}. ${name}`);
        else doc.font('Helvetica-Bold').text(`${idx + 1}. ${name}`);
        const meta = [];
        if (dosage) meta.push(`Liều: ${dosage}`);
        if (duration) meta.push(`Thời gian: ${duration}`);
        if (meta.length) {
          if (fontName) doc.font(fontName).text(meta.join(' | '), { indent: 10 });
          else doc.font('Helvetica').text(meta.join(' | '), { indent: 10 });
        }
        if (instr) {
          if (fontName) doc.font(fontName).text(`Cách dùng: ${instr}`, { indent: 10 });
          else doc.font('Helvetica').text(`Cách dùng: ${instr}`, { indent: 10 });
        }
        doc.moveDown(0.3);
      });

      doc.moveDown(1);
      doc.text('---', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(10).text('Toa thuốc được gửi từ hệ thống BookingSystem', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { createPrescriptionPdf };
