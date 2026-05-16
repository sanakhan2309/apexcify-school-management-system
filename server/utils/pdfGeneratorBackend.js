import PDFDocument from 'pdfkit';

export const generateInvoicePDFBuffer = (fee, student) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // Header
        doc.fillColor('#444444')
           .fontSize(20)
           .text('EduFlow School Management', 110, 57)
           .fontSize(10)
           .text('123 Education Lane, Knowledge City', 200, 65, { align: 'right' })
           .text('Phone: +1 234 567 890', 200, 80, { align: 'right' })
           .moveDown();

        // Line
        doc.strokeColor('#aaaaaa')
           .lineWidth(1)
           .moveTo(50, 100)
           .lineTo(550, 100)
           .stroke();

        // Invoice Info
        doc.fillColor('#333333')
           .fontSize(15)
           .text('FEE INVOICE', 50, 120);

        doc.fontSize(10)
           .text(`Invoice Number: ${fee.invoiceNumber}`, 50, 145)
           .text(`Date: ${new Date().toLocaleDateString()}`, 50, 160)
           .text(`Due Date: ${new Date(fee.dueDate).toLocaleDateString()}`, 50, 175);

        // Bill To
        doc.fontSize(12)
           .text('BILL TO:', 50, 210, { bold: true });
        
        doc.fontSize(10)
           .text(`Student Name: ${student.name}`, 50, 230)
           .text(`Email: ${student.email}`, 50, 245);

        // Table Header
        doc.rect(50, 280, 500, 20).fill('#3b82f6');
        doc.fillColor('#ffffff')
           .text('Description', 60, 285)
           .text('Status', 300, 285)
           .text('Amount', 450, 285);

        // Table Body
        doc.fillColor('#333333')
           .text(fee.description || 'Monthly Tuition Fee', 60, 310)
           .text(fee.status, 300, 310)
           .text(`$${fee.amount}`, 450, 310);

        doc.strokeColor('#eeeeee')
           .lineWidth(0.5)
           .moveTo(50, 330)
           .lineTo(550, 330)
           .stroke();

        // Total
        doc.fontSize(14)
           .text(`TOTAL AMOUNT: $${fee.amount}`, 350, 360, { bold: true });

        // Footer
        doc.fontSize(10)
           .fillColor('#777777')
           .text('Thank you for choosing EduFlow. Please pay your dues on time.', 50, 700, { align: 'center' });

        doc.end();
    });
};
