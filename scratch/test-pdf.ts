import html_to_pdf from 'html-pdf-node';

async function testPdf() {
  console.log('Starting PDF generation test...');
  try {
    const options = { format: 'A4' };
    const file = { content: '<h1>Hello World</h1><p>Test PDF generation.</p>' };
    console.log('Calling html_to_pdf.generatePdf...');
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    console.log('PDF generation completed successfully! Buffer length:', pdfBuffer.length);
  } catch (err) {
    console.error('PDF generation failed:', err);
  }
}

testPdf();
