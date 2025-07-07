// Mock data based on your MCD - Replace with your API calls
const mockTheses = [
    {
        id_these: 1,
        titre: "Applications de l'apprentissage profond dans la prédiction du changement climatique",
        resume: "Cette recherche explore l'application d'algorithmes d'apprentissage profond avancés dans la prédiction des modèles de changement climatique et les systèmes de surveillance environnementale. L'étude se concentre sur les méthodes d'ensemble, les réseaux de neurones convolutionnels et les réseaux de neurones récurrents pour analyser des ensembles de données environnementales à grande échelle. Les résultats montrent une amélioration significative de la précision des prédictions par rapport aux méthodes traditionnelles, avec des applications pratiques dans la gestion des ressources naturelles et la planification urbaine durable.",
        date_soumission: "2024-01-15",
        date_inscription: "2021-09-01",
        date_fin_visee: "2024-09-01",
        date_soutenance: "2024-06-15",
        langue: "Français",
        url_pdf: "https://example.com/thesis1.pdf",
        statut: "validée",
        id_doctorant: 1,
        id_directeur: 1,
        id_encadrant: 1,
        id_etablissement: 1,
        id_unite_recherche: 1,
        doctorant: {
            id_utilisateur: 1,
            nom: "Chen",
            prenom: "Sarah",
            email: "sarah.chen@mit.edu",
            mot_de_passe: "",
            id_etablissement: 1,
            role: "doctorant",
            matricule: "DOC2021001",
            annee_inscription: 2021,
            id_unite_recherche: 1
        },
        directeur: {
            id_utilisateur: 2,
            nom: "Rodriguez",
            prenom: "Michael",
            email: "m.rodriguez@mit.edu",
            mot_de_passe: "",
            id_etablissement: 1,
            role: "docteur",
            domaine_recherche: "Intelligence Artificielle"
        },
        encadrant: {
            id_utilisateur: 3,
            nom: "Vasquez",
            prenom: "Elena",
            email: "e.vasquez@mit.edu",
            mot_de_passe: "",
            id_etablissement: 1,
            role: "encadrant",
            grade: "Maître de Conférences",
            specialite: "Apprentissage Automatique"
        },
        etablissement: {
            id_etablissement: 1,
            nom: "Massachusetts Institute of Technology",
            pays: "États-Unis",
            type: "Université"
        },
        unite_recherche: {
            id_unite_recherche: 1,
            nom: "Laboratoire d'Intelligence Artificielle et Environnement",
            acronyme: "LIAE",
            domaine: "Informatique",
            id_etablissement: 1
        },
        disciplines: [
            {
                id_discipline: 1,
                nom: "Informatique"
            }
        ],
        mots_cles: [
            { id_mot_cle: 1, mot: "Machine Learning" },
            { id_mot_cle: 2, mot: "Climate Change" },
            { id_mot_cle: 3, mot: "Deep Learning" },
            { id_mot_cle: 4, mot: "Environmental Science" }
        ],
        commentaires: [
            {
                id_commentaire: 1,
                id_these: 1,
                id_utilisateur: 4,
                texte: "Excellente recherche ! Les résultats sur l'amélioration de la précision des prédictions climatiques sont particulièrement impressionnants.",
                date_commentaire: "2024-01-20T10:30:00Z",
                utilisateur: {
                    id_utilisateur: 4,
                    nom: "Dubois",
                    prenom: "Marie",
                    email: "marie.dubois@sorbonne.fr",
                    mot_de_passe: "",
                    id_etablissement: 2,
                    role: "docteur"
                }
            }
        ]
    },
    {
        id_these: 2,
        titre: "Algorithmes de calcul quantique pour les systèmes de sécurité cryptographique",
        resume: "Une investigation des méthodes cryptographiques post-quantiques et leur implémentation utilisant les principes du calcul quantique pour assurer des systèmes de sécurité résistants aux attaques quantiques futures. Cette thèse examine les défis actuels de la cryptographie face à l'émergence des ordinateurs quantiques et propose des solutions innovantes pour maintenir la sécurité des communications numériques.",
        date_soumission: "2024-01-12",
        date_inscription: "2021-10-01",
        date_fin_visee: "2024-10-01",
        date_soutenance: "2024-07-20",
        langue: "Anglais",
        url_pdf: "https://example.com/thesis2.pdf",
        statut: "en cours",
        id_doctorant: 2,
        id_directeur: 2,
        id_etablissement: 2,
        id_unite_recherche: 2,
        doctorant: {
            id_utilisateur: 5,
            nom: "Liu",
            prenom: "James",
            email: "james.liu@stanford.edu",
            mot_de_passe: "",
            id_etablissement: 2,
            role: "doctorant",
            matricule: "DOC2021002",
            annee_inscription: 2021,
            id_unite_recherche: 2
        },
        directeur: {
            id_utilisateur: 6,
            nom: "Hassan",
            prenom: "Amina",
            email: "a.hassan@stanford.edu",
            mot_de_passe: "",
            id_etablissement: 2,
            role: "docteur",
            domaine_recherche: "Cryptographie Quantique"
        },
        etablissement: {
            id_etablissement: 2,
            nom: "Stanford University",
            pays: "États-Unis",
            type: "Université"
        },
        unite_recherche: {
            id_unite_recherche: 2,
            nom: "Centre de Recherche en Cryptographie Quantique",
            acronyme: "CRCQ",
            domaine: "Physique",
            id_etablissement: 2
        },
        disciplines: [
            {
                id_discipline: 2,
                nom: "Physique"
            }
        ],
        mots_cles: [
            { id_mot_cle: 5, mot: "Quantum Computing" },
            { id_mot_cle: 6, mot: "Cryptography" },
            { id_mot_cle: 7, mot: "Security" },
            { id_mot_cle: 8, mot: "Post-Quantum" }
        ],
        commentaires: []
    },
    {
        id_these: 3,
        titre: "Développement durable urbain dans les économies émergentes",
        resume: "Une analyse complète des pratiques de développement durable dans les centres urbains en croissance rapide à travers l'Afrique et l'Asie, en se concentrant sur les recommandations d'infrastructure et de politique. Cette recherche examine les défis uniques auxquels font face les villes en développement et propose des stratégies adaptées aux contextes locaux pour promouvoir une croissance urbaine durable.",
        date_soumission: "2024-01-10",
        date_inscription: "2021-11-01",
        date_fin_visee: "2024-11-01",
        date_soutenance: "2024-08-15",
        langue: "Français",
        url_pdf: "https://example.com/thesis3.pdf",
        statut: "soumise",
        id_doctorant: 3,
        id_directeur: 3,
        id_etablissement: 3,
        id_unite_recherche: 3,
        doctorant: {
            id_utilisateur: 7,
            nom: "Okafor",
            prenom: "Amara",
            email: "amara.okafor@oxford.ac.uk",
            mot_de_passe: "",
            id_etablissement: 3,
            role: "doctorant",
            matricule: "DOC2021003",
            annee_inscription: 2021,
            id_unite_recherche: 3
        },
        directeur: {
            id_utilisateur: 8,
            nom: "Thompson",
            prenom: "David",
            email: "d.thompson@oxford.ac.uk",
            mot_de_passe: "",
            id_etablissement: 3,
            role: "docteur",
            domaine_recherche: "Sciences Environnementales"
        },
        etablissement: {
            id_etablissement: 3,
            nom: "University of Oxford",
            pays: "Royaume-Uni",
            type: "Université"
        },
        unite_recherche: {
            id_unite_recherche: 3,
            nom: "Institut de Développement Durable",
            acronyme: "IDD",
            domaine: "Sciences Environnementales",
            id_etablissement: 3
        },
        disciplines: [
            {
                id_discipline: 3,
                nom: "Sciences Environnementales"
            }
        ],
        mots_cles: [
            { id_mot_cle: 9, mot: "Sustainable Development" },
            { id_mot_cle: 10, mot: "Urban Planning" },
            { id_mot_cle: 11, mot: "Emerging Economies" },
            { id_mot_cle: 12, mot: "Infrastructure" }
        ],
        commentaires: []
    },
    {
        id_these: 4,
        titre: "Intelligence artificielle appliquée au diagnostic médical précoce",
        resume: "Cette thèse explore l'utilisation de techniques d'intelligence artificielle avancées pour améliorer le diagnostic médical précoce, en particulier dans la détection de maladies cardiovasculaires et de cancers. L'étude développe des algorithmes d'apprentissage automatique capables d'analyser des données médicales complexes pour identifier des patterns subtils indicateurs de pathologies naissantes.",
        date_soumission: "2023-12-20",
        date_inscription: "2020-09-01",
        date_fin_visee: "2023-09-01",
        date_soutenance: "2023-11-30",
        langue: "Français",
        url_pdf: "https://example.com/thesis4.pdf",
        statut: "archivée",
        id_doctorant: 4,
        id_directeur: 4,
        id_etablissement: 4,
        id_unite_recherche: 4,
        doctorant: {
            id_utilisateur: 9,
            nom: "Martin",
            prenom: "Sophie",
            email: "sophie.martin@sorbonne.fr",
            mot_de_passe: "",
            id_etablissement: 4,
            role: "doctorant",
            matricule: "DOC2020001",
            annee_inscription: 2020,
            id_unite_recherche: 4
        },
        directeur: {
            id_utilisateur: 10,
            nom: "Leroy",
            prenom: "Pierre",
            email: "pierre.leroy@sorbonne.fr",
            mot_de_passe: "",
            id_etablissement: 4,
            role: "docteur",
            domaine_recherche: "Intelligence Artificielle Médicale"
        },
        etablissement: {
            id_etablissement: 4,
            nom: "Université de Paris",
            pays: "France",
            type: "Université"
        },
        unite_recherche: {
            id_unite_recherche: 4,
            nom: "Laboratoire d'Intelligence Artificielle Médicale",
            acronyme: "LIAM",
            domaine: "Médecine",
            id_etablissement: 4
        },
        disciplines: [
            {
                id_discipline: 4,
                nom: "Médecine"
            }
        ],
        mots_cles: [
            { id_mot_cle: 13, mot: "Intelligence Artificielle" },
            { id_mot_cle: 14, mot: "Diagnostic Médical" },
            { id_mot_cle: 15, mot: "Machine Learning" },
            { id_mot_cle: 16, mot: "Santé" }
        ],
        commentaires: [
            {
                id_commentaire: 2,
                id_these: 4,
                id_utilisateur: 11,
                texte: "Travail remarquable sur l'application de l'IA en médecine. Les résultats obtenus ouvrent de nouvelles perspectives pour le diagnostic précoce.",
                date_commentaire: "2023-12-01T14:20:00Z",
                utilisateur: {
                    id_utilisateur: 11,
                    nom: "Moreau",
                    prenom: "Jean",
                    email: "jean.moreau@chu-paris.fr",
                    mot_de_passe: "",
                    id_etablissement: 4,
                    role: "docteur"
                }
            }
        ]
    },
    {
        id_these: 5,
        titre: "Optimisation des réseaux de neurones pour la reconnaissance vocale multilingue",
        resume: "Cette recherche se concentre sur l'optimisation des architectures de réseaux de neurones profonds pour améliorer la reconnaissance vocale dans des environnements multilingues. L'étude propose de nouvelles techniques d'entraînement et d'adaptation de domaine pour créer des systèmes de reconnaissance vocale plus robustes et précis, capables de traiter efficacement plusieurs langues simultanément.",
        date_soumission: "2023-11-15",
        date_inscription: "2020-10-01",
        date_fin_visee: "2023-10-01",
        date_soutenance: "2023-12-10",
        langue: "Anglais",
        url_pdf: "https://example.com/thesis5.pdf",
        statut: "validée",
        id_doctorant: 5,
        id_directeur: 5,
        id_etablissement: 5,
        id_unite_recherche: 5,
        doctorant: {
            id_utilisateur: 12,
            nom: "Zhang",
            prenom: "Wei",
            email: "wei.zhang@ethz.ch",
            mot_de_passe: "",
            id_etablissement: 5,
            role: "doctorant",
            matricule: "DOC2020002",
            annee_inscription: 2020,
            id_unite_recherche: 5
        },
        directeur: {
            id_utilisateur: 13,
            nom: "Mueller",
            prenom: "Hans",
            email: "hans.mueller@ethz.ch",
            mot_de_passe: "",
            id_etablissement: 5,
            role: "docteur",
            domaine_recherche: "Traitement du Signal"
        },
        etablissement: {
            id_etablissement: 5,
            nom: "ETH Zurich",
            pays: "Suisse",
            type: "École Doctorale"
        },
        unite_recherche: {
            id_unite_recherche: 5,
            nom: "Laboratoire de Traitement du Signal et de la Parole",
            acronyme: "LTSP",
            domaine: "Informatique",
            id_etablissement: 5
        },
        disciplines: [
            {
                id_discipline: 1,
                nom: "Informatique"
            }
        ],
        mots_cles: [
            { id_mot_cle: 17, mot: "Neural Networks" },
            { id_mot_cle: 18, mot: "Speech Recognition" },
            { id_mot_cle: 19, mot: "Multilingual" },
            { id_mot_cle: 20, mot: "Deep Learning" }
        ],
        commentaires: []
    }
];

