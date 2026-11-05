// Frontend Application Logic for Manifest Converter

let currentRecords = [];
let filteredRecords = [];

// Sample data extracted from the user's prompt (All records!)
const SAMPLE_MANIFEST_DATA = [
  {"billNo":"001","consigneeName":"معرض سيلفر ارو لتجارة السيارات","acid":"7357272951016810088","cargoType":"تويوتا هايس","chassis":"JTFEB9CP2T6078320","weight":"2000","column1":"تويوتا هايس - JTFEB9CP2T6078320"},
  {"billNo":"002","consigneeName":"محمد محمود محمد محمود علام","acid":"9999102091000002154","cargoType":"كيا ريو","chassis":"KNADN5122D6804591","weight":"2000","column1":"كيا ريو - KNADN5122D6804591"},
  {"billNo":"003","consigneeName":"أنطون رسمي نخله عبدالله","acid":"9999101821000000365","cargoType":"هيونداي توسان","chassis":"TMAJB81B5RJ409278","weight":"2000","column1":"هيونداي توسان - TMAJB81B5RJ409278"},
  {"billNo":"100","consigneeName":"اسماعيل محمد احمد حسن","acid":"7065474891014210025","cargoType":"لودر","chassis":"CAT0980GAAXG00956 - 70H10363","weight":"28000","column1":"لودر - CAT0980GAAXG00956 - 70H10363"},
  {"billNo":"102","consigneeName":"مروه سمير محمد احمد وهدان","acid":"9999101921000003284","cargoType":"بيجو اكتيف 3008 اسود 2023","chassis":"VF3M45GYZPS008435","weight":"2000","column1":"بيجو اكتيف 3008 اسود 2023 - VF3M45GYZPS008435"},
  {"billNo":"104","consigneeName":"كمال السعيد كمال عمر","acid":"9999101991000000374","cargoType":"بيجو هتشباك 2020 رمادي","chassis":"VF3M45GY9LL005981","weight":"2000","column1":"بيجو هتشباك 2020 رمادي - VF3M45GY9LL005981"},
  {"billNo":"105","consigneeName":"تامر بهي الدين محمد ابراهيم","acid":"9992025110000013000","cargoType":"تويوتا ﻻندكروز 2026 ابيض","chassis":"JTEFU73J9TF014861","weight":"2000","column1":"تويوتا ﻻندكروز 2026 ابيض - JTEFU73J9TF014861"},
  {"billNo":"106","consigneeName":"سامح محمد إسماعيل حسنين بدوي  مبادره","acid":"9999101991000001786","cargoType":"هوندا زد ار في 2025 رصاصي‎","chassis":"JHLRZ3838SX404240","weight":"2000","column1":"هوندا زد ار في 2025 رصاصي‎ - JHLRZ3838SX404240"},
  {"billNo":"107","consigneeName":"هاله  محمد ابوالفتوح شاهين  مبادره","acid":"9999101981000001654","cargoType":"هوند زد ار في 2025 اخضر فاتح","chassis":"JHLRZ3835SX407760","weight":"2000","column1":"هوند زد ار في 2025 اخضر فاتح - JHLRZ3835SX407760"},
  {"billNo":"108","consigneeName":"محمد عوض يوسف عيسي مبادره","acid":"9999101531000000261","cargoType":"كياسبورتاج 2026 اخضر","chassis":"LJD7AA1D5T0253837","weight":"2000","column1":"كياسبورتاج 2026 اخضر - LJD7AA1D5T0253837"},
  {"billNo":"109","consigneeName":"ريهام حموده حسن زيور  مبادره","acid":"9999101931000002053","cargoType":"سكودا كودياك 2026 اسود","chassis":"TMBJC9PS9TT090145","weight":"2000","column1":"سكودا كودياك 2026 اسود - TMBJC9PS9TT090145"},
  {"billNo":"110","consigneeName":"محمد حسن منصور علي  مبادره","acid":"9999102011000000263","cargoType":"هيونداي توسان 2025 رمادي","chassis":"TMAJB81B3SJ569245","weight":"2000","column1":"هيونداي توسان 2025 رمادي - TMAJB81B3SJ569245"},
  {"billNo":"111","consigneeName":"اسلام جمال محمد علي سلام مبادره","acid":"9999101881000003207","cargoType":"سكودا كودياك 2026 رمادي","chassis":"TMBJC9PSXTT085858","weight":"2000","column1":"سكودا كودياك 2026 رمادي - TMBJC9PSXTT085858"},
  {"billNo":"112","consigneeName":"مصطفي عاشور شعبان الخولي مالك اول","acid":"9999101911000001982","cargoType":"كيا سيراتيو 2015 ازرق","chassis":"KNAFJ4116F5878966","weight":"2000","column1":"كيا سيراتيو 2015 ازرق - KNAFJ4116F5878966"},
  {"billNo":"113","consigneeName":"عمر علي حسن عامر مبادره","acid":"9999101801000000771","cargoType":"هوندا زد ار في 2025 رصاصي‎","chassis":"JHLRZ3839SX407227","weight":"2000","column1":"هوندا زد ار في 2025 رصاصي‎ - JHLRZ3839SX407227"},
  {"billNo":"114","consigneeName":"سامح مبروك علي محمد مبادره","acid":"9999101881000004056","cargoType":"هوندا سي ار في 2025 ازرق غامق","chassis":"MRJRS4887SP050937","weight":"2000","column1":"هوندا سي ار في 2025 ازرق غامق - MRJRS4887SP050937"},
  {"billNo":"115","consigneeName":"محمد إسماعيل محمود علي مبادره","acid":"9999101571000001174","cargoType":"هوندا سي ار في 2025 اسود","chassis":"MRJRS4862SP051136","weight":"2000","column1":"هوندا سي ار في 2025 اسود - MRJRS4862SP051136"},
  {"billNo":"116","consigneeName":"محمد عثمان  علام  محمد","acid":"9999102081000001058","cargoType":"هوندا سي ار في 2025 رصاصي","chassis":"MRJRS4869SP051067","weight":"2000","column1":"هوندا سي ار في 2025 رصاصي - MRJRS4869SP051067"},
  {"billNo":"117","consigneeName":"شوقي محمد العريان كامل محمد جادو مبادره","acid":"9999101981000000110","cargoType":"ميتسوبيشي اكسباندر 2025 رصاصي","chassis":"MK2L6Y1YXSN002007","weight":"2000","column1":"ميتسوبيشي اكسباندر 2025 رصاصي - MK2L6Y1YXSN002007"},
  {"billNo":"118","consigneeName":"محمد عنتر محمد محمد مبادره","acid":"9999101991000001489","cargoType":"بيجو 3008 كروس اوفر 2025 ازرق غامق","chassis":"KPTE0A1Y3TP134006","weight":"2000","column1":"بيجو 3008 كروس اوفر 2025 ازرق غامق - KPTE0A1Y3TP134006"},
  {"billNo":"120","consigneeName":"محمد التابعي احمد الحارتي مبادره","acid":"9999101941000000353","cargoType":"ميتسوبيشي اكليبس 2025 رصاصي","chassis":"JE4LSW141SZ714302","weight":"2000","column1":"ميتسوبيشي اكليبس 2025 رصاصي - JE4LSW141SZ714302"},
  {"billNo":"121","consigneeName":"احمد إبراهيم مصطفي يعقوب مبادره","acid":"9999101971000000160","cargoType":"هوندا سي ار في 2025 ازرق غامق","chassis":"MRJRS4863SP051243","weight":"2000","column1":"هوندا سي ار في 2025 ازرق غامق - MRJRS4863SP051243"},
  {"billNo":"123","consigneeName":"احمد محمد يوسف شحاته الشربيني مبادره","acid":"9999101381000002903","cargoType":"هوندا سي ار في 2025 فضي","chassis":"MRJRS4880SP051007","weight":"2000","column1":"هوندا سي ار في 2025 فضي - MRJRS4880SP051007"},
  {"billNo":"124","consigneeName":"الشيماء عبدالرحمن بحيرى  عبدالرحمن    مبادره","acid":"9999101961000000989","cargoType":"سانج يونج تيوفلي واغن 2024 فضي","chassis":"KPT20B1V4RP414377","weight":"2000","column1":"سانج يونج تيوفلي واغن 2024 فضي - KPT20B1V4RP414377"},
  {"billNo":"125","consigneeName":"اسلام فتحي سيد محمد مبادره","acid":"9999101951000002077","cargoType":"هوندا زد ار في 2025 رصاصي","chassis":"JHLRZ3837SX405802","weight":"2000","column1":"هوندا زد ار في 2025 رصاصي - JHLRZ3837SX405802"},
  {"billNo":"127","consigneeName":"عصام محمود علي حسن حديد مبادره","acid":"9999102011000001741","cargoType":"هوندا سي ار في 2025 ازرق غامق","chassis":"MRJRS488XSP051192","weight":"2000","column1":"هوندا سي ار في 2025 ازرق غامق - MRJRS488XSP051192"},
  {"billNo":"128","consigneeName":"خالد عوض حسين البلاح مالك اول","acid":"9999102031000002630","cargoType":"تويوتا كورلا 2015 فضي","chassis":"RKLBB9HE6F5070270","weight":"2000","column1":"تويوتا كورلا 2015 فضي - RKLBB9HE6F5070270"},
  {"billNo":"129","consigneeName":"هاني فرحات عبد النور بسخيرون","acid":"9999101971000001036","cargoType":"بيجو 3008 فضي","chassis":"VF3M45GYZMS001415","weight":"2000","column1":"بيجو 3008 فضي - VF3M45GYZMS001415"},
  {"billNo":"130","consigneeName":"احمد حسين حسن حسن","acid":"9999101921000000686","cargoType":"كيا سبورتاج 2025 فضي","chassis":"U5YPV81BXSL352537","weight":"2000","column1":"كيا سبورتاج 2025 فضي - U5YPV81BXSL352537"},
  {"billNo":"132","consigneeName":"حماده السيد موسى الشيخ","acid":"9999101971000000467","cargoType":"كيا سيراتيو","chassis":"KNAFK4119G5919010","weight":"2000","column1":"كيا سيراتيو - KNAFK4119G5919010"},
  {"billNo":"135","consigneeName":"طارق عبد الفتاح احمد على","acid":"9999102071000000226","cargoType":"هونداى توسان","chassis":"TMAJB81BXPJ374072","weight":"2000","column1":"هونداى توسان - TMAJB81BXPJ374072"},
  {"billNo":"139","consigneeName":"ماهر جمال عبد الناصر محمد على","acid":"9999102051000001788","cargoType":"بيجو 3008","chassis":"VR3KBDGH3TS004606","weight":"2000","column1":"بيجو 3008 - VR3KBDGH3TS004606"},
  {"billNo":"142","consigneeName":"احمد إبراهيم احمد على قطب","acid":"9999102001000002245","cargoType":"هوندا زد ار في","chassis":"JHLRZ383XPX400598","weight":"2000","column1":"هوندا زد ار في - JHLRZ383XPX400598"},
  {"billNo":"143","consigneeName":"اشرف احمد محمد احمد غانم","acid":"9999101991000001729","cargoType":"هونداي توسان 2025 رصاصي","chassis":"TMAJB81B3SJ541980","weight":"2000","column1":"هونداي توسان 2025 رصاصي - TMAJB81B3SJ541980"},
  {"billNo":"145","consigneeName":"ياسين محمود عبدالقادر علي","acid":"9999101571000001570","cargoType":"تويوتا كورولا 2016 ابيض","chassis":"RKLBB9HE3G5158937","weight":"2000","column1":"تويوتا كورولا 2016 ابيض - RKLBB9HE3G5158937"},
  {"billNo":"146","consigneeName":"صفاء إبراهيم عبدالفتاح طايل","acid":"9999100611000001484","cargoType":"كيا سبورتاج 2025 رمادي -اسود","chassis":"LJD7AA1D4S0238762","weight":"2000","column1":"كيا سبورتاج 2025 رمادي -اسود - LJD7AA1D4S0238762"},
  {"billNo":"147","consigneeName":"عبدالعليم أيوب محمود عبدالعزيز","acid":"9999101791000000089","cargoType":" شيري جيتور اكس 70","chassis":"LVUDB21B4PF002584","weight":"2000","column1":" شيري جيتور اكس 70 - LVUDB21B4PF002584"},
  {"billNo":"148","consigneeName":"وليد إسماعيل الموافى كساب","acid":"9999102011000002277","cargoType":"كيا سبورتاج","chassis":"LJD7AA1D1T0253852","weight":"2000","column1":"كيا سبورتاج - LJD7AA1D1T0253852"},
  {"billNo":"149","consigneeName":"اشرف عصام امین سالم","acid":"9999101981000003007","cargoType":"كيا کارنس","chassis":"MZBGC8159RN160613","weight":"2000","column1":"كيا کارنس - MZBGC8159RN160613"},
  {"billNo":"150","consigneeName":"رامي سمير محمد طه الدالي","acid":"9999101931000001121","cargoType":"بيجو سيدان","chassis":"VR3F3EGPURY501317","weight":"2000","column1":"بيجو سيدان - VR3F3EGPURY501317"},
  {"billNo":"151","consigneeName":"احمد محمد محمد غازی وحش","acid":"9999101901000000647","cargoType":"كيا سيراتو","chassis":"KNAFK411XE5840670","weight":"2000","column1":"كيا سيراتو - KNAFK411XE5840670"},
  {"billNo":"152","consigneeName":"محمد سليمان عبد المنصف السعدني","acid":"9999101941000001757","cargoType":"كيا سبورتاج","chassis":"LJD7AA1DXT0243627","weight":"2000","column1":"كيا سبورتاج - LJD7AA1DXT0243627"},
  {"billNo":"153","consigneeName":"اشرف محمد طلبه منصور","acid":"9999101871000000022","cargoType":"متسوبيشي لانسر","chassis":"JE3BB36A5GU728687","weight":"2000","column1":"متسوبيشي لانسر - JE3BB36A5GU728687"},
  {"billNo":"154","consigneeName":"باسم سعيد محمد مرسى","acid":"9999102021000001302","cargoType":"كيا سيلتوس","chassis":"MZBER8146NN317456","weight":"2000","column1":"كيا سيلتوس - MZBER8146NN317456"},
  {"billNo":"155","consigneeName":"ناصر عبد الفغار محمد حسن كساب","acid":"9999101941000001906","cargoType":"تويوتا افانزا","chassis":"MHKMC12FXFK000879","weight":"2000","column1":"تويوتا افانزا - MHKMC12FXFK000879"},
  {"billNo":"157","consigneeName":"محمد عبد الهادى حسن محمد","acid":"9999101641000001167","cargoType":"تويوتا افانزا","chassis":"MHKMC13F6FK011635","weight":"2000","column1":"تويوتا افانزا - MHKMC13F6FK011635"},
  {"billNo":"158","consigneeName":"بهاء خليل محمد خليل المناخلي","acid":"9999102011000000933","cargoType":"بيجو 5008","chassis":"VF3M45GYZRS002885","weight":"2000","column1":"بيجو 5008 - VF3M45GYZRS002885"},
  {"billNo":"159","consigneeName":"مصطفى احمد إسماعيل إسماعيل","acid":"9999101991000002412","cargoType":"تويوتا كورولا","chassis":"RKLBB9HE9E5006741","weight":"2000","column1":"تويوتا كورولا - RKLBB9HE9E5006741"},
  {"billNo":"160","consigneeName":"محمد حلمي سيد الدرس","acid":"9999101961000002225","cargoType":"شیری جیتور اكس 70","chassis":"LVUDB21B1MF003963","weight":"2000","column1":"شیری جیتور اكس 70 - LVUDB21B1MF003963"},
  {"billNo":"161","consigneeName":"شوقى البيومي رزق شرف الدين","acid":"9999101971000000459","cargoType":"كيا سونت","chassis":"LJD3BA1D7S0035828","weight":"2000","column1":"كيا سونت - LJD3BA1D7S0035828"},
  {"billNo":"162","consigneeName":"مدحت مختار محمود احمد الطنجه","acid":"9999102001000002229","cargoType":"جيب شروكي","chassis":"1C4RJHBG1S8798042","weight":"2000","column1":"جيب شروكي - 1C4RJHBG1S8798042"},
  {"billNo":"163","consigneeName":"اشرف على احمد عبد الحميد","acid":"9999101881000003132","cargoType":"سكودا كودياك","chassis":"TMBJC9PS2TT032250","weight":"2000","column1":"سكودا كودياك - TMBJC9PS2TT032250"},
  {"billNo":"167","consigneeName":"محمود على محمود الجمال مبادره","acid":"9999101891000001283","cargoType":"هيونداي توسان 2024 رصاصي غامق","chassis":"TMAJB81B5RJ463311","weight":"2000","column1":"هيونداي توسان 2024 رصاصي غامق - TMAJB81B5RJ463311"},
  {"billNo":"168","consigneeName":"شيرين احمد محمد عبداللطيف - مبادره","acid":"9999102001000000926","cargoType":"فولكسفاغن تيجوان 2026 رمادي","chassis":"WVGDE3CT5TW555131","weight":"2000","column1":"فولكسفاغن تيجوان 2026 رمادي - WVGDE3CT5TW555131"},
  {"billNo":"170","consigneeName":"صباح منسى جابر احمد مبادره","acid":"9999101931000001956","cargoType":"کیا سبورتاج 2026 ابيض - اسود","chassis":"LJD7AA1D6T0263275","weight":"2000","column1":"کیا سبورتاج 2026 ابيض - اسود - LJD7AA1D6T0263275"},
  {"billNo":"172","consigneeName":"عمرو عبد المطلب محمد العطلة مبادره","acid":"9999101571000002701","cargoType":"هيونداي توسان رصاصي غامق 2025","chassis":"TMAJB81B5SJ583230","weight":"2000","column1":"هيونداي توسان رصاصي غامق 2025 - TMAJB81B5SJ583230"},
  {"billNo":"173","consigneeName":"اسامه يس حامد موسى احمد مبادره","acid":"9999101781000000494","cargoType":"هوندای توسان 2024 رمادي","chassis":"TMAJB81B8RJ395893","weight":"2000","column1":"هوندای توسان 2024 رمادي - TMAJB81B8RJ395893"},
  {"billNo":"174","consigneeName":"عمرو محمد حسين محمد حسین مبادره","acid":"9999101841000002799","cargoType":"كيا سبورتاج 2020 ازرق","chassis":"U5YPG8145LL825256","weight":"2000","column1":"كيا سبورتاج 2020 ازرق - U5YPG8145LL825256"},
  {"billNo":"175","consigneeName":"محمد عبد الرؤف امين احمد مبادره","acid":"9999101941000001161","cargoType":"كيا سيراتيو 2015 فضي","chassis":"KNAFJ4117F5221867","weight":"2000","column1":"كيا سيراتيو 2015 فضي - KNAFJ4117F5221867"},
  {"billNo":"176","consigneeName":"علاء عبد الهادي عبد الهادي الشربيني عبده مبادره","acid":"9999101931000002178","cargoType":"هوندای توسان 2025 اسود","chassis":"TMAJB81BXSJ616724","weight":"2000","column1":"هوندای توسان 2025 اسود - TMAJB81BXSJ616724"},
  {"billNo":"191","consigneeName":"عاطف حامد على محمد مبادره","acid":"9999101911000003681","cargoType":"هوندای توسان رصاصی غامق 2023","chassis":"TMAJB81B8PJ286251","weight":"2000","column1":"هوندای توسان رصاصی غامق 2023 - TMAJB81B8PJ286251"},
  {"billNo":"197","consigneeName":"هاني صلاح الدين احمد عبدالله مالك اول","acid":"9999101961000000567","cargoType":"هونداي النترا 2017 رمادي","chassis":"KMHD841C4HU188810","weight":"2000","column1":"هونداي النترا 2017 رمادي - KMHD841C4HU188810"},
  {"billNo":"199","consigneeName":"نهي محمود عبد السلام هلال مبادره","acid":"9999101821000001116","cargoType":"فولكسفاغن تيجوان 2026 اسود","chassis":"WVGDE3CT7TW519070","weight":"2000","column1":"فولكسفاغن تيجوان 2026 اسود - WVGDE3CT7TW519070"},
  {"billNo":"2","consigneeName":"حسين احمد حسين عامر","acid":"9999101801000000862","cargoType":"کیا کارنس احمر 2023","chassis":"MZBGB8142PN085454","weight":"2000","column1":"کیا کارنس احمر 2023 - MZBGB8142PN085454"},
  {"billNo":"207","consigneeName":"صلاح عرفه على على سعيد","acid":"9999101791000001277","cargoType":"هيونداي توسان 2025 ابيض","chassis":"TMAJB81B0SJ541726","weight":"2000","column1":"هيونداي توسان 2025 ابيض - TMAJB81B0SJ541726"},
  {"billNo":"209","consigneeName":"محمود ممدوح مصطفى محمد","acid":"9999101331000000472","cargoType":"نیسان صني 2018 ابيض","chassis":"MDHBN7AD9JG619502","weight":"2000","column1":"نیسان صني 2018 ابيض - MDHBN7AD9JG619502"},
  {"billNo":"21","consigneeName":"محمد عبد المعطى إبراهيم سالم","acid":"9999102001000000165","cargoType":"كيا سبورتاج فضی 2020","chassis":"MDHBN7AD9JG619502","weight":"2000","column1":"كيا سبورتاج فضی 2020 - MDHBN7AD9JG619502"},
  {"billNo":"210","consigneeName":"محمد حسن احمد على حسن","acid":"9999101911000000075","cargoType":"تويوتا كورولا 2015 ابيض","chassis":"RKLBB9HE7F5126054","weight":"2000","column1":"تويوتا كورولا 2015 ابيض - RKLBB9HE7F5126054"},
  {"billNo":"213","consigneeName":"منه الله احمد عبد الرؤف على إبراهيم","acid":"9999101911000003582","cargoType":"كيا سبورتاج 2025 ازرق فاتح","chassis":"LJD7AA1D5S0233375","weight":"2000","column1":"كيا سبورتاج 2025 ازرق فاتح - LJD7AA1D5S0233375"},
  {"billNo":"215","consigneeName":"السيد ابوزيد ابوزيد السري","acid":"9999101821000000050","cargoType":"تويوتا كورولا","chassis":"RKLB20BE9M2003889","weight":"2000","column1":"تويوتا كورولا - RKLB20BE9M2003889"},
  {"billNo":"216","consigneeName":"عمرو فتحى عبد الخالق امين","acid":"9999101821000001348","cargoType":"هونداي النترا","chassis":"KMHLN41E3PU597210","weight":"2000","column1":"هونداي النترا - KMHLN41E3PU597210"},
  {"billNo":"220","consigneeName":"محمد محمد عبد الحميد خميس","acid":"99999101881000001524","cargoType":"تويوتا كورولا","chassis":"JTDBZ42E59J019889","weight":"2000","column1":"تويوتا كورولا - JTDBZ42E59J019889"},
  {"billNo":"223","consigneeName":"احمد إبراهيم الدسوقي احمد محمد","acid":"99991019410000000734","cargoType":"هوندای توسان","chassis":"TMAJB81B5RJ336848","weight":"2000","column1":"هوندای توسان - TMAJB81B5RJ336848"},
  {"billNo":"224","consigneeName":"زكريا فتحى فتحى إبراهيم محمد مدنى","acid":"999910188000004155","cargoType":"كيا سبورتاج","chassis":"U5YPG8145KL571997","weight":"2000","column1":"كيا سبورتاج - U5YPG8145KL571997"},
  {"billNo":"226","consigneeName":"عبير زناتي عبد الصادق عريان عمر","acid":"9999101781000001328","cargoType":"هوندای توسان","chassis":"TMAJB81B8RJ334947","weight":"2000","column1":"هوندای توسان - TMAJB81B8RJ334947"},
  {"billNo":"227","consigneeName":"محمد شحاته عبد النبي ابو غابه","acid":"9999101821000001017","cargoType":"كيا سول","chassis":"KNAJT8113E7637073","weight":"2000","column1":"كيا سول - KNAJT8113E7637073"},
  {"billNo":"228","consigneeName":"طارق عبد الواحد اسماعيل حسن","acid":"9999101861000001757","cargoType":"كيا سبورتاج","chassis":"KNAJT8113E7637073","weight":"2000","column1":"كيا سبورتاج - KNAJT8113E7637073"},
  {"billNo":"229","consigneeName":"محمد احمد متولي السيد الربع","acid":"9999101641000002629","cargoType":"هونداي النترا","chassis":"LJD7AA1DXT0249752","weight":"2000","column1":"هونداي النترا - LJD7AA1DXT0249752"},
  {"billNo":"230","consigneeName":"حسام هاشم احمد عبد الحافظ","acid":"9999101611000002275","cargoType":"ميتسوبيشي اكليبس كروس","chassis":"KMHDH41C9FU099697","weight":"2000","column1":"ميتسوبيشي اكليبس كروس - KMHDH41C9FU099697"},
  {"billNo":"234","consigneeName":"محمود محمد محمد بريقع","acid":"9999101241000002164","cargoType":"كيا سبورتاج","chassis":"U5YPG8142KL498278","weight":"2000","column1":"كيا سبورتاج - U5YPG8142KL498278"},
  {"billNo":"239","consigneeName":"محمود حمدى احمد مجدى رزق محمد","acid":"9999101541000000385","cargoType":"هونداي اکسنت","chassis":"KMHCT41B7EU619833","weight":"2000","column1":"هونداي اکسنت - KMHCT41B7EU619833"},
  {"billNo":"240","consigneeName":"محمد احمد حسن احمد","acid":"9999101811000000325","cargoType":"تويوتا كورولا","chassis":"RKBB9HE6K5237771","weight":"2000","column1":"تويوتا كورولا - RKBB9HE6K5237771"},
  {"billNo":"242","consigneeName":"بيومي ابراهيم رمضان شاهين","acid":"9999101931000001287","cargoType":"سايك موتور ام جي زد س","chassis":"LSJW74U37PZ044938","weight":"2000","column1":"سايك موتور ام جي زد س - LSJW74U37PZ044938"},
  {"billNo":"243","consigneeName":"محمد رضا امین نصر حمیده","acid":"9999101571000000572","cargoType":"اودي كيو 3","chassis":"WA1ZZZF3XP1062586","weight":"2000","column1":"اودي كيو 3 - WA1ZZZF3XP1062586"},
  {"billNo":"244","consigneeName":"احمد محمد حسن محمد حجاج","acid":"9999101591000000232","cargoType":"ام جي اتش اس","chassis":"LSJW94U96SG012369","weight":"2000","column1":"ام جي اتش اس - LSJW94U96SG012369"},
  {"billNo":"245","consigneeName":"عبد النبي ابراهيم على الشاعر","acid":"9999101821000001033","cargoType":"هونداي اکسنت","chassis":"KMHCT41BXFU819056","weight":"2000","column1":"هونداي اکسنت - KMHCT41BXFU819056"},
  {"billNo":"246","consigneeName":"سمير النبوي عبد العزيز عطيه","acid":"9999101871000000345","cargoType":"كيا سبورتاج","chassis":"U5YPG8147HL220274","weight":"2000","column1":"كيا سبورتاج - U5YPG8147HL220274"},
  {"billNo":"252","consigneeName":"رحاب محمد عبد السميع السيد","acid":"9999101561000000391","cargoType":"كيا بيكانتو 2016 احمر","chassis":"KNABE5118GT121797","weight":"2000","column1":"كيا بيكانتو 2016 احمر - KNABE5118GT121797"},
  {"billNo":"254","consigneeName":"فاتن حاكم بامر الله عبد اللطيف حسن","acid":"9999101891000001119","cargoType":"رينو تالیسمان 2018 ابيض","chassis":"VF1RFD003JC248447","weight":"2000","column1":"رينو تالیسمان 2018 ابيض - VF1RFD003JC248447"},
  {"billNo":"255","consigneeName":"امين علي امين موسي","acid":"9999101331000003864","cargoType":"كيا سيراتيو 2021 ابيض","chassis":"KNAF14169M5897052","weight":"2000","column1":"كيا سيراتيو 2021 ابيض - KNAF14169M5897052"},
  {"billNo":"258","consigneeName":"اسامه احمد لطفي كمال المهدي سليمان","acid":"9999101881000004353","cargoType":"كيا واجن 2017 بيج","chassis":"U5YPG8147HL093011","weight":"2000","column1":"كيا واجن 2017 بيج - U5YPG8147HL093011"},
  {"billNo":"259","consigneeName":"اسلام جمال محمود عبد الرحمن","acid":"9999101851000000172","cargoType":"كيا أي في 5 ابيض 2025","chassis":"LJD2BA1F9S0010989","weight":"2000","column1":"كيا أي في 5 ابيض 2025 - LJD2BA1F9S0010989"},
  {"billNo":"264","consigneeName":"محمد الشبراوى على سليمان","acid":"9999101561000001258","cargoType":"هونداى النترا 2015 ابيض","chassis":"KMHDH41C7FU134981","weight":"2000","column1":"هونداى النترا 2015 ابيض - KMHDH41C7FU134981"},
  {"billNo":"265","consigneeName":"هشام عبد العال عبد السلام احمد موافی","acid":"9999101881000003900","cargoType":"ميتسوبيشي اكليبس 2025 رصاصي","chassis":"JE4LSW143SZ713801","weight":"2000","column1":"ميتسوبيشي اكليبس 2025 رصاصي - JE4LSW143SZ713801"},
  {"billNo":"266","consigneeName":"احمد عطية رمضان علي كيوان","acid":"9999101971000000269","cargoType":"كيا سيلتوس 2025 فضي","chassis":"LJD5AA1D0S0174100","weight":"2000","column1":"كيا سيلتوس 2025 فضي - LJD5AA1D0S0174100"},
  {"billNo":"52","consigneeName":"ماجد محمد عبد الباسط عياد مالك اول","acid":"9999101921000001080","cargoType":"سكودا اوكتافيا  A5 ذهبى  2010","chassis":"TMBDA11Z7A2081232","weight":"2000","column1":"سكودا اوكتافيا  A5 ذهبى  2010 - TMBDA11Z7A2081232"},
  {"billNo":"54","consigneeName":"خالد سويلم عبد الحليم سويلم مالك اول","acid":"9999101741000001249","cargoType":"ام جی از اكس 5 ابيض 2024","chassis":"LSJA24U97RS029171","weight":"2000","column1":"ام جی از اكس 5 ابيض 2024 - LSJA24U97RS029171"},
  {"billNo":"63","consigneeName":"إبراهيم ربيع إبراهيم نعمان","acid":"9999101331000003617","cargoType":"هوندای توسان اسود 2019","chassis":"TMAJ28116KJ715449","weight":"2000","column1":"هوندای توسان اسود 2019 - TMAJ28116KJ715449"},
  {"billNo":"66","consigneeName":"رضا عبد المعطى عبد الله جويده مبادره","acid":"9999101851000000743","cargoType":"تويوتا رش ابيض 2020","chassis":"MHKEF8BF7LK013024","weight":"2000","column1":"تويوتا رش ابيض 2020 - MHKEF8BF7LK013024"},
  {"billNo":"69","consigneeName":"احمد شوقی محمود عبد العزيز عبده مالك اول","acid":"9999101961000000609","cargoType":"تويوتا پارس فضی 2024","chassis":"MR2BE8B39R0060705","weight":"2000","column1":"تويوتا پارس فضی 2024 - MR2BE8B39R0060705"},
  {"billNo":"79","consigneeName":"فؤاد حسن فؤاد نصر مبادره","acid":"9999101861000000445","cargoType":"ام جي 5 فضى 2026","chassis":"LSJA36U34TZ515990","weight":"2000","column1":"ام جي 5 فضى 2026 - LSJA36U34TZ515990"},
  {"billNo":"81","consigneeName":"عماد على الامام الرخ مبادره","acid":"9999101861000001948","cargoType":"هوندا سي ار في ازرق غامق 2025","chassis":"MRJRS4865SP050370","weight":"2000","column1":"هوندا سي ار في ازرق غامق 2025 - MRJRS4865SP050370"},
  {"billNo":"87","consigneeName":"جميله عدلى محمد إبراهيم","acid":"9999101681000002005","cargoType":"شيفورليه كابتيفا اسود 2023","chassis":"LZWADAGAXPB038232","weight":"2000","column1":"شيفورليه كابتيفا اسود 2023 - LZWADAGAXPB038232"},
  {"billNo":"90","consigneeName":"مروه سمير محمد احمد وهدان","acid":"9999101811000002941","cargoType":"سوزوکی بالینو ازرق 2023","chassis":"MBHWBAC17PG376835","weight":"2000","column1":"سوزوکی بالینو ازرق 2023 - MBHWBAC17PG376835"},
  {"billNo":"92","consigneeName":"علا سامي عبد حماد عبد الكريم","acid":"9999101931000001105","cargoType":"سوزوكي بالينو فضی 2024","chassis":"MBHWBAC25RG490361","weight":"2000","column1":"سوزوكي بالينو فضی 2024 - MBHWBAC25RG490361"},
  {"billNo":"93","consigneeName":"باسم فتحى الصاوى عصر مبادره","acid":"9999101981000000920","cargoType":"سايك موتور ام جی زد اس رمادي 2026","chassis":"LSJWS4U37TZ056886","weight":"2000","column1":"سايك موتور ام جی زد اس رمادي 2026 - LSJWS4U37TZ056886"},
  {"billNo":"96","consigneeName":"اسماعيل محمد احمد حسن","acid":"7065474891019910033","cargoType":"كرين","chassis":"05141","weight":"23000","column1":"كرين - 05141"},
  {"billNo":"97","consigneeName":"محمد محمود محمد شعبان","acid":"9999101421000000091","cargoType":"كيا سيراتو 2016 ازرق","chassis":"KNAFJ4112G5516795","weight":"2000","column1":"كيا سيراتو 2016 ازرق - KNAFJ4112G5516795"},
  {"billNo":"PTZT1","consigneeName":"مصطفي عثمان يوسف احمد","acid":"9999101211000000724","cargoType":"کیا سول","chassis":"KNAJP8115F7189358","weight":"2000","column1":"کیا سول - KNAJP8115F7189358"},
  {"billNo":"PTZT10","consigneeName":"حاتم احمد علي ابراهيم عديله","acid":"9999101361000000388","cargoType":"تويوتا كرولا","chassis":"RKLBB0BE3R0051150","weight":"2000","column1":"تويوتا كرولا - RKLBB0BE3R0051150"},
  {"billNo":"PTZT100","consigneeName":"اسراء محمود إسماعيل نوفل","acid":"9999101891000002455","cargoType":"كيا ريو","chassis":"KNADN4126G6536501","weight":"2000","column1":"كيا ريو - KNADN4126G6536501"},
  {"billNo":"PTZT101","consigneeName":"ايهاب ثروت محمد العباسي","acid":"9999101891000002448","cargoType":"كيا سيراتو","chassis":"KNAF24164L5864021","weight":"2000","column1":"كيا سيراتو - KNAF24164L5864021"},
  {"billNo":"PTZT102","consigneeName":"محمد احمد سالم حسنين","acid":"9999101901000000738","cargoType":"تويوتا كرولا","chassis":"RKLBB9HE8G5147710","weight":"2000","column1":"تويوتا كرولا - RKLBB9HE8G5147710"},
  {"billNo":"PTZT104","consigneeName":"رمضان على حسن على","acid":"9999101621000001169","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU755776","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU755776"},
  {"billNo":"PTZT105","consigneeName":"محمد صبرى فرج سالم","acid":"9992025090000048109","cargoType":"هيونداي كريتا","chassis":"MALC281C4KM443629","weight":"2000","column1":"هيونداي كريتا - MALC281C4KM443629"},
  {"billNo":"PTZT106","consigneeName":"صبحى عبدالغنى كامل عبدالغنى مرزه","acid":"9999101851000000214","cargoType":"ميتسوبيشي لانسر","chassis":"JE3AB36A7HU707496","weight":"2000","column1":"ميتسوبيشي لانسر - JE3AB36A7HU707496"},
  {"billNo":"PTZT109","consigneeName":"أسماء منير عبدالسميع محمد","acid":"9999101941000000155","cargoType":"كيا سبورتاج","chassis":"U5YPG8141LL796984","weight":"2000","column1":"كيا سبورتاج - U5YPG8141LL796984"},
  {"billNo":"PTZT11","consigneeName":"محمد السعيد فتحي محمد","acid":"9999101351000001940","cargoType":"كيا سيراتو","chassis":"KNAFZ4113E5199129","weight":"2000","column1":"كيا سيراتو - KNAFZ4113E5199129"},
  {"billNo":"PTZT110","consigneeName":"سعاد احمد محمد صالح","acid":"9999101641000000193","cargoType":"هيونداى توسان","chassis":"TMAJB81B9RJ387060","weight":"2000","column1":"هيونداى توسان - TMAJB81B9RJ387060"},
  {"billNo":"PTZT111","consigneeName":"احمد عبداللطيف محمد إسماعيل","acid":"9999101241000000762","cargoType":"متسوبيشي لانسر","chassis":"JMYSRCY2A9U708409","weight":"2000","column1":"متسوبيشي لانسر - JMYSRCY2A9U708409"},
  {"billNo":"PTZT112","consigneeName":"محمد حسين صادق محمد","acid":"9999101941000002003","cargoType":"كيا ريو","chassis":"KNADM4123F6407956","weight":"2000","column1":"كيا ريو - KNADM4123F6407956"},
  {"billNo":"PTZT115","consigneeName":"رامي محمد محمد ربيع عبدالله","acid":"9999101921000000272","cargoType":"متسوبيشي لانسر","chassis":"JE3BB36A7FU715485","weight":"2000","column1":"متسوبيشي لانسر - JE3BB36A7FU715485"},
  {"billNo":"PTZT116","consigneeName":"سعيد محمد عبدلله محمد","acid":"9999101881000002266","cargoType":"متسوبيشي لانسر","chassis":"JE3BB36A2GU750291","weight":"2000","column1":"متسوبيشي لانسر - JE3BB36A2GU750291"},
  {"billNo":"PTZT12","consigneeName":"محمد عمر ابوالحسن عبدلله","acid":"9999100971000000047","cargoType":"ميتسوبيشي اكليبس","chassis":"JE4LSW147RZ702293","weight":"2000","column1":"ميتسوبيشي اكليبس - JE4LSW147RZ702293"},
  {"billNo":"PTZT125","consigneeName":"احمد رجب عبدالعال جمعة","acid":"0","cargoType":"كاديلاك إسكاليد","chassis":"1GYS4GKL0PR434920","weight":"2000","column1":"كاديلاك إسكاليد - 1GYS4GKL0PR434920"},
  {"billNo":"PTZT126","consigneeName":"يوسف احمد محمد السعيد عيسى","acid":"0","cargoType":"بورش","chassis":"WP1AB2AY8KDA60357","weight":"2000","column1":"بورش - WP1AB2AY8KDA60357"},
  {"billNo":"PTZT127","consigneeName":"نجوان محمود احمد نورالدين","acid":"9999101741000002189","cargoType":"تويوتا كرولا","chassis":"RKLBB0BE6P0049342","weight":"2000","column1":"تويوتا كرولا - RKLBB0BE6P0049342"},
  {"billNo":"PTZT128","consigneeName":"هاني ابراهيم محمد اسماعيل","acid":"9999101871000003406","cargoType":"تويوتا كرولا","chassis":"RKLBBOBE3N0040031","weight":"2000","column1":"تويوتا كرولا - RKLBBOBE3N0040031"},
  {"billNo":"PTZT129","consigneeName":"طارق مصطفى عبدالجواد ابراهيم","acid":"9999101801000002884","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU751066","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU751066"},
  {"billNo":"PTZT130","consigneeName":"محمد فتحي ابراهيم علي","acid":"9999101401000002990","cargoType":"كيا سيلتوس","chassis":"MZBER8148LN085746","weight":"2000","column1":"كيا سيلتوس - MZBER8148LN085746"},
  {"billNo":"PTZT132","consigneeName":"ايمن صديق رزق جوهر طرية","acid":"9999101301000002240","cargoType":"تويوتا كرولا","chassis":"RKLBB9HE0E5006191","weight":"2000","column1":"تويوتا كرولا - RKLBB9HE0E5006191"},
  {"billNo":"PTZT141","consigneeName":"ممدوح محمد امام علي – تربتيك","acid":"0","cargoType":"C مرسيدس 200","chassis":"W1KWJ7GBXLF937100","weight":"2000","column1":"C مرسيدس 200 - W1KWJ7GBXLF937100"},
  {"billNo":"PTZT142","consigneeName":"احمد يسري يسن محمود","acid":"9999102021000000148","cargoType":"Aاودي 3","chassis":"WAUAYJFF2F1055838","weight":"2000","column1":"Aاودي 3 - WAUAYJFF2F1055838"},
  {"billNo":"PTZT143","consigneeName":"محمد عبدربه حسين إسماعيل","acid":"9999101631000000459","cargoType":"فولكس واجن جولف","chassis":"WVWZZZAUZEW388204","weight":"2000","column1":"فولكس واجن جولف - WVWZZZAUZEW388204"},
  {"billNo":"PTZT144","consigneeName":"يحيى محمد ابو الفتوح ممد علي","acid":"9992025120000040010","cargoType":"فولكس واجن جولف","chassis":"WVWCF21K6CW020360","weight":"2000","column1":"فولكس واجن جولف - WVWCF21K6CW020360"},
  {"billNo":"PTZT145","consigneeName":"حسن خاطر احمد السيد خاطر","acid":"9999100111000000271","cargoType":"Aاودي 3","chassis":"WAUAYJFF0F1035264","weight":"2000","column1":"Aاودي 3 - WAUAYJFF0F1035264"},
  {"billNo":"PTZT146","consigneeName":"عبدالفتاح عبدالله فتحي الشحات","acid":"9992025110000016334","cargoType":"ديهاتسو SIRION","chassis":"JD1GM303XG1008819","weight":"2000","column1":"ديهاتسو SIRION - JD1GM303XG1008819"},
  {"billNo":"PTZT147","consigneeName":"سامح محمد عطيه عيد","acid":"9999101371000002722","cargoType":"مرسيدس C180","chassis":"WDD2050401R084368","weight":"2000","column1":"مرسيدس C180 - WDD2050401R084368"},
  {"billNo":"PTZT148","consigneeName":"خالد عادل عبدالوهاب رزق علي – تربتيك","acid":"0","cargoType":"TT اودي","chassis":"TRUAFBFV5G1000524","weight":"2000","column1":"TT اودي - TRUAFBFV5G1000524"},
  {"billNo":"PTZT149","consigneeName":"رضا محمد ابراهيم عطية","acid":"9999101231000000862","cargoType":"كيا ريو","chassis":"KNADN5120F6707456","weight":"2000","column1":"كيا ريو - KNADN5120F6707456"},
  {"billNo":"PTZT150","consigneeName":"رحاب عماد محمود عبدالله","acid":"9999102071000000879","cargoType":"BMW 316","chassis":"WBA3A1101FJ616739","weight":"2000","column1":"BMW 316 - WBA3A1101FJ616739"},
  {"billNo":"PTZT151","consigneeName":"احمد فوزى عبد المجيد عبد الفتاح","acid":"9992025110000045218","cargoType":"كيا سيراتو","chassis":"KNAFK4119J5988710","weight":"2000","column1":"كيا سيراتو - KNAFK4119J5988710"},
  {"billNo":"PTZT152","consigneeName":"السيد علي منصور دعبس","acid":"9999101811000000077","cargoType":"ID- فولكس واجن 4","chassis":"LFVVB9E60M5025080","weight":"2000","column1":"ID- فولكس واجن 4 - LFVVB9E60M5025080"},
  {"billNo":"PTZT153","consigneeName":"همت ربيع عبدالفتاح احمد حسين","acid":"9999101851000000982","cargoType":"تويوتا برادو","chassis":"JTEBU3FJ1PK244460","weight":"2000","column1":"تويوتا برادو - JTEBU3FJ1PK244460"},
  {"billNo":"PTZT154","consigneeName":"غادة الامير اسماعيل شهاب الفلكي","acid":"9999100951000000395","cargoType":"فولكس واجن تيجوان","chassis":"WVGBE3CT1TW505561","weight":"2000","column1":"فولكس واجن تيجوان - WVGBE3CT1TW505561"},
  {"billNo":"PTZT155","consigneeName":"خالد صابر سيد سيد","acid":"9999101401000002966","cargoType":"تويوتا كرولا","chassis":"JTDBZ42E49J015610","weight":"2000","column1":"تويوتا كرولا - JTDBZ42E49J015610"},
  {"billNo":"PTZT156","consigneeName":"حسام الدين حسين ابراهيم موسي","acid":"9999101821000000597","cargoType":"508 بيجو","chassis":"VR3F3EGZ6PY502167","weight":"2000","column1":"508 بيجو - VR3F3EGZ6PY502167"},
  {"billNo":"PTZT157","consigneeName":"وافي حسين محمد إسماعيل","acid":"9999102011000002434","cargoType":"هيونداي النترا","chassis":"KMHDG41C2CU264231","weight":"2000","column1":"هيونداي النترا - KMHDG41C2CU264231"},
  {"billNo":"PTZT158","consigneeName":"احمد صلاح الدين محمد خضر","acid":"9999101911000003525","cargoType":"كيا سيراتو","chassis":"KNAFK4116J5992410","weight":"2000","column1":"كيا سيراتو - KNAFK4116J5992410"},
  {"billNo":"PTZT16","consigneeName":"زكريا زكى موسي غبريال","acid":"9999101381000001145","cargoType":"تويوتا افانزا","chassis":"MHKMF53F9GK008535","weight":"2000","column1":"تويوتا افانزا - MHKMF53F9GK008535"},
  {"billNo":"PTZT161","consigneeName":"احمد نور الدين","acid":"9999101751000000513","cargoType":"روكس 01","chassis":"HJ4ABBHK2RN034006","weight":"2000","column1":"روكس 01 - HJ4ABBHK2RN034006"},
  {"billNo":"PTZT162","consigneeName":"ايمان عبدالعظيم رشيد عبدالصمد","acid":"9999101871000003364","cargoType":"هيونداي كريتا","chassis":"MALC381C3GM060673","weight":"2000","column1":"هيونداي كريتا - MALC381C3GM060673"},
  {"billNo":"PTZT165","consigneeName":"مصطفى عبدالرازق الليثى قطب","acid":"9999101391000001805","cargoType":"شيري تيجو 4","chassis":"LVVDB21B7SC002472","weight":"2000","column1":"شيري تيجو 4 - LVVDB21B7SC002472"},
  {"billNo":"PTZT166","consigneeName":"على ابراهيم احمد على","acid":"9999101351000001718","cargoType":"هيونداي كريتا","chassis":"MF3PB81275J134780","weight":"2000","column1":"هيونداي كريتا - MF3PB81275J134780"},
  {"billNo":"PTZT167","consigneeName":"عمر احمد حمدي حبيب","acid":"9999102001000001296","cargoType":"كيا سبورتاج","chassis":"U5YPV81B0PL126482","weight":"2000","column1":"كيا سبورتاج - U5YPV81B0PL126482"},
  {"billNo":"PTZT168","consigneeName":"صلاح محمد علي الحوشي","acid":"9999101331000004060","cargoType":"كيا سيراتو","chassis":"KNAF24162L5892478","weight":"2000","column1":"كيا سيراتو - KNAF24162L5892478"},
  {"billNo":"PTZT169","consigneeName":"ابراهيم عبد الله متولى احمد","acid":"9999102051000002497","cargoType":"3008 بيجو","chassis":"VF3M45GY9KS021506","weight":"2000","column1":"3008 بيجو - VF3M45GY9KS021506"},
  {"billNo":"PTZT17","consigneeName":"محمود رمضان حلمي محمد","acid":"9999101321000000523","cargoType":"تويوتا كرولا","chassis":"RKLBB9HE0K5238267","weight":"2000","column1":"تويوتا كرولا - RKLBB9HE0K5238267"},
  {"billNo":"PTZT170","consigneeName":"فتحى صابر السيد احمد","acid":"9999102051000000764","cargoType":"كيا سيراتو","chassis":"KNAFX4119F5314131","weight":"2000","column1":"كيا سيراتو - KNAFX4119F5314131"},
  {"billNo":"PTZT174","consigneeName":"حاتم ابراهيم احمد نور الدين","acid":"9999101891000002729","cargoType":"كيا سيراتو","chassis":"KNAFJ4118H5951354","weight":"2000","column1":"كيا سيراتو - KNAFJ4118H5951354"},
  {"billNo":"PTZT176","consigneeName":"شرق الدلتا لخدمات الشحن البرى","acid":"2048912051000510014","cargoType":"نيسان باترول","chassis":"JN8BY3NYXS9004867 - JN8BY3NY9S9005721","weight":"4000","column1":"نيسان باترول - JN8BY3NYXS9004867 - JN8BY3NY9S9005721"},
  {"billNo":"PTZT177","consigneeName":"صابر المرسى صابر البندارى","acid":"9999101181000000646","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AFU721638","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AFU721638"},
  {"billNo":"PTZT179","consigneeName":"اشرف عبد العاطى صادق عبدالمحسن","acid":"9999101791000000014","cargoType":"MG RX5","chassis":"LSJA24U94SS016299","weight":"2000","column1":"MG RX5 - LSJA24U94SS016299"},
  {"billNo":"PTZT18","consigneeName":"احمد رشاد محمود فرج","acid":"9999101321000003477","cargoType":"تويوتا كرولا","chassis":"JTDBZ42E98J011759","weight":"2000","column1":"تويوتا كرولا - JTDBZ42E98J011759"},
  {"billNo":"PTZT180","consigneeName":"احمد ملاحظ احمد عبدالسيد","acid":"9999101941000001955","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU702728","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU702728"},
  {"billNo":"PTZT181","consigneeName":"سعيد عبدالعظيم معوض محمد عيد","acid":"9999101871000003430","cargoType":"تويوتا راش","chassis":"MHKEF8BF9PK044104","weight":"2000","column1":"تويوتا راش - MHKEF8BF9PK044104"},
  {"billNo":"PTZT182","consigneeName":"احمد زكريا عبدالمنعم محمد جردوح","acid":"9999101941000000148","cargoType":"سكودا كودياك","chassis":"TMBJC6NS7R8038882","weight":"2000","column1":"سكودا كودياك - TMBJC6NS7R8038882"},
  {"billNo":"PTZT183","consigneeName":"تامر جورج لبيب عطا لله","acid":"9999102031000000295","cargoType":"Q3 اودي","chassis":"WA1BYAFS7GR000254","weight":"2000","column1":"Q3 اودي - WA1BYAFS7GR000254"},
  {"billNo":"PTZT184","consigneeName":"خالد محمد محمد احمد جاد المولى","acid":"9999101991000002370","cargoType":"كيا سيراتو","chassis":"KNAFJ4112G5453665","weight":"2000","column1":"كيا سيراتو - KNAFJ4112G5453665"},
  {"billNo":"PTZT185","consigneeName":"ايمن اسماعيل عبده عثمان","acid":"9999101731000002305","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU752410","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU752410"},
  {"billNo":"PTZT186","consigneeName":"نجيب عبداللطيف رزق محمد","acid":"9999101891000000897","cargoType":"تويوتا افنزا","chassis":"MHKMF53F4GK006014","weight":"2000","column1":"تويوتا افنزا - MHKMF53F4GK006014"},
  {"billNo":"PTZT187","consigneeName":"انجى احمد محمد النقيب","acid":"9999101911000002436","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU743043","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU743043"},
  {"billNo":"PTZT188","consigneeName":"نبيل فوزى كمال حسن عبدالعال","acid":"9999101631000000160","cargoType":"هوندا سيفك","chassis":"NLAFC5639LW001106","weight":"2000","column1":"هوندا سيفك - NLAFC5639LW001106"},
  {"billNo":"PTZT189","consigneeName":"حاتم محمد المتولي محمد حبيب","acid":"9999102021000000072","cargoType":"شيفرولية كابتيفيا","chassis":"LZWADAGA3RB002496","weight":"2000","column1":"شيفرولية كابتيفيا - LZWADAGA3RB002496"},
  {"billNo":"PTZT19","consigneeName":"شيماء محيي محمد سليمان","acid":"9999101131000000153","cargoType":"Mercedes C 180","chassis":"WDD2040311A909041","weight":"2000","column1":"Mercedes C 180 - WDD2040311A909041"},
  {"billNo":"PTZT190","consigneeName":"احمد فوزى محمد عزت عبدلله","acid":"9999101891000000251","cargoType":"شيفرولية كابتيفيا","chassis":"LZWADAGAXPB007661","weight":"2000","column1":"شيفرولية كابتيفيا - LZWADAGAXPB007661"},
  {"billNo":"PTZT191","consigneeName":"سعد عبدالقادر السيد علي","acid":"9999101891000001523","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1ADU712748","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1ADU712748"},
  {"billNo":"PTZT192","consigneeName":"محمد غريب السيد محمد","acid":"9999101891000002398","cargoType":"كيا سبورتاج","chassis":"U5YPH8149KL613486","weight":"2000","column1":"كيا سبورتاج - U5YPH8149KL613486"},
  {"billNo":"PTZT193","consigneeName":"عماد احمد محمد ابراهيم حسن عامر","acid":"9999101871000001087","cargoType":"فولكس واجن تيجوان","chassis":"WVGAE2AXXRW504056","weight":"2000","column1":"فولكس واجن تيجوان - WVGAE2AXXRW504056"},
  {"billNo":"PTZT194","consigneeName":"عبدالرحيم المحمدي جاد عيد","acid":"9999101861000002714","cargoType":"تويوتا كرولا","chassis":"RKLBB9HE7F5104989","weight":"2000","column1":"تويوتا كرولا - RKLBB9HE7F5104989"},
  {"billNo":"PTZT196","consigneeName":"محمد ابراهيم حسن السيد","acid":"9999101901000000605","cargoType":"ميتسوبيشى لانسر","chassis":"JMYSRCY1AGU757689","weight":"2000","column1":"ميتسوبيشى لانسر - JMYSRCY1AGU757689"},
  {"billNo":"PTZT197","consigneeName":"على الشحات عبد الحليم جمعه","acid":"9999101901000000696","cargoType":"كيا ريو","chassis":"KNADN5129G6657495","weight":"2000","column1":"كيا ريو - KNADN5129G6657495"},
  {"billNo":"PTZT198","consigneeName":"سامح محمد عبد العظيم احمد","acid":"9999101901000000613","cargoType":"كيا سبورتاج","chassis":"U5YPG8146KL649574","weight":"2000","column1":"كيا سبورتاج - U5YPG8146KL649574"},
  {"billNo":"PTZT2","consigneeName":"محمد عبد العال السيد عبد العال","acid":"9999101221000000988","cargoType":"كيا سيراتو","chassis":"KNAFU4117D5701265","weight":"2000","column1":"كيا سيراتو - KNAFU4117D5701265"},
  {"billNo":"PTZT20","consigneeName":"محمد السيد محمود احمد","acid":"9999101481000000160","cargoType":"تويوتا كورولا","chassis":"RKLBB0BE3M0038231","weight":"2000","column1":"تويوتا كورولا - RKLBB0BE3M0038231"},
  {"billNo":"PTZT202","consigneeName":"ربيع محمود محمد عبد العال","acid":"9999101901000000597","cargoType":"كيا سيراتو","chassis":"KNAF54160N5151630","weight":"2000","column1":"كيا سيراتو - KNAF54160N5151630"},
  {"billNo":"PTZT204","consigneeName":"محمد عبد الحميد ابراهيم محمد","acid":"9999101451000000916","cargoType":"ميتسوبيشي لانسر","chassis":"JE3AB36A3HU715174","weight":"2000","column1":"ميتسوبيشي لانسر - JE3AB36A3HU715174"},
  {"billNo":"PTZT205","consigneeName":"محمد زكى زكى محمد عبد الرازق","acid":"9999101891000002679","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AEU723570","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AEU723570"},
  {"billNo":"PTZT207","consigneeName":"حازم ممدوح السيد عطا لله","acid":"9999101911000000125","cargoType":"شيفوليه كابتيفا","chassis":"LZWADAGA5NB043898","weight":"2000","column1":"شيفوليه كابتيفا - LZWADAGA5NB043898"},
  {"billNo":"PTZT208","consigneeName":"عماد السيد محمد محمود المرشدي","acid":"9999101941000001104","cargoType":"تويوتا راش","chassis":"MHKEF8BF6KK003020","weight":"2000","column1":"تويوتا راش - MHKEF8BF6KK003020"},
  {"billNo":"PTZT209","consigneeName":"علاء المتولي الحنفي الشيوى","acid":"9999101841000001551","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCS3ADU704598","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCS3ADU704598"},
  {"billNo":"PTZT21","consigneeName":"محمد صلاح الدين محمود إبراهيم","acid":"9999101371000002607","cargoType":"فولكس تيجوان","chassis":"WVGAE2AXXJW947876","weight":"2000","column1":"فولكس تيجوان - WVGAE2AXXJW947876"},
  {"billNo":"PTZT210","consigneeName":"طه محمد محمد شوشه","acid":"9999101841000000504","cargoType":"بيجو","chassis":"WVGAE2AXXJW947876","weight":"2000","column1":"بيجو - WVGAE2AXXJW947876"},
  {"billNo":"PTZT211","consigneeName":"فاضل عبدالعزيز عبدالسلام العربي","acid":"9999101891000002463","cargoType":"هيونداي النترا","chassis":"KMHD741C0LU977208","weight":"2000","column1":"هيونداي النترا - KMHD741C0LU977208"},
  {"billNo":"PTZT212","consigneeName":"اسماعيل ماهر مصطفى إسماعيل","acid":"9999101921000001247","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU750388","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU750388"},
  {"billNo":"PTZT213","consigneeName":"أحمد عثمان السعيد أحمد","acid":"9999101941000001195","cargoType":"جي إم سي تيرين","chassis":"3GKALTEG2RL189144","weight":"2000","column1":"جي إم سي تيرين - 3GKALTEG2RL189144"},
  {"billNo":"PTZT214","consigneeName":"جمال واصف فتحي رزق عبدالله","acid":"9999102011000001410","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU752537","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU752537"},
  {"billNo":"PTZT215","consigneeName":"عبدالرحمن صابر عبدالعال عبدالباقي","acid":"9999102071000002016","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU755719","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU755719"},
  {"billNo":"PTZT217","consigneeName":"احمد عبده محمد احمد","acid":"9999101911000002519","cargoType":"هيونداي النترا","chassis":"KMHDG41C6DU707109","weight":"2000","column1":"هيونداي النترا - KMHDG41C6DU707109"},
  {"billNo":"PTZT219","consigneeName":"عمرو رضا إبراهيم احمد","acid":"9999101871000001251","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AFU735762","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AFU735762"},
  {"billNo":"PTZT220","consigneeName":"عبدالعزيز السيد عبدالعزيز شعبان","acid":"9999102061000000912","cargoType":"كيا سيراتو","chassis":"KNAFX4116E5082313","weight":"2000","column1":"كيا سيراتو - KNAFX4116E5082313"},
  {"billNo":"PTZT221","consigneeName":"انور عبدالفتاح محمد منصور","acid":"9999101911000000984","cargoType":"كيا ريو","chassis":"KNADM5123E6331868","weight":"2000","column1":"كيا ريو - KNADM5123E6331868"},
  {"billNo":"PTZT222","consigneeName":"نادر شوقي إبراهيم السيد عويس","acid":"9999101961000000112","cargoType":"كيا بيكانتو","chassis":"KNABX5125ET704649","weight":"2000","column1":"كيا بيكانتو - KNABX5125ET704649"},
  {"billNo":"PTZT226","consigneeName":"خالد جلال احمد المكاوى عجيزه","acid":"9992025040000053658","cargoType":"كيا بيكانتو","chassis":"KNABX5129FT976171","weight":"2000","column1":"كيا بيكانتو - KNABX5129FT976171"},
  {"billNo":"PTZT228","consigneeName":"مؤمن علاء الدين عبيد جاد الكريم","acid":"9999101861000002334","cargoType":"ميتسوبيشي لانسر","chassis":"JE3AB36A4HU716186","weight":"2000","column1":"ميتسوبيشي لانسر - JE3AB36A4HU716186"},
  {"billNo":"PTZT23","consigneeName":"احمد محمد عبدالفتاح محمد","acid":"9999101421000001107","cargoType":"تويوتا . جى . اكس","chassis":"JTMHU09J0A5038139","weight":"2000","column1":"تويوتا . جى . اكس - JTMHU09J0A5038139"},
  {"billNo":"PTZT230","consigneeName":"هويدا مصطفي امام محمد عبدالله","acid":"0","cargoType":"MERCEDES E350","chassis":"W1KZF8DB7LA760172","weight":"2000","column1":"MERCEDES E350 - W1KZF8DB7LA760172"},
  {"billNo":"PTZT231","consigneeName":"احمد السيد احمد احمد ندا","acid":"9999101981000002611","cargoType":"كيا بيكانتو","chassis":"KNAB25125LT629947","weight":"2000","column1":"كيا بيكانتو - KNAB25125LT629947"},
  {"billNo":"PTZT232","consigneeName":"احمد محمد إبراهيم محمد","acid":"9999101981000002637","cargoType":"كيا بيكانتو","chassis":"KNAB25128LT575026","weight":"2000","column1":"كيا بيكانتو - KNAB25128LT575026"},
  {"billNo":"PTZT233","consigneeName":"محمد حسن الشربينى حسن","acid":"9999101981000002603","cargoType":"كيا بيكانتو","chassis":"KNABX5126GT176672","weight":"2000","column1":"كيا بيكانتو - KNABX5126GT176672"},
  {"billNo":"PTZT234","consigneeName":"احمد عبدالواحد عبدالعاطي محمد","acid":"9999101911000002485","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AEU723356","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AEU723356"},
  {"billNo":"PTZT235","consigneeName":"حازم عصمت محمد صلاح الدين","acid":"9999101031000001567","cargoType":"سكودا كودياك","chassis":"TMBJC4NS5P8534040","weight":"2000","column1":"سكودا كودياك - TMBJC4NS5P8534040"},
  {"billNo":"PTZT236","consigneeName":"طارق منصور السيد زياده","acid":"9999101941000001971","cargoType":"تويوتا كورولا","chassis":"JTDBZ42EX89028779","weight":"2000","column1":"تويوتا كورولا - JTDBZ42EX89028779"},
  {"billNo":"PTZT238","consigneeName":"محمد محمود جمعه محمد","acid":"9999101981000002082","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU749213","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU749213"},
  {"billNo":"PTZT239","consigneeName":"إبراهيم حسن علي محمد","acid":"9999102011000001634","cargoType":"كيا سول","chassis":"KNAJP8116F7778418","weight":"2000","column1":"كيا سول - KNAJP8116F7778418"},
  {"billNo":"PTZT24","consigneeName":"السيد محمد السيد عبدالحافظ","acid":"9999100661000000556","cargoType":"كيا سيرتوا","chassis":"KNAFK4113F5344868","weight":"2000","column1":"كيا سيرتوا - KNAFK4113F5344868"},
  {"billNo":"PTZT240","consigneeName":"محمد سلطان عبدالمطلب الدكر","acid":"9999102011000002566","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AEU717862","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AEU717862"},
  {"billNo":"PTZT241","consigneeName":"سعيد جيوشي زكى عيسي","acid":"9999101981000002090","cargoType":"هيونداي النترا","chassis":"KMHDG41C5DU610564","weight":"2000","column1":"هيونداي النترا - KMHDG41C5DU610564"},
  {"billNo":"PTZT243","consigneeName":"اسلام سامي خليل حسن","acid":"0","cargoType":"MERCEDES C400","chassis":"55SWF6GB3FU062035","weight":"2000","column1":"MERCEDES C400 - 55SWF6GB3FU062035"},
  {"billNo":"PTZT244","consigneeName":"احمد عبدالحكيم عبدالعظيم الخولي","acid":"9999101871000001301","cargoType":"تويوتا كرولا","chassis":"RKLBB9HE3J5225138","weight":"2000","column1":"تويوتا كرولا - RKLBB9HE3J5225138"},
  {"billNo":"PTZT245","consigneeName":"هدي عبدالفتاح علي خليل","acid":"9999102031000000253","cargoType":"فورد / ايكو سبورت","chassis":"MAJTK1BA1FAA56964","weight":"2000","column1":"فورد / ايكو سبورت - MAJTK1BA1FAA56964"},
  {"billNo":"PTZT246","consigneeName":"عبدالروف سامي عوض عامر","acid":"9999101941000000445","cargoType":"كيا سبورتاج","chassis":"U5YPG8149HL197788","weight":"2000","column1":"كيا سبورتاج - U5YPG8149HL197788"},
  {"billNo":"PTZT247","consigneeName":"امينة عاطف محمود علي","acid":"9999102001000002021","cargoType":"كيا سبورتاج","chassis":"U5YPX81B2PL144833","weight":"2000","column1":"كيا سبورتاج - U5YPX81B2PL144833"},
  {"billNo":"PTZT248","consigneeName":"حازم محمد إبراهيم عثمان","acid":"999919101981000001431","cargoType":"كيا سورينتو","chassis":"KNARH81GDPA147508","weight":"2000","column1":"كيا سورينتو - KNARH81GDPA147508"},
  {"billNo":"PTZT250","consigneeName":"جمال محمود محمد أحمد حسن","acid":"9999101881000004338","cargoType":"هيونداي توسان","chassis":"TMAJB81B2NJ142000","weight":"2000","column1":"هيونداي توسان - TMAJB81B2NJ142000"},
  {"billNo":"PTZT251","consigneeName":"عادل حسن إبراهيم الإمام","acid":"9999101571000001703","cargoType":"مرسيدس C180","chassis":"WDDWF4AB9ER912111","weight":"2000","column1":"مرسيدس C180 - WDDWF4AB9ER912111"},
  {"billNo":"PTZT252","consigneeName":"إبراهيم جمال إبراهيم فهمي","acid":"9999101921000003300","cargoType":"مرسيدس C180","chassis":"WDDWF4ABXGR025165","weight":"2000","column1":"مرسيدس C180 - WDDWF4ABXGR025165"},
  {"billNo":"PTZT253","consigneeName":"كرم اشرف احمد احمد","acid":"9999101911000000976","cargoType":"متسوبيشي لانسر","chassis":"JE3AB36A8HU710617","weight":"2000","column1":"متسوبيشي لانسر - JE3AB36A8HU710617"},
  {"billNo":"PTZT254","consigneeName":"محمد ابراهيم علي عماره","acid":"9999101481000001192","cargoType":"متسوبيشي لانسر","chassis":"JMYSRCY1AFU700594","weight":"2000","column1":"متسوبيشي لانسر - JMYSRCY1AFU700594"},
  {"billNo":"PTZT255","consigneeName":"رمضان رياض امام متولي عبيد","acid":"9999101991000000531","cargoType":"تويوتا كورولا","chassis":"RKLBB9HE8G5149988","weight":"2000","column1":"تويوتا كورولا - RKLBB9HE8G5149988"},
  {"billNo":"PTZT256","consigneeName":"محمود عبدالرسول عبدالحميد شحاته","acid":"9999101991000000341","cargoType":"سكودا اوكتافيا","chassis":"TMBAN4NE1H0141558","weight":"2000","column1":"سكودا اوكتافيا - TMBAN4NE1H0141558"},
  {"billNo":"PTZT257","consigneeName":"هاني موريس عزيز بدروس","acid":"9999101631000000202","cargoType":"هايونداي توسان","chassis":"TMAJB81BGSJ589924","weight":"2000","column1":"هايونداي توسان - TMAJB81BGSJ589924"},
  {"billNo":"PTZT258","consigneeName":"محمد قدري لطفي احمد زايد","acid":"9999101671000000240","cargoType":"فولكس تجوان","chassis":"WVGBE3CT2SW503090","weight":"2000","column1":"فولكس تجوان - WVGBE3CT2SW503090"},
  {"billNo":"PTZT259","consigneeName":"فاطمه محمد نجيب عبيد عبد الكريم","acid":"9999101991000002792","cargoType":"متسوبيشي","chassis":"MK2L9W142TN000763","weight":"2000","column1":"متسوبيشي - MK2L9W142TN000763"},
  {"billNo":"PTZT260","consigneeName":"عبد الرحمن محمد محمد محمود العراقي","acid":"9999101921000001403","cargoType":"فولكس واجن جولف","chassis":"WVWDH2AU5FW178838","weight":"2000","column1":"فولكس واجن جولف - WVWDH2AU5FW178838"},
  {"billNo":"PTZT261","consigneeName":"شحاته إسماعيل العشماوي محمد","acid":"9999101891000002851","cargoType":"تويوتا كرولا","chassis":"RKLBB0BE6L0003746","weight":"2000","column1":"تويوتا كرولا - RKLBB0BE6L0003746"},
  {"billNo":"PTZT262","consigneeName":"عبد العزيز محمد عبد لله محمد","acid":"9999101561000000034","cargoType":"هيونداي كريتا","chassis":"MALC281C9KM499243","weight":"2000","column1":"هيونداي كريتا - MALC281C9KM499243"},
  {"billNo":"PTZT263","consigneeName":"محمود محمد حسن دسوقي","acid":"9999101921000001395","cargoType":"نيسان سنترا","chassis":"MNTBB7A9XE6008578","weight":"2000","column1":"نيسان سنترا - MNTBB7A9XE6008578"},
  {"billNo":"PTZT264","consigneeName":"ايمن عبد الرازق محمد علي","acid":"9999101821000000076","cargoType":"بيجو","chassis":"VR3F3EGP7RY500462","weight":"2000","column1":"بيجو - VR3F3EGP7RY500462"},
  {"billNo":"PTZT265","consigneeName":"هاني محمد عبد الحليم سليم","acid":"9999101891000002752","cargoType":"ميتسوبيشي لانسر","chassis":"JE3BB36A3FU700661","weight":"2000","column1":"ميتسوبيشي لانسر - JE3BB36A3FU700661"},
  {"billNo":"PTZT266","consigneeName":"محمد رمزي سلامه حسين","acid":"9999101921000001288","cargoType":"سكودا اوكتافيا","chassis":"TMBAN2NE2G0194143","weight":"2000","column1":"سكودا اوكتافيا - TMBAN2NE2G0194143"},
  {"billNo":"PTZT267","consigneeName":"عبدلله إبراهيم ابو الغيط ابو الغيط","acid":"9999102011000001402","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1ADU711397","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1ADU711397"},
  {"billNo":"PTZT268","consigneeName":"عبدلله عبدالقادر عبدلله حسن خليفه","acid":"9999102021000002235","cargoType":"كيا سيراتو","chassis":"KNAFZ4111F5335095","weight":"2000","column1":"كيا سيراتو - KNAFZ4111F5335095"},
  {"billNo":"PTZT269","consigneeName":"السيد سمير عبدالعليم عبدالعليم حرب","acid":"9999102011000001501","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1ADU707427","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1ADU707427"},
  {"billNo":"PTZT270","consigneeName":"عمرو عطيه عيسي عطيه","acid":"9999101981000002108","cargoType":"كيا ريو","chassis":"KNADN5126F6963908","weight":"2000","column1":"كيا ريو - KNADN5126F6963908"},
  {"billNo":"PTZT271","consigneeName":"احمد مسعود مصطفي احمد مسعود","acid":"9999102011000001626","cargoType":"كيا سبورتاج","chassis":"U5YPG8149KL547038","weight":"2000","column1":"كيا سبورتاج - U5YPG8149KL547038"},
  {"billNo":"PTZT272","consigneeName":"طارق السلامات","acid":"0","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU754792","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU754792"},
  {"billNo":"PTZT273","consigneeName":"محمد ابو العز مروان محمد","acid":"9999102051000000277","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU752436","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU752436"},
  {"billNo":"PTZT274","consigneeName":"احمد محمد محمد إبراهيم","acid":"9999102011000001576","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU753017","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU753017"},
  {"billNo":"PTZT28","consigneeName":"محمد عبدالباسط عبدالمقصود جاد","acid":"999910861000002318","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCYIAGU754565","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCYIAGU754565"},
  {"billNo":"PTZT283","consigneeName":"تامر سمير السيد محمد الحوشي","acid":"9999101771000000529","cargoType":"هوندا سيفيك","chassis":"NLAFC5678JW000819","weight":"2000","column1":"هوندا سيفيك - NLAFC5678JW000819"},
  {"billNo":"PTZT284","consigneeName":"محمود حمدي عبدالغني محمد","acid":"9999101321000003428","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AFU705685","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AFU705685"},
  {"billNo":"PTZT285","consigneeName":"محمد عبدالكريم نصرالله محمد","acid":"9999101841000001643","cargoType":"تويوتا راش","chassis":"MHKEF8CF9MK005880","weight":"2000","column1":"تويوتا راش - MHKEF8CF9MK005880"},
  {"billNo":"PTZT286","consigneeName":"هيثم سمير بباوي سدره","acid":"9999101921000001973","cargoType":"تويوتا كورولا","chassis":"RKLBB9HE6J5206177","weight":"2000","column1":"تويوتا كورولا - RKLBB9HE6J5206177"},
  {"billNo":"PTZT288","consigneeName":"هاني حسني عكاشه إبراهيم","acid":"9999101541000000104","cargoType":"تويوتا كورولا","chassis":"RKLBV42E5D4638059","weight":"2000","column1":"تويوتا كورولا - RKLBV42E5D4638059"},
  {"billNo":"PTZT289","consigneeName":"هاني عبدالمسيح يوسف حنا","acid":"9999101841000001692","cargoType":"تويوتا افانزا","chassis":"MHKMC13F4FK016512","weight":"2000","column1":"تويوتا افانزا - MHKMC13F4FK016512"},
  {"billNo":"PTZT290","consigneeName":"أحمد رفعت عبدالرازق حماد","acid":"9999101881000001243","cargoType":"سوزوكي ارتيجا","chassis":"MA3NC2B15LA206117","weight":"2000","column1":"سوزوكي ارتيجا - MA3NC2B15LA206117"},
  {"billNo":"PTZT291","consigneeName":"حنان حمدي الشافعي محمد","acid":"9999101911000002360","cargoType":"شيفروليه كابتيفا","chassis":"LZWADAGA5NB008892","weight":"2000","column1":"شيفروليه كابتيفا - LZWADAGA5NB008892"},
  {"billNo":"PTZT292","consigneeName":"احمد هشام محمد سامي عبدالغني","acid":"9999101891000001994","cargoType":"سكودا كودياك","chassis":"TMBJC9PS8ST048743","weight":"2000","column1":"سكودا كودياك - TMBJC9PS8ST048743"},
  {"billNo":"PTZT294","consigneeName":"يسرا حسن شريف السيد ابراهيم داود","acid":"9999101971000000012","cargoType":"مرسيدس","chassis":"W1N4N8HB0RJ563153","weight":"2000","column1":"مرسيدس - W1N4N8HB0RJ563153"},
  {"billNo":"PTZT295","consigneeName":"محمد كمال عفيفي ابراهيم","acid":"9999102021000000551","cargoType":"متسوبيشي لانسر","chassis":"JMYSRCY1ADU708811","weight":"2000","column1":"متسوبيشي لانسر - JMYSRCY1ADU708811"},
  {"billNo":"PTZT297","consigneeName":"بان عرب تورز بات","acid":"2001479191019610011","cargoType":"تويوتا فورتشنر","chassis":"MHFDB8FS6T0514950 - MHFDB8FS6T0515564","weight":"4000","column1":"تويوتا فورتشنر - MHFDB8FS6T0514950 - MHFDB8FS6T0515564"},
  {"billNo":"PTZT298","consigneeName":"عصمت السيد محمد نعمة لله","acid":"9999101331000003112","cargoType":"تويوتا كرولا","chassis":"RKLBB9HE8E5018010","weight":"2000","column1":"تويوتا كرولا - RKLBB9HE8E5018010"},
  {"billNo":"PTZT299","consigneeName":"محمود محمد لطفي عبدالرحيم","acid":"9999101961000002027","cargoType":"فولكس واجن جولف","chassis":"WVWCG2AUXFW096263","weight":"2000","column1":"فولكس واجن جولف - WVWCG2AUXFW096263"},
  {"billNo":"PTZT3","consigneeName":"منتصر محمد السيد حجازى","acid":"9999100281000000702","cargoType":"ميتسوبيشي لانسر","chassis":"JE3AB36A5HU715712","weight":"2000","column1":"ميتسوبيشي لانسر - JE3AB36A5HU715712"},
  {"billNo":"PTZT300","consigneeName":"شهاب محمد مرسى حسن - تربتيك","acid":"0","cargoType":"كاديلاك","chassis":"1GYS4MKL1PR241304","weight":"2000","column1":"كاديلاك - 1GYS4MKL1PR241304"},
  {"billNo":"PTZT302","consigneeName":"صبرى محمد السيد ابراهيم","acid":"9999101991000002727","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU747400","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU747400"},
  {"billNo":"PTZT304","consigneeName":"عبير عبدالرازق السيد السيد حواس","acid":"9999101961000000203","cargoType":"شيفروليه كابتيفيا","chassis":"LZWADAGA3RB019315","weight":"2000","column1":"شيفروليه كابتيفيا - LZWADAGA3RB019315"},
  {"billNo":"PTZT305","consigneeName":"عزيزة محمود حسن حسين","acid":"9999101951000001285","cargoType":"هيونداي النترا","chassis":"KMHLN41B1RU700620","weight":"2000","column1":"هيونداي النترا - KMHLN41B1RU700620"},
  {"billNo":"PTZT307","consigneeName":"محمد غريب عزوز علي","acid":"9999101891000002737","cargoType":"هيونداي النترا","chassis":"KMHD741C7HU306528","weight":"2000","column1":"هيونداي النترا - KMHD741C7HU306528"},
  {"billNo":"PTZT308","consigneeName":"محمد المنتصر محمد رجائى ابراهيم سيد احمد","acid":"9999101981000001241","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU717906","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU717906"},
  {"billNo":"PTZT309","consigneeName":"احمد عبدالصمد تهامى السيد","acid":"9999101991000000762","cargoType":"كيا سيراتو","chassis":"KNAF24167K5849172","weight":"2000","column1":"كيا سيراتو - KNAF24167K5849172"},
  {"billNo":"PTZT31","consigneeName":"السيد فرج احمد الصاوى","acid":"9999101431000001387","cargoType":"كيا بيكانتو","chassis":"KNABX5126CT046739","weight":"2000","column1":"كيا بيكانتو - KNABX5126CT046739"},
  {"billNo":"PTZT310","consigneeName":"اسماعيل عزمى اسماعيل عطيه","acid":"9999101991000000630","cargoType":"كيا سيراتو","chassis":"KNAF24163L5857142","weight":"2000","column1":"كيا سيراتو - KNAF24163L5857142"},
  {"billNo":"PTZT311","consigneeName":"عبدالرؤف محمد السيد عبدالرؤف","acid":"9999101991000000648","cargoType":"كيا سيراتو","chassis":"KNAF24165K5849140","weight":"2000","column1":"كيا سيراتو - KNAF24165K5849140"},
  {"billNo":"PTZT312","consigneeName":"خالد عبدالباسط عبدالغفار نور الدين","acid":"9999101811000002909","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU723473","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU723473"},
  {"billNo":"PTZT313","consigneeName":"عمرو احمد محمد سيد حسن","acid":"9999102051000002554","cargoType":"فولكس واجن جولف","chassis":"WVWCU2AU7GW102434","weight":"2000","column1":"فولكس واجن جولف - WVWCU2AU7GW102434"},
  {"billNo":"PTZT32","consigneeName":"صلاح عوض الله حامد ابو الوفا","acid":"9999101631000003453","cargoType":"هايونداي النترا","chassis":"KMHDT41B4BU206185","weight":"2000","column1":"هايونداي النترا - KMHDT41B4BU206185"},
  {"billNo":"PTZT33","consigneeName":"السعيد حماده محمد علي المصرى","acid":"9999102011000001485","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1ADU710009","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1ADU710009"},
  {"billNo":"PTZT34","consigneeName":"سيد رشاد محمد عبدالفتاح","acid":"9999101621000001334","cargoType":"كيا سبورتاج","chassis":"U5YPH8143HL131105","weight":"2000","column1":"كيا سبورتاج - U5YPH8143HL131105"},
  {"billNo":"PTZT35","consigneeName":"حسينى عبده علي محمد","acid":"9999101641000000219","cargoType":"ميتسوبيشي لانسر","chassis":"JE3AB36A8HU711119","weight":"2000","column1":"ميتسوبيشي لانسر - JE3AB36A8HU711119"},
  {"billNo":"PTZT36","consigneeName":"طارق فوزى العيسوى العيسوى جدامى","acid":"9999101411000000316","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU754209","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU754209"},
  {"billNo":"PTZT37","consigneeName":"السيد محمود جمعه محمد","acid":"9999101791000000832","cargoType":"كيا سيراتو","chassis":"KNAFJ4116G5467598","weight":"2000","column1":"كيا سيراتو - KNAFJ4116G5467598"},
  {"billNo":"PTZT38","consigneeName":"السيد السيد حلمى السيد","acid":"9999102011000001196","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AEU724053","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AEU724053"},
  {"billNo":"PTZT39","consigneeName":"الغزالي خلف محمد حامد ابوراشد","acid":"9999101351000001833","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCS1A7U709701","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCS1A7U709701"},
  {"billNo":"PTZT4","consigneeName":"عماد محمد ابراهيم محمد","acid":"9999100091000000721","cargoType":"كيا سول","chassis":"KNAJN8119H7359570","weight":"2000","column1":"كيا سول - KNAJN8119H7359570"},
  {"billNo":"PTZT40","consigneeName":"محمد عامر حسن عامر","acid":"9999101991000002677","cargoType":"كيا ريو","chassis":"KNADN5129F6963904","weight":"2000","column1":"كيا ريو - KNADN5129F6963904"},
  {"billNo":"PTZT41","consigneeName":"احمد السيد محمد احمد","acid":"9999101841000001809","cargoType":"كيا سيراتو","chassis":"KNAF34167K5035326","weight":"2000","column1":"كيا سيراتو - KNAF34167K5035326"},
  {"billNo":"PTZT42","consigneeName":"محمود وفقي شاكر الصادق","acid":"9999101861000002300","cargoType":"كيا بيكانتو","chassis":"KNABX5126DT476773","weight":"2000","column1":"كيا بيكانتو - KNABX5126DT476773"},
  {"billNo":"PTZT43","consigneeName":"محمد محمد السيد راضي جبريل","acid":"9999101861000001476","cargoType":"مازدا 3","chassis":"JM7BL1SZ4E1420112","weight":"2000","column1":"مازدا 3 - JM7BL1SZ4E1420112"},
  {"billNo":"PTZT44","consigneeName":"احمد وحید محمد احمد","acid":"9999101891000002422","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AEU724986","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AEU724986"},
  {"billNo":"PTZT45","consigneeName":"مهدى محمد عبدالعال محمد عوض","acid":"9999101811000002339","cargoType":"بيجو 301","chassis":"VF3DDNFP5EJ509855","weight":"2000","column1":"بيجو 301 - VF3DDNFP5EJ509855"},
  {"billNo":"PTZT46","consigneeName":"محمد جمال حسنى فوده","acid":"9999101891000002430","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU756587","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU756587"},
  {"billNo":"PTZT47","consigneeName":"هيثم ثابت محمد الجمال","acid":"9999101911000000695","cargoType":"كيا سول","chassis":"KNAJT8111D7586638","weight":"2000","column1":"كيا سول - KNAJT8111D7586638"},
  {"billNo":"PTZT48","consigneeName":"هانى عطيه السيد سيد احمد","acid":"9999102011000001394","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AEU713134","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AEU713134"},
  {"billNo":"PTZT49","consigneeName":"محمود مصباح جابر إسماعيل","acid":"9999101351000002674","cargoType":"هيونداي النترا","chassis":"KMHDG41C0FU335026","weight":"2000","column1":"هيونداي النترا - KMHDG41C0FU335026"},
  {"billNo":"PTZT50","consigneeName":"احمد محمود عبدالعاطي محمد","acid":"9999101891000002695","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU751799","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU751799"},
  {"billNo":"PTZT51","consigneeName":"عبدالسلام خالد عبدالسلام السيد","acid":"9999101911000002865","cargoType":"شيفرلية كابتيفا","chassis":"LZWADAGA1MB011903","weight":"2000","column1":"شيفرلية كابتيفا - LZWADAGA1MB011903"},
  {"billNo":"PTZT52","consigneeName":"عبدالرحمن السيد عثمان عباس عثمان","acid":"9999101901000000746","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AFU728596","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AFU728596"},
  {"billNo":"PTZT53","consigneeName":"حسن نجاح عبدالنبي محمد مكاوى","acid":"9999101891000002661","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AGU751995","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AGU751995"},
  {"billNo":"PTZT54","consigneeName":"اسماعيل علي محمود علي سمره","acid":"9999101861000001930","cargoType":"هيونداي توسان","chassis":"TMAJ28119MJ107959","weight":"2000","column1":"هيونداي توسان - TMAJ28119MJ107959"},
  {"billNo":"PTZT55","consigneeName":"عمر جلال العوضي السنيطي","acid":"9999101631000000483","cargoType":"تويوتا كورول","chassis":"JTDBZ42E4AJ066917","weight":"2000","column1":"تويوتا كورول - JTDBZ42E4AJ066917"},
  {"billNo":"PTZT56","consigneeName":"مصطفى حامد مصطفي حامد","acid":"9999101231000000763","cargoType":"تويوتا كورول","chassis":"RKLBB0BE0M0036999","weight":"2000","column1":"تويوتا كورول - RKLBB0BE0M0036999"},
  {"billNo":"PTZT57","consigneeName":"عبدالمجيد ربيع احمد عبدالمجيد","acid":"9999101541000000260","cargoType":"كيا ريو","chassis":"KNADN5127H6046995","weight":"2000","column1":"كيا ريو - KNADN5127H6046995"},
  {"billNo":"PTZT58","consigneeName":"إبراهيم محمود حسن جاد","acid":"9999101591000003087","cargoType":"هوندا سيفيك","chassis":"NLAFC5659HW008596","weight":"2000","column1":"هوندا سيفيك - NLAFC5659HW008596"},
  {"billNo":"PTZT59","consigneeName":"عمرو عابدين عبدالحافظ محمود","acid":"9999101631000002265","cargoType":"تويوتا يارس","chassis":"MHFB29F38H2017965","weight":"2000","column1":"تويوتا يارس - MHFB29F38H2017965"},
  {"billNo":"PTZT6","consigneeName":"سامح رفعت ابو العطا السيد","acid":"9999100271000000521","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCS3ABU712380","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCS3ABU712380"},
  {"billNo":"PTZT61","consigneeName":"محمد عبدالمنعم عبدالنبي عمران","acid":"9999101701000000666","cargoType":"شيفروليه اكوينوكس","chassis":"3GNAX9DVXJS516720","weight":"2000","column1":"شيفروليه اكوينوكس - 3GNAX9DVXJS516720"},
  {"billNo":"PTZT62","consigneeName":"عبد الرحيم عبدالسلام محمد يوسف","acid":"9999101591000002931","cargoType":"كيا ريو","chassis":"KNADN5121G6734943","weight":"2000","column1":"كيا ريو - KNADN5121G6734943"},
  {"billNo":"PTZT63","consigneeName":"عمرو عابدين عبدالحافظ محمود","acid":"9999101911000000943","cargoType":"تويوتا كرول","chassis":"RKLBB0BE1N0040447","weight":"2000","column1":"تويوتا كرول - RKLBB0BE1N0040447"},
  {"billNo":"PTZT64","consigneeName":"احمد محمد يوسف سليمان","acid":"9999101361000002483","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AFU704923","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AFU704923"},
  {"billNo":"PTZT65","consigneeName":"مصطفي إبراهيم احمد إبراهيم أبو النجا","acid":"9999101381000002572","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AFU718520","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AFU718520"},
  {"billNo":"PTZT66","consigneeName":"محمد الهادى علي الدسوقي","acid":"9999101221000000620","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1ADU711198","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1ADU711198"},
  {"billNo":"PTZT67","consigneeName":"عبدالفتاح جبر محمد شندى","acid":"9999101331000003310","cargoType":"مازدا 3","chassis":"JM7BM1SZ3F1163460","weight":"2000","column1":"مازدا 3 - JM7BM1SZ3F1163460"},
  {"billNo":"PTZT68","consigneeName":"عمر عبدالفتاح محمد عبدالفتاح الشربينى","acid":"9999101881000001094","cargoType":"كيا سيراتو","chassis":"KNAF14166L5857896","weight":"2000","column1":"كيا سيراتو - KNAF14166L5857896"},
  {"billNo":"PTZT69","consigneeName":"محمد فتحي عبد المقصود الحسيني","acid":"9999101731000001026","cargoType":"اودي ايه 3","chassis":"WAUAYJFF1G1098200","weight":"2000","column1":"اودي ايه 3 - WAUAYJFF1G1098200"},
  {"billNo":"PTZT7","consigneeName":"كامل ابو السعود سلامه محمد شاهين","acid":"999910421000000836","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AFU731765","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AFU731765"},
  {"billNo":"PTZT70","consigneeName":"محمد مرسي شبل شرباش","acid":"9999101411000000217","cargoType":"ديهاتسو تيريوس","chassis":"MHKGC21P4EK004289","weight":"2000","column1":"ديهاتسو تيريوس - MHKGC21P4EK004289"},
  {"billNo":"PTZT71","consigneeName":"اماني عبد المقصود عبدالله زين الدين","acid":"9999101391000002605","cargoType":"سوزوكي سياز","chassis":"MA3VC4A17GA155612","weight":"2000","column1":"سوزوكي سياز - MA3VC4A17GA155612"},
  {"billNo":"PTZT76","consigneeName":"محمد هارون عماره الطويل","acid":"9999101541000003074","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY2A8U713231","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY2A8U713231"},
  {"billNo":"PTZT77","consigneeName":"نجوي محمد محمد موسي","acid":"9999101961000000831","cargoType":"شيفرلية كابتيفا","chassis":"LZWADAGA5PB039501","weight":"2000","column1":"شيفرلية كابتيفا - LZWADAGA5PB039501"},
  {"billNo":"PTZT78","consigneeName":"النبوي ابوالفتوح محمد عبدالله النجار","acid":"9999101981000001951","cargoType":"كيا سبورتاج","chassis":"U5YPG8145KL650151","weight":"2000","column1":"كيا سبورتاج - U5YPG8145KL650151"},
  {"billNo":"PTZT8","consigneeName":"سعيد محمد عبدالمنعم داود","acid":"9999101411000000506","cargoType":"ميتسوبيشي لانسر","chassis":"JMYSRCY1AFU716189","weight":"2000","column1":"ميتسوبيشي لانسر - JMYSRCY1AFU716189"},
  {"billNo":"PTZT81","consigneeName":"ماجدة يوسف مصطفى يوسف ابو باشا","acid":"0","cargoType":"مرسيدس سي  180","chassis":"WDDWF4AB9ER803083","weight":"2000","column1":"مرسيدس سي  180 - WDDWF4AB9ER803083"},
  {"billNo":"PTZT82","consigneeName":"احمد عثمان السيد علي عبدالله","acid":"9999101911000002923","cargoType":"هايونداي كاريتا","chassis":"MALC281C0LM608366","weight":"2000","column1":"هايونداي كاريتا - MALC281C0LM608366"},
  {"billNo":"PTZT83","consigneeName":"ابراهيم جمال ابراهيم فهمي","acid":"9999101911000002899","cargoType":"كيا سيراتو","chassis":"KNAFK4118F5121810","weight":"2000","column1":"كيا سيراتو - KNAFK4118F5121810"},
  {"billNo":"PTZT84","consigneeName":"خالد عادل حسن احمد منصور","acid":"9999101481000001036","cargoType":"كيا سول","chassis":"KNAJP8119J8287308","weight":"2000","column1":"كيا سول - KNAJP8119J8287308"},
  {"billNo":"PTZT85","consigneeName":"محمد السيد السيد اسماعيل اسماعيل","acid":"9999101861000002144","cargoType":"مرسيدس سي 180","chassis":"WDDWF4ABXHF216745","weight":"2000","column1":"مرسيدس سي 180 - WDDWF4ABXHF216745"},
  {"billNo":"PTZT86","consigneeName":"يحيى سامح عبدالمجيد عبدالسلام","acid":"9999101491000000441","cargoType":"كيا سبورتاج","chassis":"U5YPH8140LL845153","weight":"2000","column1":"كيا سبورتاج - U5YPH8140LL845153"},
  {"billNo":"PTZT88","consigneeName":"محمد حنيدق حسين محمد","acid":"9999101591000000919","cargoType":"فولكس جولف","chassis":"WVWDT2AU5HW075694","weight":"2000","column1":"فولكس جولف - WVWDT2AU5HW075694"},
  {"billNo":"PTZT89","consigneeName":"جمعة محمد معوض عوض","acid":"9999101941000002045","cargoType":"كيا بيكانتو","chassis":"KNABX5126FT778972","weight":"2000","column1":"كيا بيكانتو - KNABX5126FT778972"},
  {"billNo":"PTZT91","consigneeName":"أمل احمد السيد الجوهري","acid":"9999102001000000058","cargoType":"نيسان كيكس","chassis":"3N1CP5CP1PL506676","weight":"2000","column1":"نيسان كيكس - 3N1CP5CP1PL506676"},
  {"billNo":"PTZT92","consigneeName":"عاصم محمد عبداللاه محمد","acid":"9999101841000001668","cargoType":"تويوتا كرولا","chassis":"RKLBV42E1C4453540","weight":"2000","column1":"تويوتا كرولا - RKLBV42E1C4453540"},
  {"billNo":"PTZT93","consigneeName":"جورج ناجى خليل الجبلي","acid":"9999101941000000965","cargoType":"C180 مرسيدس","chassis":"WDDWF4AB8GR131995","weight":"2000","column1":"C180 مرسيدس - WDDWF4AB8GR131995"},
  {"billNo":"PTZT94","consigneeName":"اكمل عطيه عبدالله ابراهيم","acid":"9999101781000000254","cargoType":"فولكس تجوان","chassis":"WVGCG2AX8GW000444","weight":"2000","column1":"فولكس تجوان - WVGCG2AX8GW000444"},
  {"billNo":"PTZT95","consigneeName":"حسن رفاعى محمد حسن","acid":"9999101871000000170","cargoType":"هيونداي النترا","chassis":"KMHDG41C6DU626577","weight":"2000","column1":"هيونداي النترا - KMHDG41C6DU626577"},
  {"billNo":"PTZT96","consigneeName":"محمد حسنى بيومى عبده محمد الشريف","acid":"9999101591000002360","cargoType":"شفروليه اكوينوكس","chassis":"3GNAX9DV5JS543954","weight":"2000","column1":"شفروليه اكوينوكس - 3GNAX9DV5JS543954"},
  {"billNo":"PTZT97","consigneeName":"شاديه عبدالله محمود الجبري","acid":"9999101981000001357","cargoType":"ميتسوبيشي اكسباندر كروس","chassis":"MK2L6Y1Y0SN002176","weight":"2000","column1":"ميتسوبيشي اكسباندر كروس - MK2L6Y1Y0SN002176"},
  {"billNo":"PTZT99","consigneeName":"محمد السيد عبدالحميد محمد ابو الطيب","acid":"9999101881000001144","cargoType":"هيونداي النترا","chassis":"KMHDG41C9FU214902","weight":"2000","column1":"هيونداي النترا - KMHDG41C9FU214902"},
  {"billNo":"206","consigneeName":"ناريمان بنت عبدالله بن صالح اباالخيل","acid":"0","cargoType":"بورش ماكان 2020","chassis":"WP1AA2A58LLB14126","weight":"2000","column1":"بورش ماكان 2020 - WP1AA2A58LLB14126"},
  {"billNo":"249","consigneeName":"فهد بن عبدالعزيز بن صالح العبيد","acid":"0","cargoType":"مازدا سي اكس 9","chassis":"JM7TB1MA5F0424627","weight":"2000","column1":"مازدا سي اكس 9 - JM7TB1MA5F0424627"},
  {"billNo":"250","consigneeName":"عبدالوهاب زاهر عزت زاهر وهيب","acid":"9999101951000000071","cargoType":"تويوتا لاندكرزور 2024 ابيض","chassis":"JTMABBBJ9R4122460","weight":"2000","column1":"تويوتا لاندكرزور 2024 ابيض - JTMABBBJ9R4122460"}
];

// Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const progressBar = document.getElementById('progressBar');
const progressTitle = document.getElementById('progressTitle');
const statsSection = document.getElementById('statsSection');
const dataSection = document.getElementById('dataSection');
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const filteredCount = document.getElementById('filteredCount');
const totalCount = document.getElementById('totalCount');

const statBills = document.getElementById('statBills');
const statChassis = document.getElementById('statChassis');
const statWeight = document.getElementById('statWeight');
const statSpecial = document.getElementById('statSpecial');

// Buttons
const btnExportDocx = document.getElementById('btnExportDocx');
const btnExportXlsx = document.getElementById('btnExportXlsx');
const btnExportCsv = document.getElementById('btnExportCsv');
const btnCopyClipboard = document.getElementById('btnCopyClipboard');
const btnAddRow = document.getElementById('btnAddRow');
const btnClearData = document.getElementById('btnClearData');
const btnLoadSample = document.getElementById('btnLoadSample');

// Text Modal
const btnTextModalOpen = document.getElementById('btnTextModalOpen');
const btnTextModalClose = document.getElementById('btnTextModalClose');
const textModal = document.getElementById('textModal');
const rawTextArea = document.getElementById('rawTextArea');
const btnCancelText = document.getElementById('btnCancelText');
const btnProcessText = document.getElementById('btnProcessText');

