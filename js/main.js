// System and State Management for Alban's CAP Coiffure revision platform

// Chapters of the CAP Coiffure program and their progression value (total 100%)
const chapters = [
    { id: 'bio-ch1', name: 'Biologie Ch.1 : Ostéologie de la Tête', progress: 10 },
    { id: 'bio-ch2', name: 'Biologie Ch.2 : Structure du Cuir Chevelu', progress: 10 },
    { id: 'bio-ch3', name: 'Biologie Ch.3 : Tige Pilaire (Cuticule/Cortex)', progress: 10 },
    { id: 'bio-ch4', name: 'Biologie Ch.4 : Cycle de Vie du Cheveu', progress: 10 },
    { id: 'bio-ch5', name: 'Biologie Ch.5 : Affections & Diagnostics', progress: 15 },
    { id: 'chim-ch1', name: 'Chimie Ch.1 : L\'Eau & Tensioactifs', progress: 15 },
    { id: 'chim-ch2', name: 'Chimie Ch.2 : Échelle de pH', progress: 15 },
    { id: 'chim-ch3', name: 'Chimie Ch.3 : Oxydants & Réducteurs', progress: 15 }
];

// Flashcards default pool
const defaultFlashcards = [
    { id: 'fc-1', term: 'Kératine', def: 'Protéine fibreuse insoluble riche en acides aminés soufrés (cystine), constituant plus de 90 % de la tige pilaire et lui conférant sa solidité.', cat: 'Biologie' },
    { id: 'fc-2', term: 'pH Physiologique', def: 'Potentiel Hydrogène naturel de la peau et du cheveu sain, situé entre 4.5 et 5.5 (acide). Il protège contre la prolifération microbienne.', cat: 'Chimie' },
    { id: 'fc-3', term: 'Eumélanine', def: 'Pigment mélanique de forme granulaire, de couleur brune à noire, qui détermine la hauteur de ton foncée naturelle du cheveu.', cat: 'Biologie' },
    { id: 'fc-4', term: 'Phéomélanine', def: 'Pigment mélanique de forme diffuse, de couleur jaune, orange à rouge, responsable des reflets chauds et des tons clairs du cheveu.', cat: 'Biologie' },
    { id: 'fc-5', term: 'Ponts Disulfures', def: 'Liaisons chimiques covalentes fortes reliant deux atomes de soufre des chaînes de kératine, assurant la cohésion et la forme permanente du cheveu.', cat: 'Chimie' },
    { id: 'fc-6', term: 'Follicule Pileux', def: 'Invagination épidermique s\'enfonçant en biais dans le derme, véritable berceau biologique assurant la naissance et la pousse du cheveu.', cat: 'Biologie' },
    { id: 'fc-7', term: 'Film Hydrolipidique (FHL)', def: 'Émulsion protectrice de sueur (acide) et de sébum (gras) recouvrant la couche cornée, limitant la déshydratation et protégeant des agents pathogènes.', cat: 'Biologie' },
    { id: 'fc-8', term: 'Titre Hydrotimétrique (TH)', def: 'Indicateur de la dureté de l\'eau, représentant sa teneur en ions calcium (Ca²⁺) et magnésium (Mg²⁺). Exprimé en degrés français (°f).', cat: 'Chimie' },
    { id: 'fc-9', term: 'Pityriasis Simplex', def: 'Désordre du cuir chevelu se manifestant par des pellicules sèches, blanches et fines, lié à une desquamation excessive provoquée par la levure Malassezia.', cat: 'Biologie' },
    { id: 'fc-10', term: 'Trichoptilose', def: 'Terme dermatologique officiel désignant le dédoublement de l\'extrémité libre de la tige pilaire (les pointes fourchues).', cat: 'Biologie' },
    { id: 'fc-11', term: 'Tensioactif Amphiphile', def: 'Molécule détergente possédant une tête polaire hydrophile (qui aime l\'eau) et une queue apolaire lipophile (qui se fixe sur le gras/le sébum).', cat: 'Chimie' },
    { id: 'fc-12', term: 'Phase Anagène', def: 'Première phase (croissance active) du cycle pilaire concernant 85 % des cheveux. Dure de 3 à 7 ans chez la femme, caractérisée par une mitose intense.', cat: 'Biologie' },
    { id: 'fc-13', term: 'Phase Catagène', def: 'Deuxième phase (transition / involution) du cycle pilaire d\'environ 2 à 3 semaines, caractérisée par l\'arrêt de la mitose et l\'atrophie du bulbe.', cat: 'Biologie' },
    { id: 'fc-14', term: 'Phase Télogène', def: 'Troisième phase (repos et chute) du cycle pilaire d\'environ 3 mois, où le cheveu mort est expulsé par un nouveau bourgeon anagène sous-jacent.', cat: 'Biologie' },
    { id: 'fc-15', term: 'Teigne', def: 'Infection fongique (champignon dermatophyte) hautement contagieuse du cuir chevelu, provoquant des plaques rondes squameuses où les cheveux cassent à ras.', cat: 'Biologie' }
];

function getFlashcardsPool() {
    let pool = localStorage.getItem('alban_flashcards_pool');
    if (!pool) {
        localStorage.setItem('alban_flashcards_pool', JSON.stringify(defaultFlashcards));
        return defaultFlashcards;
    }
    return JSON.parse(pool);
}


// Initialize application on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateProgressBar();
    initGamification(); // Initialize levels, XP and Streaks
    
    // Page-specific initializations
    if (document.getElementById('chapter-checklist')) {
        initChecklist();
    }
    if (document.getElementById('personal-notes')) {
        initNotes();
    }
    if (document.getElementById('ph-slider')) {
        updatePhSimulator();
    }
    if (document.getElementById('quiz-container')) {
        loadQuiz();
    }
    if (document.getElementById('flashcards-container')) {
        initFlashcards();
    }
    if (document.getElementById('duo-nodes-container')) {
        initDuolingo();
    }
});

// ==========================================
// 1. THEME MANAGEMENT (Support dark mode)
// ==========================================
function initTheme() {
    // In our Tailwind dark UI, we force the dark theme class on the documentElement by default
    // as requested by the user ("charte graphique moderne, sombre, immersive...").
    // We will save and respect this state.
    const currentTheme = localStorage.getItem('alban_theme') || 'dark';
    document.documentElement.className = currentTheme;
    updateThemeToggleIcon(currentTheme);
    
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            let hasDark = document.documentElement.classList.contains('dark');
            let newTheme = hasDark ? 'light' : 'dark';
            document.documentElement.className = newTheme;
            localStorage.setItem('alban_theme', newTheme);
            updateThemeToggleIcon(newTheme);
        });
    }
}

function updateThemeToggleIcon(theme) {
    const iconContainer = document.getElementById('theme-toggle');
    if (!iconContainer) return;
    
    if (theme === 'dark') {
        // Sun icon for dark theme (toggle to light)
        iconContainer.innerHTML = `
            <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
    } else {
        // Moon icon for light theme (toggle to dark)
        iconContainer.innerHTML = `
            <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
    }
}

// ==========================================
// 2. PROGRESS MANAGEMENT (Checklist & Bar)
// ==========================================
function getValidatedChapters() {
    return JSON.parse(localStorage.getItem('alban_validated_chapters')) || ['bio-ch1', 'bio-ch2', 'bio-ch3', 'chim-ch2'];
}

function updateProgressBar() {
    const validated = getValidatedChapters();
    let totalProgress = 0;
    
    chapters.forEach(c => {
        if (validated.includes(c.id)) {
            totalProgress += c.progress;
        }
    });
    
    const percentEl = document.getElementById('global-progress-percent');
    const barEl = document.getElementById('global-progress-bar');
    
    if (percentEl) percentEl.innerText = `${totalProgress}%`;
    if (barEl) barEl.style.width = `${totalProgress}%`;
}