// Function to load theses from API (replace this with your actual API call)
// async function loadThesesFromAPI() {
//     try {
        // Replace this URL with your actual API endpoint
        // const response = await fetch('/api/theses');
        // const data = await response.json();
        // return data;
        // const response = await fetch('http://localhost:8081/api/theses/all');
        // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        //     return mockTheses;
        // }
        // For now, return mock data
    //    const data = await response.json();
    //    return data;
    // } catch (error) {
    //     console.error('Error loading theses:', error);
        // return mockTheses; // Fallback to mock data
    // }
// }

// Function to transform backend data to frontend format
function transformBackendData(backendTheses) {
    return backendTheses.map(thesis => ({
        id_these: thesis.id,
        titre: thesis.titre,
        resume: thesis.resume,
        date_soumission: thesis.dateSoumission,
        date_inscription: thesis.dateInscription,
        date_fin_visee: thesis.dateFinVisee,
        date_soutenance: thesis.dateSoutenance,
        langue: thesis.langue,
        url_pdf: thesis.urlPdf,
        statut: statusToStatus(thesis.statut),
        id_doctorant: thesis.doctorantId,
        id_directeur: thesis.chercheurId,
        // Add default values for missing nested objects
        doctorant: {
            nom: "Non spécifié",
            prenom: ""
        },
        directeur: {
            nom: "Non spécifié",
            prenom: ""
        },
        etablissement: {
            nom: "Établissement non spécifié"
        },
        disciplines: thesis.motCles ? [{ nom: thesis.motClesString }] : [],
        mots_cles: thesis.motClesString ? thesis.motClesString.split(',').map((mot,index) => ({
            id_mot_cle : index +1,
            mot : mot.trim()
        })) : []
    }));
}