// Toast
function showToast(msg, icon = 'fa-circle-check', isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');
  
  toastMsg.textContent = msg;
  toastIcon.className = `fa-solid ${icon} text-lg ${isError ? 'text-rose-400' : 'text-emerald-400'}`;
  
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3500);
}

// Drag & Drop
dropZone.addEventListener('click', () => fileInput.click());

['dragenter', 'dragover'].forEach(name => {
  dropZone.addEventListener(name, (e) => {
    e.preventDefault();
    dropZone.classList.add('border-primary-500', 'bg-primary-50/60');
  });
});

['dragleave', 'drop'].forEach(name => {
  dropZone.addEventListener(name, (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-primary-500', 'bg-primary-50/60');
  });
});

dropZone.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files && files.length > 0) {
    handleFile(files[0]);
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

// Upload and process PDF
async function handleFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    showToast('يرجى اختيار ملف بصيغة PDF فقط', 'fa-triangle-exclamation', true);
    return;
  }

  uploadProgress.classList.remove('hidden');
  progressBar.style.width = '30%';
  progressTitle.textContent = `جارٍ رفع ومعالجة: ${file.name}...`;

  // Read the file as Base64 and send as JSON (avoids multipart size limits)
  const reader = new FileReader();
  const readPromise = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
  });
  reader.readAsDataURL(file);
  try {
    const dataUrl = await readPromise; // e.g., data:application/pdf;base64,...
    progressBar.style.width = '65%';
    const response = await fetch('/api/convert-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfBase64: dataUrl })
    });

    progressBar.style.width = '90%';
    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || 'فشلت معالجة الملف');
    }

    progressBar.style.width = '100%';
    setTimeout(() => {
      uploadProgress.classList.add('hidden');
      if (result.records && result.records.length > 0) {
        setRecords(result.records);
        showToast(`تم استخراج ${result.records.length} بوليصة بنجاح!`, 'fa-circle-check');
      } else {
        showToast('لم يتم العثور على بوالص في هذا الملف', 'fa-triangle-exclamation', true);
      }
    }, 400);

  } catch (err) {
    console.error(err);
    uploadProgress.classList.add('hidden');
    showToast('خطأ: ' + err.message, 'fa-circle-xmark', true);
  }
}

