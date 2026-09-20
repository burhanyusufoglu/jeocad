// ==============================================================================================
// JEOCAD AKILLI KLASÖR İÇE AKTARICI VE OTOMATİK AYRIŞTIRICI (folder_batch_importer.js v3.0)
// Dışarıdan yüklenen klasördeki tüm dosyaları (Excel .xlsx/.xls, Word .docx, CSV, DXF, Logo, Fotoğraf)
// tek hamlede tarar; kuyu loglarını, SPT/presiyometre deneylerini, karot fotoğraflarını ayrıştırır.
// ==============================================================================================

class FolderBatchImporter {
    constructor() {
        this.extractedData = {
            boreholes: [],
            geotechTests: [],
            logoFile: null,
            stampFile: null,
            corePhotos: [],
            dxfFiles: [],
            projectFile: null,
            scannedFiles: []
        };
    }

    // Dosyaları Asenkron Tara ve Akıllıca Ayrıştır
    async processFiles(fileList) {
        this.reset();
        const files = Array.from(fileList);

        for (const file of files) {
            const path = file.webkitRelativePath || file.name;
            const ext = (file.name.split('.').pop() || "").toLowerCase();
            const lowerName = file.name.toLowerCase();

            const scanItem = {
                name: file.name,
                path: path,
                size: file.size,
                ext: ext,
                role: "Genel Dosya",
                roleColor: "#94a3b8"
            };
            this.extractedData.scannedFiles.push(scanItem);

            try {
                // 1. GÖRSELLER (Logo, Kaşe, Karot Sandıkları, İnceleme Alanı Fotoğrafları)
                if (["png", "jpg", "jpeg", "webp", "bmp"].includes(ext)) {
                    const dataUrl = await this.readAsDataUrl(file);
                    if (lowerName.includes("logo") || lowerName.includes("firma") || lowerName.includes("sirket") || lowerName.includes("antet")) {
                        this.extractedData.logoFile = dataUrl;
                        scanItem.role = "🏢 Şirket Logosu";
                        scanItem.roleColor = "#38bdf8";
                    } else if (lowerName.includes("kase") || lowerName.includes("imza") || lowerName.includes("stamp")) {
                        this.extractedData.stampFile = dataUrl;
                        scanItem.role = "👷 Mühendis Kaşesi";
                        scanItem.roleColor = "#a855f7";
                    } else {
                        // Zemin projesindeki tüm resimler Karot Sandığı veya Arazi Fotoğrafıdır!
                        this.extractedData.corePhotos.push({
                            name: file.name,
                            path: path,
                            dataUrl: dataUrl
                        });
                        scanItem.role = "📷 Karot Sandığı / Saha Foto";
                        scanItem.roleColor = "#fbbf24";
                    }
                }

                // 2. EXCEL ÇALIŞMA KİTAPLARI (.xlsx, .xls, .xlsm, .xlsb, .ods)
                else if (["xlsx", "xls", "xlsm", "xlsb", "ods"].includes(ext)) {
                    await this.parseExcelFile(file, scanItem);
                }

                // 3. WORD BELGELERİ (.docx) - Dahili Karot Fotoğraflarını & Tabloları Çıkar
                else if (ext === "docx") {
                    await this.parseDocxFile(file, scanItem);
                }

                // 4. PDF RAPORLARI (.pdf)
                else if (ext === "pdf") {
                    if (lowerName.includes("tdth") || lowerName.includes("deprem")) {
                        scanItem.role = "🌍 TDTH Deprem Verisi";
                        scanItem.roleColor = "#f59e0b";
                    } else if (lowerName.includes("foto") || lowerName.includes("inceleme")) {
                        scanItem.role = "📷 Fotoğraf Albümü (PDF)";
                        scanItem.roleColor = "#fbbf24";
                    } else {
                        scanItem.role = "📕 Resmi Geoteknik Rapor (PDF)";
                        scanItem.roleColor = "#f87171";
                    }
                }

                // 5. METİN VE CSV TABLOLARI (.csv, .tsv, .txt)
                else if (["csv", "tsv", "txt"].includes(ext)) {
                    const text = await this.readAsText(file);
                    this.parseTextTable(text, file.name);
                    scanItem.role = "📊 Kuyu / Deney Tablosu (CSV)";
                    scanItem.roleColor = "#34d399";
                }

                // 6. CAD ÇİZİM DOSYALARI (.dxf)
                else if (ext === "dxf") {
                    const text = await this.readAsText(file);
                    this.extractedData.dxfFiles.push({
                        name: file.name,
                        content: text
                    });
                    scanItem.role = "📐 CAD Kesit Çizimi (.dxf)";
                    scanItem.roleColor = "#60a5fa";
                }

                // 7. JEOCAD PROJE DOSYALARI (.jeocad, .json)
                else if (ext === "jeocad" || (ext === "json" && lowerName.includes("jeocad"))) {
                    const text = await this.readAsText(file);
                    try {
                        this.extractedData.projectFile = JSON.parse(text);
                        scanItem.role = "💾 JeoCAD Proje Dosyası";
                        scanItem.roleColor = "#f59e0b";
                    } catch (e) {
                        console.warn("JSON parse hatası:", e);
                    }
                }
            } catch (err) {
                console.warn(`Dosya işlenirken hata oluştu (${file.name}):`, err);
            }
        }

        // Eğer kuyularda hiç litoloji bulunamadıysa ama kuyu adları tespit edildiyse varsayılan litoloji ver
        this.ensureBoreholeIntegrity();

        return this.extractedData;
    }

