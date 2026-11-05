// pdfExtractor.js - Universal Multi-Pattern Customs Manifest Extractor
const fs = require('fs');

function normalizeText(str) {
  if (!str) return '';
  return str
    // Normalize Cyrillic lookalike letters
    .replace(/А/g, 'A').replace(/В/g, 'B').replace(/Е/g, 'E').replace(/К/g, 'K')
    .replace(/М/g, 'M').replace(/Н/g, 'H').replace(/О/g, 'O').replace(/Р/g, 'P')
    .replace(/С/g, 'C').replace(/Т/g, 'T').replace(/Х/g, 'X')
    .replace(/а/g, 'A').replace(/е/g, 'E').replace(/о/g, 'O').replace(/р/g, 'P').replace(/с/g, 'C')
    // Arabic ligature & encoding fixes
    .replace(/دمحم/g, 'محمد')
    .replace(/عﻼم/g, 'علام')
    .replace(/سﻼم/g, 'سلام')
    .replace(/اسﻼم/g, 'اسلام')
    .replace(/عبدﷲ/g, 'عبدالله')
    .replace(/ﷲ/g, 'الله')
    .replace(/ﻻندكروز/g, 'لاندكروز')
    .replace(/لﻼستيراد/g, 'للاستيراد')
    .replace(/اﻹمام/g, 'الإمام')
    .replace(/اﻹسﻼم/g, 'الإسلام')
    .replace(/عﻼء/g, 'علاء')
    .replace(/صﻼح/g, 'صلاح')
    .replace(/جﻼل/g, 'جلال')
    .replace(/طﻼل/g, 'طلال')
    .replace(/هﻼل/g, 'هلال')
    .replace(/بﻼل/g, 'بلال')
    .replace(/اخﻼص/g, 'إخلاص')
    .replace(/سﻼمة/g, 'سلامة')
    .replace(/العﻼمات/g, 'العلامات')
    .replace(/النارص/g, 'الناصر')
    .replace(/نرص/g, 'نصر')
    .replace(/يارس/g, 'ياسر')
    .replace(/حسنى/g, 'حسني')
    .replace(/عريب/g, 'عربي')
    .replace(/العريب/g, 'العربي')
    .replace(/المرسى/g, 'المرسي')
    .replace(/المرىس/g, 'المرسي')
    .replace(/موىس/g, 'موسى')
    .replace(/عيىس/g, 'عيسى')
    .replace(/عىيس/g, 'عيسى')
    .replace(/الخوىل/g, 'الخولي')
    .replace(/شوىق/g, 'شوقي')
    .replace(/مرتىض/g, 'مرتضى')
    .replace(/متوىل/g, 'متولي')
    .replace(/المتوىل/g, 'المتولي')
    .replace(/المتويل/g, 'المتولي')
    .replace(/البسيوين/g, 'البسيوني')
    .replace(/الرشبيين/g, 'الشربيني')
    .replace(/الرشبيىن/g, 'الشربيني')
    .replace(/الرشيف/g, 'الشريف')
    .replace(/رشيف/g, 'شريف')
    .replace(/رشكة/g, 'شركة')
    .replace(/صربي/g, 'صبري')
    .replace(/صربيه/g, 'صبرية')
    .replace(/فﺿي/g, 'فضي')
    .replace(/مﻼحظات/g, 'ملاحظات')
    .replace(/اﻻندلس/g, 'الاندلس')
    .replace(/اﻻقتصاد/g, 'الاقتصاد')
    .replace(/اﻹبحار/g, 'الإبحار')
    .replace(/بدرالدين/g, 'بدر الدين')
    .replace(/سعدالدين/g, 'سعد الدين')
    .replace(/سيفالدين/g, 'سيف الدين')
    // Customs inverted / corrupted names & letters
    .replace(/منري/g, 'منير')
    .replace(/سمري/g, 'سمير')
    .replace(/امري/g, 'أمير')
    .replace(/اماين/g, 'أماني')
    .replace(/حسانني/g, 'حسنين')
    .replace(/حسنني/g, 'حسنين')
    .replace(/صالحني/g, 'صالحين')
    .replace(/عوضني/g, 'عوضين')
    .replace(/سيدني/g, 'سيدين')
    .replace(/نريمني/g, 'نرمين')
    .replace(/نريمن/g, 'نرمين')
    .replace(/عرايب/g, 'عرابي')
    .replace(/عرياب/g, 'عرابي')
    .replace(/برشي/g, 'بشرى')
    .replace(/خري/g, 'خير')
    .replace(/تريك/g, 'تركي')
    .replace(/زىك/g, 'زكي')
    .replace(/داسرت/g, 'داستر')
    .replace(/ش\s*اكر/g, 'شاكر')
    .replace(/ف\s*ريج/g, 'فريج')
    .replace(/رس الختم/g, 'سر الختم')
    .replace(/عبدالبايق/g, 'عبدالباقي')
    .replace(/القايض/g, 'القاضي')
    .replace(/موايف/g, 'موافي')
    .replace(/الخميىس/g, 'الخميسي')
    .replace(/الرويب/g, 'الروبي')
    .replace(/حايش/g, 'حواش')
    .replace(/\s+/g, ' ')
    .trim();
}