// Load sample dataset
btnLoadSample.addEventListener('click', () => {
  setRecords(SAMPLE_MANIFEST_DATA);
  showToast(`تم تحميل عينة المنافيست بنجاح (${SAMPLE_MANIFEST_DATA.length} بوليصة)`, 'fa-wand-magic-sparkles');
});

// Modal Text
btnTextModalOpen.addEventListener('click', () => {
  textModal.classList.remove('hidden');
  rawTextArea.focus();
});
btnTextModalClose.addEventListener('click', () => textModal.classList.add('hidden'));
btnCancelText.addEventListener('click', () => textModal.classList.add('hidden'));

btnProcessText.addEventListener('click', async () => {
  const text = rawTextArea.value.trim();
  if (!text) {
    showToast('يرجى لصق نص المنافيست أولاً', 'fa-triangle-exclamation', true);
    return;
  }

  btnProcessText.disabled = true;
  btnProcessText.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> جارٍ المعالجة...';

  try {
    const response = await fetch('/api/convert-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const result = await response.json();
    if (!response.ok || result.error) throw new Error(result.error);

    textModal.classList.add('hidden');
    rawTextArea.value = '';
    setRecords(result.records);
    showToast(`تم استخراج ${result.records.length} بوليصة من النص!`, 'fa-circle-check');
  } catch (err) {
    showToast('خطأ في معالجة النص: ' + err.message, 'fa-circle-xmark', true);
  } finally {
    btnProcessText.disabled = false;
    btnProcessText.innerHTML = '<i class="fa-solid fa-gears"></i> معالجة وتفريغ النص';
  }
});

// Update State
function setRecords(records) {
  currentRecords = records.map((r, i) => ({
    id: i + 1,
    billNo: r.billNo || '',
    consigneeName: r.consigneeName || '',
    acid: r.acid || '0',
    cargoType: r.cargoType || '',
    chassis: r.chassis || '',
    weight: r.weight || '2000',
    column1: r.column1 || (r.cargoType && r.chassis ? `${r.cargoType} - ${r.chassis}` : (r.cargoType || r.chassis))
  }));
  filteredRecords = [...currentRecords];
  updateStats();
  renderTable();
  statsSection.classList.remove('hidden');
  dataSection.classList.remove('hidden');
}

// Update Statistics
function updateStats() {
  statBills.textContent = currentRecords.length.toLocaleString('ar-EG');
  
  // Count VINs
  let totalChassis = 0;
  let totalWeight = 0;
  let specialCount = 0;

  currentRecords.forEach(r => {
    if (r.chassis) {
      const parts = r.chassis.split(' - ');
      totalChassis += parts.length;
    }
    const w = parseInt(r.weight) || 0;
    totalWeight += w;

    if (r.consigneeName && (r.consigneeName.includes('مبادره') || r.consigneeName.includes('تربتيك') || r.consigneeName.includes('مالك اول'))) {
      specialCount++;
    }
  });

  statChassis.textContent = totalChassis.toLocaleString('ar-EG');
  statWeight.textContent = totalWeight.toLocaleString('ar-EG');
  statSpecial.textContent = specialCount.toLocaleString('ar-EG');
}

// Search Filter
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    filteredRecords = [...currentRecords];
  } else {
    filteredRecords = currentRecords.filter(r => 
      r.billNo.toLowerCase().includes(query) ||
      r.consigneeName.toLowerCase().includes(query) ||
      r.acid.toLowerCase().includes(query) ||
      r.cargoType.toLowerCase().includes(query) ||
      r.chassis.toLowerCase().includes(query) ||
      r.column1.toLowerCase().includes(query)
    );
  }
  renderTable();
});