function initChecklist() {
    const checklistContainer = document.getElementById('chapter-checklist');
    if (!checklistContainer) return;
    
    const validated = getValidatedChapters();
    checklistContainer.innerHTML = '';
    
    chapters.forEach(chapter => {
        const isChecked = validated.includes(chapter.id);
        
        const label = document.createElement('label');
        label.className = `flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
            isChecked 
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
            : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
        }`;
        
        label.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" onchange="toggleChapter('${chapter.id}')" ${isChecked ? 'checked' : ''} 
                    class="w-5 h-5 text-emerald-500 border-slate-700 rounded focus:ring-emerald-500 bg-slate-950 accent-emerald-500">
                <span class="text-xs font-semibold sm:text-sm ${isChecked ? 'line-through opacity-70' : ''}">${chapter.name}</span>
            </div>
            <span class="text-xs font-bold px-2 py-0.5 rounded bg-slate-850 text-slate-400 border border-slate-800">+${chapter.progress}%</span>
        `;
        checklistContainer.appendChild(label);
    });
    
    updateProgressBar();
}

function toggleChapter(id) {
    let validated = getValidatedChapters();
    
    if (validated.includes(id)) {
        validated = validated.filter(item => item !== id);
    } else {
        validated.push(id);
    }
    
    localStorage.setItem('alban_validated_chapters', JSON.stringify(validated));
    initChecklist();
    updateProgressBar();
}

// ==========================================
// 3. PERSONAL NOTES SYSTEM
// ==========================================
function initNotes() {
    const textarea = document.getElementById('personal-notes');
    if (!textarea) return;
    textarea.value = localStorage.getItem('alban_notes') || '';
}

function saveNotes() {
    const textarea = document.getElementById('personal-notes');
    const status = document.getElementById('save-status');
    if (!textarea) return;
    
    localStorage.setItem('alban_notes', textarea.value);
    if (status) {
        status.innerHTML = `<span class="text-indigo-400 font-semibold animate-pulse">Sauvegarde en cours...</span>`;
        setTimeout(() => {
            status.innerText = 'Journal sauvegardé dans le navigateur ✓';
        }, 600);
    }
}

function clearNotes() {
    if (confirm("Voulez-vous effacer l'intégralité de vos notes ?")) {
        const textarea = document.getElementById('personal-notes');
        if (textarea) {
            textarea.value = '';
            localStorage.setItem('alban_notes', '');
        }
    }
}

// ==========================================
// 4. OSTEOLOGY INTERACTIVE DIAGRAM
// ==========================================
const osteologyData = {
    frontal: {
        title: "💀 Os Frontal (Front)",
        desc: "L'os qui forme le front et le bord supérieur des orbites. En coupe de cheveux, il détermine la ligne d'implantation antérieure. C'est le point de référence central pour découper et concevoir les franges, les mèches ou les volumes de face."
    },
    parietal: {
        title: "💀 Os Pariétaux (Dessus)",
        desc: "Deux os symétriques formant les parois supérieures et latérales du crâne. C'est le 'plateau supérieur'. En coiffure, c'est la zone où l'on gère la longueur du dessus et le volume vertical global (zone de séparation carrée)."
    },
    temporal: {
        title: "💀 Os Temporaux (Côtés)",
        desc: "Deux os pairs protégeant l'oreille. Ils définissent les lignes de profil. Repères fondamentaux pour ajuster les pattes (pattes droites, fondues, pointues) et raccorder les côtés lors des dégradés homme et coupes courtes."
    },
    occipital: {
        title: "💀 Os Occipital (Nuque)",
        desc: "Os constituant la partie arrière-basse du crâne. La saillie occipitale est le repère par excellence pour structurer la graduation des nuques (mid fade, high fade, low fade) et délimiter les volumes arrières."
    },
    mandibule: {
        title: "💀 Mandibule (Mâchoire)",
        desc: "Os mobile de la face déterminant la mâchoire inférieure. En stylisme-visagisme, sa morphologie (carrée, ovale, fuyante) dicte la longueur idéale de la coupe de profil pour harmoniser le bas du visage."
    },
    maxillaire: {
        title: "💀 Maxillaire (Face)",
        desc: "Os formant la mâchoire supérieure et délimitant le contour des pommettes. Il sert de repère pour équilibrer la symétrie des pattes latérales de coupe et de coiffage."
    }
};

function selectOsteology(boneId, element) {
    // Highlight the selected SVG element
    const svgParts = document.querySelectorAll('#skull-svg .svg-interactive-part');
    svgParts.forEach(p => p.classList.remove('svg-active-part'));
    if (element) {
        element.classList.add('svg-active-part');
    }
    
    // Display description sheet
    const data = osteologyData[boneId];
    const infoBox = document.getElementById('osteology-info-box');
    if (!infoBox || !data) return;
    
    infoBox.classList.add('animate-pulse');
    infoBox.innerHTML = `
        <h4 class="text-base font-extrabold text-indigo-400 flex items-center gap-2 mb-2">
            <span>${data.title}</span>
            <span class="text-xs bg-indigo-950 text-indigo-300 border border-indigo-900/50 px-2 py-0.5 rounded-full">Repère</span>
        </h4>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${data.desc}</p>
    `;
    setTimeout(() => {
        infoBox.classList.remove('animate-pulse');
    }, 300);
}

// ==========================================
// 5. DERMOSCOPE INTERACTIVE DIAGRAM
// ==========================================
const dermoscopeData = {
    epiderme: {
        title: "🛡️ Épiderme",
        desc: "Couche superficielle protectrice de 0,1 mm, non vascularisée. Composée de 5 sous-couches. C'est ici que s'élabore la kératinisation et que les mélanocytes transfèrent la mélanine colorante aux futurs cheveux."
    },
    derme: {
        title: "🩸 Derme",
        desc: "Tissu conjonctif vivant, riche en eau, fibres de collagène (fermeté) et d'élastine. Il contient les vaisseaux sanguins irriguant la racine, le muscle horripilateur, les glandes sudoripares et la glande sébacée."
    },
    hypoderme: {
        title: "💧 Hypoderme",
        desc: "Couche adipeuse la plus profonde de la peau. Constituée de lobules de graisse (adipocytes), elle sert d'amortisseur mécanique, d'isolant thermique pour la boîte crânienne et de réservoir énergétique."
    },
    follicule: {
        title: "🧬 Follicule Pileux",
        desc: "Sac tubulaire incliné dans lequel se loge et se forme le cheveu. Il comprend la gaine épithéliale externe et interne. C'est le tunnel de guidage de la tige pilaire en formation vers l'extérieur."
    },
    glande: {
        title: "🧪 Glande Sébacée",
        desc: "Glande exocrine rattachée au collet du follicule pileux. Elle sécrète le sébum (substance grasse) qui protège la tige capillaire, l'adoucit et se mélange à la sueur pour former le film hydrolipidique (FHL) acide."
    },
    muscle: {
        title: "⚡ Muscle Horripilateur (Érecteur)",
        desc: "Petit muscle lisse reliant le follicule pileux à la couche superficielle du derme. Sous l'effet du froid ou de l'émotion (système nerveux sympathique), il se contracte, redresse le poil et provoque la 'chair de poule'."
    },
    papille: {
        title: "🩸 Papille Dermique & Bulbe",
        desc: "Située à la base extrême de la racine, elle est hautement vascularisée. Elle apporte les nutriments, minéraux et hormones indispensables à la mitose cellulaire de la matrice. Sans elle, le cheveu meurt et tombe."
    }
};

function selectDermoscope(partId, element) {
    // Highlight the selected SVG element
    const svgParts = document.querySelectorAll('#dermoscope-svg .svg-interactive-part');
    svgParts.forEach(p => p.classList.remove('svg-active-part'));
    if (element) {
        element.classList.add('svg-active-part');
    }
    
    // Display description sheet
    const data = dermoscopeData[partId];
    const infoBox = document.getElementById('skin-info-box');
    if (!infoBox || !data) return;
    
    infoBox.classList.add('animate-pulse');
    infoBox.innerHTML = `
        <h4 class="text-base font-extrabold text-emerald-400 flex items-center gap-2 mb-2">
            <span>${data.title}</span>
            <span class="text-xs bg-emerald-950 text-emerald-300 border border-emerald-900/50 px-2 py-0.5 rounded-full">Anatomie</span>
        </h4>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${data.desc}</p>
    `;
    setTimeout(() => {
        infoBox.classList.remove('animate-pulse');
    }, 300);
}

// ==========================================
// 6. PH AND CUTICLE SIMULATOR
// ==========================================
const phDescriptions = {
    2: { 
        title: "Acide Extrême (pH 2.0 - 3.0)",
        color: "text-rose-400", 
        desc: "Écailles de la cuticule refermées de façon ultra-hermétique. Le cheveu acquiert une brillance maximale car sa surface est lisse et réfléchit la lumière. Utilisé pour fixer la couleur, mais rend la fibre rigide." 
    },
    5: { 
        title: "pH Isoélectrique (pH 4.5 - 5.5)",
        color: "text-emerald-400", 
        desc: "pH d'équilibre naturel de la kératine. Les écailles sont alignées et resserrées de manière physiologique. Le cheveu conserve sa souplesse, son élasticité et sa solidité naturelle." 
    },
    7: { 
        title: "pH Neutre (pH 7.0)",
        color: "text-amber-400", 
        desc: "pH de l'eau pure. Les liaisons hydrogène de la kératine commencent à s'assouplir légèrement. Les écailles s'entrouvrent très faiblement, permettant une hydratation superficielle." 
    },
    9: { 
        title: "Milieu Alcalin / Basique (pH 8.5 - 10.0)",
        color: "text-indigo-400", 
        desc: "Écailles écartées et soulevées. La tige pilaire gonfle par absorption d'eau et de produit alcalin (coloration d'oxydation, décoloration). Permet aux produits techniques de pénétrer le cortex." 
    },
    12: { 
        title: "Alcalin Extrême (pH 11.0 - 12.0)",
        color: "text-red-400", 
        desc: "Seuil critique d'endommagement de la kératine. Les écailles sont ouvertes à l'extrême et menacent de se dissoudre ou de s'arracher. Nécessite des soins acides neutralisants immédiatement." 
    }
};

function updatePhSimulator() {
    const slider = document.getElementById('ph-slider');
    const display = document.getElementById('ph-display-val');
    const panel = document.getElementById('ph-info-panel');
    
    if (!slider || !display || !panel) return;
    
    const val = parseFloat(slider.value);
    display.innerText = `pH ${val.toFixed(1)}`;
    
    let activePh = 5;
    if (val <= 3.5) activePh = 2;
    else if (val > 3.5 && val <= 6.2) activePh = 5;
    else if (val > 6.2 && val <= 7.8) activePh = 7;
    else if (val > 7.8 && val <= 10.5) activePh = 9;
    else activePh = 12;
    
    const data = phDescriptions[activePh];
    
    // Style description panel dynamically matching pH range
    panel.className = `p-4 rounded-2xl border transition-all duration-300 ${
        val > 7 
        ? 'bg-rose-950/20 border-rose-900/30 text-rose-300' 
        : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300'
    }`;
    panel.innerHTML = `
        <p class="text-xs font-bold uppercase tracking-wider ${data.color}" style="margin-bottom:0.25rem;">${data.title}</p>
        <p class="text-xs text-slate-300 mt-1 leading-relaxed">${data.desc}</p>
    `;
    
    // Scale visualizer rotation (cuticle scales opening)
    const maxRotation = (val - 5) * 5.5; 
    const rotation = Math.max(0, maxRotation); // Only rotate outwards (alkaline)
    
    document.querySelectorAll('.scale-cuticle-layer').forEach(el => {
        el.style.transform = `rotate(${rotation}deg)`;
    });
}

// ==========================================
// 7. HAIR CYCLE INTERACTIVE SELECTOR
// ==========================================
function switchCycleTab(phase, element) {
    // Deactivate all tabs
    document.querySelectorAll('.cycle-tab-btn').forEach(btn => {
        btn.classList.remove('text-indigo-400', 'border-indigo-500', 'bg-indigo-950/30');
        btn.classList.add('text-slate-400', 'border-transparent');
    });
    document.querySelectorAll('.cycle-details').forEach(detail => detail.classList.add('hidden'));
    
    // Activate clicked tab
    element.classList.add('text-indigo-400', 'border-indigo-500', 'bg-indigo-950/30');
    const targetDetails = document.getElementById(`cycle-${phase}`);
    if (targetDetails) {
        targetDetails.classList.remove('hidden');
    }
    
    // Update SVG bulbs visual state
    const bulbAnagene = document.getElementById('svg-bulb-anagene');
    const bulbCatagene = document.getElementById('svg-bulb-catagene');
    const bulbTelogene = document.getElementById('svg-bulb-telogene');
    
    if (bulbAnagene && bulbCatagene && bulbTelogene) {
        bulbAnagene.setAttribute('opacity', '0.15');
        bulbCatagene.setAttribute('opacity', '0.15');
        bulbTelogene.setAttribute('opacity', '0.15');
        
        if (phase === 'anagene') bulbAnagene.setAttribute('opacity', '1');
        if (phase === 'catagene') bulbCatagene.setAttribute('opacity', '1');
        if (phase === 'telogene') bulbTelogene.setAttribute('opacity', '1');
    }
}

// ==========================================
// 8. DYNAMIC RANDOM QUIZ ENGINE
// ==========================================
const quizQuestionsPool = [
    {
        q: "Quel est le pH naturel d'un cuir chevelu en pleine santé ?",
        opts: ["A) Entre 7.5 et 8.5 (Basique / Alcalin)", "B) Entre 4.5 et 5.5 (Acide)", "C) Pile 7.0 (Neutre)"],
        correct: "B",
        explain: "Le cuir chevelu et le cheveu sont acides par nature (pH ~4.5 à 5.5). Cette acidité est maintenue par le film hydrolipidique protecteur qui combat la prolifération bactérienne."
    },
    {
        q: "Quelle phase correspond à la croissance active du cheveu ?",
        opts: ["A) Phase Anagène", "B) Phase Catagène", "C) Phase Télogène"],
        correct: "A",
        explain: "La phase anagène est la phase de pousse active qui concerne environ 85% de la chevelure. La mitose y est permanente dans la matrice. Elle dure de 3 à 7 ans."
    },
    {
        q: "Quel outil de coupe élimine entre 15% et 30% d'une mèche ?",
        opts: ["A) Les ciseaux droits", "B) Le rasoir de rasage", "C) Les ciseaux sculpteurs"],
        correct: "C",
        explain: "Les ciseaux sculpteurs possèdent une lame lisse et une lame dentelée (crantée), permettant d'effiler de manière ciblée en ne coupant qu'un pourcentage des cheveux."
    },
    {
        q: "Si un client présente des plaques chauves circulaires recouvertes de squames sèches et grises, quelle est la conduite à tenir ?",
        opts: ["A) Faire une coloration d'oxydation ton sur ton", "B) Refuser poliment la prestation pour risque d'affection contagieuse (teigne)", "C) Réaliser un shampooing exfoliant intense"],
        correct: "B",
        explain: "Ces plaques indiquent les symptômes d'une teigne tondante (infection fongique contagieuse). Le coiffeur a l'obligation de refuser le service et d'orienter vers un dermatologue."
    },
    {
        q: "Quelle molécule chimique brise les pigments mélaniques du cortex de la tige pilaire ?",
        opts: ["A) Le soufre", "B) L'eau oxygénée (H2O2) en milieu alcalin", "C) Les agents de surface (tensioactifs)"],
        correct: "B",
        explain: "L'eau oxygénée (oxydant), activée dans un milieu basique (ammoniaque), libère de l'oxygène gazeux qui dissout et oxyde les pigments mélaniques logés dans le cortex."
    },
    {
        q: "Quelle couche de la peau produit le sébum ?",
        opts: ["A) L'épiderme", "B) Le derme (via la glande sébacée)", "C) L'hypoderme"],
        correct: "B",
        explain: "La glande sébacée est une glande exocrine logée dans le derme et rattachée au follicule pileux, sécrétant le sébum gras pour lubrifier la tige pilaire."
    },
    {
        q: "Quel produit utilise-t-on juste après une décoloration pour stabiliser la kératine ?",
        opts: ["A) Un après-shampooing alcalin", "B) Un shampooing technique acide ou neutralisant", "C) De l'eau calcaire chaude"],
        correct: "B",
        explain: "Le shampooing technique au pH acide referme instantanément les écailles de la cuticule soulevées par le processus alcalin de décoloration, en ramenant le cheveu à son pH isoélectrique."
    },
    {
        q: "Quelle liaison forte est modifiée lors d'un protocole de permanente (mise en plis permanente) ?",
        opts: ["A) Les liaisons hydrogène", "B) Les ponts disulfures", "C) Les liaisons salines / ioniques"],
        correct: "B",
        explain: "Les ponts disulfures (liaisons covalentes de soufre) assurent la rigidité de la kératine. Le réducteur les coupe pour permettre l'enroulage, puis le fixateur les ressoude dans la nouvelle forme."
    },
    {
        q: "Comment s'appelle l'anomalie correspondant à des pointes fourchues ?",
        opts: ["A) La trichoptilose", "B) Le pityriasis", "C) L'effluvium"],
        correct: "A",
        explain: "La trichoptilose est le terme dermatologique exact qui désigne le dédoublement de l'extrémité de la tige pilaire (les pointes fourchues) suite à une usure mécanique ou chimique."
    },
    {
        q: "Quel effet a un produit acide sur la cuticule du cheveu ?",
        opts: ["A) Il gonfle le cheveu et ouvre les écailles", "B) Il lisse et resserre les écailles", "C) Il dissout complètement la kératine"],
        correct: "B",
        explain: "L'acidité resserre et lisse les écailles de kératine qui se chevauchent. Cela renforce la brillance (la lumière se réfléchit mieux) et retient l'hydratation au cœur du cortex."
    },
    {
        q: "Quelle partie de l'os de la tête constitue le repère arrière-bas majeur pour les fondus de nuque ?",
        opts: ["A) L'os frontal", "B) L'os occipital", "C) L'os temporal"],
        correct: "B",
        explain: "L'os occipital forme l'arrière-bas du crâne. Sa protubérance externe est le repère d'appui clé pour définir la graduation et le fondu d'une nuque."
    },
    {
        q: "Quelle est la partie d'une molécule tensioactive qui s'attache à la graisse et au sébum ?",
        opts: ["A) La tête hydrophile", "B) La queue lipophile (apolaire)", "C) Les charges ioniques"],
        correct: "B",
        explain: "La queue lipophile (ou hydrophobe) est constituée d'une chaîne carbonée qui possède une affinité naturelle pour les corps gras, capturant le sébum lors du shampooing."
    },
    {
        q: "Quelle est la durée moyenne de la phase Catagène (transition) dans le cycle de vie du cheveu ?",
        opts: ["A) 3 à 7 ans", "B) 3 mois environ", "C) 2 à 3 semaines"],
        correct: "C",
        explain: "La phase catagène est une phase transitoire très courte (2 à 3 semaines) qui marque l'arrêt de la mitose et l'atrophie du bulbe qui se détache de la papille."
    },
    {
        q: "Quelle couche de l'épiderme produit continuellement de nouveaux kératinocytes ?",
        opts: ["A) La couche basale (germinative)", "B) La couche cornée supérieure", "C) La couche granuleuse"],
        correct: "A",
        explain: "La couche basale (ou germinative) est la couche la plus profonde de l'épiderme. C'est le lieu de la mitose (division cellulaire) qui renouvelle l'épiderme."
    },
    {
        q: "Qu'indique précisément le Titre Hydrotimétrique (TH) de l'eau utilisée en salon ?",
        opts: ["A) Le taux d'acidité de l'eau", "B) La dureté (concentration en sels de calcium et de magnésium)", "C) La quantité de chlore actif"],
        correct: "B",
        explain: "Le TH exprime la dureté de l'eau en degrés français (°f). Une eau à TH élevé est calcaire, ternissant la cuticule et réduisant le pouvoir moussant des shampooings."
    },
    {
        q: "Quelle affection parasitaire du cuir chevelu se manifeste par des œufs blanchâtres collés près de la racine ?",
        opts: ["A) La teigne favique", "B) La pédiculose (poux)", "C) Le pityriasis simplex"],
        correct: "B",
        explain: "La pédiculose est l'infestation de poux de tête. Les lentes (œufs) sont solidement cimentées à la tige pilaire et ne s'envolent pas au souffle, contrairement aux pellicules."
    },
    {
        q: "Quel volume d'oxydant est le maximum autorisé en contact direct avec la peau lors d'un éclaircissement ?",
        opts: ["A) 10 Volumes (3% H2O2)", "B) 20 Volumes (6% H2O2)", "C) 30 Volumes (9% H2O2)"],
        correct: "B",
        explain: "L'oxydant à 20 volumes est le seuil de tolérance cutanée maximal pour éviter les brûlures chimiques et irritations du cuir chevelu."
    },
    {
        q: "Lors d'une permanente, quel produit chimique est appliqué à l'étape 1 pour rompre les ponts disulfures ?",
        opts: ["A) Le fixateur d'eau oxygénée", "B) L'acide thioglycolique (réducteur alcalin)", "C) Le persulfate de sodium"],
        correct: "B",
        explain: "L'acide thioglycolique agit comme réducteur en apportant de l'hydrogène pour casser les liaisons covalentes de soufre de la kératine."
    },
    {
        q: "Quel revêtement de plaques de fer à lisser émet des ions négatifs pour lutter contre l'électricité statique ?",
        opts: ["A) La tourmaline", "B) L'aluminium anodisé", "C) Le cuivre nu"],
        correct: "A",
        explain: "La tourmaline est une pierre semi-précieuse broyée sur les plaques, qui libère naturellement des ions négatifs sous l'action de la chaleur pour lisser la fibre."
    },
    {
        q: "Quelle anomalie de la tige pilaire forme de petits nœuds blanchâtres fragiles provoquant des cassures nettes ?",
        opts: ["A) La trichoptilose", "B) La trichorrhexie noueuse", "C) Le moniléthrix"],
        correct: "B",
        explain: "La trichorrhexie noueuse est une anomalie mécanique ou chimique formant des nodosités microscopiques où les fibres s'écartent comme un balai avant de casser."
    },
    {
        q: "Pour éviter les troubles musculosquelettiques (TMS), quelle consigne de hauteur de travail doit-on respecter ?",
        opts: ["A) Travailler bras tendus au-dessus des yeux", "B) Ajuster la pompe hydraulique du fauteuil pour garder les coudes près du corps", "C) Se courber vers l'avant au niveau de la taille"],
        correct: "B",
        explain: "Garder les coudes près du corps et le dos droit grâce à l'ajustement du fauteuil client permet de limiter les sollicitations des épaules et de la région lombaire."
    },
    {
        q: "Quel tensioactif s'ancre sur les zones abîmées (négatives) du cheveu pour gainer la fibre sans laver ?",
        opts: ["A) Tensioactif anionique (-)", "B) Tensioactif cationique (+)", "C) Tensioactif non-ionique"],
        correct: "B",
        explain: "Les tensioactifs cationiques portent une charge positive qui est attirée par les zones lésées chargées négativement du cheveu, apportant douceur et démêlage."
    },
    {
        q: "Quelle norme européenne certifie l'action fongicide/levuricide d'un produit désinfectant au salon ?",
        opts: ["A) EN 1040", "B) EN 1275", "C) EN 1500"],
        correct: "B",
        explain: "La norme EN 1275 certifie l'activité antifongique. La norme EN 1040 concerne quant à elle l'efficacité bactéricide."
    },
    {
        q: "La phase aqueuse du film hydrolipidique (FHL) de la peau provient principalement de :",
        opts: ["A) La sécrétion des glandes sébacées", "B) La sueur (sécrétion des glandes sudoripares)", "C) La condensation de l'air ambiant"],
        correct: "B",
        explain: "La sueur (contenant eau, sels minéraux, urée et acide lactique) se mélange au sébum gras pour former le FHL et maintenir son acidité de protection."
    },
    {
        q: "Quel est le rôle du fixateur (oxydant acide) à l'étape 2 d'une permanente ?",
        opts: ["A) Évaporer le produit réducteur restant", "B) Capter l'hydrogène pour ressouder les ponts disulfures dans leur nouvelle forme", "C) Gonfler le cheveu pour faire briller les écailles"],
        correct: "B",
        explain: "Le fixateur apporte de l'oxygène qui capte l'hydrogène inséré à la réduction, permettant de reconstruire les ponts disulfures pour figer la nouvelle forme frisée."
    }
];

let quizUserAnswers = {};
let currentQuizQuestions = [];

function loadQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    
    container.innerHTML = '';
    quizUserAnswers = {};
    
    const scoreDisplay = document.getElementById('quiz-score-display');
    if (scoreDisplay) {
        scoreDisplay.innerText = '0/10';
    }
    
    // Select 10 random questions from the pool
    const shuffledPool = [...quizQuestionsPool].sort(() => 0.5 - Math.random());
    currentQuizQuestions = shuffledPool.slice(0, 10);
    
    currentQuizQuestions.forEach((item, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 mb-5 glow-card transition-all duration-300 animate-fade-in-up';
        questionCard.id = `quiz-q${index}`;
        questionCard.style.animationDelay = `${index * 0.05}s`;
        
        let optionsHtml = item.opts.map((opt) => {
            const optLetter = opt.charAt(0);
            return `
                <button onclick="submitQuizAnswer(${index}, '${optLetter}', this)" 
                    class="quiz-option-btn text-left p-3.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-950 border border-slate-850 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-200 text-slate-300">
                    ${opt}
                </button>
            `;
        }).join('');
        
        questionCard.innerHTML = `
            <p class="font-extrabold text-sm sm:text-base text-slate-100 mb-4">${index + 1}. ${item.q}</p>
            <div class="grid grid-cols-1 gap-3">
                ${optionsHtml}
            </div>
            <div class="mt-4 p-4 rounded-xl text-xs sm:text-sm font-semibold hidden animate-fade-in-up" id="feedback-q${index}"></div>
        `;
        container.appendChild(questionCard);
    });
}

function submitQuizAnswer(qIndex, letter, element) {
    if (quizUserAnswers[qIndex] !== undefined) return; // Already answered
    
    const question = currentQuizQuestions[qIndex];
    quizUserAnswers[qIndex] = letter;
    
    const questionBox = document.getElementById(`quiz-q${qIndex}`);
    const feedbackBox = document.getElementById(`feedback-q${qIndex}`);
    const buttons = questionBox.querySelectorAll('.quiz-option-btn');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn !== element) {
            btn.style.opacity = '0.3';
        }
    });
    
    const isCorrect = (letter === question.correct);
    
    feedbackBox.classList.remove('hidden');
    
    if (isCorrect) {
        element.classList.add('border-emerald-500', 'bg-emerald-950/20', 'text-emerald-300');
        feedbackBox.className = 'mt-4 p-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 animate-fade-in-up';
        feedbackBox.innerHTML = `✓ Correct ! ${question.explain}`;
    } else {
        element.classList.add('border-rose-500', 'bg-rose-950/20', 'text-rose-300');
        feedbackBox.className = 'mt-4 p-4 rounded-xl text-xs sm:text-sm font-bold bg-rose-950/30 border border-rose-500/20 text-rose-400 animate-fade-in-up';
        feedbackBox.innerHTML = `✗ Incorrect. La bonne réponse était la <strong>${question.correct}</strong>.<br>${question.explain}`;
        
        // Highlight correct button
        buttons.forEach(btn => {
            if (btn.innerText.trim().startsWith(question.correct)) {
                btn.classList.add('border-emerald-500', 'bg-emerald-950/10', 'text-emerald-400');
                btn.style.opacity = '1';
            }
        });
    }
    
    // Update score display
    let score = 0;
    currentQuizQuestions.forEach((q, idx) => {
        if (quizUserAnswers[idx] === q.correct) score++;
    });
    
    const scoreDisplay = document.getElementById('quiz-score-display');
    if (scoreDisplay) {
        scoreDisplay.innerText = `${score}/10`;
    }
    
    // Gamification Hook for Quiz completion
    let answeredCount = Object.keys(quizUserAnswers).length;
    if (answeredCount === 10) {
        if (score >= 7) {
            setTimeout(() => {
                playVictorySound();
                startConfetti();
                addXP(score * 10); // Gain score * 10 XP
                if (scoreDisplay) {
                    scoreDisplay.innerHTML = `${score}/10 <span class="text-emerald-400 block text-xs mt-1 font-semibold animate-pulse">Succès ! +${score * 10} XP 🏆</span>`;
                }
            }, 600);
        } else {
            if (scoreDisplay) {
                scoreDisplay.innerHTML = `${score}/10 <span class="text-amber-500 block text-xs mt-1 font-semibold">Essayez d'avoir ≥ 7/10 pour l'XP !</span>`;
            }
        }
        updateStreak();
    }
}

// ==========================================
// 9. FLASHCARDS SYSTEM
// ==========================================
let activeFlashcardsFilter = 'all';

function getFlashcardsState() {
    return JSON.parse(localStorage.getItem('alban_flashcards_state')) || {};
}

function saveFlashcardsState(state) {
    localStorage.setItem('alban_flashcards_state', JSON.stringify(state));
}

function initFlashcards() {
    renderFlashcards();
    updateFlashcardCounters();
}

function filterFlashcards(filter, element) {
    activeFlashcardsFilter = filter;
    
    // Style filters
    document.querySelectorAll('.fc-filter-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
    });
    element.classList.remove('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
    element.classList.add('bg-indigo-600', 'text-white');
    
    renderFlashcards();
}

function updateFlashcardCounters() {
    const state = getFlashcardsState();
    const pool = getFlashcardsPool();
    let learnedCount = 0;
    
    pool.forEach(fc => {
        if (state[fc.id] === 'learned') learnedCount++;
    });
    
    const learnedEl = document.getElementById('fc-count-learned');
    const reviewEl = document.getElementById('fc-count-review');
    const totalEl = document.getElementById('fc-count-total');
    
    if (learnedEl) learnedEl.innerText = learnedCount;
    if (reviewEl) reviewEl.innerText = pool.length - learnedCount;
    if (totalEl) totalEl.innerText = pool.length;
}

function renderFlashcards() {
    const container = document.getElementById('flashcards-container');
    if (!container) return;
    
    const state = getFlashcardsState();
    const pool = getFlashcardsPool();
    container.innerHTML = '';
    
    let filteredList = pool.filter(fc => {
        const status = state[fc.id] || 'review';
        if (activeFlashcardsFilter === 'learned') return status === 'learned';
        if (activeFlashcardsFilter === 'review') return status === 'review';
        return true;
    });
    
    if (filteredList.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-12 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
                <p class="text-slate-500 font-semibold">Aucune carte de révision dans cette catégorie.</p>
            </div>
        `;
        return;
    }
    
    filteredList.forEach((fc, index) => {
        const isLearned = (state[fc.id] === 'learned');
        
        const cardDiv = document.createElement('div');
        cardDiv.className = 'h-64 perspective-1000 group cursor-pointer animate-fade-in-up';
        cardDiv.style.animationDelay = `${index * 0.05}s`;
        
        cardDiv.innerHTML = `
            <div class="relative w-full h-full duration-500 transform-style-3d transition-transform card-flipper" onclick="toggleCardFlip(this)">
                
                <!-- Front Side -->
                <div class="absolute w-full h-full backface-hidden bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-lg hover:border-indigo-500/40 transition-colors">
                    <div class="w-full flex justify-between items-center">
                        <span class="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
                            fc.cat === 'Biologie' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' 
                            : 'bg-indigo-950 text-indigo-400 border border-indigo-900/30'
                        }">${fc.cat}</span>
                        
                        <!-- Delete Button -->
                        <button onclick="event.stopPropagation(); deleteFlashcard('${fc.id}')" 
                            class="p-1 rounded bg-slate-950 border border-slate-850 hover:border-rose-500/50 hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 transition-all cursor-pointer" title="Supprimer la carte">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                    <h3 class="text-lg sm:text-xl font-extrabold text-slate-100 px-2">${fc.term}</h3>
                    <p class="text-xs text-slate-500 flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 1 1 21.306 7M7 9h8V1M17 17v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H9v8"></path></svg>
                        Cliquez pour retourner
                    </p>
                </div>
                
                <!-- Back Side -->
                <div class="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                    <div class="w-full flex justify-between items-center">
                        <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Réponse</span>
                        <button onclick="event.stopPropagation(); deleteFlashcard('${fc.id}')" 
                            class="p-1 rounded bg-slate-950 border border-slate-850 hover:border-rose-500/50 hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 transition-all cursor-pointer" title="Supprimer la carte">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="flex-grow flex items-center justify-center text-center px-2">
                        <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">${fc.def}</p>
                    </div>
                    
                    <!-- Action Buttons on Back -->
                    <div class="flex gap-2 mt-4" onclick="event.stopPropagation()">
                        <button onclick="markCardState('${fc.id}', 'review')" 
                            class="flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                                !isLearned 
                                ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-400' 
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }">
                            À réviser
                        </button>
                        <button onclick="markCardState('${fc.id}', 'learned')" 
                            class="flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                                isLearned 
                                ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' 
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }">
                            Appris ✓
                        </button>
                    </div>
                </div>
                
            </div>
        `;
        container.appendChild(cardDiv);
    });
}

function toggleCardFlip(element) {
    element.classList.toggle('[transform:rotateY(180deg)]');
}

function markCardState(cardId, status) {
    const state = getFlashcardsState();
    state[cardId] = status;
    saveFlashcardsState(state);
    
    updateFlashcardCounters();
    renderFlashcards();
}

// User-created Flashcards Helpers
function toggleCardForm() {
    const form = document.getElementById('create-card-form');
    if (form) {
        form.classList.toggle('hidden');
    }
}

function submitNewCard(event) {
    event.preventDefault();
    const term = document.getElementById('fc-input-term').value.trim();
    const def = document.getElementById('fc-input-def').value.trim();
    const cat = document.getElementById('fc-input-cat').value;
    
    if (!term || !def) return;
    
    addNewFlashcard(term, def, cat);
    
    event.target.reset();
    toggleCardForm();
}

function addNewFlashcard(term, def, cat) {
    const pool = getFlashcardsPool();
    const newCard = {
        id: `fc-custom-${Date.now()}`,
        term: term,
        def: def,
        cat: cat
    };
    pool.push(newCard);
    localStorage.setItem('alban_flashcards_pool', JSON.stringify(pool));
    
    initFlashcards();
}

function deleteFlashcard(cardId) {
    if (confirm("Voulez-vous vraiment supprimer cette carte de révision ?")) {
        let pool = getFlashcardsPool();
        pool = pool.filter(fc => fc.id !== cardId);
        localStorage.setItem('alban_flashcards_pool', JSON.stringify(pool));
        
        const state = getFlashcardsState();
        delete state[cardId];
        saveFlashcardsState(state);
        
        initFlashcards();
    }
}

// ==========================================
// 10. GAMIFICATION & DUOLINGO PATH SYSTEM
// ==========================================

// Global state for gamification
let gamificationState = {
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    completedLessons: []
};

// Lessons database
const duolingoLessons = [
    {
        id: 'duo-1',
        title: 'Ostéologie Crânienne',
        cat: 'Biologie',
        emoji: '🧬',
        desc: 'Identifiez les os du crâne servant de repères géométriques pour vos coupes.',
        questions: [
            { q: 'Quel os forme le front ?', a: ['Os Frontal', 'Os Occipital', 'Os Pariétal'], c: 0, explain: 'L\'os frontal est situé à l\'avant du crâne.' },
            { q: 'Où se situe l\'os occipital ?', a: ['Au sommet', 'À l\'arrière de la tête', 'Sur les côtés'], c: 1, explain: 'L\'os occipital est situé à la base arrière du crâne.' },
            { q: 'Combien d\'os pariétaux possède-t-on ?', a: ['Un seul', 'Deux', 'Aucun'], c: 1, explain: 'Il y a deux os pariétaux, un de chaque côté de la voûte crânienne.' }
        ]
    },
    {
        id: 'duo-2',
        title: 'pH Cutané & Écailles',
        cat: 'Chimie',
        emoji: '🧪',
        desc: 'Maîtrisez l\'action chimique du pH acide ou alcalin sur la cuticule.',
        questions: [
            { q: 'Quel type de pH referme les écailles du cheveu ?', a: ['pH Acide', 'pH Neutre', 'pH Alcalin'], c: 0, explain: 'L\'acidité resserre les écailles de la cuticule.' },
            { q: 'Quel est le pH physiologique de la peau et des cheveux sains ?', a: ['De 1.0 à 2.0', 'De 4.5 à 5.5', 'De 7.0 à 8.0'], c: 1, explain: 'Le pH physiologique est acide, situé entre 4.5 et 5.5.' },
            { q: 'Quel est l\'effet d\'un pH alcalin supérieur à 7 ?', a: ['Il lisse le cheveu', 'Il écarte les écailles de la cuticule', 'Il neutralise les pigments'], c: 1, explain: 'L\'alcalinité ouvre les écailles, ce qui permet de faire pénétrer les colorations/décolorations.' }
        ]
    },
    {
        id: 'duo-3',
        title: 'Le Matériel de Coupe',
        cat: 'Technologie',
        emoji: '✂️',
        desc: 'Identifiez vos outils de coupe et leur position ergonomique.',
        questions: [
            { q: 'Quels ciseaux possèdent une lame pleine et une lame dentelée ?', a: ['Ciseaux droits', 'Ciseaux sculpteurs', 'Ciseaux effileurs'], c: 1, explain: 'Les ciseaux sculpteurs ont une seule lame dentelée pour désépaissir.' },
            { q: 'Dans quel anneau insère-t-on l\'annulaire lors de la tenue des ciseaux ?', a: ['L\'anneau fixe', 'L\'anneau mobile', 'Le repose-doigt'], c: 0, explain: 'L\'annulaire se glisse dans l\'anneau fixe (portant le repose-doigt).' },
            { q: 'Quel outil est utilisé pour raser la nuque à ras en fin de coupe ?', a: ['Le rasoir shavette', 'Les ciseaux droits', 'Le peigne ciseaux'], c: 0, explain: 'Le rasoir shavette permet un rasage parfait et hygiénique de la nuque.' }
        ]
    },
    {
        id: 'duo-4',
        title: 'Structure du Cheveu',
        cat: 'Biologie',
        emoji: '🧬',
        desc: 'Distinguez les trois couches concentriques de la tige pilaire.',
        questions: [
            { q: 'Quelle couche contient les pigments mélaniques ?', a: ['Le cortex', 'La cuticule', 'La moelle'], c: 0, explain: 'Le cortex (la couche intermédiaire) contient la mélanine.' },
            { q: 'De quoi est formée la cuticule protectrice ?', a: ['De ponts disulfures', 'D\'écailles imbriquées', 'De sébum pur'], c: 1, explain: 'La cuticule est constituée d\'écailles de kératine empilées.' },
            { q: 'Quelle protéine compose 90% de la structure du cheveu ?', a: ['Le sébum', 'La kératine', 'Le collagène'], c: 1, explain: 'La kératine est la protéine fibreuse insoluble constituant du cheveu.' }
        ]
    },
    {
        id: 'duo-5',
        title: 'Molécules Tensioactives',
        cat: 'Chimie',
        emoji: '🧪',
        desc: 'Comprenez comment agissent les micelles des shampooings.',
        questions: [
            { q: 'Quelle partie du tensioactif s\'accroche au gras (sébum) ?', a: ['La tête hydrophile', 'La queue lipophile', 'La charge électrique'], c: 1, explain: 'La queue apolaire lipophile aime et capture les corps gras.' },
            { q: 'Que forment les tensioactifs pour emprisonner le gras dans l\'eau ?', a: ['Des micelles', 'Des ponts disulfures', 'Des acides aminés'], c: 0, explain: 'Ils forment des micelles sphériques emprisonnant les salissures au centre.' },
            { q: 'Quels tensioactifs sont connus pour gainer le cheveu abîmé ?', a: ['Anioniques (-)', 'Cationiques (+)', 'Non-ioniques'], c: 1, explain: 'Les tensioactifs cationiques (+) se fixent par attraction sur la kératine endommagée (-).' }
        ]
    },
    {
        id: 'duo-6',
        title: 'Diagnostic des Affections',
        cat: 'Biologie',
        emoji: '🧬',
        desc: 'Identifiez les anomalies pour adapter votre protocole de soin.',
        questions: [
            { q: 'Qu\'est-ce que le pityriasis simplex ?', a: ['Des pellicules sèches', 'Des pellicules grasses', 'Des poux'], c: 0, explain: 'C\'est le terme officiel pour désigner un état pelliculaire sec.' },
            { q: 'Quelle infection fongique contagieuse provoque la cassure des cheveux ?', a: ['La teigne', 'Le pityriasis', 'L\'alopécie'], c: 0, explain: 'La teigne est une mycose hautement transmissible du cuir chevelu.' },
            { q: 'Comment nomme-t-on scientifiquement les pointes fourchues ?', a: ['La trichoptilose', 'Le pityriasis', 'La séborrhée'], c: 0, explain: 'La trichoptilose est le dédoublement de l\'extrémité du cheveu.' }
        ]
    }
];

// Load State from LocalStorage
function getGamificationState() {
    const saved = localStorage.getItem('alban_gamification');
    if (saved) {
        gamificationState = JSON.parse(saved);
    }
    return gamificationState;
}

// Save State to LocalStorage
function saveGamificationState() {
    localStorage.setItem('alban_gamification', JSON.stringify(gamificationState));
}

// Update gamification display elements across the page
function updateGamificationDisplay() {
    const state = getGamificationState();
    
    // Header level displays
    const lvlEl = document.getElementById('gamification-level');
    const xpEl = document.getElementById('gamification-xp');
    const strEl = document.getElementById('gamification-streak');
    
    if (lvlEl) lvlEl.innerText = `Nv. ${state.level}`;
    if (xpEl) xpEl.innerText = `${state.xp} XP`;
    if (strEl) strEl.innerText = `${state.streak} ${state.streak > 1 ? 'jrs' : 'jr'}`;
    
    // Duolingo page stats displays
    const duoXp = document.getElementById('duo-stats-xp');
    const duoLvl = document.getElementById('duo-stats-level');
    const duoPercent = document.getElementById('duo-stats-percent');
    
    if (duoXp) duoXp.innerText = `${state.xp} XP`;
    if (duoLvl) duoLvl.innerText = `Nv. ${state.level}`;
    
    if (duoPercent) {
        const percent = Math.round((state.completedLessons.length / duolingoLessons.length) * 100);
        duoPercent.innerText = `${percent}%`;
    }
}

// Add XP and handle level up
function addXP(amount) {
    const state = getGamificationState();
    const oldLevel = state.level;
    
    state.xp += amount;
    state.level = Math.floor(state.xp / 100) + 1;
    
    saveGamificationState();
    updateGamificationDisplay();
    
    if (state.level > oldLevel) {
        setTimeout(() => {
            playVictorySound();
            startConfetti();
            alert(`🎉 FÉLICITATIONS ! Vous passez au Niveau ${state.level} ! Continuez ainsi !`);
        }, 800);
    }
}

// Increment / Reset Streak based on daily access
function updateStreak() {
    const state = getGamificationState();
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!state.lastActiveDate) {
        state.streak = 1;
    } else {
        const lastDate = new Date(state.lastActiveDate);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            state.streak += 1;
        } else if (diffDays > 1) {
            state.streak = 1; // reset streak if missed a day
        }
        // if diffDays === 0, keep current streak (same day access)
    }
    
    state.lastActiveDate = todayStr;
    saveGamificationState();
    updateGamificationDisplay();
}

