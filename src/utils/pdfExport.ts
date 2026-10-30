import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportElementToPdf(
  element: HTMLElement,
  fileName: string = 'Contract-Agreement.pdf'
): Promise<boolean> {
  try {
    // Generate high-resolution canvas capture
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Remaining pages if contract is multi-page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Failed to export PDF via html2canvas/jsPDF:', error);
    // Graceful fallback to browser print dialog
    window.print();
    return false;
  }
}