// Render Table
function renderTable() {
  tableBody.innerHTML = '';
  totalCount.textContent = currentRecords.length;
  filteredCount.textContent = filteredRecords.length;

  if (filteredRecords.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="py-12 text-center text-slate-400">
          <i class="fa-solid fa-magnifying-glass text-3xl mb-2 block"></i>
          لا توجد نتائج مطابقة لبحثك
        </td>
      </tr>
    `;
    return;
  }

  filteredRecords.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.className = index % 2 === 0 ? 'bg-white hover:bg-blue-50/60 transition-colors' : 'bg-slate-50/70 hover:bg-blue-50/60 transition-colors';
    
    // Check if acid is 0 (terbtik)
    const isZeroAcid = row.acid === '0' || !row.acid;
    const acidBadgeClass = isZeroAcid ? 'text-slate-400 font-mono text-xs' : 'text-blue-700 font-mono text-xs font-bold';
    const seqStr = String(index + 1).padStart(3, '0');

    // Format multi-chassis with <br> for clean stacked display
    const chassisHtml = (row.chassis || '').split(/\s*-\s*|\n/).map(c => c.trim()).filter(Boolean).join('<br>');

    tr.innerHTML = `
      <td class="py-3 px-3 text-center text-slate-800 text-xs font-mono font-bold border-l border-slate-200">${seqStr}</td>
      
      <td class="py-3 px-4 font-mono font-bold text-slate-900 border-l border-slate-200" contenteditable="true" data-field="billNo" data-id="${row.id}">
        ${row.billNo}
      </td>
      
      <td class="py-3 px-4 text-slate-800 border-l border-slate-200 leading-snug" contenteditable="true" data-field="consigneeName" data-id="${row.id}">
        ${row.consigneeName || row.shipperName || ''}
      </td>
      
      <td class="py-3 px-4 border-l border-slate-200 font-mono" contenteditable="true" data-field="acid" data-id="${row.id}">
        <span class="${acidBadgeClass}">${row.acid}</span>
      </td>
      
      <td class="py-3 px-4 text-slate-800 border-l border-slate-200" contenteditable="true" data-field="cargoType" data-id="${row.id}">
        ${row.cargoType}
      </td>
      
      <td class="py-3 px-4 font-mono text-xs text-slate-700 border-l border-slate-200 font-bold leading-relaxed" contenteditable="true" data-field="chassis" data-id="${row.id}">
        ${chassisHtml || row.chassis}
      </td>
      
      <td class="py-3 px-3 text-center font-mono text-xs text-slate-700 border-l border-slate-200" contenteditable="true" data-field="weight" data-id="${row.id}">
        ${row.weight || '2000'}
      </td>
      
      <td class="py-3 px-2 text-center">
        <button class="btnDeleteRow text-slate-300 hover:text-rose-500 p-1.5 rounded transition-all" data-id="${row.id}" title="حذف هذا السطر">
          <i class="fa-solid fa-trash-can text-sm"></i>
        </button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  // Attach Inline Edit Listeners
  tableBody.querySelectorAll('[contenteditable="true"]').forEach(cell => {
    cell.addEventListener('blur', (e) => {
      const id = parseInt(e.target.dataset.id);
      const field = e.target.dataset.field;
      const val = e.target.innerText.trim();
      
      const record = currentRecords.find(r => r.id === id);
      if (record) {
        record[field] = val;
        // Auto update column1 if cargoType or chassis changed
        if (field === 'cargoType' || field === 'chassis') {
          record.column1 = `${record.cargoType} - ${record.chassis}`;
          const col1Cell = e.target.closest('tr').querySelector('[data-field="column1"]');
          if (col1Cell) col1Cell.innerText = record.column1;
        }
        updateStats();
      }
    });
  });

  // Attach Delete Listeners
  tableBody.querySelectorAll('.btnDeleteRow').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      currentRecords = currentRecords.filter(r => r.id !== id);
      filteredRecords = filteredRecords.filter(r => r.id !== id);
      updateStats();
      renderTable();
      showToast('تم حذف السطر', 'fa-trash-can');
    });
  });
}