// Init Gamification Module
function initGamification() {
    getGamificationState();
    updateStreak();
    updateGamificationDisplay();
}

// SWITCH TABS IN DASHBOARD (VANILLA SPA EFFECT)
function initDuolingoTabs() {
    const navDash = document.getElementById('nav-dashboard');
    const navDuo = document.getElementById('nav-duolingo');
    const contentDash = document.getElementById('tab-content-dashboard');
    const contentDuo = document.getElementById('tab-content-duolingo');
    
    if (!contentDash || !contentDuo) return;
    
    function showTab(tabName) {
        if (tabName === 'duolingo') {
            contentDash.classList.add('hidden');
            contentDuo.classList.remove('hidden');
            
            if (navDash) navDash.className = "text-slate-400 hover:text-slate-100 text-sm font-medium flex items-center gap-2 pb-1.5 transition-all";
            if (navDuo) navDuo.className = "text-pink-400 border-b-2 border-pink-500 text-sm font-semibold flex items-center gap-2 pb-1.5 transition-all";
        } else {
            contentDash.classList.remove('hidden');
            contentDuo.classList.add('hidden');
            
            if (navDash) navDash.className = "text-indigo-400 border-b-2 border-indigo-500 text-sm font-semibold flex items-center gap-2 pb-1.5 transition-all";
            if (navDuo) navDuo.className = "text-slate-400 hover:text-slate-100 text-sm font-medium flex items-center gap-2 pb-1.5 transition-all";
        }
    }
    
    if (navDash) {
        navDash.addEventListener('click', (e) => {
            e.preventDefault();
            // Update URL search query without reloading
            window.history.pushState({}, '', 'index.html');
            showTab('dashboard');
        });
    }
    
    if (navDuo) {
        navDuo.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.pushState({}, '', 'index.html?tab=duolingo');
            showTab('duolingo');
        });
    }
    
    // Check initial query string tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'duolingo') {
        showTab('duolingo');
    } else {
        showTab('dashboard');
    }
}

