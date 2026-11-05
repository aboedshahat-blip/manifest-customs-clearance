const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const docx = require('docx');
const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, TextRun, ShadingType } = docx;

const { extractRecordsFromPdfBuffer } = require('./pdfExtractor');
const { parseManifest } = require('./manifestParser');

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// 1. API: Convert PDF
app.post('/api/convert-pdf', upload.single('pdfFile'), async (req, res) => {
  try {
    let pdfBuffer;
    if (req.file) {
      pdfBuffer = req.file.buffer;
    } else if (req.body && req.body.pdfBase64) {
      const base64Data = req.body.pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      pdfBuffer = Buffer.from(base64Data, 'base64');
    } else {
      return res.status(400).json({ error: 'لم يتم إرسال ملف PDF' });
    }

    console.log(`Processing uploaded PDF (${pdfBuffer.length} bytes)...`);
    if (!process.env.VERCEL) {
      try {
        fs.writeFileSync(path.join(__dirname, 'uploaded_manifest.pdf'), pdfBuffer);
      } catch (e) {}
    }
    
    // Primary: Accurate 2D Spatial Layout Parser
    let records = await extractRecordsFromPdfBuffer(pdfBuffer);
    console.log(`Spatial parser extracted ${records.length} records`);

    return res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (err) {
    console.error('Error processing PDF:', err);
    return res.status(500).json({
      error: 'حدث خطأ أثناء معالجة ملف الـ PDF: ' + err.message
    });
  }
});

// 2. API: Convert Raw Text / OCR text
app.post('/api/convert-text', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'النص فارغ' });
    }

    const records = parseManifest(text);
    return res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (err) {
    console.error('Error processing text:', err);
    return res.status(500).json({
      error: 'حدث خطأ أثناء معالجة النص: ' + err.message
    });
  }
});

// 3. API: Generate & Download Word Document (.docx)
app.post('/api/export-docx', async (req, res) => {
  try {
    const { records, title } = req.body;
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ error: 'البيانات غير صالحة' });
    }

    const docTitle = title || 'المصري الدولي للتخليص الجمركي - كشف تفريغ منافيست السيارات';

    const headers = [
      { text: 'مسلسل', width: 800 },
      { text: 'رقم البوليصة', width: 1400 },
      { text: 'اسم المستلم', width: 3200 },
      { text: 'رقم الـ acid', width: 2200 },
      { text: 'نوع البضاعة', width: 2400 },
      { text: 'رقم الشاسيه', width: 2400 },
      { text: 'الوزن', width: 1100 }
    ];

    const headerCells = headers.map(h => 
      new TableCell({
        width: { size: h.width, type: WidthType.DXA },
        shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 100, right: 100 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            children: [
              new TextRun({
                text: h.text,
                bold: true,
                color: 'FFFFFF',
                size: 20,
                font: 'Calibri'
              })
            ]
          })
        ]
      })
    );

    const tableRows = [
      new TableRow({ children: headerCells, tableHeader: true })
    ];

    records.forEach((rec, idx) => {
      const isEven = idx % 2 === 0;
      const bg = isEven ? 'F8FAFC' : 'FFFFFF';
      const seq = String(idx + 1).padStart(3, '0');

      const rowValues = [
        seq,
        rec.billNo || '',
        rec.consigneeName || '',
        rec.acid || '0',
        rec.cargoType || '',
        rec.chassis || '',
        rec.weight || '2000'
      ];

      const rowCells = rowValues.map((val, cellIdx) => {
        let paragraphs = [];
        if (cellIdx === 5 && (String(val).includes('\n') || String(val).includes(' - '))) {
          const chLines = String(val).split(/\s*-\s*|\n/).map(c => c.trim()).filter(Boolean);
          paragraphs = chLines.map(line => new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            children: [
              new TextRun({
                text: line,
                size: 19,
                font: 'Calibri',
                color: '1E293B',
                bold: true
              })
            ]
          }));
        } else {
          paragraphs = [
            new Paragraph({
              alignment: cellIdx === 2 || cellIdx === 4 ? AlignmentType.RIGHT : AlignmentType.CENTER,
              bidirectional: true,
              children: [
                new TextRun({
                  text: String(val || ''),
                  size: 19,
                  font: 'Calibri',
                  color: '1E293B',
                  bold: cellIdx === 0
                })
              ]
            })
          ];
        }

        return new TableCell({
          width: { size: headers[cellIdx].width, type: WidthType.DXA },
          shading: { fill: bg, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 80, right: 80 },
          children: paragraphs
        });
      });

      tableRows.push(new TableRow({ children: rowCells }));
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: docx.PageOrientation.LANDSCAPE
              },
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720
              }
            }
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              bidirectional: true,
              children: [
                new TextRun({
                  text: docTitle,
                  bold: true,
                  size: 30,
                  color: '1E3A8A',
                  font: 'Calibri'
                })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              bidirectional: true,
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: `المصري الدولي للتخليص الجمركي | إدارة: أ/ محمد حسن مرزوق (ت: 01221356668) | عدد البوالص: ${records.length} | تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-EG')}`,
                  size: 17,
                  color: '475569',
                  font: 'Calibri'
                })
              ]
            }),
            new Table({
              rows: tableRows,
              alignment: AlignmentType.CENTER
            })
          ]
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="manifest_table.docx"');
    return res.send(buffer);
  } catch (err) {
    console.error('Error exporting DOCX:', err);
    return res.status(500).json({ error: 'خطأ أثناء إنشاء ملف الوورد: ' + err.message });
  }
});