// Add New Row
btnAddRow.addEventListener('click', () => {
  const newId = currentRecords.length > 0 ? Math.max(...currentRecords.map(r => r.id)) + 1 : 1;
  const newRow = {
    id: newId,
    billNo: 'جديد',
    consigneeName: 'اسم المستلم',
    acid: '9999000000000000000',
    cargoType: 'نوع السيارة',
    chassis: 'VIN12345678901234',
    weight: '2000',
    column1: 'نوع السيارة - VIN12345678901234'
  };
  currentRecords.unshift(newRow);
  filteredRecords = [...currentRecords];
  updateStats();
  renderTable();
  showToast('تمت إضافة سطر جديد بالأعلى، يمكنك تعديل بياناته مباشرة', 'fa-plus');
});

// Clear Data
btnClearData.addEventListener('click', () => {
  if (confirm('هل أنت متأكد من رغبتك في مسح كافة بيانات الجدول الحالية؟')) {
    currentRecords = [];
    filteredRecords = [];
    renderTable();
    statsSection.classList.add('hidden');
    dataSection.classList.add('hidden');
    showToast('تم مسح البيانات', 'fa-trash-can');
  }
});

// Export to Word (.docx)
btnExportDocx.addEventListener('click', async () => {
  if (currentRecords.length === 0) {
    showToast('لا توجد بيانات لتصديرها', 'fa-triangle-exclamation', true);
    return;
  }

  btnExportDocx.disabled = true;
  btnExportDocx.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> جارٍ إنشاء ملف الوورد...';

  try {
    const response = await fetch('/api/export-docx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'كشف تفريغ منافيست السيارات الصادر والترانزيت',
        records: currentRecords
      })
    });

    if (!response.ok) throw new Error('فشل إنشاء ملف الوورد');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `منافيست_سيارات_${new Date().toISOString().slice(0, 10)}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);

    showToast('تم تحميل ملف الوورد بنجاح!', 'fa-file-word');
  } catch (err) {
    console.error(err);
    showToast('خطأ أثناء تحميل ملف الوورد: ' + err.message, 'fa-circle-xmark', true);
  } finally {
    btnExportDocx.disabled = false;
    btnExportDocx.innerHTML = '<i class="fa-solid fa-file-word text-base"></i> تحميل وورد (Word .docx)';
  }
});

// Export to Excel (.xlsx)
btnExportXlsx.addEventListener('click', async () => {
  if (currentRecords.length === 0) {
    showToast('لا توجد بيانات لتصديرها', 'fa-triangle-exclamation', true);
    return;
  }

  btnExportXlsx.disabled = true;
  btnExportXlsx.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> جارٍ إنشاء الإكسيل...';

  try {
    const response = await fetch('/api/export-xlsx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: currentRecords })
    });

    if (!response.ok) throw new Error('فشل إنشاء ملف الإكسيل');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timeStamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    a.href = downloadUrl;
    a.download = `منافيست_المصري_الدولي_${timeStamp}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);

    showToast('تم تحميل ملف الإكسيل بنجاح!', 'fa-file-excel');
  } catch (err) {
    console.error(err);
    showToast('خطأ أثناء تحميل ملف الإكسيل: ' + err.message, 'fa-circle-xmark', true);
  } finally {
    btnExportXlsx.disabled = false;
    btnExportXlsx.innerHTML = '<i class="fa-solid fa-file-excel text-base"></i> تحميل إكسيل (Excel .xlsx)';
  }
});