// DUOLINGO PATHWAY MAP GENERATION
function initDuolingo() {
    renderDuolingoPath();
    initDuolingoTabs();
}

function renderDuolingoPath() {
    const container = document.getElementById('duo-nodes-container');
    if (!container) return;
    
    container.innerHTML = '';
    const state = getGamificationState();
    
    duolingoLessons.forEach((lesson, index) => {
        const isCompleted = state.completedLessons.includes(lesson.id);
        // An index is unlocked if it's the first lesson or the previous one is completed
        const isUnlocked = index === 0 || state.completedLessons.includes(duolingoLessons[index - 1].id);
        
        // Alternating positions (zig-zag): left, center, right, center
        let zigzagClass = '';
        if (index % 4 === 0) zigzagClass = 'md:-translate-x-14 -translate-x-8';      // Left
        else if (index % 4 === 2) zigzagClass = 'md:translate-x-14 translate-x-8';   // Right
        else zigzagClass = 'translate-x-0';                                           // Center
        
        let btnClasses = '';
        let badgeHtml = '';
        let buttonContent = '';
        
        if (isCompleted) {
            btnClasses = 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-300 text-white cursor-pointer hover:scale-105';
            buttonContent = '✓';
            badgeHtml = `<span class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-900/50">Complété</span>`;
        } else if (isUnlocked) {
            btnClasses = 'bg-gradient-to-br from-pink-500 to-pink-600 border-pink-300 text-white cursor-pointer hover:scale-110 active:scale-95 animate-pulse shadow-lg shadow-pink-500/20';
            buttonContent = lesson.emoji;
            badgeHtml = `<span class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-pink-400 bg-pink-950/80 px-2 py-0.5 rounded-full border border-pink-900/50">Démarrer</span>`;
        } else {
            btnClasses = 'bg-slate-800 border-slate-900 text-slate-500 cursor-not-allowed';
            buttonContent = '🔒';
            badgeHtml = `<span class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-850">Verrouillé</span>`;
        }
        
        const nodeWrapper = document.createElement('div');
        nodeWrapper.className = `relative flex flex-col items-center z-10 transition-transform duration-300 ${zigzagClass}`;
        
        nodeWrapper.innerHTML = `
            <button onclick="${isUnlocked ? `openLessonPopup('${lesson.id}')` : ''}" 
                class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black border-4 shadow-xl transition-all ${btnClasses}"
                title="${lesson.title}">
                ${buttonContent}
            </button>
            <div class="text-center mt-2">
                <p class="text-[11px] font-bold text-slate-300 max-w-[120px] truncate">${lesson.title}</p>
                <span class="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">${lesson.cat}</span>
            </div>
            ${badgeHtml}
        `;
        
        container.appendChild(nodeWrapper);
    });
}

