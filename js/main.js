// System and State Management for Alban's CAP Coiffure revision platform

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

// Initialize theme and progress on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateProgressBar();
    
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
});

// ==========================================
// 1. THEME MANAGEMENT (Dark / Light Mode)
// ==========================================
function initTheme() {
    const currentTheme = localStorage.getItem('alban_theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggleIcon(currentTheme);
    
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('alban_theme', newTheme);
            updateThemeToggleIcon(newTheme);
        });
    }
}

function updateThemeToggleIcon(theme) {
    const iconContainer = document.getElementById('theme-toggle');
    if (!iconContainer) return;
    
    if (theme === 'dark') {
        // SVG for Sun
        iconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        // SVG for Moon
        iconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
    }
}

// ==========================================
// 2. PROGRESS MANAGEMENT
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
        label.className = `checklist-item ${isChecked ? 'completed' : ''}`;
        label.innerHTML = `
            <input type="checkbox" onchange="toggleChapter('${chapter.id}')" ${isChecked ? 'checked' : ''}>
            <span class="checklist-text">${chapter.name}</span>
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
// 3. PERSONAL JOURNAL / NOTES
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
        status.innerText = 'Sauvegarde en cours...';
        setTimeout(() => {
            status.innerText = 'Notes enregistrées localement ✓';
        }, 500);
    }
}

function clearNotes() {
    if (confirm("Es-tu sûr d'effacer toutes tes notes ?")) {
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
        title: "💀 Os Frontal (Zone Frontale)",
        desc: "L'os unique formant le front et le bord supérieur des orbites. En coiffure, il détermine la ligne antérieure d'implantation de la chevelure. C'est le repère géométrique pour positionner, orienter et équilibrer la frange ou les mèches frontales."
    },
    parietal: {
        title: "💀 Os Pariétaux (Plateau Supérieur)",
        desc: "Deux os pairs formant les parois latérales supérieures et le sommet de la voûte crânienne. C'est le 'plateau' de la tête. En coupe, cette zone est isolée par des séparations droites pour maîtriser le volume supérieur et concevoir les dégradés."
    },
    temporal: {
        title: "💀 Os Temporaux (Les Côtés)",
        desc: "Deux os pairs situés sur les côtés et à la base du crâne, logeant l'organe de l'ouïe. La zone temporale délimite le profil. En coiffure homme ou femme courte, c'est l'axe de raccordement des pattes et des fondus latéraux."
    },
    occipital: {
        title: "💀 Os Occipital (Arrière bas)",
        desc: "L'os formant la partie postérieure et inférieure du crâne. Sa protubérance externe est un point d'appui clé. Repère anatomique roi pour la graduation des nuques, la hauteur des attaches (queues de cheval, chignons) et le fondu américain."
    },
    mandibule: {
        title: "💀 Mandibule (Mâchoire inférieure)",
        desc: "Le seul os mobile de la tête, formant la mâchoire inférieure. En stylisme-visagisme, la structure de la mandibule (carrée, fuyante ou anguleuse) dicte la longueur des mèches latérales pour harmoniser ou adoucir le bas du visage."
    },
    maxillaire: {
        title: "💀 Maxillaire (Mâchoire supérieure)",
        desc: "Os pair formant la mâchoire supérieure et délimitant les cavités nasales et buccales. Il sert de point de référence pour aligner la symétrie des pattes et définir le relief de la pommette lors des coupes dégradées."
    }
};

function showOsteology(bone) {
    const data = osteologyData[bone];
    const infoBox = document.getElementById('osteology-info-box');
    if (!infoBox || !data) return;
    
    infoBox.classList.add('highlight');
    infoBox.innerHTML = `
        <h4 class="font-bold text-slate-900 text-base" style="color:var(--accent-primary); margin-bottom: 0.5rem;">${data.title}</h4>
        <p class="text-xs text-slate-600 mt-2 leading-relaxed" style="color:var(--text-secondary);">${data.desc}</p>
    `;
    setTimeout(() => {
        infoBox.classList.remove('highlight');
    }, 300);
}

// ==========================================
// 5. SKIN LAYERS INTERACTIVE DIAGRAM
// ==========================================
const skinLayersData = {
    epiderme: {
        title: "🛡️ L'Épiderme",
        desc: "Couche superficielle non vascularisée. Composé de 5 sous-couches (basale, épineuse, granuleuse, claire, cornée). Il contient les kératinocytes (qui forment la kératine protectrice) et les mélanocytes (synthèse de la mélanine colorante). Se renouvelle en 28 jours par desquamation. Épaisseur moyenne : 0,1 mm."
    },
    derme: {
        title: "🩸 Le Derme",
        desc: "Tissu conjonctif vivant et très irrigué. Il contient les fibres de collagène (fermeté) et d'élastine (souplesse). C'est ici que loge le follicule pileux, nourri à sa base par la papille dermique. Il contient également les glandes sébacées (production de sébum pour lubrifier la tige) et sudoripares (production de sueur)."
    },
    hypoderme: {
        title: "💧 L'Hypoderme",
        desc: "Couche profonde adipeuse composée de lobules graisseux (adipocytes). Il fait office d'amortisseur mécanique contre les chocs physiques, assure l'isolation thermique du crâne et constitue une importante réserve énergétique pour l'organisme."
    },
    follicule: {
        title: "🧬 Le Follicule Pileux",
        desc: "Repli épidermique s'enfonçant dans le derme. C'est le berceau de la tige pilaire. À sa base se trouvent le bulbe pileux et la matrice (cellules actives en mitose permanente pour former le cheveu). Il est accolé au muscle horripilateur (responsable du phénomène de chair de poule)."
    },
    glande: {
        title: "🧪 La Glande Sébacée",
        desc: "Glande exocrine annexée au poil. Elle sécrète le sébum, une substance grasse acide. En s'écoulant à la surface de l'épiderme et en se mélangeant à la sueur, le sébum constitue le Film Hydrolipidique (FHL) qui lubrifie le cheveu et immunise la peau contre les bactéries."
    }
};

function showSkinLayer(layer) {
    const data = skinLayersData[layer];
    const infoBox = document.getElementById('skin-info-box');
    if (!infoBox || !data) return;
    
    infoBox.classList.add('highlight');
    infoBox.innerHTML = `
        <h4 class="font-bold text-slate-900 text-base" style="color:var(--accent-primary); margin-bottom: 0.5rem;">${data.title}</h4>
        <p class="text-xs text-slate-600 mt-2 leading-relaxed" style="color:var(--text-secondary);">${data.desc}</p>
    `;
    setTimeout(() => {
        infoBox.classList.remove('highlight');
    }, 300);
}

// ==========================================
// 6. PH AND CUTICLE SIMULATOR
// ==========================================
const phDescriptions = {
    2: { 
        title: "Acide Extrême (pH 2.0 - 3.0)",
        color: "text-red-500", 
        desc: "Écailles de la cuticule refermées de façon ultra-hermétique. Le cheveu acquiert une brillance maximale car sa surface est parfaitement lisse et réfléchit la lumière. Idéal pour fixer une couleur en fin de service technique. Cependant, la fibre devient temporairement rigide et imperméable." 
    },
    5: { 
        title: "pH Isoélectrique Naturel (pH 4.5 - 5.5)",
        color: "text-emerald-500", 
        desc: "pH physiologique idéal de la kératine. C'est l'état d'équilibre optimal du cheveu et du cuir chevelu. Les écailles sont alignées et resserrées naturellement sans stress mécanique. La cohésion interne est à son maximum, le cheveu est fort, souple et élastique." 
    },
    7: { 
        title: "pH Neutre (pH 7.0)",
        color: "text-amber-500", 
        desc: "pH de l'eau pure. À ce stade, les liaisons hydrogène de la kératine commencent à s'assouplir légèrement. Les écailles de la cuticule s'entrouvrent très faiblement. C'est le point de transition où l'hydratation pénètre, mais sans gonflement de la structure interne." 
    },
    9: { 
        title: "Milieu Alcalin / Basique (pH 8.5 - 10.0)",
        color: "text-indigo-500", 
        desc: "Écailles de kératine écartées et soulevées. La tige pilaire gonfle par absorption d'eau et de produit alcalin (ex: ammoniaque, MEA). C'est le milieu indispensable pour les techniques d'oxydation (coloration permanente, décoloration) et de permanente (rupture des ponts disulfures) pour laisser pénétrer les molécules actives au cœur du cortex." 
    },
    12: { 
        title: "Alcalin Extrême (pH 11.0 - 12.0)",
        color: "text-rose-500", 
        desc: "Seuil critique d'endommagement de la kératine. Les écailles sont ouvertes à l'extrême et risquent de s'arracher ou de se dissoudre. La structure interne du cortex perd sa cohésion et le ciment intercellulaire s'altère. Nécessite absolument l'application immédiate de soins acides neutralisants (pH 3-4) pour refermer la cuticule." 
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
    
    // Style description panel
    panel.className = `p-4 rounded-2xl border transition-all duration-300 ${val > 7 ? 'bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30' : 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30'}`;
    panel.innerHTML = `
        <p class="text-xs font-bold uppercase tracking-wider ${data.color}" style="margin-bottom:0.25rem;">${data.title}</p>
        <p class="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">${data.desc}</p>
    `;
    
    // Scale visualizer rotation (cuticle scales opening)
    const maxRotation = (val - 5) * 5; // Negative for acid (scales tight), positive for alkaline (open)
    const rotation = Math.max(0, maxRotation); // Only rotate outwards
    
    document.querySelectorAll('.scale-cuticle-layer').forEach(el => {
        el.style.transform = `rotate(${rotation}deg)`;
    });
}