// Export to CSV (UTF-8 with BOM for Excel Arabic)
btnExportCsv.addEventListener('click', () => {
  if (currentRecords.length === 0) {
    showToast('لا توجد بيانات لتصديرها', 'fa-triangle-exclamation', true);
    return;
  }

  const headers = ['مسلسل', 'رقم البوليصة', 'اسم المستلم', 'رقم الـ acid', 'نوع البضاعة', 'رقم الشاسيه', 'الوزن'];
  const rows = currentRecords.map((r, idx) => [
    `"${String(idx + 1).padStart(3, '0')}"`,
    `="${(r.billNo || '').replace(/"/g, '""')}"`,
    `"${(r.consigneeName || '').replace(/"/g, '""')}"`,
    `="${(r.acid || '0').replace(/"/g, '""')}"`, // ="..." forces Excel to keep as full text without scientific notation
    `"${(r.cargoType || '').replace(/"/g, '""')}"`,
    `="${(r.chassis || '').replace(/"/g, '""')}"`,
    `"${(r.weight || '2000').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  const timeStamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  a.href = downloadUrl;
  a.download = `منافيست_المصري_الدولي_${timeStamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);

  showToast('تم تحميل ملف CSV بنجاح!', 'fa-file-csv');
});

// Copy Table to Clipboard
btnCopyClipboard.addEventListener('click', () => {
  if (currentRecords.length === 0) {
    showToast('لا توجد بيانات للنسخ', 'fa-triangle-exclamation', true);
    return;
  }

  const headers = ['مسلسل', 'رقم البوليصة', 'اسم المستلم', 'رقم الـ acid', 'نوع البضاعة', 'رقم الشاسيه', 'الوزن'];
  const rows = currentRecords.map((r, idx) => [
    String(idx + 1).padStart(3, '0'),
    r.billNo || '',
    r.consigneeName || '',
    r.acid || '0',
    r.cargoType || '',
    r.chassis || '',
    r.weight || '2000'
  ].join('\t'));

  const textToCopy = [headers.join('\t'), ...rows].join('\n');
  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast('تم نسخ الجدول بالكامل إلى الحافظة! يمكنك الآن لصقه مباشرة في وورد أو إكسيل', 'fa-clipboard-check');
  }).catch(err => {
    showToast('تعذر النسخ التلقائي: ' + err.message, 'fa-triangle-exclamation', true);
  });
});