// LESSON MODAL PLAY SYSTEM
let currentActiveLesson = null;
let currentLessonStep = 0; // 0: intro, 1-3: questions, 4: results
let lessonScore = 0;

function openLessonPopup(lessonId) {
    const lesson = duolingoLessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    currentActiveLesson = lesson;
    currentLessonStep = 0;
    lessonScore = 0;
    
    const modal = document.getElementById('lesson-modal');
    const modalContent = document.getElementById('lesson-modal-content');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => modalContent.classList.remove('scale-95'), 10);
    }
    
    renderLessonStep();
}

function closeLessonPopup() {
    const modal = document.getElementById('lesson-modal');
    const modalContent = document.getElementById('lesson-modal-content');
    if (modal) {
        modalContent.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 150);
    }
}

function renderLessonStep() {
    const inner = document.getElementById('lesson-modal-inner');
    if (!inner || !currentActiveLesson) return;
    
    inner.innerHTML = '';
    
    if (currentLessonStep === 0) {
        // Step 0: Intro panel
        inner.innerHTML = `
            <div class="text-center space-y-4">
                <span class="inline-block text-4xl mb-2">${currentActiveLesson.emoji}</span>
                <span class="block text-[10px] font-bold uppercase tracking-widest text-indigo-400">${currentActiveLesson.cat}</span>
                <h3 class="text-xl font-extrabold text-slate-100 font-heading">${currentActiveLesson.title}</h3>
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${currentActiveLesson.desc}</p>
                <div class="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl text-left text-xs text-slate-400 space-y-2">
                    <span class="font-bold text-slate-200 block">Instructions :</span>
                    <p>Répondez correctement aux 3 questions de révision pour valider la leçon et gagner <strong class="text-pink-400">+50 XP</strong> !</p>
                </div>
                <button onclick="startLessonQuiz()" 
                    class="w-full py-3 text-xs sm:text-sm font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-xl transition-all shadow-lg shadow-pink-500/20 cursor-pointer">
                    C'est parti ! 🚀
                </button>
            </div>
        `;
    } else if (currentLessonStep >= 1 && currentLessonStep <= 3) {
        // Step 1 to 3: Questions
        const qIndex = currentLessonStep - 1;
        const question = currentActiveLesson.questions[qIndex];
        
        const progressPercent = Math.round(((currentLessonStep - 1) / 3) * 100);
        
        const optionsHtml = question.a.map((opt, oIdx) => {
            return `
                <button onclick="submitLessonAnswer(${oIdx}, this)" 
                    class="lesson-opt-btn w-full text-left p-3.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-950 border border-slate-850 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-slate-300 cursor-pointer">
                    ${opt}
                </button>
            `;
        }).join('');
        
        inner.innerHTML = `
            <div class="space-y-5">
                <!-- Progress bar -->
                <div class="flex items-center gap-3">
                    <div class="flex-grow bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
                        <div class="bg-gradient-to-r from-pink-500 to-indigo-500 h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
                    </div>
                    <span class="text-[10px] font-bold text-slate-500">${currentLessonStep}/3</span>
                </div>
                
                <h4 class="text-base font-extrabold text-slate-100 leading-snug">${question.q}</h4>
                <div class="space-y-2.5">
                    ${optionsHtml}
                </div>
                
                <!-- Feedback panel hidden by default -->
                <div id="lesson-feedback" class="p-4 rounded-xl text-xs sm:text-sm font-bold border hidden animate-fade-in-up"></div>
                
                <!-- Continue button hidden by default -->
                <button id="lesson-continue-btn" onclick="nextLessonStep()" 
                    class="w-full py-3 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all hidden cursor-pointer">
                    Continuer ➔
                </button>
            </div>
        `;
    } else {
        // Step 4: Results screen
        const isSuccess = lessonScore === 3;
        
        if (isSuccess) {
            inner.innerHTML = `
                <div class="text-center space-y-4">
                    <span class="inline-block text-5xl animate-bounce">🏆</span>
                    <h3 class="text-xl font-extrabold text-emerald-400 font-heading">Leçon Validée !</h3>
                    <p class="text-xs sm:text-sm text-slate-300">Excellent travail ! Vous avez répondu correctement à toutes les questions.</p>
                    
                    <div class="bg-slate-950/80 p-4 border border-slate-850 rounded-2xl flex justify-around">
                        <div>
                            <span class="text-[9px] text-slate-500 block uppercase font-bold mb-1">XP Gagnés</span>
                            <strong class="text-lg text-pink-400 font-heading">+50 XP</strong>
                        </div>
                        <div>
                            <span class="text-[9px] text-slate-500 block uppercase font-bold mb-1">Statut</span>
                            <strong class="text-lg text-emerald-400 font-heading">Réussi</strong>
                        </div>
                    </div>
                    
                    <button onclick="finishActiveLesson()" 
                        class="w-full py-3 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20">
                        Terminer la leçon 🏁
                    </button>
                </div>
            `;
            // Trigger sound & confettis
            playVictorySound();
            startConfetti();
        } else {
            inner.innerHTML = `
                <div class="text-center space-y-4">
                    <span class="inline-block text-5xl">❌</span>
                    <h3 class="text-xl font-extrabold text-rose-400 font-heading">Dommage...</h3>
                    <p class="text-xs sm:text-sm text-slate-300">Vous avez fait des erreurs (${lessonScore}/3 réponses correctes). Révisez bien vos cours pour retenter le test !</p>
                    
                    <button onclick="openLessonPopup('${currentActiveLesson.id}')" 
                        class="w-full py-3 text-xs sm:text-sm font-bold text-white bg-slate-850 hover:bg-slate-850 border border-slate-700 rounded-xl transition-all cursor-pointer mb-2">
                        🔄 Recommencer le test
                    </button>
                    
                    <button onclick="closeLessonPopup()" 
                        class="w-full py-3 text-xs font-bold text-slate-500 hover:text-slate-400 cursor-pointer">
                        Fermer
                    </button>
                </div>
            `;
        }
    }
}

