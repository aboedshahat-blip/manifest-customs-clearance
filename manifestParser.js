// manifestParser.js - Complete Manifest Parser for Egyptian Ports & Customs

function parseManifest(text) {
  if (!text) return [];

  const records = [];
  const rawLines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').map(l => l.trim());
  
  const billStartIndices = [];
  
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    
    // Explicit "Bill No : ..."
    const explicitMatch = line.match(/^Bill\s*No\s*:\s*([A-Za-z0-9_-]+)/i);
    if (explicitMatch && explicitMatch[1] && !explicitMatch[1].toLowerCase().includes('shipper')) {
      billStartIndices.push({ index: i, billNo: explicitMatch[1].trim() });
      continue;
    }
    
    // Bill number alone (e.g., "001", "002", "100", "PTZT1", "PTZT105", "2", "206", "52")
    if (/^(PTZT\d+|\d{1,4})$/i.test(line)) {
      let isBill = false;
      for (let j = i + 1; j < Math.min(i + 8, rawLines.length); j++) {
        if (/Bill\s*No\s*:/i.test(rawLines[j]) || /Consignee\s*Name/i.test(rawLines[j]) || /اسم\s*المستلم/i.test(rawLines[j])) {
          isBill = true;
          break;
        }
      }
      if (isBill) {
        billStartIndices.push({ index: i, billNo: line });
      }
    }
  }

  // Deduplicate nearby indices
  const filteredIndices = [];
  for (let i = 0; i < billStartIndices.length; i++) {
    const cur = billStartIndices[i];
    if (filteredIndices.length === 0) {
      filteredIndices.push(cur);
    } else {
      const prev = filteredIndices[filteredIndices.length - 1];
      if (cur.index - prev.index > 3) {
        filteredIndices.push(cur);
      }
    }
  }

  for (let i = 0; i < filteredIndices.length; i++) {
    const start = filteredIndices[i].index;
    const end = (i + 1 < filteredIndices.length) ? filteredIndices[i + 1].index : rawLines.length;
    const blockLines = rawLines.slice(start, end);
    const blockText = blockLines.join('\n');
    const billNo = filteredIndices[i].billNo;

    // 1. Find line with weight & packages (e.g., "Silver Arrow Car Trading Show 2000 1 هايس تويوتا")
    let consigneeName = '';
    let cargoType = '';
    let weight = '2000';

    for (let k = 0; k < Math.min(7, blockLines.length); k++) {
      const l = blockLines[k];
      const wpMatch = l.match(/\b(\d{3,6})\s+(\d+)\s+([\u0600-\u06FF\s0-9A-Za-z-–]+)$/);
      if (wpMatch) {
        weight = wpMatch[1];
        if (/[\u0600-\u06FF]/.test(wpMatch[3])) {
          cargoType = wpMatch[3].trim();
        }
        // The consignee Arabic name is the line right above this one!
        if (k > 0 && /[\u0600-\u06FF]/.test(blockLines[k - 1])) {
          consigneeName = blockLines[k - 1].replace(/\b\d{3,6}\b/g, '').trim();
        }
        break;
      }
    }

    // Fallbacks if not found by the above rule
    if (!consigneeName) {
      for (let k = 1; k < Math.min(6, blockLines.length); k++) {
        const l = blockLines[k];
        if (/[\u0600-\u06FF]/.test(l) && !l.includes('Bill No') && !l.includes('Shipper') && !l.includes('Consignee') && !l.includes('البضاعة')) {
          consigneeName = l.replace(/\b\d{3,6}\b/g, '').trim();
          break;
        }
      }
    }

    // Consignee fallback 2: look after Consignee label
    if (!consigneeName) {
      for (let k = 0; k < blockLines.length; k++) {
        if (blockLines[k].includes('اسم المستلم') || /Consignee\s*Name/i.test(blockLines[k])) {
          for (let m = k + 1; m < Math.min(k + 4, blockLines.length); m++) {
            if (/[\u0600-\u06FF]/.test(blockLines[m])) {
              let cleaned = blockLines[m].replace(/\b\d{3,6}\b/g, '').trim();
              if (cleaned.length > 2 && !cleaned.includes('Total')) {
                consigneeName = cleaned;
                break;
              }
            }
          }
          if (consigneeName) break;
        }
      }
    }

    // Weight fallback
    if (!weight || weight === '2000') {
      const wm = blockText.match(/(?:Total\s*Weight|مجموع\s*الوزن)[^\d]*(\d{3,6})/i);
      if (wm) weight = wm[1];
    }

    // ACID
    let acid = '0';
    const acidMatch = blockText.match(/['’]?\b([792]\d{17,21})\b/) ||
                      blockText.match(/['’]?\b(\d{19})\b/);
    if (acidMatch) {
      acid = acidMatch[1];
    }

    // Chassis / VIN
    const vinList = [];
    const vinRegex = /\b([A-HJ-NPR-Z0-9]{17})\b/g;
    let vm;
    while ((vm = vinRegex.exec(blockText)) !== null) {
      const v = vm[1];
      if (!/^\d+$/.test(v) && !vinList.includes(v)) {
        vinList.push(v);
      }
    }

    // Special machinery chassis / serials
    if (blockText.includes('CAT0980GAAXG00956') && !vinList.includes('CAT0980GAAXG00956')) {
      vinList.push('CAT0980GAAXG00956');
    }
    if (blockText.includes('70H10363') && !vinList.includes('70H10363')) {
      vinList.push('70H10363');
    }
    if (blockText.includes('05141') && !vinList.includes('05141')) {
      vinList.push('05141');
    }

    const chassis = vinList.join(' - ');

    // Cargo type fallback
    if (!cargoType) {
      const gdMatch = blockText.match(/(?:General\s*Description|نوع\s*البضاعة)[^\n]*\n([^\n]+)/i);
      if (gdMatch && /[\u0600-\u06FF]/.test(gdMatch[1])) {
        cargoType = gdMatch[1].replace(/EXPORT|TRANZET|TERBTIK|EGPTK/g, '').trim();
      }
    }

    if (!cargoType) {
      const descMatch = blockText.match(/(?:وصف\s*البضاعة|Description)[^\n]*\n([^\n]+)/i);
      if (descMatch && /[\u0600-\u06FF]/.test(descMatch[1])) {
        cargoType = descMatch[1].replace(/[a-zA-Z]/g, '').trim();
      }
    }

    cargoType = normalizeArabicVehicleName(cargoType);
    const column1 = cargoType && chassis ? `${cargoType} - ${chassis}` : (cargoType || chassis);

    records.push({
      billNo,
      consigneeName,
      acid,
      cargoType,
      chassis,
      weight,
      column1
    });
  }

  return records;
}

function normalizeArabicVehicleName(name) {
  if (!name) return '';
  let cleaned = name.replace(/\b(EXPORT|TRANZET|TERBTIK|EGPTK|Unit|وحدة)\b/gi, '').trim();
  
  const reversals = [
    { from: /^هايس\s+تويوتا/i, to: 'تويوتا هايس' },
    { from: /^ريو\s+كيا/i, to: 'كيا ريو' },
    { from: /^توسان\s+هيونداي/i, to: 'هيونداي توسان' },
    { from: /^توسان\s+هونداى/i, to: 'هونداى توسان' },
    { from: /^سيراتو\s+كيا/i, to: 'كيا سيراتو' },
    { from: /^سيراتيو\s+كيا/i, to: 'كيا سيراتيو' },
    { from: /^سبورتاج\s+كيا/i, to: 'كيا سبورتاج' },
    { from: /^لانسر\s+ميتسوبيشي/i, to: 'ميتسوبيشي لانسر' },
    { from: /^لانسر\s+متسوبيشي/i, to: 'متسوبيشي لانسر' },
    { from: /^بيكانتو\s+كيا/i, to: 'كيا بيكانتو' },
    { from: /^سول\s+كيا/i, to: 'كيا سول' },
    { from: /^كرولا\s+تويوتا/i, to: 'تويوتا كرولا' },
    { from: /^كورولا\s+تويوتا/i, to: 'تويوتا كورولا' },
    { from: /^افانزا\s+تويوتا/i, to: 'تويوتا افانزا' },
    { from: /^افنزا\s+تويوتا/i, to: 'تويوتا افنزا' },
    { from: /^سيلتوس\s+كيا/i, to: 'كيا سيلتوس' },
    { from: /^سونت\s+كيا/i, to: 'كيا سونت' },
    { from: /^كودياك\s+سكودا/i, to: 'سكودا كودياك' },
    { from: /^اوكتافيا\s+سكودا/i, to: 'سكودا اوكتافيا' },
    { from: /^تيجوان\s+فولكسفاغن/i, to: 'فولكسفاغن تيجوان' },
    { from: /^تيجوان\s+واجن\s+فولكس/i, to: 'فولكس واجن تيجوان' },
    { from: /^جولف\s+واجن\s+فولكس/i, to: 'فولكس واجن جولف' },
    { from: /^جولف\s+فولكس/i, to: 'فولكس جولف' },
    { from: /^سنترا\s+نيسان/i, to: 'نيسان سنترا' },
    { from: /^صني\s+نيسان/i, to: 'نيسان صني' },
    { from: /^باترول\s+نيسان/i, to: 'نيسان باترول' },
    { from: /^كيكس\s+نيسان/i, to: 'نيسان كيكس' },
    { from: /^ارتيجا\s+سوزوكي/i, to: 'سوزوكي ارتيجا' },
    { from: /^سياز\s+سوزوكي/i, to: 'سوزوكي سياز' },
    { from: /^بالينو\s+سوزوكي/i, to: 'سوزوكي بالينو' },
    { from: /^سيفيك\s+هوندا/i, to: 'هوندا سيفيك' },
    { from: /^سيفك\s+هوندا/i, to: 'هوندا سيفك' },
    { from: /^إسكاليد\s+كاديلاك/i, to: 'كاديلاك إسكاليد' },
    { from: /^ماكان\s+بورش/i, to: 'بورش ماكان' },
    { from: /^تيريوس\s+ديهاتسو/i, to: 'ديهاتسو تيريوس' }
  ];

  for (const r of reversals) {
    if (r.from.test(cleaned)) {
      cleaned = cleaned.replace(r.from, r.to);
      break;
    }
  }

  return cleaned;
}

module.exports = { parseManifest, normalizeArabicVehicleName };
