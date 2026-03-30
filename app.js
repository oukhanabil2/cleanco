// app.js - VERSION CORRIGÉE
// Planning vertical, tous les agents actifs, export Excel simple

// --- CONSTANTES ---
const JOURS_FRANCAIS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const SHIFT_LABELS = {
    '1': 'Matin', '2': 'Après-midi', '3': 'Nuit',
    'R': 'Repos', 'C': 'Congé', 'M': 'Maladie',
    'A': 'Autre absence', '-': 'Non défini'
};
const SHIFT_COLORS = {
    '1': '#3498db', '2': '#e74c3c', '3': '#9b59b6',
    'R': '#2ecc71', 'C': '#f39c12', 'M': '#e67e22',
    'A': '#95a5a6', '-': '#7f8c8d'
};

// Variables globales
let agents = [];
let planningData = {};
let holidays = [];
let panicCodes = [];
let radios = [];
let uniforms = [];
let warnings = [];
let leaves = [];

// Mot de passe
let ADMIN_PASSWORD = localStorage.getItem('sga_password') || "Nabil1974";

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    if (agents.length === 0) initializeTestData();
    displayMainMenu();
});

function loadData() {
    try {
        agents = JSON.parse(localStorage.getItem('sga_agents')) || [];
        planningData = JSON.parse(localStorage.getItem('sga_planning')) || {};
        holidays = JSON.parse(localStorage.getItem('sga_holidays')) || [];
        panicCodes = JSON.parse(localStorage.getItem('sga_panic_codes')) || [];
        radios = JSON.parse(localStorage.getItem('sga_radios')) || [];
        uniforms = JSON.parse(localStorage.getItem('sga_uniforms')) || [];
        warnings = JSON.parse(localStorage.getItem('sga_warnings')) || [];
        leaves = JSON.parse(localStorage.getItem('sga_leaves')) || [];
    } catch(e) { console.error(e); }
}

function saveData() {
    localStorage.setItem('sga_agents', JSON.stringify(agents));
    localStorage.setItem('sga_planning', JSON.stringify(planningData));
    localStorage.setItem('sga_holidays', JSON.stringify(holidays));
    localStorage.setItem('sga_panic_codes', JSON.stringify(panicCodes));
    localStorage.setItem('sga_radios', JSON.stringify(radios));
    localStorage.setItem('sga_uniforms', JSON.stringify(uniforms));
    localStorage.setItem('sga_warnings', JSON.stringify(warnings));
    localStorage.setItem('sga_leaves', JSON.stringify(leaves));
}

