import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportElementToPdf(
  element: HTMLElement,
  fileName: string = 'Contract-Agreement.pdf'
): Promise<boolean> {
  try {
    const pages = Array.from(element.querySelectorAll<HTMLElement>('[data-pdf-page]'));
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Capture each contract page separately so no text is cut at a page break
    for (const [index, page] of pages.entries()) {
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Fit inside A4: pages rendered on narrow screens are taller than A4 ratio
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (index > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width * ratio, canvas.height * ratio);
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