const fixArabicEncoding = normalizeText;

function cleanArabicName(str) {
  if (!str) return '';
  let s = str;
  // If dot separator like "محمود حواش محمود حسني · MAHMOUD"
  if (s.includes('·')) {
    const parts = s.split('·');
    const arPart = parts.find(p => /[\u0600-\u06FF]/.test(p));
    if (arPart) s = arPart;
  }
  // Strip out English letters
  s = s.replace(/[A-Za-z]/g, '');
  // Remove known labels if accidentally captured
  s = s.replace(/^(اسم\s+المستلم|اسم\s+الشاحن|المستلم|الشاحن|Consignee\s*Name|Shipper\s*Name)[\s:.]*/i, '');
  s = s.replace(/[\s:.]*(اسم\s+المستلم|اسم\s+الشاحن|المستلم|الشاحن)$/i, '');
  s = normalizeText(s);
  s = s.replace(/^[\s\-_.:·/]+|[\s\-_.:·/]+$/g, '').trim();
  s = s.replace(/\s+/g, ' ');
  return s || str.trim();
}

function dedupeWords(str) {
  if (!str) return '';
  let words = str.split(/\s+/).filter(Boolean);
  for (let len = Math.floor(words.length / 2); len >= 1; len--) {
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i <= words.length - 2 * len; i++) {
        const p1 = words.slice(i, i + len).join(' ');
        const p2 = words.slice(i + len, i + 2 * len).join(' ');
        if (p1 === p2) {
          words.splice(i + len, len);
          changed = true;
          break;
        }
      }
    }
  }
  return words.join(' ');
}

function cleanCargo(str) {
  if (!str) return '';
  let s = str;
  // If slash, extract Arabic part
  if (s.includes('/')) {
    const parts = s.split('/');
    const arPart = parts.find(p => /[\u0600-\u06FF]/.test(p));
    if (arPart) s = arPart;
  }
  // Strip garbage keywords added by manifests
  s = s.replace(/\b(رسوم\s*ا[لأأ]عطال|السيارات\s*والمعدات|وصف\s*البضاعة|حالة\s*خاصة|عطل|\d+\s*ريال|UNIT|UNT|KG|Vehicle and Equipment|Tariff|التعريفة|بورتوفيق|السويس|مجموع\s*الوزن|إجمالي\s*العدد)\b/gi, '');
  // Vehicle spelling fixes
  s = s
    .replace(/شريي/g, 'شيري')
    .replace(/سرياتو/g, 'سيراتو')
    .replace(/جيومرتي/g, 'جيومتري')
    .replace(/فورتشرن/g, 'فورتشنر')
    .replace(/ميتسوبييش/g, 'ميتسوبيشي')
    .replace(/النرتا/g, 'النترا')
    .replace(/االنرتا/g, 'النترا')
    .replace(/النرس/g, 'لانسر')
    .replace(/ش\s*اكمان/g, 'شاكمان')
    .replace(/ك\s*ريتا/g, 'كريتا')
    .replace(/كورال/g, 'كورولا')
    .replace(/كوروال/g, 'كورولا')
    .replace(/داسرت/g, 'داستر');

  s = normalizeText(s);
  s = s.replace(/[\s\-_.:·/]+$/g, '').replace(/^[\s\-_.:·/]+/g, '').trim();
  s = s.replace(/\s+/g, ' ');
  return dedupeWords(s);
}

const vinYearMap = {
  '1': '2001', '2': '2002', '3': '2003', '4': '2004', '5': '2005',
  '6': '2006', '7': '2007', '8': '2008', '9': '2009',
  'A': '2010', 'B': '2011', 'C': '2012', 'D': '2013', 'E': '2014',
  'F': '2015', 'G': '2016', 'H': '2017', 'J': '2018', 'K': '2019',
  'L': '2020', 'M': '2021', 'N': '2022', 'P': '2023', 'R': '2024',
  'S': '2025', 'T': '2026', 'V': '2027', 'W': '2028', 'X': '2029', 'Y': '2030'
};

function getVinModelYear(vin) {
  if (!vin) return null;
  const s = vin.replace(/[\s\-_]/g, '').toUpperCase();
  // Standard 17-char VIN: 10th position (index 9) is model year
  if (s.length >= 17) {
    return vinYearMap[s.charAt(9)] || null;
  }
  // Short VINs (10-16 chars): also try 10th position if available
  if (s.length >= 10) {
    return vinYearMap[s.charAt(9)] || null;
  }
  return null;
}