// Updated loadThesesFromAPI function
async function loadThesesFromAPI() {
    try {
        const response = await fetch('http://localhost:8081/api/theses/all');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const backendData = await response.json();
        // Transform the data to match frontend expectations
        const transformedData = transformBackendData(backendData);
        return transformedData;
    } catch (error) {
        console.error('Error loading theses:', error);
        return mockTheses; // Fallback to mock data
    }
}


function statusToStatus(status){

    const statutTostatuT = {
       'EnCours':'en cours',
       'Soumise':'soumise' ,
       'Validee':'validée',
       'Archivee':'archivée'
    }

    // const currentStatus = statusToStatus[status] ?? 'null';
    const currentStatus = statutTostatuT[status] ?? status;
    return currentStatus;


}

async function loadFilterOptionsFromAPI() {
    try {
        const response = await fetch('http://localhost:8081/api/theses/filters');
        if (!response.ok) throw new Error("Erreur de chargement des filtres");
        const data = await response.json();

        populateSelect('statut-select', data.statuts);
        populateSelect('langue-select', data.langues);
        populateSelect('etablissement-select', data.etablissements);
        populateSelect('discipline-select', data.disciplines);
        populateSelect('annee-select', data.annees);
    } catch (error) {
        console.error("Erreur filtres dynamiques :", error);
    }
}

function populateSelect(selectId, values) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = `<option value="all">Tous</option>` + 
        values.map(v => `<option value="${v}">${v}</option>`).join('');
}
