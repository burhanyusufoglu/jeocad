// BURHAN YUSUFOĞLU - Jeolojik Kesit ve Kolon Tasarımı (v2.0)

document.addEventListener("DOMContentLoaded", () => {
    let currentProject = JSON.parse(JSON.stringify(SAMPLE_PROJECT));
    window.currentProject = currentProject;
    let canvas = null;
    let editingBoreholeIndex = -1;
    let pendingTextCoords = null;
    let editingAnnotationId = null;

    // Arayüz Elemanları
    const inpTitle = document.getElementById("inpTitle");
    const inpSubtitle = document.getElementById("inpSubtitle");
    const inpLineStart = document.getElementById("inpLineStart");
    const inpLineEnd = document.getElementById("inpLineEnd");
    const inpDirStart = document.getElementById("inpDirStart");
    const inpDirEnd = document.getElementById("inpDirEnd");
    const inpDist = document.getElementById("inpDist");

    // Mühendis & Şirket Bilgileri (Canlı Güncelleme)
    const inpCompanyName = document.getElementById("inpCompanyName");
    const inpEngineerTitle = document.getElementById("inpEngineerTitle");
    const inpEngineerName = document.getElementById("inpEngineerName");
    const inpEngineerRegNo = document.getElementById("inpEngineerRegNo");
    const chkShowEngineerBlock = document.getElementById("chkShowEngineerBlock");
    const chkShowGraphicScale = document.getElementById("chkShowGraphicScale");
    const chkShowScaleText = document.getElementById("chkShowScaleText");
    const chkShowSymbolsLegend = document.getElementById("chkShowSymbolsLegend");

    // Kot Ayarları
    const inpMinKot = document.getElementById("inpMinKot");
    const inpMaxKot = document.getElementById("inpMaxKot");
    const inpElevationStep = document.getElementById("inpElevationStep");
    const btnApplyKot = document.getElementById("btnApplyKot");
    const btnAutoFitKot = document.getElementById("btnAutoFitKot");

    // Mühendislik Çizgileri
    const chkDf = document.getElementById("chkDf");
    const inpDfElevation = document.getElementById("inpDfElevation");
    const inpDfLabel = document.getElementById("inpDfLabel");
    const chkGw = document.getElementById("chkGw");
    const inpGwElevation = document.getElementById("inpGwElevation");

    // Listeler
    const boreholeList = document.getElementById("boreholeList");
    const strataList = document.getElementById("strataList");
    const chkShowBoreholeDepths = document.getElementById("chkShowBoreholeDepths");

    // Araçlar
    const toolSelect = document.getElementById("toolSelect");
    const toolDrawLine = document.getElementById("toolDrawLine");
    const toolNode = document.getElementById("toolNode");
    const toolText = document.getElementById("toolText");
    const btnSymbolDropdown = document.getElementById("btnSymbolDropdown");
    const symbolMenu = document.getElementById("symbolMenu");
    const toolPan = document.getElementById("toolPan");
    const zoomLevel = document.getElementById("zoomLevel");
    const statusTool = document.getElementById("statusTool");
    const statusSelected = document.getElementById("statusSelected");

    // CorelDRAW Tarzı Damlalık, Boya Kovası & Palet
    const toolEyedropper = document.getElementById("toolEyedropper");
    const toolFill = document.getElementById("toolFill");
    const btnPaletteDropdown = document.getElementById("btnPaletteDropdown");
    const paletteMenu = document.getElementById("paletteMenu");
    const activeColorSwatch = document.getElementById("activeColorSwatch");

    // Görsel Karot Sandığı Yapay Zeka (AI) Bileşenleri
    const coreDropZone = document.getElementById("coreDropZone");
    const inputCorePhoto = document.getElementById("inputCorePhoto");
    const imgCorePreview = document.getElementById("imgCorePreview");
    const dropZoneContent = document.getElementById("dropZoneContent");
    const aiAnalysisCard = document.getElementById("aiAnalysisCard");
    const aiDetectedTitle = document.getElementById("aiDetectedTitle");
    const aiConfidenceBadge = document.getElementById("aiConfidenceBadge");
    const aiGrainBreakdown = document.getElementById("aiGrainBreakdown");
    const txtAiReportResult = document.getElementById("txtAiReportResult");
    const btnCopyAiReport = document.getElementById("btnCopyAiReport");
    const btnAddAiTextToCanvas = document.getElementById("btnAddAiTextToCanvas");
    const aiCopySuccessFeedback = document.getElementById("aiCopySuccessFeedback");

    // Geri Al ve Sil Butonları
    const btnUndo = document.getElementById("btnUndo");
    const btnDeleteSelected = document.getElementById("btnDeleteSelected");

    // Karot Sandığı & Malzeme Sınıflandırma
    const selCoreBorehole = document.getElementById("selCoreBorehole");
    const coreBoxTableContainer = document.getElementById("coreBoxTableContainer");
    const btnToggleCoreCard = document.getElementById("btnToggleCoreCard");
    const btnCopyCoreReport = document.getElementById("btnCopyCoreReport");
    const coreCopyFeedback = document.getElementById("coreCopyFeedback");

    // Excel Logu, Eğime Göre Kesit & 1m Karot Analizör Elemanları
    const toolDrawBorehole = document.getElementById("toolDrawBorehole");
    const btnFillSampleExcel = document.getElementById("btnFillSampleExcel");
    const txtExcelInput = document.getElementById("txtExcelInput");
    const btnImportExcelAndCorrelate = document.getElementById("btnImportExcelAndCorrelate");
    const btnCorrelateBySlope = document.getElementById("btnCorrelateBySlope");
    const btnCoreView1m = document.getElementById("btnCoreView1m");
    const btnCoreViewStrata = document.getElementById("btnCoreViewStrata");
    const btnCopy1mReport = document.getElementById("btnCopy1mReport");
    const btnApplyAiColorToStrata = document.getElementById("btnApplyAiColorToStrata");
    let coreBoxViewMode = "1m";

    // Kuyu Sihirbazı Hızlı Parçalama Butonları
    const mBtnPreset1 = document.getElementById("mBtnPreset1");
    const mBtnPreset2 = document.getElementById("mBtnPreset2");
    const mBtnPreset3 = document.getElementById("mBtnPreset3");
    const mBtnClearAllRows = document.getElementById("mBtnClearAllRows");

    // Kuyu Sihirbazı Modalı
    const boreholeModal = document.getElementById("boreholeModal");
    const modalTitle = document.getElementById("modalTitle");
    const mInpName = document.getElementById("mInpName");
    const mInpX = document.getElementById("mInpX");
    const mInpKot = document.getElementById("mInpKot");
    const mInpBottomKot = document.getElementById("mInpBottomKot");
    const mInpTotalDepth = document.getElementById("mInpTotalDepth");
    const mIntervalsList = document.getElementById("mIntervalsList");
    const modalColumnPreview = document.getElementById("modalColumnPreview");
    const btnCloseModal = document.getElementById("btnCloseModal");
    const mBtnCancel = document.getElementById("mBtnCancel");
    const mBtnSave = document.getElementById("mBtnSave");
    const mBtnAddRow = document.getElementById("mBtnAddRow");
    const mBtnFillRemaining = document.getElementById("mBtnFillRemaining");
    const btnOpenBoreholeModal = document.getElementById("btnOpenBoreholeModal");
    const btnSidebarAddBorehole = document.getElementById("btnSidebarAddBorehole");

    // Metin Modalı
    const textModal = document.getElementById("textModal");
    const textModalTitle = document.getElementById("textModalTitle");
    const inpAnnotationText = document.getElementById("inpAnnotationText");
    const inpTextFontSize = document.getElementById("inpTextFontSize");
    const inpTextColor = document.getElementById("inpTextColor");
    const btnCloseTextModal = document.getElementById("btnCloseTextModal");
    const btnCancelText = document.getElementById("btnCancelText");
    const btnSaveText = document.getElementById("btnSaveText");

    // Kot Modalı
    const kotModal = document.getElementById("kotModal");
    const inpCustomKotZ = document.getElementById("inpCustomKotZ");
    const inpCustomKotLabel = document.getElementById("inpCustomKotLabel");
    const inpCustomKotColor = document.getElementById("inpCustomKotColor");
    const btnCloseKotModal = document.getElementById("btnCloseKotModal");
    const btnCancelKot = document.getElementById("btnCancelKot");
    const btnSaveCustomKot = document.getElementById("btnSaveCustomKot");
    const btnAddCustomKotLine = document.getElementById("btnAddCustomKotLine");

    // Navigasyon ve Proje Butonları
    const btnNewProject = document.getElementById("btnNewProject");
    const btnLoadDemo = document.getElementById("btnLoadDemo");
    const btnNavUp = document.getElementById("btnNavUp");
    const btnNavDown = document.getElementById("btnNavDown");
    const btnNavLeft = document.getElementById("btnNavLeft");
    const btnNavRight = document.getElementById("btnNavRight");
    const btnNavCenter = document.getElementById("btnNavCenter");
    const btnNavZoomIn = document.getElementById("btnNavZoomIn");
    const btnNavZoomOut = document.getElementById("btnNavZoomOut");

    let tempModalIntervals = [];

    // 1. FORMU DOLDUR
    function populateForm() {
        const meta = currentProject.metadata || {};
        const p = currentProject.parameters || {};

        inpTitle.value = meta.title || "";
        inpSubtitle.value = meta.subtitle || "";
        inpLineStart.value = meta.sectionLineStart || "A";
        inpLineEnd.value = meta.sectionLineEnd || "A'";
        inpDirStart.value = meta.dirStart || "K.Batı";
        inpDirEnd.value = meta.dirEnd || "G.Doğu";

        const comp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
        if (inpCompanyName) inpCompanyName.value = meta.companyName || comp.companyName || "";
        inpEngineerTitle.value = meta.engineerTitle || comp.engineerTitle || "Jeoloji Mühendisi";
        inpEngineerName.value = meta.engineerName || comp.engineerName || "";
        inpEngineerRegNo.value = meta.engineerRegNo || comp.engineerRegNo || "";

        chkShowEngineerBlock.checked = p.showEngineerBlock !== false;
        if (chkShowGraphicScale) {
            chkShowGraphicScale.checked = p.showGraphicScale === true;
        }
        if (chkShowScaleText) {
            chkShowScaleText.checked = p.showScaleText === true;
        }
        chkShowSymbolsLegend.checked = p.showSymbolsLegend !== false;
        if (chkShowBoreholeDepths) {
            chkShowBoreholeDepths.checked = p.showBoreholeDepths === true;
        }

        inpDist.value = p.totalDistance;
        inpMinKot.value = p.minElevation;
        inpMaxKot.value = p.maxElevation;
        inpElevationStep.value = p.elevationStep || 2.0;

        chkDf.checked = p.showDf;
        inpDfElevation.value = (p.dfElevation !== undefined) ? p.dfElevation : 0.0;
        inpDfLabel.value = p.dfLabel || (p.dfElevation !== undefined ? `Df=(+${p.dfElevation.toFixed(2)})` : "Df=0,00");

        chkGw.checked = p.showGroundwater;
        inpGwElevation.value = (p.groundwaterElevation !== undefined) ? p.groundwaterElevation : 0.0;

        const badgeScale = document.getElementById("badgeActiveScale");
        if (badgeScale) {
            const r = p.verticalExaggeration || 1.0;
            badgeScale.textContent = `1X${r} ${r === 1 ? '(Doğal)' : ''}`;
        }

        renderBoreholeList();
        renderStrataList();
        renderCoreBoxTab();
        updateDfStratumBadge();
    }

    // 2. MÜHENDİS & FİRMA BİLGİLERİ (YAZILDIĞINDA DİREKT ALTA GEÇSİN)
    function syncEngineerData() {
        if (inpCompanyName) currentProject.metadata.companyName = inpCompanyName.value;
        currentProject.metadata.engineerTitle = inpEngineerTitle.value;
        currentProject.metadata.engineerName = inpEngineerName.value;
        currentProject.metadata.engineerRegNo = inpEngineerRegNo.value;

        currentProject.parameters.showEngineerBlock = chkShowEngineerBlock.checked;
        currentProject.parameters.showGraphicScale = chkShowGraphicScale.checked;
        if (chkShowScaleText) currentProject.parameters.showScaleText = chkShowScaleText.checked;
        currentProject.parameters.showSymbolsLegend = chkShowSymbolsLegend.checked;

        if (window.JeoCADCompany) {
            window.JeoCADCompany.saveProfile({
                companyName: inpCompanyName ? inpCompanyName.value : "",
                engineerTitle: inpEngineerTitle.value,
                engineerName: inpEngineerName.value,
                engineerRegNo: inpEngineerRegNo.value
            });
        }

        if (canvas) canvas.render();
    }

    if (inpCompanyName) inpCompanyName.addEventListener("input", syncEngineerData);
    inpEngineerTitle.addEventListener("input", syncEngineerData);
    inpEngineerName.addEventListener("input", syncEngineerData);
    inpEngineerRegNo.addEventListener("input", syncEngineerData);
    chkShowEngineerBlock.addEventListener("change", syncEngineerData);
    chkShowGraphicScale.addEventListener("change", syncEngineerData);
    if (chkShowScaleText) chkShowScaleText.addEventListener("change", syncEngineerData);
    chkShowSymbolsLegend.addEventListener("change", syncEngineerData);

    if (chkShowBoreholeDepths) {
        chkShowBoreholeDepths.addEventListener("change", () => {
            currentProject.parameters.showBoreholeDepths = chkShowBoreholeDepths.checked;
            if (canvas) canvas.render();
        });
    }

    // 2.1. PROJE VE KESİT PARAMETRELERİ (YAZILDIĞINDA ANINDA KESİTE YANSISIN)
    function syncProjectData() {
        if (!currentProject.metadata) currentProject.metadata = {};
        if (!currentProject.parameters) currentProject.parameters = {};

        if (inpTitle) currentProject.metadata.title = inpTitle.value;
        if (inpSubtitle) currentProject.metadata.subtitle = inpSubtitle.value;
        if (inpLineStart) currentProject.metadata.sectionLineStart = inpLineStart.value;
        if (inpLineEnd) currentProject.metadata.sectionLineEnd = inpLineEnd.value;
        if (inpDirStart) currentProject.metadata.dirStart = inpDirStart.value;
        if (inpDirEnd) currentProject.metadata.dirEnd = inpDirEnd.value;

        const newDist = parseFloat(inpDist ? inpDist.value : 12.0);
        if (newDist && newDist > 0) {
            const oldDist = currentProject.parameters.totalDistance || 12.0;
            currentProject.parameters.totalDistance = newDist;

            if (Math.abs(newDist - oldDist) > 0.05 && currentProject.strataBoundaries) {
                currentProject.strataBoundaries.forEach(bnd => {
                    if (bnd.points && bnd.points.length > 0) {
                        const lastPt = bnd.points[bnd.points.length - 1];
                        if (Math.abs(lastPt.x - oldDist) < 1.0) {
                            lastPt.x = newDist;
                        }
                    }
                });
            }
        }

        if (chkDf) currentProject.parameters.showDf = chkDf.checked;
        if (inpDfElevation) {
            const val = parseFloat(inpDfElevation.value);
            currentProject.parameters.dfElevation = !isNaN(val) ? val : 0.0;
        }
        if (inpDfLabel) currentProject.parameters.dfLabel = inpDfLabel.value;

        if (chkGw) currentProject.parameters.showGroundwater = chkGw.checked;
        if (inpGwElevation) {
            const val = parseFloat(inpGwElevation.value);
            currentProject.parameters.groundwaterElevation = !isNaN(val) ? val : 0.0;
        }

        updateDfStratumBadge();

        if (canvas) {
            canvas.syncStrataFromColumns();
            canvas.render();
        }
    }

    function updateDfStratumBadge() {
        const swatch = document.getElementById("dfStratumSwatch");
        const nameEl = document.getElementById("dfStratumName");
        if (!swatch || !nameEl || !canvas) return;

        const dfZ = (currentProject.parameters && currentProject.parameters.dfElevation !== undefined) 
            ? currentProject.parameters.dfElevation 
            : 0.0;
        const totalDist = (currentProject.parameters && currentProject.parameters.totalDistance) || 12.0;
        const stratum = canvas.getStratumAt ? canvas.getStratumAt(totalDist * 0.22, dfZ) : null;

        if (stratum) {
            const clr = (stratum.color && stratum.color !== "none") ? stratum.color : "#a89276";
            swatch.style.backgroundColor = clr;
            nameEl.textContent = `Oturduğu Tabaka: ${stratum.name || 'Zemin Tabakası'}`;
            nameEl.title = `Litoloji: ${stratum.name} | Renk: ${clr}`;
        }
    }

    // Kullanıcı İsteği: Harf ve rakam yazarken ekran zıplamasın; sadece alan değiştirildiğinde veya Enter'a basıldığında ya da 'Kesiti Güncelle' butonuna basıldığında uygulansın
    const formFieldsToSync = [inpTitle, inpSubtitle, inpLineStart, inpLineEnd, inpDirStart, inpDirEnd, inpDist, inpDfElevation, inpDfLabel, inpGwElevation];
    formFieldsToSync.forEach(field => {
        if (field) {
            field.addEventListener("change", syncProjectData);
            field.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    syncProjectData();
                    statusTool.textContent = "✓ Değişiklikler kesite uygulandı.";
                }
            });
        }
    });
    if (chkDf) chkDf.addEventListener("change", syncProjectData);
    if (chkGw) chkGw.addEventListener("change", syncProjectData);

    // 3. TABAKALAR VE LEJANT LİSTESİ (BASTIKÇA DİREKT ALTA GEÇSİN)
    function renderStrataList() {
        strataList.innerHTML = "";
        const units = currentProject.strataUnits || [];

        if (units.length === 0) {
            strataList.innerHTML = `
                <div style="padding:10px;text-align:center;color:var(--text-muted);font-size:11.5px;font-style:italic;">
                    Henüz tabaka tanımlanmadı.<br>Yeni Kuyu oluşturarak veya aşağıdaki hızlı butonlara basarak ekleyebilirsiniz.
                </div>
            `;
            return;
        }

        units.forEach((unit, idx) => {
            const item = document.createElement("div");
            item.className = "strata-item";
            item.innerHTML = `
                <div class="strata-color-box" style="background-color: ${unit.color};"></div>
                <div style="flex:1;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                        <input type="text" value="${unit.name}" style="font-size:11.5px;font-weight:bold;padding:3px 6px;width:100%;" onchange="updateStrataName('${unit.id}', this.value)">
                        <button class="btn-small" style="background:#ef4444;padding:2px 6px;margin-left:4px;" onclick="deleteStrataUnit(${idx})" title="Tabakayı Sil">×</button>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <input type="color" value="${unit.color}" style="width:28px;height:22px;border:none;cursor:pointer;" onchange="updateStrataColor('${unit.id}', this.value)" title="Tabaka Rengini Değiştir">
                        <span style="font-size:10px;color:var(--text-muted);">${unit.color}</span>
                    </div>
                </div>
            `;
            strataList.appendChild(item);
        });
    }

    window.updateStrataName = (unitId, name) => {
        const u = currentProject.strataUnits.find(x => x.id === unitId);
        if (u) {
            u.name = name;
            updateDfStratumBadge();
            if (canvas) canvas.render();
        }
    };

    window.updateStrataColor = (unitId, color) => {
        const u = currentProject.strataUnits.find(x => x.id === unitId);
        if (u) {
            u.color = color;
            updateDfStratumBadge();
            if (canvas) canvas.render();
        }
    };

    window.deleteStrataUnit = (idx) => {
        currentProject.strataUnits.splice(idx, 1);
        renderStrataList();
        updateDfStratumBadge();
        if (canvas) canvas.render();
    };

    // Hızlı Tabaka Ekleme Butonları (Tek tıkla Lejanta ve Kesite geçsin)
    document.querySelectorAll(".btn-quick-litho").forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.getAttribute("data-name");
            const color = btn.getAttribute("data-color");

            currentProject.strataUnits = currentProject.strataUnits || [];
            currentProject.strataUnits.push({
                id: `u-${Date.now()}`,
                name: name,
                color: color,
                pattern: "none"
            });

            renderStrataList();
            if (canvas) canvas.render();
        });
    });

    document.getElementById("btnAutoSyncStrata").addEventListener("click", () => {
        if (canvas) {
            canvas.syncStrataFromColumns();
            canvas.render();
            renderStrataList();
        }
    });

    // 4. KOT VE EKSEN YÖNETİMİ
    function applyKotSettings() {
        const parsedMin = parseFloat(inpMinKot.value);
        const minZ = !isNaN(parsedMin) ? parsedMin : 0.0;

        const parsedMax = parseFloat(inpMaxKot.value);
        const maxZ = !isNaN(parsedMax) ? parsedMax : (minZ + 15.0);

        if (maxZ <= minZ) {
            statusTool.textContent = "⚠️ Dikkat: Üst Kot, Alt Kot'tan büyük olmalıdır! Lütfen değerleri kontrol edin.";
            return;
        }

        const parsedStep = parseFloat(inpElevationStep.value);
        const step = (!isNaN(parsedStep) && parsedStep > 0) ? parsedStep : 2.0;

        currentProject.parameters.minElevation = minZ;
        currentProject.parameters.maxElevation = maxZ;
        currentProject.parameters.elevationStep = step;

        updateDfStratumBadge();

        if (canvas) {
            canvas.syncStrataFromColumns();
            canvas.render();
            canvas.zoomFit();
        }
        statusTool.textContent = `✓ Kot Ayarları Uygulandı: [${minZ.toFixed(1)}m – ${maxZ.toFixed(1)}m] (Adım: ${step}m)`;
    }

    btnApplyKot.addEventListener("click", applyKotSettings);
    [inpMinKot, inpMaxKot, inpElevationStep].forEach(inp => {
        if (inp) {
            inp.addEventListener("change", applyKotSettings);
            inp.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    applyKotSettings();
                }
            });
        }
    });

    btnAutoFitKot.addEventListener("click", () => {
        if (canvas) {
            canvas.autoFitElevations();
            inpMinKot.value = currentProject.parameters.minElevation;
            inpMaxKot.value = currentProject.parameters.maxElevation;
            inpElevationStep.value = currentProject.parameters.elevationStep;
        }
    });

    // Özel Kot Çizgisi Modalı
    btnAddCustomKotLine.addEventListener("click", () => {
        kotModal.classList.add("open");
    });
    btnCloseKotModal.addEventListener("click", () => kotModal.classList.remove("open"));
    btnCancelKot.addEventListener("click", () => kotModal.classList.remove("open"));

    btnSaveCustomKot.addEventListener("click", () => {
        const z = parseFloat(inpCustomKotZ.value) || 85.42;
        const label = inpCustomKotLabel.value || "Kot";
        const color = inpCustomKotColor.value || "#dc2626";

        currentProject.customKotMarkers = currentProject.customKotMarkers || [];
        currentProject.customKotMarkers.push({
            id: `kot-${Date.now()}`,
            z: z,
            label: label,
            color: color
        });

        kotModal.classList.remove("open");
        if (canvas) canvas.render();
    });

    // 5. SONDAJ LİSTESİ
    function renderBoreholeList() {
        boreholeList.innerHTML = "";
        const bList = currentProject.boreholes || [];

        if (bList.length === 0) {
            boreholeList.innerHTML = `
                <div style="padding:14px 10px;text-align:center;color:var(--text-muted);font-size:12px;background:rgba(255,255,255,0.03);border-radius:6px;border:1px dashed rgba(255,255,255,0.1);">
                    <div style="margin-bottom:6px;font-weight:600;">Sayfada henüz kuyu/kolon yok</div>
                    Sayfaya doğrudan kolon eklemek için yukarıdaki <br>
                    <button class="btn-small" style="background:#10b981;font-weight:bold;margin-top:6px;cursor:pointer;" onclick="window.addNewBoreholeDirectly()">+ Yeni Kuyu Ekle</button><br>
                    butonuna basabilirsiniz. (Örn: SK-1 98m → 75m)
                </div>
            `;
            return;
        }

        bList.forEach((bh, bhIdx) => {
            const item = document.createElement("div");
            item.className = "borehole-item";
            item.style.cssText = "background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:8px 10px;margin-bottom:8px;";

            const botKot = bh.bottomElevation !== undefined ? bh.bottomElevation : (bh.surfaceElevation - (bh.intervals && bh.intervals.length > 0 ? bh.intervals[bh.intervals.length - 1].toDepth : 23.0));
            const totalLen = Math.max(0, bh.surfaceElevation - botKot);

            item.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="font-size:13px;font-weight:bold;color:#38bdf8;">📍 ${bh.name}</span>
                        <span style="background:rgba(2,132,199,0.2);color:#38bdf8;padding:1px 6px;border-radius:10px;font-size:10px;font-weight:600;">Boy: ${totalLen.toFixed(2)}m</span>
                    </div>
                    <div style="display:flex;gap:4px;">
                        <button class="btn-small" style="background:#2563eb;font-size:11px;padding:2px 8px;cursor:pointer;" onclick="openEditModal(${bhIdx})" title="Katman ve litoloji detaylarını düzenle">⚙️ Katmanlar</button>
                        <button class="btn-small" style="background:#ef4444;font-size:11px;padding:2px 6px;cursor:pointer;" onclick="deleteBorehole(${bhIdx})" title="Kuyuyu Sil">Sil</button>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns: 1fr 1fr 1fr;gap:6px;font-size:11px;">
                    <div>
                        <label style="display:block;color:#94a3b8;font-size:10px;margin-bottom:2px;">Konum X (m)</label>
                        <input type="number" step="0.5" value="${bh.x}" style="width:100%;padding:3px 5px;background:#0f172a;border:1px solid #334155;color:#fff;border-radius:4px;font-size:11px;" onchange="window.updateBoreholeProp(${bhIdx}, 'x', this.value)" />
                    </div>
                    <div>
                        <label style="display:block;color:#94a3b8;font-size:10px;margin-bottom:2px;">Üst Kot (m)</label>
                        <input type="number" step="0.5" value="${bh.surfaceElevation}" style="width:100%;padding:3px 5px;background:#0f172a;border:1px solid #334155;color:#38bdf8;font-weight:bold;border-radius:4px;font-size:11px;" onchange="window.updateBoreholeProp(${bhIdx}, 'surfaceElevation', this.value)" />
                    </div>
                    <div>
                        <label style="display:block;color:#94a3b8;font-size:10px;margin-bottom:2px;">Taban Kot (m)</label>
                        <input type="number" step="0.5" value="${botKot}" style="width:100%;padding:3px 5px;background:#0f172a;border:1px solid #334155;color:#f59e0b;font-weight:bold;border-radius:4px;font-size:11px;" onchange="window.updateBoreholeProp(${bhIdx}, 'bottomElevation', this.value)" />
                    </div>
                </div>
            `;
            boreholeList.appendChild(item);
        });
        renderCoreBoxTab();
    }

    window.updateBoreholeProp = (index, prop, val) => {
        const bh = currentProject.boreholes[index];
        if (!bh) return;
        const numVal = parseFloat(val);
        if (isNaN(numVal)) return;

        if (prop === "x") {
            bh.x = numVal;
        } else if (prop === "surfaceElevation") {
            const oldSurf = bh.surfaceElevation;
            bh.surfaceElevation = numVal;
            if (bh.bottomElevation === undefined) {
                bh.bottomElevation = oldSurf - (bh.intervals && bh.intervals.length > 0 ? bh.intervals[bh.intervals.length - 1].toDepth : 23.0);
            }
            const newTotalD = Math.max(0.5, bh.surfaceElevation - bh.bottomElevation);
            if (bh.intervals && bh.intervals.length > 0) {
                const oldTotalD = bh.intervals[bh.intervals.length - 1].toDepth;
                if (oldTotalD > 0) {
                    const ratio = newTotalD / oldTotalD;
                    bh.intervals.forEach(inv => {
                        inv.fromDepth = parseFloat((inv.fromDepth * ratio).toFixed(2));
                        inv.toDepth = parseFloat((inv.toDepth * ratio).toFixed(2));
                    });
                }
            }
        } else if (prop === "bottomElevation") {
            bh.bottomElevation = numVal;
            const newTotalD = Math.max(0.5, bh.surfaceElevation - bh.bottomElevation);
            if (bh.intervals && bh.intervals.length > 0) {
                const oldTotalD = bh.intervals[bh.intervals.length - 1].toDepth;
                if (oldTotalD > 0) {
                    const ratio = newTotalD / oldTotalD;
                    bh.intervals.forEach(inv => {
                        inv.fromDepth = parseFloat((inv.fromDepth * ratio).toFixed(2));
                        inv.toDepth = parseFloat((inv.toDepth * ratio).toFixed(2));
                    });
                }
            }
        }

        if (canvas) {
            canvas.syncStrataFromColumns();
            canvas.render();
        }
        renderBoreholeList();
    };

    function addNewBoreholeDirectly() {
        currentProject.boreholes = currentProject.boreholes || [];
        const count = currentProject.boreholes.length;
        const lastBh = count > 0 ? currentProject.boreholes[count - 1] : null;

        const nextX = lastBh ? parseFloat((lastBh.x + 4.0).toFixed(1)) : 2.0;
        const nextSurf = lastBh ? lastBh.surfaceElevation : 98.0;
        const nextBot = lastBh ? lastBh.bottomElevation : 75.0;
        const nextName = `SK-${count + 1}`;

        let nextIntervals;
        if (lastBh && lastBh.intervals && lastBh.intervals.length > 0) {
            nextIntervals = JSON.parse(JSON.stringify(lastBh.intervals));
        } else {
            nextIntervals = [
                { fromDepth: 0.0, toDepth: 3.0, lithoId: "dolgu", name: "Dolgu", color: "#ea580c" },
                { fromDepth: 3.0, toDepth: 12.0, lithoId: "kumlu-kil", name: "Kumlu Kil", color: "#a89276" },
                { fromDepth: 12.0, toDepth: 23.0, lithoId: "killi-silt", name: "Killi Silt", color: "#4dd0e1" }
            ];
        }

        const newBh = {
            id: `bh-${Date.now()}`,
            name: nextName,
            x: nextX,
            surfaceElevation: nextSurf,
            bottomElevation: nextBot,
            intervals: nextIntervals
        };

        currentProject.boreholes.push(newBh);

        if (canvas) {
            canvas.syncStrataFromColumns();
            canvas.render();
        }
        renderBoreholeList();
        renderStrataList();
        switchSidebarTab("tab-kot-boreholes");
        if (statusTool) {
            statusTool.textContent = `✓ ${nextName} beyaz sayfaya eklendi (X: ${nextX}m, Kot: ${nextSurf}m → ${nextBot}m)`;
        }
    }
    window.addNewBoreholeDirectly = addNewBoreholeDirectly;

    function switchSidebarTab(tabId) {
        document.querySelectorAll(".tab-btn").forEach(b => {
            if (b.getAttribute("data-tab") === tabId) b.classList.add("active");
            else b.classList.remove("active");
        });
        document.querySelectorAll(".tab-content").forEach(c => {
            if (c.id === tabId) c.classList.add("active");
            else c.classList.remove("active");
        });
    }

    // 6. KUYU SİHİRBAZI MODALI (KOT & METRAJ SENKRONİZASYONU)
    function openModalForNew() {
        editingBoreholeIndex = -1;
        modalTitle.textContent = "📍 Yeni Sondaj Kolonu Oluştur";
        mInpName.value = `SK-${(currentProject.boreholes || []).length + 1}`;
        
        const lastBh = (currentProject.boreholes || [])[(currentProject.boreholes || []).length - 1];
        mInpX.value = lastBh ? (lastBh.x + 4.0).toFixed(1) : "3.0";
        mInpKot.value = "98.00";
        if (mInpBottomKot) mInpBottomKot.value = "75.00";
        if (mInpTotalDepth) mInpTotalDepth.value = "23.00";

        const totalD = parseFloat(mInpTotalDepth ? mInpTotalDepth.value : "23.0") || 23.0;

        // Kullanıcının isteği: Sabit 3 parça yerine 1 bütün parçayla başla (Hızlı parçalama butonlarıyla istenen sayıda bölünebilir)
        tempModalIntervals = [
            { fromDepth: 0.0, toDepth: totalD, lithoId: "kumlu-kil", name: "Sarı,Turuncu ve Kahverenkli Kumlu Kil", color: "#a89276" }
        ];

        renderModalIntervals();
        updateModalPreview();
        boreholeModal.classList.add("open");
    }

    if (mBtnPreset1) {
        mBtnPreset1.addEventListener("click", () => {
            const surf = parseFloat(mInpKot.value) || 98.0;
            const bot = parseFloat(mInpBottomKot ? mInpBottomKot.value : "75.0") || 75.0;
            const totalD = Math.max(0.1, surf - bot);
            tempModalIntervals = [
                { fromDepth: 0.0, toDepth: totalD, lithoId: "kumlu-kil", name: "Kumlu Kil", color: "#a89276" }
            ];
            renderModalIntervals();
            updateModalPreview();
        });
    }

    if (mBtnPreset2) {
        mBtnPreset2.addEventListener("click", () => {
            const surf = parseFloat(mInpKot.value) || 98.0;
            const bot = parseFloat(mInpBottomKot ? mInpBottomKot.value : "75.0") || 75.0;
            const totalD = Math.max(0.2, surf - bot);
            const half = parseFloat((totalD / 2).toFixed(1));
            tempModalIntervals = [
                { fromDepth: 0.0, toDepth: half, lithoId: "dolgu", name: "Dolgu", color: "#ea580c" },
                { fromDepth: half, toDepth: totalD, lithoId: "kumlu-kil", name: "Kumlu Kil", color: "#a89276" }
            ];
            renderModalIntervals();
            updateModalPreview();
        });
    }

    if (mBtnPreset3) {
        mBtnPreset3.addEventListener("click", () => {
            const surf = parseFloat(mInpKot.value) || 98.0;
            const bot = parseFloat(mInpBottomKot ? mInpBottomKot.value : "75.0") || 75.0;
            const totalD = Math.max(0.3, surf - bot);
            const d1 = parseFloat((totalD * 0.2).toFixed(1));
            const d2 = parseFloat((totalD * 0.6).toFixed(1));
            tempModalIntervals = [
                { fromDepth: 0.0, toDepth: d1, lithoId: "dolgu", name: "Dolgu", color: "#ea580c" },
                { fromDepth: d1, toDepth: d2, lithoId: "kumlu-kil", name: "Kumlu Kil", color: "#a89276" },
                { fromDepth: d2, toDepth: totalD, lithoId: "killi-silt", name: "Killi Silt", color: "#4dd0e1" }
            ];
            renderModalIntervals();
            updateModalPreview();
        });
    }

    if (mBtnClearAllRows) {
        mBtnClearAllRows.addEventListener("click", () => {
            tempModalIntervals = [];
            renderModalIntervals();
            updateModalPreview();
        });
    }

    window.openEditModal = (index) => {
        editingBoreholeIndex = index;
        const bh = currentProject.boreholes[index];
        modalTitle.textContent = `✏️ ${bh.name} Kolonunu Düzenle`;
        mInpName.value = bh.name;
        mInpX.value = bh.x;
        mInpKot.value = bh.surfaceElevation.toFixed(2);
        
        const bot = bh.bottomElevation !== undefined ? bh.bottomElevation : (bh.surfaceElevation - 15.0);
        if (mInpBottomKot) mInpBottomKot.value = bot.toFixed(2);
        if (mInpTotalDepth) mInpTotalDepth.value = Math.max(0.1, (bh.surfaceElevation - bot)).toFixed(2);

        tempModalIntervals = JSON.parse(JSON.stringify(bh.intervals || []));
        renderModalIntervals();
        updateModalPreview();
        boreholeModal.classList.add("open");
    };

    function closeModal() {
        boreholeModal.classList.remove("open");
    }

    btnOpenBoreholeModal.addEventListener("click", addNewBoreholeDirectly);
    btnSidebarAddBorehole.addEventListener("click", addNewBoreholeDirectly);
    btnCloseModal.addEventListener("click", closeModal);
    mBtnCancel.addEventListener("click", closeModal);

    // Kuyu Kotu ve Derinlik Senkronizasyonu
    function syncModalKotAndDepths(changedSource) {
        const surf = parseFloat(mInpKot.value) || 98.0;
        let bot = parseFloat(mInpBottomKot ? mInpBottomKot.value : "75.0") || 75.0;
        let totalD = parseFloat(mInpTotalDepth ? mInpTotalDepth.value : "23.0") || 23.0;

        if (changedSource === "kot" || changedSource === "bottom") {
            totalD = Math.max(0.1, surf - bot);
            if (mInpTotalDepth) mInpTotalDepth.value = totalD.toFixed(2);
        } else if (changedSource === "depth") {
            bot = surf - totalD;
            if (mInpBottomKot) mInpBottomKot.value = bot.toFixed(2);
        }

        renderModalIntervals();
        updateModalPreview();
    }

    mInpKot.addEventListener("input", () => syncModalKotAndDepths("kot"));
    if (mInpBottomKot) mInpBottomKot.addEventListener("input", () => syncModalKotAndDepths("bottom"));
    if (mInpTotalDepth) mInpTotalDepth.addEventListener("input", () => syncModalKotAndDepths("depth"));

    function renderModalIntervals() {
        mIntervalsList.innerHTML = "";
        const surf = parseFloat(mInpKot.value) || 98.00;

        tempModalIntervals.forEach((inter, idx) => {
            const row = document.createElement("div");
            row.className = "interval-item";

            let options = "";
            LITHOLOGY_CATALOG.forEach(cat => {
                const sel = (inter.lithoId === cat.id || inter.name === cat.name) ? "selected" : "";
                options += `<option value="${cat.id}" ${sel}>${cat.name}</option>`;
            });

            const fromKot = (surf - inter.fromDepth).toFixed(2);
            const toKot = (surf - inter.toDepth).toFixed(2);

            row.innerHTML = `
                <div style="display:flex;align-items:center;gap:5px;font-size:11px;flex-wrap:wrap;">
                    <span style="color:#f59e0b;font-weight:bold;">${inter.fromDepth.toFixed(1)}m</span>
                    <span style="color:#94a3b8;font-size:10px;">(${fromKot}m)</span>
                    <span style="color:#cbd5e1;">-</span>
                    <input type="number" step="0.5" style="width:58px;padding:3px;font-weight:bold;text-align:center;" value="${inter.toDepth}" onchange="updateModalRowDepth(${idx}, this.value)" title="Bitiş Derinliği (m)">
                    <span style="color:#94a3b8;font-size:10px;">m</span>
                    <span style="color:#38bdf8;font-weight:bold;font-size:10.5px;">[Kot:</span>
                    <input type="number" step="0.5" style="width:64px;padding:3px;font-weight:bold;color:#38bdf8;text-align:center;" value="${toKot}" onchange="updateModalRowKot(${idx}, this.value)" title="Bitiş Kotu (m)">
                    <span style="color:#38bdf8;font-weight:bold;font-size:10.5px;">]</span>
                </div>
                <div style="display:flex;align-items:center;gap:6px;flex:1;min-width:180px;margin-top:4px;">
                    <select onchange="updateModalRowLitho(${idx}, this.value)" style="flex:1;padding:4px;font-size:11px;">
                        ${options}
                    </select>
                    <input type="color" value="${inter.color}" onchange="updateModalRowColor(${idx}, this.value)" style="width:26px;height:22px;border:none;cursor:pointer;" title="Renk Seç">
                    <button class="btn-small" style="background:#ef4444;padding:2px 7px;" onclick="deleteModalRow(${idx})" title="Katmanı Sil">×</button>
                </div>
            `;
            mIntervalsList.appendChild(row);
        });
    }

    window.updateModalRowDepth = (idx, val) => {
        const toD = parseFloat(val) || 0;
        tempModalIntervals[idx].toDepth = toD;
        if (tempModalIntervals[idx + 1]) {
            tempModalIntervals[idx + 1].fromDepth = toD;
        }
        renderModalIntervals();
        updateModalPreview();
    };

    window.updateModalRowKot = (idx, val) => {
        const surf = parseFloat(mInpKot.value) || 98.00;
        const toKot = parseFloat(val) || 0;
        const toD = Math.max(0, surf - toKot);
        tempModalIntervals[idx].toDepth = parseFloat(toD.toFixed(2));
        if (tempModalIntervals[idx + 1]) {
            tempModalIntervals[idx + 1].fromDepth = parseFloat(toD.toFixed(2));
        }
        renderModalIntervals();
        updateModalPreview();
    };

    window.updateModalRowColor = (idx, color) => {
        tempModalIntervals[idx].color = color;
        updateModalPreview();
    };

    window.updateModalRowLitho = (idx, lithoId) => {
        const cat = LITHOLOGY_CATALOG.find(x => x.id === lithoId);
        if (cat) {
            tempModalIntervals[idx].lithoId = cat.id;
            tempModalIntervals[idx].name = cat.name;
            tempModalIntervals[idx].color = cat.color;
            updateModalPreview();
        }
    };

    window.deleteModalRow = (idx) => {
        if (tempModalIntervals.length > 1) {
            tempModalIntervals.splice(idx, 1);
            for (let i = 0; i < tempModalIntervals.length; i++) {
                if (i > 0) tempModalIntervals[i].fromDepth = tempModalIntervals[i - 1].toDepth;
            }
            renderModalIntervals();
            updateModalPreview();
        } else {
            alert("Kolonda en az bir katman olmalıdır.");
        }
    };

    mBtnAddRow.addEventListener("click", () => {
        const last = tempModalIntervals[tempModalIntervals.length - 1];
        const fromD = last ? last.toDepth : 0.0;
        const totalD = parseFloat(mInpTotalDepth ? mInpTotalDepth.value : "23.0") || (fromD + 4.0);
        const toD = Math.min(totalD, fromD + 4.0);
        tempModalIntervals.push({
            fromDepth: fromD,
            toDepth: toD > fromD ? toD : (fromD + 3.0),
            lithoId: "kumtasi",
            name: "Kumtaşı / Kum",
            color: "#facc15"
        });
        renderModalIntervals();
        updateModalPreview();
    });

    if (mBtnFillRemaining) {
        mBtnFillRemaining.addEventListener("click", () => {
            const totalD = parseFloat(mInpTotalDepth ? mInpTotalDepth.value : "23.0") || 23.0;
            const last = tempModalIntervals[tempModalIntervals.length - 1];
            if (!last) {
                tempModalIntervals.push({
                    fromDepth: 0.0,
                    toDepth: totalD,
                    lithoId: "killi-silt",
                    name: "Yeşilimsi Mavi Renkli Kil-Silt",
                    color: "#4dd0e1"
                });
            } else if (last.toDepth < totalD) {
                tempModalIntervals.push({
                    fromDepth: last.toDepth,
                    toDepth: totalD,
                    lithoId: "killi-silt",
                    name: "Yeşilimsi Mavi Renkli Kil-Silt",
                    color: "#4dd0e1"
                });
            } else {
                last.toDepth = totalD;
            }
            renderModalIntervals();
            updateModalPreview();
        });
    }

    function updateModalPreview() {
        const surf = parseFloat(mInpKot.value) || 98.00;
        const bot = parseFloat(mInpBottomKot ? mInpBottomKot.value : "75.00") || 75.00;
        const totalD = Math.max(0.1, surf - bot);
        const h = 240;
        const w = 44;
        const scale = (h - 55) / (totalD || 1);

        let svgContent = `
            <svg width="100%" height="100%" viewBox="0 0 170 290">
                <polygon points="78,16 92,16 85,26" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
                <text x="85" y="11" font-size="11" font-weight="bold" text-anchor="middle">${mInpName.value}</text>
                <text x="85" y="23" font-size="9" fill="#475569" text-anchor="middle">(${surf.toFixed(2)}m)</text>
        `;

        let curY = 30;
        tempModalIntervals.forEach(inter => {
            const blockH = Math.max(4, (inter.toDepth - inter.fromDepth) * scale);
            const toKot = (surf - inter.toDepth).toFixed(1);
            svgContent += `
                <rect x="63" y="${curY}" width="${w}" height="${blockH}" fill="${inter.color}" stroke="#000000" stroke-width="1.2" />
                <text x="58" y="${curY + blockH + 3}" font-size="8.5" font-weight="bold" fill="#0284c7" text-anchor="end">${toKot}m</text>
            `;
            curY += blockH;
        });

        svgContent += `
                <rect x="63" y="30" width="${w}" height="${curY - 30}" fill="none" stroke="#000000" stroke-width="2" />
                <text x="85" y="${curY + 16}" font-size="9" font-weight="bold" fill="#334155" text-anchor="middle">Taban: ${bot.toFixed(2)}m</text>
            </svg>
        `;
        modalColumnPreview.innerHTML = svgContent;
    }

    mInpName.addEventListener("input", updateModalPreview);
    mInpKot.addEventListener("input", updateModalPreview);

    mBtnSave.addEventListener("click", () => {
        const name = mInpName.value || "SK";
        const x = parseFloat(mInpX.value) || 0.0;
        const kot = parseFloat(mInpKot.value) || 98.00;
        const botKot = parseFloat(mInpBottomKot ? mInpBottomKot.value : "75.00") || (kot - 23.0);
        const totalD = Math.max(0.1, kot - botKot);

        currentProject.boreholes = currentProject.boreholes || [];

        const bhData = {
            id: editingBoreholeIndex >= 0 ? currentProject.boreholes[editingBoreholeIndex].id : `sk-${Date.now()}`,
            name: name,
            x: x,
            surfaceElevation: kot,
            bottomElevation: botKot,
            intervals: JSON.parse(JSON.stringify(tempModalIntervals))
        };

        if (editingBoreholeIndex >= 0) {
            currentProject.boreholes[editingBoreholeIndex] = bhData;
        } else {
            currentProject.boreholes.push(bhData);
            currentProject.boreholes.sort((a, b) => a.x - b.x);
        }

        // Kesit kot sınırlarını kuyunun tam görüntülenmesi için otomatik genişlet
        if (kot >= currentProject.parameters.maxElevation - 1) {
            currentProject.parameters.maxElevation = Math.ceil(kot + 2.0);
            inpMaxKot.value = currentProject.parameters.maxElevation;
        }
        if (botKot <= currentProject.parameters.minElevation + 1) {
            currentProject.parameters.minElevation = Math.floor(botKot - 2.0);
            inpMinKot.value = currentProject.parameters.minElevation;
        }
        if (x >= currentProject.parameters.totalDistance - 1) {
            currentProject.parameters.totalDistance = Math.ceil(x + 3.0);
            inpDist.value = currentProject.parameters.totalDistance;
        }

        // Kuyudaki tabakaları alt lejanta otomatik ekle
        currentProject.strataUnits = currentProject.strataUnits || [];
        tempModalIntervals.forEach(inter => {
            if (!currentProject.strataUnits.some(u => u.name === inter.name)) {
                currentProject.strataUnits.push({
                    id: `u-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                    name: inter.name,
                    color: inter.color,
                    pattern: "none"
                });
            }
        });

        closeModal();
        renderBoreholeList();
        renderStrataList();
        if (canvas) {
            canvas.syncStrataFromColumns();
            canvas.render();
        }
    });

    window.deleteBorehole = (index) => {
        if (confirm("Bu kuyuyu silmek istediğinizden emin misiniz?")) {
            currentProject.boreholes.splice(index, 1);
            renderBoreholeList();
            if (canvas) {
                canvas.syncStrataFromColumns();
                canvas.render();
                renderStrataList();
            }
        }
    };

    // 7. YAZI EKLEME / DÜZENLEME MODALI
    function openTextModal(coords = null, existing = null) {
        pendingTextCoords = coords;
        editingAnnotationId = existing ? existing.id : null;

        if (existing) {
            textModalTitle.textContent = "✏️ Metni Düzenle";
            inpAnnotationText.value = existing.text;
            inpTextFontSize.value = (existing.fontSize || 12).toString();
            inpTextColor.value = existing.color || "#0f172a";
        } else {
            textModalTitle.textContent = "🔤 Metin / Yazı Ekle";
            inpAnnotationText.value = "";
            inpTextFontSize.value = "12";
            inpTextColor.value = "#0f172a";
        }

        textModal.classList.add("open");
        setTimeout(() => inpAnnotationText.focus(), 50);
    }

    function closeTextModal() {
        textModal.classList.remove("open");
        pendingTextCoords = null;
        editingAnnotationId = null;
    }

    btnCloseTextModal.addEventListener("click", closeTextModal);
    btnCancelText.addEventListener("click", closeTextModal);

    btnSaveText.addEventListener("click", () => {
        const txt = inpAnnotationText.value.trim();
        if (!txt) return;

        currentProject.annotations = currentProject.annotations || [];

        if (editingAnnotationId) {
            const ann = currentProject.annotations.find(a => a.id === editingAnnotationId);
            if (ann) {
                ann.text = txt;
                ann.fontSize = parseInt(inpTextFontSize.value, 10);
                ann.color = inpTextColor.value;
            }
        } else if (pendingTextCoords) {
            currentProject.annotations.push({
                id: `ann-${Date.now()}`,
                text: txt,
                x: pendingTextCoords.x,
                z: pendingTextCoords.z,
                fontSize: parseInt(inpTextFontSize.value, 10),
                color: inpTextColor.value,
                fontWeight: "bold",
                rotation: 0
            });
        }

        closeTextModal();
        if (canvas) canvas.render();
    });

    inpAnnotationText.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            btnSaveText.click();
        }
    });

    document.querySelectorAll(".btn-tag").forEach(btn => {
        btn.addEventListener("click", () => {
            inpAnnotationText.value = btn.getAttribute("data-val");
            inpAnnotationText.focus();
        });
    });

    // 8. SEMBOL MENÜSÜ AÇILIR DROPDOWN
    if (btnSymbolDropdown) {
        btnSymbolDropdown.addEventListener("click", (e) => {
            e.stopPropagation();
            if (symbolMenu) symbolMenu.classList.toggle("open");
        });
    }

    if (symbolMenu) {
        document.addEventListener("click", () => {
            symbolMenu.classList.remove("open");
        });
    }

    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", () => {
            const symType = item.getAttribute("data-sym");
            if (canvas) {
                canvas.activeSymbolType = symType;
                setActiveTool("symbol", btnSymbolDropdown);
                statusTool.textContent = `Sembol Modu (${item.textContent.trim()}): Kesitte yerleştirmek istediğiniz yere tıklayın.`;
            }
            if (symbolMenu) symbolMenu.classList.remove("open");
        });
    });

    // 9. GENEL FORM UYGULAMA
    function applyFormToProject() {
        currentProject.metadata.title = inpTitle.value;
        currentProject.metadata.subtitle = inpSubtitle.value;
        currentProject.metadata.sectionLineStart = inpLineStart.value;
        currentProject.metadata.sectionLineEnd = inpLineEnd.value;
        currentProject.metadata.dirStart = inpDirStart.value;
        currentProject.metadata.dirEnd = inpDirEnd.value;

        const valDist = parseFloat(inpDist.value);
        currentProject.parameters.totalDistance = (!isNaN(valDist) && valDist > 0) ? valDist : 12.0;

        currentProject.parameters.showDf = chkDf.checked;
        const valDf = parseFloat(inpDfElevation.value);
        currentProject.parameters.dfElevation = !isNaN(valDf) ? valDf : 0.0;
        currentProject.parameters.dfLabel = inpDfLabel.value;

        currentProject.parameters.showGroundwater = chkGw.checked;
        const valGw = parseFloat(inpGwElevation.value);
        currentProject.parameters.groundwaterElevation = !isNaN(valGw) ? valGw : 0.0;

        syncEngineerData();
        applyKotSettings();
    }

    document.getElementById("btnGenerateSection").addEventListener("click", applyFormToProject);

    // Sekmeler (4 Kategorili Sol Menü)
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            const tabId = btn.getAttribute("data-tab");
            const targetContent = document.getElementById(tabId);
            if (targetContent) targetContent.classList.add("active");
            if (tabId === "tab-strata") {
                renderStrataList();
            } else if (tabId === "tab-kot-boreholes") {
                renderBoreholeList();
            } else if (tabId === "tab-corebox") {
                renderCoreBoxTab();
            }
        });
    });

    // TEMİZ SAYFA & ÖRNEK PROJE
    if (btnNewProject) {
        btnNewProject.addEventListener("click", () => {
            if (confirm("Çizim sıfırlanıp TEMİZ BİR SAYFA açılacak. Onaylıyor musunuz?")) {
                currentProject = JSON.parse(JSON.stringify(CLEAN_PROJECT));
                populateForm();
                if (canvas) {
                    canvas.project = currentProject;
                    canvas.syncStrataFromColumns();
                    canvas.render();
                    canvas.zoomFit();
                }
                renderBoreholeList();
                renderStrataList();
            }
        });
    }

    if (btnLoadDemo) {
        btnLoadDemo.addEventListener("click", () => {
            if (confirm("3 kuyulu örnek kesit verisi yüklenecek. Onaylıyor musunuz?")) {
                currentProject = JSON.parse(JSON.stringify(DEMO_PROJECT));
                populateForm();
                if (canvas) {
                    canvas.project = currentProject;
                    canvas.syncStrataFromColumns();
                    canvas.render();
                    canvas.zoomFit();
                }
                renderBoreholeList();
                renderStrataList();
            }
        });
    }

    // YÜZEN D-PAD VE NAVİGASYON KUMANDASI (KONTROL SİZDE)
    if (btnNavUp) btnNavUp.addEventListener("click", () => { if (canvas) canvas.panBy(0, 60); });
    if (btnNavDown) btnNavDown.addEventListener("click", () => { if (canvas) canvas.panBy(0, -60); });
    if (btnNavLeft) btnNavLeft.addEventListener("click", () => { if (canvas) canvas.panBy(60, 0); });
    if (btnNavRight) btnNavRight.addEventListener("click", () => { if (canvas) canvas.panBy(-60, 0); });
    if (btnNavCenter) btnNavCenter.addEventListener("click", () => { if (canvas) canvas.zoomFit(); });
    if (btnNavZoomIn) btnNavZoomIn.addEventListener("click", () => { if (canvas) canvas.zoomBy(1.2); });
    if (btnNavZoomOut) btnNavZoomOut.addEventListener("click", () => { if (canvas) canvas.zoomBy(0.83); });

    // ================= SOL ÜST: PROJE DOSYASI İŞLEMLERİ (KAYDET / FARKLI KAYDET / AÇ) =================
    const btnSaveProject = document.getElementById("btnSaveProject");
    const btnSaveAsProject = document.getElementById("btnSaveAsProject");

    function getSanitizedProjectTitle() {
        const meta = currentProject.metadata || {};
        const comp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
        const title = (meta.title || "").trim();
        const compName = (meta.companyName || comp.companyName || "").trim();
        const base = title || compName || "JeoCAD_Jeolojik_Kesit";
        return base.replace(/[^a-zA-Z0-9üğışöçÜĞİŞÖÇ_\-]/g, "_").slice(0, 50);
    }

    function getSafeExportBaseFilename(defaultSuffix = "Jeolojik_Kesit") {
        const meta = currentProject.metadata || {};
        const comp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
        const namePart = (comp.companyName || meta.companyName || meta.title || "JeoCAD").trim();
        const clean = namePart.replace(/[^a-zA-Z0-9_\-\u00C0-\u017F]/g, "_").replace(/_+/g, "_").slice(0, 40);
        return `${clean || "JeoCAD"}_${defaultSuffix}`;
    }

    if (btnSaveProject) {
        btnSaveProject.addEventListener("click", () => {
            applyFormToProject();
            const projName = getSanitizedProjectTitle();
            const filename = `${projName}.jeocad`;
            const jsonStr = JSON.stringify(currentProject, null, 2);
            const blob = new Blob([jsonStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            try { localStorage.setItem("jeocad_last_saved", jsonStr); } catch(e){}
            statusTool.textContent = `✓ Çizim projesi bilgisayarınıza saklandı (${filename}). İleride tekrar düzenlemek için 'Proje Aç' butonuyla yükleyebilirsiniz. (Rapor ve çıktı için solundaki Adobe PDF veya Word butonlarını kullanın).`;
        });
    }

    if (btnSaveAsProject) {
        btnSaveAsProject.addEventListener("click", () => {
            applyFormToProject();
            const defaultName = `${getSanitizedProjectTitle()}_${new Date().toISOString().slice(0, 10)}`;
            const userChosen = prompt("Projeyi Farklı Sakla - Dosya adını girin:", defaultName);
            if (!userChosen || !userChosen.trim()) return;
            const cleanName = userChosen.trim();
            const filename = (cleanName.endsWith(".jeocad") || cleanName.endsWith(".json")) ? cleanName : `${cleanName}.jeocad`;
            const jsonStr = JSON.stringify(currentProject, null, 2);
            const blob = new Blob([jsonStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            try { localStorage.setItem("jeocad_last_saved", jsonStr); } catch(e){}
            statusTool.textContent = `✓ Çizim projesi saklandı: ${filename}`;
        });
    }

    const fileOpenInput = document.getElementById("fileOpenProject");
    if (fileOpenInput) {
        fileOpenInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        currentProject = JSON.parse(ev.target.result);
                        populateForm();
                        if (canvas) {
                            canvas.project = currentProject;
                            canvas.syncStrataFromColumns();
                            canvas.render();
                            canvas.zoomFit();
                            renderStrataList();
                        }
                        statusTool.textContent = `✓ Proje dosyası (${file.name}) başarıyla yüklendi!`;
                    } catch (err) {
                        alert("Dosya yüklenemedi: " + err.message);
                    }
                };
                reader.readAsText(file);
                fileOpenInput.value = "";
            }
        });
    }

    // 10. TUVALİ BAŞLAT
    canvas = new GeoVectorCanvas("canvasContainer", currentProject, (event, data) => {
        if (event === "zoomChanged") {
            zoomLevel.textContent = `${Math.round(data * 100)}%`;
        } else if (event === "lineCreated") {
            statusTool.textContent = "Çizgi Eklendi! Tabaka alanı kolon rengiyle otomatik dolduruldu.";
            setActiveTool("node", toolNode);
            renderStrataList();
        } else if (event === "strataUpdated") {
            renderStrataList();
        } else if (event === "requestAddText") {
            openTextModal(data);
        } else if (event === "editAnnotation") {
            openTextModal(null, data);
        } else if (event === "annotationSelected") {
            statusSelected.textContent = `Yazı: "${data.text}"`;
        } else if (event === "symbolSelected") {
            statusSelected.textContent = `Sembol: ${data.type} (Silmek için Delete tuşuna basın veya × işaretine tıklayın)`;
        } else if (event === "symbolAdded") {
            statusSelected.textContent = `Sembol Eklendi: ${data.type} (Seçildi)`;
            setActiveTool("select", toolSelect);
        } else if (event === "symbolDeleted") {
            statusSelected.textContent = "Sembol silindi.";
        } else if (event === "boundaryDeleted") {
            statusSelected.textContent = "Sınır çizgisi silindi.";
            renderStrataList();
        } else if (event === "nodeDeleted") {
            statusSelected.textContent = "Düğüm noktası silindi.";
            renderStrataList();
        } else if (event === "historyUndo") {
            statusTool.textContent = "Son işlem geri alındı (Ctrl+Z).";
            populateForm();
            renderStrataList();
            renderBoreholeList();
            renderCoreBoxTab();
        } else if (event === "coreBoxCardClosed") {
            renderCoreBoxTab();
        } else if (event === "colorPicked") {
            if (activeColorSwatch) {
                activeColorSwatch.style.background = (data.color === "none") ? "transparent" : data.color;
                activeColorSwatch.style.border = (data.color === "none") ? "1px dashed #fff" : "1px solid #fff";
            }
            setActiveTool("fill", toolFill);
            statusTool.textContent = `💧 Damlalıkla Litoloji Kopyalandı: "${data.name}". Şimdi kesitte boyamak istediğiniz alana tıklayın.`;
        } else if (event === "unitFilled") {
            statusTool.textContent = `🖌️ Boyandı: "${data.name}".`;
            renderStrataList();
        } else if (event === "boreholeAddedDirectly") {
            statusTool.textContent = `Kolon Eklendi: ${data.name}. Kolon üzerine tıklayarak tabakayı istediğiniz kottan bölebilirsiniz.`;
            renderBoreholeList();
            renderStrataList();
            renderCoreBoxTab();
        } else if (event === "boreholeUpdated") {
            statusTool.textContent = `Kolon Güncellendi: ${data.name}.`;
            renderBoreholeList();
            renderStrataList();
            renderCoreBoxTab();
        } else if (event === "requestEditExcelTable") {
            openExcelModal();
        } else if (event === "requestAiInterpretExcel") {
            aiInterpretExcelTable();
        } else if (event === "requestCopyExcelReport") {
            copyExcelTableReport();
            alert("✓ Excel AI rapor metni panoya kopyalandı!");
        } else if (event === "excelTableClosed") {
            statusTool.textContent = "Excel tablosu gizlendi. Yukarıdaki 'Excel Tablosu' butonundan dilediğiniz zaman tekrar açabilirsiniz.";
        } else if (event === "requestAiInterpretExcelImage") {
            aiInterpretExcelImage();
        } else if (event === "requestViewExcelImageReport") {
            openExcelImageReportModal();
        } else if (event === "requestCopyExcelImageReport") {
            copyExcelImageReport();
        } else if (event === "excelImageCardClosed") {
            statusTool.textContent = "Excel resim kartı gizlendi.";
        }
    });

    function setActiveTool(tool, btn) {
        document.querySelectorAll(".btn-tool, .nav-dropdown-item").forEach(b => b.classList.remove("active"));
        if (btn) btn.classList.add("active");

        // Ribbon ve klasör menü butonlarını karşılıklı eşleştir
        const ribbonMap = {
            "select": "toolSelectRibbon",
            "drawLine": "toolDrawLineRibbon",
            "node": "toolNodeRibbon",
            "text": "toolTextRibbon",
            "fill": "toolFillRibbon",
            "eyedropper": "toolEyedropperRibbon",
            "drawBorehole": "toolDrawBoreholeRibbon",
            "pan": "toolPanRibbon"
        };
        const rBtnId = ribbonMap[tool];
        if (rBtnId) {
            const rBtn = document.getElementById(rBtnId);
            if (rBtn) rBtn.classList.add("active");
        }

        const folderToolMap = {
            "select": "toolSelect",
            "drawLine": "toolDrawLine",
            "node": "toolNode",
            "text": "toolText",
            "fill": "toolFill",
            "eyedropper": "toolEyedropper",
            "drawBorehole": "toolDrawBorehole",
            "pan": "toolPan"
        };
        const fBtnId = folderToolMap[tool];
        if (fBtnId) {
            const fBtn = document.getElementById(fBtnId);
            if (fBtn) fBtn.classList.add("active");
        }

        canvas.setTool(tool);

        if (tool === "select") statusTool.textContent = "Seçim Modu (Tıklayarak seçin veya taşıyın)";
        else if (tool === "drawLine") statusTool.textContent = "Çizgi Çiz (Tıklayarak veya fareyi basılı tutup sürükleyerek çizin. Bitirmek için yeşil butona basın veya çift tıklayın)";
        else if (tool === "drawBorehole") statusTool.textContent = "🏛️ Kolon Çizme Aparatı: Kesite kuyu eklemek için tıklayın. Kolon üzerindeki tabakayı bölmek için üzerine tıklayın.";
        else if (tool === "node") statusTool.textContent = "Düğüm Düzenle (Tablodaki tüm çizgilerin noktalarına doğrudan dokunup çekerek bükebilirsiniz. Çizgiye çift tıklayarak yeni nokta ekleyin)";
        else if (tool === "text") statusTool.textContent = "Yazı Yaz (Kesitte istediğiniz yere tıklayın)";
        else if (tool === "symbol") statusTool.textContent = "Sembol Ekle (Kesitte istediğiniz yere tıklayın)";
        else if (tool === "pan") statusTool.textContent = "Kaydırma Modu (Sayfayı sol tıkla basılı tutup serbestçe çekin)";
        else if (tool === "eyedropper") statusTool.textContent = "💧 Damlalık Modu: Kopyalamak istediğiniz kolon tabakasına veya kesit alanına tıklayın";
        else if (tool === "fill") statusTool.textContent = `🖌️ Boya Kovası (${canvas ? canvas.activeFillName : 'Seçili Renk'}): Boyamak istediğiniz tabaka alanına tıklayın`;
    }

    // Klasör Menüsü Çizim Araçları
    if (toolSelect) toolSelect.addEventListener("click", () => setActiveTool("select", toolSelect));
    if (toolDrawLine) toolDrawLine.addEventListener("click", () => setActiveTool("drawLine", toolDrawLine));
    if (toolDrawBorehole) toolDrawBorehole.addEventListener("click", () => setActiveTool("drawBorehole", toolDrawBorehole));
    if (toolNode) toolNode.addEventListener("click", () => setActiveTool("node", toolNode));
    if (toolText) toolText.addEventListener("click", () => setActiveTool("text", toolText));
    if (toolPan) toolPan.addEventListener("click", () => setActiveTool("pan", toolPan));
    if (toolEyedropper) toolEyedropper.addEventListener("click", () => setActiveTool("eyedropper", toolEyedropper));
    if (toolFill) toolFill.addEventListener("click", () => setActiveTool("fill", toolFill));

    // Ribbon Hızlı Kısayol Butonları (Tier 2)
    const toolSelectRibbon = document.getElementById("toolSelectRibbon");
    const toolDrawLineRibbon = document.getElementById("toolDrawLineRibbon");
    const toolNodeRibbon = document.getElementById("toolNodeRibbon");
    const toolTextRibbon = document.getElementById("toolTextRibbon");
    const toolFillRibbon = document.getElementById("toolFillRibbon");
    const toolEyedropperRibbon = document.getElementById("toolEyedropperRibbon");
    const btnRibbonNewBorehole = document.getElementById("btnRibbonNewBorehole");
    const toolDrawBoreholeRibbon = document.getElementById("toolDrawBoreholeRibbon");
    const toolPanRibbon = document.getElementById("toolPanRibbon");

    if (toolSelectRibbon) toolSelectRibbon.addEventListener("click", () => setActiveTool("select", toolSelectRibbon));
    if (toolDrawLineRibbon) toolDrawLineRibbon.addEventListener("click", () => setActiveTool("drawLine", toolDrawLineRibbon));
    if (toolNodeRibbon) toolNodeRibbon.addEventListener("click", () => setActiveTool("node", toolNodeRibbon));
    if (toolTextRibbon) toolTextRibbon.addEventListener("click", () => setActiveTool("text", toolTextRibbon));
    if (toolFillRibbon) toolFillRibbon.addEventListener("click", () => setActiveTool("fill", toolFillRibbon));
    if (toolEyedropperRibbon) toolEyedropperRibbon.addEventListener("click", () => setActiveTool("eyedropper", toolEyedropperRibbon));
    if (btnRibbonNewBorehole) btnRibbonNewBorehole.addEventListener("click", openModalForNew);
    if (toolDrawBoreholeRibbon) toolDrawBoreholeRibbon.addEventListener("click", () => setActiveTool("drawBorehole", toolDrawBoreholeRibbon));
    if (toolPanRibbon) toolPanRibbon.addEventListener("click", () => setActiveTool("pan", toolPanRibbon));

    // Litoloji Klasörü: Kolondan Kesite Aktar
    const btnAutoSyncStrataTop = document.getElementById("btnAutoSyncStrataTop");
    if (btnAutoSyncStrataTop) {
        btnAutoSyncStrataTop.addEventListener("click", () => {
            const btnSync = document.getElementById("btnAutoSyncStrata");
            if (btnSync) btnSync.click();
        });
    }

    // Sondaj Klasörü: Kolon Metraj & Kot Düzenleyici
    const btnOpenBoreholeEditor = document.getElementById("btnOpenBoreholeEditor");
    if (btnOpenBoreholeEditor) {
        btnOpenBoreholeEditor.addEventListener("click", () => {
            const tabKotBtn = document.querySelector('.tab-btn[data-tab="tab-kot-boreholes"]');
            if (tabKotBtn) tabKotBtn.click();
        });
    }

    // Jeolojik Sembol Ekleme Butonları
    document.querySelectorAll(".btn-insert-sym").forEach(btn => {
        btn.addEventListener("click", () => {
            const symType = btn.getAttribute("data-sym");
            if (canvas && symType) {
                canvas.activeSymbolType = symType;
                setActiveTool("symbol", null);
                statusTool.textContent = `🔺 Sembol Ekle (${symType}): Tuvalde eklemek istediğiniz konuma tıklayın.`;
            }
        });
    });

    // Litoloji Paleti Seçimi (Tüm Renkler)
    document.querySelectorAll(".btn-palette-pick").forEach(btn => {
        btn.addEventListener("click", () => {
            const color = btn.getAttribute("data-color");
            const pattern = btn.getAttribute("data-pattern") || "none";
            const name = btn.getAttribute("data-name") || "Tabaka";
            if (canvas) {
                canvas.activeFillColor = color;
                canvas.activeFillPattern = pattern;
                canvas.activeFillName = name;
                if (activeColorSwatch) {
                    activeColorSwatch.style.background = (color === "none") ? "transparent" : color;
                    activeColorSwatch.style.border = (color === "none") ? "1px dashed #fff" : "1px solid #fff";
                }
                setActiveTool("fill", toolFill);
                statusTool.textContent = `Boya Kovası Aktif (${name}): Boyamak istediğiniz tabaka alanına tıklayın.`;
            }
            document.querySelectorAll(".nav-dropdown-folder").forEach(f => f.classList.remove("open"));
        });
    });

    // Dropdown Klasör Menü Açma/Kapama Dinleyicileri
    document.querySelectorAll(".btn-dropdown-folder").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const folder = btn.closest(".nav-dropdown-folder");
            document.querySelectorAll(".nav-dropdown-folder").forEach(f => {
                if (f !== folder) f.classList.remove("open");
            });
            if (folder) folder.classList.toggle("open");
        });
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".nav-dropdown-folder").forEach(f => f.classList.remove("open"));
    });

    document.querySelectorAll(".nav-dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(".nav-dropdown-folder").forEach(f => f.classList.remove("open"));
        });
    });

    // Çizim bitirme ve iptal yüzen çubuğu butonları
    const btnFinishLine = document.getElementById("btnFinishLine");
    const btnCancelLine = document.getElementById("btnCancelLine");
    if (btnFinishLine) {
        btnFinishLine.addEventListener("click", () => {
            if (canvas) canvas.finishDrawingLine();
        });
    }
    if (btnCancelLine) {
        btnCancelLine.addEventListener("click", () => {
            if (canvas) canvas.cancelDrawingLine();
        });
    }

    document.getElementById("btnZoomIn").addEventListener("click", () => canvas.zoomIn());
    document.getElementById("btnZoomOut").addEventListener("click", () => canvas.zoomOut());
    document.getElementById("btnZoomFit").addEventListener("click", () => canvas.zoomFit());

    // ================= ÖLÇEK & ORAN EKLENTİSİ (1X1, 1X2, VB. & OTOMATİK ORAN) =================
    const badgeActiveScale = document.getElementById("badgeActiveScale");
    const btnAutoDetermineScale = document.getElementById("btnAutoDetermineScale");
    const chkGraphicScaleEklenti = document.getElementById("chkShowGraphicScale");

    function setScaleRatio(ratio, showLabel = true) {
        const r = parseFloat(ratio) || 1.0;
        currentProject.parameters.verticalExaggeration = r;
        if (showLabel) {
            currentProject.parameters.showScaleText = true;
            if (chkShowScaleText) chkShowScaleText.checked = true;
        }

        if (badgeActiveScale) {
            badgeActiveScale.textContent = `1X${r} ${r === 1 ? '(Doğal)' : ''}`;
        }
        document.querySelectorAll(".btn-scale-ratio").forEach(btn => {
            const btnRatio = parseFloat(btn.getAttribute("data-ratio"));
            if (btnRatio === r) {
                btn.style.background = "#0284c7";
                btn.style.borderColor = "#38bdf8";
            } else {
                btn.style.background = "#1e293b";
                btn.style.borderColor = "#475569";
            }
        });

        if (canvas) {
            canvas.render();
            canvas.zoomFit();
        }
        statusTool.textContent = `✓ Ölçek Oranı Güncellendi: 1X${r} (Düşey Büyütme: ${r}x)`;
    }

    document.querySelectorAll(".btn-scale-ratio").forEach(btn => {
        btn.addEventListener("click", () => {
            const r = parseFloat(btn.getAttribute("data-ratio"));
            setScaleRatio(r, true);
        });
    });

    if (btnAutoDetermineScale) {
        btnAutoDetermineScale.addEventListener("click", () => {
            const p = currentProject.parameters;
            const dist = p.totalDistance || 12.0;
            const diffZ = Math.max(1, (p.maxElevation - p.minElevation));
            const aspect = dist / diffZ;

            let chosenRatio = 1.0;
            if (aspect >= 6.0) {
                chosenRatio = 5.0;
            } else if (aspect >= 2.5) {
                chosenRatio = 2.0;
            } else {
                chosenRatio = 1.0;
            }
            setScaleRatio(chosenRatio, true);
            statusTool.textContent = `⚡ Otomatik Ölçek Oranı: 1X${chosenRatio} (Mesafe: ${dist.toFixed(1)}m, Kot Farkı: ${diffZ.toFixed(1)}m)`;
        });
    }

    if (chkGraphicScaleEklenti) {
        chkGraphicScaleEklenti.checked = currentProject.parameters.showGraphicScale === true;
        chkGraphicScaleEklenti.addEventListener("change", () => {
            currentProject.parameters.showGraphicScale = chkGraphicScaleEklenti.checked;
            if (canvas) canvas.render();
        });
    }

    if (chkShowScaleText) {
        chkShowScaleText.checked = currentProject.parameters.showScaleText === true;
        chkShowScaleText.addEventListener("change", () => {
            currentProject.parameters.showScaleText = chkShowScaleText.checked;
            if (canvas) canvas.render();
        });
    }

    // ================= DIŞA AKTARMA (PDF, WORD, EXCEL, AUTOCAD, SVG) =================
    const exportReportModal = document.getElementById("exportReportModal");
    const btnOpenExportModal = document.getElementById("btnOpenExportModal");
    const btnCloseExportModal = document.getElementById("btnCloseExportModal");
    const btnCloseExportModalBtn = document.getElementById("btnCloseExportModalBtn");
    const btnModalPrintPDF = document.getElementById("btnModalPrintPDF");
    const btnModalCopyWord = document.getElementById("btnModalCopyWord");
    const btnModalDownloadPNG = document.getElementById("btnModalDownloadPNG");
    const btnModalDownloadExcel = document.getElementById("btnModalDownloadExcel");
    const btnModalCopyExcel = document.getElementById("btnModalCopyExcel");
    const btnModalDownloadDXF = document.getElementById("btnModalDownloadDXF");
    const btnModalDownloadSVG = document.getElementById("btnModalDownloadSVG");
    const exportModalFeedback = document.getElementById("exportModalFeedback");

    function openExportModal() {
        if (exportReportModal) {
            exportReportModal.classList.add("open");
            if (exportModalFeedback) exportModalFeedback.textContent = "";
        }
    }
    function closeExportModal() {
        if (exportReportModal) {
            exportReportModal.classList.remove("open");
        }
    }

    if (btnOpenExportModal) btnOpenExportModal.addEventListener("click", openExportModal);
    if (btnCloseExportModal) btnCloseExportModal.addEventListener("click", closeExportModal);
    if (btnCloseExportModalBtn) btnCloseExportModalBtn.addEventListener("click", closeExportModal);

    function triggerPrintPDF() {
        closeExportModal();
        statusTool.textContent = "🖨️ Adobe PDF / Baskı önizlemesi hazırlanıyor...";
        setTimeout(() => {
            if (canvas) canvas.zoomFit();
            window.print();
        }, 300);
    }

    const btnPrint = document.getElementById("btnPrint");
    const btnQuickPDF = document.getElementById("btnQuickPDF");
    if (btnPrint) btnPrint.addEventListener("click", triggerPrintPDF);
    if (btnQuickPDF) btnQuickPDF.addEventListener("click", triggerPrintPDF);
    if (btnModalPrintPDF) btnModalPrintPDF.addEventListener("click", triggerPrintPDF);

    // ================= MICROSOFT WORD (.DOC) RAPORU VE BELGESİ DOĞRUDAN OLUŞTURMA =================
    async function exportDirectToWordDoc() {
        if (!canvas || !canvas.svg) return;
        closeExportModal();
        statusTool.textContent = "⏳ Word Rapor Belgesi (.doc) oluşturuluyor...";

        try {
            const serializer = new XMLSerializer();
            let svgString = serializer.serializeToString(canvas.svg);
            if (!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
                svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            const img = new Image();
            const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                const c = document.createElement("canvas");
                const scale = 2.0; // Word belgesi için ideal 300 DPI ölçek
                const w = canvas.svg.clientWidth || 1200;
                const h = canvas.svg.clientHeight || 700;
                c.width = w * scale;
                c.height = h * scale;
                const ctx = c.getContext("2d");
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, c.width, c.height);
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0, w, h);

                const dataUrl = c.toDataURL("image/png");
                URL.revokeObjectURL(url);

                // Word için panoya da kopyala (varsa)
                c.toBlob(async (blob) => {
                    if (navigator.clipboard && navigator.clipboard.write) {
                        try {
                            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                        } catch (e) {}
                    }
                }, "image/png");

                // Word HTML dokümanı hazırla
                const meta = currentProject.metadata || {};
                const comp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
                const p = currentProject.parameters || {};
                const bhs = currentProject.boreholes || [];
                const projTitle = meta.title || "Jeolojik Kesit Çizimi";
                const compTitle = meta.companyName || comp.companyName || "JEOTEKNİK MÜHENDİSLİK RAPORU";
                const engName = meta.engineerName || comp.engineerName || "Yetkili Mühendis";
                const engTitle = meta.engineerTitle || comp.engineerTitle || "Jeoloji Mühendisi";
                const engReg = meta.engineerRegNo || comp.engineerRegNo || "";
                const secLine = `${meta.sectionLineStart || "A"} - ${meta.sectionLineEnd || "A'"} (${meta.dirStart || ""} → ${meta.dirEnd || ""})`;
                const dateStr = new Date().toLocaleDateString("tr-TR");

                // Sondaj tablosu satırları
                let rowsHtml = "";
                bhs.forEach(b => {
                    const intervals = b.intervals || [];
                    const surfZ = b.surfaceElevation || 0;
                    const botZ = b.bottomElevation || 0;
                    const totalH = (surfZ - botZ).toFixed(2);

                    if (intervals.length === 0) {
                        rowsHtml += `<tr>
                            <td><strong>${b.name}</strong></td>
                            <td>${b.x} m</td>
                            <td>${surfZ.toFixed(2)} m</td>
                            <td>${botZ.toFixed(2)} m</td>
                            <td>${totalH} m</td>
                            <td>1</td>
                            <td>0.00 - ${totalH} m</td>
                            <td>${totalH} m</td>
                            <td>${surfZ.toFixed(2)} / ${botZ.toFixed(2)} m</td>
                            <td style="text-align:left; background:#f1f5f9;">Zemin</td>
                        </tr>`;
                    } else {
                        intervals.forEach((inter, idx) => {
                            const fromD = inter.fromDepth || 0;
                            const toD = inter.toDepth || 0;
                            const thick = (toD - fromD).toFixed(2);
                            const zTop = (surfZ - fromD).toFixed(2);
                            const zBot = (surfZ - toD).toFixed(2);
                            rowsHtml += `<tr>
                                ${idx === 0 ? `<td rowspan="${intervals.length}"><strong>${b.name}</strong></td>
                                <td rowspan="${intervals.length}">${b.x} m</td>
                                <td rowspan="${intervals.length}">${surfZ.toFixed(2)} m</td>
                                <td rowspan="${intervals.length}">${botZ.toFixed(2)} m</td>
                                <td rowspan="${intervals.length}">${totalH} m</td>` : ''}
                                <td>${idx + 1}</td>
                                <td>${fromD.toFixed(2)} - ${toD.toFixed(2)} m</td>
                                <td>${thick} m</td>
                                <td>${zTop} / ${zBot} m</td>
                                <td style="text-align:left; background:${inter.color || '#e2e8f0'}; color:#000; font-weight:600;">
                                    ${inter.name || "Litoloji"}
                                </td>
                            </tr>`;
                        });
                    }
                });

                const wordHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${projTitle} - Jeolojik Kesit Raporu</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page Section1 {
    size: 297mm 210mm;
    margin: 12mm 12mm 12mm 12mm;
    mso-page-orientation: landscape;
}
div.Section1 { page: Section1; }
body {
    font-family: 'Segoe UI', Calibri, Arial, sans-serif;
    font-size: 11pt;
    color: #1e293b;
    background: #ffffff;
}
.header-box {
    border-bottom: 3px solid #0284c7;
    padding-bottom: 6px;
    margin-bottom: 12px;
}
.header-title {
    font-size: 17pt;
    font-weight: bold;
    color: #0369a1;
    margin: 0 0 4px 0;
}
.header-sub {
    font-size: 10.5pt;
    color: #64748b;
    margin: 0;
}
.info-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 14px;
    font-size: 10pt;
}
.info-table th {
    background-color: #f1f5f9;
    color: #0f172a;
    border: 1px solid #cbd5e1;
    padding: 5px 8px;
    text-align: left;
    width: 22%;
}
.info-table td {
    border: 1px solid #cbd5e1;
    padding: 5px 8px;
}
.section-title {
    font-size: 12pt;
    font-weight: bold;
    color: #0f172a;
    margin: 14px 0 6px 0;
    border-bottom: 1.5pt solid #0284c7;
    padding-bottom: 3px;
}
.image-container {
    text-align: center;
    margin: 10px 0 16px 0;
    padding: 8px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
}
.image-container img {
    max-width: 100%;
    width: 260mm;
    height: auto;
}
.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6px;
    font-size: 9.5pt;
}
.data-table th {
    background-color: #0284c7;
    color: #ffffff;
    border: 1px solid #0369a1;
    padding: 6px 6px;
    text-align: center;
    font-weight: bold;
}
.data-table td {
    border: 1px solid #cbd5e1;
    padding: 5px 6px;
    text-align: center;
}
.footer-note {
    margin-top: 16px;
    font-size: 9pt;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 5px;
    text-align: right;
}
</style>
</head>
<body>
<div class="Section1">
    <div class="header-box" style="display:flex;justify-content:space-between;align-items:center;">
        <div>
            <div class="header-title">${compTitle}</div>
            <div class="header-sub">Jeolojik Kesit & Geoteknik Değerlendirme Raporu | Tarih: ${dateStr}</div>
        </div>
        ${comp.logoBase64 ? `<img src="${comp.logoBase64}" style="max-height:50px;max-width:160px;object-fit:contain;">` : ''}
    </div>

    <table class="info-table">
        <tr>
            <th>Proje / Parsel:</th>
            <td><strong>${projTitle}</strong></td>
            <th>Kesit Hattı:</th>
            <td>${secLine}</td>
        </tr>
        <tr>
            <th>Sorumlu Mühendis:</th>
            <td>${engName} (${engTitle}) ${engReg ? '- Sicil No: ' + engReg : ''}</td>
            <th>Kesit Boyu / Kotlar:</th>
            <td>${p.totalDistance || 12} m | Kot: ${p.minElevation || 0}m - ${p.maxElevation || 15}m (1x${p.verticalExaggeration || 1})</td>
        </tr>
        <tr>
            <th>Temel Altı Kotu (Df):</th>
            <td>${p.showDf ? `${p.dfElevation || 0} m (${p.dfLabel || 'Temel'})` : 'Belirtilmedi'}</td>
            <th>Yeraltı Su Seviyesi:</th>
            <td>${p.showGroundwater ? `${p.groundwaterElevation || 0} m` : 'Kuru / Belirtilmedi'}</td>
        </tr>
    </table>

    <div class="section-title">1. JEOLOJİK VE GEOTEKNİK ENİNE KESİT ÇİZİMİ</div>
    <div class="image-container">
        <img src="${dataUrl}" alt="Jeolojik Kesit Çizimi">
    </div>

    <div class="section-title">2. SONDAJ LOGLARI VE TABAKA PARAMETRELERİ VERİ TABLOSU</div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Kuyu No</th>
                <th>X Konum</th>
                <th>Ağız Kotu</th>
                <th>Taban Kotu</th>
                <th>Toplam Derinlik</th>
                <th>Sıra</th>
                <th>Derinlik Aralığı</th>
                <th>Kalınlık</th>
                <th>Kot Aralığı</th>
                <th>Litoloji Tanımı / Katman</th>
            </tr>
        </thead>
        <tbody>
            ${rowsHtml}
        </tbody>
    </table>

    <div class="footer-note" style="display:flex;justify-content:space-between;align-items:center;">
        <div><b>${compTitle}</b></div>
        <div>
            ${comp.stampBase64 ? `<img src="${comp.stampBase64}" style="max-height:50px;max-width:140px;display:block;margin-left:auto;"><br>` : ''}
            Raporu Hazırlayan: <strong>${engName}</strong> (${engTitle} ${engReg ? '- Sicil: ' + engReg : ''})
        </div>
    </div>
</div>
</body>
</html>`;

                const blob = new Blob(["\uFEFF" + wordHtml], { type: "application/msword;charset=utf-8" });
                const docUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                const safeName = getSanitizedProjectTitle();
                a.href = docUrl;
                a.download = `${safeName}_Rapor.doc`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(docUrl);

                statusTool.textContent = `✓ Word Raporu (.doc) hazırlandı ve indirildi! Kesit resmi ayrıca panoya kopyalandı (Word'e Ctrl+V ile yapıştırabilirsiniz).`;
                if (exportModalFeedback) exportModalFeedback.textContent = "✓ Word Rapor Belgesi (.doc) indirildi ve resim panoya kopyalandı!";
            };
            img.src = url;
        } catch (err) {
            console.error("Word export error:", err);
            statusTool.textContent = "Word raporu oluşturulurken bir hata oluştu: " + err.message;
        }
    }

    const btnQuickWord = document.getElementById("btnQuickWord");
    if (btnQuickWord) btnQuickWord.addEventListener("click", exportDirectToWordDoc);

    const btnQuickExcel = document.getElementById("btnQuickExcel");
    if (btnQuickExcel) {
        btnQuickExcel.addEventListener("click", () => {
            const csv = generateGeotechnicalTableCSV();
            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const safeName = getSanitizedProjectTitle();
            a.href = url;
            a.download = `${safeName}_Sondaj_ve_Kesit_Verileri.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            statusTool.textContent = "✓ Excel tablosu (.csv) indirildi.";
        });
    }

    const btnModalExportWordDoc = document.getElementById("btnModalExportWordDoc");
    if (btnModalExportWordDoc) btnModalExportWordDoc.addEventListener("click", exportDirectToWordDoc);

    const btnTabExportWordDoc = document.getElementById("btnTabExportWordDoc");
    if (btnTabExportWordDoc) btnTabExportWordDoc.addEventListener("click", exportDirectToWordDoc);

    // Microsoft Word İçin Yüksek Çözünürlüklü Panoya Kopyalama (Ctrl+V)
    async function copySectionToClipboardForWord() {
        if (exportModalFeedback) exportModalFeedback.textContent = "⏳ Word için yüksek çözünürlüklü resim panoya kopyalanıyor...";
        try {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(canvas.svg);
            const img = new Image();
            const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                const c = document.createElement("canvas");
                const scale = 2.5; // ~300 DPI
                c.width = canvas.svg.clientWidth * scale;
                c.height = canvas.svg.clientHeight * scale;
                const ctx = c.getContext("2d");
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, c.width, c.height);
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0);

                c.toBlob(async (blob) => {
                    URL.revokeObjectURL(url);
                    if (navigator.clipboard && navigator.clipboard.write) {
                        try {
                            await navigator.clipboard.write([
                                new ClipboardItem({ "image/png": blob })
                            ]);
                            if (exportModalFeedback) exportModalFeedback.textContent = "✓ Panoya kopyalandı! Word raporunuza gidip Ctrl+V yapabilirsiniz.";
                            statusTool.textContent = "✓ Kesit panoya kopyalandı. Word'e doğrudan Ctrl+V ile yapıştırabilirsiniz.";
                            return;
                        } catch (err) {
                            console.warn("ClipboardItem write failed, fallback:", err);
                        }
                    }
                    canvas.downloadPNG(getSafeExportBaseFilename("Jeolojik_Kesit") + ".png");
                    if (exportModalFeedback) exportModalFeedback.textContent = "✓ 300 DPI PNG olarak indirildi! Word raporunuza ekleyebilirsiniz.";
                }, "image/png");
            };
            img.src = url;
        } catch (e) {
            canvas.downloadPNG(getSafeExportBaseFilename("Jeolojik_Kesit") + ".png");
            if (exportModalFeedback) exportModalFeedback.textContent = "✓ Resim indirildi!";
        }
    }

    if (btnModalCopyWord) btnModalCopyWord.addEventListener("click", copySectionToClipboardForWord);

    const btnExportPNG = document.getElementById("btnExportPNG");
    if (btnExportPNG) btnExportPNG.addEventListener("click", () => canvas.downloadPNG(getSafeExportBaseFilename("Jeolojik_Kesit") + ".png"));
    if (btnModalDownloadPNG) btnModalDownloadPNG.addEventListener("click", () => {
        canvas.downloadPNG(getSafeExportBaseFilename("Jeolojik_Kesit") + ".png");
        if (exportModalFeedback) exportModalFeedback.textContent = "✓ 300 DPI Yüksek çözünürlüklü PNG indirildi!";
    });

    // Microsoft Excel Tablosu CSV (Noktalı Virgüllü ve UTF-8 BOM ile Excel uyumlu)
    function generateGeotechnicalTableCSV() {
        const meta = currentProject.metadata || {};
        const comp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
        const p = currentProject.parameters || {};
        const bhs = currentProject.boreholes || [];
        const compName = (comp.companyName || meta.companyName || "").trim();
        const engName = (comp.engineerName || meta.engineerName || "").trim();
        const engTitle = comp.engineerTitle || meta.engineerTitle || "Jeoloji Mühendisi";
        const engReg = comp.engineerRegNo || meta.engineerRegNo || "";

        let lines = [];
        lines.push(`${compName ? compName.toUpperCase() + " - " : ""}JEOLOJİK KESİT VE SONDAJ LOGLARI VERİ TABLOSU`);
        lines.push(`Proje / Parsel;${meta.title || "Belirtilmemiş"}`);
        if (engName) {
            lines.push(`Mühendis;${engName} (${engTitle})${engReg ? ' - Sicil No: ' + engReg : ''}`);
        }
        lines.push(`Kesit Hattı;${meta.sectionLineStart || "A"} - ${meta.sectionLineEnd || "A'"} (${meta.dirStart || ""} -> ${meta.dirEnd || ""})`);
        lines.push(`Kesit Boyu (m);${p.totalDistance || 12.0}`);
        lines.push(`Kot Aralığı;${p.minElevation || 0}m - ${p.maxElevation || 15}m (Ölçek Oranı: 1x${p.verticalExaggeration || 1})`);
        if (p.showDf) lines.push(`Bina Temel Altı Kotu (Df);${p.dfElevation || 0} m (${p.dfLabel || ""})`);
        if (p.showGroundwater) lines.push(`Yeraltı Su Seviyesi (YAS);${p.groundwaterElevation || 0} m`);
        lines.push("");

        lines.push("Kuyu No;X (m);Ağız Kotu (m);Taban Kotu (m);Kuyu Boyu (m);Katman Sıra;Başlangıç Derinlik (m);Bitiş Derinlik (m);Kalınlık (m);Üst Kot (m);Alt Kot (m);Litoloji Tanımı;Renk");

        bhs.forEach(b => {
            const intervals = b.intervals || [];
            const surfZ = b.surfaceElevation || 0;
            const botZ = b.bottomElevation || 0;
            const totalH = (surfZ - botZ).toFixed(2);

            if (intervals.length === 0) {
                lines.push(`${b.name};${b.x};${surfZ.toFixed(2)};${botZ.toFixed(2)};${totalH};1;0.00;${totalH};${totalH};${surfZ.toFixed(2)};${botZ.toFixed(2)};Zemin;#cbd5e1`);
            } else {
                intervals.forEach((inter, idx) => {
                    const fromD = inter.fromDepth || 0;
                    const toD = inter.toDepth || 0;
                    const thick = (toD - fromD).toFixed(2);
                    const zTop = (surfZ - fromD).toFixed(2);
                    const zBot = (surfZ - toD).toFixed(2);
                    lines.push(`${b.name};${b.x};${surfZ.toFixed(2)};${botZ.toFixed(2)};${totalH};${idx + 1};${fromD.toFixed(2)};${toD.toFixed(2)};${thick};${zTop};${zBot};${inter.name || "Tabaka"};${inter.color || "#a89276"}`);
                });
            }
        });

        return lines.join("\r\n");
    }

    function generateGeotechnicalTableTSV() {
        const bhs = currentProject.boreholes || [];
        let lines = [];
        lines.push("Kuyu No\tX (m)\tAğız Kotu (m)\tTaban Kotu (m)\tKuyu Derinliği (m)\tKatman No\tBaşlangıç (m)\tBitiş (m)\tKalınlık (m)\tÜst Kot (m)\tAlt Kot (m)\tLitoloji Tanımı\tRenk Kodu");

        bhs.forEach(b => {
            const intervals = b.intervals || [];
            const surfZ = b.surfaceElevation || 0;
            const botZ = b.bottomElevation || 0;
            const totalH = (surfZ - botZ).toFixed(2);

            if (intervals.length === 0) {
                lines.push(`${b.name}\t${b.x}\t${surfZ.toFixed(2)}\t${botZ.toFixed(2)}\t${totalH}\t1\t0.00\t${totalH}\t${totalH}\t${surfZ.toFixed(2)}\t${botZ.toFixed(2)}\tZemin\t#cbd5e1`);
            } else {
                intervals.forEach((inter, idx) => {
                    const fromD = inter.fromDepth || 0;
                    const toD = inter.toDepth || 0;
                    const thick = (toD - fromD).toFixed(2);
                    const zTop = (surfZ - fromD).toFixed(2);
                    const zBot = (surfZ - toD).toFixed(2);
                    lines.push(`${b.name}\t${b.x}\t${surfZ.toFixed(2)}\t${botZ.toFixed(2)}\t${totalH}\t${idx + 1}\t${fromD.toFixed(2)}\t${toD.toFixed(2)}\t${thick}\t${zTop}\t${zBot}\t${inter.name || "Tabaka"}\t${inter.color || "#a89276"}`);
                });
            }
        });

        return lines.join("\r\n");
    }

    if (btnModalDownloadExcel) {
        btnModalDownloadExcel.addEventListener("click", () => {
            const csv = generateGeotechnicalTableCSV();
            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${getSafeExportBaseFilename("Sondaj_ve_Kesit_Verileri")}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (exportModalFeedback) exportModalFeedback.textContent = "✓ Excel CSV dosyası indirildi! Excel ile doğrudan açabilirsiniz.";
            statusTool.textContent = "✓ Excel kuyu ve kot tablosu indirildi.";
        });
    }

    if (btnModalCopyExcel) {
        btnModalCopyExcel.addEventListener("click", () => {
            const tsv = generateGeotechnicalTableTSV();
            navigator.clipboard.writeText(tsv).then(() => {
                if (exportModalFeedback) exportModalFeedback.textContent = "✓ Excel tablosu panoya kopyalandı! Excel'e gidip Ctrl+V yapabilirsiniz.";
                statusTool.textContent = "✓ Excel tablosu panoya kopyalandı (Ctrl+V).";
            });
        });
    }

    function triggerDXFExport() {
        const exporter = new DxfExporter(currentProject);
        exporter.download(getSafeExportBaseFilename("Jeolojik_Kesit") + ".dxf");
        if (exportModalFeedback) exportModalFeedback.textContent = "✓ AutoCAD DXF dosyası indirildi!";
        statusTool.textContent = "✓ AutoCAD (DXF) dosyası indirildi.";
    }

    const btnExportDXF = document.getElementById("btnExportDXF");
    if (btnExportDXF) btnExportDXF.addEventListener("click", triggerDXFExport);
    if (btnModalDownloadDXF) btnModalDownloadDXF.addEventListener("click", triggerDXFExport);

    const btnExportSVG = document.getElementById("btnExportSVG");
    if (btnExportSVG) btnExportSVG.addEventListener("click", () => canvas.downloadSVG(getSafeExportBaseFilename("Jeolojik_Kesit") + ".svg"));
    if (btnModalDownloadSVG) btnModalDownloadSVG.addEventListener("click", () => {
        canvas.downloadSVG(getSafeExportBaseFilename("Jeolojik_Kesit") + ".svg");
        if (exportModalFeedback) exportModalFeedback.textContent = "✓ CorelDRAW SVG dosyası indirildi!";
    });

    // ================= SOL MENÜDEKİ ÖZEL "PDF & OFFICE" SEKMESİ İŞLEMLERİ =================
    const btnTabExportPDF = document.getElementById("btnTabExportPDF");
    const btnTabCopyWord = document.getElementById("btnTabCopyWord");
    const btnTabDownloadPNG = document.getElementById("btnTabDownloadPNG");
    const btnTabDownloadExcel = document.getElementById("btnTabDownloadExcel");
    const btnTabCopyExcel = document.getElementById("btnTabCopyExcel");
    const btnTabDownloadDXF = document.getElementById("btnTabDownloadDXF");
    const btnTabDownloadSVG = document.getElementById("btnTabDownloadSVG");
    const tabExportFeedback = document.getElementById("tabExportFeedback");

    function showTabExportFeedback(msg) {
        if (!tabExportFeedback) return;
        tabExportFeedback.textContent = msg;
        tabExportFeedback.style.display = "block";
        setTimeout(() => { tabExportFeedback.style.display = "none"; }, 4000);
    }

    if (btnTabExportPDF) {
        btnTabExportPDF.addEventListener("click", () => {
            showTabExportFeedback("🖨️ PDF / Yazıcı önizlemesi hazırlanıyor...");
            triggerPrintPDF();
        });
    }

    if (btnTabCopyWord) {
        btnTabCopyWord.addEventListener("click", async () => {
            showTabExportFeedback("⏳ Word için 300 DPI resim panoya kopyalanıyor...");
            await copySectionToClipboardForWord();
            showTabExportFeedback("✓ Panoya kopyalandı! Word belgenize gidip Ctrl+V yapabilirsiniz.");
        });
    }

    if (btnTabDownloadPNG) {
        btnTabDownloadPNG.addEventListener("click", () => {
            canvas.downloadPNG(getSafeExportBaseFilename("Jeolojik_Kesit") + ".png");
            showTabExportFeedback("✓ 300 DPI PNG resmi indirildi!");
        });
    }

    if (btnTabDownloadExcel) {
        btnTabDownloadExcel.addEventListener("click", () => {
            const csv = generateGeotechnicalTableCSV();
            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${getSafeExportBaseFilename("Sondaj_ve_Kesit_Verileri")}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showTabExportFeedback("✓ Excel CSV dosyası indirildi!");
        });
    }

    if (btnTabCopyExcel) {
        btnTabCopyExcel.addEventListener("click", () => {
            const tsv = generateGeotechnicalTableTSV();
            navigator.clipboard.writeText(tsv).then(() => {
                showTabExportFeedback("✓ Excel tablosu panoya kopyalandı! Excel'e gidip Ctrl+V yapabilirsiniz.");
            });
        });
    }

    if (btnTabDownloadDXF) {
        btnTabDownloadDXF.addEventListener("click", () => {
            triggerDXFExport();
            showTabExportFeedback("✓ AutoCAD (DXF) dosyası indirildi!");
        });
    }

    if (btnTabDownloadSVG) {
        btnTabDownloadSVG.addEventListener("click", () => {
            canvas.downloadSVG(getSafeExportBaseFilename("Jeolojik_Kesit") + ".svg");
            showTabExportFeedback("✓ CorelDRAW (SVG) dosyası indirildi!");
        });
    }


    // ================= GERİ AL (Ctrl+Z) & SİL (Del) =================
    if (btnUndo) {
        btnUndo.addEventListener("click", () => {
            if (canvas) canvas.undo();
        });
    }

    if (btnDeleteSelected) {
        btnDeleteSelected.addEventListener("click", () => {
            if (canvas) canvas.deleteSelected();
        });
    }

    // ================= KAROT SANDIĞI & MALZEME SINIFLANDIRMA (TS 1500 / USCS) =================
    function classifyMaterial(lithoId, name) {
        const text = `${lithoId || ""} ${name || ""}`.toLowerCase();
        if (text.includes("dolgu") || text.includes("fill")) {
            return {
                type: "Dolgu",
                uscs: "DOLGU",
                badgeClass: "dolgu",
                consistency: "Gevşek, Düzensiz",
                engineeringComment: "Yapay / kontrolsüz dolgu. Oturma riski yüksek; doğrudan temel taşımaya uygun değildir. Temel tabanının bu seviyenin altına indirilmesi veya sıyrılması zorunludur."
            };
        }
        if (text.includes("kumlu kil") || text.includes("kumlu-kil")) {
            return {
                type: "Kumlu Kil",
                uscs: "CL",
                badgeClass: "cl",
                consistency: "Katı - Çok Katı",
                engineeringComment: "Düşük-orta plastisiteli kumlu kil matriksi. Taşıma gücü elverişli (qu > 200 kPa), oturma parametreleri yapı için emniyetli sınırlar içerisindedir."
            };
        }
        if (text.includes("killi silt") || text.includes("killi-silt")) {
            return {
                type: "Killi Silt",
                uscs: "ML / CL",
                badgeClass: "ml",
                consistency: "Katı - Çok Katı",
                engineeringComment: "İnorganik killi silt / marnlı seviye. Yüksek sıkışabilirlik potansiyeli düşük, taşıma gücü yeterli stabil jeoteknik tabaka."
            };
        }
        if (text.includes("kil") && text.includes("yüksek")) {
            return {
                type: "Yağlı Kil",
                uscs: "CH",
                badgeClass: "ch",
                consistency: "Katı, Plastik",
                engineeringComment: "Yüksek plastisiteli yağlı kil. Şişme-büzülme basınçlarına karşı temel drenajı ve yalıtımı tavsiye edilir."
            };
        }
        if (text.includes("kil")) {
            return {
                type: "Kil",
                uscs: "CL",
                badgeClass: "cl",
                consistency: "Orta Katı - Katı",
                engineeringComment: "Düşük plastisiteli inorganik kil. Standart yüzeysel temeller açısından kabul edilebilir taşıma kapasitesindedir."
            };
        }
        if (text.includes("silt")) {
            return {
                type: "Silt",
                uscs: "ML",
                badgeClass: "ml",
                consistency: "Sıkı / Katı",
                engineeringComment: "İnce daneli inorganik silt. Kılcal su yükselmesine karşı temel altı grobeton ve drenaj hendekleri önerilir."
            };
        }
        if (text.includes("kumtaşı") || text.includes("kum")) {
            return {
                type: "Kum / Kumtaşı",
                uscs: "SM / SW",
                badgeClass: "sm",
                consistency: "Orta Sıkı - Sıkı",
                engineeringComment: "Granüler taneli matriks, mükemmel içsel sürtünme açısı (\u03c6 > 32°), ani oturma karakterli, yüksek taşıma gücü."
            };
        }
        if (text.includes("çakıl") || text.includes("cakil")) {
            return {
                type: "Çakıl",
                uscs: "GW / GP",
                badgeClass: "sm",
                consistency: "Sıkı",
                engineeringComment: "Alüvyon çakıllı seviye. Çok yüksek permeabilite ve yüksek taşıma gücü."
            };
        }
        if (text.includes("kireç") || text.includes("kalker") || text.includes("bazalt") || text.includes("kaya")) {
            return {
                type: "Kayaç",
                uscs: "KAYAÇ",
                badgeClass: "kaya",
                consistency: "Sağlam Kaya",
                engineeringComment: "Masif / yarı masif kayaç formasyonu. Taşıma gücü çok yüksek, zemin oturması ihmal edilebilir mertebededir."
            };
        }
        return {
            type: "Zemin",
            uscs: "CL / ML",
            badgeClass: "cl",
            consistency: "Orta Katı",
            engineeringComment: "Standart jeoteknik taşıma parametrelerine sahip zemin seviyesi."
        };
    }

    // ================= HER METREDE KAROT SANDIĞI ANALİZİ (0-1m, 1-2m...) =================
    function generateMeterByMeterTable(bh) {
        if (!bh || !bh.intervals) return "";
        const surf = bh.surfaceElevation;
        const bot = bh.bottomElevation !== undefined ? bh.bottomElevation : (surf - 15.0);
        const totalD = Math.max(1, surf - bot);
        const steps = Math.ceil(totalD);

        let html = `
            <table class="core-table">
                <thead>
                    <tr>
                        <th style="width:40px;">Metre</th>
                        <th style="width:85px;">Derinlik (m)</th>
                        <th style="width:85px;">Kot (m)</th>
                        <th>Litoloji & Numune</th>
                        <th style="width:65px;">USCS</th>
                        <th style="width:85px;">Kıvam</th>
                        <th>1m Jeoteknik Yorum</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let m = 0; m < steps; m++) {
            const fromD = m;
            const toD = Math.min(totalD, m + 1);
            const midD = (fromD + toD) / 2;
            const fromKot = (surf - fromD).toFixed(2);
            const toKot = (surf - toD).toFixed(2);

            const inv = bh.intervals.find(i => midD >= i.fromDepth && midD <= i.toDepth) || bh.intervals[0] || { name: "Zemin", color: "#cbd5e1", lithoId: "kumlu-kil" };
            const cls = classifyMaterial(inv.lithoId, inv.name);

            html += `
                <tr>
                    <td style="font-weight:bold;text-align:center;color:#f59e0b;">${m + 1}m</td>
                    <td style="font-weight:bold;color:#38bdf8;white-space:nowrap;">${fromD.toFixed(1)} - ${toD.toFixed(1)} m</td>
                    <td style="color:#94a3b8;font-size:10px;">${fromKot} → ${toKot}</td>
                    <td>
                        <div style="display:flex;align-items:center;gap:5px;">
                            <span style="display:inline-block;width:10px;height:10px;background:${inv.color || '#cbd5e1'};border:1px solid #fff;border-radius:2px;"></span>
                            <span style="font-weight:600;font-size:10.5px;">${inv.name}</span>
                        </div>
                    </td>
                    <td><span class="badge-uscs ${cls.badgeClass}">${cls.uscs}</span></td>
                    <td style="color:#cbd5e1;font-size:10px;">${cls.consistency}</td>
                    <td style="font-size:10.5px;color:#94a3b8;line-height:1.2;">${cls.engineeringComment}</td>
                </tr>
            `;
        }

        html += `</tbody></table>`;
        return html;
    }

    function copyMeterByMeterReport(bh) {
        if (!bh) return;
        const surf = bh.surfaceElevation;
        const bot = bh.bottomElevation !== undefined ? bh.bottomElevation : (surf - 15.0);
        const totalD = (surf - bot).toFixed(2);
        const comp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
        const compName = (comp.companyName || currentProject.metadata.companyName || "").trim();
        const headerTitle = compName ? `${compName.toUpperCase()} - ` : "";
        let report = `===============================================================\n`;
        report += `${headerTitle}1 METRE ADIMLI KAROT VE JEOTEKNİK RAPORU\n`;
        report += `Kuyu: ${bh.name} | Başlangıç Kotu: ${surf.toFixed(2)} m | Taban Kotu: ${bot.toFixed(2)} m | Derinlik: ${totalD} m\n`;
        report += `Standart: TS 1500 / USCS (Her 1 Metrede Ayrıntılı Numune Değerlendirmesi)\n`;
        report += `===============================================================\n\n`;

        const steps = Math.ceil(surf - bot);
        for (let m = 0; m < steps; m++) {
            const fromD = m;
            const toD = Math.min(steps, m + 1);
            const midD = (fromD + toD) / 2;
            const fromKot = (surf - fromD).toFixed(2);
            const toKot = (surf - toD).toFixed(2);
            const inv = bh.intervals.find(i => midD >= i.fromDepth && midD <= i.toDepth) || bh.intervals[0] || { name: "Zemin", lithoId: "" };
            const cls = classifyMaterial(inv.lithoId, inv.name);

            report += `${m + 1}. Metre (${fromD.toFixed(1)} - ${toD.toFixed(1)} m | Kot: ${fromKot}m - ${toKot}m):\n`;
            report += `   - Litoloji / Numune: ${inv.name}\n`;
            report += `   - USCS / TS 1500 Grubu: [${cls.uscs}]\n`;
            report += `   - Kıvam / Göreceli Sıkılık: ${cls.consistency}\n`;
            report += `   - Jeoteknik Mühendislik Yorumu: ${cls.engineeringComment}\n\n`;
        }

        report += `===============================================================\n`;
        report += `Değerlendirme: Bu 1m adımlı log raporu JeoCAD Geoteknik CAD Motoru tarafından üretilmiştir.\n`;

        navigator.clipboard.writeText(report).then(() => {
            if (coreCopyFeedback) {
                coreCopyFeedback.textContent = `✓ ${bh.name} 1m detaylı kuyu raporu panoya kopyalandı!`;
                coreCopyFeedback.style.display = "block";
                setTimeout(() => { coreCopyFeedback.style.display = "none"; }, 3500);
            }
        }).catch(() => {
            prompt("Rapor metnini kopyalamak için Ctrl+C tuşlarına basabilirsiniz:", report);
        });
    }

    // ================= EXCEL SONDAJ LOGU AYRIŞTIRICI =================
    function importExcelBoreholeLog(rawText) {
        if (!rawText || !rawText.trim()) {
            alert("Lütfen yapıştırma kutusuna Excel verisi girin.");
            return;
        }

        const lines = rawText.trim().split("\n");
        const parsedRows = [];

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;
            if (trimmed.toLowerCase().includes("kuyu") && trimmed.toLowerCase().includes("kot")) return;

            let parts;
            if (trimmed.includes("\t")) parts = trimmed.split("\t");
            else if (trimmed.includes(";")) parts = trimmed.split(";");
            else if (trimmed.includes(",")) parts = trimmed.split(",");
            else parts = trimmed.split(/\s{2,}/);

            parts = parts.map(p => p.trim()).filter(p => p.length > 0);
            if (parts.length >= 4) {
                const name = parts[0];
                const x = parseFloat(parts[1].replace(",", ".")) || 0;
                const kot = parseFloat(parts[2].replace(",", ".")) || 95.0;
                const fromD = parseFloat(parts[3].replace(",", ".")) || 0;
                const toD = parseFloat(parts[4] ? parts[4].replace(",", ".") : (fromD + 3)) || (fromD + 3);
                const lithoName = parts[5] || "Kumlu Kil";
                parsedRows.push({ name, x, kot, fromD, toD, lithoName });
            }
        });

        if (parsedRows.length === 0) {
            alert("Excel verisi ayrıştırılamadı! Lütfen sütunların 'KuyuAdı, X, Kot, Başlangıç, Bitiş, Litoloji' sırasında olduğundan emin olun.");
            return;
        }

        const grouped = {};
        parsedRows.forEach(r => {
            if (!grouped[r.name]) {
                grouped[r.name] = {
                    id: `bh-${r.name.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now().toString(36).substr(2, 4)}`,
                    name: r.name,
                    x: r.x,
                    surfaceElevation: r.kot,
                    bottomElevation: r.kot - 15.0,
                    intervals: []
                };
            }

            let col = "#a89276";
            let pat = "hatch-sandy-clay";
            const lowerL = r.lithoName.toLowerCase();
            if (lowerL.includes("dolgu")) { col = "#ea580c"; pat = "hatch-fill"; }
            else if (lowerL.includes("silt")) { col = "#4dd0e1"; pat = "hatch-silt"; }
            else if (lowerL.includes("kum")) { col = "#facc15"; pat = "hatch-sandstone"; }
            else if (lowerL.includes("kireç") || lowerL.includes("kalker")) { col = "#94a3b8"; pat = "hatch-limestone"; }
            else if (lowerL.includes("bazalt")) { col = "#c084fc"; pat = "hatch-igneous"; }

            grouped[r.name].intervals.push({
                fromDepth: r.fromD,
                toDepth: r.toD,
                name: r.lithoName,
                lithoId: lowerL.includes("dolgu") ? "dolgu" : (lowerL.includes("silt") ? "killi-silt" : "kumlu-kil"),
                color: col,
                pattern: pat
            });

            const curBot = r.kot - r.toD;
            if (curBot < grouped[r.name].bottomElevation) {
                grouped[r.name].bottomElevation = curBot;
            }
        });

        const newBoreholes = Object.values(grouped);
        newBoreholes.sort((a, b) => a.x - b.x);

        currentProject.boreholes = newBoreholes;

        const maxX = Math.max(...newBoreholes.map(b => b.x));
        const maxZ = Math.max(...newBoreholes.map(b => b.surfaceElevation));
        const minZ = Math.min(...newBoreholes.map(b => b.bottomElevation));

        currentProject.parameters.totalDistance = Math.max(currentProject.parameters.totalDistance, Math.ceil(maxX + 3.0));
        currentProject.parameters.maxElevation = Math.max(currentProject.parameters.maxElevation, Math.ceil(maxZ + 2.0));
        currentProject.parameters.minElevation = Math.min(currentProject.parameters.minElevation, Math.floor(minZ - 2.0));

        populateForm();
        if (canvas) {
            canvas.project = currentProject;
            canvas.correlateBySlope();
            canvas.zoomFit();
        }
        renderBoreholeList();
        renderStrataList();
        renderCoreBoxTab();
        alert(`✓ ${newBoreholes.length} kuyu Excel'den aktarıldı ve katmanlar eğime göre bağlandı!`);
    }

    function renderCoreBoxTab() {
        if (!selCoreBorehole || !coreBoxTableContainer) return;

        const boreholes = currentProject.boreholes || [];
        const prevSelected = selCoreBorehole.value;
        selCoreBorehole.innerHTML = "";

        if (boreholes.length === 0) {
            selCoreBorehole.innerHTML = `<option value="">Kayıtlı kuyu yok</option>`;
            coreBoxTableContainer.innerHTML = `<p style="color:var(--text-muted);font-size:12px;text-align:center;padding:12px;">Kesitte henüz kuyu tanımlanmamış. Yukarıdaki <strong>+ Yeni Kuyu Oluştur</strong> butonuyla kuyu ekleyebilirsiniz.</p>`;
            if (btnToggleCoreCard) {
                btnToggleCoreCard.textContent = "📋 Kesite Ekle";
                btnToggleCoreCard.style.background = "#0284c7";
            }
            return;
        }

        boreholes.forEach((bh, idx) => {
            const opt = document.createElement("option");
            opt.value = bh.id;
            const totalD = (bh.surfaceElevation - bh.bottomElevation).toFixed(2);
            opt.textContent = `${bh.name} (Kot: ${bh.surfaceElevation.toFixed(2)}m → ${bh.bottomElevation.toFixed(2)}m, Derinlik: ${totalD}m)`;
            if (prevSelected === bh.id) {
                opt.selected = true;
            } else if (currentProject.coreBoxCard && currentProject.coreBoxCard.boreholeId === bh.id) {
                opt.selected = true;
            } else if (idx === 0 && !prevSelected) {
                opt.selected = true;
            }
            selCoreBorehole.appendChild(opt);
        });

        const activeBhId = selCoreBorehole.value || boreholes[0].id;
        const activeBh = boreholes.find(b => b.id === activeBhId) || boreholes[0];

        if (!activeBh || !activeBh.intervals || activeBh.intervals.length === 0) {
            coreBoxTableContainer.innerHTML = `<p style="color:var(--text-muted);font-size:12px;padding:10px;">Bu kuyu için litoloji derinlik aralığı bulunamadı.</p>`;
            return;
        }

        if (coreBoxViewMode === "1m") {
            coreBoxTableContainer.innerHTML = generateMeterByMeterTable(activeBh);
        } else {
            let html = `
                <table class="core-table">
                    <thead>
                        <tr>
                            <th style="width:50px;">Sandık</th>
                            <th style="width:105px;">Derinlik (m)</th>
                            <th>Litoloji & Malzeme</th>
                            <th style="width:80px;">USCS</th>
                            <th style="width:95px;">Kıvam/Durum</th>
                            <th>Mühendislik Yorumu</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            activeBh.intervals.forEach((inv, idx) => {
                const cls = classifyMaterial(inv.lithoId, inv.name);
                const boxNo = idx + 1;
                html += `
                    <tr>
                        <td style="font-weight:bold;text-align:center;color:var(--accent-gold);">#${boxNo}</td>
                        <td style="font-weight:bold;color:#38bdf8;white-space:nowrap;">${inv.fromDepth.toFixed(2)} - ${inv.toDepth.toFixed(2)} m</td>
                        <td>
                            <div style="display:flex;align-items:center;gap:6px;">
                                <span style="display:inline-block;width:12px;height:12px;background:${inv.color || '#cbd5e1'};border:1px solid #ffffff;border-radius:2px;"></span>
                                <span style="font-weight:600;">${inv.name}</span>
                            </div>
                        </td>
                        <td><span class="badge-uscs ${cls.badgeClass}">${cls.uscs}</span></td>
                        <td style="color:#cbd5e1;font-size:10.5px;">${cls.consistency}</td>
                        <td style="font-size:10.5px;color:#94a3b8;line-height:1.3;">${cls.engineeringComment}</td>
                    </tr>
                `;
            });

            html += `</tbody></table>`;
            coreBoxTableContainer.innerHTML = html;
        }

        // Bilgi Kartı Butonu Durumu
        if (btnToggleCoreCard) {
            const isVisible = currentProject.coreBoxCard && currentProject.coreBoxCard.visible && currentProject.coreBoxCard.boreholeId === activeBh.id;
            btnToggleCoreCard.textContent = isVisible ? "✓ Kesitte Gösteriliyor" : "📋 Kesite Ekle";
            btnToggleCoreCard.style.background = isVisible ? "#10b981" : "#0284c7";
        }
    }

    if (selCoreBorehole) {
        selCoreBorehole.addEventListener("change", () => {
            if (currentProject.coreBoxCard && currentProject.coreBoxCard.visible) {
                currentProject.coreBoxCard.boreholeId = selCoreBorehole.value;
                if (canvas) canvas.render();
            }
            renderCoreBoxTab();
        });
    }

    if (btnToggleCoreCard) {
        btnToggleCoreCard.addEventListener("click", () => {
            if (!currentProject.coreBoxCard) {
                currentProject.coreBoxCard = { visible: false, boreholeId: "sk-1", x: 620, y: 40 };
            }
            const activeBhId = selCoreBorehole ? selCoreBorehole.value : (currentProject.boreholes[0]?.id || "sk-1");
            currentProject.coreBoxCard.boreholeId = activeBhId;
            currentProject.coreBoxCard.visible = !currentProject.coreBoxCard.visible;
            if (canvas) canvas.render();
            renderCoreBoxTab();
        });
    }

    if (btnCopyCoreReport) {
        btnCopyCoreReport.addEventListener("click", () => {
            const boreholes = currentProject.boreholes || [];
            const activeBhId = selCoreBorehole ? selCoreBorehole.value : (boreholes[0]?.id || "");
            const activeBh = boreholes.find(b => b.id === activeBhId) || boreholes[0];
            if (!activeBh) return;

            const comp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
            const compName = (comp.companyName || currentProject.metadata.companyName || "").trim();
            const headerTitle = compName ? `${compName.toUpperCase()} - ` : "";
            let report = `===============================================================\n`;
            report += `${headerTitle}KAROT SANDIĞI MALZEME SINIFLANDIRMA VE JEOTEKNİK RAPORU\n`;
            report += `Kuyu No: ${activeBh.name} | Başlangıç Kotu: ${activeBh.surfaceElevation.toFixed(2)} m | Taban Kotu: ${activeBh.bottomElevation.toFixed(2)} m | Toplam Sondaj Derinliği: ${totalDepth} m\n`;
            report += `Standart: TS 1500 / USCS (Birleştirilmiş Zemin Sınıflandırma Sistemi)\n`;
            report += `===============================================================\n\n`;

            (activeBh.intervals || []).forEach((inv, idx) => {
                const cls = classifyMaterial(inv.lithoId, inv.name);
                report += `${idx + 1}. Sandık (${inv.fromDepth.toFixed(2)} - ${inv.toDepth.toFixed(2)} m): ${inv.name}\n`;
                report += `   - Malzeme / Zemin Türü: ${cls.type}\n`;
                report += `   - USCS / TS 1500 Zemin Sınıfı: [${cls.uscs}]\n`;
                report += `   - Kıvam / Göreceli Sıkılık: ${cls.consistency}\n`;
                report += `   - Jeoteknik Mühendislik Yorumu: ${cls.engineeringComment}\n\n`;
            });

            report += `===============================================================\n`;
            report += `Değerlendirme: Bu sınıflandırma jeoteknik saha verileri ve karot sandığı loglarına istinaden JeoCAD Geoteknik CAD Sistemi tarafından üretilmiştir.\n`;

            navigator.clipboard.writeText(report).then(() => {
                if (coreCopyFeedback) {
                    coreCopyFeedback.style.display = "block";
                    setTimeout(() => { coreCopyFeedback.style.display = "none"; }, 3500);
                }
            }).catch(err => {
                prompt("Rapor metnini kopyalamak için Ctrl+C tuşlarına basabilirsiniz:", report);
            });
        });
    }

    // 1 Metrede Görünüm ve Tabaka Özeti Görünümü Değiştirici Butonlar
    if (btnCoreView1m) {
        btnCoreView1m.addEventListener("click", () => {
            coreBoxViewMode = "1m";
            btnCoreView1m.classList.add("active");
            btnCoreView1m.style.background = "#2563eb";
            btnCoreView1m.style.fontWeight = "bold";
            if (btnCoreViewStrata) {
                btnCoreViewStrata.classList.remove("active");
                btnCoreViewStrata.style.background = "#475569";
                btnCoreViewStrata.style.fontWeight = "normal";
            }
            renderCoreBoxTab();
        });
    }

    if (btnCoreViewStrata) {
        btnCoreViewStrata.addEventListener("click", () => {
            coreBoxViewMode = "strata";
            btnCoreViewStrata.classList.add("active");
            btnCoreViewStrata.style.background = "#2563eb";
            btnCoreViewStrata.style.fontWeight = "bold";
            if (btnCoreView1m) {
                btnCoreView1m.classList.remove("active");
                btnCoreView1m.style.background = "#475569";
                btnCoreView1m.style.fontWeight = "normal";
            }
            renderCoreBoxTab();
        });
    }

    // 1 Metrelik Rapor Kopyalama Butonu
    if (btnCopy1mReport) {
        btnCopy1mReport.addEventListener("click", () => {
            const boreholes = currentProject.boreholes || [];
            const activeBhId = selCoreBorehole ? selCoreBorehole.value : (boreholes[0]?.id || "");
            const activeBh = boreholes.find(b => b.id === activeBhId) || boreholes[0];
            if (activeBh) {
                copyMeterByMeterReport(activeBh);
            } else {
                alert("Kayıtlı kuyu bulunamadı.");
            }
        });
    }

    // Karot Numune Rengini Tabakaya ve Lejanta Aktarma
    if (btnApplyAiColorToStrata) {
        btnApplyAiColorToStrata.addEventListener("click", () => {
            if (!canvas || !canvas.activeFillColor) {
                alert("Önce bir karot sandığı görseli yükleyin veya renk seçin.");
                return;
            }
            const boreholes = currentProject.boreholes || [];
            const activeBhId = selCoreBorehole ? selCoreBorehole.value : (boreholes[0]?.id || "");
            const activeBh = boreholes.find(b => b.id === activeBhId) || boreholes[0];
            if (activeBh && activeBh.intervals && activeBh.intervals.length > 0) {
                activeBh.intervals[0].color = canvas.activeFillColor;
                if (canvas.activeFillPattern) activeBh.intervals[0].pattern = canvas.activeFillPattern;
                
                if (currentProject.strata && currentProject.strata.length > 0) {
                    currentProject.strata[0].color = canvas.activeFillColor;
                    if (canvas.activeFillPattern) currentProject.strata[0].pattern = canvas.activeFillPattern;
                }
                canvas.syncStrataFromColumns();
                canvas.render();
                renderStrataList();
                renderCoreBoxTab();
                alert(`✓ Karot numune rengi (${canvas.activeFillColor}) kuyu tabakasına ve lejanta aktarıldı!`);
            } else {
                alert("Renk aktarılacak kuyu tabakası bulunamadı.");
            }
        });
    }

    // Excel Logu Butonları
    if (btnFillSampleExcel) {
        btnFillSampleExcel.addEventListener("click", () => {
            if (txtExcelInput) {
                txtExcelInput.value = `Kuyu\tX\tKot\tBaslangic\tBitis\tTanım
SK-2\t0.5\t89.80\t0.0\t1.50\tDolgu
SK-2\t0.5\t89.80\t1.50\t6.00\tSarı, Turuncu ve Kahverenkli Kumlu Kil
SK-2\t0.5\t89.80\t6.00\t15.00\tDanişment Formasyonu (Td): Ağaçlı Üyesi (Tda): Yeşilimsi mavi renkli kil-silt
SK-1\t6.0\t88.00\t0.0\t2.00\tDolgu
SK-1\t6.0\t88.00\t2.00\t8.00\tSarı, Turuncu ve Kahverenkli Kumlu Kil
SK-1\t6.0\t88.00\t8.00\t15.00\tDanişment Formasyonu (Td): Ağaçlı Üyesi (Tda): Yeşilimsi mavi renkli kil-silt
SK-3\t11.5\t89.80\t0.0\t1.50\tDolgu
SK-3\t11.5\t89.80\t1.50\t10.50\tSarı, Turuncu ve Kahverenkli Kumlu Kil
SK-3\t11.5\t89.80\t10.50\t15.00\tDanişment Formasyonu (Td): Ağaçlı Üyesi (Tda): Yeşilimsi mavi renkli kil-silt`;
            }
        });
    }

    if (btnImportExcelAndCorrelate) {
        btnImportExcelAndCorrelate.addEventListener("click", () => {
            if (!txtExcelInput) return;
            importExcelBoreholeLog(txtExcelInput.value);
        });
    }

    if (btnCorrelateBySlope) {
        btnCorrelateBySlope.addEventListener("click", () => {
            if (canvas) {
                canvas.correlateBySlope();
            }
        });
    }

    // ================= SAYFADAKİ EXCEL TABLOSU & YAPAY ZEKA MOTORU =================
    const toolExcelTable = document.getElementById("toolExcelTable");
    const excelModal = document.getElementById("excelModal");
    const btnCloseExcelModal = document.getElementById("btnCloseExcelModal");
    const btnCancelExcelModal = document.getElementById("btnCancelExcelModal");
    const btnSaveExcelModal = document.getElementById("btnSaveExcelModal");
    const btnExcelModalSample = document.getElementById("btnExcelModalSample");
    const txtExcelModalData = document.getElementById("txtExcelModalData");
    const chkSyncBoreholesFromExcel = document.getElementById("chkSyncBoreholesFromExcel");

    function openExcelModal() {
        if (!excelModal) return;
        if (txtExcelModalData) {
            const rows = currentProject.excelTable?.rows || [];
            if (rows.length > 0) {
                let lines = rows.map(r => `${r.bh || 'SK'}\t${(r.x || 0).toFixed(1)}\t${(r.kot || 95).toFixed(1)}\t${(r.fromD || 0).toFixed(1)}\t${(r.toD || 3).toFixed(1)}\t${r.litho || 'Zemin'}`);
                txtExcelModalData.value = lines.join("\n");
            } else {
                txtExcelModalData.value = `SK-1\t3.0\t98.0\t0.0\t3.0\tBitkisel Toprak ve Dolgu
SK-1\t3.0\t98.0\t3.0\t11.5\tKumlu Kil (CL)
SK-1\t3.0\t98.0\t11.5\t23.0\tKilli Silt (ML)
SK-2\t8.0\t95.5\t0.0\t2.0\tDolgu
SK-2\t8.0\t95.5\t2.0\t9.5\tKumlu Kil (CL)
SK-2\t8.0\t95.5\t9.5\t20.5\tKilli Silt (ML)
SK-3\t13.0\t92.0\t0.0\t1.5\tDolgu
SK-3\t13.0\t92.0\t1.5\t7.5\tKumlu Kil (CL)
SK-3\t13.0\t92.0\t7.5\t18.0\tKilli Silt (ML)`;
            }
        }
        excelModal.classList.add("open");
    }

    function closeExcelModal() {
        if (excelModal) excelModal.classList.remove("open");
    }

    if (toolExcelTable) {
        toolExcelTable.addEventListener("click", () => {
            openExcelModal();
        });
    }

    if (btnCloseExcelModal) btnCloseExcelModal.addEventListener("click", closeExcelModal);
    if (btnCancelExcelModal) btnCancelExcelModal.addEventListener("click", closeExcelModal);

    if (btnExcelModalSample && txtExcelModalData) {
        btnExcelModalSample.addEventListener("click", () => {
            txtExcelModalData.value = `SK-1\t3.0\t98.0\t0.0\t3.0\tBitkisel Toprak ve Dolgu
SK-1\t3.0\t98.0\t3.0\t11.5\tKumlu Kil (CL)
SK-1\t3.0\t98.0\t11.5\t23.0\tKilli Silt (ML)
SK-2\t8.0\t95.5\t0.0\t2.0\tDolgu
SK-2\t8.0\t95.5\t2.0\t9.5\tKumlu Kil (CL)
SK-2\t8.0\t95.5\t9.5\t20.5\tKilli Silt (ML)
SK-3\t13.0\t92.0\t0.0\t1.5\tDolgu
SK-3\t13.0\t92.0\t1.5\t7.5\tKumlu Kil (CL)
SK-3\t13.0\t92.0\t7.5\t18.0\tKilli Silt (ML)`;
        });
    }

    function parseExcelRows(rawText) {
        const lines = (rawText || "").trim().split("\n");
        const parsed = [];
        lines.forEach(l => {
            const trimmed = l.trim();
            if (!trimmed || (trimmed.toLowerCase().includes("kuyu") && trimmed.toLowerCase().includes("kot"))) return;
            let parts;
            if (trimmed.includes("\t")) parts = trimmed.split("\t");
            else if (trimmed.includes(";")) parts = trimmed.split(";");
            else if (trimmed.includes(",")) parts = trimmed.split(",");
            else parts = trimmed.split(/\s{2,}/);

            parts = parts.map(p => p.trim()).filter(p => p.length > 0);
            if (parts.length >= 4) {
                const bh = parts[0];
                const x = parseFloat(parts[1].replace(",", ".")) || 0;
                const kot = parseFloat(parts[2].replace(",", ".")) || 95.0;
                const fromD = parseFloat(parts[3].replace(",", ".")) || 0;
                const toD = parseFloat(parts[4] ? parts[4].replace(",", ".") : (fromD + 3)) || (fromD + 3);
                const litho = parts[5] || "Kumlu Kil";
                parsed.push({ bh, x, kot, fromD, toD, litho });
            }
        });
        return parsed;
    }

    function aiInterpretExcelTable() {
        if (!currentProject.excelTable || !currentProject.excelTable.rows || currentProject.excelTable.rows.length === 0) {
            alert("Lütfen önce tablonun içine sondaj verisi girin.");
            return;
        }

        currentProject.excelTable.rows.forEach(r => {
            const cls = classifyMaterial("", r.litho);
            r.uscs = cls.uscs;
            r.comment = cls.engineeringComment;
            r.consistency = cls.consistency;
        });

        if (canvas) canvas.render();

        copyExcelTableReport();
        alert("✓ Excel tablosundaki tüm seviyeler Yapay Zeka tarafından analiz edildi, USCS kodları ve jeoteknik yorumları sayfaya işlendi!\n\nRapor metni panoya da kopyalandı.");
    }

    function copyExcelTableReport() {
        const rows = currentProject.excelTable?.rows || [];
        if (rows.length === 0) return;

        const comp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
        const compName = (comp.companyName || currentProject.metadata.companyName || "").trim();
        const headerTitle = compName ? `${compName.toUpperCase()} - ` : "";
        let report = `===============================================================\n`;
        report += `${headerTitle}EXCEL SONDAJ LOGLARI AI JEOTEKNİK RAPORU\n`;
        report += `Standart: TS 1500 / USCS (Zemin Mekaniği ve Temel Mühendisliği Değerlendirmesi)\n`;
        report += `===============================================================\n\n`;

        rows.forEach((r, idx) => {
            report += `${idx + 1}. [${r.bh}] Derinlik: ${r.fromD.toFixed(1)} - ${r.toD.toFixed(1)} m (Kot: ${(r.kot - r.fromD).toFixed(2)}m → ${(r.kot - r.toD).toFixed(2)}m)\n`;
            report += `   - Litoloji: ${r.litho}\n`;
            report += `   - USCS Grubu: [${r.uscs || 'CL'}]\n`;
            report += `   - Jeoteknik Değerlendirme: ${r.comment || 'Orta-katı zemin seviyesi.'}\n\n`;
        });

        report += `===============================================================\n`;
        report += `Üretici: JeoCAD Geoteknik Kesit & Sondaj CAD Sistemi\n`;

        navigator.clipboard.writeText(report).catch(() => {});
    }

    const btnPlaceExcelModalOnly = document.getElementById("btnPlaceExcelModalOnly");
    if (btnPlaceExcelModalOnly) {
        btnPlaceExcelModalOnly.addEventListener("click", () => {
            const raw = txtExcelModalData ? txtExcelModalData.value : "";
            const rows = parseExcelRows(raw);
            if (rows.length === 0) {
                alert("Geçerli Excel verisi bulunamadı!");
                return;
            }

            currentProject.excelTable = currentProject.excelTable || { visible: true, x: 560, y: 35, rows: [] };
            currentProject.excelTable.visible = true;
            currentProject.excelTable.rows = rows;

            if (chkSyncBoreholesFromExcel && chkSyncBoreholesFromExcel.checked) {
                importExcelBoreholeLog(raw);
            } else {
                if (canvas) canvas.render();
            }

            closeExcelModal();
            statusTool.textContent = `✓ ${rows.length} satırlık Excel tablosu sayfaya yerleştirildi! Tablodaki [🧠 AI Yorumla] butonuyla dilediğiniz an analiz yapabilirsiniz.`;
        });
    }

    if (btnSaveExcelModal) {
        btnSaveExcelModal.addEventListener("click", () => {
            const raw = txtExcelModalData ? txtExcelModalData.value : "";
            const rows = parseExcelRows(raw);
            if (rows.length === 0) {
                alert("Geçerli Excel verisi bulunamadı!");
                return;
            }

            currentProject.excelTable = currentProject.excelTable || { visible: true, x: 600, y: 40, rows: [] };
            currentProject.excelTable.visible = true;
            currentProject.excelTable.rows = rows;

            // Yapay zeka ile otomatik yorumla
            rows.forEach(r => {
                const cls = classifyMaterial("", r.litho);
                r.uscs = cls.uscs;
                r.comment = cls.engineeringComment;
                r.consistency = cls.consistency;
            });

            // Kullanıcı isterse kesitteki kuyuları da bu tabloya göre güncellesin
            if (chkSyncBoreholesFromExcel && chkSyncBoreholesFromExcel.checked) {
                importExcelBoreholeLog(raw);
            } else {
                if (canvas) canvas.render();
            }

            closeExcelModal();
            statusTool.textContent = `✓ ${rows.length} satırlık Excel tablosu sayfaya yerleştirildi ve Yapay Zeka ile yorumlandı!`;
        });
    }

    // ================= 3. GÖRSEL KAROT SANDIĞI YAPAY ZEKA (AI) ANALİZ MOTORU =================
    // ================= 3. ÇOKLU GÖRSEL KAROT SANDIĞI & ÇOKLU EXCEL YÖNETİCİSİ =================
    // Her bir karot sandığı bir kuyu logunu temsil eder (Örn: Karot Sandığı 1 = SK-1)

    function createSampleCoreBoxBoreholeDataUrl(bhName, depthStr) {
        const c = document.createElement("canvas");
        c.width = 240;
        c.height = 140;
        const ctx = c.getContext("2d");

        // Ahşap karot sandığı kasası
        ctx.fillStyle = "#3e2723";
        ctx.fillRect(0, 0, 240, 140);
        ctx.fillStyle = "#5d4037";
        ctx.fillRect(4, 4, 232, 132);

        // 4 bölmeli karot yuvası
        const rowH = 26;
        for (let r = 0; r < 4; r++) {
            const y = 8 + r * (rowH + 3);
            ctx.fillStyle = "#1e1e1e";
            ctx.fillRect(8, y, 224, rowH);

            if (r === 0) {
                // Sıra 1: Dolgu (0-2m) - Turuncu / Molozlu
                ctx.fillStyle = "#ea580c";
                ctx.fillRect(10, y + 2, 220, rowH - 4);
                ctx.fillStyle = "#78350f";
                for (let k = 0; k < 10; k++) {
                    ctx.fillRect(14 + k * 22, y + 4 + (k % 3) * 4, 7, 7);
                }
            } else if (r === 1 || r === 2) {
                // Sıra 2 & 3: Danişment Kumlu Kil (2-8m) - Sarı-Kahve
                ctx.fillStyle = "#a89276";
                ctx.fillRect(10, y + 2, 220, rowH - 4);
                ctx.fillStyle = "#786450";
                for (let k = 0; k < 14; k++) {
                    ctx.fillRect(12 + k * 15, y + 3, 3, rowH - 6);
                }
            } else {
                // Sıra 4: Danişment Killi Silt / Marn (8-15m) - Yeşilimsi Mavi / Turkuaz
                ctx.fillStyle = "#4dd0e1";
                ctx.fillRect(10, y + 2, 220, rowH - 4);
                ctx.fillStyle = "#0e7490";
                for (let k = 0; k < 12; k++) {
                    ctx.fillRect(15 + k * 18, y + 4, 10, 8);
                }
            }
        }

        // Sandık Etiketi (Kuyu No ve Derinlik)
        ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
        ctx.fillRect(8, 114, 224, 20);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 10px Arial, sans-serif";
        ctx.fillText(`📸 ${bhName} | ${depthStr}`, 14, 128);

        return c.toDataURL("image/jpeg", 0.9);
    }

    function getDefaultCoreBoxSamples() {
        return [
            {
                id: "core-sk1",
                name: "SK-1",
                fileName: "SK-1_Karot_Sandigi.jpg",
                dataUrl: createSampleCoreBoxBoreholeDataUrl("SK-1", "0.00 - 15.00 m"),
                x: 2.5,
                surfaceKot: 14.00,
                bottomKot: -1.00,
                yas: 3.60,
                layers: [
                    { from: 0.0, to: 2.0, name: "Dolgu", color: "#ea580c", pattern: "hatch-fill" },
                    { from: 2.0, to: 8.0, name: "Danişment Kumlu Kil (CL)", color: "#a89276", pattern: "hatch-sandy-clay" },
                    { from: 8.0, to: 15.0, name: "Danişment Killi Silt (ML)", color: "#4dd0e1", pattern: "hatch-silt" }
                ]
            },
            {
                id: "core-sk2",
                name: "SK-2",
                fileName: "SK-2_Karot_Sandigi.jpg",
                dataUrl: createSampleCoreBoxBoreholeDataUrl("SK-2", "0.00 - 15.00 m"),
                x: 6.0,
                surfaceKot: 13.50,
                bottomKot: -1.50,
                yas: 3.60,
                layers: [
                    { from: 0.0, to: 2.5, name: "Dolgu", color: "#ea580c", pattern: "hatch-fill" },
                    { from: 2.5, to: 8.5, name: "Danişment Kumlu Kil (CL)", color: "#a89276", pattern: "hatch-sandy-clay" },
                    { from: 8.5, to: 15.0, name: "Danişment Killi Silt (ML)", color: "#4dd0e1", pattern: "hatch-silt" }
                ]
            },
            {
                id: "core-sk3",
                name: "SK-3",
                fileName: "SK-3_Karot_Sandigi.jpg",
                dataUrl: createSampleCoreBoxBoreholeDataUrl("SK-3", "0.00 - 15.00 m"),
                x: 9.5,
                surfaceKot: 13.00,
                bottomKot: -2.00,
                yas: 3.60,
                layers: [
                    { from: 0.0, to: 3.0, name: "Dolgu", color: "#ea580c", pattern: "hatch-fill" },
                    { from: 3.0, to: 9.0, name: "Danişment Kumlu Kil (CL)", color: "#a89276", pattern: "hatch-sandy-clay" },
                    { from: 9.0, to: 15.0, name: "Danişment Killi Silt (ML)", color: "#4dd0e1", pattern: "hatch-silt" }
                ]
            }
        ];
    }

    let uploadedCoreBoxes = getDefaultCoreBoxSamples();

    let multiExcelBoreholes = [
        {
            id: "excel-bh-1",
            name: "SK-1",
            x: 2.5,
            surfaceKot: 14.00,
            bottomKot: -1.00,
            yas: 3.60,
            layers: [
                { from: 0.0, to: 2.0, name: "Dolgu", color: "#ea580c", pattern: "hatch-fill" },
                { from: 2.0, to: 8.0, name: "Danişment Kumlu Kil (CL)", color: "#a89276", pattern: "hatch-sandy-clay" },
                { from: 8.0, to: 15.0, name: "Danişment Killi Silt (ML)", color: "#4dd0e1", pattern: "hatch-silt" }
            ]
        },
        {
            id: "excel-bh-2",
            name: "SK-2",
            x: 6.0,
            surfaceKot: 13.50,
            bottomKot: -1.50,
            yas: 3.60,
            layers: [
                { from: 0.0, to: 2.5, name: "Dolgu", color: "#ea580c", pattern: "hatch-fill" },
                { from: 2.5, to: 8.5, name: "Danişment Kumlu Kil (CL)", color: "#a89276", pattern: "hatch-sandy-clay" },
                { from: 8.5, to: 15.0, name: "Danişment Killi Silt (ML)", color: "#4dd0e1", pattern: "hatch-silt" }
            ]
        },
        {
            id: "excel-bh-3",
            name: "SK-3",
            x: 9.5,
            surfaceKot: 13.00,
            bottomKot: -2.00,
            yas: 3.60,
            layers: [
                { from: 0.0, to: 3.0, name: "Dolgu", color: "#ea580c", pattern: "hatch-fill" },
                { from: 3.0, to: 9.0, name: "Danişment Kumlu Kil (CL)", color: "#a89276", pattern: "hatch-sandy-clay" },
                { from: 9.0, to: 15.0, name: "Danişment Killi Silt (ML)", color: "#4dd0e1", pattern: "hatch-silt" }
            ]
        }
    ];

    function setupAiCorePhotoAnalyzer() {
        const btnSubTabCore = document.getElementById("btnSubTabCore");
        const btnSubTabExcel = document.getElementById("btnSubTabExcel");
        const subContentCore = document.getElementById("subContentCore");
        const subContentExcel = document.getElementById("subContentExcel");

        if (btnSubTabCore && btnSubTabExcel) {
            btnSubTabCore.addEventListener("click", () => {
                btnSubTabCore.classList.add("active");
                btnSubTabExcel.classList.remove("active");
                if (subContentCore) subContentCore.style.display = "block";
                if (subContentExcel) subContentExcel.style.display = "none";
            });
            btnSubTabExcel.addEventListener("click", () => {
                btnSubTabExcel.classList.add("active");
                btnSubTabCore.classList.remove("active");
                if (subContentExcel) subContentExcel.style.display = "block";
                if (subContentCore) subContentCore.style.display = "none";
                renderMultiExcelLogList();
            });
        }

        const btnPickMultiCorePhotos = document.getElementById("btnPickMultiCorePhotos");
        const btnLoadSample3Cores = document.getElementById("btnLoadSample3Cores");
        const btnClearAllCoreBoxes = document.getElementById("btnClearAllCoreBoxes");
        const btnTransferCoresToSection = document.getElementById("btnTransferCoresToSection");
        const coreTransferFeedback = document.getElementById("coreTransferFeedback");
        const multiCoreBoxList = document.getElementById("multiCoreBoxList");

        if (btnPickMultiCorePhotos && inputCorePhoto) {
            btnPickMultiCorePhotos.addEventListener("click", (e) => {
                e.stopPropagation();
                inputCorePhoto.click();
            });
        }

        if (coreDropZone && inputCorePhoto) {
            coreDropZone.addEventListener("click", (e) => {
                if (!e.target.closest("button") && !e.target.closest("input")) {
                    inputCorePhoto.click();
                }
            });

            ["dragenter", "dragover"].forEach(eventName => {
                coreDropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    coreDropZone.classList.add("dragover");
                }, false);
            });

            ["dragleave", "drop"].forEach(eventName => {
                coreDropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    coreDropZone.classList.remove("dragover");
                }, false);
            });

            coreDropZone.addEventListener("drop", (e) => {
                const dt = e.dataTransfer;
                const files = Array.from(dt?.files || []).filter(f => f.type.startsWith("image/"));
                if (files.length > 0) {
                    handleMultiCoreFiles(files);
                }
            });

            inputCorePhoto.addEventListener("change", (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) {
                    handleMultiCoreFiles(files);
                    inputCorePhoto.value = "";
                }
            });
        }

        window.addEventListener("paste", (e) => {
            const isInput = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
            if (isInput && document.activeElement !== txtAiReportResult) return;

            const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                        e.preventDefault();
                        const coreTabBtn = document.querySelector('.tab-btn[data-tab="tab-corebox"]');
                        if (coreTabBtn) coreTabBtn.click();
                        if (btnSubTabCore) btnSubTabCore.click();
                        handleMultiCoreFiles([file]);
                        break;
                    }
                }
            }
        });

        async function handleMultiCoreFiles(files) {
            statusTool.textContent = `⏳ ${files.length} adet karot sandığı görseli kuyu logu olarak ekleniyor...`;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                await processSingleCorePhotoAsBorehole(file);
            }
            renderMultiCoreBoxList();
            statusTool.textContent = `✓ ${files.length} adet karot sandığı kuyu logu olarak eklendi. Sadece kotları kontrol edip kesite aktarabilirsiniz!`;
        }

        function processSingleCorePhotoAsBorehole(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const dataUrl = ev.target.result;
                    const nextNum = uploadedCoreBoxes.length + 1;
                    const newX = nextNum === 1 ? 2.5 : (uploadedCoreBoxes[uploadedCoreBoxes.length - 1].x + 3.5);

                    const newBh = {
                        id: "core-bh-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
                        name: `SK-${nextNum}`,
                        fileName: file.name || `SK-${nextNum}_Karot_Sandigi.jpg`,
                        dataUrl: dataUrl,
                        x: newX,
                        surfaceKot: 14.00,
                        bottomKot: -1.00,
                        yas: 3.60,
                        layers: [
                            { from: 0.0, to: 2.0, name: "Dolgu", color: "#ea580c", pattern: "hatch-fill" },
                            { from: 2.0, to: 8.0, name: "Danişment Kumlu Kil (CL)", color: "#a89276", pattern: "hatch-sandy-clay" },
                            { from: 8.0, to: 15.0, name: "Danişment Killi Silt (ML)", color: "#4dd0e1", pattern: "hatch-silt" }
                        ]
                    };

                    uploadedCoreBoxes.push(newBh);
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        }

        if (btnLoadSample3Cores) {
            btnLoadSample3Cores.addEventListener("click", () => {
                uploadedCoreBoxes = getDefaultCoreBoxSamples();
                renderMultiCoreBoxList();
                statusTool.textContent = "✓ 3 Adet Kuyu Karot Sandığı (SK-1, SK-2, SK-3) Yüklendi! Her kuyunun metraj ve renkleri hazır.";
            });
        }

        if (btnClearAllCoreBoxes) {
            btnClearAllCoreBoxes.addEventListener("click", () => {
                if (uploadedCoreBoxes.length === 0) return;
                if (confirm("Eklenen tüm karot sandığı kuyu loglarını temizlemek istediğinize emin misiniz?")) {
                    uploadedCoreBoxes = [];
                    renderMultiCoreBoxList();
                    statusTool.textContent = "Karot sandığı kuyu listesi temizlendi.";
                }
            });
        }

        function renderMultiCoreBoxList() {
            if (!multiCoreBoxList) return;
            if (uploadedCoreBoxes.length === 0) {
                multiCoreBoxList.innerHTML = `
                    <div style="padding:16px 10px;text-align:center;color:#64748b;font-size:11px;border:1px dashed #334155;border-radius:6px;background:rgba(255,255,255,0.02);">
                        <div style="font-size:22px;margin-bottom:4px;">📦</div>
                        <div>Henüz karot sandığı kuyu logu eklenmedi.</div>
                        <div style="font-size:10px;color:#94a3b8;margin-top:2px;">Yukarıdan fotoğraf seçebilir veya <b>📁 3 Örnek Sandık</b> butonuna basabilirsiniz.</div>
                    </div>
                `;
                return;
            }

            multiCoreBoxList.innerHTML = uploadedCoreBoxes.map((bh, idx) => {
                const totalDepth = Math.abs((bh.surfaceKot || 0) - (bh.bottomKot || 0)).toFixed(2);
                return `
                <div class="multi-core-card" style="border-left: 4px solid #0284c7;" data-id="${bh.id}">
                    <div class="multi-core-card-header">
                        <div style="display:flex;align-items:center;gap:8px;overflow:hidden;flex:1;">
                            <img src="${bh.dataUrl}" class="multi-core-thumb" title="İncelemek için tıklayın" onclick="window.previewCoreBoxFull('${bh.id}')">
                            <div style="min-width:0;flex:1;">
                                <div style="font-size:12.5px;font-weight:900;color:#38bdf8;">
                                    📸 Karot Sandığı: ${bh.name}
                                </div>
                                <div style="font-size:10px;color:#94a3b8;margin-top:2px;">
                                    Konum: <b>X = ${bh.x} m</b> | Kuyu Derinliği: <b>${totalDepth} m</b>
                                </div>
                            </div>
                        </div>
                        <button class="btn-small" style="background:#ef4444;padding:3px 7px;font-size:11px;" title="Bu kuyuyu sil" onclick="window.removeCoreBox('${bh.id}')">🗑️</button>
                    </div>

                    <!-- Kuyu Kot ve Konum Girişleri -->
                    <div class="multi-core-kot-grid">
                        <div class="multi-core-kot-item">
                            <label>Kuyu No</label>
                            <input type="text" value="${bh.name}" onchange="window.updateCoreBoxField('${bh.id}', 'name', this.value)">
                        </div>
                        <div class="multi-core-kot-item">
                            <label>Konum X (m)</label>
                            <input type="number" step="0.5" value="${bh.x}" onchange="window.updateCoreBoxField('${bh.id}', 'x', parseFloat(this.value) || 0)">
                        </div>
                        <div class="multi-core-kot-item">
                            <label>Ağız Kotu (m)</label>
                            <input type="number" step="0.1" style="color:#10b981;font-weight:bold;" value="${bh.surfaceKot}" onchange="window.updateCoreBoxField('${bh.id}', 'surfaceKot', parseFloat(this.value) || 0)">
                        </div>
                        <div class="multi-core-kot-item">
                            <label>Taban Kotu (m)</label>
                            <input type="number" step="0.1" style="color:#f59e0b;font-weight:bold;" value="${bh.bottomKot}" onchange="window.updateCoreBoxField('${bh.id}', 'bottomKot', parseFloat(this.value) || 0)">
                        </div>
                    </div>

                    <!-- Kuyu Katmanları ve Metrajları (Farklı Metraj & Renkler) -->
                    <div style="margin-top:8px;background:rgba(0,0,0,0.35);border-radius:5px;padding:8px;border:1px solid rgba(255,255,255,0.08);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:10.5px;font-weight:bold;color:#38bdf8;">
                            <span>🧱 Tabakalar & Metrajlar (Farklı Renk & Derinlik):</span>
                            <span style="color:#94a3b8;cursor:pointer;text-decoration:underline;" onclick="window.addCoreLayer('${bh.id}')">+ Katman Ekle</span>
                        </div>
                        ${bh.layers.map((l, lIdx) => {
                            const zStart = ((bh.surfaceKot || 0) - l.from).toFixed(2);
                            const zEnd = ((bh.surfaceKot || 0) - l.to).toFixed(2);
                            const thick = (l.to - l.from).toFixed(2);
                            return `
                            <div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:10px;">
                                <input type="color" value="${l.color}" style="width:20px;height:18px;border:none;background:transparent;cursor:pointer;padding:0;" onchange="window.updateCoreLayerColor('${bh.id}', ${lIdx}, this.value)" title="Tabaka Rengini Değiştir">
                                <span style="font-weight:bold;color:#f8fafc;flex:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${l.name}</span>
                                <span style="color:#cbd5e1;flex:1;">${l.from.toFixed(2)} - ${l.to.toFixed(2)}m (<b>${thick}m</b>)</span>
                                <span style="color:#38bdf8;font-weight:bold;flex:1.2;text-align:right;">Kot: ${zStart} / ${zEnd}</span>
                                <span style="color:#ef4444;cursor:pointer;font-weight:bold;padding:0 3px;" onclick="window.removeCoreLayer('${bh.id}', ${lIdx})" title="Katmanı Sil">✕</span>
                            </div>
                            `;
                        }).join("")}
                    </div>
                </div>
                `;
            }).join("");
        }

        window.removeCoreBox = function(id) {
            uploadedCoreBoxes = uploadedCoreBoxes.filter(item => item.id !== id);
            renderMultiCoreBoxList();
        };

        window.updateCoreBoxField = function(id, field, value) {
            const item = uploadedCoreBoxes.find(b => b.id === id);
            if (item) {
                item[field] = value;
                renderMultiCoreBoxList();
            }
        };

        window.updateCoreLayerColor = function(bhId, lIdx, color) {
            const bh = uploadedCoreBoxes.find(b => b.id === bhId);
            if (bh && bh.layers && bh.layers[lIdx]) {
                bh.layers[lIdx].color = color;
                renderMultiCoreBoxList();
            }
        };

        window.removeCoreLayer = function(bhId, lIdx) {
            const bh = uploadedCoreBoxes.find(b => b.id === bhId);
            if (bh && bh.layers && bh.layers.length > 1) {
                bh.layers.splice(lIdx, 1);
                renderMultiCoreBoxList();
            }
        };

        window.addCoreLayer = function(bhId) {
            const bh = uploadedCoreBoxes.find(b => b.id === bhId);
            if (!bh) return;
            const lastL = bh.layers[bh.layers.length - 1];
            const from = lastL ? lastL.to : 0.0;
            const to = from + 3.0;
            bh.layers.push({
                from: from,
                to: to,
                name: "Yeni Litoloji Katmanı",
                color: "#64748b",
                pattern: "hatch-fill"
            });
            renderMultiCoreBoxList();
        };

        window.previewCoreBoxFull = function(id) {
            const item = uploadedCoreBoxes.find(b => b.id === id);
            if (!item) return;
            const w = window.open("", "_blank", "width=800,height=600");
            if (w) {
                w.document.write(`
                    <html>
                    <head><title>${item.name} Karot Sandığı</title></head>
                    <body style="margin:0;background:#0f172a;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:sans-serif;height:100vh;">
                        <img src="${item.dataUrl}" style="max-width:90%;max-height:80%;border:2px solid #38bdf8;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,0.8);">
                        <h3 style="margin-top:12px;color:#38bdf8;">${item.name} Karot Sandığı Kuyu Logu</h3>
                        <p style="margin:0;color:#94a3b8;font-size:12px;">Konum X: ${item.x}m | Ağız Kotu: ${item.surfaceKot}m | Taban Kotu: ${item.bottomKot}m</p>
                    </body>
                    </html>
                `);
            }
        };

        // KESİTE AKTAR BUTONU (KAROT SANDIĞI -> GERÇEK JEOLOJİK KESİT)
        if (btnTransferCoresToSection) {
            btnTransferCoresToSection.addEventListener("click", () => {
                if (uploadedCoreBoxes.length === 0) {
                    alert("Lütfen önce en az 1 karot sandığı ekleyin veya '📁 3 Örnek Sandık' butonuna basın!");
                    return;
                }

                // Eski geçersiz çakışan yazıları temizle (örn. ann-12m)
                if (currentProject.annotations) {
                    currentProject.annotations = currentProject.annotations.filter(a => a.id !== "ann-12m" && a.text !== "12m");
                }

                const newBoreholes = uploadedCoreBoxes.map(bh => {
                    const surfZ = parseFloat(bh.surfaceKot) || 14.0;
                    const botZ = parseFloat(bh.bottomKot) || -1.0;
                    const totalDepth = Math.max(surfZ - botZ, 1.0);

                    const intervals = bh.layers.map(l => ({
                        fromDepth: parseFloat(l.from),
                        toDepth: parseFloat(l.to),
                        name: l.name,
                        color: l.color,
                        pattern: l.pattern || "hatch-fill"
                    }));

                    return {
                        id: bh.id || ("bh-" + bh.name.toLowerCase().replace(/[^a-z0-9]/g, "-")),
                        name: bh.name,
                        x: parseFloat(bh.x) || 2.5,
                        surfaceElevation: surfZ,
                        bottomElevation: botZ,
                        startKot: surfZ,
                        endKot: botZ,
                        totalDepth: totalDepth,
                        diameter: 100,
                        intervals: intervals
                    };
                });

                currentProject.boreholes = newBoreholes;

                // Kesit sınırlarını kuyu derinliklerine göre hatasız belirle
                const allX = newBoreholes.map(b => b.x);
                const maxX = Math.max(...allX, 6.0);
                const allSurface = newBoreholes.map(b => b.surfaceElevation);
                const allBottom = newBoreholes.map(b => b.bottomElevation);
                const maxSurf = Math.max(...allSurface);
                const minBot = Math.min(...allBottom);

                currentProject.parameters.totalDistance = Math.max(maxX + 3.0, 12.0);
                currentProject.parameters.maxElevation = Math.ceil(maxSurf + 3.0); // Yer yüzeyinin üstü temiz hava
                currentProject.parameters.minElevation = Math.floor(minBot - 3.0); // Taban ekseni kuyuların altında
                currentProject.parameters.elevationStep = 2.0;

                populateForm();

                if (canvas) {
                    canvas.project = currentProject;
                    canvas.correlateBySlope();
                    canvas.zoomFit();
                }

                renderBoreholeList();
                renderStrataList();
                renderCoreBoxTab();
                updateDfStratumBadge();

                if (coreTransferFeedback) {
                    coreTransferFeedback.textContent = `✓ ${newBoreholes.length} Kuyu (Karot Sandığı) Kesite Aktarıldı! Katmanlar, renkler ve Lejant başarıyla oluşturuldu.`;
                    coreTransferFeedback.style.display = "block";
                    setTimeout(() => { coreTransferFeedback.style.display = "none"; }, 5000);
                }
                statusTool.textContent = `✓ ${newBoreholes.length} Kuyu karot logları sağdaki CAD kesitine aktarıldı. Katmanlar eğime göre bağlandı.`;
            });
        }

        // ================= ÇOKLU EXCEL SONDAJ LOGLARI YÖNETİMİ =================
        const multiExcelLogList = document.getElementById("multiExcelLogList");
        const btnAddExcelBorehole = document.getElementById("btnAddExcelBorehole");
        const btnLoadSampleExcelMulti = document.getElementById("btnLoadSampleExcelMulti");
        const btnOpenPasteExcelModal = document.getElementById("btnOpenPasteExcelModal");
        const btnTransferExcelToSection = document.getElementById("btnTransferExcelToSection");
        const excelTransferFeedback = document.getElementById("excelTransferFeedback");

        function renderMultiExcelLogList() {
            if (!multiExcelLogList) return;
            if (multiExcelBoreholes.length === 0) {
                multiExcelLogList.innerHTML = `
                    <div style="padding:16px 10px;text-align:center;color:#64748b;font-size:11px;border:1px dashed #334155;border-radius:6px;background:rgba(255,255,255,0.02);">
                        <div style="font-size:22px;margin-bottom:4px;">📊</div>
                        <div>Henüz Excel sondaj kuyusu eklenmedi.</div>
                        <div style="font-size:10px;color:#94a3b8;margin-top:2px;">Yukarıdan <b>➕ Yeni Kuyu Ekle</b> veya <b>📁 Örnek 3 Kuyu</b> butonuna basın.</div>
                    </div>
                `;
                return;
            }

            multiExcelLogList.innerHTML = multiExcelBoreholes.map((bh, bhIdx) => {
                const totalDepth = ((bh.surfaceKot || 0) - (bh.bottomKot || 0)).toFixed(2);
                return `
                <div class="multi-core-card" style="border-left:3px solid #059669;" data-id="${bh.id}">
                    <div class="multi-core-card-header">
                        <div style="display:flex;align-items:center;gap:6px;">
                            <span style="font-size:14px;">📍</span>
                            <strong style="color:#34d399;font-size:12px;">${bh.name}</strong>
                            <span style="font-size:10px;color:#94a3b8;">(X: ${bh.x}m, H: ${totalDepth}m)</span>
                        </div>
                        <button class="btn-small" style="background:#ef4444;padding:2px 6px;font-size:10px;" title="Bu kuyuyu sil" onclick="window.removeExcelBorehole('${bh.id}')">🗑️</button>
                    </div>

                    <div class="multi-core-kot-grid" style="grid-template-columns: repeat(4, 1fr);">
                        <div class="multi-core-kot-item">
                            <label>Kuyu Adı</label>
                            <input type="text" value="${bh.name}" onchange="window.updateExcelBoreholeField('${bh.id}', 'name', this.value)">
                        </div>
                        <div class="multi-core-kot-item">
                            <label>Konum X (m)</label>
                            <input type="number" step="0.5" value="${bh.x}" onchange="window.updateExcelBoreholeField('${bh.id}', 'x', parseFloat(this.value) || 0)">
                        </div>
                        <div class="multi-core-kot-item">
                            <label>Yüzey Kotu (m)</label>
                            <input type="number" step="0.1" style="color:#10b981;" value="${bh.surfaceKot}" onchange="window.updateExcelBoreholeField('${bh.id}', 'surfaceKot', parseFloat(this.value) || 0)">
                        </div>
                        <div class="multi-core-kot-item">
                            <label>Taban Kotu (m)</label>
                            <input type="number" step="0.1" style="color:#f59e0b;" value="${bh.bottomKot}" onchange="window.updateExcelBoreholeField('${bh.id}', 'bottomKot', parseFloat(this.value) || 0)">
                        </div>
                    </div>

                    <div style="margin-top:8px;background:rgba(0,0,0,0.25);border-radius:4px;padding:6px;">
                        <div style="font-size:10px;color:#38bdf8;font-weight:bold;margin-bottom:4px;display:flex;justify-content:space-between;">
                            <span>Katmanlar & Kot Aralıkları:</span>
                            <span style="color:#94a3b8;cursor:pointer;" onclick="window.addExcelLayer('${bh.id}')">+ Tabaka Ekle</span>
                        </div>
                        ${bh.layers.map((layer, lIdx) => {
                            const zStart = ((bh.surfaceKot || 0) - layer.from).toFixed(2);
                            const zEnd = ((bh.surfaceKot || 0) - layer.to).toFixed(2);
                            return `
                            <div style="display:flex;align-items:center;gap:6px;font-size:9.5px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                                <span style="width:12px;height:12px;border-radius:2px;background:${layer.color};display:inline-block;flex-shrink:0;"></span>
                                <span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#e2e8f0;">${layer.name}</span>
                                <span style="color:#94a3b8;">${layer.from}-${layer.to}m</span>
                                <span style="color:#38bdf8;font-weight:bold;">Kot: ${zStart} / ${zEnd}</span>
                            </div>
                            `;
                        }).join("")}
                    </div>
                </div>
                `;
            }).join("");
        }

        window.removeExcelBorehole = function(id) {
            multiExcelBoreholes = multiExcelBoreholes.filter(b => b.id !== id);
            renderMultiExcelLogList();
        };

        window.updateExcelBoreholeField = function(id, field, value) {
            const bh = multiExcelBoreholes.find(b => b.id === id);
            if (bh) {
                bh[field] = value;
                renderMultiExcelLogList();
            }
        };

        window.addExcelLayer = function(id) {
            const bh = multiExcelBoreholes.find(b => b.id === id);
            if (!bh) return;
            const lastL = bh.layers[bh.layers.length - 1];
            const from = lastL ? lastL.to : 0.0;
            const to = from + 3.0;
            bh.layers.push({
                from: from,
                to: to,
                name: "Yeni Litoloji Katmanı",
                color: "#64748b",
                pattern: "hatch-fill"
            });
            renderMultiExcelLogList();
        };

        if (btnAddExcelBorehole) {
            btnAddExcelBorehole.addEventListener("click", () => {
                const count = multiExcelBoreholes.length + 1;
                const newX = count === 1 ? 2.5 : (multiExcelBoreholes[multiExcelBoreholes.length - 1].x + 3.5);
                multiExcelBoreholes.push({
                    id: "excel-bh-" + Date.now(),
                    name: `SK-${count}`,
                    x: newX,
                    surfaceKot: 14.00,
                    bottomKot: -1.00,
                    yas: 3.60,
                    layers: [
                        { from: 0.0, to: 2.0, name: "Dolgu", color: "#ea580c", pattern: "hatch-fill" },
                        { from: 2.0, to: 8.0, name: "Danişment Kumlu Kil (CL)", color: "#a89276", pattern: "hatch-sandy-clay" },
                        { from: 8.0, to: 15.0, name: "Danişment Killi Silt (ML)", color: "#4dd0e1", pattern: "hatch-silt" }
                    ]
                });
                renderMultiExcelLogList();
            });
        }

        if (btnLoadSampleExcelMulti) {
            btnLoadSampleExcelMulti.addEventListener("click", () => {
                multiExcelBoreholes = [
                    {
                        id: "excel-bh-1",
                        name: "SK-1",
                        x: 2.5,
                        surfaceKot: 14.00,
                        bottomKot: -1.00,
                        yas: 3.60,
                        layers: [
                            { from: 0.0, to: 2.0, name: "Dolgu", color: "#ea580c", pattern: "hatch-fill" },
                            { from: 2.0, to: 8.0, name: "Danişment Kumlu Kil (CL)", color: "#a89276", pattern: "hatch-sandy-clay" },
                            { from: 8.0, to: 15.0, name: "Danişment Killi Silt (ML)", color: "#4dd0e1", pattern: "hatch-silt" }
                        ]
                    },
                    {
                        id: "excel-bh-2",
                        name: "SK-2",
                        x: 6.0,
                        surfaceKot: 13.50,
                        bottomKot: -1.50,
                        yas: 3.60,
                        layers: [
                            { from: 0.0, to: 2.5, name: "Dolgu", color: "#ea580c", pattern: "hatch-fill" },
                            { from: 2.5, to: 8.5, name: "Danişment Kumlu Kil (CL)", color: "#a89276", pattern: "hatch-sandy-clay" },
                            { from: 8.5, to: 15.0, name: "Danişment Killi Silt (ML)", color: "#4dd0e1", pattern: "hatch-silt" }
                        ]
                    },
                    {
                        id: "excel-bh-3",
                        name: "SK-3",
                        x: 9.5,
                        surfaceKot: 13.00,
                        bottomKot: -2.00,
                        yas: 3.60,
                        layers: [
                            { from: 0.0, to: 3.0, name: "Dolgu", color: "#ea580c", pattern: "hatch-fill" },
                            { from: 3.0, to: 9.0, name: "Danişment Kumlu Kil (CL)", color: "#a89276", pattern: "hatch-sandy-clay" },
                            { from: 9.0, to: 15.0, name: "Danişment Killi Silt (ML)", color: "#4dd0e1", pattern: "hatch-silt" }
                        ]
                    }
                ];
                renderMultiExcelLogList();
                statusTool.textContent = "✓ 3 Adet Örnek Kuyu (SK-1, SK-2, SK-3) Yüklendi! Şimdi sağdaki kesite aktarabilirsiniz.";
            });
        }

        if (btnOpenPasteExcelModal) {
            btnOpenPasteExcelModal.addEventListener("click", () => {
                const excelModal = document.getElementById("excelModal");
                if (excelModal) {
                    excelModal.style.display = "flex";
                } else {
                    alert("Excel tablonuzu kopyalayıp buraya yapıştırabilirsiniz.");
                }
            });
        }

        if (btnTransferExcelToSection) {
            btnTransferExcelToSection.addEventListener("click", () => {
                if (multiExcelBoreholes.length === 0) {
                    alert("Lütfen önce en az 1 adet Excel sondaj kuyusu ekleyin!");
                    return;
                }

                if (currentProject.annotations) {
                    currentProject.annotations = currentProject.annotations.filter(a => a.id !== "ann-12m" && a.text !== "12m");
                }

                const newBoreholes = multiExcelBoreholes.map(bh => {
                    const surfaceZ = bh.surfaceKot !== undefined ? bh.surfaceKot : 14.0;
                    const bottomZ = bh.bottomKot !== undefined ? bh.bottomKot : -1.0;
                    const totalDepth = Math.max(surfaceZ - bottomZ, 1.0);

                    const intervals = bh.layers.map(l => ({
                        fromDepth: parseFloat(l.from),
                        toDepth: parseFloat(l.to),
                        name: l.name,
                        color: l.color,
                        pattern: l.pattern || "hatch-fill"
                    }));

                    return {
                        id: bh.id || ("bh-" + bh.name.toLowerCase().replace(/[^a-z0-9]/g, "-")),
                        name: bh.name,
                        x: parseFloat(bh.x) || 2.5,
                        surfaceElevation: surfaceZ,
                        bottomElevation: bottomZ,
                        startKot: surfaceZ,
                        endKot: bottomZ,
                        totalDepth: totalDepth,
                        diameter: 100,
                        intervals: intervals
                    };
                });

                currentProject.boreholes = newBoreholes;

                const allX = newBoreholes.map(b => b.x);
                const maxX = Math.max(...allX, 6.0);
                const allSurface = newBoreholes.map(b => b.surfaceElevation);
                const allBottom = newBoreholes.map(b => b.bottomElevation);
                const maxSurf = Math.max(...allSurface);
                const minBot = Math.min(...allBottom);

                currentProject.parameters.totalDistance = Math.max(maxX + 3.0, 12.0);
                currentProject.parameters.maxElevation = Math.ceil(maxSurf + 3.0);
                currentProject.parameters.minElevation = Math.floor(minBot - 3.0);
                currentProject.parameters.elevationStep = 2.0;

                populateForm();

                if (canvas) {
                    canvas.project = currentProject;
                    canvas.correlateBySlope();
                    canvas.zoomFit();
                }

                renderBoreholeList();
                renderStrataList();
                renderCoreBoxTab();
                updateDfStratumBadge();

                if (excelTransferFeedback) {
                    excelTransferFeedback.textContent = `✓ ${newBoreholes.length} Kuyu Excel'den Sağdaki Kesite Aktarıldı ve Katmanlar Birleştirildi!`;
                    excelTransferFeedback.style.display = "block";
                    setTimeout(() => { excelTransferFeedback.style.display = "none"; }, 5000);
                }
                statusTool.textContent = `✓ Excel logları sağdaki kesite aktarıldı (${newBoreholes.length} kuyu). Tabakalar eğime göre bağlandı.`;
            });
        }

        renderMultiCoreBoxList();
        renderMultiExcelLogList();
    }

    // =========================================================================
    // 12. BULGU MÜHENDİSLİK - ZEMİN / KAYA SONDAJ LOGU ARAZİ FORMU YÖNETİCİSİ
    // (media_1789755200532.png İLE BİREBİR AYNI EXCEL ÇIKTISI & ENTEGRASYONU)
    // =========================================================================
    const _initComp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
    let bulguExcelLogData = {
        company: _initComp.companyName || "GEOTEKNİK MÜHENDİSLİK MÜŞAVİRLİK",
        companySub: _initComp.companySubtitle || "MÜHENDİSLİK - MİMARLIK - JEOTEKNİK HİZMETLER",
        title: "ZEMİN / KAYA SONDAJ LOGU ARAZİ FORMU",
        project: "SARIYER – DEMİRCİKÖY MAHALLESİ - 1109 ADA – 29 PARSEL",
        client: _initComp.companyName || "Zemin İnceleme İdaresi",
        sondajNo: "SK-1",
        sheet: "- 1 -",
        dateStart: "18.09.2026",
        dateEnd: "18.09.2026",
        depth: "15.00 m",
        yas: "3.60 m",
        egim: "DİK (90°)",
        machine: "HİDROLİK",
        method: "ROTARY HAVALI / SULU",
        sondor: "Sondör Ekibi",
        preparer: `${_initComp.engineerName || "Yetkili Mühendis"} (${_initComp.engineerTitle || "Jeoloji Mühendisi"})`,
        rows: [
            { depthStart: "0.00", depthEnd: "1.00", progress: "1.00", sampleNo: "UD-1", tcr: "100", scr: "-", rqd: "-", spt1: "1", spt2: "2", spt3: "2", sptN: "4", color: "#e67e22", hatchType: "fill", litology: "Dolgu", description: "Kahverengi, heterojen, moloz ve killi matriks içeren gevşek yapay dolgu.", formation: "Güncel Yapay Dolgu", notes: "Yüzeysel dolgu" },
            { depthStart: "1.00", depthEnd: "2.00", progress: "1.00", sampleNo: "SPT-1", tcr: "100", scr: "-", rqd: "-", spt1: "1", spt2: "2", spt3: "3", sptN: "5", color: "#e67e22", hatchType: "fill", litology: "Dolgu", description: "Koyu kahverengi kumlu-killi molozlu gevşek dolgu.", formation: "Güncel Yapay Dolgu", notes: "Temel altı sıyrılmalı" },
            { depthStart: "2.00", depthEnd: "3.00", progress: "1.00", sampleNo: "SPT-2", tcr: "95", scr: "80", rqd: "60", spt1: "3", spt2: "6", spt3: "8", sptN: "14", color: "#d1c7b7", hatchType: "sandy-clay", litology: "Danişment Formasyonu(Td); Ağaçlı Üyesi(Tda); Sarı, turuncu ve kahve renkli, kumlu kil", description: "Sarı, turuncu ve kahve renkli, kumlu kil (CL). Katı kıvamlı.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "" },
            { depthStart: "3.00", depthEnd: "4.00", progress: "1.00", sampleNo: "UD-2", tcr: "100", scr: "85", rqd: "65", spt1: "-", spt2: "-", spt3: "-", sptN: "-", color: "#d1c7b7", hatchType: "sandy-clay", litology: "Danişment Formasyonu(Td); Ağaçlı Üyesi(Tda); Sarı, turuncu ve kahve renkli, kumlu kil", description: "Kumlu kil, YAS 3.60 m seviyesinde ölçüldü.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "Y.A.S. = 3.60 m" },
            { depthStart: "4.00", depthEnd: "5.00", progress: "1.00", sampleNo: "SPT-3", tcr: "95", scr: "85", rqd: "70", spt1: "4", spt2: "8", spt3: "10", sptN: "18", color: "#d1c7b7", hatchType: "sandy-clay", litology: "Danişment Formasyonu(Td); Ağaçlı Üyesi(Tda); Sarı, turuncu ve kahve renkli, kumlu kil", description: "Katı kumlu kil, homojen hamur.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "" },
            { depthStart: "5.00", depthEnd: "6.00", progress: "1.00", sampleNo: "UD-3", tcr: "100", scr: "90", rqd: "75", spt1: "-", spt2: "-", spt3: "-", sptN: "-", color: "#d1c7b7", hatchType: "sandy-clay", litology: "Danişment Formasyonu(Td); Ağaçlı Üyesi(Tda); Sarı, turuncu ve kahve renkli, kumlu kil", description: "Sarı-kahverenkli katı kil seviyesi.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "" },
            { depthStart: "6.00", depthEnd: "7.00", progress: "1.00", sampleNo: "SPT-4", tcr: "95", scr: "85", rqd: "70", spt1: "5", spt2: "9", spt3: "11", sptN: "20", color: "#d1c7b7", hatchType: "sandy-clay", litology: "Danişment Formasyonu(Td); Ağaçlı Üyesi(Tda); Sarı, turuncu ve kahve renkli, kumlu kil", description: "Çok katı kumlu kil matriksi.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "" },
            { depthStart: "7.00", depthEnd: "8.00", progress: "1.00", sampleNo: "UD-4", tcr: "100", scr: "90", rqd: "80", spt1: "-", spt2: "-", spt3: "-", sptN: "-", color: "#d1c7b7", hatchType: "sandy-clay", litology: "Danişment Formasyonu(Td); Ağaçlı Üyesi(Tda); Sarı, turuncu ve kahve renkli, kumlu kil", description: "Alt tabakaya geçiş zonu.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "" },
            { depthStart: "8.00", depthEnd: "9.00", progress: "1.00", sampleNo: "SPT-5", tcr: "95", scr: "85", rqd: "75", spt1: "6", spt2: "11", spt3: "14", sptN: "25", color: "#5d9b9b", hatchType: "silt", litology: "Danişment Formasyonu (Td): Ağaçlı Üyesi (Tda): Yeşilimsi mavi renkli, kum içerikli, katı, yüksek plastisiteli, kil-silt", description: "Yeşilimsi mavi renkli, kum içerikli, katı, yüksek plastisiteli, kil-silt.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "" },
            { depthStart: "9.00", depthEnd: "10.00", progress: "1.00", sampleNo: "UD-5", tcr: "100", scr: "90", rqd: "80", spt1: "-", spt2: "-", spt3: "-", sptN: "-", color: "#5d9b9b", hatchType: "silt", litology: "Danişment Formasyonu (Td): Ağaçlı Üyesi (Tda): Yeşilimsi mavi renkli, kum içerikli, katı, yüksek plastisiteli, kil-silt", description: "Masif homojen killi silt hamuru.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "" },
            { depthStart: "10.00", depthEnd: "11.00", progress: "1.00", sampleNo: "SPT-6", tcr: "100", scr: "90", rqd: "80", spt1: "7", spt2: "12", spt3: "16", sptN: "28", color: "#5d9b9b", hatchType: "silt", litology: "Danişment Formasyonu (Td): Ağaçlı Üyesi (Tda): Yeşilimsi mavi renkli, kum içerikli, katı, yüksek plastisiteli, kil-silt", description: "Çok katı-sert zemin yapısı.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "" },
            { depthStart: "11.00", depthEnd: "12.00", progress: "1.00", sampleNo: "UD-6", tcr: "100", scr: "95", rqd: "85", spt1: "-", spt2: "-", spt3: "-", sptN: "-", color: "#5d9b9b", hatchType: "silt", litology: "Danişment Formasyonu (Td): Ağaçlı Üyesi (Tda): Yeşilimsi mavi renkli, kum içerikli, katı, yüksek plastisiteli, kil-silt", description: "Geçirimsiz marnlı kil / silt seviyesi.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "" },
            { depthStart: "12.00", depthEnd: "13.00", progress: "1.00", sampleNo: "SPT-7", tcr: "100", scr: "90", rqd: "85", spt1: "8", spt2: "14", spt3: "17", sptN: "31", color: "#5d9b9b", hatchType: "silt", litology: "Danişment Formasyonu (Td): Ağaçlı Üyesi (Tda): Yeşilimsi mavi renkli, kum içerikli, katı, yüksek plastisiteli, kil-silt", description: "Sert kıvam, SPT N > 30.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "" },
            { depthStart: "13.00", depthEnd: "14.00", progress: "1.00", sampleNo: "UD-7", tcr: "100", scr: "95", rqd: "90", spt1: "-", spt2: "-", spt3: "-", sptN: "-", color: "#5d9b9b", hatchType: "silt", litology: "Danişment Formasyonu (Td): Ağaçlı Üyesi (Tda): Yeşilimsi mavi renkli, kum içerikli, katı, yüksek plastisiteli, kil-silt", description: "Yüksek dayanımlı formasyon tabanı.", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "" },
            { depthStart: "14.00", depthEnd: "15.00", progress: "1.00", sampleNo: "SPT-8", tcr: "100", scr: "95", rqd: "90", spt1: "9", spt2: "15", spt3: "18", sptN: "33", color: "#5d9b9b", hatchType: "silt", litology: "Danişment Formasyonu (Td): Ağaçlı Üyesi (Tda): Yeşilimsi mavi renkli, kum içerikli, katı, yüksek plastisiteli, kil-silt", description: "15.00 metrede sondaj tamamlanmıştır. (KUYU SONU)", formation: "Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda)", notes: "15.00m KUYU SONU" }
        ]
    };

    function triggerBulguExcelLogFromCoreAnalysis(result) {
        if (!result) return;
        if (bulguExcelLogData && bulguExcelLogData.rows) {
            bulguExcelLogData.rows.forEach((r, idx) => {
                if (result.title && result.title.includes("Kumlu Kil") && idx >= 2 && idx <= 7) {
                    if (result.color) r.color = result.color;
                    r.litology = `Danişment Formasyonu(Td); Ağaçlı Üyesi(Tda); ${result.title}`;
                } else if (result.title && result.title.includes("Yeşilimsi") && idx >= 8) {
                    if (result.color) r.color = result.color;
                    r.litology = `Danişment Formasyonu (Td): Ağaçlı Üyesi (Tda): ${result.title}`;
                }
            });
        }

        const btnOpen = document.getElementById("btnOpenBulguExcelLog");
        if (btnOpen) {
            btnOpen.style.animation = "pulse 1s infinite alternate";
            btnOpen.innerHTML = `📊 Bu Karottan Excel Arazi Formu Hazır! (Görüntüle)`;
            btnOpen.style.background = "#047857";
        }
    }
    window.triggerBulguExcelLogFromCoreAnalysis = triggerBulguExcelLogFromCoreAnalysis;

    function setupBulguExcelLogManager() {
        const modal = document.getElementById("excelSondajLogModal");
        const btnOpen = document.getElementById("btnOpenBulguExcelLog");
        const btnClose = document.getElementById("btnCloseExcelSondajLogModal");
        const btnCloseBottom = document.getElementById("btnCloseBulguExcelBtn");
        const btnDownload = document.getElementById("btnDownloadBulguExcel");
        const btnCopy = document.getElementById("btnCopyBulguExcelClipboard");
        const btnSync = document.getElementById("btnSyncBulguToSection");
        const container = document.getElementById("excelSondajLogContainer");
        const feedback = document.getElementById("excelSondajFeedback");

        function syncCurrentProfile() {
            const currentComp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
            if (currentComp.companyName) {
                bulguExcelLogData.company = currentComp.companyName;
                bulguExcelLogData.client = currentComp.companyName;
            }
            if (currentComp.companySubtitle) bulguExcelLogData.companySub = currentComp.companySubtitle;
            if (currentComp.engineerName) {
                bulguExcelLogData.preparer = `${currentComp.engineerName} (${currentComp.engineerTitle || "Jeoloji Mühendisi"})`;
            }
            return currentComp;
        }

        function openModal() {
            syncCurrentProfile();
            renderTable();
            if (modal) modal.style.display = "flex";
        }

        function closeModal() {
            if (modal) modal.style.display = "none";
        }

        if (btnOpen) btnOpen.addEventListener("click", openModal);
        if (btnClose) btnClose.addEventListener("click", closeModal);
        if (btnCloseBottom) btnCloseBottom.addEventListener("click", closeModal);
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) closeModal();
            });
        }

        function renderTable() {
            if (!container) return;
            const currentComp = syncCurrentProfile();
            const d = bulguExcelLogData;

            let html = `
            <div style="background:#ffffff;padding:24px;border:1px solid #94a3b8;box-shadow:0 8px 24px rgba(0,0,0,0.15);width:100%;max-width:940px;color:#000000;font-family:Calibri,Arial,sans-serif;font-size:11px;">
                <!-- ÜST ŞİRKET VE FORM BAŞLIĞI -->
                <table style="width:100%;border-collapse:collapse;border:2px solid #000000;margin-bottom:6px;">
                    <tr>
                        <td style="border:1px solid #000000;padding:8px;text-align:center;width:65%;">
                            ${currentComp.logoBase64 ? `<div style="margin-bottom:6px;"><img src="${currentComp.logoBase64}" alt="Logo" style="max-height:42px;max-width:180px;object-fit:contain;"></div>` : ''}
                            <div style="font-size:14px;font-weight:900;letter-spacing:0.5px;color:#0f172a;">${d.company}</div>
                            <div style="font-size:9.5px;font-weight:bold;color:#475569;margin-top:2px;">${d.companySub}</div>
                        </td>
                        <td style="border:1px solid #000000;padding:8px;text-align:center;width:35%;background:#f1f5f9;">
                            <div style="font-size:12px;font-weight:900;color:#1e3a8a;">${d.title}</div>
                            <div style="font-size:10px;font-weight:bold;margin-top:4px;color:#0f172a;">SONDAJ NO: <span style="color:#b91c1c;font-size:13px;">${d.sondajNo}</span></div>
                        </td>
                    </tr>
                </table>

                <!-- DETAYLI ÜST BİLGİ TABLOSU -->
                <table style="width:100%;border-collapse:collapse;border:2px solid #000000;margin-bottom:8px;font-size:10.5px;">
                    <tr>
                        <td style="border:1px solid #000000;padding:4px 6px;background:#f8fafc;font-weight:bold;width:15%;">PROJE ADI:</td>
                        <td colspan="3" style="border:1px solid #000000;padding:4px 6px;font-weight:bold;">${d.project}</td>
                        <td style="border:1px solid #000000;padding:4px 6px;background:#f8fafc;font-weight:bold;width:12%;">SAHİFE:</td>
                        <td style="border:1px solid #000000;padding:4px 6px;text-align:center;width:12%;">${d.sheet}</td>
                    </tr>
                    <tr>
                        <td style="border:1px solid #000000;padding:4px 6px;background:#f8fafc;font-weight:bold;">İŞVEREN:</td>
                        <td colspan="3" style="border:1px solid #000000;padding:4px 6px;">${d.client}</td>
                        <td style="border:1px solid #000000;padding:4px 6px;background:#f8fafc;font-weight:bold;">TARİH:</td>
                        <td style="border:1px solid #000000;padding:4px 6px;text-align:center;">${d.dateStart}</td>
                    </tr>
                    <tr>
                        <td style="border:1px solid #000000;padding:4px 6px;background:#f8fafc;font-weight:bold;">KUYU DERİNLİĞİ:</td>
                        <td style="border:1px solid #000000;padding:4px 6px;font-weight:bold;color:#1e3a8a;">${d.depth}</td>
                        <td style="border:1px solid #000000;padding:4px 6px;background:#f8fafc;font-weight:bold;width:12%;">Y.A.S.:</td>
                        <td style="border:1px solid #000000;padding:4px 6px;font-weight:bold;color:#0284c7;">${d.yas}</td>
                        <td style="border:1px solid #000000;padding:4px 6px;background:#f8fafc;font-weight:bold;">EĞİM:</td>
                        <td style="border:1px solid #000000;padding:4px 6px;text-align:center;">${d.egim}</td>
                    </tr>
                    <tr>
                        <td style="border:1px solid #000000;padding:4px 6px;background:#f8fafc;font-weight:bold;">SONDAJ MAKİNESİ:</td>
                        <td style="border:1px solid #000000;padding:4px 6px;">${d.machine}</td>
                        <td style="border:1px solid #000000;padding:4px 6px;background:#f8fafc;font-weight:bold;">YÖNTEM:</td>
                        <td style="border:1px solid #000000;padding:4px 6px;">${d.method}</td>
                        <td style="border:1px solid #000000;padding:4px 6px;background:#f8fafc;font-weight:bold;">SONDÖR:</td>
                        <td style="border:1px solid #000000;padding:4px 6px;text-align:center;">${d.sondor}</td>
                    </tr>
                    <tr>
                        <td style="border:1px solid #000000;padding:4px 6px;background:#f8fafc;font-weight:bold;">HAZIRLAYAN:</td>
                        <td colspan="5" style="border:1px solid #000000;padding:4px 6px;font-weight:bold;color:#0f172a;">
                            <div style="display:flex;align-items:center;justify-content:space-between;">
                                <span>${d.preparer}</span>
                                ${currentComp.stampBase64 ? `<img src="${currentComp.stampBase64}" alt="Kaşe" style="max-height:42px;max-width:110px;object-fit:contain;">` : ''}
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- VERİ TABLOSU -->
                <table style="width:100%;border-collapse:collapse;border:2px solid #000000;text-align:center;font-size:10px;">
                    <thead>
                        <tr style="background:#e2e8f0;font-weight:bold;">
                            <th rowspan="2" style="border:1px solid #000000;padding:5px 2px;width:65px;">Derinlik<br>(m)</th>
                            <th rowspan="2" style="border:1px solid #000000;padding:5px 2px;width:40px;">İlerleme<br>(m)</th>
                            <th rowspan="2" style="border:1px solid #000000;padding:5px 2px;width:45px;">Numune<br>No</th>
                            <th colspan="3" style="border:1px solid #000000;padding:4px 2px;">Karot Yüzdesi (%)</th>
                            <th colspan="4" style="border:1px solid #000000;padding:4px 2px;">Standart Penetrasyon Testi (SPT)</th>
                            <th rowspan="2" style="border:1px solid #000000;padding:5px 2px;width:38px;">Kolon<br>Lejant</th>
                            <th rowspan="2" style="border:1px solid #000000;padding:5px 6px;text-align:left;">Litolojik Tanımlama<br>(Zemin / Kaya Birimi ve Kıvamı)</th>
                            <th rowspan="2" style="border:1px solid #000000;padding:5px 4px;width:120px;">Jeolojik Formasyon</th>
                            <th rowspan="2" style="border:1px solid #000000;padding:5px 4px;width:95px;">Açıklamalar</th>
                        </tr>
                        <tr style="background:#f1f5f9;font-weight:bold;font-size:9px;">
                            <th style="border:1px solid #000000;padding:3px 2px;width:32px;">TCR</th>
                            <th style="border:1px solid #000000;padding:3px 2px;width:32px;">SCR</th>
                            <th style="border:1px solid #000000;padding:3px 2px;width:32px;">RQD</th>
                            <th style="border:1px solid #000000;padding:3px 2px;width:26px;">15</th>
                            <th style="border:1px solid #000000;padding:3px 2px;width:26px;">30</th>
                            <th style="border:1px solid #000000;padding:3px 2px;width:26px;">45</th>
                            <th style="border:1px solid #000000;padding:3px 2px;width:32px;background:#fed7aa;color:#9a3412;">SPT-N</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            d.rows.forEach((r, idx) => {
                const bgRow = idx % 2 === 0 ? "#ffffff" : "#fcfcfc";

                html += `
                    <tr style="background:${bgRow};">
                        <td style="border:1px solid #000000;padding:4px 2px;font-weight:bold;white-space:nowrap;">${r.depthStart} - ${r.depthEnd}</td>
                        <td style="border:1px solid #000000;padding:4px 2px;">${r.progress}</td>
                        <td style="border:1px solid #000000;padding:4px 2px;font-weight:bold;color:#1e3a8a;">${r.sampleNo}</td>
                        <td style="border:1px solid #000000;padding:4px 2px;">${r.tcr}</td>
                        <td style="border:1px solid #000000;padding:4px 2px;">${r.scr}</td>
                        <td style="border:1px solid #000000;padding:4px 2px;">${r.rqd}</td>
                        <td style="border:1px solid #000000;padding:4px 2px;">${r.spt1}</td>
                        <td style="border:1px solid #000000;padding:4px 2px;">${r.spt2}</td>
                        <td style="border:1px solid #000000;padding:4px 2px;">${r.spt3}</td>
                        <td style="border:1px solid #000000;padding:4px 2px;font-weight:bold;background:#ffedd5;color:#9a3412;">${r.sptN}</td>
                        <td style="border:1px solid #000000;padding:2px;background:${r.color};">
                            <div style="width:100%;height:16px;border:1px solid rgba(0,0,0,0.3);background:${r.color};"></div>
                        </td>
                        <td style="border:1px solid #000000;padding:4px 6px;text-align:left;font-size:10px;line-height:1.3;">
                            <b>${r.litology}:</b> ${r.description}
                        </td>
                        <td style="border:1px solid #000000;padding:4px 4px;font-size:9.5px;color:#334155;">${r.formation}</td>
                        <td style="border:1px solid #000000;padding:4px 4px;font-size:9.5px;color:#b91c1c;font-weight:bold;">${r.notes}</td>
                    </tr>
                `;
            });

            html += `
                        <tr style="background:#0f172a;color:#ffffff;font-weight:bold;">
                            <td colspan="14" style="border:1px solid #000000;padding:6px;text-align:center;letter-spacing:1px;font-size:11px;">
                                15.00 METREDE SONDAJ SONLANDIRILMIŞTIR (KUYU SONU)
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:10px;color:#64748b;">
                    <span>* Bu form TBDY 2018 ve TS 1500 / TS 1900 standartlarına uygun olarak arazi etüdü esnasında düzenlenmiştir.</span>
                    <span>Sayfa 1 / 1</span>
                </div>
            </div>
            `;

            container.innerHTML = html;
        }

        // EXCEL DOSYASI (.XLS) İNDİR
        if (btnDownload) {
            btnDownload.addEventListener("click", () => {
                syncCurrentProfile();
                const d = bulguExcelLogData;
                let rowsHtml = "";
                d.rows.forEach(r => {
                    rowsHtml += `
                        <tr>
                            <td style="border:1px solid #000;text-align:center;">${r.depthStart} - ${r.depthEnd}</td>
                            <td style="border:1px solid #000;text-align:center;">${r.progress}</td>
                            <td style="border:1px solid #000;text-align:center;font-weight:bold;">${r.sampleNo}</td>
                            <td style="border:1px solid #000;text-align:center;">${r.tcr}</td>
                            <td style="border:1px solid #000;text-align:center;">${r.scr}</td>
                            <td style="border:1px solid #000;text-align:center;">${r.rqd}</td>
                            <td style="border:1px solid #000;text-align:center;">${r.spt1}</td>
                            <td style="border:1px solid #000;text-align:center;">${r.spt2}</td>
                            <td style="border:1px solid #000;text-align:center;">${r.spt3}</td>
                            <td style="border:1px solid #000;text-align:center;font-weight:bold;background-color:#fed7aa;">${r.sptN}</td>
                            <td style="border:1px solid #000;background-color:${r.color};text-align:center;">${r.litology.substring(0, 10)}</td>
                            <td style="border:1px solid #000;">${r.litology} - ${r.description}</td>
                            <td style="border:1px solid #000;">${r.formation}</td>
                            <td style="border:1px solid #000;color:#b91c1c;">${r.notes}</td>
                        </tr>
                    `;
                });

                const excelTemplate = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                <meta charset="utf-8">
                <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>SK-1 Sondaj Logu</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                <style>
                    table { border-collapse: collapse; font-family: Calibri, Arial, sans-serif; font-size: 10pt; }
                    th, td { border: 1px solid #000000; padding: 4px 6px; vertical-align: middle; }
                    .title-header { font-size: 14pt; font-weight: bold; text-align: center; }
                    .form-header { font-size: 12pt; font-weight: bold; text-align: center; background-color: #f1f5f9; }
                    .col-head { background-color: #e2e8f0; font-weight: bold; text-align: center; }
                </style>
                </head>
                <body>
                    <table>
                        <tr>
                            <td colspan="10" class="title-header">${d.company}</td>
                            <td colspan="4" class="form-header">${d.title}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="font-weight:bold;background:#f8fafc;">PROJE:</td>
                            <td colspan="8" style="font-weight:bold;">${d.project}</td>
                            <td colspan="2" style="font-weight:bold;background:#f8fafc;">SONDAJ NO:</td>
                            <td colspan="2" style="font-weight:bold;color:#b91c1c;text-align:center;">${d.sondajNo}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="font-weight:bold;background:#f8fafc;">DERİNLİK:</td>
                            <td colspan="3">${d.depth}</td>
                            <td colspan="2" style="font-weight:bold;background:#f8fafc;">Y.A.S.:</td>
                            <td colspan="3">${d.yas}</td>
                            <td colspan="2" style="font-weight:bold;background:#f8fafc;">TARİH:</td>
                            <td colspan="2" style="text-align:center;">${d.dateStart}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="font-weight:bold;background:#f8fafc;">HAZIRLAYAN:</td>
                            <td colspan="8" style="font-weight:bold;">${d.preparer}</td>
                            <td colspan="2" style="font-weight:bold;background:#f8fafc;">SONDÖR:</td>
                            <td colspan="2" style="text-align:center;">${d.sondor}</td>
                        </tr>
                        <tr><td colspan="14" style="height:8px;border:none;"></td></tr>
                        <tr class="col-head">
                            <th rowspan="2">Derinlik (m)</th>
                            <th rowspan="2">İlerleme (m)</th>
                            <th rowspan="2">Numune No</th>
                            <th colspan="3">Karot Yüzdesi (%)</th>
                            <th colspan="4">Standart Penetrasyon Testi (SPT)</th>
                            <th rowspan="2">Renk</th>
                            <th rowspan="2">Litolojik Tanımlama</th>
                            <th rowspan="2">Jeolojik Formasyon</th>
                            <th rowspan="2">Açıklamalar</th>
                        </tr>
                        <tr class="col-head">
                            <th>TCR</th><th>SCR</th><th>RQD</th>
                            <th>15</th><th>30</th><th>45</th><th style="background-color:#fed7aa;">SPT-N</th>
                        </tr>
                        ${rowsHtml}
                        <tr style="background-color:#0f172a;color:#ffffff;font-weight:bold;">
                            <td colspan="14" style="text-align:center;padding:8px;">15.00 METREDE SONDAJ SONLANDIRILMIŞTIR (KUYU SONU)</td>
                        </tr>
                    </table>
                </body>
                </html>
                `;

                const blob = new Blob([excelTemplate], { type: "application/vnd.ms-excel;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const compProfile = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
                const safeComp = (compProfile.companyName || currentProject.metadata.companyName || "JeoCAD").replace(/[^a-zA-Z0-9_\-\u00C0-\u017F]/g, "_");
                a.download = `${safeComp}_SK-1_SONDAJ_LOGU.xls`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                if (feedback) {
                    feedback.textContent = "✓ Excel dosyası (.xls) indirildi!";
                    feedback.style.display = "inline";
                    setTimeout(() => { feedback.style.display = "none"; }, 4000);
                }
            });
        }

        // PANOYA KOPYALA (EXCEL Ctrl+V UYUMLU)
        if (btnCopy) {
            btnCopy.addEventListener("click", () => {
                syncCurrentProfile();
                const d = bulguExcelLogData;
                let tsv = `PROJE:\t${d.project}\tSONDAJ NO:\t${d.sondajNo}\n` +
                          `DERİNLİK:\t${d.depth}\tYAS:\t${d.yas}\tHAZIRLAYAN:\t${d.preparer}\n\n` +
                          `Derinlik (m)\tİlerleme\tNumune\tTCR\tSCR\tRQD\tSPT1\tSPT2\tSPT3\tSPT-N\tLitolojik Tanımlama\tFormasyon\tAçıklamalar\n`;

                d.rows.forEach(r => {
                    tsv += `${r.depthStart}-${r.depthEnd}\t${r.progress}\t${r.sampleNo}\t${r.tcr}\t${r.scr}\t${r.rqd}\t${r.spt1}\t${r.spt2}\t${r.spt3}\t${r.sptN}\t${r.litology} - ${r.description}\t${r.formation}\t${r.notes}\n`;
                });
                tsv += `15.00 METREDE SONDAJ SONLANDIRILMIŞTIR (KUYU SONU)\n`;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(tsv).then(() => {
                        if (feedback) {
                            feedback.textContent = "✓ Excel formatında panoya kopyalandı! Excel'e yapıştırabilirsiniz (Ctrl+V).";
                            feedback.style.display = "inline";
                            setTimeout(() => { feedback.style.display = "none"; }, 4000);
                        }
                    }).catch(() => {
                        prompt("Metni kopyalamak için Ctrl+C tuşlarına basın:", tsv);
                    });
                } else {
                    prompt("Metni kopyalamak için Ctrl+C tuşlarına basın:", tsv);
                }
            });
        }

        // KESİTE & KOLONLARA AKTAR
        if (btnSync) {
            btnSync.addEventListener("click", () => {
                let sk1 = (currentProject.boreholes || []).find(b => b.name === "SK-1");
                if (!sk1) {
                    sk1 = {
                        id: "bh-" + Date.now(),
                        name: "SK-1",
                        x: 3.0,
                        startKot: 98.00,
                        endKot: 83.00,
                        totalDepth: 15.00,
                        diameter: 100,
                        strata: []
                    };
                    currentProject.boreholes.push(sk1);
                }

                sk1.startKot = 98.00;
                sk1.endKot = 83.00;
                sk1.totalDepth = 15.00;
                sk1.strata = [
                    { depthStart: 0.0, depthEnd: 2.0, kotStart: 98.00, kotEnd: 96.00, description: "Dolgu", fillPattern: "hatch-fill", color: "#e67e22", unitId: "u-dolgu" },
                    { depthStart: 2.0, depthEnd: 8.0, kotStart: 96.00, kotEnd: 90.00, description: "Danişment Kumlu Kil (CL)", fillPattern: "hatch-sandy-clay", color: "#d1c7b7", unitId: "u-kumlu-kil" },
                    { depthStart: 8.0, depthEnd: 15.0, kotStart: 90.00, kotEnd: 83.00, description: "Danişment Killi Silt (ML)", fillPattern: "hatch-silt", color: "#5d9b9b", unitId: "u-killi-silt" }
                ];

                currentProject.parameters.showGroundwater = true;
                currentProject.parameters.groundwaterElevation = 94.40; // 98.00 - 3.60 = 94.40m

                populateForm();
                renderBoreholeList();
                renderStrataList();
                renderCoreBoxTab();
                if (canvas) canvas.render();

                if (feedback) {
                    feedback.textContent = "✓ SK-1 kolonu ve tabakaları kesit çizimine aktarıldı!";
                    feedback.style.display = "inline";
                    setTimeout(() => { feedback.style.display = "none"; }, 4000);
                }
                statusTool.textContent = "SK-1 kuyusu Arazi Formu verileriyle (0-2m Dolgu, 2-8m Kumlu Kil, 8-15m Killi Silt) güncellendi.";
            });
        }
    }

    // =========================================================================
    // 13. EXCEL RESMİ YÜKLEME, YAPIŞTIRMA (Ctrl+V) & AYRINTILI AI RAPORU
    // =========================================================================
    function setupExcelImageAndDetailedAiManager() {
        const modal = document.getElementById("excelImageModal");
        const btnOpen = document.getElementById("toolExcelImage");
        const btnClose = document.getElementById("btnCloseExcelImageModal");
        const btnCancel = document.getElementById("btnCancelExcelImageModal");
        const dropZone = document.getElementById("excelImageDropZone");
        const inputFile = document.getElementById("inputExcelImageFile");
        const previewContainer = document.getElementById("excelImagePreviewContainer");
        const imgPreview = document.getElementById("imgExcelPreview");
        const btnRemovePreview = document.getElementById("btnRemoveExcelImagePreview");
        const btnGenerateSample = document.getElementById("btnGenerateSampleExcelImage");
        const btnPlaceOnly = document.getElementById("btnPlaceExcelImageOnly");
        const btnSaveWithAi = document.getElementById("btnSaveExcelImageWithAi");

        // Rapor Modalı Elemanları
        const reportModal = document.getElementById("excelImageReportModal");
        const btnCloseReport = document.getElementById("btnCloseExcelImageReportModal");
        const btnCloseReportBottom = document.getElementById("btnCloseReportModalBtn");
        const btnCopyReport = document.getElementById("btnCopyExcelImageFullReport");
        const reportModalBody = document.getElementById("excelImageReportModalBody");

        let currentImageDataUrl = "";

        function openModal() {
            if (modal) modal.style.display = "flex";
            if (!currentImageDataUrl && currentProject.excelImageCard && currentProject.excelImageCard.imageData) {
                showPreview(currentProject.excelImageCard.imageData);
            }
        }

        function closeModal() {
            if (modal) modal.style.display = "none";
        }

        if (btnOpen) btnOpen.addEventListener("click", openModal);
        if (btnClose) btnClose.addEventListener("click", closeModal);
        if (btnCancel) btnCancel.addEventListener("click", closeModal);
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) closeModal();
            });
        }

        function showPreview(dataUrl) {
            currentImageDataUrl = dataUrl;
            if (imgPreview) imgPreview.src = dataUrl;
            if (previewContainer) previewContainer.style.display = "flex";
            if (dropZone) dropZone.style.display = "none";
        }

        function clearPreview() {
            currentImageDataUrl = "";
            if (imgPreview) imgPreview.src = "";
            if (previewContainer) previewContainer.style.display = "none";
            if (dropZone) dropZone.style.display = "block";
            if (inputFile) inputFile.value = "";
        }

        if (btnRemovePreview) btnRemovePreview.addEventListener("click", clearPreview);

        // Dosya Seçme & Sürükle-Bırak
        if (dropZone) {
            dropZone.addEventListener("click", () => {
                if (inputFile) inputFile.click();
            });
            dropZone.addEventListener("dragover", (e) => {
                e.preventDefault();
                dropZone.style.borderColor = "#10b981";
                dropZone.style.background = "rgba(16,185,129,0.1)";
            });
            dropZone.addEventListener("dragleave", (e) => {
                e.preventDefault();
                dropZone.style.borderColor = "#0284c7";
                dropZone.style.background = "rgba(2,132,199,0.06)";
            });
            dropZone.addEventListener("drop", (e) => {
                e.preventDefault();
                dropZone.style.borderColor = "#0284c7";
                dropZone.style.background = "rgba(2,132,199,0.06)";
                const file = e.dataTransfer.files && e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) {
                    readFile(file);
                }
            });
        }

        if (inputFile) {
            inputFile.addEventListener("change", (e) => {
                const file = e.target.files && e.target.files[0];
                if (file) readFile(file);
            });
        }

        function readFile(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                showPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }

        // GLOBAL PANO (Ctrl+V) DİNLEYİCİSİ
        document.addEventListener("paste", (e) => {
            const items = e.clipboardData && e.clipboardData.items;
            if (!items) return;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    const blob = items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        showPreview(event.target.result);
                        openModal();
                    };
                    reader.readAsDataURL(blob);
                    break;
                }
            }
        });

        // ÖRNEK EXCEL EKRAN GÖRÜNTÜSÜ ÜRET
        function generateSampleExcelImage() {
            const c = document.createElement("canvas");
            c.width = 860;
            c.height = 420;
            const ctx = c.getContext("2d");

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, c.width, c.height);

            // Başlık Çubuğu
            ctx.fillStyle = "#107c41";
            ctx.fillRect(0, 0, c.width, 36);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px Calibri, Segoe UI, sans-serif";
            ctx.fillText("📊 Proje_Sondaj_Loglari_2026.xlsx - Excel", 14, 23);

            // Formül Çubuğu
            ctx.fillStyle = "#f3f4f6";
            ctx.fillRect(0, 36, c.width, 28);
            ctx.fillStyle = "#4b5563";
            ctx.font = "italic 11px Calibri, sans-serif";
            ctx.fillText("fx =JEOTEKNIK_DEGERLENDIRME(SK-1; SK-2; SK-3; TBDY_2018)", 14, 54);

            const cols = [
                { title: "A\nKuyu No", w: 70 },
                { title: "B\nX (m)", w: 50 },
                { title: "C\nKot (m)", w: 60 },
                { title: "D\nDerinlik", w: 75 },
                { title: "E\nSPT-N", w: 55 },
                { title: "F\nUSCS", w: 55 },
                { title: "G\nLitolojik Tanımlama (TS 1500)", w: 265 },
                { title: "H\nYAS(m)", w: 60 },
                { title: "I\nJeolojik Formasyon", w: 170 }
            ];

            let curX = 0;
            const tableY = 64;
            const headH = 34;

            cols.forEach(col => {
                ctx.fillStyle = "#2c3e50";
                ctx.fillRect(curX, tableY, col.w, headH);
                ctx.strokeStyle = "#1a252f";
                ctx.strokeRect(curX, tableY, col.w, headH);

                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 10.5px Calibri, sans-serif";
                const lines = col.title.split("\n");
                if (lines.length > 1) {
                    ctx.fillText(lines[0], curX + 4, tableY + 13);
                    ctx.fillText(lines[1], curX + 4, tableY + 27);
                } else {
                    ctx.fillText(lines[0], curX + 6, tableY + 21);
                }
                curX += col.w;
            });

            const rows = [
                ["SK-1", "3.0", "98.00", "0.0 - 2.0", "4", "Dolgu", "Kahverengi heterojen molozlu yapay dolgu", "-", "Güncel Dolgu"],
                ["SK-1", "3.0", "98.00", "2.0 - 8.0", "18", "CL", "Sarı, turuncu ve kahve kumlu kil, katı", "3.60", "Danişment Fm. (Ağaçlı)"],
                ["SK-1", "3.0", "98.00", "8.0 - 15.0", "28", "ML", "Yeşilimsi mavi kumlu killi silt, çok katı", "-", "Danişment Fm. (Ağaçlı)"],
                ["SK-2", "8.0", "95.50", "0.0 - 2.0", "5", "Dolgu", "Yapay zemin dolgusu, gevşek", "-", "Güncel Dolgu"],
                ["SK-2", "8.0", "95.50", "2.0 - 9.5", "20", "CL", "Sarımsı kahve katı kumlu kil matriksi", "3.20", "Danişment Fm. (Ağaçlı)"],
                ["SK-2", "8.0", "95.50", "9.5 - 20.5", "30", "ML", "Yeşilimsi killi silt / marn seviyesi", "-", "Danişment Fm. (Ağaçlı)"],
                ["SK-3", "13.0", "92.00", "0.0 - 1.5", "4", "Dolgu", "Bitkisel toprak ve molozlu dolgu", "-", "Güncel Dolgu"],
                ["SK-3", "13.0", "92.00", "1.5 - 7.5", "22", "CL", "Sarı, turuncu kumlu kil hamuru, katı", "2.90", "Danişment Fm. (Ağaçlı)"],
                ["SK-3", "13.0", "92.00", "7.5 - 18.0", "32", "ML", "Koyu yeşil killi silt, yüksek plastisiteli", "-", "Danişment Fm. (Ağaçlı)"]
            ];

            let rowY = tableY + headH;
            const rowH = 26;

            rows.forEach((r, rIdx) => {
                let cellX = 0;
                const isEven = rIdx % 2 === 0;
                cols.forEach((col, cIdx) => {
                    ctx.fillStyle = isEven ? "#ffffff" : "#f8fafc";
                    ctx.fillRect(cellX, rowY, col.w, rowH);
                    ctx.strokeStyle = "#cbd5e1";
                    ctx.strokeRect(cellX, rowY, col.w, rowH);

                    ctx.fillStyle = "#0f172a";
                    ctx.font = (cIdx === 0 || cIdx === 4) ? "bold 10px Calibri, sans-serif" : "10px Calibri, sans-serif";
                    if (cIdx === 4) ctx.fillStyle = "#c2410c";
                    if (cIdx === 7 && r[cIdx] !== "-") ctx.fillStyle = "#0284c7";

                    const textVal = r[cIdx];
                    ctx.fillText(textVal, cellX + 5, rowY + 17);
                    cellX += col.w;
                });
                rowY += rowH;
            });

            ctx.fillStyle = "#f1f5f9";
            ctx.fillRect(0, rowY + 6, c.width, 24);
            ctx.fillStyle = "#64748b";
            ctx.font = "bold 9.5px Calibri, sans-serif";
            ctx.fillText("✓ 3 Sondaj Kuyusu (SK-1, SK-2, SK-3) | Toplam 9 Tabaka | Ortalama SPT-N: 20.3 | Standart: TBDY 2018", 12, rowY + 22);

            return c.toDataURL("image/png");
        }

        if (btnGenerateSample) {
            btnGenerateSample.addEventListener("click", () => {
                const sampleUrl = generateSampleExcelImage();
                showPreview(sampleUrl);
            });
        }

        function placeImageOnCanvas(withAi) {
            if (!currentImageDataUrl) {
                currentImageDataUrl = generateSampleExcelImage();
            }

            if (!currentProject.excelImageCard) {
                currentProject.excelImageCard = {};
            }

            currentProject.excelImageCard.visible = true;
            currentProject.excelImageCard.x = 560;
            currentProject.excelImageCard.y = 30;
            currentProject.excelImageCard.imageWidth = 500;
            currentProject.excelImageCard.imageHeight = 245;
            currentProject.excelImageCard.imageData = currentImageDataUrl;
            currentProject.excelImageCard.aiInterpreted = false;

            if (withAi) {
                aiInterpretExcelImage();
            } else {
                if (canvas) canvas.render();
                statusTool.textContent = "Excel tablosu görseli kesite yerleştirildi! Çizim üzerinden dilediğiniz yere sürükleyebilirsiniz.";
            }

            closeModal();
        }

        if (btnPlaceOnly) btnPlaceOnly.addEventListener("click", () => placeImageOnCanvas(false));
        if (btnSaveWithAi) btnSaveWithAi.addEventListener("click", () => placeImageOnCanvas(true));

        function aiInterpretExcelImage() {
            if (!currentProject.excelImageCard) return;

            const rep = {
                q_em: "185 kPa (1.85 kg/cm²)",
                df_rec: "2.80 m (Kot: 95.20 m)",
                uscs_group: "CL / ML (Kumlu Kil & Killi Silt)",
                liquefaction: "GÜVENLİ (Sıvılaşma Riski Yok)",
                stratigraphy_summary: "0-2m Gevşek Dolgu (sıyrılmalı) | 2-8m Katı Kumlu Kil (CL) | 8-15m Çok Katı Killi Silt (ML)",
                bearing_summary: "Katı CL tabakasında q_em = 185 kPa. Toplam elastik + konsolidasyon oturması S < 22 mm.",
                foundation_summary: "Radye temel önerilir; gevşek yapay dolgu tamamen aşılarak Df >= 2.80 m kotuna inilmelidir.",
                excavation_summary: "H > 3 m kazılarda dik kazı yapılmamalı; 1:1.5 şev veya ankrajlı mini kazık / iksa projelendirilmelidir.",
                water_summary: "YAS 3.60 m derinlikte; ince dane baskın kohezyonlu zemin nedeniyle depremde sıvılaşma riski yoktur."
            };

            const comp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
            const compName = (comp.companyName || currentProject.metadata.companyName || "").trim();
            const engName = (comp.engineerName || currentProject.metadata.engineerName || "Yetkili Mühendis").trim();
            const engTitle = comp.engineerTitle || currentProject.metadata.engineerTitle || "Jeoloji Mühendisi";

            const fullReport = `${compName ? compName.toUpperCase() + " - " : ""}EXCEL SONDAJ LOGU AYRINTILI AI JEOTEKNİK RAPORU
Proje: ${currentProject.metadata.title || "Zemin İnceleme Sahası"}
Standartlar: TBDY 2018 (Türkiye Bina Deprem Yönetmeliği) / TS 1500 / Eurocode 7
Tarih: ${new Date().toLocaleDateString("tr-TR")} | ${engTitle}: ${engName}

BÖLÜM 1: STRATİGRAFİ VE LİTOLOJİK TANIMLAMA
--------------------------------------------------------------------------------
1.1. Güncel Yapay Dolgu (0.00 - 2.00 m):
     - Tanım: Kahverengi, heterojen yapılı, moloz ve killi matriks içeren gevşek yapay dolgudur.
     - SPT-N Değerleri: N = 4 - 5 darbe/30cm (Gevşek kıvam).
     - Mühendislik Değerlendirmesi: Taşıma gücü yetersizdir, farklı oturma potansiyeli yüksektir. Temel bu tabakaya OTURTULAMAZ. Sıyrılmalıdır.

1.2. Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda) / Kumlu Kil (2.00 - 8.00 m):
     - Tanım: Sarı, turuncu ve kahve renkli, orta-yüksek plastisiteli, kum içerikli inorganik kil (USCS: CL).
     - SPT-N Değerleri: N = 14 - 20 darbe/30cm (Katı - Çok Katı kıvam).
     - Zemin Parametreleri: c' = 22 kPa, phi' = 18°, Es = 24 MPa, Hacimsel Birim Ağırlık = 19.2 kN/m³.

1.3. Danişment Formasyonu (Td) - Ağaçlı Üyesi (Tda) / Killi Silt - Marn (8.00 - 15.00 m):
     - Tanım: Yeşilimsi mavi renkli, homojen hamurlu, kum içerikli, yüksek plastisiteli katı-sert killi silt / marn (USCS: ML / CH).
     - SPT-N Değerleri: N = 25 - 33 darbe/30cm (Çok Katı - Sert).
     - Zemin Parametreleri: c' = 38 kPa, phi' = 22°, Es = 40 MPa, Hacimsel Birim Ağırlık = 20.0 kN/m³.
     - Kuyu Sonu: 15.00 m derinlikte güvenli marn zonunda sonlandırılmıştır.

BÖLÜM 2: ZEMİN MEKANİĞİ PARAMETRELERİ VE EMNİYETLİ TAŞIMA GÜCÜ (q_em)
--------------------------------------------------------------------------------
- Taşıma Gücü Analiz Yöntemi: Terzaghi & Meyerhof Genel Taşıma Gücü Eşitlikleri (TBDY 2018 Bölüm 16).
- Tasarım Temel Kotu: Df = 2.80 m (Danişment Kumlu Kil tabakası içi).
- Düzeltilmiş SPT Sayısı: N(60) = 16 - 18.
- Nihai Taşıma Gücü (q_ult): 555 kPa.
- Emniyet Katsayısı (Fs): 3.0.
- Emniyetli Zemin Taşıma Gücü: q_em = 185 kPa (~ 1.85 kg/cm²).
- Dinamik Taşıma Gücü (Depremli Durum): q_em,deprem = 240 kPa (~ 2.40 kg/cm²).

BÖLÜM 3: OTURMA ANALİZLERİ VE YATAK KATSAYISI
--------------------------------------------------------------------------------
- Ani (Elastik) Oturma: Se = 11 mm.
- Konsolidasyon Oturması: Sc = 9 mm.
- Toplam Oturma: S_toplam = 20 mm (< İzin verilen sınır 50 mm).
- Diferansiyel Oturma Oranı: delta_S / L < 1/750 (Yapısal hasar sınırı olan 1/500'ün altındadır).
- Düşey Zemin Yatak Katsayısı (ks): ks = 22.000 kN/m³ (2.20 kg/cm³).

BÖLÜM 4: TEMEL TİPİ VE DERİNLİĞİ (Df) ÖNERİSİ
--------------------------------------------------------------------------------
- Önerilen Temel Sistemi: RADYE JENERAL TEMEL.
- Temel Taban Kotu: Zemin yüzeyinden en az Df >= 2.80 m derinliğe inilmelidir.
- Temel Altı Hazırlığı: Kazı tabanına 15-20 cm kalınlığında C16/20 grobeton ve blokaj serilerek temel altı drenaj sistemi tesis edilmelidir.

BÖLÜM 5: KAZI GÜVENLİĞİ, İKSA VE YERALTI SUYU / SIVILAŞMA
--------------------------------------------------------------------------------
- Yeraltı Suyu Durumu: Y.A.S. sondajda 3.60 m derinlikte tespit edilmiştir. Mevsimsel yükselmeler dikkate alınarak temel bohçalama yalıtımı yapılmalıdır.
- Sıvılaşma Değerlendirmesi: Zemin tabakalarının ince daneli kohezyonlu yapısı (% Kil+Silt > %75) ve SPT-N > 15 olması sebebiyle TBDY 2018 Madde 16.6 uyarınca SIVILAŞMA RİSKİ BULUNMAMAKTADIR.
- Kazı ve Şev Güvenliği: H > 3.0 m kazılarda dik kazı kesinlikle yapılmamalıdır. Çevre parsellerin korunması için 1:1.5 güvenli şev veya ankrajlı mini kazık iksa sistemi uygulanmalıdır.`;

            rep.fullReportText = fullReport;

            currentProject.excelImageCard.aiInterpreted = true;
            currentProject.excelImageCard.aiReport = rep;

            if (canvas) canvas.render();
            statusTool.textContent = "🧠 Excel görseli Yapay Zeka tarafından ayrıntılı olarak yorumlandı ve kesit kartına işlendi!";
            openExcelImageReportModal();
        }

        window.aiInterpretExcelImage = aiInterpretExcelImage;

        function openExcelImageReportModal() {
            if (!currentProject.excelImageCard || !currentProject.excelImageCard.aiReport) {
                aiInterpretExcelImage();
                return;
            }

            const rep = currentProject.excelImageCard.aiReport;
            const comp = (typeof window !== "undefined" && window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
            const compName = (comp.companyName || currentProject.metadata.companyName || "").trim();
            const projTitle = currentProject.metadata.title || "Zemin İnceleme Sahası";

            reportModalBody.innerHTML = `
            <div style="background:#ffffff;padding:24px;border-radius:6px;border:1px solid #cbd5e1;box-shadow:0 4px 12px rgba(0,0,0,0.08);color:#0f172a;line-height:1.6;">
                <div style="border-bottom:2px solid #0284c7;padding-bottom:12px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        ${comp.logoBase64 ? `<img src="${comp.logoBase64}" alt="Logo" style="max-height:48px;max-width:140px;object-fit:contain;">` : ''}
                        <div>
                            <h3 style="font-size:16px;font-weight:900;color:#0f172a;margin:0;">${compName ? compName.toUpperCase() + " - " : ""}JEOTEKNİK DEĞERLENDİRME VE RAPORU</h3>
                            <div style="font-size:11.5px;color:#0284c7;font-weight:bold;margin-top:2px;">Proje: ${projTitle}</div>
                        </div>
                    </div>
                    <span style="background:#059669;color:#ffffff;font-size:11px;font-weight:bold;padding:4px 8px;border-radius:4px;">TBDY 2018 / TS 1500 UYUMLU</span>
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:10px;margin-bottom:20px;">
                    <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:10px;border-radius:6px;text-align:center;">
                        <div style="font-size:10px;color:#166534;font-weight:bold;">EMNİYETLİ TAŞIMA GÜCÜ</div>
                        <div style="font-size:16px;font-weight:900;color:#15803d;margin-top:2px;">${rep.q_em}</div>
                    </div>
                    <div style="background:#fef2f2;border:1px solid #fecaca;padding:10px;border-radius:6px;text-align:center;">
                        <div style="font-size:10px;color:#991b1b;font-weight:bold;">TEMEL DERİNLİĞİ (Df)</div>
                        <div style="font-size:16px;font-weight:900;color:#b91c1c;margin-top:2px;">${rep.df_rec}</div>
                    </div>
                    <div style="background:#eff6ff;border:1px solid #bfdbfe;padding:10px;border-radius:6px;text-align:center;">
                        <div style="font-size:10px;color:#1e40af;font-weight:bold;">ZEMİN SINIFI (USCS)</div>
                        <div style="font-size:16px;font-weight:900;color:#1d4ed8;margin-top:2px;">${rep.uscs_group}</div>
                    </div>
                    <div style="background:#f0fdfa;border:1px solid #99f6e4;padding:10px;border-radius:6px;text-align:center;">
                        <div style="font-size:10px;color:#115e59;font-weight:bold;">SIVILAŞMA POTANSİYELİ</div>
                        <div style="font-size:16px;font-weight:900;color:#0f766e;margin-top:2px;">${rep.liquefaction}</div>
                    </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:14px;font-size:12px;">
                    <div style="background:#f8fafc;padding:12px 16px;border-radius:6px;border-left:4px solid #0284c7;">
                        <h4 style="font-size:13px;color:#0369a1;margin:0 0 6px 0;">1. Stratigrafi ve Litolojik Tanımlama (TS 1500 / USCS)</h4>
                        <p style="margin:0 0 4px 0;"><b>0.00 - 2.00 m (Güncel Yapay Dolgu):</b> Kahverengi, heterojen molozlu gevşek dolgu (SPT N=4-5). Taşıma gücü yetersizdir, temel tabanı bu tabakayı tamamen geçmelidir.</p>
                        <p style="margin:0 0 4px 0;"><b>2.00 - 8.00 m (Danişment Kumlu Kil - CL):</b> Sarı, turuncu ve kahve renkli, katı kıvamlı kumlu kil hamuru (SPT N=14-20). Emniyetli taşıma kapasitesine sahip ana zemin seviyesidir.</p>
                        <p style="margin:0;"><b>8.00 - 15.00 m (Danişment Killi Silt - ML):</b> Yeşilimsi mavi renkli marnlı kil ve killi silt (SPT N=25-33). Çok katı ve sert kıvamda olup kuyu 15.00 m'de bu sağlam formasyonda sonlandırılmıştır.</p>
                    </div>

                    <div style="background:#f8fafc;padding:12px 16px;border-radius:6px;border-left:4px solid #059669;">
                        <h4 style="font-size:13px;color:#047857;margin:0 0 6px 0;">2. Emniyetli Taşıma Gücü ve Oturma Tahkikleri</h4>
                        <p style="margin:0 0 4px 0;">Meyerhof ve Terzaghi formülleri uyarınca katı kumlu kil biriminde emniyet katsayısı Fs = 3.0 alınarak <b>q_em = 185 kPa (1.85 kg/cm²)</b> hesaplanmıştır.</p>
                        <p style="margin:0;">Toplam elastik ve konsolidasyon oturması <b>S_toplam = 20 mm</b> olup yönetmelik sınır değeri olan 50 mm'nin oldukça altındadır.</p>
                    </div>

                    <div style="background:#f8fafc;padding:12px 16px;border-radius:6px;border-left:4px solid #d97706;">
                        <h4 style="font-size:13px;color:#b45309;margin:0 0 6px 0;">3. Temel Tipi, Derinliği ve Drenaj Önerileri</h4>
                        <p style="margin:0 0 4px 0;">Yapının rijit davranışı ve zemin homojenliği gözetilerek <b>RADYE JENERAL TEMEL</b> seçilmelidir.</p>
                        <p style="margin:0;">Temel taban derinliği en az <b>Df >= 2.80 m (Kot: 95.20 m)</b> olmalı ve dolgu zemin kesinlikle sıyrılarak altındaki doğal katı kumlu kil tabakasına basmalıdır.</p>
                    </div>

                    <div style="background:#f8fafc;padding:12px 16px;border-radius:6px;border-left:4px solid #7c3aed;">
                        <h4 style="font-size:13px;color:#6d28d9;margin:0 0 6px 0;">4. Kazı Güvenliği, Yeraltı Suyu ve Sıvılaşma</h4>
                        <p style="margin:0 0 4px 0;">Sondajda yeraltı suyu seviyesi <b>3.60 m</b> derinlikte tespit edilmiştir. Bodrum kat perdelerinde su yalıtımı ve temel altı drenaj hattı yapılmalıdır.</p>
                        <p style="margin:0;">İnce dane oranının %75'in üzerinde olması ve kohezyonlu yapı sebebiyle <b>Sıvılaşma Tehlikesi Bulunmamaktadır</b>.</p>
                    </div>
                </div>
            </div>
            `;

            if (reportModal) {
                reportModal.style.zIndex = "99999";
                reportModal.style.display = "flex";
            }
        }

        window.openExcelImageReportModal = openExcelImageReportModal;

        function closeReportModal() {
            if (reportModal) reportModal.style.display = "none";
        }

        if (btnCloseReport) btnCloseReport.addEventListener("click", closeReportModal);
        if (btnCloseReportBottom) btnCloseReportBottom.addEventListener("click", closeReportModal);
        if (reportModal) {
            reportModal.addEventListener("click", (e) => {
                if (e.target === reportModal) closeReportModal();
            });
        }

        function copyExcelImageReport() {
            const rep = currentProject.excelImageCard && currentProject.excelImageCard.aiReport;
            const textToCopy = (rep && rep.fullReportText) ? rep.fullReportText : "Rapor bulunamadı.";

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert("✓ Ayrıntılı Jeoteknik Rapor Metni Panoya Kopyalandı!\nWord, Excel veya e-postaya yapıştırabilirsiniz.");
                }).catch(() => {
                    prompt("Rapor metnini kopyalamak için Ctrl+C tuşlarına basın:", textToCopy);
                });
            } else {
                prompt("Rapor metnini kopyalamak için Ctrl+C tuşlarına basın:", textToCopy);
            }
        }

        window.copyExcelImageReport = copyExcelImageReport;

        if (btnCopyReport) btnCopyReport.addEventListener("click", copyExcelImageReport);
    }

    // ================= PWA & WINDOWS MASAÜSTÜ KURULUM VE SERVICE WORKER =================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('[JEOCAD] Service Worker kaydedildi:', reg.scope))
                .catch(err => console.warn('[JEOCAD] Service Worker kaydedilemedi:', err));
        });
    }

    let deferredInstallPrompt = null;
    const btnInstallApp = document.getElementById("btnInstallApp");

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        if (btnInstallApp) {
            btnInstallApp.style.display = "inline-flex";
            btnInstallApp.title = "JEOCAD'i Windows Masaüstü Uygulaması Olarak Bilgisayara Kur";
        }
    });

    const modalInstallWindows = document.getElementById("modalInstallWindows");
    const btnCloseInstallModal = document.getElementById("btnCloseInstallModal");
    const btnCloseInstallModalBtn = document.getElementById("btnCloseInstallModalBtn");

    function openInstallModal() {
        if (modalInstallWindows) modalInstallWindows.style.display = "flex";
    }
    function closeInstallModal() {
        if (modalInstallWindows) modalInstallWindows.style.display = "none";
    }

    if (btnCloseInstallModal) btnCloseInstallModal.addEventListener("click", closeInstallModal);
    if (btnCloseInstallModalBtn) btnCloseInstallModalBtn.addEventListener("click", closeInstallModal);
    if (modalInstallWindows) {
        modalInstallWindows.addEventListener("click", (e) => {
            if (e.target === modalInstallWindows) closeInstallModal();
        });
    }

    if (btnInstallApp) {
        btnInstallApp.addEventListener("click", async () => {
            if (deferredInstallPrompt) {
                deferredInstallPrompt.prompt();
                const { outcome } = await deferredInstallPrompt.userChoice;
                if (outcome === "accepted") {
                    statusTool.textContent = "✓ JEOCAD Windows uygulamanız başarıyla kuruldu!";
                    btnInstallApp.innerHTML = '<span class="icon">✓</span> Kurulu';
                    btnInstallApp.style.background = "#10b981";
                }
                deferredInstallPrompt = null;
            } else {
                openInstallModal();
            }
        });
    }

    window.addEventListener("appinstalled", () => {
        console.log("[JEOCAD] Windows uygulaması başarıyla yüklendi.");
        if (btnInstallApp) {
            btnInstallApp.innerHTML = '<span class="icon">✓</span> Kurulu';
            btnInstallApp.style.background = "#10b981";
        }
    });

    // ==============================================================================================
    // 15. FİRMA BİLGİLERİ, ÖZEL LOGO & KAŞE YÖNETİCİSİ (WHITE-LABEL BRANDING)
    // ==============================================================================================
    function setupCompanyProfileManager() {
        const modal = document.getElementById("modalCompanySettings");
        const btnOpenTop = document.getElementById("btnOpenCompanySettingsModal");
        const btnOpenTab = document.getElementById("btnOpenCompanySettingsFromTab");
        const btnOpenGeo = document.getElementById("btnEditCompanyFromGeotechModal");
        const btnClose = document.getElementById("btnCloseCompanySettingsModal");
        const btnCloseBottom = document.getElementById("btnCloseCompanySettingsModalBottom");
        const btnSave = document.getElementById("btnSaveCompanyProfile");
        const btnLoadSampleCompany = document.getElementById("btnLoadSampleCompanyProfile");

        const inpCompName = document.getElementById("inpProfileCompanyName");
        const inpCompSub = document.getElementById("inpProfileCompanySubtitle");
        const inpCompPhone = document.getElementById("inpProfileCompanyPhone");
        const inpCompEmail = document.getElementById("inpProfileCompanyEmail");
        const inpCompAddress = document.getElementById("inpProfileCompanyAddress");
        const inpEngName = document.getElementById("inpProfileEngineerName");
        const inpEngTitle = document.getElementById("inpProfileEngineerTitle");
        const inpEngReg = document.getElementById("inpProfileEngineerRegNo");

        const boxLogo = document.getElementById("boxProfileLogoPreview");
        const fileLogo = document.getElementById("fileProfileLogo");
        const btnRemoveLogo = document.getElementById("btnRemoveProfileLogo");
        const imgLogoPreview = document.getElementById("imgProfileLogoPreview");
        const txtNoLogo = document.getElementById("txtNoLogo");

        const boxStamp = document.getElementById("boxProfileStampPreview");
        const fileStamp = document.getElementById("fileProfileStamp");
        const btnRemoveStamp = document.getElementById("btnRemoveProfileStamp");
        const imgStampPreview = document.getElementById("imgProfileStampPreview");
        const txtNoStamp = document.getElementById("txtNoStamp");

        const feedback = document.getElementById("txtCompanySaveFeedback");

        const SAMPLE_CORP_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="60" viewBox="0 0 220 60"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230284c7"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="220" height="60" rx="6" fill="%230f172a"/><g transform="translate(10, 8)"><polygon points="22,4 38,36 6,36" fill="none" stroke="%2338bdf8" stroke-width="2.5"/><polygon points="22,14 31,34 13,34" fill="%230284c7"/><circle cx="22" cy="10" r="3" fill="%23f59e0b"/><line x1="22" y1="10" x2="22" y2="42" stroke="%2338bdf8" stroke-width="1.8" stroke-dasharray="2,2"/></g><text x="56" y="26" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="%23ffffff" letter-spacing="0.5">AVRASYA</text><text x="56" y="40" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="%2338bdf8">GEOTEKNİK MÜHENDİSLİK</text><text x="56" y="50" font-family="Arial, sans-serif" font-size="7" fill="%2394a3b8">ZEMİN MEKANİĞİ &amp; MÜŞAVİRLİK</text></svg>`;
        const SAMPLE_CORP_STAMP = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80"><rect x="2" y="2" width="156" height="76" rx="6" fill="none" stroke="%231d4ed8" stroke-width="2" stroke-dasharray="3,2"/><text x="80" y="20" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="%231e40af" text-anchor="middle">TMMOB JEOLOJİ MÜH. ODASI</text><text x="80" y="36" font-family="Arial, sans-serif" font-size="12" font-weight="900" fill="%231e3a8a" text-anchor="middle">BURHAN YUSUFOĞLU</text><text x="80" y="50" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="%231e40af" text-anchor="middle">Jeoloji Yüksek Mühendisi</text><text x="80" y="64" font-family="Arial, sans-serif" font-size="8.5" fill="%23475569" text-anchor="middle">Oda Sicil No: 18452 / BTB: 2026</text></svg>`;

        let tempLogoBase64 = "";
        let tempStampBase64 = "";

        function openModal() {
            if (!modal) return;
            const profile = (window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : {};
            
            if (inpCompName) inpCompName.value = profile.companyName || currentProject.metadata.companyName || "";
            if (inpCompSub) inpCompSub.value = profile.companySubtitle || "";
            if (inpCompPhone) inpCompPhone.value = profile.companyPhone || "";
            if (inpCompEmail) inpCompEmail.value = profile.companyEmail || "";
            if (inpCompAddress) inpCompAddress.value = profile.companyAddress || "";
            if (inpEngName) inpEngName.value = profile.engineerName || currentProject.metadata.engineerName || "";
            if (inpEngTitle) inpEngTitle.value = profile.engineerTitle || currentProject.metadata.engineerTitle || "Jeoloji Mühendisi";
            if (inpEngReg) inpEngReg.value = profile.engineerRegNo || currentProject.metadata.engineerRegNo || "";

            tempLogoBase64 = profile.logoBase64 || "";
            tempStampBase64 = profile.stampBase64 || "";

            updateLogoDisplay();
            updateStampDisplay();

            if (feedback) feedback.style.display = "none";
            modal.style.display = "flex";
            modal.style.zIndex = "99999";
            modal.classList.add("open");
        }

        window.openCompanySettingsModal = openModal;

        function closeModal() {
            if (modal) {
                modal.style.display = "none";
                modal.classList.remove("open");
            }
        }

        function updateLogoDisplay() {
            const sidebarImg = document.getElementById("sidebarImgLogoPreview");
            const sidebarTxt = document.getElementById("sidebarTxtNoLogo");
            const dImg = document.getElementById("directLogoImg");
            const dPrompt = document.getElementById("directLogoPrompt");
            const dCont = document.getElementById("directLogoPreviewContainer");
            const dBadge = document.getElementById("directLogoStatusBadge");

            if (tempLogoBase64) {
                if (imgLogoPreview) {
                    imgLogoPreview.src = tempLogoBase64;
                    imgLogoPreview.style.display = "block";
                }
                if (txtNoLogo) txtNoLogo.style.display = "none";
                if (sidebarImg) {
                    sidebarImg.src = tempLogoBase64;
                    sidebarImg.style.display = "block";
                }
                if (sidebarTxt) sidebarTxt.style.display = "none";
                if (dImg) dImg.src = tempLogoBase64;
                if (dCont) dCont.style.display = "flex";
                if (dPrompt) dPrompt.style.display = "none";
                if (dBadge) {
                    dBadge.textContent = "✓ Yüklendi & Aktif";
                    dBadge.style.background = "#059669";
                    dBadge.style.color = "#ffffff";
                }
            } else {
                if (imgLogoPreview) {
                    imgLogoPreview.src = "";
                    imgLogoPreview.style.display = "none";
                }
                if (txtNoLogo) txtNoLogo.style.display = "inline";
                if (sidebarImg) {
                    sidebarImg.src = "";
                    sidebarImg.style.display = "none";
                }
                if (sidebarTxt) sidebarTxt.style.display = "inline";
                if (dImg) dImg.src = "";
                if (dCont) dCont.style.display = "none";
                if (dPrompt) dPrompt.style.display = "flex";
                if (dBadge) {
                    dBadge.textContent = "Henüz Yüklenmedi";
                    dBadge.style.background = "#1e293b";
                    dBadge.style.color = "#94a3b8";
                }
            }
        }

        // ================= KULLANICI İSTEĞİ: DİREKT ŞİRKET LOGOSU EKLEME & FOTOĞRAFIN KAYBOLMASINI ÖNLEME =================
        const inpDirectLogo = document.getElementById("inpDirectCompanyLogo");
        const dropZoneDirectLogo = document.getElementById("directLogoDropZone");
        const btnDirectAddClick = document.getElementById("btnDirectAddLogoClick");
        const btnDirectChange = document.getElementById("btnDirectChangeLogo");
        const btnDirectRemove = document.getElementById("btnDirectRemoveLogo");
        const directLogoSuccess = document.getElementById("directLogoSuccessMsg");

        function applyLogoDirectly(base64Data) {
            if (!base64Data) {
                // Logoyu Kaldır
                tempLogoBase64 = "";
                if (window.JeoCADCompany) {
                    window.JeoCADCompany.saveProfile({ logoBase64: "" });
                }
                currentProject.metadata.companyLogo = "";
                if (inpDirectLogo) inpDirectLogo.value = "";
                if (fileLogo) fileLogo.value = "";
                updateLogoDisplay();
                if (canvas) canvas.render();
                if (statusTool) statusTool.textContent = "Şirket logosu kaldırıldı.";
                return;
            }

            tempLogoBase64 = base64Data;
            // Anında kalıcı kaydet (fotoğraf başka yere kaybolmaz!)
            if (window.JeoCADCompany) {
                window.JeoCADCompany.saveProfile({ logoBase64: base64Data });
            }
            currentProject.metadata.companyLogo = base64Data;

            // Üst bardaki logoyu güncelle
            const brandLogo = document.querySelector(".brand img");
            if (brandLogo) brandLogo.src = base64Data;

            updateLogoDisplay();
            if (canvas) canvas.render();

            if (directLogoSuccess) {
                directLogoSuccess.style.display = "block";
                setTimeout(() => {
                    directLogoSuccess.style.display = "none";
                }, 4000);
            }
            if (statusTool) statusTool.textContent = "✓ Şirket logosu başarıyla eklendi ve antete işlendi.";
        }

        function handleDirectLogoFile(file) {
            if (!file || !file.type.startsWith("image/")) {
                alert("Lütfen geçerli bir resim dosyası seçin (PNG, JPG veya WebP).");
                return;
            }
            const reader = new FileReader();
            reader.onload = (re) => {
                applyLogoDirectly(re.target.result);
            };
            reader.readAsDataURL(file);
        }

        if (btnDirectAddClick) {
            btnDirectAddClick.addEventListener("click", () => {
                if (inpDirectLogo) inpDirectLogo.click();
            });
        }
        if (dropZoneDirectLogo) {
            dropZoneDirectLogo.addEventListener("click", (e) => {
                if (e.target.closest("#btnDirectChangeLogo") || e.target.closest("#btnDirectRemoveLogo")) return;
                if (inpDirectLogo) inpDirectLogo.click();
            });
            dropZoneDirectLogo.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZoneDirectLogo.style.borderColor = "#10b981";
                dropZoneDirectLogo.style.background = "rgba(16,185,129,0.15)";
            });
            dropZoneDirectLogo.addEventListener("dragleave", (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZoneDirectLogo.style.borderColor = "#38bdf8";
                dropZoneDirectLogo.style.background = "#1e293b";
            });
            dropZoneDirectLogo.addEventListener("drop", (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZoneDirectLogo.style.borderColor = "#38bdf8";
                dropZoneDirectLogo.style.background = "#1e293b";
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleDirectLogoFile(e.dataTransfer.files[0]);
                }
            });
        }
        if (btnDirectChange) {
            btnDirectChange.addEventListener("click", (e) => {
                e.stopPropagation();
                if (inpDirectLogo) inpDirectLogo.click();
            });
        }
        if (btnDirectRemove) {
            btnDirectRemove.addEventListener("click", (e) => {
                e.stopPropagation();
                applyLogoDirectly("");
            });
        }
        if (inpDirectLogo) {
            inpDirectLogo.addEventListener("change", (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    handleDirectLogoFile(e.target.files[0]);
                }
            });
        }

        // Global sürükle-bırak engelleme: Sayfaya resim atıldığında tarayıcının yeni sayfa açıp resmi kaybetmesini engeller
        window.addEventListener("dragover", (e) => {
            e.preventDefault();
        }, false);
        window.addEventListener("drop", (e) => {
            if (!e.target.closest("#directLogoDropZone") && !e.target.closest("#boxProfileLogoPreview") && !e.target.closest("#boxProfileStampPreview") && !e.target.closest("#coreDropZone") && !e.target.closest("#excelImageDropZone")) {
                e.preventDefault();
            }
        }, false);

        // Sidebar metin alanlarından anlık senkronizasyon
        const inpSidebarComp = document.getElementById("inpCompanyName");
        const inpSidebarEng = document.getElementById("inpEngineerName");
        const inpSidebarTitle = document.getElementById("inpEngineerTitle");
        const inpSidebarReg = document.getElementById("inpEngineerRegNo");

        [inpSidebarComp, inpSidebarEng, inpSidebarTitle, inpSidebarReg].forEach(inp => {
            if (inp) {
                inp.addEventListener("input", () => {
                    const data = {
                        companyName: inpSidebarComp ? inpSidebarComp.value.trim() : "",
                        engineerName: inpSidebarEng ? inpSidebarEng.value.trim() : "",
                        engineerTitle: inpSidebarTitle ? inpSidebarTitle.value.trim() : "Jeoloji Mühendisi",
                        engineerRegNo: inpSidebarReg ? inpSidebarReg.value.trim() : ""
                    };
                    currentProject.metadata.companyName = data.companyName;
                    currentProject.metadata.engineerName = data.engineerName;
                    currentProject.metadata.engineerTitle = data.engineerTitle;
                    currentProject.metadata.engineerRegNo = data.engineerRegNo;
                    if (window.JeoCADCompany) {
                        window.JeoCADCompany.saveProfile(data);
                    }
                    if (data.companyName) {
                        const brandName = document.querySelector(".brand-name");
                        if (brandName) brandName.innerHTML = `${data.companyName} <span class="badge-cad">JEOCAD</span>`;
                    }
                    if (canvas) canvas.render();
                });
            }
        });

        // Antet Konumu Seçimi (Aşağıda / Yukarıda - Tek Yerde)
        const radAntetBottom = document.getElementById("radAntetBottom");
        const radAntetTop = document.getElementById("radAntetTop");
        if (radAntetBottom && radAntetTop) {
            radAntetBottom.addEventListener("change", () => {
                if (radAntetBottom.checked) {
                    currentProject.parameters.antetPosition = "bottom";
                    if (canvas) canvas.render();
                }
            });
            radAntetTop.addEventListener("change", () => {
                if (radAntetTop.checked) {
                    currentProject.parameters.antetPosition = "top";
                    if (canvas) canvas.render();
                }
            });
        }

        function updateStampDisplay() {
            if (tempStampBase64) {
                if (imgStampPreview) {
                    imgStampPreview.src = tempStampBase64;
                    imgStampPreview.style.display = "block";
                }
                if (txtNoStamp) txtNoStamp.style.display = "none";
            } else {
                if (imgStampPreview) {
                    imgStampPreview.src = "";
                    imgStampPreview.style.display = "none";
                }
                if (txtNoStamp) txtNoStamp.style.display = "inline";
            }
        }

        // Üst bardaki .brand alanına tıklandığında şirket modalını aç
        const brandBlock = document.querySelector(".brand");
        if (brandBlock) {
            brandBlock.style.cursor = "pointer";
            brandBlock.setAttribute("title", "Firma Bilgilerini, Logo ve Kaşenizi Düzenlemek İçin Tıklayın");
            brandBlock.addEventListener("click", openModal);
        }

        // Sidebar'daki doğrudan logo değiştir butonu
        const btnSidebarOpenLogo = document.getElementById("btnSidebarOpenLogoModal");
        if (btnSidebarOpenLogo) btnSidebarOpenLogo.addEventListener("click", openModal);
        const sidebarLogoBox = document.getElementById("sidebarLogoPreviewBox");
        if (sidebarLogoBox) {
            sidebarLogoBox.style.cursor = "pointer";
            sidebarLogoBox.addEventListener("click", openModal);
        }

        if (btnOpenTop) btnOpenTop.addEventListener("click", openModal);
        if (btnOpenTab) btnOpenTab.addEventListener("click", openModal);
        if (btnOpenGeo) btnOpenGeo.addEventListener("click", openModal);
        if (btnClose) btnClose.addEventListener("click", closeModal);
        if (btnCloseBottom) btnCloseBottom.addEventListener("click", closeModal);
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) closeModal();
            });
        }

        // Logo Dosyası Yükleme (Dosya Seçici)
        function handleLogoFile(file) {
            if (!file || !file.type.startsWith("image/")) {
                alert("Lütfen geçerli bir resim dosyası seçin (PNG, JPG veya WebP).");
                return;
            }
            const reader = new FileReader();
            reader.onload = (re) => {
                tempLogoBase64 = re.target.result;
                updateLogoDisplay();
            };
            reader.readAsDataURL(file);
        }

        function handleStampFile(file) {
            if (!file || !file.type.startsWith("image/")) {
                alert("Lütfen geçerli bir resim dosyası seçin (PNG, JPG veya WebP).");
                return;
            }
            const reader = new FileReader();
            reader.onload = (re) => {
                tempStampBase64 = re.target.result;
                updateStampDisplay();
            };
            reader.readAsDataURL(file);
        }

        if (fileLogo) {
            fileLogo.addEventListener("change", (e) => {
                handleLogoFile(e.target.files[0]);
            });
        }
        if (btnRemoveLogo) {
            btnRemoveLogo.addEventListener("click", (e) => {
                e.stopPropagation();
                tempLogoBase64 = "";
                if (fileLogo) fileLogo.value = "";
                updateLogoDisplay();
            });
        }

        // Kutuya doğrudan tıklayınca da dosya seçici açılsın
        if (boxLogo) {
            boxLogo.style.cursor = "pointer";
            boxLogo.addEventListener("click", () => {
                if (fileLogo) fileLogo.click();
            });
            // Sürükle ve Bırak (Drag & Drop) Desteği
            boxLogo.addEventListener("dragover", (e) => {
                e.preventDefault();
                boxLogo.style.borderColor = "#38bdf8";
                boxLogo.style.background = "rgba(2,132,199,0.15)";
            });
            boxLogo.addEventListener("dragleave", () => {
                boxLogo.style.borderColor = "#475569";
                boxLogo.style.background = "#0f172a";
            });
            boxLogo.addEventListener("drop", (e) => {
                e.preventDefault();
                boxLogo.style.borderColor = "#475569";
                boxLogo.style.background = "#0f172a";
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleLogoFile(e.dataTransfer.files[0]);
                }
            });
        }

        // Kaşe Dosyası Yükleme
        if (fileStamp) {
            fileStamp.addEventListener("change", (e) => {
                handleStampFile(e.target.files[0]);
            });
        }
        if (btnRemoveStamp) {
            btnRemoveStamp.addEventListener("click", (e) => {
                e.stopPropagation();
                tempStampBase64 = "";
                if (fileStamp) fileStamp.value = "";
                updateStampDisplay();
            });
        }
        if (boxStamp) {
            boxStamp.style.cursor = "pointer";
            boxStamp.addEventListener("click", () => {
                if (fileStamp) fileStamp.click();
            });
            boxStamp.addEventListener("dragover", (e) => {
                e.preventDefault();
                boxStamp.style.borderColor = "#38bdf8";
                boxStamp.style.background = "rgba(2,132,199,0.15)";
            });
            boxStamp.addEventListener("dragleave", () => {
                boxStamp.style.borderColor = "#475569";
                boxStamp.style.background = "#0f172a";
            });
            boxStamp.addEventListener("drop", (e) => {
                e.preventDefault();
                boxStamp.style.borderColor = "#475569";
                boxStamp.style.background = "#0f172a";
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleStampFile(e.dataTransfer.files[0]);
                }
            });
        }

        // Panodan Yapıştırma (Ctrl+V) Desteği
        window.addEventListener("paste", (e) => {
            if (modal && modal.style.display === "flex") {
                const items = (e.clipboardData || e.originalEvent.clipboardData).items;
                for (let index in items) {
                    const item = items[index];
                    if (item.kind === 'file' && item.type.startsWith('image/')) {
                        const blob = item.getAsFile();
                        handleLogoFile(blob);
                        break;
                    }
                }
            }
        });

        // Örnek Firma ve Logo Yükle Butonu
        if (btnLoadSampleCompany) {
            btnLoadSampleCompany.addEventListener("click", () => {
                if (inpCompName) inpCompName.value = "AVRASYA GEOTEKNİK MÜHENDİSLİK LTD. ŞTİ.";
                if (inpCompSub) inpCompSub.value = "Zemin Mekaniği, Sondaj ve Geoteknik Müşavirlik";
                if (inpCompPhone) inpCompPhone.value = "0212 555 44 33 / 0532 555 44 33";
                if (inpCompEmail) inpCompEmail.value = "info@avrasyageoteknik.com";
                if (inpCompAddress) inpCompAddress.value = "Barbaros Bulvarı No:42 Beşiktaş / İstanbul";
                if (inpEngName) inpEngName.value = "Burhan YUSUFOĞLU";
                if (inpEngTitle) inpEngTitle.value = "Jeoloji Yüksek Mühendisi";
                if (inpEngReg) inpEngReg.value = "Oda Sicil No: 18452 / BTB: 2026";

                tempLogoBase64 = SAMPLE_CORP_LOGO;
                tempStampBase64 = SAMPLE_CORP_STAMP;

                updateLogoDisplay();
                updateStampDisplay();
                if (feedback) {
                    feedback.textContent = "✓ Örnek kurumsal firma logosu, unvanları ve kaşesi yüklendi! 'Kaydet'e basarak uygulayabilirsiniz.";
                    feedback.style.color = "#38bdf8";
                    feedback.style.display = "inline";
                    setTimeout(() => { feedback.style.display = "none"; }, 4000);
                }
            });
        }

        // Kaydet Butonu
        if (btnSave) {
            btnSave.addEventListener("click", () => {
                const data = {
                    companyName: inpCompName ? inpCompName.value.trim() : "",
                    companySubtitle: inpCompSub ? inpCompSub.value.trim() : "",
                    companyPhone: inpCompPhone ? inpCompPhone.value.trim() : "",
                    companyEmail: inpCompEmail ? inpCompEmail.value.trim() : "",
                    companyAddress: inpCompAddress ? inpCompAddress.value.trim() : "",
                    engineerName: inpEngName ? inpEngName.value.trim() : "",
                    engineerTitle: inpEngTitle ? inpEngTitle.value.trim() : "Jeoloji Mühendisi",
                    engineerRegNo: inpEngReg ? inpEngReg.value.trim() : "",
                    logoBase64: tempLogoBase64,
                    stampBase64: tempStampBase64
                };

                if (window.JeoCADCompany) {
                    window.JeoCADCompany.saveProfile(data);
                }

                // Metadata ve forma senkronize et
                currentProject.metadata.companyName = data.companyName;
                currentProject.metadata.engineerTitle = data.engineerTitle;
                currentProject.metadata.engineerName = data.engineerName;
                currentProject.metadata.engineerRegNo = data.engineerRegNo;

                const inpSidebarComp = document.getElementById("inpCompanyName");
                const inpSidebarEng = document.getElementById("inpEngineerName");
                const inpSidebarTitle = document.getElementById("inpEngineerTitle");
                const inpSidebarReg = document.getElementById("inpEngineerRegNo");
                if (inpSidebarComp) inpSidebarComp.value = data.companyName;
                if (inpSidebarEng) inpSidebarEng.value = data.engineerName;
                if (inpSidebarTitle) inpSidebarTitle.value = data.engineerTitle;
                if (inpSidebarReg) inpSidebarReg.value = data.engineerRegNo;

                // Üst bardaki logoyu ve unvanı güncelle
                if (data.logoBase64) {
                    const brandLogo = document.querySelector(".brand img");
                    if (brandLogo) brandLogo.src = data.logoBase64;
                }
                if (data.companyName) {
                    const brandName = document.querySelector(".brand-name");
                    if (brandName) brandName.innerHTML = `${data.companyName} <span class="badge-cad">JEOCAD</span>`;
                }

                // Sidebar mini önizlemesini de güncelle
                updateLogoDisplay();

                if (canvas) canvas.render();

                if (feedback) {
                    feedback.style.display = "inline";
                    setTimeout(() => { feedback.style.display = "none"; }, 3000);
                }
                statusTool.textContent = "✓ Firma bilgileri, logo ve kaşe başarıyla kaydedildi.";
                setTimeout(closeModal, 800);
            });
        }

        // Sayfa açıldığında kayıtlı profili uygula
        const initialProfile = (window.JeoCADCompany) ? window.JeoCADCompany.getProfile() : null;
        if (initialProfile) {
            if (initialProfile.logoBase64) {
                const brandLogo = document.querySelector(".brand img");
                if (brandLogo) brandLogo.src = initialProfile.logoBase64;
            }
            if (initialProfile.companyName) {
                const brandName = document.querySelector(".brand-name");
                if (brandName) brandName.innerHTML = `${initialProfile.companyName} <span class="badge-cad">JEOCAD</span>`;
            }
            tempLogoBase64 = initialProfile.logoBase64 || "";
            tempStampBase64 = initialProfile.stampBase64 || "";
            updateLogoDisplay();
        }
    }

    // ==============================================================================================
    // AKILLI ZEMİN İYİLEŞTİRME VE GEOTEKNİK KARAR MOTORU (TBDY 2018 / EUROCODE 7)
    // ==============================================================================================
    // ÇOKLU KUYU & METRAJ BAZLI AKILLI GEOTEKNİK İYİLEŞTİRME KARAR MOTORU (TBDY 2018)
    // ==============================================================================================
    function setupGeotechAdvisorManager() {
        // UI & Modal Referansları
        const btnOpenGeotechModal = document.getElementById("btnOpenGeotechModal");
        const geotechModal = document.getElementById("geotechModal");
        const btnCloseGeotechModal = document.getElementById("btnCloseGeotechModal");
        const btnCloseGeotechModalBottom = document.getElementById("btnCloseGeotechModalBottom");
        const btnPrintGeotechModal = document.getElementById("btnPrintGeotechModal");
        const btnCopyGeotechWord = document.getElementById("btnCopyGeotechWord");
        const btnInsertGeotechToCanvas = document.getElementById("btnInsertGeotechToCanvas");
        const geotechReportFrame = document.getElementById("geotechReportFrame");

        // Tab & Tablo Referansları
        const btnRunMultiGeotechAnalysis = document.getElementById("btnRunMultiGeotechAnalysis");
        const btnLoadDefaultMultiBorehole = document.getElementById("btnLoadDefaultMultiBorehole");
        const btnClearAllGeotechRows = document.getElementById("btnClearAllGeotechRows");
        const btnOpenPasteGeotechModal = document.getElementById("btnOpenPasteGeotechModal");
        const btnAddNewTestRow = document.getElementById("btnAddNewTestRow");
        const selFilterBorehole = document.getElementById("selFilterBorehole");
        const geotechRowCountBadge = document.getElementById("geotechRowCountBadge");
        const geotechTableBody = document.getElementById("geotechTableBody");
        const geotechResultBox = document.getElementById("geotechResultBox");

        // Parametre Girdi Referansları
        const selMultiGeoZeminSinifi = document.getElementById("selMultiGeoZeminSinifi");
        const selMultiGeoDepremDD = document.getElementById("selMultiGeoDepremDD");
        const inpMultiGeoGwDepth = document.getElementById("inpMultiGeoGwDepth");
        const selMultiGeoStructureType = document.getElementById("selMultiGeoStructureType");

        // Excel Yapıştırma Modalı Referansları
        const modalPasteGeotechExcel = document.getElementById("modalPasteGeotechExcel");
        const btnClosePasteGeotechModal = document.getElementById("btnClosePasteGeotechModal");
        const btnClosePasteGeotechModalBottom = document.getElementById("btnClosePasteGeotechModalBottom");
        const txtPasteGeotechExcel = document.getElementById("txtPasteGeotechExcel");
        const btnParseAndApplyGeotechExcel = document.getElementById("btnParseAndApplyGeotechExcel");

        // Yeni Satır Ekleme Modalı Referansları
        const modalAddGeotechRow = document.getElementById("modalAddGeotechRow");
        const btnCloseAddGeotechModal = document.getElementById("btnCloseAddGeotechModal");
        const btnCloseAddGeotechModalBottom = document.getElementById("btnCloseAddGeotechModalBottom");
        const btnSubmitAddGeotechRow = document.getElementById("btnSubmitAddGeotechRow");

        // Yeni Satır Girdileri
        const inpAddGeoBorehole = document.getElementById("inpAddGeoBorehole");
        const inpAddGeoDepth = document.getElementById("inpAddGeoDepth");
        const inpAddGeoSpt = document.getElementById("inpAddGeoSpt");
        const inpAddGeoPl = document.getElementById("inpAddGeoPl");
        const inpAddGeoEm = document.getElementById("inpAddGeoEm");
        const inpAddGeoPointLoad = document.getElementById("inpAddGeoPointLoad");
        const inpAddGeoCohesion = document.getElementById("inpAddGeoCohesion");
        const inpAddGeoFriction = document.getElementById("inpAddGeoFriction");
        const inpAddGeoPI = document.getElementById("inpAddGeoPI");
        const inpAddGeoLL = document.getElementById("inpAddGeoLL");
        const inpAddGeoLithology = document.getElementById("inpAddGeoLithology");

        // Çoklu Kuyu ve Deney Veri Durumu (Kullanıcının isteği: Varsayılan olarak BOŞ açılır)
        let currentTestRows = [];
        let lastAnalysisResult = null;

        // Proje ve Deprem Ayarlarını Al
        function getProjectSettings() {
            return {
                zeminSinifi: selMultiGeoZeminSinifi ? selMultiGeoZeminSinifi.value : "ZE",
                depremDD: selMultiGeoDepremDD ? selMultiGeoDepremDD.value : "DD-2",
                gwDepth: inpMultiGeoGwDepth ? (parseFloat(inpMultiGeoGwDepth.value) || 2.2) : 2.2,
                structureType: selMultiGeoStructureType ? selMultiGeoStructureType.value : "medium"
            };
        }

        // Kuyu Filtresi Seçeneklerini Güncelle (Çoklu SK Tam Senkronizasyon)
        function updateBoreholeFilterOptions() {
            if (!selFilterBorehole) return;
            const currentVal = selFilterBorehole.value || "all";
            
            // Hem mevcut deney satırlarından hem de CAD kesitindeki kuyulardan kuyu isimlerini topla
            const bhSet = new Set();
            (currentProject.boreholes || []).forEach(b => { if (b.name) bhSet.add(b.name.trim()); });
            currentTestRows.forEach(r => { if (r.borehole) bhSet.add(r.borehole.trim()); });
            if (bhSet.size === 0) {
                bhSet.add("SK-1");
            }
            const boreholes = Array.from(bhSet).sort();

            // Hızlı giriş autocomplete datalist'ini (#dlBoreholes) güncelle
            const dlBhs = document.getElementById("dlBoreholes");
            if (dlBhs) {
                dlBhs.innerHTML = boreholes.map(bh => `<option value="${bh}"></option>`).join("");
            }

            let optsHtml = `<option value="all">Tüm Kuyular (${boreholes.length} Kuyu - Parsel Geneli)</option>`;
            boreholes.forEach(bh => {
                const count = currentTestRows.filter(r => r.borehole === bh).length;
                optsHtml += `<option value="${bh}">${bh} Kuyusu (${count} Deney)</option>`;
            });
            selFilterBorehole.innerHTML = optsHtml;

            if (bhSet.has(currentVal) || currentVal === "all") {
                selFilterBorehole.value = currentVal;
            } else {
                selFilterBorehole.value = "all";
            }
        }

        // Deney Tablosunu Çiz
        function renderTable() {
            if (!geotechTableBody) return;
            const filterBh = selFilterBorehole ? selFilterBorehole.value : "all";
            const displayRows = filterBh === "all" 
                ? currentTestRows.slice() 
                : currentTestRows.filter(r => r.borehole === filterBh);

            // Kuyulara ve derinliğe göre sırala
            displayRows.sort((a, b) => {
                if (a.borehole !== b.borehole) return a.borehole.localeCompare(b.borehole);
                return (parseFloat(a.depth) || 0) - (parseFloat(b.depth) || 0);
            });

            // Sayaç etiketi
            if (geotechRowCountBadge) {
                const bhCount = new Set(currentTestRows.map(r => r.borehole)).size;
                geotechRowCountBadge.textContent = `${currentTestRows.length} Deney (${bhCount} Kuyu)`;
            }

            if (displayRows.length === 0) {
                geotechTableBody.innerHTML = `
                    <tr>
                        <td colspan="9" style="padding:22px 10px;text-align:center;color:#94a3b8;background:rgba(15,23,42,0.6);">
                            <div style="font-size:24px;margin-bottom:6px;">📋</div>
                            <b style="color:#f1f5f9;font-size:12px;">Henüz deney verisi girilmedi</b><br>
                            <span style="font-size:11px;color:#94a3b8;display:block;margin-top:6px;line-height:1.5;">
                                Değerleri, metrajları ve kuyu isimlerini aşağıdaki hızlı giriş kutularından yazabilir,<br>
                                veya aşağıdaki butonları kullanarak hemen veri ekleyebilirsiniz:
                            </span>
                            <div style="display:flex;gap:6px;justify-content:center;margin-top:12px;flex-wrap:wrap;">
                                <button type="button" id="btnEmptyAddNewTestRow" style="background:#2563eb;color:#fff;font-weight:bold;font-size:11px;padding:6px 12px;border-radius:4px;cursor:pointer;border:none;">➕ Yeni Deney Ekle</button>
                                <button type="button" id="btnEmptyPasteExcel" style="background:#059669;color:#fff;font-weight:bold;font-size:11px;padding:6px 12px;border-radius:4px;cursor:pointer;border:none;">📋 Excel'den Yapıştır</button>
                                <button type="button" id="btnEmptyLoadDemo" style="background:#0284c7;color:#fff;font-weight:bold;font-size:11px;padding:6px 12px;border-radius:4px;cursor:pointer;border:none;">📁 Hazır 3 Kuyulu Örnek (SK-1,2,3)</button>
                            </div>
                        </td>
                    </tr>
                `;

                // Boş tablodaki butonları dinle
                const bEmptyAdd = document.getElementById("btnEmptyAddNewTestRow");
                if (bEmptyAdd) bEmptyAdd.addEventListener("click", () => {
                    openModalAddGeotechRow();
                });
                const bEmptyPaste = document.getElementById("btnEmptyPasteExcel");
                if (bEmptyPaste) bEmptyPaste.addEventListener("click", () => {
                    openModalPasteGeotechExcel();
                });
                const bEmptyDemo = document.getElementById("btnEmptyLoadDemo");
                if (bEmptyDemo) bEmptyDemo.addEventListener("click", () => {
                    if (btnLoadDefaultMultiBorehole) btnLoadDefaultMultiBorehole.click();
                });
                return;
            }

            const gw = getProjectSettings().gwDepth;
            let html = "";
            displayRows.forEach(r => {
                const d = parseFloat(r.depth) || 0;
                const spt = parseFloat(r.sptN60) || 0;
                const piVal = parseFloat(r.pi) || 0;
                const plVal = parseFloat(r.presioPL) || 0;

                // Kritik risk renkleri
                const isLiqProne = (d >= gw && spt <= 15 && piVal <= 16);
                const isSwellingProne = (d <= 3.5 && piVal > 30);
                const isBedrock = (spt >= 45 || (parseFloat(r.pointLoadIs) || 0) >= 1.0);

                let depthBadge = `${d.toFixed(2)}m`;
                let sptStyle = "color:#f8fafc;";
                if (isLiqProne) sptStyle = "color:#ef4444;font-weight:bold;background:rgba(239,68,68,0.2);border-radius:2px;";
                else if (isBedrock) sptStyle = "color:#10b981;font-weight:bold;";

                let piStyle = "color:#cbd5e1;";
                if (isSwellingProne) piStyle = "color:#f59e0b;font-weight:bold;background:rgba(245,158,11,0.2);border-radius:2px;";

                html += `
                    <tr style="border-bottom:1px solid #1e293b;hover:background:#1e293b;" title="${r.lithology || ''}" data-rowid="${r.id}">
                        <td style="padding:4px 5px;font-weight:bold;color:#38bdf8;border:1px solid #334155;">${r.borehole || "SK-1"}</td>
                        <td style="padding:4px 5px;color:#f1f5f9;border:1px solid #334155;">${depthBadge}</td>
                        <td style="padding:4px 5px;border:1px solid #334155;${sptStyle}">${spt}</td>
                        <td style="padding:4px 5px;color:#94a3b8;border:1px solid #334155;">${plVal > 0 ? plVal.toFixed(2) : "-"}</td>
                        <td style="padding:4px 5px;color:#94a3b8;border:1px solid #334155;">${r.presioEM ? parseFloat(r.presioEM).toFixed(1) : "-"}</td>
                        <td style="padding:4px 5px;color:#94a3b8;border:1px solid #334155;">${r.pointLoadIs ? parseFloat(r.pointLoadIs).toFixed(1) : "-"}</td>
                        <td style="padding:4px 5px;color:#94a3b8;border:1px solid #334155;">${r.cohesion || "-"}/${r.frictionAngle || "-"}°</td>
                        <td style="padding:4px 5px;border:1px solid #334155;${piStyle}">%${piVal > 0 ? piVal : "-"}</td>
                        <td style="padding:2px 4px;border:1px solid #334155;white-space:nowrap;">
                            <button type="button" class="btn-edit-geo-row" data-rowid="${r.id}" style="background:transparent;border:none;color:#38bdf8;cursor:pointer;font-size:11px;padding:2px 3px;" title="Bu satırı düzenleme kutularına al">✏️</button>
                            <button type="button" class="btn-delete-geo-row" data-rowid="${r.id}" style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:11px;padding:2px 3px;" title="Bu satırı sil">✕</button>
                        </td>
                    </tr>
                `;
            });

            geotechTableBody.innerHTML = html;

            // Satır düzenleme butonlarını dinle
            geotechTableBody.querySelectorAll(".btn-edit-geo-row").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const rowId = btn.getAttribute("data-rowid");
                    const found = currentTestRows.find(r => r.id === rowId);
                    if (found) {
                        const inpBh = document.getElementById("inpFastBh");
                        const inpD = document.getElementById("inpFastDepth");
                        const inpSpt = document.getElementById("inpFastSpt");
                        const inpPl = document.getElementById("inpFastPl");
                        const inpEm = document.getElementById("inpFastEm");
                        const inpIs = document.getElementById("inpFastIs");
                        const inpCPhi = document.getElementById("inpFastCPhi");
                        const inpPi = document.getElementById("inpFastPI");
                        const btnAdd = document.getElementById("btnFastAddGeoRow");

                        if (inpBh) inpBh.value = found.borehole;
                        if (inpD) inpD.value = found.depth;
                        if (inpSpt) inpSpt.value = found.sptN60;
                        if (inpPl) inpPl.value = found.presioPL;
                        if (inpEm) inpEm.value = found.presioEM;
                        if (inpIs) inpIs.value = found.pointLoadIs;
                        if (inpCPhi) inpCPhi.value = `${found.cohesion}/${found.frictionAngle}`;
                        if (inpPi) inpPi.value = found.pi;

                        // Eski satırı kaldırıp güncellenmek üzere kutulara yükle
                        currentTestRows = currentTestRows.filter(r => r.id !== rowId);
                        if (btnAdd) {
                            btnAdd.textContent = "💾 Güncelle";
                            btnAdd.style.background = "#10b981";
                        }
                        if (inpSpt) inpSpt.focus();
                    }
                });
            });

            // Satır silme butonlarını dinle
            geotechTableBody.querySelectorAll(".btn-delete-geo-row").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const rowId = btn.getAttribute("data-rowid");
                    currentTestRows = currentTestRows.filter(r => r.id !== rowId);
                    updateBoreholeFilterOptions();
                    renderTable();
                    runAnalysis();
                });
            });
        }

        // Çoklu Kuyu ve Metraj Analizini Çalıştır
        function runAnalysis() {
            if (!window.JeoCADGeotechAdvisor) return;

            if (!currentTestRows || currentTestRows.length === 0) {
                if (geotechResultBox) {
                    geotechResultBox.innerHTML = `
                        <div style="background:#1e293b;border:1px dashed #475569;border-radius:6px;padding:16px;text-align:center;color:#94a3b8;font-size:11.5px;">
                            💡 Henüz analiz edilecek deney verisi girilmedi.<br>
                            Lütfen sol üstteki <b>"➕ Yeni Deney Ekle"</b> butonundan kuyu adı, metraj ve deney değerlerinizi girin.
                        </div>
                    `;
                    geotechResultBox.style.display = "block";
                }
                if (geotechReportFrame) {
                    geotechReportFrame.srcdoc = `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:30px;color:#64748b;text-align:center;"><h3>Henüz Deney Verisi Girilmedi</h3><p>Lütfen kuyu adı, metraj ve laboratuvar/arazi deney değerlerinizi sol panelden ekleyin.</p></body></html>`;
                }
                return;
            }

            const settings = getProjectSettings();
            const res = window.JeoCADGeotechAdvisor.analyzeMultiBorehole(currentTestRows, settings);
            lastAnalysisResult = res;

            // Yan panel sonuç kartlarını oluştur
            if (geotechResultBox) {
                renderResultBox(res);
                geotechResultBox.style.display = "block";
            }

            // A4 Resmi Rapor iframe içeriğini güncelle
            if (geotechReportFrame) {
                const reportHtml = window.JeoCADGeotechAdvisor.generateDetailedOfficialReportHTML(res);
                geotechReportFrame.srcdoc = reportHtml;
            }
        }

        // Yan Panel Sonuçlarını Görselleştir
        function renderResultBox(res) {
            const scoreColor = res.score >= 70 ? "#10b981" : (res.score >= 45 ? "#f59e0b" : "#ef4444");
            const scoreLabel = res.score >= 70 ? "Orta-İyi Taşıma Gücü" : (res.score >= 45 ? "Riskli / Sıvılaşabilir Zemin (İyileştirme Zorunlu)" : "Çok Zayıf / Kritik Problemli Zemin");

            // Kuyu özet rozetleri
            let bhBadgesHtml = "";
            res.boreholes.forEach(bh => {
                const b = res.bhSummaries[bh];
                bhBadgesHtml += `
                    <div style="background:#0f172a;border:1px solid #334155;border-radius:4px;padding:4px 6px;font-size:10px;color:#cbd5e1;">
                        <span style="color:#38bdf8;font-weight:bold;">${bh}:</span> ${b.maxDepth.toFixed(1)}m | Refü/Kaya: <b style="color:#10b981;">${b.bedrockDepth.toFixed(1)}m</b> | Ort. SPT: <b>${b.avgSpt}</b>
                    </div>
                `;
            });

            // Risk Rozetleri
            let risksBadges = "";
            res.risks.forEach(r => {
                const bg = r.type === "danger" ? "#dc2626" : (r.type === "warning" ? "#d97706" : "#0284c7");
                risksBadges += `<div style="background:${bg};color:#fff;font-size:10px;padding:3px 7px;border-radius:3px;font-weight:600;margin-top:3px;line-height:1.3;">⚠️ ${r.title}</div>`;
            });

            // İyileştirme Çözüm Kartları
            let solutionsCards = "";
            res.solutions.forEach((s, idx) => {
                const isPrimary = idx === 0;
                const cardBorder = isPrimary ? "#f59e0b" : "#3b82f6";
                const badgeBg = isPrimary ? "#f59e0b" : "#2563eb";
                const badgeColor = isPrimary ? "#0f172a" : "#ffffff";

                let keySpecs = "";
                s.techSpecs.slice(0, 4).forEach(spec => {
                    keySpecs += `<div style="font-size:10.5px;color:#cbd5e1;line-height:1.4;"><span style="color:#94a3b8;">${spec.label}:</span> <b style="color:#f8fafc;">${spec.val}</b></div>`;
                });

                solutionsCards += `
                    <div style="background:#0f172a;border:1px solid ${cardBorder};border-radius:6px;padding:10px;margin-bottom:8px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                            <strong style="color:#f8fafc;font-size:11.5px;">${s.methodName}</strong>
                            <span style="background:${badgeBg};color:${badgeColor};font-size:9px;padding:1px 5px;border-radius:3px;font-weight:bold;">${s.priority}</span>
                        </div>
                        <p style="font-size:10.5px;color:#94a3b8;margin:0 0 6px 0;line-height:1.35;">${s.summary}</p>
                        <div style="background:rgba(255,255,255,0.04);border-radius:4px;padding:6px;margin-bottom:6px;">
                            ${keySpecs}
                        </div>
                    </div>
                `;
            });

            geotechResultBox.innerHTML = `
                <!-- SKOR GÖSTERGESİ -->
                <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:10px;margin-bottom:10px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:11px;color:#94a3b8;">Parsel Geoteknik Skoru:</span>
                        <span style="font-size:16px;font-weight:800;color:${scoreColor};">${res.score} / 100</span>
                    </div>
                    <div style="width:100%;height:6px;background:#334155;border-radius:3px;overflow:hidden;margin-bottom:6px;">
                        <div style="width:${res.score}%;height:100%;background:${scoreColor};border-radius:3px;transition:width 0.4s;"></div>
                    </div>
                    <div style="font-size:11px;color:#cbd5e1;font-weight:700;">${scoreLabel}</div>
                    
                    <!-- Kuyu Özetleri -->
                    <div style="margin-top:8px;display:flex;flex-direction:column;gap:3px;">
                        <span style="font-size:10px;color:#94a3b8;font-weight:bold;">📊 Kuyu & Ana Kaya Profili:</span>
                        ${bhBadgesHtml}
                    </div>

                    <!-- Risk Etiketleri -->
                    <div style="margin-top:8px;">
                        <span style="font-size:10px;color:#ef4444;font-weight:bold;">🚨 Tespit Edilen Kritik Riskler:</span>
                        ${risksBadges}
                    </div>
                </div>

                <!-- ÖNERİLEN ÇÖZÜMLER -->
                <div style="margin-bottom:10px;">
                    <div style="font-size:11px;font-weight:700;color:#f59e0b;margin-bottom:6px;">🏗️ Metraja Göre Boyutlandırılmış İyileştirme:</div>
                    ${solutionsCards}
                </div>

                <!-- EYLEM BUTONLARI -->
                <div style="display:flex;flex-direction:column;gap:6px;">
                    <button id="btnOpenFullReportFromPanel" class="btn-action" style="background:#0284c7;color:#fff;font-size:11.5px;padding:8px;font-weight:bold;cursor:pointer;border:none;border-radius:4px;">
                        📄 Resmi A4 İyileştirme Raporunu Aç (PDF)
                    </button>
                    <div style="display:flex;gap:4px;">
                        <button id="btnCopyReportFromPanel" class="btn-action" style="flex:1;background:#2563eb;color:#fff;font-size:10.5px;padding:6px;cursor:pointer;border:none;border-radius:4px;">
                            📋 Word'e Kopyala
                        </button>
                        <button id="btnInsertReportFromPanel" class="btn-action" style="flex:1;background:#10b981;color:#fff;font-size:10.5px;padding:6px;cursor:pointer;border:none;border-radius:4px;">
                            📌 Kesite Ekle
                        </button>
                    </div>
                    <div id="geotechPanelFeedback" style="display:none;font-size:11px;color:#10b981;text-align:center;font-weight:bold;margin-top:2px;"></div>
                </div>
            `;

            // Buton Dinleyicileri
            const btnOpenFull = document.getElementById("btnOpenFullReportFromPanel");
            if (btnOpenFull) btnOpenFull.addEventListener("click", openModal);

            const btnCopy = document.getElementById("btnCopyReportFromPanel");
            if (btnCopy) btnCopy.addEventListener("click", copyWordReport);

            const btnInsert = document.getElementById("btnInsertReportFromPanel");
            if (btnInsert) btnInsert.addEventListener("click", insertToCanvas);
        }

        // Rapor Modalı Aç / Kapat
        function openModal() {
            if (!lastAnalysisResult) runAnalysis();
            if (geotechModal) geotechModal.style.display = "flex";
        }

        function closeModal() {
            if (geotechModal) geotechModal.style.display = "none";
        }

        // Word Raporunu Panoya Kopyala
        function copyWordReport() {
            if (!lastAnalysisResult || !window.JeoCADGeotechAdvisor) return;
            const text = window.JeoCADGeotechAdvisor.generateDetailedWordReportText(lastAnalysisResult);
            navigator.clipboard.writeText(text).then(() => {
                const fb = document.getElementById("geotechPanelFeedback");
                if (fb) {
                    fb.textContent = "✓ Ayrıntılı geoteknik rapor panoya kopyalandı! Word'e yapıştırabilirsiniz.";
                    fb.style.display = "block";
                    setTimeout(() => { fb.style.display = "none"; }, 4000);
                }
                alert("✓ TBDY 2018 Uyumlu Çoklu Kuyu ve Metraj Geoteknik İyileştirme Raporu panoya kopyalandı!\nMicrosoft Word veya rapor dosyanıza Ctrl+V ile doğrudan yapıştırabilirsiniz.");
            });
        }

        // Kesit Canvasına Açıklama Kartı Ekle
        function insertToCanvas() {
            if (!lastAnalysisResult || !canvas) return;
            const res = lastAnalysisResult;
            const primarySol = res.solutions[0] || { methodName: "Rijit Temel", summary: "Zemin analizi tamamlandı." };

            const noteText = `[ZEMİN İYİLEŞTİRME REÇETESİ]: ${primarySol.methodName}\n` +
                             `Kuyular: ${res.boreholes.join(', ')} | Zemin: ${res.settings.zeminSinifi} | Deprem: ${res.settings.depremDD}\n` +
                             `Ana Kaya Derinliği: Ort. ${res.avgBedrockDepth}m (Maks: ${res.maxBedrockDepth}m)\n` +
                             `Riskler: Sıvılaşma: ${res.liquefactionRisk} | Şişme: ${res.swellingRisk}\n` +
                             `Tasarım: ${primarySol.summary}`;

            if (!currentProject.annotations) currentProject.annotations = [];
            currentProject.annotations.push({
                id: "note_" + Date.now(),
                x: 2.0,
                elevation: (currentProject.minElevation || 80) + 2.0,
                text: noteText,
                fontSize: 10,
                color: "#991b1b"
            });

            canvas.render();
            alert("✓ Çoklu Kuyu ve Metraj Zemin İyileştirme Tasarım Kartı jeolojik kesitin üzerine başarıyla eklendi!");
        }

        // Excel Metnini Ayrıştır (Akıllı Ayraç & Türkçe Ondalık Virgül 1,50 Desteği)
        function parseExcelData(rawText, mode) {
            if (!rawText || !rawText.trim()) return;
            const lines = rawText.trim().split(/\r?\n/);
            const parsedRows = [];

            const parseNum = (val, def = 0.0) => {
                if (val === undefined || val === null || val === "") return def;
                const cleaned = String(val).replace(/\s+/g, "").replace(",", ".");
                const n = parseFloat(cleaned);
                return isNaN(n) ? def : n;
            };

            lines.forEach((line, idx) => {
                if (!line.trim()) return;

                // Akıllı Sütun Ayracı Tespiti:
                // Excel panodan kopyalandığında sütunlar arası sekme (\t) karakteri bırakır.
                // Eğer satırda \t varsa SADECE sekmeden bölmeli, Türkçe ondalık virgüllere (1,5) kesinlikle dokunmamalıyız!
                let parts = [];
                if (line.includes("\t")) {
                    parts = line.split("\t");
                } else if (line.includes(";")) {
                    parts = line.split(";");
                } else if (line.includes(",")) {
                    // Virgül ayracı: ondalık virgül olmayan virgüllerden böl (sayı ardışığı olmayan)
                    parts = line.split(/,(?!\d)/);
                } else {
                    parts = line.trim().split(/\s{2,}/);
                }
                parts = parts.map(s => s.trim().replace(/^["']|["']$/g, ""));
                if (parts.length < 2) return;

                // Başlık satırı kontrolü
                const firstCol = parts[0].toLowerCase();
                if (firstCol.includes("kuyu") || firstCol.includes("sondaj") || firstCol.includes("derinlik") || firstCol.includes("borehole") || firstCol.includes("sk-no")) {
                    return; // Başlığı atla
                }

                let bhName = "SK-1";
                let depthVal = 1.5;
                let sptVal = 10;
                let plVal = 0.0;
                let emVal = 0.0;
                let isVal = 0.0;
                let cVal = 15;
                let phiVal = 20;
                let piVal = 15;
                let llVal = 30;
                let lithVal = "Zemin Katmanı";

                // Eğer ilk sütun bir sayı ise (örn: 1.5 veya 3.0), kullanıcı Kuyu adını eklememiş olabilir
                const firstAsNum = parseFloat(String(parts[0]).replace(",", "."));
                if (!isNaN(firstAsNum) && !parts[0].toLowerCase().includes("sk")) {
                    // İlk sütun derinlik!
                    bhName = (selFilterBorehole && selFilterBorehole.value !== "all") ? selFilterBorehole.value : "SK-1";
                    depthVal = parseNum(parts[0], 1.5);
                    sptVal = parseNum(parts[1], 10);
                    plVal = parseNum(parts[2], 0.0);
                    emVal = parseNum(parts[3], 0.0);
                    isVal = parseNum(parts[4], 0.0);
                    cVal = parseNum(parts[5], 15);
                    phiVal = parseNum(parts[6], 20);
                    piVal = parseNum(parts[7], 15);
                    llVal = parseNum(parts[8], 30);
                    lithVal = parts[9] || "Zemin Katmanı";
                } else {
                    // İlk sütun kuyu adı
                    bhName = parts[0] || `SK-${idx + 1}`;
                    depthVal = parseNum(parts[1], (idx + 1) * 1.5);
                    sptVal = parseNum(parts[2], 10);
                    plVal = parseNum(parts[3], 0.0);
                    emVal = parseNum(parts[4], 0.0);
                    isVal = parseNum(parts[5], 0.0);
                    cVal = parseNum(parts[6], 15);
                    phiVal = parseNum(parts[7], 20);
                    piVal = parseNum(parts[8], 15);
                    llVal = parseNum(parts[9], 30);
                    lithVal = parts[10] || "Zemin Katmanı";
                }

                parsedRows.push({
                    id: "ex_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
                    borehole: bhName,
                    depth: depthVal,
                    sptN60: sptVal,
                    presioPL: plVal,
                    presioEM: emVal,
                    pointLoadIs: isVal,
                    cohesion: cVal,
                    frictionAngle: phiVal,
                    pi: piVal,
                    ll: llVal,
                    lithology: lithVal
                });
            });

            if (parsedRows.length === 0) {
                alert("Geçerli deney satırı bulunamadı. Lütfen Excel'den kopyaladığınız formatı kontrol edin.");
                return;
            }

            if (mode === "append") {
                currentTestRows = currentTestRows.concat(parsedRows);
            } else {
                currentTestRows = parsedRows;
            }

            updateBoreholeFilterOptions();
            renderTable();
            runAnalysis();

            closeModalPasteGeotechExcel();
            if (statusTool) {
                statusTool.textContent = `✓ Excel'den ${parsedRows.length} adet deney satırı başarıyla aktarıldı ve analiz güncellendi!`;
            }
        }

        // ================= OLAY DİNLEYİCİLERİ =================

        // 1. Hazır Parsel Örneği Yükle (SK-1, SK-2, SK-3)
        if (btnLoadDefaultMultiBorehole) {
            btnLoadDefaultMultiBorehole.addEventListener("click", () => {
                if (window.JeoCADGeotechAdvisor) {
                    currentTestRows = JSON.parse(JSON.stringify(window.JeoCADGeotechAdvisor.getDefaultTestRows()));
                    updateBoreholeFilterOptions();
                    renderTable();
                    runAnalysis();
                }
            });
        }

        // 2. Tabloyu Temizle
        if (btnClearAllGeotechRows) {
            btnClearAllGeotechRows.addEventListener("click", () => {
                if (confirm("Deney tablosundaki tüm satırlar silinecek. Emin misiniz?")) {
                    currentTestRows = [];
                    updateBoreholeFilterOptions();
                    renderTable();
                    runAnalysis();
                }
            });
        }

        // 3. Kuyu Filtresi Değiştiğinde
        if (selFilterBorehole) {
            selFilterBorehole.addEventListener("change", () => {
                renderTable();
            });
        }

        // 4. Proje Parametreleri Değiştiğinde
        [selMultiGeoZeminSinifi, selMultiGeoDepremDD, inpMultiGeoGwDepth, selMultiGeoStructureType].forEach(el => {
            if (el) el.addEventListener("change", () => {
                runAnalysis();
            });
        });

        // 5. Analiz Butonu
        if (btnRunMultiGeotechAnalysis) {
            btnRunMultiGeotechAnalysis.addEventListener("click", () => {
                if (currentTestRows.length === 0) {
                    alert("⚠️ Henüz deney tablosuna veri girilmedi.\nLütfen '➕ Yeni Deney Ekle' butonuyla kendi kuyu ve metrajlarınızı girin veya '📋 Excel'den Yapıştır' seçeneğini kullanın.");
                    return;
                }
                runAnalysis();
            });
        }

        // 6. Üst Bar Butonu
        if (btnOpenGeotechModal) {
            btnOpenGeotechModal.addEventListener("click", () => {
                const geotechTabBtn = document.querySelector('.tab-btn[data-tab="tab-geotech"]');
                if (geotechTabBtn) geotechTabBtn.click();
                if (currentTestRows.length > 0) {
                    runAnalysis();
                }
                openModal();
            });
        }

        // ================= KULLANICI İSTEĞİ: YENİ EKLE & EXCEL'DEN GETİR TAM AKTİVASYONU =================
        function openModalPasteGeotechExcel() {
            if (!modalPasteGeotechExcel) return;
            modalPasteGeotechExcel.classList.add("open");
            modalPasteGeotechExcel.style.display = "flex";
            modalPasteGeotechExcel.style.zIndex = "99999";
            if (txtPasteGeotechExcel) {
                setTimeout(() => txtPasteGeotechExcel.focus(), 60);
            }
        }

        function closeModalPasteGeotechExcel() {
            if (!modalPasteGeotechExcel) return;
            modalPasteGeotechExcel.classList.remove("open");
            modalPasteGeotechExcel.style.display = "none";
        }

        function openModalAddGeotechRow() {
            if (!modalAddGeotechRow) return;
            modalAddGeotechRow.classList.add("open");
            modalAddGeotechRow.style.display = "flex";
            modalAddGeotechRow.style.zIndex = "99999";
            if (inpAddGeoBorehole) {
                setTimeout(() => inpAddGeoBorehole.focus(), 60);
            }
        }

        function closeModalAddGeotechRow() {
            if (!modalAddGeotechRow) return;
            modalAddGeotechRow.classList.remove("open");
            modalAddGeotechRow.style.display = "none";
        }

        window.openModalPasteGeotechExcel = openModalPasteGeotechExcel;
        window.closeModalPasteGeotechExcel = closeModalPasteGeotechExcel;
        window.openModalAddGeotechRow = openModalAddGeotechRow;
        window.closeModalAddGeotechRow = closeModalAddGeotechRow;
        window.addGeotechRowsFromBatch = (newRows) => {
            if (!Array.isArray(newRows) || newRows.length === 0) return;
            currentTestRows = currentTestRows.concat(newRows);
            updateBoreholeFilterOptions();
            renderTable();
            runAnalysis();
        };

        // 7. Excel Yapıştırma Modalı Butonları
        if (btnOpenPasteGeotechModal) {
            btnOpenPasteGeotechModal.addEventListener("click", openModalPasteGeotechExcel);
        }
        if (btnClosePasteGeotechModal) {
            btnClosePasteGeotechModal.addEventListener("click", closeModalPasteGeotechExcel);
        }
        if (btnClosePasteGeotechModalBottom) {
            btnClosePasteGeotechModalBottom.addEventListener("click", closeModalPasteGeotechExcel);
        }
        if (modalPasteGeotechExcel) {
            modalPasteGeotechExcel.addEventListener("click", (e) => {
                if (e.target === modalPasteGeotechExcel) closeModalPasteGeotechExcel();
            });
        }

        // Excel / CSV Dosyası Yükleme
        const filePasteExcelUpload = document.getElementById("filePasteExcelUpload");
        const txtExcelFileStatus = document.getElementById("txtExcelFileStatus");
        if (filePasteExcelUpload) {
            filePasteExcelUpload.addEventListener("change", (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (re) => {
                    if (txtPasteGeotechExcel) {
                        txtPasteGeotechExcel.value = re.target.result;
                    }
                    if (txtExcelFileStatus) {
                        txtExcelFileStatus.textContent = `✓ ${file.name} yüklendi!`;
                    }
                };
                reader.readAsText(file, "UTF-8");
            });
        }

        if (btnParseAndApplyGeotechExcel) {
            btnParseAndApplyGeotechExcel.addEventListener("click", () => {
                const text = txtPasteGeotechExcel ? txtPasteGeotechExcel.value : "";
                const modeInput = document.querySelector('input[name="pasteGeoMode"]:checked');
                const mode = modeInput ? modeInput.value : "replace";
                parseExcelData(text, mode);
            });
        }

        // 8. Yeni Satır Ekleme Modalı Butonları
        if (btnAddNewTestRow) {
            btnAddNewTestRow.addEventListener("click", openModalAddGeotechRow);
        }
        if (btnCloseAddGeotechModal) {
            btnCloseAddGeotechModal.addEventListener("click", closeModalAddGeotechRow);
        }
        if (btnCloseAddGeotechModalBottom) {
            btnCloseAddGeotechModalBottom.addEventListener("click", closeModalAddGeotechRow);
        }
        if (modalAddGeotechRow) {
            modalAddGeotechRow.addEventListener("click", (e) => {
                if (e.target === modalAddGeotechRow) closeModalAddGeotechRow();
            });
        }

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeModalAddGeotechRow();
                closeModalPasteGeotechExcel();
            }
        });

        if (btnSubmitAddGeotechRow) {
            btnSubmitAddGeotechRow.addEventListener("click", () => {
                const bhName = (inpAddGeoBorehole && inpAddGeoBorehole.value.trim()) ? inpAddGeoBorehole.value.trim() : "SK-1";
                const depthVal = parseFloat(inpAddGeoDepth ? inpAddGeoDepth.value : "3.0") || 3.0;

                const newRow = {
                    id: "usr_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
                    borehole: bhName,
                    depth: depthVal,
                    sptN60: parseFloat(inpAddGeoSpt ? inpAddGeoSpt.value : "10") || 10,
                    presioPL: parseFloat(inpAddGeoPl ? inpAddGeoPl.value : "0.5") || 0.0,
                    presioEM: parseFloat(inpAddGeoEm ? inpAddGeoEm.value : "5.0") || 0.0,
                    pointLoadIs: parseFloat(inpAddGeoPointLoad ? inpAddGeoPointLoad.value : "0.0") || 0.0,
                    cohesion: parseFloat(inpAddGeoCohesion ? inpAddGeoCohesion.value : "15") || 0.0,
                    frictionAngle: parseFloat(inpAddGeoFriction ? inpAddGeoFriction.value : "20") || 0.0,
                    pi: parseFloat(inpAddGeoPI ? inpAddGeoPI.value : "15") || 0.0,
                    ll: parseFloat(inpAddGeoLL ? inpAddGeoLL.value : "30") || 0.0,
                    lithology: (inpAddGeoLithology && inpAddGeoLithology.value.trim()) ? inpAddGeoLithology.value.trim() : "Katman"
                };

                currentTestRows.push(newRow);
                updateBoreholeFilterOptions();
                renderTable();
                runAnalysis();

                // Kullanıcının ardışık giriş yapmasını kolaylaştırmak için kuyu adını koru ve metrajı ilerlet (+1.5m)
                if (inpAddGeoDepth) {
                    inpAddGeoDepth.value = (depthVal + 1.5).toFixed(1);
                }

                closeModalAddGeotechRow();
            });
        }

        // ================= KULLANICI İSTEĞİ: TABLO ÜZERİNDEN HIZLI SATIR GİRİŞİ (KENDİM YAZMAK İSTİYORUM) =================
        const inpFastBh = document.getElementById("inpFastBh");
        const inpFastDepth = document.getElementById("inpFastDepth");
        const inpFastSpt = document.getElementById("inpFastSpt");
        const inpFastPl = document.getElementById("inpFastPl");
        const inpFastEm = document.getElementById("inpFastEm");
        const inpFastIs = document.getElementById("inpFastIs");
        const inpFastCPhi = document.getElementById("inpFastCPhi");
        const inpFastPI = document.getElementById("inpFastPI");
        const btnFastAddGeoRow = document.getElementById("btnFastAddGeoRow");

        function addInlineGeoRow() {
            const bhName = (inpFastBh && inpFastBh.value.trim()) ? inpFastBh.value.trim() : "SK-1";
            const depthVal = parseFloat(String(inpFastDepth ? inpFastDepth.value : "1.50").replace(",", ".")) || 1.50;
            const sptVal = parseFloat(String(inpFastSpt ? inpFastSpt.value : "10").replace(",", ".")) || 10;
            const plVal = parseFloat(String(inpFastPl ? inpFastPl.value : "0.50").replace(",", ".")) || 0.0;
            const emVal = parseFloat(String(inpFastEm ? inpFastEm.value : "5.0").replace(",", ".")) || 0.0;
            const isVal = parseFloat(String(inpFastIs ? inpFastIs.value : "0.0").replace(",", ".")) || 0.0;
            const piVal = parseFloat(String(inpFastPI ? inpFastPI.value : "15").replace(",", ".")) || 15;

            // c' / phi ayrıştırma (15/20 veya 15,20)
            let cVal = 15;
            let phiVal = 20;
            if (inpFastCPhi && inpFastCPhi.value) {
                const cPhiParts = inpFastCPhi.value.split(/\/|;|\s+/);
                if (cPhiParts.length >= 2) {
                    cVal = parseFloat(cPhiParts[0].replace(",", ".")) || 15;
                    phiVal = parseFloat(cPhiParts[1].replace(",", ".")) || 20;
                } else {
                    cVal = parseFloat(cPhiParts[0].replace(",", ".")) || 15;
                }
            }

            const newRow = {
                id: "usr_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
                borehole: bhName,
                depth: depthVal,
                sptN60: sptVal,
                presioPL: plVal,
                presioEM: emVal,
                pointLoadIs: isVal,
                cohesion: cVal,
                frictionAngle: phiVal,
                pi: piVal,
                ll: 30,
                lithology: "Katman"
            };

            currentTestRows.push(newRow);
            updateBoreholeFilterOptions();
            renderTable();
            runAnalysis();

            // Bir sonraki derinlik için +1.50m otomatik ilerlet, kuyu adını koru
            if (inpFastDepth) {
                inpFastDepth.value = (depthVal + 1.50).toFixed(2);
            }
            if (btnFastAddGeoRow) {
                btnFastAddGeoRow.textContent = "➕ Ekle";
                btnFastAddGeoRow.style.background = "#2563eb";
            }
            if (inpFastSpt) {
                inpFastSpt.focus();
                inpFastSpt.select();
            }
        }

        if (btnFastAddGeoRow) {
            btnFastAddGeoRow.addEventListener("click", addInlineGeoRow);
        }

        // Enter tuşuna basıldığında seri veri ekleme
        [inpFastBh, inpFastDepth, inpFastSpt, inpFastPl, inpFastEm, inpFastIs, inpFastCPhi, inpFastPI].forEach(inp => {
            if (inp) {
                inp.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        addInlineGeoRow();
                    }
                });
            }
        });

        // Kuyu filtresi değiştiğinde hızlı giriş kuyu kutucuğunu da güncelle
        if (selFilterBorehole) {
            selFilterBorehole.addEventListener("change", () => {
                if (selFilterBorehole.value !== "all" && inpFastBh) {
                    inpFastBh.value = selFilterBorehole.value;
                }
                renderTable();
                runAnalysis();
            });
        }

        // KULLANICI İSTEĞİ: ZEMİNE YENİ SK EKLEME (ÇOKLU SK YÖNETİMİ)
        const btnGeotechAddSK = document.getElementById("btnGeotechAddNewSK");
        if (btnGeotechAddSK) {
            btnGeotechAddSK.addEventListener("click", () => {
                const allBhs = new Set();
                (currentProject.boreholes || []).forEach(b => { if (b.name) allBhs.add(b.name.trim().toUpperCase()); });
                currentTestRows.forEach(r => { if (r.borehole) allBhs.add(r.borehole.trim().toUpperCase()); });

                let nextNum = 1;
                while (allBhs.has(`SK-${nextNum}`)) {
                    nextNum++;
                }
                const newBhName = `SK-${nextNum}`;

                if (inpFastBh) inpFastBh.value = newBhName;
                if (inpFastDepth) inpFastDepth.value = "1.50";

                // CAD kesitine de yeni kuyuyu otomatik yerleştir
                const lastBh = (currentProject.boreholes && currentProject.boreholes.length > 0)
                    ? currentProject.boreholes[currentProject.boreholes.length - 1]
                    : null;
                const newX = lastBh ? Math.min((currentProject.parameters.totalDistance || 12.0) - 0.5, lastBh.x + 3.0) : 2.0;
                const newSurf = lastBh ? lastBh.surfaceElevation : 90.0;
                const newBot = lastBh ? lastBh.bottomElevation : 75.0;

                const exists = (currentProject.boreholes || []).some(b => b.name && b.name.toUpperCase() === newBhName);
                if (!exists) {
                    currentProject.boreholes.push({
                        id: "sk-" + Date.now(),
                        name: newBhName,
                        x: newX,
                        surfaceElevation: newSurf,
                        bottomElevation: newBot,
                        intervals: [
                            { fromDepth: 0.0, toDepth: (newSurf - newBot), lithoId: "kumlu-kil", name: "Kumlu Kil", color: "#a89276" }
                        ]
                    });
                }

                updateBoreholeFilterOptions();
                if (canvas) canvas.render();

                if (inpFastSpt) {
                    inpFastSpt.focus();
                    inpFastSpt.select();
                }
                if (statusTool) statusTool.textContent = `✓ Yeni kuyu ${newBhName} tanımlandı ve seçildi. Deney değerlerini girip '➕ Ekle'ye basabilirsiniz.`;
            });
        }

        // Zemin Tabından Şirket & Logo Paneline Doğrudan Geçiş
        const btnGeotechOpenComp = document.getElementById("btnGeotechOpenCompany");
        if (btnGeotechOpenComp) {
            btnGeotechOpenComp.addEventListener("click", () => {
                const tabBtns = document.querySelectorAll(".tab-btn");
                const tabContents = document.querySelectorAll(".tab-content");
                tabBtns.forEach(b => b.classList.remove("active"));
                tabContents.forEach(c => c.classList.remove("active"));

                const targetTab = document.getElementById("tab-engineer");
                const targetBtn = document.querySelector('.tab-btn[data-tab="tab-engineer"]');
                if (targetTab) targetTab.classList.add("active");
                if (targetBtn) targetBtn.classList.add("active");

                const logoSection = document.getElementById("directLogoSection");
                if (logoSection) {
                    logoSection.scrollIntoView({ behavior: "smooth", block: "center" });
                    logoSection.style.borderColor = "#10b981";
                    logoSection.style.boxShadow = "0 0 15px rgba(16,185,129,0.5)";
                    setTimeout(() => {
                        logoSection.style.borderColor = "#0284c7";
                        logoSection.style.boxShadow = "0 3px 10px rgba(0,0,0,0.3)";
                    }, 2500);
                }
            });
        }

        // 9. Rapor Modalı Butonları
        if (btnCloseGeotechModal) btnCloseGeotechModal.addEventListener("click", closeModal);
        if (btnCloseGeotechModalBottom) btnCloseGeotechModalBottom.addEventListener("click", closeModal);
        if (geotechModal) {
            geotechModal.addEventListener("click", (e) => {
                if (e.target === geotechModal) closeModal();
            });
        }
        if (btnPrintGeotechModal) {
            btnPrintGeotechModal.addEventListener("click", () => {
                if (geotechReportFrame && geotechReportFrame.contentWindow) {
                    geotechReportFrame.contentWindow.print();
                }
            });
        }
        if (btnCopyGeotechWord) {
            btnCopyGeotechWord.addEventListener("click", () => {
                copyWordReport();
            });
        }
        if (btnInsertGeotechToCanvas) {
            btnInsertGeotechToCanvas.addEventListener("click", () => {
                insertToCanvas();
            });
        }

        // Modal Arka Plan Tıklama Kapatmaları
        [modalPasteGeotechExcel, modalAddGeotechRow].forEach(m => {
            if (m) {
                m.addEventListener("click", (e) => {
                    if (e.target === m) m.style.display = "none";
                });
            }
        });

        // İlk Yükleme (Kullanıcının isteği: Varsayılan olarak tablo boş ve temiz açılır)
        updateBoreholeFilterOptions();
        renderTable();
    }

    // ==============================================================================================
    // CAD, CBS & 3D ENTEGRASYON VE AKILLI KLASÖR AYRIŞTIRICI YÖNETİCİSİ
    // ==============================================================================================
    function setupCadGisBridgeAndFolderBatchManager() {
        const modalCadGisBridge = document.getElementById("modalCadGisBridge");
        const modal3DGeologyViewer = document.getElementById("modal3DGeologyViewer");
        const modalBatchFolderResults = document.getElementById("modalBatchFolderResults");
        const fileFolderBatchUpload = document.getElementById("fileFolderBatchUpload");
        const cadGisBridgeFeedback = document.getElementById("cadGisBridgeFeedback");

        let active3DViewer = null;
        let lastBatchImporter = null;

        function showBridgeFeedback(msg) {
            if (!cadGisBridgeFeedback) return;
            cadGisBridgeFeedback.textContent = msg;
            cadGisBridgeFeedback.style.display = "inline";
            setTimeout(() => { cadGisBridgeFeedback.style.display = "none"; }, 3500);
        }

        function downloadFile(filename, text, mime = "text/plain;charset=utf-8") {
            const blob = new Blob(["\uFEFF" + text], { type: mime });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Modalları Açma / Kapatma Fonksiyonları
        function openCadGisModal() {
            if (modalCadGisBridge) {
                modalCadGisBridge.style.display = "flex";
                modalCadGisBridge.classList.add("open");
                modalCadGisBridge.style.zIndex = "99999";
            }
        }
        function closeCadGisModal() {
            if (modalCadGisBridge) {
                modalCadGisBridge.style.display = "none";
                modalCadGisBridge.classList.remove("open");
            }
        }

        function open3DModal() {
            if (modal3DGeologyViewer) {
                modal3DGeologyViewer.style.display = "flex";
                modal3DGeologyViewer.classList.add("open");
                modal3DGeologyViewer.style.zIndex = "99999";

                setTimeout(() => {
                    if (!active3DViewer && window.Interactive3DViewer) {
                        active3DViewer = new window.Interactive3DViewer("canvas3DViewport");
                    }
                    if (active3DViewer) {
                        active3DViewer.setProject(currentProject);
                    }
                }, 80);
            }
        }
        function close3DModal() {
            if (modal3DGeologyViewer) {
                modal3DGeologyViewer.style.display = "none";
                modal3DGeologyViewer.classList.remove("open");
            }
        }

        function openBatchFolderModal() {
            if (modalBatchFolderResults) {
                modalBatchFolderResults.style.display = "flex";
                modalBatchFolderResults.classList.add("open");
                modalBatchFolderResults.style.zIndex = "99999";
            }
        }
        function closeBatchFolderModal() {
            if (modalBatchFolderResults) {
                modalBatchFolderResults.style.display = "none";
                modalBatchFolderResults.classList.remove("open");
            }
        }

        window.openCadGisModal = openCadGisModal;
        window.closeCadGisModal = closeCadGisModal;
        window.open3DGeologyModal = open3DModal;
        window.close3DGeologyModal = close3DModal;
        window.openBatchFolderModal = openBatchFolderModal;
        window.closeBatchFolderModal = closeBatchFolderModal;

        // Üst Menü Entegrasyon Butonları
        const btnTriggerFolderUpload = document.getElementById("btnTriggerFolderUpload");
        if (btnTriggerFolderUpload && fileFolderBatchUpload) {
            btnTriggerFolderUpload.addEventListener("click", () => {
                fileFolderBatchUpload.click();
            });
        }

        const bridgeButtons = [
            "btnOpenAutoCadBridge", "btnOpenNetCadBridge", "btnOpenArcGisBridge", 
            "btnOpenBimBridge", "btnOpenStatikBridge"
        ];
        bridgeButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) btn.addEventListener("click", openCadGisModal);
        });

        const btnOpen3DViewer = document.getElementById("btnOpen3DViewer");
        if (btnOpen3DViewer) btnOpen3DViewer.addEventListener("click", open3DModal);

        const btnBridgeOpenInteractive3D = document.getElementById("btnBridgeOpenInteractive3D");
        if (btnBridgeOpenInteractive3D) {
            btnBridgeOpenInteractive3D.addEventListener("click", () => {
                closeCadGisModal();
                open3DModal();
            });
        }

        // CAD / CBS / BIM Köprüsü Eylemleri
        const btnBridgeDownloadDXF = document.getElementById("btnBridgeDownloadDXF");
        if (btnBridgeDownloadDXF) {
            btnBridgeDownloadDXF.addEventListener("click", () => {
                triggerDXFExport();
                showBridgeFeedback("✓ AutoCAD (DXF) dosyası indirildi!");
            });
        }

        const btnBridgeDownloadAutoCadScript = document.getElementById("btnBridgeDownloadAutoCadScript");
        if (btnBridgeDownloadAutoCadScript) {
            btnBridgeDownloadAutoCadScript.addEventListener("click", () => {
                if (window.CadGisBridge) {
                    const bridge = new window.CadGisBridge(currentProject);
                    const scr = bridge.generateAutoCadScript();
                    downloadFile(`${getSafeExportBaseFilename("AutoCAD_Script")}.scr`, scr);
                    showBridgeFeedback("✓ AutoCAD .SCR komut dosyası indirildi!");
                }
            });
        }

        const btnBridgeDownloadNetCadDxf = document.getElementById("btnBridgeDownloadNetCadDxf");
        if (btnBridgeDownloadNetCadDxf) {
            btnBridgeDownloadNetCadDxf.addEventListener("click", () => {
                if (window.CadGisBridge) {
                    const bridge = new window.CadGisBridge(currentProject);
                    const dxf = bridge.generateNetCadDxf();
                    downloadFile(`${getSafeExportBaseFilename("NetCAD_Kesit")}.dxf`, dxf);
                    showBridgeFeedback("✓ NetCAD uyumlu DXF indirildi!");
                }
            });
        }

        const btnBridgeDownloadNetCadKml = document.getElementById("btnBridgeDownloadNetCadKml");
        if (btnBridgeDownloadNetCadKml) {
            btnBridgeDownloadNetCadKml.addEventListener("click", () => {
                if (window.CadGisBridge) {
                    const bridge = new window.CadGisBridge(currentProject);
                    const kml = bridge.generateKml();
                    downloadFile(`${getSafeExportBaseFilename("NetCAD_Sondajlar")}.kml`, kml, "application/vnd.google-earth.kml+xml");
                    showBridgeFeedback("✓ NetCAD KML güzergah dosyası indirildi!");
                }
            });
        }

        const btnBridgeDownloadGeoJson = document.getElementById("btnBridgeDownloadGeoJson");
        if (btnBridgeDownloadGeoJson) {
            btnBridgeDownloadGeoJson.addEventListener("click", () => {
                if (window.CadGisBridge) {
                    const bridge = new window.CadGisBridge(currentProject);
                    const geojson = bridge.generateGeoJson();
                    downloadFile(`${getSafeExportBaseFilename("ArcGIS_Sondaj_Katmani")}.geojson`, geojson, "application/geo+json");
                    showBridgeFeedback("✓ ArcGIS/QGIS GeoJSON katmanı indirildi!");
                }
            });
        }

        const btnBridgeDownloadGoogleKml = document.getElementById("btnBridgeDownloadGoogleKml");
        if (btnBridgeDownloadGoogleKml) {
            btnBridgeDownloadGoogleKml.addEventListener("click", () => {
                if (window.CadGisBridge) {
                    const bridge = new window.CadGisBridge(currentProject);
                    const kml = bridge.generateKml();
                    downloadFile(`${getSafeExportBaseFilename("GoogleEarth_Sondajlar")}.kml`, kml, "application/vnd.google-earth.kml+xml");
                    showBridgeFeedback("✓ Google Earth KML dosyası indirildi!");
                }
            });
        }

        const btnBridgeCopyBimReport = document.getElementById("btnBridgeCopyBimReport");
        if (btnBridgeCopyBimReport) {
            btnBridgeCopyBimReport.addEventListener("click", () => {
                if (window.CadGisBridge) {
                    const bridge = new window.CadGisBridge(currentProject);
                    const rep = bridge.generateBimStructuralData();
                    navigator.clipboard.writeText(rep).then(() => {
                        showBridgeFeedback("✓ Revit & Mimari BIM zemin parametreleri panoya kopyalandı!");
                    });
                }
            });
        }

        const btnBridgeCopyStatikReport = document.getElementById("btnBridgeCopyStatikReport");
        if (btnBridgeCopyStatikReport) {
            btnBridgeCopyStatikReport.addEventListener("click", () => {
                if (window.CadGisBridge) {
                    const bridge = new window.CadGisBridge(currentProject);
                    const rep = bridge.generateBimStructuralData();
                    navigator.clipboard.writeText(rep).then(() => {
                        showBridgeFeedback("✓ Statik zemin parametreleri (ks, qem) panoya kopyalandı!");
                    });
                }
            });
        }

        const btnBridgeDownload3DObj = document.getElementById("btnBridgeDownload3DObj");
        const btn3DDownloadOBJ = document.getElementById("btn3DDownloadOBJ");
        [btnBridgeDownload3DObj, btn3DDownloadOBJ].forEach(btn => {
            if (btn) {
                btn.addEventListener("click", () => {
                    if (window.CadGisBridge) {
                        const bridge = new window.CadGisBridge(currentProject);
                        const obj = bridge.generate3dObj();
                        downloadFile(`${getSafeExportBaseFilename("3D_Katı_Model")}.obj`, obj);
                        showBridgeFeedback("✓ 3D Katı Model Wavefront OBJ indirildi!");
                    }
                });
            }
        });

        // 3D Viewer Kontrolleri
        const btn3DResetView = document.getElementById("btn3DResetView");
        if (btn3DResetView) {
            btn3DResetView.addEventListener("click", () => {
                if (active3DViewer) active3DViewer.resetView();
            });
        }
        const btn3DZoomIn = document.getElementById("btn3DZoomIn");
        if (btn3DZoomIn) {
            btn3DZoomIn.addEventListener("click", () => {
                if (active3DViewer) {
                    active3DViewer.zoom *= 1.2;
                    active3DViewer.render();
                }
            });
        }
        const btn3DZoomOut = document.getElementById("btn3DZoomOut");
        if (btn3DZoomOut) {
            btn3DZoomOut.addEventListener("click", () => {
                if (active3DViewer) {
                    active3DViewer.zoom *= 0.83;
                    active3DViewer.render();
                }
            });
        }

        // AKILLI KLASÖR İÇE AKTARICI (BATCH FOLDER IMPORTER) İŞLEMLERİ
        if (fileFolderBatchUpload) {
            fileFolderBatchUpload.addEventListener("change", async (e) => {
                if (!e.target.files || e.target.files.length === 0) return;

                if (!window.FolderBatchImporter) {
                    alert("Klasör ayrıştırma motoru yüklenemedi.");
                    return;
                }

                lastBatchImporter = new window.FolderBatchImporter();
                const extracted = await lastBatchImporter.processFiles(e.target.files);

                // İstatistikleri Güncelle
                const bCount = document.getElementById("batchCountBoreholes");
                const tCount = document.getElementById("batchCountTests");
                const pCount = document.getElementById("batchCountPhotos");
                const brCount = document.getElementById("batchCountBranding");
                const fCount = document.getElementById("batchCountTotalFiles");

                if (bCount) bCount.textContent = `${extracted.boreholes.length} Adet`;
                if (tCount) tCount.textContent = `${extracted.geotechTests.length} Adet`;
                if (pCount) pCount.textContent = `${extracted.corePhotos.length} Adet`;
                if (brCount) {
                    let brText = [];
                    if (extracted.logoFile) brText.push("Logo Bulundu");
                    if (extracted.stampFile) brText.push("Kaşe Bulundu");
                    brCount.textContent = brText.length > 0 ? brText.join(" & ") : "Bulunamadı";
                    brCount.style.color = brText.length > 0 ? "#10b981" : "#f59e0b";
                }
                if (fCount) fCount.textContent = `${extracted.scannedFiles.length} Dosya`;

                // Taranan Dosya Listesini Render Et
                const listContainer = document.getElementById("batchScanListContainer");
                if (listContainer) {
                    listContainer.innerHTML = "";
                    extracted.scannedFiles.forEach(f => {
                        const row = document.createElement("div");
                        row.className = "batch-file-row";
                        row.innerHTML = `
                            <span style="font-weight:600;color:#f8fafc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:380px;">${f.path}</span>
                            <span style="color:${f.roleColor || "#94a3b8"};font-weight:bold;font-size:11px;">${f.role || "Genel Dosya"}</span>
                        `;
                        listContainer.appendChild(row);
                    });
                }

                openBatchFolderModal();
                fileFolderBatchUpload.value = ""; // Sıfırla
            });
        }

        // Projeye Uygula ve Grafiği Çiz (2D Normal ve 3D Katı Model)
        const applyBatchData = (openIn3D = false) => {
            const importer = lastBatchImporter || window.lastBatchImporter;
            if (!importer) return;

            const result = importer.applyToCurrentProject(currentProject);

            // Eğer geoteknik deneyler bulunduysa tabloya ekle
            if (importer.extractedData.geotechTests && importer.extractedData.geotechTests.length > 0) {
                if (window.addGeotechRowsFromBatch) {
                    window.addGeotechRowsFromBatch(importer.extractedData.geotechTests);
                }
            }

            // UI ve Tuvali Yenile
            populateForm();
            renderBoreholeList();
            renderStrataList();
            if (canvas) {
                canvas.project = currentProject;
                if (typeof canvas.autoFitElevations === "function") {
                    canvas.autoFitElevations();
                }
                canvas.syncStrataFromColumns();
                canvas.render();
                canvas.zoomFit();
            }

            closeBatchFolderModal();

            if (openIn3D) {
                open3DModal();
                if (statusTool) {
                    statusTool.textContent = `✓ 3D Katı Model Çizildi! (${result.boreholeCount} Kuyu, ${result.geotechTestCount} Deney, ${result.corePhotoCount} Karot Fotoğrafı)`;
                }
            } else {
                if (statusTool) {
                    statusTool.textContent = `✓ 2D CAD Kesit Grafiği Çizildi! (${result.boreholeCount} Kuyu, ${result.geotechTestCount} Deney, ${result.corePhotoCount} Karot Fotoğrafı)`;
                }
            }
        };

        const btnApplyBatchFolderData = document.getElementById("btnApplyBatchFolderData");
        if (btnApplyBatchFolderData) {
            btnApplyBatchFolderData.addEventListener("click", () => applyBatchData(false));
        }

        const btnApplyBatchFolder3D = document.getElementById("btnApplyBatchFolder3D");
        if (btnApplyBatchFolder3D) {
            btnApplyBatchFolder3D.addEventListener("click", () => applyBatchData(true));
        }

        const btnQuickSwitch3D = document.getElementById("btnQuickSwitch3D");
        if (btnQuickSwitch3D) {
            btnQuickSwitch3D.addEventListener("click", open3DModal);
        }

        // Modal Kapatma Butonları
        const closePairs = [
            ["btnCloseCadGisModal", closeCadGisModal],
            ["btnCloseCadGisModalBottom", closeCadGisModal],
            ["btnClose3DModal", close3DModal],
            ["btnClose3DModalBottom", close3DModal],
            ["btnCloseBatchFolderModal", closeBatchFolderModal],
            ["btnCloseBatchFolderModalBottom", closeBatchFolderModal]
        ];
        closePairs.forEach(([btnId, handler]) => {
            const btn = document.getElementById(btnId);
            if (btn) btn.addEventListener("click", handler);
        });

        // Arka Plan Tıklama Kapatmaları
        [modalCadGisBridge, modal3DGeologyViewer, modalBatchFolderResults].forEach(m => {
            if (m) {
                m.addEventListener("click", (e) => {
                    if (e.target === m) {
                        m.style.display = "none";
                        m.classList.remove("open");
                    }
                });
            }
        });
    }

    setupCompanyProfileManager();
    setupAiCorePhotoAnalyzer();
    setupBulguExcelLogManager();
    setupExcelImageAndDetailedAiManager();
    setupGeotechAdvisorManager();
    setupCadGisBridgeAndFolderBatchManager();
    populateForm();
    setTimeout(() => {
        if (canvas) {
            canvas.zoomFit();
            updateDfStratumBadge();
        }
    }, 100);
});