// ==========================================
// 7. HAIR CYCLE INTERACTIVE SELECTOR
// ==========================================
function switchCycleTab(phase, element) {
    // Deactivate all tabs
    document.querySelectorAll('.cycle-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.cycle-details').forEach(detail => detail.classList.remove('active'));
    
    // Activate clicked tab
    element.classList.add('active');
    const targetDetails = document.getElementById(`cycle-${phase}`);
    if (targetDetails) {
        targetDetails.classList.add('active');
    }
    
    // Update SVG bulbs visual state based on active phase
    const bulbAnagene = document.getElementById('svg-bulb-anagene');
    const bulbCatagene = document.getElementById('svg-bulb-catagene');
    const bulbTelogene = document.getElementById('svg-bulb-telogene');
    
    if (bulbAnagene && bulbCatagene && bulbTelogene) {
        bulbAnagene.setAttribute('opacity', '0.2');
        bulbCatagene.setAttribute('opacity', '0.2');
        bulbTelogene.setAttribute('opacity', '0.2');
        
        if (phase === 'anagene') bulbAnagene.setAttribute('opacity', '1');
        if (phase === 'catagene') bulbCatagene.setAttribute('opacity', '1');
        if (phase === 'telogene') bulbTelogene.setAttribute('opacity', '1');
    }
}