function initializeTestData() {
    agents = [
        // Groupe A - TOUS ACTIFS
        { code: 'CPA', nom: 'OUKHA', prenom: 'NABIL', groupe: 'A', tel: '0681564713', adresse: 'sala Al jadida', code_panique: '', poste: 'CP', cin: 'A758609', date_naissance: '1974-11-05', matricule: 'S09278C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'CONA', nom: 'EL JAMALI', prenom: 'Younes', groupe: 'A', tel: '0663290648', adresse: 'cym', code_panique: '', poste: 'CON', cin: 'A370180', date_naissance: '1992-09-04', matricule: 'S09425C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'MOTA', nom: 'TISSIRT', prenom: 'hakim', groupe: 'A', tel: '0611160166', adresse: 'sale', code_panique: '', poste: 'MOT', cin: 'CB230482', date_naissance: '1968-10-20', matricule: 'S09279C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'ZA', nom: 'DRAFA', prenom: 'Noureddine', groupe: 'A', tel: '0603482589', adresse: 'tamasna', code_panique: '815', poste: 'ZA', cin: '469875', date_naissance: '1974-05-15', matricule: 'S09179C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z2A', nom: 'KAROUCHE', prenom: 'Fayçal', groupe: 'A', tel: '', adresse: 'DP1400', code_panique: '', poste: 'Z2A', cin: '743534', date_naissance: '', matricule: 'S13273C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z5A', nom: 'LAWRIQAT TARIK', prenom: 'TARIK', groupe: 'A', tel: '0615296161', adresse: '', code_panique: 'DP1400', poste: 'Z5A', cin: '794204', date_naissance: '1979-04-17', matricule: 'S11699C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z7A', nom: 'CHERKAOUI', prenom: 'NOUAMANA', groupe: 'A', tel: '', adresse: 'DP1400', code_panique: '', poste: 'Z7A', cin: 'D216143', date_naissance: '1992-12-01', matricule: 'S11869C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O1aA', nom: 'ALAMI', prenom: 'ZAKARIA', groupe: 'A', tel: '0660269360', adresse: '', code_panique: '913', poste: 'O1a', cin: 'D990488', date_naissance: '1987-06-02', matricule: 'S09188C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O1bA', nom: 'EL KADMIRI', prenom: 'YASSINE', groupe: 'A', tel: '0707937021', adresse: '', code_panique: '228', poste: 'O1bA', cin: 'A253632', date_naissance: '1986-10-22', matricule: 'S12667C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O3A', nom: 'EL GHALLA', prenom: 'ABDELALI', groupe: 'A', tel: '0663391782', adresse: '', code_panique: '511', poste: 'O3A', cin: '729822', date_naissance: '1976-06-30', matricule: 'S09216C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O8A', nom: 'AIT LMKADAM', prenom: 'KAHCEN', groupe: 'A', tel: '0626521862', adresse: '', code_panique: '824', poste: 'O8', cin: 'PB42708', date_naissance: '1977-11-19', matricule: 'S09229C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O9A', nom: 'OUTANOUT', prenom: 'OMAR', groupe: 'A', tel: '06943677602', adresse: '', code_panique: '813', poste: 'O9A', cin: '651335', date_naissance: '1972-01-03', matricule: 'S09251C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O10A', nom: 'ZOUHRI', prenom: 'HAMID', groupe: 'A', tel: '0625615979', adresse: '', code_panique: '911', poste: 'O10', cin: 'Z155268', date_naissance: '1968-12-19', matricule: 'S09861C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O11A', nom: 'ARRADI', prenom: 'TARIK', groupe: 'A', tel: '', adresse: '', code_panique: '326', poste: 'O11A', cin: 'A345212', date_naissance: '1990-11-25', matricule: 'S09284C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O12A', nom: 'BOULAHFA', prenom: 'MOHAMED', groupe: 'A', tel: '0667877556', adresse: '', code_panique: '855', poste: 'O12', cin: 'FL33963', date_naissance: '1965-06-30', matricule: 'S09234C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O13A', nom: 'ZDIHRI', prenom: 'ABDERRAHIM', groupe: 'A', tel: '0667370493', adresse: '', code_panique: '826', poste: 'O13A', cin: 'B187620', date_naissance: '1967-11-05', matricule: 'S09204C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O15A', nom: 'AIT BENALI', prenom: 'ABLKRIM', groupe: 'A', tel: '0641103141', adresse: '', code_panique: '113', poste: 'O15A', cin: 'D171008', date_naissance: '1987-05-26', matricule: 'S12072C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O16A', nom: 'HOUMMAY MEHDI', prenom: 'MEHDI', groupe: 'A', tel: '0660994944', adresse: '', code_panique: '827', poste: 'O16A', cin: 'A33782', date_naissance: '1983-09-22', matricule: 'S09159C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L2A', nom: 'OUSSALLEM', prenom: 'KHALID', groupe: 'A', tel: '0715929737', adresse: '', code_panique: '126', poste: 'L 2A', cin: '653628', date_naissance: '1970-07-29', matricule: 'S09166C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L5A', nom: 'SLYI', prenom: 'MOHAMED', groupe: 'A', tel: '0649068606', adresse: '', code_panique: '913', poste: 'L5A', cin: 'B129122', date_naissance: '1965-03-22', matricule: 'S09212C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L6A', nom: 'KHTIDAK', prenom: 'HICHAM', groupe: 'A', tel: '0660124827', adresse: '', code_panique: '841', poste: 'L6A', cin: '766806', date_naissance: '1977-09-09', matricule: 'S09228C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L7A', nom: 'ECHOUHAIDI', prenom: 'RACHID', groupe: 'A', tel: '0670444699', adresse: '', code_panique: '327', poste: 'L7A', cin: '471850', date_naissance: '1974-02-24', matricule: 'S09254C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L8A', nom: 'ABOUKAL', prenom: 'SAID', groupe: 'A', tel: '0661541861', adresse: '', code_panique: '815', poste: 'L8A', cin: '418554', date_naissance: '1971-04-11', matricule: 'S09207C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L11A', nom: 'QOTBI', prenom: 'OTMAN', groupe: 'A', tel: '0681688161', adresse: '', code_panique: '125', poste: 'L11A', cin: 'A18238', date_naissance: '1986-11-19', matricule: 'S09156C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L13A', nom: 'ZEHDI', prenom: 'SALEM', groupe: 'A', tel: '0666788715', adresse: '', code_panique: '118', poste: 'L13A', cin: '569901', date_naissance: '1967-12-01', matricule: 'S10068C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L14A', nom: 'BOUNHAR', prenom: 'MOHAMED', groupe: 'A', tel: '0614445839', adresse: '', code_panique: '858', poste: 'L14A', cin: '772206', date_naissance: '1976-04-23', matricule: 'S09235C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L15A', nom: 'BOUCHRIHA', prenom: 'MOUNIR', groupe: 'A', tel: '0641871461', adresse: '', code_panique: '999', poste: 'L15A', cin: '774225', date_naissance: '1978-12-04', matricule: 'S09424C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L16A', nom: 'ROUANI', prenom: 'AYOUB', groupe: 'A', tel: '0612510273', adresse: '', code_panique: '328', poste: 'L16A', cin: 'A48291', date_naissance: '1991-06-07', matricule: 'S09172C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L18A', nom: 'EL KAHLAOUI', prenom: 'ABDELLAH', groupe: 'A', tel: '0671415745', adresse: '', code_panique: '826', poste: 'L18A', cin: '724698', date_naissance: '1975-02-18', matricule: 'S09199C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L20A', nom: 'FOZARI', prenom: 'ABDLILAH', groupe: 'A', tel: '0690108567', adresse: '', code_panique: '922', poste: 'L 20', cin: '', date_naissance: '', matricule: '', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O4A', nom: 'BOUAKRA', prenom: 'ABDELHAK', groupe: 'A', tel: '0673978815', adresse: '', code_panique: '313', poste: 'O4A', cin: '758824', date_naissance: '1972-02-04', matricule: 'S09197C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L4B', nom: 'YOUNES', prenom: 'KHODAYRA', groupe: 'A', tel: '0696893480', adresse: '', code_panique: '842', poste: 'L4A', cin: '660675', date_naissance: '1983-02-10', matricule: 'S09162C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z6A', nom: 'MOHAMED', prenom: 'MOUSTAKIM', groupe: 'A', tel: '0654718291', adresse: '', code_panique: 'DP1400', poste: 'z6A', cin: '764411', date_naissance: '1975-07-15', matricule: 'S09246C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },

        // Groupe B - TOUS ACTIFS
        { code: 'CPB', nom: 'CHMAREKH', prenom: 'Noureddine', groupe: 'B', tel: '0660337343', adresse: '', code_panique: '854', poste: 'CPA', cin: '604196', date_naissance: '1971-11-24', matricule: 'S09274C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'CONB', nom: 'IBRAHIMY', prenom: 'ABDELLAHADIB', groupe: 'B', tel: '0662815350', adresse: '', code_panique: 'DP1400', poste: 'CON', cin: 'C475743', date_naissance: '1976-03-15', matricule: 'S09275C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'MOTB', nom: 'KAALI', prenom: 'MAJID', groupe: 'B', tel: '0777934644', adresse: '', code_panique: 'DP1400', poste: 'MOT', cin: 'Q210329', date_naissance: '1978-11-25', matricule: 'S12666C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z2B', nom: 'TSOULI', prenom: 'ADIL', groupe: 'B', tel: '0767872200', adresse: '', code_panique: 'DP1400', poste: 'Z2A', cin: '414286', date_naissance: '2020-07-01', matricule: 'S09170C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z5B', nom: 'KAMOUN', prenom: 'YOUNES', groupe: 'B', tel: '', adresse: '', code_panique: 'DP1400', poste: 'Z5', cin: 'C436844', date_naissance: '1971-05-12', matricule: 'S09180C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z6B', nom: 'ROCHDI', prenom: 'HASSAN', groupe: 'B', tel: '065539574', adresse: '', code_panique: 'DP1400', poste: 'z6A', cin: '594182', date_naissance: '1969-10-15', matricule: 'S09173C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O1aB', nom: 'JELOULI', prenom: 'MAROUAN', groupe: 'B', tel: '0637401598', adresse: '', code_panique: '913', poste: 'O1a', cin: 'AB335545', date_naissance: '1986-01-30', matricule: 'S09186C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O1bB', nom: 'KADI', prenom: 'ANNOUAR', groupe: 'B', tel: '0642889596', adresse: '', code_panique: '228', poste: 'O1b', cin: 'AE110942', date_naissance: '1990-09-11', matricule: 'S12672C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O3B', nom: 'EL FADEL', prenom: 'MOHAMED', groupe: 'B', tel: '0762731541', adresse: '', code_panique: '511', poste: 'O3A', cin: '783152', date_naissance: '1976-12-15', matricule: 'S09239C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O5B', nom: 'HOUCINE', prenom: 'ASGHEN', groupe: 'B', tel: '0617152230', adresse: '', code_panique: '848', poste: 'O5', cin: 'CB42565', date_naissance: '1972-10-10', matricule: 'S09225C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O8B', nom: 'RIFKI', prenom: 'KAMAL', groupe: 'B', tel: '0677019711', adresse: '', code_panique: '824', poste: 'O8', cin: 'AB70661', date_naissance: '1982-05-26', matricule: 'S09185C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O9B', nom: 'HADIR', prenom: 'HAKIM', groupe: 'B', tel: '0622379633', adresse: '', code_panique: '813', poste: 'O9', cin: 'D217181', date_naissance: '1983-06-23', matricule: 'S09158C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O10B', nom: 'BELASRI', prenom: 'MOHAMED', groupe: 'B', tel: '0670108838', adresse: '', code_panique: '911', poste: 'O10', cin: 'A755100', date_naissance: '1971-05-25', matricule: 'S09244C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O11B', nom: 'MANSOURI', prenom: 'OUSSAAMA', groupe: 'B', tel: '0691484070', adresse: '', code_panique: '326', poste: 'O11A', cin: '728886', date_naissance: '1975-10-20', matricule: 'S09956C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O12B', nom: 'LAHYANE', prenom: 'MOHCINE', groupe: 'B', tel: '0676454181', adresse: '', code_panique: '855', poste: 'O12A', cin: '779095', date_naissance: '1981-02-06', matricule: 'S12134C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O13B', nom: 'ABDOUSSI', prenom: 'HASSAN', groupe: 'B', tel: '0645308599', adresse: '', code_panique: '826', poste: 'O13', cin: 'D424329', date_naissance: '1973-11-28', matricule: 'S09218C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O14B', nom: 'ABEID', prenom: 'MOHAMED', groupe: 'B', tel: '0663738283', adresse: '', code_panique: '838', poste: 'O14A', cin: '767986', date_naissance: '1972-06-12', matricule: 'S11698C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O15B', nom: 'FAKHAR', prenom: 'ABDEHADI', groupe: 'B', tel: '0648941710', adresse: '', code_panique: '113', poste: 'O15A', cin: 'A20765', date_naissance: '1988-11-08', matricule: 'S11645C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O16B', nom: 'NAIM', prenom: 'TAOUFIK', groupe: 'B', tel: '0636552127', adresse: '', code_panique: '827', poste: 'O16A', cin: '762084', date_naissance: '1972-12-15', matricule: 'S09250C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L2B', nom: 'ZAHI', prenom: 'MOHAMED', groupe: 'B', tel: '0671614828', adresse: '', code_panique: '126', poste: 'L 2A', cin: '566655', date_naissance: '1969-03-20', matricule: 'S09243C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L5B', nom: 'BELAHMAR', prenom: 'MOHAMED', groupe: 'B', tel: '0676120413', adresse: '', code_panique: '913', poste: 'L5A', cin: 'A20765', date_naissance: '1988-11-09', matricule: 'S11645C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L6B', nom: 'RACHAD', prenom: 'YOUSSEF', groupe: 'B', tel: '0608980660', adresse: '', code_panique: '841', poste: 'L6A', cin: 'D152284', date_naissance: '1986-09-10', matricule: 'S09167C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L7B', nom: 'ANOUAR', prenom: 'KADDAR', groupe: 'B', tel: '0610425223', adresse: '', code_panique: '327', poste: 'L7A', cin: 'B155974', date_naissance: '1975-06-10', matricule: 'S09161C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L8B', nom: 'AHMED', prenom: 'OUHADI', groupe: 'B', tel: '0670469944', adresse: '', code_panique: '815', poste: 'L8', cin: 'FL74690', date_naissance: '1968-01-01', matricule: 'S11697C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L9B', nom: 'BOUZIANE', prenom: 'EL HAMROUCHI', groupe: 'B', tel: '0662765085', adresse: '', code_panique: '914', poste: 'L9', cin: 'H207682', date_naissance: '2005-05-24', matricule: 'S12668C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L10B', nom: 'ABDELHAK', prenom: 'AKRAOUI', groupe: 'B', tel: '0660387282', adresse: '', code_panique: '926', poste: 'L10', cin: 'AD57067', date_naissance: '1977-01-01', matricule: 'S09382C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L11B', nom: 'NOUASSI', prenom: 'AHMED', groupe: 'B', tel: '0666276247', adresse: '', code_panique: '125', poste: 'L11A', cin: '319132', date_naissance: '1968-01-11', matricule: 'S09211C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L13B', nom: 'DAOU', prenom: 'RACHID', groupe: 'B', tel: '0677772015', adresse: '', code_panique: '118', poste: 'L13', cin: 'X127977', date_naissance: '1970-08-01', matricule: 'S09253C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L14B', nom: 'ABDELGHANI', prenom: 'KANOUBI', groupe: 'B', tel: '0606656164', adresse: '', code_panique: '858', poste: 'L14A', cin: '752774', date_naissance: '1970-11-28', matricule: 'S12670C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L15B', nom: 'BOUTJADIR', prenom: 'HAMZA', groupe: 'B', tel: '0615183020', adresse: '', code_panique: '999', poste: 'L15A', cin: 'A40770', date_naissance: '1987-06-30', matricule: 'S09423C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L16B', nom: 'NOUREDDINE', prenom: 'TAOUZI', groupe: 'B', tel: '0767872200', adresse: '', code_panique: '328', poste: 'L16A', cin: '414286', date_naissance: '1970-08-04', matricule: 'S09169C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L18B', nom: 'ABDELAZIZ', prenom: 'SAKANI', groupe: 'B', tel: '0662509676', adresse: '', code_panique: '826', poste: 'L18', cin: 'Z428454', date_naissance: '1986-01-10', matricule: 'S13153C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L20B', nom: 'RACHAKHA', prenom: 'SAID', groupe: 'B', tel: '0648758364', adresse: '', code_panique: '922', poste: 'L 20', cin: '', date_naissance: '', matricule: '', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'ZB', nom: 'SNAIDA', prenom: 'AHMED', groupe: 'B', tel: '0666362689', adresse: '', code_panique: '815', poste: 'ZX', cin: 'A24831', date_naissance: '1974-05-25', matricule: 'S09195C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },

        // Groupe C - TOUS ACTIFS
        { code: 'CPC', nom: 'ABDELHAK', prenom: 'BERRIMA', groupe: 'C', tel: '0660337343', adresse: '', code_panique: '854', poste: 'CPA', cin: '403963', date_naissance: '1967-02-24', matricule: 'S09271C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'CONC', nom: 'NOUR', prenom: 'HICHAM', groupe: 'C', tel: '0665484503', adresse: '', code_panique: 'DP1400', poste: 'CON', cin: 'A714632', date_naissance: '1982-02-03', matricule: 'S09174C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'MOTC', nom: 'IDRISS', prenom: 'IDRISSI', groupe: 'C', tel: '0667999548', adresse: '', code_panique: 'DP1400', poste: 'MOT', cin: 'AB171068', date_naissance: '1972-12-24', matricule: 'S09276C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z6C', nom: 'HARBIL', prenom: 'ANASS', groupe: 'C', tel: '0669001099', adresse: '', code_panique: 'DP1400', poste: 'z6A', cin: '434690', date_naissance: '1984-02-26', matricule: 'S09153C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z2C', nom: 'GRINEH', prenom: 'KHALID', groupe: 'C', tel: '', adresse: '', code_panique: 'DP1400', poste: 'Z2A', cin: '670880', date_naissance: '1976-09-29', matricule: 'S09176C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z5C', nom: 'MULouANI', prenom: 'MUSTAPHA', groupe: 'C', tel: '0661970781', adresse: '', code_panique: 'DP1400', poste: 'Z5', cin: 'AB96201', date_naissance: '1969-11-18', matricule: 'S09165C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O1aC', nom: 'JAOUAD', prenom: 'ELKERRAOUI', groupe: 'C', tel: '', adresse: '', code_panique: '913', poste: 'O1a', cin: 'A471219', date_naissance: '1973-10-21', matricule: 'S09184C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O1bC', nom: 'AZIZ', prenom: 'CHOUKAIRI', groupe: 'C', tel: '0637014737', adresse: '', code_panique: '228', poste: 'O1b', cin: '', date_naissance: '1966-04-22', matricule: 'S09196C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O3C', nom: 'YOUNESS', prenom: 'MAKAN', groupe: 'C', tel: '0624125461', adresse: '', code_panique: '511', poste: 'O3A', cin: '0704268', date_naissance: '1977-07-03', matricule: 'S09262C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O4C', nom: 'BRAHIM', prenom: 'HMIJAN', groupe: 'C', tel: '0678490326', adresse: '', code_panique: '313', poste: 'O4', cin: '', date_naissance: '1985-04-18', matricule: 'S09214C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O5C', nom: 'YOUSSEF', prenom: 'ATTOUMI', groupe: 'C', tel: '0676800556', adresse: '', code_panique: '848', poste: 'O5', cin: 'QA28049', date_naissance: '1970-03-20', matricule: 'S09263C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O8C', nom: 'TOUFIQ', prenom: 'TAOUFIKI', groupe: 'C', tel: '0656935477', adresse: '', code_panique: '824', poste: 'O8', cin: 'BE584375', date_naissance: '1971-08-01', matricule: 'S09249C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O9C', nom: 'MOHAMED', prenom: 'ELYOUSSFI', groupe: 'C', tel: '06666624637', adresse: '', code_panique: '813', poste: 'O9', cin: 'D148238', date_naissance: '1985-02-05', matricule: 'S09217C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O10C', nom: 'MOHAMED', prenom: 'KHTIDAK', groupe: 'C', tel: '0661564216', adresse: '', code_panique: '911', poste: 'O10', cin: 'A315369', date_naissance: '1966-09-14', matricule: 'S09270C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O11C', nom: 'MUSTAPHA', prenom: 'ARIBATE', groupe: 'C', tel: '0660413159', adresse: '', code_panique: '326', poste: 'O11A', cin: '755764', date_naissance: '1973-12-21', matricule: 'S09178C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O13C', nom: 'HAMID', prenom: 'SAIB', groupe: 'C', tel: '0642234491', adresse: '', code_panique: '826', poste: 'O13', cin: 'AB812110', date_naissance: '1984-06-30', matricule: 'S09168C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O14C', nom: 'RACHID', prenom: 'ALOUI', groupe: 'C', tel: '0675660099', adresse: '', code_panique: '838', poste: 'O14A', cin: 'AB192453', date_naissance: '1972-06-30', matricule: 'S09252C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O15C', nom: 'YOUSSEF', prenom: 'ZOURAKI', groupe: 'C', tel: '0663868378', adresse: '', code_panique: '113', poste: 'O15A', cin: 'A441336', date_naissance: '1992-03-12', matricule: 'S09171C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O16C', nom: 'ENNABAL', prenom: 'AZOUZ', groupe: 'C', tel: '0698853826', adresse: '', code_panique: '827', poste: 'O16A', cin: '566483', date_naissance: '1967-01-04', matricule: 'S09291C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L2C', nom: 'ELHILALI', prenom: 'AKRAM', groupe: 'C', tel: '0662665394', adresse: '', code_panique: '126', poste: 'L 2A', cin: '427172', date_naissance: '1976-01-26', matricule: 'S12073C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L4C', nom: 'RACHID', prenom: 'MAGHAT', groupe: 'C', tel: '', adresse: '', code_panique: '842', poste: 'L4', cin: '', date_naissance: '', matricule: '', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L5C', nom: 'ABDERRAHIL', prenom: 'FAKUHI', groupe: 'C', tel: '0662665394', adresse: '', code_panique: '126', poste: 'L 2A', cin: '427172', date_naissance: '1976-01-26', matricule: 'S12073C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L6C', nom: 'RACHID', prenom: 'NOUR', groupe: 'C', tel: '0662665394', adresse: '', code_panique: '126', poste: 'L 2A', cin: '427172', date_naissance: '1976-01-26', matricule: 'S12073C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L7C', nom: 'MOHAMED', prenom: 'NAZIR', groupe: 'C', tel: '0662665394', adresse: '', code_panique: '126', poste: 'L 2A', cin: '427172', date_naissance: '1976-01-26', matricule: 'S12073C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L8C', nom: 'HASSAN', prenom: 'ASSLOUH', groupe: 'C', tel: '0662665394', adresse: '', code_panique: '126', poste: 'L 2A', cin: '427172', date_naissance: '1976-01-26', matricule: 'S12073C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L9C', nom: 'IKHLOUFEN', prenom: 'MOUNIR', groupe: 'C', tel: '0762695160', adresse: '', code_panique: '914', poste: 'L9A', cin: 'E234817', date_naissance: '1996-06-17', matricule: 'S12075C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L10C', nom: 'DRISS', prenom: 'BENGHANMI', groupe: 'C', tel: '0660201164', adresse: '', code_panique: '926', poste: 'L10', cin: 'AB532578', date_naissance: '1986-01-01', matricule: 'S12131C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L11C', nom: 'LARBI', prenom: 'LKWISSI', groupe: 'C', tel: '0662382842', adresse: '', code_panique: '125', poste: 'L11', cin: 'MC13001', date_naissance: '1980-07-03', matricule: 'S09233C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L13C', nom: 'ABDELLAH', prenom: 'TABTI', groupe: 'C', tel: '0663229985', adresse: '', code_panique: '118', poste: 'L13', cin: 'AD56680', date_naissance: '1979-01-01', matricule: 'S09194C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L14C', nom: 'ABDEMOUNIM', prenom: 'MNAM', groupe: 'C', tel: '0664914374', adresse: '', code_panique: '858', poste: 'L14A', cin: '727413', date_naissance: '1977-11-04', matricule: 'S09203C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L15C', nom: 'TOUFIK', prenom: 'ALHAFID', groupe: 'C', tel: '0662888444', adresse: '', code_panique: '999', poste: 'L15A', cin: 'B197016', date_naissance: '1975-02-04', matricule: 'S09260C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L16C', nom: 'AZIZ', prenom: 'ELALOUSSI', groupe: 'C', tel: '0661098728', adresse: '', code_panique: '328', poste: 'L16', cin: 'Z428454', date_naissance: '', matricule: '', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L20C', nom: 'FARASSI', prenom: 'KARIM', groupe: 'C', tel: '0635419761', adresse: '', code_panique: '922', poste: 'L 20', cin: '', date_naissance: '', matricule: '', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L18C', nom: 'ABDELAZIZ', prenom: 'SAKANI', groupe: 'C', tel: '0662509676', adresse: '', code_panique: '826', poste: 'L18', cin: 'A203082', date_naissance: '1961-03-10', matricule: 'RETRAITE', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },

        // Groupe D - TOUS ACTIFS
        { code: 'CPD', nom: 'mouhcine', prenom: 'YAGOUB', groupe: 'D', tel: '0660336995', adresse: '', code_panique: '854', poste: 'CPA', cin: '0408930', date_naissance: '1966-05-17', matricule: 'S09272C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'COND', nom: 'HOUSSAIN', prenom: 'ALAHYANE', groupe: 'D', tel: '0668191854', adresse: '', code_panique: 'DP1400', poste: 'CON', cin: 'JB49050', date_naissance: '1966-01-01', matricule: 'S09280C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'MOTD', nom: 'LAHCEN', prenom: 'ALAMI', groupe: 'D', tel: '0666195501', adresse: '', code_panique: 'DP1400', poste: 'MOT', cin: 'UA97962', date_naissance: '1967-06-24', matricule: 'S09277C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'ZD', nom: 'MOULZY', prenom: 'mehdi', groupe: 'D', tel: '0665233677', adresse: '', code_panique: '815', poste: 'Z', cin: 'AB47887', date_naissance: '1968-01-15', matricule: 'S09268C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z2D', nom: 'MUSTAPHA', prenom: 'BOUTSON', groupe: 'D', tel: '', adresse: '', code_panique: 'DP1400', poste: 'Z2A', cin: '692457', date_naissance: '1980-02-14', matricule: 'S09290C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z5D', nom: 'AYOUB', prenom: 'MAHDAD', groupe: 'D', tel: '0682153784', adresse: '', code_panique: 'DP1400', poste: 'Z5', cin: 'AD210108', date_naissance: '1990-03-23', matricule: 'S11995C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z6D', nom: 'ABDELHAQ', prenom: 'ZEROUAL', groupe: 'D', tel: '0605119496', adresse: '', code_panique: 'DP1400', poste: 'z6', cin: 'I495670', date_naissance: '1979-08-13', matricule: 'S09205C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O1aD', nom: 'IMAD', prenom: 'BEN KHADRA', groupe: 'D', tel: '0682153784', adresse: '', code_panique: '913', poste: 'O1a', cin: 'AB624802', date_naissance: '1987-02-12', matricule: 'S12674C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O1bD', nom: 'KHLIFI', prenom: 'HADARBACH', groupe: 'D', tel: '0670059528', adresse: '', code_panique: '228', poste: 'O1b', cin: 'UA95212', date_naissance: '1968-04-22', matricule: 'S09190C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O3D', nom: 'YAHYA', prenom: 'ABARKAN', groupe: 'D', tel: '0650651681', adresse: '', code_panique: '511', poste: 'O3A', cin: '632213', date_naissance: '1976-12-15', matricule: 'S09261C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'NO4D', nom: 'MOHAMED', prenom: 'KABDANI', groupe: 'D', tel: '0611658102', adresse: '', code_panique: '313', poste: 'O4A', cin: '427567', date_naissance: '1976-03-28', matricule: 'S09240C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O8D', nom: 'LAHCEN', prenom: 'EL KABOURI', groupe: 'D', tel: '0663754454', adresse: '', code_panique: '824', poste: 'O8A', cin: '0365454', date_naissance: '1979-07-14', matricule: 'S09230C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O9D', nom: 'HAKIM', prenom: 'HADDIR', groupe: 'D', tel: '0677522349', adresse: '', code_panique: '813', poste: 'O9', cin: 'D217181', date_naissance: '1990-06-23', matricule: 'S09158C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O10D', nom: 'ADIL', prenom: 'LOURIGHI', groupe: 'D', tel: '0652869687', adresse: '', code_panique: '911', poste: 'O10', cin: 'A742130', date_naissance: '1994-02-19', matricule: 'S12133C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O11D', nom: 'TOUFIK', prenom: 'HAJJI', groupe: 'D', tel: '0660024350', adresse: '', code_panique: '326', poste: 'O11A', cin: '679901', date_naissance: '1983-08-15', matricule: 'S09258C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O12D', nom: 'HASSAN', prenom: 'TOUNSSI', groupe: 'D', tel: '0668928626', adresse: '', code_panique: '855', poste: 'O12A', cin: '194910', date_naissance: '1962-07-01', matricule: 'S09223C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O13D', nom: 'HASSAN', prenom: 'CHAMI', groupe: 'D', tel: '0622564794', adresse: '', code_panique: '826', poste: 'O13', cin: '', date_naissance: '1966-01-01', matricule: 'S09215C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O14D', nom: 'MUSTAPHA', prenom: 'OUGHIL', groupe: 'D', tel: '0677651378', adresse: '', code_panique: '838', poste: 'O14', cin: 'D523912', date_naissance: '1979-02-12', matricule: 'S09248C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O15D', nom: 'ABDERAHIM', prenom: 'MACHHAB', groupe: 'D', tel: '0668272975', adresse: '', code_panique: '113', poste: 'O15', cin: 'E505332', date_naissance: '1974-07-03', matricule: 'S09164C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'O16D', nom: 'BOULDGAG', prenom: 'D', groupe: 'D', tel: '0670357654', adresse: '', code_panique: '827', poste: 'O16', cin: 'D388632', date_naissance: '1968-01-01', matricule: 'S09191C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L2D', nom: 'MOLAY AHMED', prenom: 'HANSALI', groupe: 'D', tel: '', adresse: '', code_panique: '126', poste: 'L 2', cin: 'I196324', date_naissance: '1967-10-01', matricule: 'S12671C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L4D', nom: 'ABDELJALIL', prenom: 'ERRAISSY', groupe: 'D', tel: '', adresse: '', code_panique: '842', poste: 'L4', cin: 'JC337475', date_naissance: '', matricule: 'S13885C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L5D', nom: 'MOHMED', prenom: 'EL AISSAOUI', groupe: 'D', tel: '0666904691', adresse: '', code_panique: '913', poste: 'L5', cin: 'AB26585', date_naissance: '1962-06-30', matricule: 'S09238C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L6D', nom: 'MAJID', prenom: 'SIYADI', groupe: 'D', tel: '0664619176', adresse: '', code_panique: '841', poste: 'L6', cin: 'BK11512', date_naissance: '1962-08-06', matricule: 'S09201C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L7D', nom: 'HASSAN', prenom: 'AIT BOURI', groupe: 'D', tel: '0641103141', adresse: '', code_panique: '327', poste: 'L7A', cin: '406039', date_naissance: '1966-02-11', matricule: 'S09219C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L9D', nom: 'KARIM', prenom: 'MEROURI', groupe: 'D', tel: '0639284992', adresse: '', code_panique: '914', poste: 'L9', cin: 'AB11225', date_naissance: '', matricule: 'S15251C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L10D', nom: 'MOHAMED', prenom: 'DAHANI', groupe: 'D', tel: '0608246402', adresse: '', code_panique: '926', poste: 'L10A', cin: '756477', date_naissance: '1974-03-07', matricule: 'S09237C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L11D', nom: 'MOHAMED', prenom: 'LACHGAR', groupe: 'D', tel: '0662721021', adresse: '', code_panique: '125', poste: 'L11A', cin: 'AB122686', date_naissance: '1968-03-17', matricule: 'S09189C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L13D', nom: 'HICHAM', prenom: 'EL HILALI', groupe: 'D', tel: '0649835024', adresse: '', code_panique: '118', poste: 'L13', cin: 'AD35116', date_naissance: '1973-02-02', matricule: 'S09224C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L14D', nom: 'MOHAMED', prenom: 'ELHARBI', groupe: 'D', tel: '0613535275', adresse: '', code_panique: '858', poste: 'L14A', cin: 'AB208044', date_naissance: '1978-08-05', matricule: 'S09245C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L15D', nom: 'JALAL', prenom: 'DAHBI', groupe: 'D', tel: '0672792404', adresse: '', code_panique: '999', poste: 'L15A', cin: '768009', date_naissance: '1976-12-05', matricule: 'S09226C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L16D', nom: 'RACHID', prenom: 'JABAL', groupe: 'D', tel: '0628612647', adresse: '', code_panique: '328', poste: 'L16A', cin: '786241', date_naissance: '1979-08-01', matricule: 'S09255C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L18D', nom: 'MOHAMED', prenom: 'GUARMA', groupe: 'D', tel: '0699082100', adresse: '', code_panique: '826', poste: 'L18', cin: 'AD200164', date_naissance: '1987-02-20', matricule: 'S12074C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'L20D', nom: 'BRAHIM', prenom: 'SATANI', groupe: 'D', tel: '0660082965', adresse: '', code_panique: '922', poste: 'L 20', cin: '', date_naissance: '', matricule: '', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },

        // Groupe E - TOUS ACTIFS
        { code: 'ACCA', nom: 'CHAJAI', prenom: 'SOUKAINA', groupe: 'E', tel: '', adresse: '', code_panique: 'non', poste: 'D.U.E', cin: '', date_naissance: '', matricule: '', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'ACCB', nom: 'MAAROUF', prenom: 'NAJAT', groupe: 'E', tel: '', adresse: '', code_panique: 'non', poste: 'D.U.E', cin: 'AD223954', date_naissance: '1991-12-06', matricule: 'S10100C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z1A', nom: 'FARROUCHE', prenom: 'MILOUD', groupe: 'E', tel: '', adresse: '', code_panique: 'dp1400', poste: 'D.U.E', cin: 'AA31133', date_naissance: '1987-11-05', matricule: 'S09286C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z1B', nom: 'KHIAR', prenom: 'NOUREDDINE', groupe: 'E', tel: '', adresse: '', code_panique: 'dp1401', poste: 'D.U.E', cin: 'h705007', date_naissance: '1991-09-09', matricule: 'S12664C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z4A', nom: 'ECHALLI', prenom: 'KASSEM', groupe: 'E', tel: '', adresse: '', code_panique: 'dp1402', poste: 'D.U.E', cin: 'A724455', date_naissance: '1985-08-01', matricule: 'S12665C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z4B', nom: 'OUHADI', prenom: 'LAHCEN', groupe: 'E', tel: '', adresse: '', code_panique: 'dp1403', poste: 'D.U.E', cin: 'U99650', date_naissance: '1973-08-12', matricule: 'S09992C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z4C', nom: 'ELFAKHAR', prenom: 'MOHAMED', groupe: 'E', tel: '', adresse: '', code_panique: 'dp1404', poste: 'D.U.E', cin: 'A737428', date_naissance: '1983-07-03', matricule: 'S09285C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'Z4D', nom: 'TAOUIL', prenom: 'KHALID', groupe: 'E', tel: '', adresse: '', code_panique: 'dp1405', poste: 'D.U.E', cin: 'AD154017', date_naissance: '1988-03-09', matricule: 'S10666C', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'PR', nom: 'OUNASSE', prenom: 'NAWFAL', groupe: 'E', tel: '', adresse: 'C.T.R', code_panique: '', poste: '', cin: '', date_naissance: '', matricule: '', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' }
    ];
    generateYearlyHolidays();
    saveData();
}

// --- INTERFACE ---
function showSnackbar(msg) {
    const snackbar = document.getElementById('snackbar');
    if (snackbar) {
        snackbar.textContent = msg;
        snackbar.style.display = 'block';
        setTimeout(() => { snackbar.style.display = 'none'; }, 3000);
    } else alert(msg);
}

function openPopup(title, body, footer) {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('popup-content');
    if (!overlay || !content) return;
    content.innerHTML = '<div class="popup-header"><h2>' + title + '</h2><button class="popup-close-btn" onclick="closePopup()">&times;</button></div><div class="popup-body">' + body + '</div><div class="popup-footer">' + footer + '</div>';
    overlay.classList.add('visible');
}

function closePopup() {
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('visible');
}

function getMonthName(month) {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[month - 1] || '';
}

// --- VÉRIFICATION MOT DE PASSE ---
function checkPassword() {
    const pwd = prompt("🔐 Mot de passe requis :");
    return pwd === ADMIN_PASSWORD;
}

// --- JOURS FÉRIÉS (prise en compte récurrence annuelle) ---
function isHolidayDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    
    return holidays.some(function(holiday) {
        if (holiday.date === dateStr) return true;
        if (holiday.recurring) {
            const parts = holiday.date.split('-');
            const hMonth = parseInt(parts[1], 10);
            const hDay = parseInt(parts[2], 10);
            if (hMonth === month && hDay === day) return true;
        }
        return false;
    });
}

// --- NUMÉRO DE SEMAINE ISO ---
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

// --- SHIFT THÉORIQUE ---
function calculateTheoreticalShift(agentCode, dateStr) {
    const agent = agents.find(function(a) { return a.code === agentCode; });
    if (!agent || agent.statut !== 'actif') return '-';

    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month - 1, day);
    const group = agent.groupe;

    if (group === 'E') {
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) return 'R';
        const agentsE = agents.filter(function(a) { return a.groupe === 'E' && a.statut === 'actif'; }).sort(function(a,b) { return a.code.localeCompare(b.code); });
        const indexAgent = agentsE.findIndex(function(a) { return a.code === agentCode; });
        if (indexAgent === -1) return 'R';
        const weekNumber = getWeekNumber(date);
        const isOddWeek = weekNumber % 2 !== 0;
        const isEvenWeekday = dayOfWeek % 2 === 0;
        if (indexAgent === 0) {
            return isOddWeek ? (isEvenWeekday ? '1' : '2') : (isEvenWeekday ? '2' : '1');
        }
        if (indexAgent === 1) {
            return isOddWeek ? (isEvenWeekday ? '2' : '1') : (isEvenWeekday ? '1' : '2');
        }
        return ((indexAgent + weekNumber) % 2 === 0) ? '1' : '2';
    }

    const entryParts = agent.date_entree.split('-');
    const entryYear = parseInt(entryParts[0], 10);
    const entryMonth = parseInt(entryParts[1], 10);
    const entryDay = parseInt(entryParts[2], 10);
    const dateEntree = new Date(entryYear, entryMonth - 1, entryDay);
    const daysSinceStart = Math.floor((date - dateEntree) / (1000 * 60 * 60 * 24));
    const groupOffset = { 'A': 0, 'B': 2, 'C': 4, 'D': 6 }[group] || 0;
    const cycleDay = (daysSinceStart + groupOffset) % 8;
    const cycle = ['1', '1', '2', '2', '3', '3', 'R', 'R'];
    return cycle[cycleDay];
}

