// Pure Vanilla JavaScript Thesis Browser - No React Dependencies
class ThesisBrowser {
    constructor() {
        this.allTheses = [];
        this.filteredTheses = [];
        this.currentPage = 1;
        this.itemsPerPage = 2;
        this.viewMode = 'list';
        this.sortBy = 'date_desc';
        this.searchQuery = '';
        this.filters = {
            statut: 'all',
            langue: 'all',
            etablissement: 'all',
            discipline: 'all',
            annee: 'all'
        };
        
        this.init();
    }

    async init() {
        try {
            // Load data
            this.allTheses = await loadThesesFromAPI();
            this.filteredTheses = [...this.allTheses];
            
            await loadFilterOptionsFromAPI();

            // Bind events
            this.bindEvents();
            
            // Initial render
            this.updateResults();
        } catch (error) {
            console.error('Error initializing thesis browser:', error);
            this.showError('Erreur lors du chargement des thèses');
        }
    }

    bindEvents() {
        // Search input with debounce
        let searchTimeout;
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                this.showLoading(true);
                searchTimeout = setTimeout(() => {
                    this.searchQuery = e.target.value;
                    this.applyFiltersAndSearch();
                    this.showLoading(false);
                }, 300);
            });
        }

        // Filter dropdowns
        const filters = ['statut', 'langue', 'etablissement', 'discipline', 'annee'];
        filters.forEach(filterType => {
            const select = document.getElementById(`${filterType}-select`);
            if (select) {
                select.addEventListener('change', (e) => {
                    this.filters[filterType] = e.target.value;
                    this.applyFiltersAndSearch();
                });
            }
        });

        // Clear filters
        const clearButton = document.getElementById('clear-filters');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.sortResults();
                this.updateResults();
            });
        }

        // View mode toggle
        const listViewBtn = document.getElementById('list-view-btn');
        const gridViewBtn = document.getElementById('grid-view-btn');
        
        if (listViewBtn) {
            listViewBtn.addEventListener('click', () => {
                this.setViewMode('list');
            });
        }

        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', () => {
                this.setViewMode('grid');
            });
        }

        // Modal close
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Modal backdrop click
        const modal = document.getElementById('thesis-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'thesis-modal') {
                    this.closeModal();
                }
            });
        }

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    showLoading(show) {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        console.error(message);
        // You can implement a toast notification here
    }

    applyFiltersAndSearch() {
        let results = [...this.allTheses];

        // Apply text search
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            results = results.filter(thesis => {
                const searchableText = [
                    thesis.titre,
                    thesis.resume,
                    thesis.doctorant ? `${thesis.doctorant.prenom} ${thesis.doctorant.nom}` : '',
                    thesis.directeur ? `${thesis.directeur.prenom} ${thesis.directeur.nom}` : '',
                    thesis.etablissement ? thesis.etablissement.nom : '',
                    ...(thesis.mots_cles ? thesis.mots_cles.map(mc => mc.mot) : [])
                ].join(' ').toLowerCase();
                
                return searchableText.includes(query);
            });
        }

        // Apply filters
        Object.entries(this.filters).forEach(([key, value]) => {
            if (value !== 'all') {
                results = results.filter(thesis => {
                    switch (key) {
                        case 'statut':
                            return thesis.statut === value;
                        case 'langue':
                            return thesis.langue === value;
                        case 'etablissement':
                            return thesis.etablissement && thesis.etablissement.nom === value;
                        case 'discipline':
                            return thesis.disciplines && thesis.disciplines.some(d => d.nom === value);
                        case 'annee':
                            return new Date(thesis.date_soutenance).getFullYear().toString() === value;
                        default:
                            return true;
                    }
                });
            }
        });

        this.filteredTheses = results;
        this.currentPage = 1;
        this.sortResults();
        this.updateResults();
    }

    sortResults() {
        this.filteredTheses.sort((a, b) => {
            switch (this.sortBy) {
                case 'date_desc':
                    return new Date(b.date_soutenance).getTime() - new Date(a.date_soutenance).getTime();
                case 'date_asc':
                    return new Date(a.date_soutenance).getTime() - new Date(b.date_soutenance).getTime();
                case 'titre_asc':
                    return a.titre.localeCompare(b.titre);
                case 'titre_desc':
                    return b.titre.localeCompare(a.titre);
                case 'statut':
                    return a.statut.localeCompare(b.statut);
                default:
                    return 0;
            }
        });
    }

    clearFilters() {
        // Reset form elements
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        
        const selects = ['statut-select', 'langue-select', 'etablissement-select', 'discipline-select', 'annee-select', 'sort-select'];
        selects.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.value = id === 'sort-select' ? 'date_desc' : 'all';
            }
        });

        // Reset state
        this.searchQuery = '';
        this.filters = {
            statut: 'all',
            langue: 'all',
            etablissement: 'all',
            discipline: 'all',
            annee: 'all'
        };
        this.sortBy = 'date_desc';
        this.applyFiltersAndSearch();
    }

    setViewMode(mode) {
        this.viewMode = mode;
        const listBtn = document.getElementById('list-view-btn');
        const gridBtn = document.getElementById('grid-view-btn');

        if (listBtn && gridBtn) {
            if (mode === 'list') {
                listBtn.classList.add('bg-blue-600', 'text-white');
                listBtn.classList.remove('text-blue-600', 'hover:bg-blue-100');
                gridBtn.classList.remove('bg-blue-600', 'text-white');
                gridBtn.classList.add('text-blue-600', 'hover:bg-blue-100');
            } else {
                gridBtn.classList.add('bg-blue-600', 'text-white');
                gridBtn.classList.remove('text-blue-600', 'hover:bg-blue-100');
                listBtn.classList.remove('bg-blue-600', 'text-white');
                listBtn.classList.add('text-blue-600', 'hover:bg-blue-100');
            }
        }

        this.updateResults();
    }

    updateResults() {
        const totalResults = this.filteredTheses.length;
        const totalPages = Math.ceil(totalResults / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentTheses = this.filteredTheses.slice(startIndex, endIndex);

        // Update results count
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = 
                `${totalResults} thèse(s) trouvée(s)${totalResults !== this.allTheses.length ? ` sur ${this.allTheses.length} au total` : ''}`;
        }

        // Update results container
        const resultsContainer = document.getElementById('results-container');
        const noResults = document.getElementById('no-results');
        const paginationContainer = document.getElementById('pagination-container');

        if (totalResults === 0) {
            if (resultsContainer) resultsContainer.style.display = 'none';
            if (paginationContainer) paginationContainer.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
        } else {
            if (resultsContainer) {
                resultsContainer.style.display = 'block';
                // Set container class based on view mode
                resultsContainer.className = this.viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                    : 'space-y-6';

                // Render thesis cards
                resultsContainer.innerHTML = currentTheses.map(thesis => 
                    this.renderThesisCard(thesis, this.viewMode === 'grid')
                ).join('');

                // Bind thesis card events
                this.bindThesisCardEvents();
            }
            
            if (noResults) noResults.style.display = 'none';

            // Update pagination
            if (totalResults > this.itemsPerPage) {
                if (paginationContainer) {
                    paginationContainer.style.display = 'block';
                    this.updatePagination(totalResults, totalPages, startIndex, endIndex);
                }
            } else {
                if (paginationContainer) paginationContainer.style.display = 'none';
            }
        }
    }

    renderThesisCard(thesis, isGrid = false) {
        const statusColors = {
            'soumise': 'bg-yellow-100 text-yellow-800',
            'en cours': 'bg-blue-100 text-blue-800',
            'validée': 'bg-green-100 text-green-800',
            'archivée': 'bg-gray-100 text-gray-800'
        };

        const statusTexts = {
            'soumise': 'Soumise',
            'en cours': 'En cours',
            'validée': 'Validée',
            'archivée': 'Archivée'
        };

        const disciplineColors = {
            'Informatique': 'bg-purple-100 text-purple-800',
            'Physique': 'bg-green-100 text-green-800',
            'Mathématiques': 'bg-blue-100 text-blue-800',
            'Biologie': 'bg-emerald-100 text-emerald-800',
            'Chimie': 'bg-orange-100 text-orange-800',
            'Médecine': 'bg-red-100 text-red-800',
            'Sciences Environnementales': 'bg-teal-100 text-teal-800'
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        const highlightText = (text, query) => {
            if (!query.trim()) return text;
            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        };

        return `
            <div class="thesis-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 cursor-pointer ${isGrid ? 'p-4' : 'p-6'}" 
                 data-thesis-id="${thesis.id_these}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex flex-wrap gap-2">
                        ${thesis.disciplines && thesis.disciplines.length > 0 ? 
                            `<span class="px-3 py-1 rounded-full text-xs font-semibold ${disciplineColors[thesis.disciplines[0].nom] || 'bg-gray-100 text-gray-800'}">
                                ${thesis.disciplines[0].nom}
                            </span>` : ''
                        }
                        <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold">
                            Thèse de Doctorat
                        </span>
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColors[thesis.statut] || 'bg-gray-100 text-gray-800'}">
                            ${statusTexts[thesis.statut] || thesis.statut}
                        </span>
                    </div>
                </div>

                <h4 class="font-bold text-blue-900 mb-3 hover:text-blue-700 transition-colors ${isGrid ? 'text-base line-clamp-2' : 'text-lg'}">
                    ${highlightText(thesis.titre, this.searchQuery)}
                </h4>

                <div class="flex flex-wrap items-center gap-4 mb-4 text-sm text-blue-600 ${isGrid ? 'text-xs' : ''}">
                    <div class="flex items-center space-x-1">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span>${thesis.doctorant ? highlightText(`${thesis.doctorant.prenom} ${thesis.doctorant.nom}`, this.searchQuery) : 'Doctorant non spécifié'}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>${formatDate(thesis.date_soutenance)}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <span>${thesis.etablissement ? highlightText(thesis.etablissement.nom, this.searchQuery) : 'Établissement non spécifié'}</span>
                    </div>
                </div>

                ${!isGrid ? `
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                        ${highlightText(thesis.resume, this.searchQuery)}
                    </p>
                ` : ''}

                <div class="flex flex-wrap gap-2 mb-4">
                    ${thesis.mots_cles ? thesis.mots_cles.slice(0, isGrid ? 2 : 4).map(motCle => 
                        `<span class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                            ${highlightText(motCle.mot, this.searchQuery)}
                        </span>`
                    ).join('') : ''}
                </div>

                <div class="flex items-center justify-between ${isGrid ? 'text-xs' : ''}">
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <div class="flex items-center space-x-1">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                            </svg>
                            <span>${thesis.langue}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            <span>${thesis.commentaires ? thesis.commentaires.length : 0}</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button 
                            class="pdf-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            data-pdf-url="${thesis.url_pdf}"
                        >
                            Voir PDF
                        </button>
                        <button 
                            class="details-btn border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Détails
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    bindThesisCardEvents() {
        // Bind click events for thesis cards
        const thesisCards = document.querySelectorAll('.thesis-card');
        thesisCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on buttons
                if (e.target.closest('.pdf-btn') || e.target.closest('.details-btn')) {
                    return;
                }
                
                const thesisId = parseInt(card.dataset.thesisId);
                this.openModal(thesisId);
            });
        });

        // Bind PDF button events
        const pdfButtons = document.querySelectorAll('.pdf-btn');
        pdfButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const pdfUrl = btn.dataset.pdfUrl;
                if (pdfUrl) {
                    window.open(pdfUrl, '_blank');
                }
            });
        });

        // Bind details button events
        const detailsButtons = document.querySelectorAll('.details-btn');
        detailsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.thesis-card');
                const thesisId = parseInt(card.dataset.thesisId);
                this.openModal(thesisId);
            });
        });
    }

    updatePagination(totalResults, totalPages, startIndex, endIndex) {
        const paginationInfo = document.getElementById('pagination-info');
        const paginationButtons = document.getElementById('pagination-buttons');

        if (paginationInfo) {
            paginationInfo.textContent = `Affichage de ${startIndex + 1} à ${Math.min(endIndex, totalResults)} sur ${totalResults} résultats`;
        }

        if (paginationButtons) {
            let buttonsHTML = `
                <button 
                    class="pagination-btn prev-btn px-4 py-2 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    ${this.currentPage === 1 ? 'disabled' : ''}
                    data-page="${this.currentPage - 1}"
                >
                    Précédent
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                buttonsHTML += `
                    <button
                        class="pagination-btn page-btn px-4 py-2 rounded-lg transition-colors ${
                            this.currentPage === i
                                ? 'bg-blue-600 text-white'
                                : 'border border-blue-200 text-blue-600 hover:bg-blue-50'
                        }"
                        data-page="${i}"
                    >
                        ${i}
                    </button>
                `;
            }

            buttonsHTML += `
                <button 
                    class="pagination-btn next-btn px-4 py-2 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    ${this.currentPage === totalPages ? 'disabled' : ''}
                    data-page="${this.currentPage + 1}"
                >
                    Suivant
                </button>
            `;

            paginationButtons.innerHTML = buttonsHTML;

            // Bind pagination events
            const paginationBtns = paginationButtons.querySelectorAll('.pagination-btn');
            paginationBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (!btn.disabled) {
                        const page = parseInt(btn.dataset.page);
                        this.setPage(page);
                    }
                });
            });
        }
    }

    setPage(page) {
        const totalPages = Math.ceil(this.filteredTheses.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateResults();
            
            // Scroll to top of results
            const resultsContainer = document.getElementById('results-container');
            if (resultsContainer) {
                resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    openModal(thesisId) {
        const thesis = this.allTheses.find(t => t.id_these === thesisId);
        if (!thesis) return;

        const modal = document.getElementById('thesis-modal');
        const modalContent = document.getElementById('modal-content');

        if (modal && modalContent) {
            modalContent.innerHTML = this.renderModalContent(thesis);
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('thesis-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    renderModalContent(thesis) {
        const statusColors = {
            'soumise': 'bg-yellow-100 text-yellow-800',
            'en cours': 'bg-blue-100 text-blue-800',
            'validée': 'bg-green-100 text-green-800',
            'archivée': 'bg-gray-100 text-gray-800'
        };

        const statusTexts = {
            'soumise': 'Soumise',
            'en cours': 'En cours',
            'validée': 'Validée',
            'archivée': 'Archivée'
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const formatDateTime = (dateString) => {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        return `
            <div class="mb-8">
                <div class="flex flex-wrap items-center gap-3 mb-4">
                    ${thesis.disciplines && thesis.disciplines.length > 0 ? 
                        `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ${thesis.disciplines[0].nom}
                        </span>` : ''
                    }
                    <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Thèse de Doctorat
                    </span>
                    <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusColors[thesis.statut] || 'bg-gray-100 text-gray-800'}">
                        ${statusTexts[thesis.statut] || thesis.statut}
                    </span>
                </div>

                <h1 class="text-2xl font-bold text-blue-900 mb-4 leading-tight">
                    ${thesis.titre}
                </h1>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="flex items-center space-x-2 text-blue-600">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="font-medium">Doctorant:</span>
                        <span>${thesis.doctorant ? `${thesis.doctorant.prenom} ${thesis.doctorant.nom}` : 'Non spécifié'}</span>
                    </div>
                    <div class="flex items-center space-x-2 text-blue-600">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="font-medium">Directeur:</span>
                        <span>${thesis.directeur ? `${thesis.directeur.prenom} ${thesis.directeur.nom}` : 'Non spécifié'}</span>
                    </div>
                    ${thesis.encadrant ? `
                        <div class="flex items-center space-x-2 text-blue-600">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <span class="font-medium">Encadrant:</span>
                            <span>${thesis.encadrant.prenom} ${thesis.encadrant.nom}</span>
                        </div>
                    ` : ''}
                    <div class="flex items-center space-x-2 text-blue-600">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <span>${thesis.etablissement ? thesis.etablissement.nom : 'Établissement non spécifié'}</span>
                    </div>
                    <div class="flex items-center space-x-2 text-blue-600">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="font-medium">Soutenance:</span>
                        <span>${formatDate(thesis.date_soutenance)}</span>
                    </div>
                    <div class="flex items-center space-x-2 text-blue-600">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                        </svg>
                        <span>${thesis.langue}</span>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3 mb-6">
                    <button 
                        onclick="window.open('${thesis.url_pdf}', '_blank')"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>Télécharger PDF</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-6">
                    <!-- Abstract -->
                    <div class="bg-blue-50 rounded-xl p-6">
                        <h3 class="text-lg font-bold text-blue-900 mb-3 flex items-center space-x-2">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span>Résumé</span>
                        </h3>
                        <p class="text-gray-700 leading-relaxed text-justify">
                            ${thesis.resume}
                        </p>
                    </div>

                    ${thesis.mots_cles && thesis.mots_cles.length > 0 ? `
                        <div class="bg-blue-50 rounded-xl p-6">
                            <h3 class="text-lg font-bold text-blue-900 mb-3">Mots-clés</h3>
                            <div class="flex flex-wrap gap-2">
                                ${thesis.mots_cles.map(motCle => 
                                    `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        ${motCle.mot}
                                    </span>`
                                ).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Comments Section -->
                    <div class="bg-blue-50 rounded-xl p-6">
                        <h3 class="text-lg font-bold text-blue-900 mb-6 flex items-center space-x-2">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            <span>Commentaires (${thesis.commentaires ? thesis.commentaires.length : 0})</span>
                        </h3>

                        <div class="space-y-4">
                            ${thesis.commentaires && thesis.commentaires.length > 0 ? 
                                thesis.commentaires.map(comment => `
                                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            </div>
                                            <div class="flex-1">
                                                <div class="flex items-center space-x-2 mb-2">
                                                    <span class="font-semibold text-blue-900">
                                                        ${comment.utilisateur ? `${comment.utilisateur.prenom} ${comment.utilisateur.nom}` : 'Utilisateur'}
                                                    </span>
                                                    <span class="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                        ${comment.utilisateur ? comment.utilisateur.role : 'Utilisateur'}
                                                    </span>
                                                    <span class="text-sm text-gray-500">•</span>
                                                    <span class="text-sm text-gray-500">${formatDateTime(comment.date_commentaire)}</span>
                                                </div>
                                                <p class="text-gray-700 mb-3 leading-relaxed">${comment.texte}</p>
                                            </div>
                                        </div>
                                    </div>
                                `).join('') : `
                                    <div class="text-center py-8 bg-white rounded-lg">
                                        <svg class="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                        </svg>
                                        <p class="text-gray-500">Aucun commentaire pour le moment.</p>
                                        <p class="text-sm text-gray-400">Soyez le premier à commenter cette thèse !</p>
                                    </div>
                                `
                            }
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Thesis Information -->
                    <div class="bg-blue-50 rounded-xl p-6">
                        <h3 class="text-lg font-bold text-blue-900 mb-4">Informations</h3>
                        <div class="space-y-3">
                            <div>
                                <span class="text-sm font-medium text-gray-600">Inscription:</span>
                                <p class="text-blue-900">${formatDate(thesis.date_inscription)}</p>
                            </div>
                            <div>
                                <span class="text-sm font-medium text-gray-600">Fin visée:</span>
                                <p class="text-blue-900">${formatDate(thesis.date_fin_visee)}</p>
                            </div>
                            <div>
                                <span class="text-sm font-medium text-gray-600">Soumission:</span>
                                <p class="text-blue-900">${formatDate(thesis.date_soumission)}</p>
                            </div>
                            ${thesis.unite_recherche ? `
                                <div>
                                    <span class="text-sm font-medium text-gray-600">Unité de recherche:</span>
                                    <p class="text-blue-900">${thesis.unite_recherche.nom}</p>
                                    <p class="text-sm text-gray-600">(${thesis.unite_recherche.acronyme})</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    ${thesis.etablissement ? `
                        <div class="bg-blue-50 rounded-xl p-6">
                            <h3 class="text-lg font-bold text-blue-900 mb-4">Établissement</h3>
                            <div>
                                <p class="font-medium text-blue-900">${thesis.etablissement.nom}</p>
                                <p class="text-sm text-gray-600">${thesis.etablissement.type}</p>
                                <p class="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                                    </svg>
                                    <span>${thesis.etablissement.pays}</span>
                                </p>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// Initialize the thesis browser when the page loads
let thesisBrowser;
document.addEventListener('DOMContentLoaded', function() {
    thesisBrowser = new ThesisBrowser();
});