// 4. API: Generate & Download Excel Spreadsheet (.xlsx)
app.post('/api/export-xlsx', async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ error: 'البيانات غير صالحة' });
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'المصري الدولي للتخليص الجمركي';
    workbook.created = new Date();

    const ws = workbook.addWorksheet('كشف المنافيست', {
      views: [{ rightToLeft: true }]
    });

    // Define columns
    ws.columns = [
      { header: 'مسلسل', key: 'seq', width: 10 },
      { header: 'رقم البوليصة', key: 'billNo', width: 18 },
      { header: 'اسم المستلم', key: 'consigneeName', width: 44 },
      { header: 'رقم الـ acid', key: 'acid', width: 26 },
      { header: 'نوع البضاعة', key: 'cargoType', width: 34 },
      { header: 'رقم الشاسيه', key: 'chassis', width: 32 },
      { header: 'الوزن', key: 'weight', width: 14 }
    ];

    // Style Header Row (Row 1)
    const headerRow = ws.getRow(1);
    headerRow.height = 28;
    headerRow.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' } // Dark Blue #1E3A8A
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
      };
    });

    // Add Data Rows
    records.forEach((r, idx) => {
      const chassisLines = (r.chassis || '').split(/\s*-\s*|\n/).map(c => c.trim()).filter(Boolean);
      const chassisDisplay = chassisLines.join('\n');
      const seqStr = String(idx + 1).padStart(3, '0');

      const row = ws.addRow({
        seq: seqStr,
        billNo: String(r.billNo || ''),
        consigneeName: String(r.consigneeName || r.shipperName || ''),
        acid: String(r.acid || '0'),
        cargoType: String(r.cargoType || ''),
        chassis: chassisDisplay,
        weight: String(r.weight || '2000')
      });

      const isEven = idx % 2 === 0;
      const bgHex = isEven ? 'FFF8FAFC' : 'FFFFFFFF';
      const lineCount = Math.max(1, chassisLines.length);
      row.height = Math.max(22, lineCount * 18);

      row.font = { name: 'Calibri', size: 10 };

      // Style each cell
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        // Force string type and text format for ACID, BillNo, Seq, and Chassis
        cell.numFmt = '@';

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgHex }
        };

        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };

        if (colNumber === 3 || colNumber === 5) {
          // Consignee & Cargo: align right
          cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        } else if (colNumber === 6) {
          // Chassis: center, wrapText enabled!
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.font = { name: 'Calibri', size: 10, bold: true };
        } else if (colNumber === 4) {
          // ACID: center, bold
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1D4ED8' } };
        } else {
          // Seq, Bill, Weight: center
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="manifest_table.xlsx"');

    await workbook.xlsx.write(res);
    return res.end();
  } catch (err) {
    console.error('Error exporting XLSX:', err);
    return res.status(500).json({ error: 'خطأ أثناء إنشاء ملف الإكسيل: ' + err.message });
  }
});

if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 تطبيق تحويل منافيست السيارات الجمركي يعمل بنجاح!`);
    console.log(`🏢 المصري الدولي للتخليص الجمركي - أ/ محمد حسن مرزوق`);
    console.log(`🌐 الرابط: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
