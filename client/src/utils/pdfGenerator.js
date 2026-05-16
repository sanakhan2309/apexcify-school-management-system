import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (fee) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text('EduFlow School Management', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Fee Invoice', 105, 30, { align: 'center' });
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice Number: ${fee.invoiceNumber}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 52);
    doc.text(`Due Date: ${new Date(fee.dueDate).toLocaleDateString()}`, 20, 59);
    
    // Student Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, 75);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Student Name: ${fee.student?.name}`, 20, 82);
    doc.text(`Email: ${fee.student?.email}`, 20, 89);
    
    // Table
    const tableData = [
        ['Description', 'Status', 'Amount'],
        [fee.description || 'Monthly Tuition Fee', fee.status, `$${fee.amount}`]
    ];
    
    doc.autoTable({
        startY: 100,
        head: [['Description', 'Status', 'Amount']],
        body: [[fee.description || 'Monthly Tuition Fee', fee.status, `$${fee.amount}`]],
        theme: 'grid',
        headStyles: { fillStyle: [59, 130, 246] } // Blue color
    });
    
    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: $${fee.amount}`, 190, finalY, { align: 'right' });
    
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your payment!', 105, 280, { align: 'center' });
    
    doc.save(`Invoice_${fee.invoiceNumber}.pdf`);
};
