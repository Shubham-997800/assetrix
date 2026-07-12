import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { PassThrough } from 'stream';
import logger from '../config/logger';

// ─── CSV GENERATION ──────────────────────────────────────

export const generateCSV = (data: Record<string, unknown>[], columns?: string[]): string => {
  if (!data || data.length === 0) return '';

  const keys = columns || Object.keys(data[0]);
  const header = keys.map((k) => `"${k}"`).join(',');
  const rows = data.map((row) =>
    keys.map((k) => {
      const val = row[k];
      if (val === null || val === undefined) return '';
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    }).join(',')
  );

  return [header, ...rows].join('\n');
};

// ─── PDF GENERATION ──────────────────────────────────────

export const generatePDF = async (
  title: string,
  data: Record<string, unknown>[],
  columns?: string[],
  summary?: Record<string, unknown>
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).font('Helvetica-Bold').text(title, { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(9).font('Helvetica').fillColor('#666666').text(
      `Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      { align: 'center' }
    );
    doc.moveDown(0.5);

    if (summary) {
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#333333').text('Summary');
      doc.moveDown(0.2);
      doc.fontSize(9).font('Helvetica');
      for (const [key, value] of Object.entries(summary)) {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
        const display = typeof value === 'number' ? value.toLocaleString('en-IN') : String(value ?? 'N/A');
        doc.fillColor('#555555').text(`${label}: `, { continued: true }).fillColor('#222222').text(display);
      }
      doc.moveDown(0.5);
    }

    if (!data || data.length === 0) {
      doc.fontSize(10).fillColor('#999999').text('No data available');
      doc.end();
      return;
    }

    const keys = columns || Object.keys(data[0]);
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colWidth = pageWidth / keys.length;

    doc.fontSize(8).font('Helvetica-Bold').fillColor('#ffffff');
    const tableTop = doc.y;
    doc.save();

    doc.rect(doc.page.margins.left, tableTop, pageWidth, 18).fill('#0891B2');
    doc.restore();
    doc.fillColor('#ffffff').fontSize(7).font('Helvetica-Bold');

    keys.forEach((key, i) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
      doc.text(label, doc.page.margins.left + i * colWidth + 4, tableTop + 4, {
        width: colWidth - 8,
        height: 14,
        ellipsis: true,
      });
    });

    doc.moveDown(1.2);
    doc.font('Helvetica').fontSize(7);

    const maxRows = Math.min(data.length, 60);
    for (let r = 0; r < maxRows; r++) {
      if (doc.y > doc.page.height - 50) {
        doc.addPage();
      }

      const rowY = doc.y;
      if (r % 2 === 0) {
        doc.save();
        doc.rect(doc.page.margins.left, rowY - 1, pageWidth, 14).fill('#F0F9FF');
        doc.restore();
      }

      doc.fillColor('#333333');
      keys.forEach((key, i) => {
        const val = data[r][key];
        const display = val === null || val === undefined ? '' :
          typeof val === 'object' ? JSON.stringify(val) : String(val);
        doc.text(display, doc.page.margins.left + i * colWidth + 4, rowY, {
          width: colWidth - 8,
          height: 12,
          ellipsis: true,
        });
      });

      doc.y = rowY + 14;
    }

    if (data.length > maxRows) {
      doc.moveDown(0.5).fontSize(8).fillColor('#999999').text(`... and ${data.length - maxRows} more rows`);
    }

    doc.moveDown(1).fontSize(7).fillColor('#999999').text(
      `Assetrix Report Engine | Page ${doc.bufferedPageRange().page + 1}`,
      doc.page.margins.left,
      doc.page.height - 30,
      { align: 'center', width: pageWidth }
    );

    doc.end();
  });
};

// ─── EXCEL GENERATION ────────────────────────────────────

export const generateExcel = async (
  title: string,
  data: Record<string, unknown>[],
  columns?: string[],
  summary?: Record<string, unknown>
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Assetrix';
  workbook.created = new Date();

  if (summary) {
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 25 },
    ];

    const headerFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0891B2' } };
    const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    summarySheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FF075985' } },
      };
    });

    for (const [key, value] of Object.entries(summary)) {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
      summarySheet.addRow({ metric: label, value: value ?? 'N/A' });
    }
  }

  const dataSheet = workbook.addWorksheet('Data');
  const keys = columns || (data.length > 0 ? Object.keys(data[0]) : []);

  dataSheet.columns = keys.map((k) => ({
    header: k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
    key: k,
    width: Math.max(15, k.length + 5),
  }));

  const headerFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0891B2' } };
  const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };

  dataSheet.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FF075985' } },
    };
  });

  data.forEach((row) => dataSheet.addRow(row));

  dataSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: keys.length },
  };

  dataSheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1 && rowNumber % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F9FF' } };
      });
    }
    row.eachCell((cell) => {
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

// ─── UTILITY: FLATTEN NESTED OBJECTS ────────────────────

export const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else if (Array.isArray(value)) {
      result[newKey] = value.map((v) => (typeof v === 'object' ? JSON.stringify(v) : v)).join(', ');
    } else {
      result[newKey] = value;
    }
  }
  return result;
};