    // =========================================================================
    // EXCEL DOSYASI AYRIŞTIRMA (SheetJS XLSX)
    // =========================================================================
    async parseExcelFile(file, scanItem) {
        if (typeof XLSX === "undefined") {
            console.warn("XLSX kütüphanesi yüklenemedi.");
            return;
        }

        const buffer = await this.readAsArrayBuffer(file);
        const workbook = XLSX.read(buffer, { type: "array" });
        if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) return;

        let bhFoundInFile = 0;
        let testFoundInFile = 0;

        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) continue;

            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
            if (!rows || rows.length === 0) continue;

            // A. Sayfa Adı veya İçeriği Kuyu Adı ile mi Eşleşiyor? (Örn: SK-1, SK-2, Kuyu 1)
            const cleanSheetName = sheetName.trim();
            const isBoreholeSheet = /^(SK|BH|S|Kuyu)[\s\-_]?\d+/i.test(cleanSheetName);

            // B. Geoteknik / SPT / Presiyometre / Elek Analizi Tablosu mu?
            const sheetTextLower = (cleanSheetName + " " + file.name).toLowerCase();
            const isGeotechSheet = sheetTextLower.includes("spt") || 
                                   sheetTextLower.includes("presiyo") || 
                                   sheetTextLower.includes("deney") || 
                                   sheetTextLower.includes("laboratuvar") ||
                                   sheetTextLower.includes("ea-kl") ||
                                   sheetTextLower.includes("ny") ||
                                   sheetTextLower.includes("dk");

            if (isGeotechSheet) {
                const count = this.parseGeotechExcelRows(rows, cleanSheetName);
                testFoundInFile += count;
            }

            // C. Sondaj Kuyu & Litoloji Metrajları
            if (isBoreholeSheet) {
                const bhName = cleanSheetName.toUpperCase().replace(/\s+/g, "-");
                const count = this.parseSingleBoreholeExcelSheet(bhName, rows);
                bhFoundInFile += count;
            } else {
                // Çoklu kuyu içeren toplu liste tablosu mu?
                const count = this.parseMultiBoreholeExcelRows(rows);
                bhFoundInFile += count;
            }
        }

        // Rol Belirleme
        if (bhFoundInFile > 0 && testFoundInFile > 0) {
            scanItem.role = `📊 Excel Sondaj (${bhFoundInFile} Kuyu) & Deney (${testFoundInFile})`;
            scanItem.roleColor = "#10b981";
        } else if (bhFoundInFile > 0) {
            scanItem.role = `📊 Excel Kuyu Metrajı (${bhFoundInFile} Kuyu)`;
            scanItem.roleColor = "#34d399";
        } else if (testFoundInFile > 0) {
            scanItem.role = `📊 Excel Deney Verisi (${testFoundInFile} Test)`;
            scanItem.roleColor = "#38bdf8";
        } else {
            scanItem.role = "📗 Excel Çalışma Kitabı";
            scanItem.roleColor = "#22c55e";
        }
    }

    // Tek Bir Kuyuya Ait Sayfayı (Örn: SK-1) Ayrıştır
    parseSingleBoreholeExcelSheet(bhName, rows) {
        const intervals = [];
        let curTop = 0.0;

        for (let r = 0; r < rows.length; r++) {
            const row = rows[r];
            if (!Array.isArray(row) || row.length === 0) continue;

            // Hücreleri tara
            let foundTop = null, foundBot = null, foundLitho = "";

            for (let c = 0; c < row.length; c++) {
                const cell = String(row[c]).trim();
                if (!cell) continue;

                // 1. "0.00 - 2.50" veya "0-2.5m" gibi aralık var mı?
                const rangeMatch = cell.match(/(\d+[.,]?\d*)\s*[-–/]\s*(\d+[.,]?\d*)/);
                if (rangeMatch && foundTop === null) {
                    foundTop = parseFloat(rangeMatch[1].replace(",", "."));
                    foundBot = parseFloat(rangeMatch[2].replace(",", "."));
                    continue;
                }

                // 2. İki ardışık sayı var mı?
                const num = parseFloat(cell.replace(",", "."));
                if (!isNaN(num) && num >= 0 && num < 150) {
                    if (foundTop === null) foundTop = num;
                    else if (foundBot === null && num > foundTop) foundBot = num;
                }

                // 3. Litoloji tanımlaması (Kelime uzunluğu > 2 ve sayı değil)
                if (isNaN(parseFloat(cell)) && cell.length >= 3 && !cell.toLowerCase().includes("derinlik") && !cell.toLowerCase().includes("tcr")) {
                    if (this.isLithologyKeyword(cell)) {
                        foundLitho = cell;
                    }
                }
            }

            if (foundTop !== null && foundBot !== null && foundBot > foundTop) {
                intervals.push({
                    fromDepth: foundTop,
                    toDepth: foundBot,
                    topDepth: foundTop,
                    bottomDepth: foundBot,
                    name: foundLitho || "Zemin Tabakası",
                    color: this.getColorForLithology(foundLitho),
                    pattern: "hatch-fill"
                });
            }
        }

        if (intervals.length > 0) {
            let existingBh = this.extractedData.boreholes.find(b => b.name === bhName);
            if (existingBh) {
                existingBh.intervals = intervals;
            } else {
                const curCount = this.extractedData.boreholes.length;
                const maxDepth = intervals.reduce((m, iv) => Math.max(m, iv.toDepth), 15.0);
                this.extractedData.boreholes.push({
                    id: "bh-" + bhName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
                    name: bhName,
                    x: 1.5 + (curCount * 4.5),
                    surfaceElevation: 85.0,
                    bottomElevation: 85.0 - maxDepth,
                    diameter: 0.7,
                    intervals: intervals
                });
            }
            return 1;
        }
        return 0;
    }

    // Çoklu Kuyu İçeren Tabloyu Ayrıştır (Örn: Kolon A: SK-1, Kolon B: 0, Kolon C: 2.5, Kolon D: Dolgu)
    parseMultiBoreholeExcelRows(rows) {
        let bhCol = -1, fromCol = -1, toCol = -1, lithoCol = -1;
        let startRow = 0;

        // Başlık satırını ara
        for (let r = 0; r < Math.min(10, rows.length); r++) {
            const row = rows[r];
            row.forEach((cell, c) => {
                const text = String(cell).toLowerCase().trim();
                if (text.includes("kuyu") || text.includes("sondaj") || text === "sk") bhCol = c;
                if (text.includes("başlangıç") || text === "from" || text.includes("üst")) fromCol = c;
                if (text.includes("bitiş") || text === "to" || text.includes("alt") || text.includes("son")) toCol = c;
                if (text.includes("litoloji") || text.includes("tanım") || text.includes("zemin")) lithoCol = c;
            });
            if (bhCol !== -1 && (fromCol !== -1 || toCol !== -1)) {
                startRow = r + 1;
                break;
            }
        }

        if (bhCol === -1) return 0;

        const bhMap = new Map();
        for (let r = startRow; r < rows.length; r++) {
            const row = rows[r];
            if (!row || row.length <= bhCol) continue;

            const bhName = String(row[bhCol]).trim().toUpperCase();
            if (!bhName || !/^(SK|BH|S|KUYU)/i.test(bhName)) continue;

            let top = fromCol !== -1 ? parseFloat(String(row[fromCol]).replace(",", ".")) : NaN;
            let bot = toCol !== -1 ? parseFloat(String(row[toCol]).replace(",", ".")) : NaN;
            let lith = lithoCol !== -1 ? String(row[lithoCol]).trim() : "Tabaka";

            if (isNaN(top) || isNaN(bot)) {
                // Satırdaki ilk 2 sayıyı bul
                const nums = row.map(v => parseFloat(String(v).replace(",", "."))).filter(v => !isNaN(v));
                if (nums.length >= 2) {
                    top = nums[0];
                    bot = nums[1];
                }
            }

            if (!isNaN(top) && !isNaN(bot) && bot > top) {
                if (!bhMap.has(bhName)) bhMap.set(bhName, []);
                bhMap.get(bhName).push({
                    fromDepth: top,
                    toDepth: bot,
                    topDepth: top,
                    bottomDepth: bot,
                    name: lith || "Tabaka",
                    color: this.getColorForLithology(lith),
                    pattern: "hatch-fill"
                });
            }
        }

        let addedCount = 0;
        bhMap.forEach((intervals, bhName) => {
            let existingBh = this.extractedData.boreholes.find(b => b.name === bhName);
            if (existingBh) {
                existingBh.intervals = intervals;
            } else {
                const curCount = this.extractedData.boreholes.length;
                const maxDepth = intervals.reduce((m, iv) => Math.max(m, iv.toDepth), 15.0);
                this.extractedData.boreholes.push({
                    id: "bh-" + bhName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
                    name: bhName,
                    x: 1.5 + (curCount * 4.5),
                    surfaceElevation: 85.0,
                    bottomElevation: 85.0 - maxDepth,
                    diameter: 0.7,
                    intervals: intervals
                });
                addedCount++;
            }
        });

        return addedCount;
    }

    // Geoteknik Deney Satırlarını Ayrıştır (SPT, Presiyometre, Pl, Em, c', phi')
    parseGeotechExcelRows(rows, sheetName) {
        let colBh = -1, colDepth = -1, colSpt = -1, colPl = -1, colEm = -1, colC = -1, colPhi = -1, colPi = -1, colLl = -1, colLitho = -1;
        let startRow = 0;

        for (let r = 0; r < Math.min(10, rows.length); r++) {
            const row = rows[r];
            row.forEach((cell, c) => {
                const text = String(cell).toLowerCase().trim();
                if (text.includes("kuyu") || text.includes("sk") || text === "no") colBh = c;
                if (text.includes("derinlik") || text === "depth" || text === "m") colDepth = c;
                if (text.includes("spt") || text.includes("n30") || text.includes("n60") || text === "n") colSpt = c;
                if (text.includes("pl") || text.includes("limit basınç")) colPl = c;
                if (text.includes("em") || text.includes("menard") || text.includes("modül")) colEm = c;
                if (text === "c" || text === "c'" || text.includes("kohezyon")) colC = c;
                if (text.includes("phi") || text.includes("φ") || text.includes("sürtünme")) colPhi = c;
                if (text === "pi" || text.includes("plastisite")) colPi = c;
                if (text === "ll" || text.includes("likit")) colLl = c;
                if (text.includes("litoloji") || text.includes("tanım")) colLitho = c;
            });
            if (colDepth !== -1 && (colSpt !== -1 || colPl !== -1 || colEm !== -1 || colLitho !== -1)) {
                startRow = r + 1;
                break;
            }
        }

        let count = 0;
        let defaultBh = /^(SK|BH|S|KUYU)[\s\-_]?\d+/i.test(sheetName) ? sheetName.toUpperCase().replace(/\s+/g, "-") : "SK-1";

        for (let r = startRow; r < rows.length; r++) {
            const row = rows[r];
            if (!row || row.length === 0) continue;

            const bhName = colBh !== -1 ? (String(row[colBh]).trim().toUpperCase() || defaultBh) : defaultBh;
            const depth = colDepth !== -1 ? parseFloat(String(row[colDepth]).replace(",", ".")) : NaN;

            if (isNaN(depth) || depth < 0) continue;

            const spt = colSpt !== -1 ? (parseFloat(String(row[colSpt]).replace(",", ".")) || 12) : 12;
            const pl = colPl !== -1 ? (parseFloat(String(row[colPl]).replace(",", ".")) || 0.6) : 0.6;
            const em = colEm !== -1 ? (parseFloat(String(row[colEm]).replace(",", ".")) || 7.0) : 7.0;
            const c = colC !== -1 ? (parseFloat(String(row[colC]).replace(",", ".")) || 15) : 15;
            const phi = colPhi !== -1 ? (parseFloat(String(row[colPhi]).replace(",", ".")) || 22) : 22;
            const pi = colPi !== -1 ? (parseFloat(String(row[colPi]).replace(",", ".")) || 16) : 16;
            const ll = colLl !== -1 ? (parseFloat(String(row[colLl]).replace(",", ".")) || 34) : 34;
            const lith = colLitho !== -1 ? (String(row[colLitho]).trim() || "Zemin Katmanı") : "Zemin Katmanı";

            this.extractedData.geotechTests.push({
                id: "imp_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
                borehole: bhName,
                depth: depth,
                sptN60: spt,
                presioPL: pl,
                presioEM: em,
                pointLoadIs: 0,
                cohesion: c,
                frictionAngle: phi,
                pi: pi,
                ll: ll,
                lithology: lith
            });
            count++;
        }

        return count;
    }

    // =========================================================================
    // WORD BELGESİ (.DOCX) AYRIŞTIRMA (JSZip)
    // =========================================================================
    async parseDocxFile(file, scanItem) {
        if (typeof JSZip === "undefined") return;

        const buffer = await this.readAsArrayBuffer(file);
        const zip = await JSZip.loadAsync(buffer);
        let extractedPhotos = 0;

        for (const zipPath of Object.keys(zip.files)) {
            if (zipPath.startsWith("word/media/")) {
                const imgFile = zip.files[zipPath];
                const blob = await imgFile.async("blob");
                const dataUrl = await this.blobToDataUrl(blob);
                const imgName = zipPath.split("/").pop();

                if (imgName.toLowerCase().includes("logo") || file.name.toLowerCase().includes("logo")) {
                    this.extractedData.logoFile = dataUrl;
                } else if (imgName.toLowerCase().includes("kase") || imgName.toLowerCase().includes("imza")) {
                    this.extractedData.stampFile = dataUrl;
                } else {
                    this.extractedData.corePhotos.push({
                        name: `${file.name.replace('.docx','')} - Foto ${extractedPhotos + 1}`,
                        path: `${file.name}/${imgName}`,
                        dataUrl: dataUrl
                    });
                    extractedPhotos++;
                }
            }
        }

        if (extractedPhotos > 0) {
            scanItem.role = `📘 Word Raporu (${extractedPhotos} Karot Fotoğrafı)`;
            scanItem.roleColor = "#60a5fa";
        } else {
            scanItem.role = "📘 Resmi Rapor Metni (.docx)";
            scanItem.roleColor = "#93c5fd";
        }
    }

    // Metin veya CSV Tablolarını Ayrıştır
    parseTextTable(text, fileName) {
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length === 0) return;

        const header = lines[0].toLowerCase();

        // A. Geoteknik / SPT / Presiyometre Deney Tablosu
        if (header.includes("spt") || header.includes("presiyo") || header.includes("pl") || header.includes("deney") || header.includes("n60")) {
            lines.forEach((line, idx) => {
                if (idx === 0 && (line.includes("spt") || line.includes("derinlik") || line.includes("kuyu"))) return;
                const parts = line.split(/[,\t;]/).map(p => p.trim());
                if (parts.length >= 3) {
                    const bh = parts[0] || "SK-1";
                    const depth = parseFloat(parts[1].replace(",", ".")) || 1.5;
                    const spt = parseFloat(parts[2].replace(",", ".")) || 10;
                    const pl = parts[3] ? (parseFloat(parts[3].replace(",", ".")) || 0.5) : 0.5;
                    const em = parts[4] ? (parseFloat(parts[4].replace(",", ".")) || 5.0) : 5.0;
                    const c = parts[6] ? (parseFloat(parts[6].replace(",", ".")) || 15) : 15;
                    const phi = parts[7] ? (parseFloat(parts[7].replace(",", ".")) || 20) : 20;
                    const lith = parts[10] || parts[parts.length - 1] || "Zemin Katmanı";

                    this.extractedData.geotechTests.push({
                        id: "imp_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
                        borehole: bh,
                        depth: depth,
                        sptN60: spt,
                        presioPL: pl,
                        presioEM: em,
                        pointLoadIs: 0,
                        cohesion: c,
                        frictionAngle: phi,
                        pi: 15,
                        ll: 30,
                        lithology: lith
                    });
                }
            });
        }
        // B. Sondaj Kuyu & Tabaka Metrajı
        else {
            const bhMap = new Map();
            lines.forEach(line => {
                const parts = line.split(/[,\t;]/).map(p => p.trim());
                if (parts.length >= 3) {
                    const bhName = parts[0];
                    const top = parseFloat(parts[1].replace(",", "."));
                    const bot = parseFloat(parts[2].replace(",", "."));
                    const lith = parts[3] || "Tabaka";

                    if (bhName && !isNaN(top) && !isNaN(bot)) {
                        if (!bhMap.has(bhName)) {
                            bhMap.set(bhName, []);
                        }
                        bhMap.get(bhName).push({
                            fromDepth: Math.min(top, bot),
                            toDepth: Math.max(top, bot),
                            topDepth: Math.min(top, bot),
                            bottomDepth: Math.max(top, bot),
                            name: lith,
                            color: this.getColorForLithology(lith),
                            pattern: "hatch-fill"
                        });
                    }
                }
            });

            let curX = 1.5;
            bhMap.forEach((intervals, name) => {
                const maxDepth = intervals.reduce((m, iv) => Math.max(m, iv.toDepth || iv.bottomDepth), 15.0);
                const bhId = "bh-" + name.toLowerCase().replace(/[^a-z0-9]/g, "_");
                this.extractedData.boreholes.push({
                    id: bhId,
                    name: name,
                    x: curX,
                    surfaceElevation: 85.0,
                    bottomElevation: 85.0 - maxDepth,
                    diameter: 0.7,
                    intervals: intervals
                });
                curX += 4.5;
            });
        }
    }

    // Eksik Litolojisi Olan Kuyuları Tamamla
    ensureBoreholeIntegrity() {
        // Eğer hiç kuyu bulunamadı ama geoteknik deneylerde kuyu adları varsa, o kuyuları oluştur
        if (this.extractedData.boreholes.length === 0 && this.extractedData.geotechTests.length > 0) {
            const uniqueBhNames = [...new Set(this.extractedData.geotechTests.map(t => t.borehole))];
            let curX = 1.5;
            uniqueBhNames.forEach(name => {
                const tests = this.extractedData.geotechTests.filter(t => t.borehole === name);
                const maxD = tests.reduce((m, t) => Math.max(m, t.depth), 15.0);
                
                // Deney litolojilerinden tabakalar türet
                const intervals = [];
                let lastD = 0;
                tests.sort((a,b) => a.depth - b.depth).forEach(t => {
                    if (t.depth > lastD) {
                        intervals.push({
                            fromDepth: lastD,
                            toDepth: t.depth,
                            topDepth: lastD,
                            bottomDepth: t.depth,
                            name: t.lithology || "Zemin",
                            color: this.getColorForLithology(t.lithology),
                            pattern: "hatch-fill"
                        });
                        lastD = t.depth;
                    }
                });
                if (intervals.length === 0) {
                    intervals.push({ fromDepth: 0, toDepth: maxD, topDepth: 0, bottomDepth: maxD, name: "Zemin", color: "#854d0e", pattern: "hatch-fill" });
                }

                this.extractedData.boreholes.push({
                    id: "bh-" + name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
                    name: name,
                    x: curX,
                    surfaceElevation: 85.0,
                    bottomElevation: 85.0 - maxD,
                    diameter: 0.7,
                    intervals: intervals
                });
                curX += 4.5;
            });
        }
    }

    isLithologyKeyword(str) {
        const text = str.toLowerCase();
        const keywords = ["dolgu", "kil", "silt", "kum", "çakıl", "marn", "kireç", "kalker", "kumtaşı", "bazalt", "volkanik", "alüvyon", "tüf", "kaya", "zemin", "toprak"];
        return keywords.some(k => text.includes(k));
    }

    getColorForLithology(name) {
        const text = (name || "").toLowerCase();
        if (text.includes("dolgu") || text.includes("fill")) return "#78350f";
        if (text.includes("kumlu kil")) return "#854d0e";
        if (text.includes("killi silt") || text.includes("silt")) return "#1e3a8a";
        if (text.includes("kumtaşı") || text.includes("kum")) return "#ca8a04";
        if (text.includes("çakıl")) return "#ea580c";
        if (text.includes("kireç") || text.includes("kalker")) return "#475569";
        if (text.includes("bazalt") || text.includes("volkanik")) return "#0f172a";
        if (text.includes("marn")) return "#3b82f6";
        return "#a16207";
    }

    // Dosyayı Metin Olarak Oku
    readAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(file, "utf-8");
        });
    }

    // Dosyayı Data URL (Base64) Olarak Oku
    readAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Dosyayı ArrayBuffer Olarak Oku
    readAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // Blob'u Data URL'e Çevir
    blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Ayrıştırma Sonuçlarını Aktif Projeye Uygula
    applyToCurrentProject(project) {
        if (!project) return;

        // 1. Proje Dosyası Varsa Doğrudan Birleştir
        if (this.extractedData.projectFile) {
            Object.assign(project, this.extractedData.projectFile);
        }

        // 2. Bulunan Kuyuları Ekle / Güncelle
        if (this.extractedData.boreholes.length > 0) {
            project.boreholes = this.extractedData.boreholes;

            // Kesit mesafesini ayarla
            const maxX = project.boreholes.reduce((m, b) => Math.max(m, b.x), 12.0);
            project.parameters.totalDistance = Math.max(12.0, Math.ceil(maxX + 2.0));

            // Kot sınırlarını kuyuların boyuna göre tam ayarla
            let minE = Infinity;
            let maxE = -Infinity;
            project.boreholes.forEach(bh => {
                if (bh.surfaceElevation !== undefined) maxE = Math.max(maxE, bh.surfaceElevation);
                if (bh.bottomElevation !== undefined) minE = Math.min(minE, bh.bottomElevation);
            });
            if (minE !== Infinity && maxE !== -Infinity) {
                project.parameters.minElevation = Math.max(0, Math.floor(minE - 2.0));
                project.parameters.maxElevation = Math.ceil(maxE + 2.0);
                const diff = project.parameters.maxElevation - project.parameters.minElevation;
                project.parameters.elevationStep = diff > 40 ? 5.0 : (diff > 15 ? 2.0 : 1.0);
            }

            // Tabaka birimlerini (strataUnits) lejata ve listeye ekle
            if (!project.strataUnits) project.strataUnits = [];
            const existingNames = new Set(project.strataUnits.map(u => u.name));
            this.extractedData.boreholes.forEach(bh => {
                (bh.intervals || []).forEach(iv => {
                    if (iv.name && !existingNames.has(iv.name)) {
                        existingNames.add(iv.name);
                        project.strataUnits.push({
                            id: `u-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                            name: iv.name,
                            color: iv.color || "#ca8a04",
                            pattern: iv.pattern || "hatch-fill"
                        });
                    }
                });
            });
        }

        // 3. Karot Sandığı Fotoğraflarını İliştir
        if (this.extractedData.corePhotos.length > 0) {
            project.corePhotos = this.extractedData.corePhotos;
            if (project.coreBoxCard) {
                project.coreBoxCard.visible = true;
                project.coreBoxCard.photoDataUrl = this.extractedData.corePhotos[0].dataUrl;
                project.coreBoxCard.photoName = this.extractedData.corePhotos[0].name;
            }
            // Kuyu isimleriyle eşleşen fotoğrafları ilgili kuyuya ata
            project.boreholes.forEach(bh => {
                const matchingPhoto = this.extractedData.corePhotos.find(p => p.name.toUpperCase().includes(bh.name.toUpperCase()));
                if (matchingPhoto) {
                    bh.corePhotoDataUrl = matchingPhoto.dataUrl;
                }
            });
        }

        // 4. Bulunan Şirket Logosunu ve Kaşesini Uygula
        if (this.extractedData.logoFile && window.JeoCADCompany) {
            window.JeoCADCompany.saveProfile({
                companyLogoDataUrl: this.extractedData.logoFile
            });
        }
        if (this.extractedData.stampFile && window.JeoCADCompany) {
            window.JeoCADCompany.saveProfile({
                engineerStampDataUrl: this.extractedData.stampFile
            });
        }

        return {
            boreholeCount: this.extractedData.boreholes.length,
            geotechTestCount: this.extractedData.geotechTests.length,
            corePhotoCount: this.extractedData.corePhotos.length,
            hasLogo: !!this.extractedData.logoFile,
            hasStamp: !!this.extractedData.stampFile
        };
    }

    reset() {
        this.extractedData = {
            boreholes: [],
            geotechTests: [],
            logoFile: null,
            stampFile: null,
            corePhotos: [],
            dxfFiles: [],
            projectFile: null,
            scannedFiles: []
        };
    }
}

// Global API Tanımı
if (typeof window !== "undefined") {
    window.FolderBatchImporter = FolderBatchImporter;
}