// ==========================================
// 8. DYNAMIC QUIZ SYSTEM
// ==========================================
const quizQuestions = [
    {
        q: "1. Quel est le pH naturel d'un cuir chevelu en pleine santé ?",
        opts: ["A) Entre 7.5 et 8.5 (Basique / Alcalin)", "B) Entre 4.5 et 5.5 (Acide)", "C) Pile 7.0 (Neutre)"],
        correct: "B",
        explain: "Le cuir chevelu et le cheveu sont acides par nature (pH ~4.5 à 5.5). Cette acidité est maintenue par le film hydrolipidique protecteur qui combat la prolifération bactérienne."
    },
    {
        q: "2. Quelle phase correspond à la croissance active du cheveu ?",
        opts: ["A) Phase Anagène", "B) Phase Catagène", "C) Phase Télogène"],
        correct: "A",
        explain: "La phase anagène est la phase de pousse active qui concerne environ 85% de la chevelure. La mitose y est permanente dans la matrice. Elle dure de 3 à 7 ans."
    },
    {
        q: "3. Quel outil de coupe élimine entre 15% et 30% d'une mèche ?",
        opts: ["A) Les ciseaux droits", "B) Le rasoir de rasage", "C) Les ciseaux sculpteurs"],
        correct: "C",
        explain: "Les ciseaux sculpteurs possèdent une lame lisse et une lame dentelée (crantée), permettant d'effiler de manière ciblée en ne coupant qu'un pourcentage des cheveux."
    },
    {
        q: "4. Si un client présente des plaques chauves circulaires recouvertes de squames sèches et grises, quelle est la conduite à tenir ?",
        opts: ["A) Faire une coloration d'oxydation ton sur ton", "B) Refuser poliment la prestation pour risque d'affection contagieuse (teigne)", "C) Réaliser un shampooing exfoliant intense"],
        correct: "B",
        explain: "Ces plaques indiquent les symptômes d'une teigne tondante (infection fongique contagieuse). Le coiffeur a l'obligation de refuser le service et d'orienter vers un dermatologue."
    },
    {
        q: "5. Quelle molécule chimique brise les pigments mélaniques du cortex de la tige pilaire ?",
        opts: ["A) Le soufre", "B) L'eau oxygénée (H2O2) en milieu alcalin", "C) Les agents de surface (tensioactifs)"],
        correct: "B",
        explain: "L'eau oxygénée (oxydant), activée dans un milieu basique (ammoniaque), libère de l'oxygène gazeux qui dissout et oxyde les pigments mélaniques logés dans le cortex."
    },
    {
        q: "6. Quelle couche de la peau produit le sébum ?",
        opts: ["A) L'épiderme", "B) Le derme (via la glande sébacée)", "C) L'hypoderme"],
        correct: "B",
        explain: "La glande sébacée est une glande exocrine logée dans le derme et rattachée au follicule pileux, sécrétant le sébum gras pour lubrifier la tige pilaire."
    },
    {
        q: "7. Quel produit utilise-t-on juste après une décoloration pour stabiliser la kératine ?",
        opts: ["A) Un après-shampooing alcalin", "B) Un shampooing technique acide ou neutralisant", "C) De l'eau calcaire chaude"],
        correct: "B",
        explain: "Le shampooing technique au pH acide referme instantanément les écailles de la cuticule soulevées par le processus alcalin de décoloration, en ramenant le cheveu à son pH isoélectrique."
    },
    {
        q: "8. Quelle liaison forte est modifiée lors d'un protocole de permanente (mise en plis permanente) ?",
        opts: ["A) Les liaisons hydrogène", "B) Les ponts disulfures", "C) Les liaisons salines / ioniques"],
        correct: "B",
        explain: "Les ponts disulfures (liaisons covalentes de soufre) assurent la rigidité de la kératine. Le réducteur les coupe pour permettre l'enroulage, puis le fixateur les ressoude dans la nouvelle forme."
    },
    {
        q: "9. Comment s'appelle l'anomalie correspondant à des pointes fourchues ?",
        opts: ["A) La trichoptilose", "B) Le pityriasis", "C) L'effluvium"],
        correct: "A",
        explain: "La trichoptilose est le terme dermatologique exact qui désigne le dédoublement de l'extrémité de la tige pilaire (les pointes fourchues) suite à une usure mécanique ou chimique."
    },
    {
        q: "10. Quel est l'effet d'un produit acide sur la cuticule du cheveu ?",
        opts: ["A) Il gonfle le cheveu et ouvre les écailles", "B) Il lisse et resserre les écailles", "C) Il dissout complètement la kératine"],
        correct: "B",
        explain: "L'acidité resserre et lisse les écailles de kératine qui se chevauchent. Cela renforce la brillance (la lumière se réfléchit mieux) et retient l'hydratation au cœur du cortex."
    }
];