function getTheoreticalShift(agentCode, dateStr) {
    return calculateTheoreticalShift(agentCode, dateStr);
}

function getShiftForAgent(agentCode, dateStr) {
    const monthKey = dateStr.substring(0, 7);
    if (planningData[monthKey] && planningData[monthKey][agentCode] && planningData[monthKey][agentCode][dateStr]) {
        return planningData[monthKey][agentCode][dateStr].shift;
    }
    return calculateTheoreticalShift(agentCode, dateStr);
}

// --- CALCUL DES JOURS TRAVAILLÉS ---
function calculateWorkedDays(agentCode, month, year) {
    const daysInMonth = new Date(year, month, 0).getDate();
    let workedDays = 0;
    let holidayWorkedDays = 0;
    let leaveDays = 0;
    let sundayLeaves = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        const realShift = getShiftForAgent(agentCode, dateStr);
        const theoreticalShift = getTheoreticalShift(agentCode, dateStr);
        const isSunday = date.getDay() === 0;
        const isHoliday = isHolidayDate(date);
        
        if (realShift === '1' || realShift === '2' || realShift === '3') {
            workedDays++;
        }
        
        if (realShift === 'C' || realShift === 'M' || realShift === 'A') {
            leaveDays++;
            if (isSunday) sundayLeaves++;
        }
        
        if (isHoliday && (theoreticalShift === '1' || theoreticalShift === '2' || theoreticalShift === '3') &&
            realShift !== 'C' && realShift !== 'M' && realShift !== 'A') {
            holidayWorkedDays++;
        }
    }
    const totalDays = workedDays + holidayWorkedDays;
    return { workedDays: workedDays, totalDays: totalDays, leaveDays: leaveDays, holidayWorkedDays: holidayWorkedDays, sundayLeaves: sundayLeaves };
}

// ==================== MENU PRINCIPAL ====================
function displayMainMenu() {
    const mainContent = document.getElementById('main-content');
    const subTitle = document.getElementById('sub-title');
    if (!mainContent) return;
    if (subTitle) subTitle.textContent = "Menu Principal";
    mainContent.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'menu-button-container';
    const menus = [
        { text: "👥 GESTION DES AGENTS", handler: function() { displayAgentsMenu(); } },
        { text: "📅 GESTION DU PLANNING", handler: function() { displayPlanningMenu(); } },
        { text: "📊 STATISTIQUES", handler: function() { displayStatsMenu(); } },
        { text: "🏖️ CONGÉS & ABSENCES", handler: function() { displayLeavesMenu(); } },
        { text: "🚨 CODES PANIQUE", handler: function() { displayPanicMenu(); } },
        { text: "📻 GESTION RADIOS", handler: function() { displayRadiosMenu(); } },
        { text: "👔 HABILLEMENT", handler: function() { displayUniformMenu(); } },
        { text: "⚠️ AVERTISSEMENTS", handler: function() { displayWarningsMenu(); } },
        { text: "🎉 JOURS FÉRIÉS", handler: function() { displayHolidaysMenu(); } },
        { text: "💾 EXPORTATIONS", handler: function() { displayExportMenu(); } },
        { text: "⚙️ CONFIGURATION", handler: function() { displayConfigMenu(); } },
        { text: "🚪 QUITTER", handler: function() { if(confirm("Quitter ?")) saveData(); }, className: "quit-button" }
    ];
    for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];
        const btn = document.createElement('button');
        btn.textContent = menu.text;
        btn.className = 'menu-button' + (menu.className ? ' ' + menu.className : '');
        btn.onclick = menu.handler;
        container.appendChild(btn);
    }
    mainContent.appendChild(container);
}

function displaySubMenu(title, options) {
    const mainContent = document.getElementById('main-content');
    const subTitle = document.getElementById('sub-title');
    if (!mainContent) return;
    if (subTitle) subTitle.textContent = title;
    mainContent.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'menu-button-container';
    for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        const btn = document.createElement('button');
        btn.textContent = opt.text;
        btn.className = 'menu-button' + (opt.className ? ' ' + opt.className : '');
        btn.onclick = opt.handler;
        container.appendChild(btn);
    }
    mainContent.appendChild(container);
}

// ==================== GESTION DES AGENTS ====================
function displayAgentsMenu() {
    displaySubMenu("GESTION DES AGENTS", [
        { text: "📋 Liste des Agents", handler: function() { showAgentsList(); } },
        { text: "➕ Ajouter un Agent", handler: function() { showAddAgentForm(); } },
        { text: "✏️ Modifier un Agent", handler: function() { showEditAgentList(); } },
        { text: "🗑️ Supprimer un Agent", handler: function() { showDeleteAgentList(); } },
        { text: "📁 Importer data.js (CleanCo)", handler: function() { showImportDataJSForm(); } },
        { text: "📤 Exporter Agents", handler: function() { exportAgentsCSV(); } },
        { text: "↩️ Retour", handler: function() { displayMainMenu(); }, className: "back-button" }
    ]);
}