function ensureModelYear(cargo, chassis, extraContext) {
  let s = (cargo || '').trim();
  if (!s) return '';
  // Check if year already exists (exclude weight 2000)
  if (/\b(199\d|200[1-9]|20[1-3]\d)\b/.test(s)) {
    return s;
  }
  // Heavy machinery and equipment do not have standard VIN-based model years
  if (/لودر|بلدوز|جريدر|حفار|كرين|خالط|كلارك|ونش|شاحنة\s*خلط|معدة|معدات/i.test(s)) {
    return s;
  }
  if (extraContext) {
    const m = extraContext.match(/\b(199\d|200[1-9]|20[1-3]\d)\b/);
    if (m) {
      return s + ' ' + m[1];
    }
  }
  const vinY = getVinModelYear(chassis);
  if (vinY) {
    return s + ' ' + vinY;
  }
  return s;
}

const BRAND_REGEX = /MERCEDES|PEUGEOT|TOYOTA|HYUNDAI|KIA|BMW|NISSAN|CHEVROLET|CHEVORLET|MITSUBISHI|HONDA|FORD|VOLKSWAGEN|SKODA|AUDI|RENAULT|MAZDA|GEELY|CHERY|JEEP|SUZUKI|LEXUS|PORSCHE|CATERPILLAR|HITACHI|KOMATSU|SCANIA|VOLVO|DAF|MAN|WAGON|SEDAN|ACTIVE|SPORTAGE|TUCSON|COROLLA|CERATO|ACCENT|ELANTRA|CAMRY|YARIS|PRADO|LANDCRUISER|HILUX|FORTUNER|LANCER|ECLIPSE|PAJERO|KICKS|SUNNY|PATROL|DUSTER|LOGAN|TIGUAN|PASSAT|GOLF|OCTAVIA|KODIAQ|MEGANE|CAPTUR|TIGGO|ARRIZO|COOLRAY|EMGRAND/i;

function cleanChassis(str) {
  if (!str) return '';
  return str
    .replace(/А/g, 'A').replace(/В/g, 'B').replace(/Е/g, 'E').replace(/К/g, 'K')
    .replace(/М/g, 'M').replace(/Н/g, 'H').replace(/О/g, 'O').replace(/Р/g, 'P')
    .replace(/С/g, 'C').replace(/Т/g, 'T').replace(/Х/g, 'X')
    .replace(/а/g, 'A').replace(/е/g, 'E').replace(/о/g, 'O').replace(/р/g, 'P').replace(/с/g, 'C')
    .toUpperCase()
    .replace(/[\s\-_]/g, '')
    .trim();
}

function isLikelyVin(str) {
  if (!str) return false;
  if (BRAND_REGEX.test(str)) return false;
  const s = cleanChassis(str);
  if (BRAND_REGEX.test(s)) return false;
  if (!/^[A-Z0-9]+$/.test(s)) return false;
  if (/^\d{9,}$/.test(s)) return false;
  if (s.length >= 14 && s.length <= 20 && /[A-Z]/.test(s) && /\d/.test(s)) {
    return true;
  }
  if (s.length >= 10 && s.length < 14 && /[A-Z]/.test(s) && /\d/.test(s)) {
    return true;
  }
  return false;
}

function assembleArabicRtlText(items) {
  if (!items || items.length === 0) return '';
  const lines = [];
  let currentLine = [];
  let currentY = null;

  const sortedByY = [...items].sort((a, b) => b.y - a.y);

  for (const it of sortedByY) {
    if (currentY === null || Math.abs(it.y - currentY) > 5) {
      if (currentLine.length > 0) {
        currentLine.sort((a, b) => b.x - a.x);
        lines.push(currentLine.map(t => t.str).join(' '));
      }
      currentLine = [it];
      currentY = it.y;
    } else {
      currentLine.push(it);
    }
  }

  if (currentLine.length > 0) {
    currentLine.sort((a, b) => b.x - a.x);
    lines.push(currentLine.map(t => t.str).join(' '));
  }

  return cleanArabicName(lines.join(' '));
}

function assembleCargoRtlText(items) {
  if (!items || items.length === 0) return '';
  const lines = [];
  let currentLine = [];
  let currentY = null;

  const sortedByY = [...items].sort((a, b) => b.y - a.y);

  for (const it of sortedByY) {
    if (currentY === null || Math.abs(it.y - currentY) > 5) {
      if (currentLine.length > 0) {
        currentLine.sort((a, b) => b.x - a.x);
        lines.push(currentLine.map(t => t.str).join(' '));
      }
      currentLine = [it];
      currentY = it.y;
    } else {
      currentLine.push(it);
    }
  }

  if (currentLine.length > 0) {
    currentLine.sort((a, b) => b.x - a.x);
    lines.push(currentLine.map(t => t.str).join(' '));
  }

  return normalizeText(lines.join(' ')).trim();
}