let quizUserAnswers = {};

function loadQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    quizQuestions.forEach((item, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'quiz-question-card animate-fade-in';
        questionCard.id = `quiz-q${index}`;
        questionCard.style.animationDelay = `${index * 0.05}s`;
        
        let optionsHtml = item.opts.map((opt, optIndex) => {
            const optLetter = opt.charAt(0);
            return `
                <button onclick="submitQuizAnswer(${index}, '${optLetter}', this)" class="quiz-option-btn">
                    ${opt}
                </button>
            `;
        }).join('');
        
        questionCard.innerHTML = `
            <p class="quiz-question-title">${item.q}</p>
            <div class="quiz-options">
                ${optionsHtml}
            </div>
            <div class="quiz-feedback" id="feedback-q${index}"></div>
        `;
        container.appendChild(questionCard);
    });
}

function submitQuizAnswer(qIndex, letter, element) {
    if (quizUserAnswers[qIndex] !== undefined) return; // Already answered
    
    const question = quizQuestions[qIndex];
    quizUserAnswers[qIndex] = letter;
    
    const questionBox = document.getElementById(`quiz-q${qIndex}`);
    const feedbackBox = document.getElementById(`feedback-q${qIndex}`);
    const buttons = questionBox.querySelectorAll('.quiz-option-btn');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        // Fade other buttons slightly
        if (btn !== element) {
            btn.style.opacity = '0.4';
        }
    });
    
    const isCorrect = (letter === question.correct);
    
    if (isCorrect) {
        element.classList.add('selected-correct');
        feedbackBox.className = 'quiz-feedback correct';
        feedbackBox.innerHTML = `<strong>✓ Correct !</strong> ${question.explain}`;
    } else {
        element.classList.add('selected-incorrect');
        feedbackBox.className = 'quiz-feedback incorrect';
        feedbackBox.innerHTML = `<strong>✗ Incorrect.</strong> La bonne réponse était la <strong>${question.correct}</strong>.<br>${question.explain}`;
        
        // Highlight correct button
        buttons.forEach(btn => {
            if (btn.innerText.trim().startsWith(question.correct)) {
                btn.classList.add('selected-correct');
            }
        });
    }
    
    // Update score display
    let score = 0;
    quizQuestions.forEach((q, idx) => {
        if (quizUserAnswers[idx] === q.correct) score++;
    });
    
    const scoreDisplay = document.getElementById('quiz-score-display');
    if (scoreDisplay) {
        scoreDisplay.innerText = `${score}/10`;
    }
}
