import { Invoice } from '../types.ts';

/**
 * Uses a hidden iframe technique to print the component exactly as rendered.
 * This is often more pixel-perfect than jsPDF for complex Tailwind layouts.
 */
export const generateInvoicePDF = (invoice: Invoice) => {
  // We trigger the browser print on the element with id 'invoice-preview'
  // Alternatively, open a new window and inject the content.
  const printWindow = window.open('', '_blank', 'width=1000,height=1400');
  
  if (printWindow) {
    // We capture the currently rendered HTML of the preview container
    const element = document.getElementById('invoice-preview');
    if (!element) return;

    const content = element.innerHTML;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(node => node.outerHTML)
      .join('\n');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice_${invoice.invoiceNumber}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          ${styles}
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
            }
            #invoice-preview {
              box-shadow: none !important;
              border: none !important;
              margin: 0 auto;
            }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
          <div id="invoice-preview">
            ${content}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};