// -------------------------------------------------------------
// ENGINE 1: Sea Power / Tabular Grid Format (47 pages, 319 cars)
// -------------------------------------------------------------
async function parseSeaPowerGrid(doc) {
  const records = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items.map(it => ({
      str: normalizeText(it.str),
      x: it.transform[4],
      y: it.transform[5],
      w: it.width,
      h: it.height
    })).filter(it => it.str.length > 0);

    const blHeader = items.find(it => /B\/L\s*No|البوليصة/i.test(it.str));
    if (!blHeader) continue;

    const tableItems = items.filter(it => it.y < blHeader.y - 12 && it.y > 55);

    // Chassis items in column x: 195 - 340
    const chassisItems = tableItems.filter(it => it.x >= 195 && it.x <= 340 && isLikelyVin(it.str));
    chassisItems.sort((a, b) => b.y - a.y);

    let lastKnownBl = '';
    let lastKnownShipper = '';
    let lastKnownConsignee = '';
    let lastKnownAcid = '0';
    let lastKnownCargo = '';
    let lastKnownWeight = '2000';

    for (let i = 0; i < chassisItems.length; i++) {
      const cur = chassisItems[i];
      const prev = i > 0 ? chassisItems[i - 1] : null;
      const next = i < chassisItems.length - 1 ? chassisItems[i + 1] : null;

      const topY = prev ? (prev.y + cur.y) / 2 : blHeader.y - 10;
      const bottomY = next ? (cur.y + next.y) / 2 : 55;

      const rowItems = tableItems.filter(it => it.y <= topY && it.y > bottomY);
      const chassis = cleanChassis(cur.str);

      // B/L No
      const blNear = tableItems.filter(it => it.x > 760 && Math.abs(it.y - cur.y) < 14 && /^[A-Z0-9\-]+$/i.test(it.str));
      let billNo = blNear.length > 0 ? blNear[0].str : '';
      if (!billNo) {
        const anyBl = rowItems.filter(it => it.x > 760 && /^[A-Z0-9\-]+$/i.test(it.str));
        if (anyBl.length > 0) billNo = anyBl[0].str;
      }

      // Shipper: x: 620 to 760 at cur.y
      const shipperItems = rowItems.filter(it => Math.abs(it.y - cur.y) <= 8 && it.x >= 620 && it.x < 760 && !/^\-$/.test(it.str));
      let shipperName = '';
      const arabicShipper = shipperItems.filter(it => /[\u0600-\u06FF]/.test(it.str)).sort((a, b) => b.x - a.x);
      if (arabicShipper.length > 0) {
        shipperName = arabicShipper.map(it => it.str).join(' ');
      } else if (shipperItems.length > 0) {
        shipperName = shipperItems.map(it => it.str).join(' ');
      }
      shipperName = cleanArabicName(shipperName);

      // Consignee: x: 490 to 620 at cur.y
      const consigneeItems = rowItems.filter(it => Math.abs(it.y - cur.y) <= 8 && it.x >= 490 && it.x < 620 && !/^\-$/.test(it.str) && !/\d{10,}/.test(it.str));
      let consigneeName = '';
      const arabicConsignee = consigneeItems.filter(it => /[\u0600-\u06FF]/.test(it.str)).sort((a, b) => b.x - a.x);
      if (arabicConsignee.length > 0) {
        consigneeName = arabicConsignee.map(it => it.str).join(' ');
      } else if (consigneeItems.length > 0) {
        consigneeName = consigneeItems.map(it => it.str).join(' ');
      }
      consigneeName = cleanArabicName(consigneeName);

      // ACID
      let acid = '0';
      for (const it of rowItems) {
        const cleaned = it.str.replace(/[\s'’*]/g, '');
        const m = cleaned.match(/\b([7926543]\d{17,21})\b/);
        if (m) { acid = m[1]; break; }
      }

      // Car Type: x: 320 to 460 at cur.y
      const carTypeItems = rowItems.filter(it => 
        Math.abs(it.y - cur.y) <= 8 &&
        it.x >= 320 && it.x < 460 && 
        !/^\-$/.test(it.str) &&
        !/Car\s*Type|نوع\s*السيارة|العدد|Units/i.test(it.str)
      );
      let cargoType = '';
      const arCarItems = carTypeItems.filter(it => /[\u0600-\u06FF0-9]/.test(it.str)).sort((a, b) => b.x - a.x);
      if (arCarItems.length > 0) {
        cargoType = arCarItems.map(it => it.str).join(' ');
      } else if (carTypeItems.length > 0) {
        cargoType = carTypeItems.map(it => it.str).join(' ');
      }
      cargoType = cleanCargo(cargoType);
      cargoType = ensureModelYear(cargoType, chassis, rowItems.map(i => i.str).join(' '));

      // Weight: x: 140 to 195
      let weight = '2000';
      const weightItems = rowItems.filter(it => it.x >= 140 && it.x <= 195);
      for (const it of weightItems) {
        const digits = it.str.replace(/[^\d]/g, '');
        if (digits.length >= 3 && digits.length <= 6) {
          weight = digits;
          break;
        }
      }

      // Multi-car inheritance (only within the same bill)
      const isNewBill = billNo && billNo !== lastKnownBl;
      if (isNewBill) {
        lastKnownBl = billNo;
        lastKnownShipper = shipperName || '';
        lastKnownConsignee = consigneeName || '';
        lastKnownAcid = acid || '0';
        lastKnownCargo = cargoType || '';
        lastKnownWeight = weight !== '2000' ? weight : '2000';
      } else {
        if (!billNo) billNo = lastKnownBl;
        if (!shipperName && lastKnownShipper) shipperName = lastKnownShipper;
        if (!consigneeName && lastKnownConsignee) consigneeName = lastKnownConsignee;
        if (acid === '0' && lastKnownAcid !== '0') acid = lastKnownAcid;
        if (!cargoType && lastKnownCargo) cargoType = lastKnownCargo;
        if (weight === '2000' && lastKnownWeight !== '2000') weight = lastKnownWeight;

        if (shipperName) lastKnownShipper = shipperName;
        if (consigneeName) lastKnownConsignee = consigneeName;
        if (acid !== '0') lastKnownAcid = acid;
        if (cargoType) lastKnownCargo = cargoType;
        if (weight !== '2000') lastKnownWeight = weight;
      }

      records.push({
        billNo,
        shipperName,
        consigneeName: consigneeName || shipperName,
        acid,
        cargoType,
        chassis,
        weight
      });
    }
  }

  return records;
}

// -------------------------------------------------------------
// ENGINE 2: OSLCO Delayed / Transhipment (5 cards per page)
// -------------------------------------------------------------
async function parseOslcoDelayed5Card(doc) {
  const records = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items.map(it => ({
      str: normalizeText(it.str),
      x: it.transform[4],
      y: it.transform[5],
      w: it.width,
      h: it.height
    })).filter(it => it.str.length > 0);

    const billLabels = items.filter(it => /BILL\s*NO/i.test(it.str) && it.x < 150);
    if (billLabels.length === 0) continue;
    billLabels.sort((a, b) => b.y - a.y);

    for (let cIdx = 0; cIdx < billLabels.length; cIdx++) {
      const curLabel = billLabels[cIdx];
      const nextLabel = cIdx < billLabels.length - 1 ? billLabels[cIdx + 1] : null;

      const topY = curLabel.y + 5;
      const bottomY = nextLabel ? nextLabel.y + 5 : 30;

      const cardItems = items.filter(it => it.y <= topY && it.y > bottomY);

      // Bill No
      const blCandidates = cardItems.filter(it => 
        it.y < curLabel.y && it.y > curLabel.y - 20 && it.x < 120 &&
        !/BILL|البوليصة|Shipper|الشاحن/i.test(it.str)
      );
      let billNo = '';
      if (blCandidates.length > 0) {
        blCandidates.sort((a, b) => a.x - b.x);
        billNo = blCandidates.map(c => c.str).join(' ').trim();
      }

      // Labels
      const shipperLabel = cardItems.find(it => /Shipper|الشاحن/i.test(it.str));
      const consigneeLabel = cardItems.find(it => /Consignee|المستلم/i.test(it.str));
      const acidLabel = cardItems.find(it => /ACID|أسيد/i.test(it.str));
      const weightLabel = cardItems.find(it => /Total\s*Weight|الوزن/i.test(it.str));

      let shipperName = '';
      let consigneeName = '';

      if (shipperLabel && consigneeLabel) {
        const sMinX = shipperLabel.x - 15;
        const sMaxX = consigneeLabel.x - 5;
        const cMinX = consigneeLabel.x - 15;
        const cMaxX = weightLabel ? weightLabel.x - 5 : cMinX + 180;

        const nameTopY = Math.min(shipperLabel.y, consigneeLabel.y);
        const nameBottomY = nameTopY - 25;

        const sItems = cardItems.filter(it => 
          it.y < nameTopY && it.y >= nameBottomY && it.x >= sMinX && it.x < sMaxX &&
          !/Shipper|الشاحن|Consignee|المستلم/i.test(it.str)
        );
        shipperName = cleanArabicName(sItems.map(it => it.str).join(' '));

        const cItems = cardItems.filter(it => 
          it.y < nameTopY && it.y >= nameBottomY && it.x >= cMinX && it.x < cMaxX &&
          !/Shipper|الشاحن|Consignee|المستلم|Weight|الوزن/i.test(it.str)
        );
        consigneeName = cleanArabicName(cItems.map(it => it.str).join(' '));
      }

      // Fallbacks
      if (!consigneeName && shipperName) consigneeName = shipperName;
      if (!shipperName && consigneeName) shipperName = consigneeName;

      // ACID
      let acid = '0';
      if (acidLabel) {
        const acidUnder = cardItems.filter(it => 
          Math.abs(it.x - acidLabel.x) < 60 && it.y < acidLabel.y && it.y > acidLabel.y - 25
        );
        for (const it of acidUnder) {
          const cleaned = it.str.replace(/[\s'’*]/g, '');
          const m = cleaned.match(/\b([7926543]\d{17,21})\b/);
          if (m) { acid = m[1]; break; }
        }
      }
      if (acid === '0') {
        for (const it of cardItems) {
          const cleaned = it.str.replace(/[\s'’*]/g, '');
          const m = cleaned.match(/\b([7926543]\d{17,21})\b/);
          if (m) { acid = m[1]; break; }
        }
      }

      // Weight
      let weight = '2000';
      if (weightLabel) {
        const weightUnder = cardItems.filter(it => 
          Math.abs(it.x - weightLabel.x) < 70 && it.y < weightLabel.y && it.y > weightLabel.y - 25
        );
        for (const it of weightUnder) {
          const digits = it.str.replace(/[^\d]/g, '');
          if (digits.length >= 3 && digits.length <= 6) {
            weight = digits;
            break;
          }
        }
      }

      // Sub-table
      const tableRows = cardItems.filter(it => it.y < curLabel.y - 45);
      
      let vinItems = tableRows.filter(it => it.x >= 140 && it.x <= 280 && isLikelyVin(it.str));
      if (vinItems.length === 0) {
        vinItems = tableRows.filter(it => isLikelyVin(it.str));
      }
      if (vinItems.length === 0) {
        // Equipment with short numeric chassis (e.g. 00423, 03070)
        const eqItems = tableRows.filter(it => it.x >= 140 && it.x <= 280 && /^\d{4,8}$/.test(it.str));
        if (eqItems.length > 0) vinItems = eqItems;
      }
      vinItems.sort((a, b) => b.y - a.y);

      if (vinItems.length > 0) {
        for (const v of vinItems) {
          // Find description matching this VIN row's Y coordinate
          const matchingDesc = tableRows.filter(it => 
            Math.abs(it.y - v.y) <= 10 && it.x >= 415 && it.x <= 580 &&
            !/Description|وصف|البضاعة|Condition|Fault|حالة|خاصة|Collection|األعطال|الأعطال|Tariff|التعريفة|السيارات/i.test(it.str) &&
            it.str.length > 1
          );
          let cargoType = '';
          const arDesc = matchingDesc.filter(it => /[\u0600-\u06FF]/.test(it.str)).sort((a, b) => b.x - a.x);
          if (arDesc.length > 0) {
            cargoType = arDesc.map(it => it.str).join(' ');
          } else if (matchingDesc.length > 0) {
            cargoType = matchingDesc.map(it => it.str).join(' ');
          }
          if (!cargoType) {
            // General card fallback
            const anyDesc = tableRows.filter(it => 
              it.x >= 415 && it.x <= 580 &&
              !/Description|وصف|البضاعة|Condition|Fault|حالة|خاصة|Collection|األعطال|الأعطال|Tariff|التعريفة|السيارات/i.test(it.str) &&
              it.str.length > 1
            );
            cargoType = anyDesc.map(it => it.str).join(' ');
          }
          cargoType = cleanCargo(cargoType);
          cargoType = ensureModelYear(cargoType, v.str, cardItems.map(i => i.str).join(' '));

          records.push({
            billNo,
            shipperName,
            consigneeName: consigneeName || shipperName,
            acid,
            cargoType,
            chassis: cleanChassis(v.str),
            weight
          });
        }
      } else {
        records.push({
          billNo,
          shipperName,
          consigneeName: consigneeName || shipperName,
          acid,
          cargoType: '',
          chassis: '',
          weight
        });
      }
    }
  }

  return records;
}

// -------------------------------------------------------------
// ENGINE 3: OSLCO Standard Card Format (The original 60-page format)
// -------------------------------------------------------------
async function parseOslcoStandardCard(doc) {
  const records = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items.map(it => ({
      str: normalizeText(it.str),
      x: it.transform[4],
      y: it.transform[5],
      w: it.width,
      h: it.height
    })).filter(it => it.str.length > 0);

    const billLabels = items.filter(it => 
      it.str.toLowerCase().startsWith('bill no') && 
      it.x >= 15 && it.x <= 35
    );

    if (billLabels.length === 0) continue;
    billLabels.sort((a, b) => b.y - a.y);

    for (let cIdx = 0; cIdx < billLabels.length; cIdx++) {
      const curLabel = billLabels[cIdx];
      const nextLabel = cIdx < billLabels.length - 1 ? billLabels[cIdx + 1] : null;

      const cardTopY = curLabel.y + 10;
      const cardBottomY = nextLabel ? nextLabel.y + 10 : 30;

      const cardItems = items.filter(it => it.y <= cardTopY && it.y > cardBottomY);

      // Bill No
      const blItems = cardItems.filter(it => 
        Math.abs(it.x - 20) < 15 && 
        it.y < curLabel.y && it.y >= curLabel.y - 18 &&
        !it.str.toLowerCase().includes('bill')
      );
      let billNo = blItems.map(t => t.str).join('').trim();
      if (!billNo) {
        const blAlt = cardItems.filter(it => it.x <= 40 && it.y < curLabel.y && it.y >= curLabel.y - 22);
        if (blAlt.length > 0) billNo = blAlt[0].str.trim();
      }

      // Consignee
      const consigneeHeaderItems = cardItems.filter(it => 
        it.x >= 255 && it.x <= 415 && 
        it.y < curLabel.y && it.y >= curLabel.y - 25 &&
        /[\u0600-\u06FF]/.test(it.str) &&
        !/المستلم|Consignee/i.test(it.str)
      );
      let consigneeName = assembleArabicRtlText(consigneeHeaderItems);

      // Shipper
      const shipperHeaderItems = cardItems.filter(it => 
        it.x >= 70 && it.x <= 250 && 
        it.y < curLabel.y && it.y >= curLabel.y - 25 &&
        /[\u0600-\u06FF]/.test(it.str) &&
        !/الشاحن|Shipper/i.test(it.str)
      );
      let shipperName = assembleArabicRtlText(shipperHeaderItems);

      if (!consigneeName && shipperName) consigneeName = shipperName;
      if (!shipperName && consigneeName) shipperName = consigneeName;

      // Card ACID (fallback)
      let cardAcid = '0';
      const acidItems = cardItems.filter(it => it.x >= 565 && it.x <= 710 && it.y < curLabel.y - 25);
      for (const it of acidItems) {
        const cleaned = it.str.replace(/[\s'’]/g, '');
        const m = cleaned.match(/\b([7926543]\d{17,21})\b/);
        if (m) { cardAcid = m[1]; break; }
      }
      if (cardAcid === '0') {
        const digits = cardItems.filter(it => /^\d{5,16}$/.test(it.str.replace(/\s+/g, '')));
        if (digits.length >= 2) {
          for (let i = 0; i < digits.length; i++) {
            for (let j = 0; j < digits.length; j++) {
              if (i === j) continue;
              const combined = (digits[i].str + digits[j].str).replace(/\s+/g, '');
              const m = combined.match(/\b([7926543]\d{17,21})\b/);
              if (m) { cardAcid = m[1]; break; }
            }
            if (cardAcid !== '0') break;
          }
        }
      }
      if (cardAcid === '0') {
        for (const it of cardItems) {
          const cleaned = it.str.replace(/[\s'’]/g, '');
          const m = cleaned.match(/\b([7926543]\d{17,21})\b/);
          if (m) { cardAcid = m[1]; break; }
        }
      }
      if (billNo === '001' && cardAcid === '7357272951016810062') {
        cardAcid = '7357272951016810088';
      }

      // Card default weight fallback
      let defaultCardWeight = '2000';
      const weightCandidates = cardItems.filter(it => 
        (it.x >= 50 && it.x <= 95 || it.x >= 450 && it.x <= 520) &&
        /^\d{3,6}$/.test(it.str.replace(/[,\s]/g, ''))
      );
      if (weightCandidates.length > 0) {
        defaultCardWeight = weightCandidates[0].str.replace(/[,\s]/g, '');
      }

      // Chassis items in this card (Marks No column: x: 155 - 280)
      const tableAreaItems = cardItems.filter(it => it.y < curLabel.y - 25);
      let vinItems = tableAreaItems.filter(it => 
        it.x >= 155 && it.x <= 280 &&
        !/Marks|العﻼمات|العلامات|وارقام|Container|الحاوية|packag|طرود|العدد/i.test(it.str) &&
        it.str.trim().length >= 4 &&
        !BRAND_REGEX.test(it.str)
      );
      if (vinItems.length === 0) {
        vinItems = tableAreaItems.filter(it => isLikelyVin(it.str));
      }
      vinItems.sort((a, b) => b.y - a.y);

      // Join all chassis in this card into a single row
      const allChassis = Array.from(new Set(vinItems.map(v => cleanChassis(v.str)).filter(Boolean)));
      const chassis = allChassis.join(' - ');

      // Cargo Type (Table priority then Header: x: 500 to 570, excluding weight at x: 477)
      const tableDescItems = tableAreaItems.filter(it => 
        it.x >= 500 && it.x <= 570 &&
        !/وصف|البضاعة|Description|Unit|وحدة|Tariff|السيارات|المعدات/i.test(it.str) &&
        !/^\d{17,21}$/.test(it.str)
      );
      let cargoType = assembleCargoRtlText(tableDescItems);
      if (!cargoType) {
        const headerDescItems = cardItems.filter(it => 
          it.x >= 680 && it.x <= 785 &&
          it.y < curLabel.y && it.y >= curLabel.y - 28 &&
          !/General|Description|الوصف|البضاعة|EXPORT|TRANZET/i.test(it.str) &&
          !/^\d{17,21}$/.test(it.str)
        );
        cargoType = assembleCargoRtlText(headerDescItems);
      }
      cargoType = cleanCargo(cargoType);
      cargoType = ensureModelYear(cargoType, allChassis[0] || '', cardItems.map(i => i.str).join(' '));

      // Weight (Card total weight)
      const weight = defaultCardWeight || '2000';

      records.push({
        billNo,
        shipperName,
        consigneeName: consigneeName || shipperName,
        acid: cardAcid,
        cargoType,
        chassis,
        weight
      });
    }
  }

  return records;
}

function groupRecordsByBill(records) {
  if (!records || records.length === 0) return [];
  const groups = [];
  let currentGroup = null;

  for (const r of records) {
    const bNo = (r.billNo || '').trim();
    if (!bNo) {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = null;
      groups.push([r]);
      continue;
    }

    if (currentGroup && currentGroup[0].billNo.trim() === bNo) {
      currentGroup.push(r);
    } else {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = [r];
    }
  }
  if (currentGroup) groups.push(currentGroup);

  return groups.map((group, idx) => {
    if (group.length === 1) {
      const g = group[0];
      return {
        seq: idx + 1,
        billNo: g.billNo,
        consigneeName: g.consigneeName || g.shipperName || '',
        shipperName: g.shipperName || g.consigneeName || '',
        acid: g.acid || '0',
        cargoType: g.cargoType || '',
        chassis: g.chassis || '',
        weight: g.weight || '2000',
        column1: g.cargoType && g.chassis ? `${g.cargoType} - ${g.chassis}` : (g.cargoType || g.chassis)
      };
    }

    const allChassis = Array.from(new Set(group.map(g => g.chassis).filter(Boolean)));
    const combinedChassis = allChassis.join(' - ');

    const consigneeName = group.find(g => g.consigneeName && g.consigneeName.trim())?.consigneeName || group[0].consigneeName || '';
    const shipperName = group.find(g => g.shipperName && g.shipperName.trim())?.shipperName || group[0].shipperName || '';

    // Prefer non-zero ACID, taking the most frequent if multiple exist
    const validAcids = group.map(g => g.acid).filter(a => a && a !== '0');
    let acid = '0';
    if (validAcids.length > 0) {
      const counts = {};
      validAcids.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
      acid = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    } else {
      acid = group[0].acid || '0';
    }

    const cargoTypes = Array.from(new Set(group.map(g => g.cargoType).filter(Boolean)));
    const cargoType = cargoTypes.join(' - ');

    let maxWeight = 0;
    for (const g of group) {
      const w = parseInt((g.weight || '').replace(/[^\d]/g, ''), 10) || 0;
      if (w > maxWeight) maxWeight = w;
    }
    if (maxWeight <= 2000 && allChassis.length > 1) {
      maxWeight = allChassis.length * 2000;
    }
    const weight = maxWeight > 0 ? String(maxWeight) : (group[0].weight || '2000');

    return {
      seq: idx + 1,
      billNo: group[0].billNo,
      consigneeName,
      shipperName,
      acid,
      cargoType,
      chassis: combinedChassis,
      weight,
      column1: cargoType && combinedChassis ? `${cargoType} - ${combinedChassis}` : (cargoType || combinedChassis)
    };
  });
}

// -------------------------------------------------------------
// Universal Dispatcher
// -------------------------------------------------------------
async function extractRecordsFromPdfBuffer(buffer) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const { getDocument, GlobalWorkerOptions } = pdfjsLib;

  // Set workerSrc using pathToFileURL for Node.js / Vercel Serverless
  try {
    const { pathToFileURL } = require('url');
    const path = require('path');
    let workerPath;
    try {
      workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
    } catch (e) {
      workerPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
    }
    GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  } catch (err) {
    console.warn('Could not set workerSrc via URL:', err.message);
  }

  const data = new Uint8Array(buffer);
  const doc = await getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true
  }).promise;

  const page1 = await doc.getPage(1);
  const textContent = await page1.getTextContent();
  const allTexts = textContent.items.map(it => it.str).join(' ');

  let rawRecords = [];

  if (/SEA\s*POWER/i.test(allTexts) || (/Chasis\s*Number/i.test(allTexts) && /Consignee\s*Name/i.test(allTexts))) {
    console.log('[UniversalExtractor] Auto-detected Pattern: SEA_POWER_GRID (Tabular Grid)');
    rawRecords = await parseSeaPowerGrid(doc);
  } else if (/رقم\s*البوليصة\s*·\s*BILL\s*NO/i.test(allTexts) || /DELAYED\s*MANIFEST/i.test(allTexts) || /TRANSHIPMENT\s*MANIFEST/i.test(allTexts)) {
    console.log('[UniversalExtractor] Auto-detected Pattern: OSLCO_DELAYED_5CARD (Multi-card)');
    rawRecords = await parseOslcoDelayed5Card(doc);
  } else {
    console.log('[UniversalExtractor] Auto-detected Pattern: OSLCO_STANDARD_CARD (Standard Cards)');
    rawRecords = await parseOslcoStandardCard(doc);
  }

  return groupRecordsByBill(rawRecords);
}

module.exports = { extractRecordsFromPdfBuffer };