function showAgentsList() {
    const html = '<div class="info-section"><input type="text" id="searchAgent" placeholder="Rechercher..." class="form-input" style="margin-bottom:15px;" onkeyup="filterAgentsList()"><div id="agentsListContainer">' + generateAgentsTable(agents) + '</div></div>';
    openPopup("Liste des Agents", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function generateAgentsTable(agentsList) {
    if (!agentsList.length) return '<p>Aucun agent</p>';
    let html = '<table class="classement-table"><thead><tr><th>Code</th><th>Nom</th><th>Groupe</th><th>Statut</th><th>Actions</th></tr></thead><tbody>';
    for (let i = 0; i < agentsList.length; i++) {
        const a = agentsList[i];
        html += '<tr>' +
            '<td><strong>' + a.code + '</strong></td>' +
            '<td>' + a.nom + ' ' + a.prenom + '</td>' +
            '<td>' + a.groupe + '</td>' +
            '<td><span class="status-badge ' + a.statut + '">' + a.statut + '</span></td>' +
            '<td><button class="action-btn small blue" onclick="showEditAgentForm(\'' + a.code + '\')">✏️</button><button class="action-btn small red" onclick="deleteAgent(\'' + a.code + '\')">🗑️</button></td>' +
        '</tr>';
    }
    html += '</tbody></table>';
    return html;
}

function filterAgentsList() {
    const searchInput = document.getElementById('searchAgent');
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    const filtered = agents.filter(function(a) { return a.nom.toLowerCase().includes(search) || a.code.toLowerCase().includes(search); });
    const container = document.getElementById('agentsListContainer');
    if (container) container.innerHTML = generateAgentsTable(filtered);
}

function showAddAgentForm() {
    const html = '<div class="info-section"><form id="addAgentForm"><div class="form-group"><label>Code *</label><input type="text" id="newCode" required></div><div class="form-group"><label>Nom *</label><input type="text" id="newNom" required></div><div class="form-group"><label>Prénom *</label><input type="text" id="newPrenom" required></div><div class="form-group"><label>Groupe *</label><select id="newGroupe"><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option></select></div><div class="form-group"><label>Téléphone</label><input type="text" id="newTel"></div><div class="form-group"><label>Poste</label><input type="text" id="newPoste"></div><div class="form-group"><label>Date d\'entrée</label><input type="date" id="newDateEntree" value="2025-11-01"></div></form></div>';
    openPopup("Ajouter un Agent", html, '<button class="popup-button green" onclick="addAgent()">Enregistrer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function addAgent() {
    const code = document.getElementById('newCode').value.toUpperCase();
    if (agents.find(function(a) { return a.code === code; })) { showSnackbar("Code déjà existant"); return; }
    agents.push({ code: code, nom: document.getElementById('newNom').value, prenom: document.getElementById('newPrenom').value, groupe: document.getElementById('newGroupe').value, tel: document.getElementById('newTel').value, poste: document.getElementById('newPoste').value, statut: 'actif', date_entree: document.getElementById('newDateEntree').value || '2025-11-01' });
    saveData();
    showSnackbar("Agent ajouté");
    closePopup();
    showAgentsList();
}

function showEditAgentList() { 
    openPopup("Modifier un Agent", '<div class="info-section">' + generateAgentsTable(agents) + '</div>', '<button class="popup-button gray" onclick="closePopup()">Fermer</button>'); 
}

function showEditAgentForm(code) {
    const agent = agents.find(function(a) { return a.code === code; });
    if (!agent) return;
    const html = '<div class="info-section"><form id="editAgentForm"><div class="form-group"><label>Code</label><input type="text" value="' + agent.code + '" disabled></div><div class="form-group"><label>Nom</label><input type="text" id="editNom" value="' + agent.nom + '"></div><div class="form-group"><label>Prénom</label><input type="text" id="editPrenom" value="' + agent.prenom + '"></div><div class="form-group"><label>Groupe</label><select id="editGroupe"><option ' + (agent.groupe==='A'?'selected':'') + '>A</option><option ' + (agent.groupe==='B'?'selected':'') + '>B</option><option ' + (agent.groupe==='C'?'selected':'') + '>C</option><option ' + (agent.groupe==='D'?'selected':'') + '>D</option><option ' + (agent.groupe==='E'?'selected':'') + '>E</option></select></div><div class="form-group"><label>Téléphone</label><input type="text" id="editTel" value="' + (agent.tel||'') + '"></div><div class="form-group"><label>Poste</label><input type="text" id="editPoste" value="' + (agent.poste||'') + '"></div><div class="form-group"><label>Date d\'entrée</label><input type="date" id="editDateEntree" value="' + (agent.date_entree||'2025-11-01') + '"></div></form></div>';
    openPopup("Modifier " + code, html, '<button class="popup-button green" onclick="updateAgent(\'' + code + '\')">Enregistrer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function updateAgent(code) {
    const idx = agents.findIndex(function(a) { return a.code === code; });
    if (idx !== -1) {
        agents[idx].nom = document.getElementById('editNom').value;
        agents[idx].prenom = document.getElementById('editPrenom').value;
        agents[idx].groupe = document.getElementById('editGroupe').value;
        agents[idx].tel = document.getElementById('editTel').value;
        agents[idx].poste = document.getElementById('editPoste').value;
        agents[idx].date_entree = document.getElementById('editDateEntree').value;
        saveData();
        showSnackbar("Agent modifié");
        closePopup();
        showAgentsList();
    }
}

function showDeleteAgentList() {
    const active = agents.filter(function(a) { return a.statut === 'actif'; });
    openPopup("Supprimer un Agent", '<div class="info-section">' + generateAgentsTable(active) + '</div>', '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function deleteAgent(code) {
    if (confirm("Supprimer cet agent ?")) {
        const idx = agents.findIndex(function(a) { return a.code === code; });
        if (idx !== -1) {
            agents[idx].statut = 'inactif';
            saveData();
            showSnackbar("Agent marqué inactif");
            showAgentsList();
        }
    }
}

// --- IMPORT DATA.JS ---
function showImportDataJSForm() {
    if (!checkPassword()) { showSnackbar("Mot de passe incorrect"); return; }
    const html = '<div class="info-section"><h3>📁 Importer agents depuis data.js</h3><p>Sélectionnez votre fichier <strong>data.js</strong>.</p>' +
    '<div class="form-group"><label>Fichier data.js</label><input type="file" id="dataJsFile" accept=".js" class="form-input"></div>' +
    '<div class="form-group"><label>Option d\'import</label><select id="importDataJsOption"><option value="replace">Remplacer tous les agents</option><option value="merge">Fusionner (mettre à jour si code existe)</option><option value="add">Ajouter (codes en doublon seront ignorés)</option></select></div>' +
    '<div id="dataJsPreview" style="display:none"><h4>Aperçu</h4><div id="dataJsPreviewTable"></div></div></div>';
    openPopup("Importer data.js", html, '<button class="popup-button green" onclick="processDataJsImport()">Importer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
    const fileInput = document.getElementById('dataJsFile');
    if (fileInput) fileInput.addEventListener('change', previewDataJsFile);
}

function previewDataJsFile() {
    const file = document.getElementById('dataJsFile').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        let arrayStr = null;
        const agentsMatch = content.match(/const\s+agents\s*=\s*(\[[\s\S]*?\]);/);
        if (agentsMatch) arrayStr = agentsMatch[1];
        else {
            const altMatch = content.match(/agents\s*=\s*(\[[\s\S]*?\]);/);
            if (altMatch) arrayStr = altMatch[1];
        }
        if (!arrayStr) {
            document.getElementById('dataJsPreviewTable').innerHTML = '<p style="color:red">Fichier invalide : agents non trouvé</p>';
            document.getElementById('dataJsPreview').style.display = 'block';
            return;
        }
        arrayStr = arrayStr.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        try {
            const agentsArray = eval('(' + arrayStr + ')');
            const preview = agentsArray.slice(0, 5);
            let html = '<table class="classement-table"><thead><tr><th>Code</th><th>Nom</th><th>Prénom</th><th>Groupe</th></tr></thead><tbody>';
            for (let i = 0; i < preview.length; i++) {
                const a = preview[i];
                html += '<tr><td>' + a.code + '</td><td>' + a.nom + '</td><td>' + a.prenom + '</td><td>' + a.groupe + '</td></tr>';
            }
            html += '</tbody></table><p>Total: ' + agentsArray.length + ' agents</p>';
            document.getElementById('dataJsPreviewTable').innerHTML = html;
            document.getElementById('dataJsPreview').style.display = 'block';
        } catch(err) {
            document.getElementById('dataJsPreviewTable').innerHTML = '<p style="color:red">Erreur lors de l\'analyse du fichier</p>';
            document.getElementById('dataJsPreview').style.display = 'block';
        }
    };
    reader.readAsText(file, 'UTF-8');
}

function processDataJsImport() {
    const file = document.getElementById('dataJsFile').files[0];
    if (!file) { showSnackbar("Veuillez sélectionner un fichier data.js"); return; }
    const option = document.getElementById('importDataJsOption').value;
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        let arrayStr = null;
        const agentsMatch = content.match(/const\s+agents\s*=\s*(\[[\s\S]*?\]);/);
        if (agentsMatch) arrayStr = agentsMatch[1];
        else {
            const altMatch = content.match(/agents\s*=\s*(\[[\s\S]*?\]);/);
            if (altMatch) arrayStr = altMatch[1];
        }
        if (!arrayStr) { showSnackbar("Fichier invalide : agents non trouvé"); return; }
        arrayStr = arrayStr.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        try {
            const importedAgents = eval('(' + arrayStr + ')');
            if (!Array.isArray(importedAgents)) { showSnackbar("Le tableau d'agents n'est pas valide"); return; }
            let added = 0, updated = 0, skipped = 0;
            if (option === 'replace') agents = [];
            for (let i = 0; i < importedAgents.length; i++) {
                const newAgent = importedAgents[i];
                if (!newAgent.code || !newAgent.nom || !newAgent.prenom || !newAgent.groupe) {
                    skipped++;
                    continue;
                }
                if (!newAgent.date_entree) newAgent.date_entree = '2025-11-01';
                if (!newAgent.statut) newAgent.statut = 'actif';
                if (!newAgent.tel) newAgent.tel = '';
                if (!newAgent.poste) newAgent.poste = '';
                
                const existingIndex = agents.findIndex(function(a) { return a.code === newAgent.code; });
                if (existingIndex !== -1) {
                    if (option === 'merge') {
                        agents[existingIndex] = Object.assign({}, agents[existingIndex], newAgent);
                        updated++;
                    } else if (option === 'add') {
                        let newCode = newAgent.code;
                        let counter = 1;
                        while (agents.find(function(a) { return a.code === newCode; })) {
                            newCode = newAgent.code + '_' + counter++;
                        }
                        newAgent.code = newCode;
                        agents.push(newAgent);
                        added++;
                    } else {
                        skipped++;
                    }
                } else {
                    agents.push(newAgent);
                    added++;
                }
            }
            saveData();
            showSnackbar("Import terminé : " + added + " ajoutés, " + updated + " mis à jour, " + skipped + " ignorés");
            closePopup();
            showAgentsList();
        } catch(err) {
            showSnackbar("Erreur lors de l'import : " + err.message);
        }
    };
    reader.readAsText(file, 'UTF-8');
}

// ==================== GESTION DU PLANNING VERTICAL ====================
function displayPlanningMenu() {
    displaySubMenu("GESTION DU PLANNING", [
        { text: "📅 Planning Mensuel", handler: function() { showMonthlyPlanning(); } },
        { text: "👤 Planning par Agent", handler: function() { showAgentPlanningSelector(); } },
        { text: "📊 Exporter Planning (Excel)", handler: function() { showExportPlanningMenu(); } },
        { text: "✏️ Modifier Shift", handler: function() { showShiftModificationForm(); } },
        { text: "🔄 Échanger Shifts", handler: function() { showShiftExchangeForm(); } },
        { text: "↩️ Retour", handler: function() { displayMainMenu(); }, className: "back-button" }
    ]);
}

function showMonthlyPlanning() {
    const today = new Date();
    let monthOptions = '';
    for (let i = 0; i < 12; i++) {
        const selected = (i+1 === today.getMonth()+1) ? 'selected' : '';
        monthOptions += '<option value="' + (i+1) + '" ' + selected + '>' + getMonthName(i+1) + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Mois</label><select id="planMonth">' + monthOptions + '</select></div>' +
    '<div class="form-group"><label>Année</label><input type="number" id="planYear" value="' + today.getFullYear() + '"></div></div>';
    openPopup("Planning Mensuel", html, '<button class="popup-button green" onclick="generatePlanningView()">Voir</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function generatePlanningView() {
    const month = parseInt(document.getElementById('planMonth').value, 10);
    const year = parseInt(document.getElementById('planYear').value, 10);
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Construction du tableau VERTICAL (chaque agent sur une ligne)
    let html = '<div class="info-section"><h3>Planning ' + getMonthName(month) + ' ' + year + '</h3><div style="overflow-x:auto"><table class="planning-table"><thead><tr><th>Agent</th>';
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month-1, d);
        const isHoliday = isHolidayDate(date);
        html += '<th class="' + (isHoliday ? 'holiday' : '') + '">' + d + '<br>' + JOURS_FRANCAIS[date.getDay()].substring(0,2) + '</th>';
    }
    html += '<th>Total</th></tr></thead><tbody>';
    
    for (let i = 0; i < activeAgents.length; i++) {
        const agent = activeAgents[i];
        const stats = calculateWorkedDays(agent.code, month, year);
        html += '<tr><td><strong>' + agent.code + '</strong><br><small>' + agent.nom + '</small></td>';
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(d).padStart(2,'0');
            const shift = getShiftForAgent(agent.code, dateStr);
            const date = new Date(year, month-1, d);
            const isHoliday = isHolidayDate(date);
            html += '<td class="shift-cell" style="background:' + SHIFT_COLORS[shift] + ';color:white" title="' + SHIFT_LABELS[shift] + (isHoliday ? ' - Férié' : '') + '" onclick="showShiftModification(\'' + agent.code + '\',\'' + dateStr + '\')">' + shift + '</td>';
        }
        html += '<td style="background:#34495e"><strong>' + stats.totalDays + ' j</strong><br><small>' + stats.workedDays + ' travaillés<br>+' + stats.holidayWorkedDays + ' fériés</small></td></tr>';
    }
    html += '</tbody></table></div><div class="info-section"><h4>Légende:</h4>';
    for (const k in SHIFT_LABELS) {
        html += '<span style="display:inline-block;margin:5px;padding:2px 8px;background:' + SHIFT_COLORS[k] + ';border-radius:12px">' + k + '=' + SHIFT_LABELS[k] + '</span>';
    }
    html += '<br><span style="background:#e74c3c">📅 Jours fériés</span><br><span style="background:#2ecc71">📊 Total = travaillés + fériés chômés</span></div></div>';
    openPopup("Planning " + getMonthName(month) + " " + year, html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function showAgentPlanningSelector() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + ' (' + a.code + ') - Groupe ' + a.groupe + '</option>';
    }
    let monthOptions = '';
    for (let i = 0; i < 12; i++) {
        monthOptions += '<option value="' + (i+1) + '">' + getMonthName(i+1) + '</option>';
    }
    const html = '<div class="info-section">' +
        '<div class="form-group"><label>🔍 Rechercher un agent</label><input type="text" id="agentSearchInput" class="form-input" placeholder="Nom, prénom ou code..." onkeyup="filterAgentForPlanning()"></div>' +
        '<div class="form-group"><label>Agent</label><select id="apAgent" size="5" style="height:auto; min-height:120px">' + agentOptions + '</select></div>' +
        '<div class="form-group"><label>Mois</label><select id="apMonth">' + monthOptions + '</select></div>' +
        '<div class="form-group"><label>Année</label><input type="number" id="apYear" value="' + new Date().getFullYear() + '"></div>' +
        '</div>';
    openPopup("Planning par Agent", html, '<button class="popup-button green" onclick="showAgentPlanningView()">Voir</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function filterAgentForPlanning() {
    const searchTerm = document.getElementById('agentSearchInput').value.toLowerCase();
    const agentSelect = document.getElementById('apAgent');
    if (!agentSelect) return;
    
    for (let i = 0; i < agentSelect.options.length; i++) {
        const option = agentSelect.options[i];
        const text = option.text.toLowerCase();
        if (searchTerm === '' || text.includes(searchTerm)) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    }
}

function showAgentPlanningView() {
    const agentSelect = document.getElementById('apAgent');
    const agentCode = agentSelect ? agentSelect.value : null;
    if (!agentCode) {
        showSnackbar("Veuillez sélectionner un agent");
        return;
    }
    const month = parseInt(document.getElementById('apMonth').value, 10);
    const year = parseInt(document.getElementById('apYear').value, 10);
    const agent = agents.find(function(a) { return a.code === agentCode; });
    if (!agent) return;
    const daysInMonth = new Date(year, month, 0).getDate();
    const stats = calculateWorkedDays(agentCode, month, year);
    
    let html = '<div class="info-section"><h3>Planning de ' + agent.nom + ' ' + agent.prenom + ' (' + agent.code + ')</h3><p><strong>Groupe:</strong> ' + agent.groupe + ' | <strong>Poste:</strong> ' + (agent.poste || 'Non spécifié') + '</p>';
    html += '<div style="background:#34495e;padding:10px;border-radius:8px;margin-bottom:15px"><strong>Statistiques du mois:</strong><br>📊 Total jours = ' + stats.totalDays + ' (' + stats.workedDays + ' travaillés + ' + stats.holidayWorkedDays + ' fériés)<br>📅 Jours fériés chômés: ' + stats.holidayWorkedDays + '<br>⚠️ Congés dimanches (non comptés): ' + stats.sundayLeaves + '<br>🚫 Congés (non comptabilisés): ' + stats.leaveDays + '</div>';
    html += '<table class="planning-table"><thead><th>Date</th><th>Jour</th><th>Shift</th><th>Description</th><th>Actions</th></thead><tbody>';
    
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month-1, d);
        const dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(d).padStart(2,'0');
        const shift = getShiftForAgent(agentCode, dateStr);
        const isHoliday = isHolidayDate(date);
        const isSunday = date.getDay() === 0;
        let extraInfo = '';
        if (isHoliday && (shift === '1' || shift === '2' || shift === '3')) extraInfo = ' 🎉 Férié travaillé';
        if ((shift === 'C' || shift === 'M' || shift === 'A') && isSunday) extraInfo = ' ⚠️ Congé dimanche (non compté)';
        html += '汽笛>' + dateStr + '汽笛<td class="' + (isSunday ? 'sunday' : '') + '">' + JOURS_FRANCAIS[date.getDay()] + (isHoliday ? ' 🎉' : '') + '汽笛<td style="background:' + SHIFT_COLORS[shift] + ';color:white;text-align:center">' + shift + '汽笛>' + SHIFT_LABELS[shift] + extraInfo + '汽笛><button class="action-btn small blue" onclick="showShiftModification(\'' + agentCode + '\',\'' + dateStr + '\')">✏️</button><button class="action-btn small red" onclick="showAddLeaveForDate(\'' + agentCode + '\',\'' + dateStr + '\')">🚫</button>汽笛';
    }
    html += '</tbody>赶趟</div>';
    openPopup("Planning " + agent.code, html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function showShiftModification(agentCode, dateStr) {
    const currentShift = getShiftForAgent(agentCode, dateStr);
    let shiftOptions = '';
    for (const k in SHIFT_LABELS) {
        shiftOptions += '<option value="' + k + '" ' + (k === currentShift ? 'selected' : '') + '>' + k + ' - ' + SHIFT_LABELS[k] + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Agent</label><input type="text" value="' + agentCode + '" readonly></div><div class="form-group"><label>Date</label><input type="text" value="' + dateStr + '" readonly></div><div class="form-group"><label>Shift actuel</label><input type="text" value="' + SHIFT_LABELS[currentShift] + ' (' + currentShift + ')" readonly></div><div class="form-group"><label>Nouveau shift</label><select id="newShiftValue">' + shiftOptions + '</select></div></div>';
    openPopup("Modifier Shift", html, '<button class="popup-button green" onclick="applyShiftModificationDirect(\'' + agentCode + '\',\'' + dateStr + '\')">Appliquer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function applyShiftModificationDirect(agentCode, dateStr) {
    const newShift = document.getElementById('newShiftValue').value;
    const monthKey = dateStr.substring(0,7);
    if (!planningData[monthKey]) planningData[monthKey] = {};
    if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
    planningData[monthKey][agentCode][dateStr] = { shift: newShift, type: 'modification', modified_at: new Date().toISOString() };
    saveData();
    showSnackbar("Shift modifié");
    closePopup();
    showAgentPlanningView();
}

function showShiftModificationForm() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + '</option>';
    }
    let shiftOptions = '';
    for (const k in SHIFT_LABELS) {
        shiftOptions += '<option value="' + k + '">' + k + ' - ' + SHIFT_LABELS[k] + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Agent</label><select id="shiftAgent">' + agentOptions + '</select></div>' +
    '<div class="form-group"><label>Date</label><input type="date" id="shiftDate" value="' + new Date().toISOString().split('T')[0] + '"></div>' +
    '<div class="form-group"><label>Nouveau shift</label><select id="newShift">' + shiftOptions + '</select></div></div>';
    openPopup("Modifier Shift", html, '<button class="popup-button green" onclick="applyShiftModification()">Appliquer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function applyShiftModification() {
    const agentCode = document.getElementById('shiftAgent').value;
    const dateStr = document.getElementById('shiftDate').value;
    const newShift = document.getElementById('newShift').value;
    const monthKey = dateStr.substring(0,7);
    if (!planningData[monthKey]) planningData[monthKey] = {};
    if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
    planningData[monthKey][agentCode][dateStr] = { shift: newShift, type: 'modification', modified_at: new Date().toISOString() };
    saveData();
    showSnackbar("Shift modifié");
    closePopup();
}

function showShiftExchangeForm() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Agent 1</label><select id="exAgent1">' + agentOptions + '</select></div>' +
    '<div class="form-group"><label>Date 1</label><input type="date" id="exDate1"></div>' +
    '<div class="form-group"><label>Agent 2</label><select id="exAgent2">' + agentOptions + '</select></div>' +
    '<div class="form-group"><label>Date 2</label><input type="date" id="exDate2"></div></div>';
    openPopup("Échanger Shifts", html, '<button class="popup-button green" onclick="executeShiftExchange()">Échanger</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function executeShiftExchange() {
    const a1 = document.getElementById('exAgent1').value, d1 = document.getElementById('exDate1').value;
    const a2 = document.getElementById('exAgent2').value, d2 = document.getElementById('exDate2').value;
    if (!d1 || !d2) { showSnackbar("Veuillez sélectionner les dates"); return; }
    const s1 = getShiftForAgent(a1, d1), s2 = getShiftForAgent(a2, d2);
    const m1 = d1.substring(0,7), m2 = d2.substring(0,7);
    if (!planningData[m1]) planningData[m1] = {};
    if (!planningData[m1][a1]) planningData[m1][a1] = {};
    planningData[m1][a1][d1] = { shift: s2, type: 'echange' };
    if (!planningData[m2]) planningData[m2] = {};
    if (!planningData[m2][a2]) planningData[m2][a2] = {};
    planningData[m2][a2][d2] = { shift: s1, type: 'echange' };
    saveData();
    showSnackbar("Échange effectué");
    closePopup();
}

function showExportPlanningMenu() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + ' (' + a.code + ')</option>';
    }
    let monthOptions = '';
    const currentMonth = new Date().getMonth() + 1;
    for (let i = 0; i < 12; i++) {
        const selected = (i+1 === currentMonth) ? 'selected' : '';
        monthOptions += '<option value="' + (i+1) + '" ' + selected + '>' + getMonthName(i+1) + '</option>';
    }
    const html = '<div class="info-section">' +
        '<h3>📊 Exporter le planning en Excel</h3>' +
        '<div class="form-group"><label>Type d\'export</label><select id="exportType"><option value="global">Planning global</option><option value="groupe">Par groupe</option><option value="agent">Par agent</option></select></div>' +
        '<div id="exportGroupDiv" style="display:none"><div class="form-group"><label>Groupe</label><select id="exportGroup"><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option></select></div></div>' +
        '<div id="exportAgentDiv" style="display:none"><div class="form-group"><label>Agent</label><select id="exportAgent">' + agentOptions + '</select></div></div>' +
        '<div class="form-group"><label>Mois</label><select id="exportMonth">' + monthOptions + '</select></div>' +
        '<div class="form-group"><label>Année</label><input type="number" id="exportYear" value="' + new Date().getFullYear() + '"></div>' +
        '</div>';
    openPopup("Exporter Planning (Excel)", html, '<button class="popup-button green" onclick="exportPlanningToExcel()">📥 Exporter</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
    const exportType = document.getElementById('exportType');
    exportType.addEventListener('change', function() {
        const val = this.value;
        const groupDiv = document.getElementById('exportGroupDiv');
        const agentDiv = document.getElementById('exportAgentDiv');
        if (groupDiv) groupDiv.style.display = val === 'groupe' ? 'block' : 'none';
        if (agentDiv) agentDiv.style.display = val === 'agent' ? 'block' : 'none';
    });
}

function exportPlanningToExcel() {
    const type = document.getElementById('exportType').value;
    const month = parseInt(document.getElementById('exportMonth').value, 10);
    const year = parseInt(document.getElementById('exportYear').value, 10);
    let agentsToExport = [];

    if (type === 'global') agentsToExport = agents.filter(function(a) { return a.statut === 'actif'; });
    else if (type === 'groupe') {
        const group = document.getElementById('exportGroup').value;
        agentsToExport = agents.filter(function(a) { return a.groupe === group && a.statut === 'actif'; });
    } else {
        const agentCode = document.getElementById('exportAgent').value;
        const agent = agents.find(function(a) { return a.code === agentCode; });
        if (agent) agentsToExport = [agent];
    }

    if (agentsToExport.length === 0) {
        showSnackbar("Aucun agent à exporter");
        return;
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    
    let html = '<html><head><meta charset="UTF-8"><title>Planning ' + getMonthName(month) + ' ' + year + '</title>' +
        '<style>table{border-collapse:collapse;} th,td{border:1px solid #000;padding:4px;text-align:center;} th{background-color:#34495e;color:white;}</style>' +
        '</head><body><h2>Planning ' + getMonthName(month) + ' ' + year + '</h2><table><thead> <tr><th>Agent</th>';
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month-1, d);
        html += '<th>' + d + '<br>' + JOURS_FRANCAIS[date.getDay()].substring(0,2) + '</th>';
    }
    html += '<th>Total</th> </tr></thead><tbody>';

    for (let i = 0; i < agentsToExport.length; i++) {
        const agent = agentsToExport[i];
        const stats = calculateWorkedDays(agent.code, month, year);
        html += '<tr><td><strong>' + agent.nom + ' ' + agent.prenom + '</strong><br><small>' + agent.code + '</small></td>';
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(d).padStart(2,'0');
            const shift = getShiftForAgent(agent.code, dateStr);
            html += '<td>' + shift + '</td>';
        }
        html += '<td><strong>' + stats.totalDays + '</strong></td></tr>';
    }
    html += '</tbody></table><p><small>Total = travaillés (1,2,3) + fériés chômés</small></p></body></html>';

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'planning_' + type + '_' + getMonthName(month) + '_' + year + '.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSnackbar("Export Excel terminé");
    closePopup();
}

// ==================== STATISTIQUES ====================
function displayStatsMenu() {
    displaySubMenu("STATISTIQUES", [
        { text: "📈 Statistiques Globales", handler: function() { showGlobalStats(); } },
        { text: "👤 Stats par Agent", handler: function() { showAgentStatsSelector(); } },
        { text: "🏆 Classement des Agents", handler: function() { showRanking(); } },
        { text: "📊 Statistiques Avancées", handler: function() { showAdvancedAgentStats(); } },
        { text: "🏆 Classement par Groupe", handler: function() { showGroupRanking(); } },
        { text: "📈 Évolution Mensuelle", handler: function() { showMonthlyEvolution(); } },
        { text: "↩️ Retour", handler: function() { displayMainMenu(); }, className: "back-button" }
    ]);
}

function showGlobalStats() {
    const active = agents.filter(function(a) { return a.statut === 'actif'; });
    const today = new Date();
    const month = today.getMonth()+1, year = today.getFullYear();
    let totalWorked=0, totalDays=0, totalLeaves=0, totalHolidayWorked=0;
    const groups = {};
    for (let i = 0; i < active.length; i++) {
        const a = active[i];
        groups[a.groupe] = (groups[a.groupe]||0)+1;
        const stats = calculateWorkedDays(a.code, month, year);
        totalWorked += stats.workedDays;
        totalDays += stats.totalDays;
        totalLeaves += stats.leaveDays;
        totalHolidayWorked += stats.holidayWorkedDays;
    }
    const avgRate = totalDays ? Math.round(totalWorked/totalDays*100) : 0;
    let groupStr = '';
    for (const g in groups) {
        groupStr += 'Groupe ' + g + ': ' + groups[g] + ' | ';
    }
    const html = '<div class="info-section"><h3>Statistiques Globales - ' + getMonthName(month) + ' ' + year + '</h3>' +
        '<p><strong>Agents actifs:</strong> ' + active.length + '</p>' +
        '<p><strong>Total jours:</strong> ' + totalDays + ' (' + totalWorked + ' travaillés + ' + totalHolidayWorked + ' fériés)</p>' +
        '<p><strong>Taux de présence:</strong> ' + avgRate + '%</p>' +
        '<p><strong>Jours fériés chômés:</strong> ' + totalHolidayWorked + '</p>' +
        '<p><strong>Congés non comptabilisés:</strong> ' + totalLeaves + '</p>' +
        '<p><strong>Répartition:</strong> ' + groupStr.slice(0, -3) + '</p>' +
        '<p><small>📌 Total = travaillés (shifts 1,2,3) + fériés chômés</small></p></div>';
    openPopup("Statistiques Globales", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function showAgentStatsSelector() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + '</option>';
    }
    const html = '<div class="info-section"><select id="statsAgent">' + agentOptions + '</select><div id="statsResult"></div></div>';
    openPopup("Statistiques Agent", html, '<button class="popup-button green" onclick="showAgentStats()">Voir</button><button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function showAgentStats() {
    const agentCode = document.getElementById('statsAgent').value;
    const agent = agents.find(function(a) { return a.code === agentCode; });
    if (!agent) return;
    const today = new Date();
    const month = today.getMonth()+1, year = today.getFullYear();
    const stats = calculateWorkedDays(agentCode, month, year);
    const html = '<div><p><strong>' + agent.nom + ' ' + agent.prenom + '</strong> (' + agent.code + ') - Groupe ' + agent.groupe + '</p>' +
        '<p><strong>Statistiques ' + getMonthName(month) + ' ' + year + ':</strong></p>' +
        '<p>📊 Total jours = ' + stats.totalDays + ' (' + stats.workedDays + ' travaillés + ' + stats.holidayWorkedDays + ' fériés)</p>' +
        '<p>📅 Jours fériés chômés: ' + stats.holidayWorkedDays + '</p>' +
        '<p>⚠️ Congés dimanches (non comptés): ' + stats.sundayLeaves + '</p>' +
        '<p>🚫 Congés (non comptabilisés): ' + stats.leaveDays + '</p>' +
        '<p>🎯 Taux de présence: ' + Math.round(stats.workedDays/stats.totalDays*100) + '%</p></div>';
    document.getElementById('statsResult').innerHTML = html;
}

function showRanking() {
    const today = new Date();
    const month = today.getMonth()+1, year = today.getFullYear();
    const ranking = [];
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        const stats = calculateWorkedDays(a.code, month, year);
        ranking.push({ agent: a, stats: stats });
    }
    ranking.sort(function(a,b) { return b.stats.totalDays - a.stats.totalDays; });
    let html = '<div class="info-section"><h3>Classement des Agents - ' + getMonthName(month) + ' ' + year + '</h3>' +
        '<p><small>Classement basé sur le total jours = travaillés + fériés chômés</small></p>' +
        '<table class="classement-table"><thead><th>Rang</th><th>Agent</th><th>Groupe</th><th>Total jours</th><th>Travaillés</th><th>Fériés</th><th>Congés</th><th>Taux</th></thead><tbody>';
    for (let i = 0; i < ranking.length; i++) {
        const r = ranking[i];
        const a = r.agent;
        const s = r.stats;
        const taux = Math.round(s.workedDays/s.totalDays*100);
        html += '<tr><td class="rank-' + (i+1) + '">' + (i+1) + '</td><td><strong>' + a.nom + ' ' + a.prenom + '</strong><br><small>' + a.code + '</small></td><td>' + a.groupe + '</td><td class="total-value">' + s.totalDays + '</td><td>' + s.workedDays + '</td><td>' + s.holidayWorkedDays + '</td><td>' + s.leaveDays + '</td><td>' + taux + '%</td></tr>';
    }
    html += '</tbody> </table></div>';
    openPopup("Classement des Agents", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function showAdvancedAgentStats() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + '</option>';
    }
    let monthOptions = '';
    const currentMonth = new Date().getMonth() + 1;
    for (let i = 0; i < 12; i++) {
        const selected = (i+1 === currentMonth) ? 'selected' : '';
        monthOptions += '<option value="' + (i+1) + '" ' + selected + '>' + getMonthName(i+1) + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Agent</label><select id="advStatsAgent">' + agentOptions + '</select></div>' +
        '<div class="form-group"><label>Mois</label><select id="advStatsMonth">' + monthOptions + '</select></div>' +
        '<div class="form-group"><label>Année</label><input type="number" id="advStatsYear" value="' + new Date().getFullYear() + '"></div>' +
        '<div id="advStatsResult"></div></div>';
    openPopup("Statistiques Avancées", html, '<button class="popup-button green" onclick="afficherStatsAvancees()">Analyser</button><button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function afficherStatsAvancees() {
    const agentCode = document.getElementById('advStatsAgent').value;
    const mois = parseInt(document.getElementById('advStatsMonth').value, 10);
    const annee = parseInt(document.getElementById('advStatsYear').value, 10);
    const stats = obtenirStatsDetailleesAgent(agentCode, mois, annee);
    if (stats.erreur) { document.getElementById('advStatsResult').innerHTML = '<p style="color:red">' + stats.erreur + '</p>'; return; }
    const ind = stats.indicateurs_avances;
    let shiftsTable = '<h4>Répartition des shifts par jour de semaine</h4><table class="classement-table"><thead><th>Jour</th><th>Matin</th><th>Après-midi</th><th>Nuit</th><th>Repos</th><th>Congé</th><th>Maladie</th><th>Autre</th></thead><tbody>';
    for (const jour in ind.shifts_par_jour) {
        const counts = ind.shifts_par_jour[jour];
        shiftsTable += '<tr><td>' + jour + '</td><td>' + counts['1'] + '</td><td>' + counts['2'] + '</td><td>' + counts['3'] + '</td><td>' + counts['R'] + '</td><td>' + counts['C'] + '</td><td>' + counts['M'] + '</td><td>' + counts['A'] + '</td></tr>';
    }
    shiftsTable += '</tbody></table>';
    const html = '<div><p><strong>' + stats.nom_complet + '</strong> (' + stats.agent + ') - Groupe ' + stats.groupe + '</p><p>Période : ' + getMonthName(mois) + ' ' + annee + '</p><hr>' +
        '<ul><li>Jours travaillés (shifts 1,2,3) : ' + ind.jours_travailles + '</li><li>Jours de repos (R) : ' + ind.jours_repos + '</li><li>Congés (C) : ' + ind.jours_conges + '</li><li>Maladie (M) : ' + ind.jours_maladie + '</li><li>Autres absences (A) : ' + ind.jours_autres + '</li><li>Jours fériés chômés : ' + ind.jours_feries_travailles + '</li><li>Total jours (travaillés + fériés) : ' + ind.total_jours + '</li><li>Taux de présence : ' + ind.taux_presence + '%</li></ul>' + shiftsTable + '<p><small>Les congés ne sont pas comptabilisés dans le total.</small></p></div>';
    document.getElementById('advStatsResult').innerHTML = html;
}

function showGroupRanking() {
    const groups = ['A','B','C','D','E'];
    let groupOptions = '';
    for (let i = 0; i < groups.length; i++) {
        groupOptions += '<option value="' + groups[i] + '">Groupe ' + groups[i] + '</option>';
    }
    let monthOptions = '';
    const currentMonth = new Date().getMonth() + 1;
    for (let i = 0; i < 12; i++) {
        const selected = (i+1 === currentMonth) ? 'selected' : '';
        monthOptions += '<option value="' + (i+1) + '" ' + selected + '>' + getMonthName(i+1) + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Groupe</label><select id="rankGroup">' + groupOptions + '</select></div>' +
        '<div class="form-group"><label>Mois</label><select id="rankMonth">' + monthOptions + '</select></div>' +
        '<div class="form-group"><label>Année</label><input type="number" id="rankYear" value="' + new Date().getFullYear() + '"></div>' +
        '<div id="rankResult"></div></div>';
    openPopup("Classement par Groupe", html, '<button class="popup-button green" onclick="afficherClassementGroupe()">Voir</button><button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function afficherClassementGroupe() {
    const groupe = document.getElementById('rankGroup').value;
    const mois = parseInt(document.getElementById('rankMonth').value, 10);
    const annee = parseInt(document.getElementById('rankYear').value, 10);
    const classement = obtenirClassementGroupe(groupe, mois, annee);
    if (classement.erreur) { document.getElementById('rankResult').innerHTML = '<p style="color:red">' + classement.erreur + '</p>'; return; }
    let table = '<h3>Classement Groupe ' + groupe + ' - ' + getMonthName(mois) + ' ' + annee + '</h3><table class="classement-table"><thead><th>Rang</th><th>Agent</th><th>CPA</th></thead><tbody>';
    for (let i = 0; i < classement.classement.length; i++) {
        const a = classement.classement[i];
        table += '<tr><td class="rank-' + a.rang + '">' + a.rang + '</td><td>' + a.nom_complet + '</td><td>' + a.cpa + '</td></tr>';
    }
    table += '</tbody></table>';
    document.getElementById('rankResult').innerHTML = table;
}

function showMonthlyEvolution() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Agent</label><select id="evolAgent">' + agentOptions + '</select></div>' +
        '<div class="form-group"><label>Nombre de mois</label><input type="number" id="evolMonths" value="6" min="1" max="12"></div>' +
        '<div id="evolResult"></div></div>';
    openPopup("Évolution Mensuelle", html, '<button class="popup-button green" onclick="afficherEvolution()">Analyser</button><button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function afficherEvolution() {
    const agentCode = document.getElementById('evolAgent').value;
    const nbMois = parseInt(document.getElementById('evolMonths').value, 10);
    const evol = obtenirEvolutionMensuelle(agentCode, nbMois);
    let table = '<h3>Évolution mensuelle de ' + agentCode + '</h3><table class="classement-table"><thead><th>Période</th><th>CPA</th></thead><tbody>';
    for (let i = 0; i < evol.evolution.length; i++) {
        const e = evol.evolution[i];
        table += '<tr><td class="periode">' + e.periode + '</td><td class="valeur">' + e.cpa + '</td></tr>';
    }
    table += '</tbody></table>';
    const tendanceColor = evol.tendance >= 0 ? '#27ae60' : '#e74c3c';
    table += '<p><strong>Tendance :</strong> <span style="color:' + tendanceColor + '">' + evol.tendance + '%</span> sur ' + nbMois + ' mois</p>';
    document.getElementById('evolResult').innerHTML = table;
}

// ==================== CONGÉS & ABSENCES ====================
function displayLeavesMenu() {
    displaySubMenu("CONGÉS & ABSENCES", [
        { text: "➕ Ajouter Congé (simple)", handler: function() { showAddLeaveForm(); } },
        { text: "📅 Ajouter Congé (période)", handler: function() { showAddPeriodLeaveForm(); } },
        { text: "🗑️ Supprimer un Congé", handler: function() { showDeleteLeaveForm(); } },
        { text: "📋 Liste des Congés", handler: function() { showLeavesList(); } },
        { text: "📅 Congés par Agent", handler: function() { showAgentLeavesSelection(); } },
        { text: "📊 Congés par Groupe", handler: function() { showGroupLeavesSelection(); } },
        { text: "↩️ Retour", handler: function() { displayMainMenu(); }, className: "back-button" }
    ]);
}

function showAddLeaveForm() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + ' (' + a.code + ') - Groupe ' + a.groupe + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Type d\'absence:</label><select id="leaveType"><option value="C">Congé payé (C)</option><option value="M">Maladie (M)</option><option value="A">Autre absence (A)</option><option value="periode">Congé sur période</option></select></div>' +
        '<div class="form-group"><label>Agent</label><select id="leaveAgent">' + agentOptions + '</select></div>' +
        '<div id="singleLeaveSection"><div class="form-group"><label>Date</label><input type="date" id="leaveDate" value="' + new Date().toISOString().split('T')[0] + '"></div></div>' +
        '<div id="periodLeaveSection" style="display:none"><div style="display:grid;grid-template-columns:1fr 1fr;gap:15px"><div class="form-group"><label>Date début</label><input type="date" id="leaveStartDate"></div><div class="form-group"><label>Date fin</label><input type="date" id="leaveEndDate"></div></div><div class="form-group"><label>Gestion des dimanches</label><select id="sundayHandling"><option value="repos">Dimanches restent en repos (R)</option><option value="conge">Dimanches comptent comme congé (C)</option></select></div></div>' +
        '<div class="form-group"><label>Commentaire</label><textarea id="leaveComment" rows="2"></textarea></div></div>';
    openPopup("Ajouter Congé/Absence", html, '<button class="popup-button green" onclick="saveLeave()">Enregistrer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
    document.getElementById('leaveType').addEventListener('change', function() {
        const type = this.value;
        const singleDiv = document.getElementById('singleLeaveSection');
        const periodDiv = document.getElementById('periodLeaveSection');
        if (singleDiv) singleDiv.style.display = type === 'periode' ? 'none' : 'block';
        if (periodDiv) periodDiv.style.display = type === 'periode' ? 'block' : 'none';
    });
}

function saveLeave() {
    const leaveType = document.getElementById('leaveType').value;
    const agentCode = document.getElementById('leaveAgent').value;
    const comment = document.getElementById('leaveComment').value;
    if (leaveType === 'periode') {
        const startDate = document.getElementById('leaveStartDate').value;
        const endDate = document.getElementById('leaveEndDate').value;
        const sundayHandling = document.getElementById('sundayHandling').value;
        if (!startDate || !endDate) { showSnackbar("Veuillez spécifier les dates"); return; }
        if (new Date(startDate) > new Date(endDate)) { showSnackbar("La date de début doit être avant la fin"); return; }
        const leaveRecord = { id: 'L'+Date.now(), agent_code: agentCode, type: 'C', start_date: startDate, end_date: endDate, sunday_handling: sundayHandling, comment: comment, created_at: new Date().toISOString(), status: 'active' };
        if (!leaves) leaves = [];
        leaves.push(leaveRecord);
        applyPeriodLeave(agentCode, startDate, endDate, sundayHandling);
        showSnackbar("Congé sur période enregistré pour " + agentCode + " du " + startDate + " au " + endDate);
    } else {
        const leaveDate = document.getElementById('leaveDate').value;
        if (!leaveDate) { showSnackbar("Veuillez spécifier une date"); return; }
        const monthKey = leaveDate.substring(0,7);
        if (!planningData[monthKey]) planningData[monthKey] = {};
        if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
        planningData[monthKey][agentCode][leaveDate] = { shift: leaveType, type: 'absence', comment: comment, recorded_at: new Date().toISOString() };
        showSnackbar("Absence (" + SHIFT_LABELS[leaveType] + ") enregistrée pour " + agentCode + " le " + leaveDate);
    }
    saveData();
    closePopup();
}

function applyPeriodLeave(agentCode, startDate, endDate, sundayHandling) {
    const start = new Date(startDate), end = new Date(endDate);
    let current = new Date(start);
    const periodId = 'L'+Date.now();
    while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        const dayOfWeek = current.getDay();
        let shiftType = 'C';
        if (dayOfWeek === 0) shiftType = sundayHandling === 'repos' ? 'R' : 'C';
        const monthKey = dateStr.substring(0,7);
        if (!planningData[monthKey]) planningData[monthKey] = {};
        if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
        planningData[monthKey][agentCode][dateStr] = { shift: shiftType, type: 'congé_periode', period_id: periodId, recorded_at: new Date().toISOString() };
        current.setDate(current.getDate() + 1);
    }
}

function showLeavesList() {
    const leavesByAgent = {};
    for (const monthKey in planningData) {
        for (const agentCode in planningData[monthKey]) {
            for (const dateStr in planningData[monthKey][agentCode]) {
                const record = planningData[monthKey][agentCode][dateStr];
                if (record && (record.shift === 'C' || record.shift === 'M' || record.shift === 'A')) {
                    if (!leavesByAgent[agentCode]) leavesByAgent[agentCode] = [];
                    leavesByAgent[agentCode].push({ date: dateStr, type: record.shift, comment: record.comment || '', recorded_at: record.recorded_at });
                }
            }
        }
    }
    if (leaves) {
        for (let i = 0; i < leaves.length; i++) {
            const leave = leaves[i];
            if (!leavesByAgent[leave.agent_code]) leavesByAgent[leave.agent_code] = [];
            leavesByAgent[leave.agent_code].push({ date: leave.start_date + " au " + leave.end_date, type: 'Période', comment: leave.comment || '', recorded_at: leave.created_at, is_period: true });
        }
    }
    let agentOptions = '<option value="all">Tous les agents</option>';
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + '</option>';
    }
    const html = '<div class="info-section"><h3>Liste des congés et absences</h3><div style="margin-bottom:15px"><select id="leavesFilter" onchange="filterLeavesList()">' + agentOptions + '</select>' +
        '<select id="leavesTypeFilter" onchange="filterLeavesList()" style="margin-left:10px"><option value="all">Tous les types</option><option value="C">Congés</option><option value="M">Maladie</option><option value="A">Autre</option><option value="Période">Périodes</option></select></div>' +
        '<div id="leavesListContainer">' + generateLeavesList(leavesByAgent) + '</div></div>';
    openPopup("Liste des Congés/Absences", html, '<button class="popup-button green" onclick="showAddLeaveForm()">➕ Ajouter</button><button class="popup-button blue" onclick="exportLeavesReport()">📊 Exporter</button><button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function generateLeavesList(leavesByAgent, filterAgent, filterType) {
    if (filterAgent === undefined) filterAgent = 'all';
    if (filterType === undefined) filterType = 'all';
    let html = '';
    for (const agentCode in leavesByAgent) {
        const agent = agents.find(function(a) { return a.code === agentCode; });
        if (!agent) continue;
        if (filterAgent !== 'all' && agentCode !== filterAgent) continue;
        const agentLeaves = leavesByAgent[agentCode].filter(function(l) {
            if (filterType === 'all') return true;
            if (filterType === 'Période') return l.is_period;
            return l.type === filterType;
        });
        if (agentLeaves.length === 0) continue;
        html += '<div style="margin-bottom:20px;padding:15px;background:#34495e;border-radius:5px"><h4>' + agent.nom + ' ' + agent.prenom + ' (' + agent.code + ')</h4><table class="classement-table"><thead><th>Date(s)</th><th>Type</th><th>Commentaire</th><th>Enregistré le</th><th>Actions</th></thead><tbody>';
        for (let i = 0; i < agentLeaves.length; i++) {
            const l = agentLeaves[i];
            html += '汽笛>' + l.date + '汽笛><span style="background:' + (SHIFT_COLORS[l.type] || '#7f8c8d') + ';color:white;padding:2px 8px;border-radius:3px">' + l.type + '</span>汽笛>' + (l.comment || '-') + '汽笛>' + new Date(l.recorded_at).toLocaleDateString() + '汽笛>';
            if (l.is_period) {
                html += '<button class="action-btn small red" onclick="deletePeriodLeave(\'' + agentCode + '\',\'' + l.date.split(' au ')[0] + '\')">🗑️</button>';
            } else {
                html += '<button class="action-btn small red" onclick="deleteSingleLeave(\'' + agentCode + '\',\'' + l.date + '\')">🗑️</button>';
            }
            html += '汽笛';
        }
        html += '</tbody>赶趟</div>';
    }
    return html || '<p>Aucun congé ou absence trouvé</p>';
}

function filterLeavesList() {
    const filterAgent = document.getElementById('leavesFilter').value;
    const filterType = document.getElementById('leavesTypeFilter').value;
    const leavesByAgent = {};
    for (const monthKey in planningData) {
        for (const agentCode in planningData[monthKey]) {
            for (const dateStr in planningData[monthKey][agentCode]) {
                const record = planningData[monthKey][agentCode][dateStr];
                if (record && (record.shift === 'C' || record.shift === 'M' || record.shift === 'A')) {
                    if (!leavesByAgent[agentCode]) leavesByAgent[agentCode] = [];
                    leavesByAgent[agentCode].push({ date: dateStr, type: record.shift, comment: record.comment || '', recorded_at: record.recorded_at });
                }
            }
        }
    }
    if (leaves) {
        for (let i = 0; i < leaves.length; i++) {
            const leave = leaves[i];
            if (!leavesByAgent[leave.agent_code]) leavesByAgent[leave.agent_code] = [];
            leavesByAgent[leave.agent_code].push({ date: leave.start_date + " au " + leave.end_date, type: 'Période', comment: leave.comment || '', recorded_at: leave.created_at, is_period: true });
        }
    }
    const container = document.getElementById('leavesListContainer');
    if (container) container.innerHTML = generateLeavesList(leavesByAgent, filterAgent, filterType);
}

function deleteSingleLeave(agentCode, dateStr) {
    if (!confirm("Supprimer l'absence de " + agentCode + " du " + dateStr + " ?")) return;
    const monthKey = dateStr.substring(0,7);
    if (planningData[monthKey] && planningData[monthKey][agentCode] && planningData[monthKey][agentCode][dateStr]) {
        delete planningData[monthKey][agentCode][dateStr];
        saveData();
        showSnackbar("Absence supprimée pour " + agentCode + " le " + dateStr);
        showLeavesList();
    }
}

function deletePeriodLeave(agentCode, startDate) {
    if (!confirm("Supprimer le congé sur période de " + agentCode + " commençant le " + startDate + " ?")) return;
    if (leaves) {
        const leaveIndex = leaves.findIndex(function(l) { return l.agent_code === agentCode && l.start_date === startDate; });
        if (leaveIndex !== -1) {
            const leave = leaves[leaveIndex];
            const start = new Date(leave.start_date), end = new Date(leave.end_date);
            let current = new Date(start);
            while (current <= end) {
                const dateStr = current.toISOString().split('T')[0];
                const monthKey = dateStr.substring(0,7);
                if (planningData[monthKey] && planningData[monthKey][agentCode] && planningData[monthKey][agentCode][dateStr]) {
                    delete planningData[monthKey][agentCode][dateStr];
                }
                current.setDate(current.getDate() + 1);
            }
            leaves.splice(leaveIndex, 1);
            saveData();
            showSnackbar("Congé sur période supprimé pour " + agentCode);
            showLeavesList();
        }
    }
}

function showAgentLeavesSelection() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + ' (' + a.code + ')</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Agent</label><select id="leavesAgentSelect">' + agentOptions + '</select></div>' +
        '<div class="form-group"><label>Période</label><select id="leavesPeriod"><option value="month">Ce mois</option><option value="last_month">Mois dernier</option><option value="quarter">Ce trimestre</option><option value="year">Cette année</option><option value="all">Toute période</option></select></div></div>';
    openPopup("Congés par Agent", html, '<button class="popup-button green" onclick="showSelectedAgentLeaves()">Voir</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function showSelectedAgentLeaves() {
    const agentCode = document.getElementById('leavesAgentSelect').value;
    const period = document.getElementById('leavesPeriod').value;
    const today = new Date();
    let startDate, endDate;
    switch(period) {
        case 'month': startDate = new Date(today.getFullYear(), today.getMonth(), 1); endDate = new Date(today.getFullYear(), today.getMonth()+1, 0); break;
        case 'last_month': startDate = new Date(today.getFullYear(), today.getMonth()-1, 1); endDate = new Date(today.getFullYear(), today.getMonth(), 0); break;
        case 'quarter': const q = Math.floor(today.getMonth()/3); startDate = new Date(today.getFullYear(), q*3, 1); endDate = new Date(today.getFullYear(), (q+1)*3, 0); break;
        case 'year': startDate = new Date(today.getFullYear(), 0, 1); endDate = new Date(today.getFullYear(), 11, 31); break;
        default: startDate = new Date(2020,0,1); endDate = new Date(2030,11,31);
    }
    const agentLeaves = [];
    for (const monthKey in planningData) {
        if (planningData[monthKey][agentCode]) {
            for (const dateStr in planningData[monthKey][agentCode]) {
                const record = planningData[monthKey][agentCode][dateStr];
                if (record && (record.shift === 'C' || record.shift === 'M' || record.shift === 'A')) {
                    const date = new Date(dateStr);
                    if (date >= startDate && date <= endDate) agentLeaves.push({ date: dateStr, type: record.shift, comment: record.comment || '', recorded_at: record.recorded_at });
                }
            }
        }
    }
    if (leaves) {
        for (let i = 0; i < leaves.length; i++) {
            const leave = leaves[i];
            if (leave.agent_code === agentCode) {
                const leaveStart = new Date(leave.start_date), leaveEnd = new Date(leave.end_date);
                if ((leaveStart >= startDate && leaveStart <= endDate) || (leaveEnd >= startDate && leaveEnd <= endDate) || (leaveStart <= startDate && leaveEnd >= endDate)) {
                    agentLeaves.push({ date: leave.start_date + " au " + leave.end_date, type: 'Période', comment: leave.comment || '', recorded_at: leave.created_at, is_period: true });
                }
            }
        }
    }
    if (!agentLeaves.length) { showSnackbar("Aucun congé trouvé pour cet agent sur la période"); return; }
    const agent = agents.find(function(a) { return a.code === agentCode; });
    const periodText = period === 'all' ? 'Toute période' : startDate.toLocaleDateString() + ' au ' + endDate.toLocaleDateString();
    let html = '<div class="info-section"><h3>Congés de ' + agent.nom + ' ' + agent.prenom + '</h3><p>Période: ' + periodText + '</p><table class="classement-table"><thead><th>Date(s)</th><th>Type</th><th>Commentaire</th><th>Enregistré le</th></thead><tbody>';
    for (let i = 0; i < agentLeaves.length; i++) {
        const l = agentLeaves[i];
        html += '汽笛>' + l.date + '汽笛><span style="background:' + (SHIFT_COLORS[l.type] || '#7f8c8d') + ';color:white;padding:2px 8px;border-radius:3px">' + l.type + '</span>汽笛>' + (l.comment || '-') + '汽笛>' + new Date(l.recorded_at).toLocaleDateString() + '汽笛';
    }
    html += '</tbody>赶趟</div>';
    openPopup("Congés de " + agent.code, html, '<button class="popup-button blue" onclick="showAgentLeavesSelection()">Autre Agent</button><button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function showGroupLeavesSelection() {
    const groups = ['A','B','C','D','E'];
    let groupOptions = '';
    for (let i = 0; i < groups.length; i++) {
        groupOptions += '<option value="' + groups[i] + '">Groupe ' + groups[i] + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Groupe</label><select id="groupLeavesSelect">' + groupOptions + '</select></div>' +
        '<div class="form-group"><label>Période</label><select id="groupLeavesPeriod"><option value="month">Ce mois</option><option value="last_month">Mois dernier</option><option value="quarter">Ce trimestre</option><option value="year">Cette année</option><option value="all">Toute période</option></select></div>' +
        '<div id="groupLeavesResult"></div></div>';
    openPopup("Congés par Groupe", html, '<button class="popup-button green" onclick="showGroupLeavesResult()">Voir</button><button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function showGroupLeavesResult() {
    const group = document.getElementById('groupLeavesSelect').value;
    const period = document.getElementById('groupLeavesPeriod').value;
    const today = new Date();
    let startDate, endDate;
    switch(period) {
        case 'month': startDate = new Date(today.getFullYear(), today.getMonth(), 1); endDate = new Date(today.getFullYear(), today.getMonth()+1, 0); break;
        case 'last_month': startDate = new Date(today.getFullYear(), today.getMonth()-1, 1); endDate = new Date(today.getFullYear(), today.getMonth(), 0); break;
        case 'quarter': const q = Math.floor(today.getMonth()/3); startDate = new Date(today.getFullYear(), q*3, 1); endDate = new Date(today.getFullYear(), (q+1)*3, 0); break;
        case 'year': startDate = new Date(today.getFullYear(), 0, 1); endDate = new Date(today.getFullYear(), 11, 31); break;
        default: startDate = new Date(2020,0,1); endDate = new Date(2030,11,31);
    }
    const groupAgents = agents.filter(function(a) { return a.groupe === group && a.statut === 'actif'; });
    const leavesList = [];
    for (let i = 0; i < groupAgents.length; i++) {
        const agent = groupAgents[i];
        for (const monthKey in planningData) {
            if (planningData[monthKey][agent.code]) {
                for (const dateStr in planningData[monthKey][agent.code]) {
                    const record = planningData[monthKey][agent.code][dateStr];
                    if (record && (record.shift === 'C' || record.shift === 'M' || record.shift === 'A')) {
                        const date = new Date(dateStr);
                        if (date >= startDate && date <= endDate) leavesList.push({ agent: agent.nom + ' ' + agent.prenom, date: dateStr, type: record.shift, comment: record.comment || '' });
                    }
                }
            }
        }
        if (leaves) {
            for (let j = 0; j < leaves.length; j++) {
                const leave = leaves[j];
                if (leave.agent_code === agent.code) {
                    const leaveStart = new Date(leave.start_date), leaveEnd = new Date(leave.end_date);
                    if ((leaveStart >= startDate && leaveStart <= endDate) || (leaveEnd >= startDate && leaveEnd <= endDate) || (leaveStart <= startDate && leaveEnd >= endDate)) {
                        leavesList.push({ agent: agent.nom + ' ' + agent.prenom, date: leave.start_date + " au " + leave.end_date, type: 'Période', comment: leave.comment || '' });
                    }
                }
            }
        }
    }
    let html = '<div class="info-section"><h3>Congés Groupe ' + group + '</h3>';
    if (!leavesList.length) html += '<p>Aucun congé trouvé</p>';
    else {
        html += '<table class="classement-table"><thead><th>Agent</th><th>Date(s)</th><th>Type</th><th>Commentaire</th></thead><tbody>';
        for (let i = 0; i < leavesList.length; i++) {
            const l = leavesList[i];
            html += '汽笛>' + l.agent + '汽笛>' + l.date + '汽笛>' + (SHIFT_LABELS[l.type] || l.type) + '汽笛>' + (l.comment || '-') + '汽笛';
        }
        html += '</tbody>赶趟';
    }
    html += '</div>';
    document.getElementById('groupLeavesResult').innerHTML = html;
}

function exportLeavesReport() {
    let csv = "Rapport des Congés et Absences\n\nDate Export;Nombre total d'absences\n" + new Date().toLocaleDateString() + ";" + countTotalLeaves() + "\n\nAgent;Code;Groupe;Date;Type;Commentaire;Enregistré le\n";
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    for (let i = 0; i < activeAgents.length; i++) {
        const agent = activeAgents[i];
        const agentLeaves = [];
        for (const monthKey in planningData) {
            if (planningData[monthKey][agent.code]) {
                for (const dateStr in planningData[monthKey][agent.code]) {
                    const record = planningData[monthKey][agent.code][dateStr];
                    if (record && (record.shift === 'C' || record.shift === 'M' || record.shift === 'A')) {
                        agentLeaves.push({ date: dateStr, type: record.shift, comment: record.comment || '', recorded_at: record.recorded_at });
                    }
                }
            }
        }
        if (leaves) {
            for (let j = 0; j < leaves.length; j++) {
                const leave = leaves[j];
                if (leave.agent_code === agent.code) {
                    agentLeaves.push({ date: leave.start_date + " au " + leave.end_date, type: 'Période', comment: leave.comment || '', recorded_at: leave.created_at });
                }
            }
        }
        for (let k = 0; k < agentLeaves.length; k++) {
            const l = agentLeaves[k];
            csv += agent.nom + " " + agent.prenom + ";" + agent.code + ";" + agent.groupe + ";" + l.date + ";" + l.type + ";\"" + (l.comment || "") + "\";" + new Date(l.recorded_at).toLocaleDateString() + "\n";
        }
    }
    downloadCSV(csv, "Rapport_Conges_" + new Date().toISOString().split('T')[0] + ".csv");
    showSnackbar("Rapport des congés téléchargé");
}

function countTotalLeaves() {
    let count = 0;
    for (const monthKey in planningData) {
        for (const agentCode in planningData[monthKey]) {
            for (const dateStr in planningData[monthKey][agentCode]) {
                const record = planningData[monthKey][agentCode][dateStr];
                if (record && (record.shift === 'C' || record.shift === 'M' || record.shift === 'A')) count++;
            }
        }
    }
    if (leaves) count += leaves.length;
    return count;
}

function showAddLeaveForDate(agentCode, dateStr) {
    const html = '<div class="info-section"><div class="form-group"><label>Agent</label><input type="text" value="' + agentCode + '" readonly></div><div class="form-group"><label>Date</label><input type="text" value="' + dateStr + '" readonly></div><div class="form-group"><label>Type</label><select id="quickLeaveType"><option value="C">Congé payé</option><option value="M">Maladie</option><option value="A">Autre absence</option></select></div><div class="form-group"><label>Commentaire</label><textarea id="quickLeaveComment" rows="2"></textarea></div></div>';
    openPopup("Ajouter Congé", html, '<button class="popup-button green" onclick="saveQuickLeave(\'' + agentCode + '\',\'' + dateStr + '\')">Enregistrer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function saveQuickLeave(agentCode, dateStr) {
    const type = document.getElementById('quickLeaveType').value;
    const comment = document.getElementById('quickLeaveComment').value;
    const monthKey = dateStr.substring(0,7);
    if (!planningData[monthKey]) planningData[monthKey] = {};
    if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
    planningData[monthKey][agentCode][dateStr] = { shift: type, type: 'absence', comment: comment, recorded_at: new Date().toISOString() };
    saveData();
    showSnackbar("Congé enregistré");
    closePopup();
    showAgentPlanningView();
}

function showDeleteLeaveForm() {
    const allLeaves = [];
    for (const mk in planningData) {
        for (const ac in planningData[mk]) {
            for (const d in planningData[mk][ac]) {
                const record = planningData[mk][ac][d];
                if (record && (record.shift === 'C' || record.shift === 'M' || record.shift === 'A')) {
                    allLeaves.push({ agent: ac, date: d, type: record.shift, comment: record.comment || '', period_id: record.period_id });
                }
            }
        }
    }
    if (!allLeaves.length) { showSnackbar("Aucun congé à supprimer"); return; }
    let agentOptions = '<option value="all">Tous les agents</option>';
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Filtrer par agent</label><select id="deleteFilterAgent" onchange="filterDeleteLeaves()">' + agentOptions + '</select></div><div id="deleteLeavesList">' + generateDeleteLeavesList(allLeaves) + '</div></div>';
    openPopup("Supprimer un Congé", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
    window.filterDeleteLeaves = function() {
        const filterAgent = document.getElementById('deleteFilterAgent').value;
        const filtered = filterAgent === 'all' ? allLeaves : allLeaves.filter(function(l) { return l.agent === filterAgent; });
        document.getElementById('deleteLeavesList').innerHTML = generateDeleteLeavesList(filtered);
    };
}

function generateDeleteLeavesList(leavesList) {
    if (!leavesList.length) return '<p>Aucun congé trouvé</p>';
    let html = '<table class="classement-table"><thead><th>Agent</th><th>Date</th><th>Type</th><th>Commentaire</th><th>Action</th></thead><tbody>';
    for (let i = 0; i < leavesList.length; i++) {
        const l = leavesList[i];
        html += '汽笛>' + l.agent + '汽笛>' + l.date + '汽笛>' + SHIFT_LABELS[l.type] + '汽笛>' + (l.comment || '-') + '汽笛><button class="action-btn small red" onclick="deleteLeaveItem(\'' + l.agent + '\',\'' + l.date + '\')">🗑️</button>汽笛';
    }
    html += '</tbody>赶趟';
    return html;
}

function deleteLeaveItem(agentCode, dateStr) {
    if (confirm("Supprimer le congé de " + agentCode + " du " + dateStr + " ?")) {
        const monthKey = dateStr.substring(0,7);
        if (planningData[monthKey] && planningData[monthKey][agentCode] && planningData[monthKey][agentCode][dateStr]) {
            delete planningData[monthKey][agentCode][dateStr];
            saveData();
            showSnackbar("Congé supprimé");
            showDeleteLeaveForm();
        }
    }
}

function previewLeave() { showSnackbar("Prévisualisation non disponible"); }

function showAddPeriodLeaveForm() {
    showAddLeaveForm();
    const leaveType = document.getElementById('leaveType');
    if (leaveType) leaveType.value = 'periode';
    const singleDiv = document.getElementById('singleLeaveSection');
    const periodDiv = document.getElementById('periodLeaveSection');
    if (singleDiv) singleDiv.style.display = 'none';
    if (periodDiv) periodDiv.style.display = 'block';
}

// ==================== CODES PANIQUE ====================
function displayPanicMenu() {
    displaySubMenu("CODES PANIQUE", [
        { text: "➕ Ajouter Code", handler: function() { showAddPanicCodeForm(); } },
        { text: "📋 Liste des Codes", handler: function() { showPanicCodesList(); } },
        { text: "📤 Exporter Codes", handler: function() { exportPanicCodes(); } },
        { text: "↩️ Retour", handler: function() { displayMainMenu(); }, className: "back-button" }
    ]);
}

function showAddPanicCodeForm() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Agent</label><select id="panicAgent">' + agentOptions + '</select></div><div class="form-group"><label>Code</label><input type="text" id="panicCode" placeholder="Ex: 1234"></div></div>';
    openPopup("Ajouter Code Panique", html, '<button class="popup-button green" onclick="addPanicCode()">Enregistrer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function addPanicCode() {
    const agentCode = document.getElementById('panicAgent').value;
    const code = document.getElementById('panicCode').value;
    if (!code) { showSnackbar("Code requis"); return; }
    const existing = panicCodes.findIndex(function(p) { return p.agent_code === agentCode; });
    if (existing !== -1) panicCodes[existing] = { agent_code: agentCode, code: code, created_at: new Date().toISOString() };
    else panicCodes.push({ agent_code: agentCode, code: code, created_at: new Date().toISOString() });
    saveData();
    showSnackbar("Code ajouté");
    closePopup();
}

function showPanicCodesList() {
    if (!panicCodes.length) { showSnackbar("Aucun code panique"); return; }
    let html = '<div class="info-section"><table class="classement-table"><thead><th>Agent</th><th>Code</th><th>Créé le</th></thead><tbody>';
    for (let i = 0; i < panicCodes.length; i++) {
        const p = panicCodes[i];
        html += '汽笛>' + p.agent_code + '汽笛>' + p.code + '汽笛>' + new Date(p.created_at).toLocaleDateString() + '汽笛';
    }
    html += '</tbody>赶趟</div>';
    openPopup("Codes Panique", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function exportPanicCodes() {
    if (!panicCodes.length) { showSnackbar("Aucun code"); return; }
    let csv = "Agent;Code;Date\n";
    for (let i = 0; i < panicCodes.length; i++) {
        const p = panicCodes[i];
        csv += p.agent_code + ";" + p.code + ";" + p.created_at + "\n";
    }
    downloadCSV(csv, "codes_panique.csv");
    showSnackbar("Export terminé");
}

// ==================== RADIOS ====================
function displayRadiosMenu() {
    displaySubMenu("GESTION RADIOS", [
        { text: "➕ Ajouter Radio", handler: function() { showAddRadioForm(); } },
        { text: "📋 Liste des Radios", handler: function() { showRadiosList(); } },
        { text: "📲 Attribuer Radio", handler: function() { showAssignRadioForm(); } },
        { text: "🔄 Retour Radio", handler: function() { showReturnRadioForm(); } },
        { text: "📊 Statut Radios", handler: function() { showRadiosStatus(); } },
        { text: "↩️ Retour", handler: function() { displayMainMenu(); }, className: "back-button" }
    ]);
}

function showAddRadioForm() {
    const html = '<div class="info-section"><div class="form-group"><label>ID Radio</label><input type="text" id="radioId" placeholder="RAD001"></div><div class="form-group"><label>Modèle</label><input type="text" id="radioModel" placeholder="Motorola"></div><div class="form-group"><label>Statut</label><select id="radioStatus"><option>DISPONIBLE</option><option>ATTRIBUEE</option><option>HS</option></select></div></div>';
    openPopup("Ajouter Radio", html, '<button class="popup-button green" onclick="addRadio()">Enregistrer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function addRadio() {
    const id = document.getElementById('radioId').value.toUpperCase();
    if (radios.find(function(r) { return r.id === id; })) { showSnackbar("ID déjà existant"); return; }
    radios.push({ id: id, model: document.getElementById('radioModel').value, status: document.getElementById('radioStatus').value, created_at: new Date().toISOString() });
    saveData();
    showSnackbar("Radio ajoutée");
    closePopup();
}

function showRadiosList() {
    if (!radios.length) { showSnackbar("Aucune radio"); return; }
    let html = '<div class="info-section"><table class="classement-table"><thead><th>ID</th><th>Modèle</th><th>Statut</th><th>Attribuée à</th><th>Actions</th></thead><tbody>';
    for (let i = 0; i < radios.length; i++) {
        const r = radios[i];
        const agentName = r.attributed_to ? (agents.find(function(a) { return a.code === r.attributed_to; })?.nom || r.attributed_to) : '-';
        html += '汽笛>' + r.id + '汽笛>' + r.model + '汽笛><span class="status-badge ' + (r.status==='DISPONIBLE'?'active':'inactive') + '">' + r.status + '</span>汽笛>' + agentName + '汽笛><button class="action-btn small blue" onclick="showAssignRadioForm(\'' + r.id + '\')">📲</button><button class="action-btn small red" onclick="deleteRadio(\'' + r.id + '\')">🗑️</button>汽笛';
    }
    html += '</tbody>赶趟</div>';
    openPopup("Liste Radios", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function showAssignRadioForm(radioId) {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + '</option>';
    }
    const html = '<div class="info-section"><p>Radio: ' + radioId + '</p><div class="form-group"><label>Agent</label><select id="assignAgent">' + agentOptions + '</select></div></div>';
    openPopup("Attribuer Radio", html, '<button class="popup-button green" onclick="assignRadio(\'' + radioId + '\')">Attribuer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function assignRadio(radioId) {
    const idx = radios.findIndex(function(r) { return r.id === radioId; });
    if (idx !== -1) {
        radios[idx].status = 'ATTRIBUEE';
        radios[idx].attributed_to = document.getElementById('assignAgent').value;
        radios[idx].attribution_date = new Date().toISOString();
        saveData();
        showSnackbar("Radio attribuée");
        closePopup();
    }
}

function showReturnRadioForm() {
    const attributed = radios.filter(function(r) { return r.status === 'ATTRIBUEE'; });
    if (!attributed.length) { showSnackbar("Aucune radio attribuée"); return; }
    let options = '';
    for (let i = 0; i < attributed.length; i++) {
        const r = attributed[i];
        options += '<option value="' + r.id + '">' + r.id + ' - ' + r.attributed_to + '</option>';
    }
    const html = '<div class="info-section"><select id="returnRadio">' + options + '</select></div>';
    openPopup("Retour Radio", html, '<button class="popup-button green" onclick="returnRadio()">Retourner</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function returnRadio() {
    const radioId = document.getElementById('returnRadio').value;
    const idx = radios.findIndex(function(r) { return r.id === radioId; });
    if (idx !== -1) {
        radios[idx].status = 'DISPONIBLE';
        delete radios[idx].attributed_to;
        saveData();
        showSnackbar("Radio retournée");
        closePopup();
    }
}

function showRadiosStatus() {
    const total = radios.length;
    const dispo = radios.filter(function(r) { return r.status==='DISPONIBLE'; }).length;
    const attrib = radios.filter(function(r) { return r.status==='ATTRIBUEE'; }).length;
    const hs = radios.filter(function(r) { return r.status==='HS'; }).length;
    const html = '<div class="info-section"><h3>Statut Radios</h3><p>Total: ' + total + '</p><p>Disponibles: ' + dispo + '</p><p>Attribuées: ' + attrib + '</p><p>HS: ' + hs + '</p></div>';
    openPopup("Statut Radios", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function deleteRadio(radioId) {
    if (confirm("Supprimer cette radio ?")) {
        const idx = radios.findIndex(function(r) { return r.id === radioId; });
        if (idx !== -1) radios.splice(idx, 1);
        saveData();
        showSnackbar("Radio supprimée");
        showRadiosList();
    }
}

// ==================== HABILLEMENT ====================
function displayUniformMenu() {
    displaySubMenu("HABILLEMENT", [
        { text: "➕ Enregistrer Habillement", handler: function() { showAddUniformForm(); } },
        { text: "✏️ Modifier Habillement", handler: function() { showEditUniformList(); } },
        { text: "📋 Rapport Habillement", handler: function() { showUniformReport(); } },
        { text: "📊 Statistiques Tailles", handler: function() { showUniformStats(); } },
        { text: "📅 Échéances", handler: function() { showUniformDeadlines(); } },
        { text: "📤 Exporter Rapport", handler: function() { exportUniformReport(); } },
        { text: "↩️ Retour", handler: function() { displayMainMenu(); }, className: "back-button" }
    ]);
}

function showAddUniformForm() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + ' (' + a.code + ')</option>';
    }
    const html = '<div class="info-section"><h3>Enregistrement Habillement</h3><div class="form-group"><label>Agent *</label><select id="uniformAgent">' + agentOptions + '</select></div>' +
        '<div class="form-group"><label>Chemise taille *</label><select id="uniformShirt"><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select></div>' +
        '<div class="form-group"><label>Pantalon taille *</label><select id="uniformPants"><option>38</option><option>40</option><option>42</option><option>44</option><option>46</option><option>48</option><option>50</option></select></div>' +
        '<div class="form-group"><label>Veste/Blouson</label><select id="uniformJacket"><option>Non fourni</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select></div>' +
        '<div class="form-group"><label>Casquette</label><select id="uniformCap"><option>Non fournie</option><option>Oui</option></select></div>' +
        '<div class="form-group"><label>Chaussures (pointure)</label><input type="number" id="uniformShoes" step="0.5" placeholder="Ex: 42"></div>' +
        '<div class="form-group"><label>Ceinture</label><select id="uniformBelt"><option>Non fournie</option><option>Oui</option></select></div>' +
        '<div class="form-group"><label>Date fourniture *</label><input type="date" id="uniformDate" value="' + new Date().toISOString().split('T')[0] + '"></div>' +
        '<div class="form-group"><label>État chemise</label><select id="uniformShirtCondition"><option>Neuf</option><option>Bon état</option><option>Usé</option><option>Mauvais état</option></select></div>' +
        '<div class="form-group"><label>État pantalon</label><select id="uniformPantsCondition"><option>Neuf</option><option>Bon état</option><option>Usé</option><option>Mauvais état</option></select></div>' +
        '<div class="form-group"><label>Commentaires</label><textarea id="uniformComments" rows="2"></textarea></div></div>';
    openPopup("Ajouter Habillement", html, '<button class="popup-button green" onclick="addUniform()">Enregistrer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function addUniform() {
    const agentCode = document.getElementById('uniformAgent').value;
    const idx = uniforms.findIndex(function(u) { return u.agent_code === agentCode; });
    const uniform = {
        agent_code: agentCode,
        shirt: document.getElementById('uniformShirt').value,
        pants: document.getElementById('uniformPants').value,
        jacket: document.getElementById('uniformJacket').value !== 'Non fourni' ? document.getElementById('uniformJacket').value : null,
        cap: document.getElementById('uniformCap').value === 'Oui',
        shoes: document.getElementById('uniformShoes').value || null,
        belt: document.getElementById('uniformBelt').value === 'Oui',
        date: document.getElementById('uniformDate').value,
        shirt_condition: document.getElementById('uniformShirtCondition').value,
        pants_condition: document.getElementById('uniformPantsCondition').value,
        comments: document.getElementById('uniformComments').value,
        updated_at: new Date().toISOString()
    };
    if (idx !== -1) uniforms[idx] = uniform;
    else uniforms.push(uniform);
    saveData();
    showSnackbar("Habillement enregistré");
    closePopup();
    showUniformReport();
}

function showEditUniformList() {
    if (!uniforms.length) { showSnackbar("Aucun habillement"); return; }
    const html = '<div class="info-section"><input type="text" id="searchUniform" placeholder="Rechercher agent..." class="form-input" onkeyup="filterUniformList()"><div id="uniformEditList">' + generateUniformEditList() + '</div></div>';
    openPopup("Modifier Habillement", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
    window.filterUniformList = function() {
        const search = document.getElementById('searchUniform').value.toLowerCase();
        const filtered = uniforms.filter(function(u) { return u.agent_code.toLowerCase().includes(search); });
        document.getElementById('uniformEditList').innerHTML = generateUniformEditList(filtered);
    };
}

function generateUniformEditList(list) {
    if (list === undefined) list = uniforms;
    if (!list.length) return '<p>Aucun habillement trouvé</p>';
    let html = '<table class="classement-table"><thead><th>Agent</th><th>Chemise</th><th>Pantalon</th><th>Veste</th><th>Chaussures</th><th>Date</th><th>Actions</th></thead><tbody>';
    for (let i = 0; i < list.length; i++) {
        const u = list[i];
        html += '汽笛>' + u.agent_code + '汽笛>' + u.shirt + '汽笛>' + u.pants + '汽笛>' + (u.jacket || '-') + '汽笛>' + (u.shoes || '-') + '汽笛>' + u.date + '汽笛><button class="action-btn small blue" onclick="editUniform(\'' + u.agent_code + '\')">✏️</button><button class="action-btn small red" onclick="deleteUniform(\'' + u.agent_code + '\')">🗑️</button>汽笛';
    }
    html += '</tbody>赶趟';
    return html;
}

function editUniform(agentCode) {
    const uniform = uniforms.find(function(u) { return u.agent_code === agentCode; });
    if (!uniform) return;
    const shirtOptions = ['S','M','L','XL','XXL'].map(function(s) { return '<option ' + (uniform.shirt === s ? 'selected' : '') + '>' + s + '</option>'; }).join('');
    const pantsOptions = ['38','40','42','44','46','48','50'].map(function(p) { return '<option ' + (uniform.pants === p ? 'selected' : '') + '>' + p + '</option>'; }).join('');
    const jacketOptions = ['Non fournie','S','M','L','XL','XXL'].map(function(j) { return '<option ' + ((!uniform.jacket && j === 'Non fournie') || uniform.jacket === j ? 'selected' : '') + '>' + j + '</option>'; }).join('');
    const shirtConditionOptions = ['Neuf','Bon état','Usé','Mauvais état'].map(function(c) { return '<option ' + (uniform.shirt_condition === c ? 'selected' : '') + '>' + c + '</option>'; }).join('');
    const pantsConditionOptions = ['Neuf','Bon état','Usé','Mauvais état'].map(function(c) { return '<option ' + (uniform.pants_condition === c ? 'selected' : '') + '>' + c + '</option>'; }).join('');
    const html = '<div class="info-section"><h3>Modifier Habillement - ' + agentCode + '</h3><div class="form-group"><label>Chemise taille</label><select id="editShirt">' + shirtOptions + '</select></div>' +
        '<div class="form-group"><label>Pantalon taille</label><select id="editPants">' + pantsOptions + '</select></div>' +
        '<div class="form-group"><label>Veste</label><select id="editJacket">' + jacketOptions + '</select></div>' +
        '<div class="form-group"><label>Chaussures</label><input type="number" id="editShoes" value="' + (uniform.shoes || '') + '" step="0.5"></div>' +
        '<div class="form-group"><label>Date fourniture</label><input type="date" id="editDate" value="' + uniform.date + '"></div>' +
        '<div class="form-group"><label>État chemise</label><select id="editShirtCondition">' + shirtConditionOptions + '</select></div>' +
        '<div class="form-group"><label>État pantalon</label><select id="editPantsCondition">' + pantsConditionOptions + '</select></div>' +
        '<div class="form-group"><label>Commentaires</label><textarea id="editComments" rows="2">' + (uniform.comments || '') + '</textarea></div></div>';
    openPopup("Modifier Habillement", html, '<button class="popup-button green" onclick="updateUniform(\'' + agentCode + '\')">Enregistrer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function updateUniform(agentCode) {
    const idx = uniforms.findIndex(function(u) { return u.agent_code === agentCode; });
    if (idx !== -1) {
        const jacketVal = document.getElementById('editJacket').value;
        uniforms[idx] = Object.assign({}, uniforms[idx], {
            shirt: document.getElementById('editShirt').value,
            pants: document.getElementById('editPants').value,
            jacket: jacketVal !== 'Non fournie' ? jacketVal : null,
            shoes: document.getElementById('editShoes').value || null,
            date: document.getElementById('editDate').value,
            shirt_condition: document.getElementById('editShirtCondition').value,
            pants_condition: document.getElementById('editPantsCondition').value,
            comments: document.getElementById('editComments').value,
            updated_at: new Date().toISOString()
        });
        saveData();
        showSnackbar("Habillement modifié");
        closePopup();
        showUniformReport();
    }
}

function deleteUniform(agentCode) {
    if (confirm("Supprimer l'habillement de " + agentCode + " ?")) {
        const idx = uniforms.findIndex(function(u) { return u.agent_code === agentCode; });
        if (idx !== -1) uniforms.splice(idx, 1);
        saveData();
        showSnackbar("Habillement supprimé");
        showUniformReport();
    }
}

function showUniformReport() {
    if (!uniforms.length) { showSnackbar("Aucun habillement"); return; }
    let html = '<div class="info-section"><h3>Rapport Habillement</h3><table class="classement-table"><thead><th>Agent</th><th>Chemise</th><th>Pantalon</th><th>Veste</th><th>Chaussures</th><th>Date</th><th>État</th></thead><tbody>';
    for (let i = 0; i < uniforms.length; i++) {
        const u = uniforms[i];
        let icons = '';
        if (u.cap) icons += ' 🧢';
        if (u.belt) icons += ' 🔗';
        if (u.jacket) icons += ' 🧥';
        if (u.shoes) icons += ' 👞';
        html += '汽笛>' + u.agent_code + icons + '汽笛>' + u.shirt + '汽笛>' + u.pants + '汽笛>' + (u.jacket || '-') + '汽笛>' + (u.shoes || '-') + '汽笛>' + u.date + '汽笛>' + (u.shirt_condition || 'Neuf') + '/' + (u.pants_condition || 'Neuf') + '汽笛';
    }
    html += '</tbody>赶趟</div>';
    openPopup("Rapport Habillement", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function showUniformStats() {
    if (!uniforms.length) { showSnackbar("Aucune donnée"); return; }
    const shirtSizes = {}, pantsSizes = {}, jacketSizes = {}, shoesSizes = {};
    for (let i = 0; i < uniforms.length; i++) {
        const u = uniforms[i];
        shirtSizes[u.shirt] = (shirtSizes[u.shirt] || 0) + 1;
        pantsSizes[u.pants] = (pantsSizes[u.pants] || 0) + 1;
        if (u.jacket) jacketSizes[u.jacket] = (jacketSizes[u.jacket] || 0) + 1;
        if (u.shoes) shoesSizes[u.shoes] = (shoesSizes[u.shoes] || 0) + 1;
    }
    let html = '<div class="info-section"><h3>Statistiques Tailles</h3><h4>Chemises</h4>';
    for (const s in shirtSizes) html += '<p>' + s + ': ' + shirtSizes[s] + '</p>';
    html += '<h4>Pantalons</h4>';
    for (const p in pantsSizes) html += '<p>' + p + ': ' + pantsSizes[p] + '</p>';
    html += '<h4>Vestes</h4>';
    let hasJacket = false;
    for (const j in jacketSizes) { hasJacket = true; html += '<p>' + j + ': ' + jacketSizes[j] + '</p>'; }
    if (!hasJacket) html += '<p>Aucune veste</p>';
    html += '<h4>Chaussures</h4>';
    let hasShoes = false;
    for (const sh in shoesSizes) { hasShoes = true; html += '<p>Pointure ' + sh + ': ' + shoesSizes[sh] + '</p>'; }
    if (!hasShoes) html += '<p>Aucune chaussure</p>';
    html += '</div>';
    openPopup("Statistiques Tailles", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function showUniformDeadlines() {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const toRenew = uniforms.filter(function(u) { return new Date(u.date) < twoYearsAgo; });
    let html = '<div class="info-section"><h3>Échéances Renouvellement (2 ans)</h3>';
    if (toRenew.length) {
        for (let i = 0; i < toRenew.length; i++) {
            const u = toRenew[i];
            html += '<div style="padding:10px;background:#e74c3c20;margin:5px 0;border-radius:5px"><strong>' + u.agent_code + '</strong> - ' + u.shirt + '/' + u.pants + ' - ' + u.date + '<br><small>' + (u.comments || '') + '</small></div>';
        }
    } else {
        html += '<p>Aucune échéance dans les 2 prochaines années</p>';
    }
    html += '</div>';
    openPopup("Échéances", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function exportUniformReport() {
    if (!uniforms.length) { showSnackbar("Aucune donnée"); return; }
    let csv = "Agent;Chemise;Pantalon;Veste;Casquette;Ceinture;Chaussures;Date;ÉtatChemise;ÉtatPantalon;Commentaires\n";
    for (let i = 0; i < uniforms.length; i++) {
        const u = uniforms[i];
        csv += u.agent_code + ";" + u.shirt + ";" + u.pants + ";" + (u.jacket || "") + ";" + (u.cap ? 'Oui' : 'Non') + ";" + (u.belt ? 'Oui' : 'Non') + ";" + (u.shoes || "") + ";" + u.date + ";" + (u.shirt_condition || "") + ";" + (u.pants_condition || "") + ";" + (u.comments || "") + "\n";
    }
    downloadCSV(csv, "rapport_habillement.csv");
    showSnackbar("Rapport exporté");
}

// ==================== AVERTISSEMENTS ====================
function displayWarningsMenu() {
    displaySubMenu("AVERTISSEMENTS", [
        { text: "⚠️ Ajouter Avertissement", handler: function() { showAddWarningForm(); } },
        { text: "📋 Liste Avertissements", handler: function() { showWarningsList(); } },
        { text: "↩️ Retour", handler: function() { displayMainMenu(); }, className: "back-button" }
    ]);
}

function showAddWarningForm() {
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    let agentOptions = '';
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        agentOptions += '<option value="' + a.code + '">' + a.nom + ' ' + a.prenom + '</option>';
    }
    const html = '<div class="info-section"><div class="form-group"><label>Agent</label><select id="warningAgent">' + agentOptions + '</select></div>' +
        '<div class="form-group"><label>Type</label><select id="warningType"><option>ORAL</option><option>ECRIT</option><option>MISE_A_PIED</option></select></div>' +
        '<div class="form-group"><label>Date</label><input type="date" id="warningDate" value="' + new Date().toISOString().split('T')[0] + '"></div>' +
        '<div class="form-group"><label>Description</label><textarea id="warningDesc" rows="3"></textarea></div></div>';
    openPopup("Ajouter Avertissement", html, '<button class="popup-button green" onclick="addWarning()">Enregistrer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function addWarning() {
    warnings.push({ id: Date.now(), agent_code: document.getElementById('warningAgent').value, type: document.getElementById('warningType').value, description: document.getElementById('warningDesc').value, date: document.getElementById('warningDate').value, status: 'active', created_at: new Date().toISOString() });
    saveData();
    showSnackbar("Avertissement ajouté");
    closePopup();
}

function showWarningsList() {
    if (!warnings.length) { showSnackbar("Aucun avertissement"); return; }
    let html = '<div class="info-section"><table class="classement-table"><thead><th>Agent</th><th>Type</th><th>Date</th><th>Description</th><th>Actions</th></thead><tbody>';
    for (let i = 0; i < warnings.length; i++) {
        const w = warnings[i];
        html += '汽笛>' + w.agent_code + '汽笛>' + w.type + '汽笛>' + w.date + '汽笛>' + w.description.substring(0,40) + '...汽笛><button class="action-btn small red" onclick="deleteWarning(\'' + w.id + '\')">🗑️</button>汽笛';
    }
    html += '</tbody>赶趟</div>';
    openPopup("Avertissements", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function deleteWarning(id) {
    if (confirm("Supprimer cet avertissement ?")) {
        const idx = warnings.findIndex(function(w) { return w.id == id; });
        if (idx !== -1) warnings.splice(idx, 1);
        saveData();
        showSnackbar("Avertissement supprimé");
        showWarningsList();
    }
}

// ==================== JOURS FÉRIÉS ====================
function displayHolidaysMenu() {
    displaySubMenu("JOURS FÉRIÉS", [
        { text: "📋 Liste Jours Fériés", handler: function() { showHolidaysList(); } },
        { text: "➕ Ajouter Jour Férié", handler: function() { showAddHolidayForm(); } },
        { text: "🔄 Générer Annuelle", handler: function() { generateYearlyHolidays(); } },
        { text: "↩️ Retour", handler: function() { displayMainMenu(); }, className: "back-button" }
    ]);
}

function showAddHolidayForm() {
    const html = '<div class="info-section">' +
        '<h3>➕ Ajouter un jour férié</h3>' +
        '<div class="form-group"><label>Date *</label><input type="date" id="newHolidayDate" class="form-input" required></div>' +
        '<div class="form-group"><label>Description *</label><input type="text" id="newHolidayDesc" class="form-input" required placeholder="Ex: Aïd al-Fitr"></div>' +
        '<div class="form-group"><label>Type</label><select id="newHolidayType" class="form-input"><option value="fixe">Fixe</option><option value="religieux">Religieux</option><option value="national">National</option><option value="local">Local</option></select></div>' +
        '<div class="form-group"><label>Répétition annuelle</label><select id="newHolidayRecurring" class="form-input"><option value="false">Non (une seule année)</option><option value="true">Oui (tous les ans)</option></select></div>' +
        '<div class="form-group"><label>Commentaire</label><textarea id="newHolidayComment" class="form-input" rows="2"></textarea></div>' +
        '</div>';
    openPopup("Ajouter jour férié", html, '<button class="popup-button green" onclick="saveHoliday()">💾 Enregistrer</button><button class="popup-button gray" onclick="closePopup()">Annuler</button>');
}

function saveHoliday() {
    const date = document.getElementById('newHolidayDate').value;
    const description = document.getElementById('newHolidayDesc').value;
    const type = document.getElementById('newHolidayType').value;
    const recurring = document.getElementById('newHolidayRecurring').value === 'true';
    const comment = document.getElementById('newHolidayComment').value;

    if (!date || !description) {
        showSnackbar("Veuillez remplir la date et la description");
        return;
    }

    if (holidays.some(function(h) { return h.date === date; })) {
        showSnackbar("Cette date est déjà enregistrée comme jour férié");
        return;
    }

    const newHoliday = {
        date: date,
        description: description,
        type: type,
        recurring: recurring,
        comment: comment,
        created_at: new Date().toISOString()
    };
    holidays.push(newHoliday);
    saveData();
    showSnackbar("Jour férié ajouté avec succès");
    closePopup();
    showHolidaysList();
}

function showHolidaysList() {
    if (holidays.length === 0) generateYearlyHolidays();
    const sorted = holidays.slice().sort(function(a,b) { return new Date(a.date) - new Date(b.date); });
    let html = '<div class="info-section"><table class="classement-table"><thead><th>Date</th><th>Jour</th><th>Description</th><th>Type</th><th>Récurrent</th><th>Actions</th></thead><tbody>';
    for (let i = 0; i < sorted.length; i++) {
        const h = sorted[i];
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const day = dayNames[new Date(h.date).getDay()];
        html += '汽笛>' + h.date + '汽笛>' + day + '汽笛>' + h.description + '汽笛>' + (h.type || 'fixe') + '汽笛>' + (h.recurring ? 'Oui' : 'Non') + '汽笛><button class="action-btn small red" onclick="deleteHoliday(\'' + h.date + '\')">🗑️</button>汽笛';
    }
    html += '</tbody>赶趟</div>';
    openPopup("Jours fériés", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

function deleteHoliday(date) {
    if (confirm("Supprimer le jour férié du " + date + " ?")) {
        const idx = holidays.findIndex(function(h) { return h.date === date; });
        if (idx !== -1) holidays.splice(idx, 1);
        saveData();
        showSnackbar("Jour férié supprimé");
        showHolidaysList();
    }
}

function generateYearlyHolidays() {
    const year = new Date().getFullYear();
    holidays = [
        { date: year + "-01-01", description: 'Nouvel An', type: 'fixe', recurring: true },
        { date: year + "-01-11", description: 'Manifeste Indépendance', type: 'fixe', recurring: true },
        { date: year + "-05-01", description: 'Fête du Travail', type: 'fixe', recurring: true },
        { date: year + "-07-30", description: 'Fête du Trône', type: 'fixe', recurring: true },
        { date: year + "-08-14", description: 'Allégeance Oued Eddahab', type: 'fixe', recurring: true },
        { date: year + "-08-20", description: 'Révolution Roi et Peuple', type: 'fixe', recurring: true },
        { date: year + "-08-21", description: 'Fête de la Jeunesse', type: 'fixe', recurring: true },
        { date: year + "-11-06", description: 'Marche Verte', type: 'fixe', recurring: true },
        { date: year + "-11-18", description: 'Fête Indépendance', type: 'fixe', recurring: true }
    ];
    saveData();
}

// ==================== EXPORTATIONS ====================
function displayExportMenu() {
    displaySubMenu("EXPORTATIONS", [
        { text: "👥 Agents CSV", handler: function() { exportAgentsCSV(); } },
        { text: "📊 Statistiques CSV", handler: function() { exportStatsCSV(); } },
        { text: "📋 Congés CSV", handler: function() { exportLeavesReport(); } },
        { text: "👔 Habillement CSV", handler: function() { exportUniformReport(); } },
        { text: "📅 Planning Excel", handler: function() { showExportPlanningMenu(); } },
        { text: "💾 Sauvegarde Complète", handler: function() { backupAllData(); } },
        { text: "↩️ Retour", handler: function() { displayMainMenu(); }, className: "back-button" }
    ]);
}

function exportAgentsCSV() {
    let csv = "Code;Nom;Prénom;Groupe;Téléphone;Poste;Statut\n";
    for (let i = 0; i < agents.length; i++) {
        const a = agents[i];
        csv += a.code + ";" + a.nom + ";" + a.prenom + ";" + a.groupe + ";" + (a.tel || "") + ";" + (a.poste || "") + ";" + a.statut + "\n";
    }
    downloadCSV(csv, "agents.csv");
    showSnackbar("Export agents terminé");
}

function exportStatsCSV() {
    const today = new Date();
    const month = today.getMonth()+1, year = today.getFullYear();
    let csv = "Agent;Code;Groupe;Travaillés;Fériés;Total;Taux;Congés\n";
    const activeAgents = agents.filter(function(a) { return a.statut === 'actif'; });
    for (let i = 0; i < activeAgents.length; i++) {
        const a = activeAgents[i];
        const stats = calculateWorkedDays(a.code, month, year);
        const taux = Math.round(stats.workedDays / stats.totalDays * 100);
        csv += a.nom + " " + a.prenom + ";" + a.code + ";" + a.groupe + ";" + stats.workedDays + ";" + stats.holidayWorkedDays + ";" + stats.totalDays + ";" + taux + "%;" + stats.leaveDays + "\n";
    }
    downloadCSV(csv, "statistiques_" + getMonthName(month) + "_" + year + ".csv");
    showSnackbar("Export statistiques terminé");
}

function backupAllData() {
    const backup = { agents: agents, planningData: planningData, holidays: holidays, panicCodes: panicCodes, radios: radios, uniforms: uniforms, warnings: warnings, leaves: leaves, date: new Date().toISOString() };
    downloadCSV(JSON.stringify(backup, null, 2), "sga_backup.json");
    showSnackbar("Sauvegarde effectuée");
}

function downloadCSV(content, filename) {
    const blob = new Blob(["\uFEFF" + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ==================== CONFIGURATION ====================
function displayConfigMenu() {
    displaySubMenu("CONFIGURATION", [
        { text: "🗑️ Effacer Données", handler: function() { if(checkPassword()) clearAllData(); else showSnackbar("Mot de passe incorrect"); } },
        { text: "🔄 Réinitialiser Test", handler: function() { if(checkPassword()) resetTestData(); else showSnackbar("Mot de passe incorrect"); } },
        { text: "🔐 Changer mot de passe", handler: function() { changePassword(); } },
        { text: "ℹ️ À propos", handler: function() { showAbout(); } },
        { text: "↩️ Retour", handler: function() { displayMainMenu(); }, className: "back-button" }
    ]);
}

function changePassword() {
    if (!checkPassword()) { showSnackbar("Mot de passe actuel incorrect"); return; }
    const newPwd = prompt("Nouveau mot de passe :");
    if (newPwd && newPwd.trim()) {
        ADMIN_PASSWORD = newPwd;
        localStorage.setItem('sga_password', newPwd);
        showSnackbar("Mot de passe modifié");
    }
}

function clearAllData() {
    if (confirm("Effacer toutes les données ?")) {
        localStorage.clear();
        agents = []; planningData = {}; holidays = []; panicCodes = []; radios = []; uniforms = []; warnings = []; leaves = [];
        initializeTestData();
        showSnackbar("Données réinitialisées");
        displayMainMenu();
        closePopup();
    }
}

function resetTestData() {
    if (confirm("Réinitialiser avec les données de test ?")) {
        initializeTestData();
        showSnackbar("Données de test chargées");
        displayMainMenu();
        closePopup();
    }
}

function showAbout() {
    const html = '<div class="info-section" style="text-align:center"><h3>SGA - CleanCo</h3><p>Système de Gestion des Agents</p><p>Version 5.2</p><p>© 2025</p><hr><p>📊 Total jours = travaillés (shifts 1,2,3) + fériés chômés<br>🎉 Jours fériés récurrents annuellement<br>👔 Habillement complet<br>📅 Congés par période avec option dimanches<br>📈 Évolution mensuelle et classement par groupe<br>📁 Import depuis data.js (corrigé)<br>🔄 Logique Python des cycles de shift<br>📊 Export planning en Excel simple</p></div>';
    openPopup("À propos", html, '<button class="popup-button gray" onclick="closePopup()">Fermer</button>');
}

console.log("✅ SGA chargé - Version 5.2 avec données CleanCo, fériés récurrents, comptage fériés chômés, export Excel simple, recherche d'agent, planning vertical");