function startLessonQuiz() {
    currentLessonStep = 1;
    renderLessonStep();
}

function submitLessonAnswer(selectedIndex, btnElement) {
    const qIndex = currentLessonStep - 1;
    const question = currentActiveLesson.questions[qIndex];
    
    // Disable all options
    document.querySelectorAll('.lesson-opt-btn').forEach(btn => btn.disabled = true);
    
    const isCorrect = (selectedIndex === question.c);
    const feedback = document.getElementById('lesson-feedback');
    const contBtn = document.getElementById('lesson-continue-btn');
    
    if (isCorrect) {
        lessonScore++;
        btnElement.classList.add('border-emerald-500', 'bg-emerald-950/20', 'text-emerald-300');
        if (feedback) {
            feedback.className = "p-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 animate-fade-in-up";
            feedback.innerHTML = `✓ Correct ! ${question.explain}`;
            feedback.classList.remove('hidden');
        }
    } else {
        btnElement.classList.add('border-rose-500', 'bg-rose-950/20', 'text-rose-300');
        if (feedback) {
            feedback.className = "p-4 rounded-xl text-xs sm:text-sm font-bold bg-rose-950/30 border border-rose-500/20 text-rose-400 animate-fade-in-up";
            feedback.innerHTML = `✗ Incorrect. La bonne réponse était la <strong>${question.a[question.c]}</strong>.<br>${question.explain}`;
            feedback.classList.remove('hidden');
        }
        
        // Highlight correct option
        document.querySelectorAll('.lesson-opt-btn').forEach((btn, idx) => {
            if (idx === question.c) {
                btn.classList.add('border-emerald-500', 'bg-emerald-950/10', 'text-emerald-400');
            }
        });
    }
    
    if (contBtn) contBtn.classList.remove('hidden');
}

function nextLessonStep() {
    currentLessonStep++;
    renderLessonStep();
}

function finishActiveLesson() {
    const state = getGamificationState();
    
    if (!state.completedLessons.includes(currentActiveLesson.id)) {
        state.completedLessons.push(currentActiveLesson.id);
        saveGamificationState();
        addXP(50); // Earn 50 XP
    }
    
    closeLessonPopup();
    renderDuolingoPath();
    updateGamificationDisplay();
}

// LIGHTWEIGHT CONFETTI RAIN SYSTEM
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    canvas.classList.remove('hidden');
    const ctx = canvas.getContext('2d');
    
    // Set size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#10b981'];
    
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        });
    }
    
    let animationId;
    const startTime = Date.now();
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let finished = true;
        particles.forEach((p, index) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.tiltAngle) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.tiltAngle);
            p.tilt = Math.sin(p.tiltAngle - index) * 15;
            
            if (p.y < canvas.height) {
                finished = false;
            }
            
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();
        });
        
        if (finished || Date.now() - startTime > 4000) {
            cancelAnimationFrame(animationId);
            canvas.classList.add('hidden');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            animationId = requestAnimationFrame(draw);
        }
    }
    
    draw();
}

// WEB AUDIO API SOUND GENERATOR
function playVictorySound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Sound 1: E5
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        gain1.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start();
        osc1.stop(audioCtx.currentTime + 0.3);
        
        // Sound 2: A5 after 120ms
        setTimeout(() => {
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime); // A5
            gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.start();
            osc2.stop(audioCtx.currentTime + 0.5);
        }, 120);
    } catch (e) {
        console.error("Audio Context not supported", e);
    }
}

