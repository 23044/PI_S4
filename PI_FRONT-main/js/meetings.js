// Enhanced Meetings Management System
class MeetingsManager {
  constructor() {
    // API Configuration - Ready for backend integration
    this.apiConfig = {
      baseUrl: 'http://localhost:8081', // Replace with your API URL
      endpoints: {
        meetings: '/api/encadrants/meetings',
        students: '/api/encadrants',
        users: '/api/users'
      },
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        
      }
    };

    // Initialize empty arrays - data will be loaded from API
    this.meetings = [];
    this.students = [];
    
    // Filtres
    this.filters = {
      period: 'tous',
      student: 'tous'
    };
    this.isLoading = false;
    this.editingMeeting = null;
    
    // Initialize calendar and view state
    this.currentDate = new Date();
    this.currentView = 'calendar';
    this.selectedDate = null;
    
    // Initialize the application
    this.init();
  }

  // Initialize the application
  async init() {
    try {
      this.showLoading(true);
      await this.loadInitialData();
      this.initializeEventListeners();
      this.initializeCalendar();
      this.renderMeetings();
      this.showLoading(false);
    } catch (error) {
      console.error('Failed to initialize meetings manager:', error);
      this.showNotification('Échec du chargement des données de réunions', 'error');
      this.showLoading(false);
    }
  }

  // API Methods - Ready for backend integration
  async loadInitialData() {
    try {
      // Get the encadrant ID from localStorage
      const encadrantId = this.getCurrentEncadrantId();
      
      if (!encadrantId) {
        throw new Error('Encadrant ID not found in localStorage');
      }

      console.log('Loading meetings for encadrant:', encadrantId);

      
      
      
      
      // Mock students data for filters (you can replace this with API call later)
      // this.students = [
      //   { id: 'john-smith', name: 'Jean Dupont', email: 'jean.dupont@universite.fr' },
      //   { id: 'sarah-johnson', name: 'Sarah Martin', email: 'sarah.martin@universite.fr' },
      //   { id: 'michael-brown', name: 'Michel Bernard', email: 'michel.bernard@universite.fr' },
      //   { id: 'emma-wilson', name: 'Emma Dubois', email: 'emma.dubois@universite.fr' },
      //   { id: 'robert-davis', name: 'Robert Moreau', email: 'robert.moreau@universite.fr' }
      // ];

      const studentsResponse = await this.apiCall('GET', `/api/encadrants/${encadrantId}/etudiants/`);

      this.students = studentsResponse.map(student => this.mapBackendStudentToFrontend(student));
      
      // Make the actual API call to your backend
      const meetingsResponse = await this.apiCall('GET', `${this.apiConfig.endpoints.meetings}/${encadrantId}`);
      
      // Map the backend data to frontend format
      this.meetings = meetingsResponse.map(meeting => this.mapBackendToFrontend(meeting));
      
      console.log('Meetings loaded successfully:', this.meetings);

      // Ensure we have data (fallback to empty arrays if needed)
      if (!this.meetings) {
        this.meetings = [];
      }
      if (!this.students) {
        this.students = [];
      }

      this.populateStudentDropdowns();
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      
      // Initialize with empty arrays if API fails
      console.log('API call failed, initializing with empty data...');
      this.meetings = [];
      this.students = [];
      
      // Show a user-friendly error message
      this.showNotification('Impossible de charger les données depuis le serveur.', 'error');
    }
  }

  // mapBackendStudentToFrontend(backendStudent){
  //   return {
  //   id: backendStudent.id.toString(), // Convert to string to match existing format
  //   name: backendStudent.username, // username -> name
  //   email: backendStudent.email
  // }

  mapBackendStudentToFrontend(backendStudent) {
  return {
    id: backendStudent.id.toString(), 
    name: backendStudent.username, 
    email: backendStudent.email,
    
    year: null, 
    field: null 
  };
}

  getCurrentEncadrantId(){
    // Try different possible keys in localStorage
    const encadrant = localStorage.getItem('encadrant');
    let encadrantId = encadrant.id;
                     
    
    // If encadrant is stored as JSON object
    if (!encadrantId) {
      const encadrantData = localStorage.getItem('encadrant');
      if (encadrantData) {
        try {
          const encadrant = JSON.parse(encadrantData);
          encadrantId = encadrant.id || encadrant.encadrantId;
        } catch (e) {
          // If it's not JSON, treat it as plain string
          encadrantId = encadrantData;
        }
      }
    }
    
    if (!encadrantId) {
      console.warn('No encadrant ID found in localStorage');
      // Return default ID for testing
      return '10';
    }
    
    return encadrantId;
  }
  mapBackendToFrontend(backendMeeting) {
  return {
    id: backendMeeting.id,
    title: backendMeeting.titre, // titre -> title
    student: backendMeeting.etudiantId || 'unknown',
     studentName: backendMeeting.etudiant || 'Étudiant Inconnu',
     studentEmail: backendMeeting.etudiantEmail || '',
    // studentName: (this.students.find(s => s.id == backendMeeting.etudiantId)?.name) || 'Étudiant Inconnu',
    // studentEmail: (this.students.find(s => s.id == backendMeeting.etudiantId)?.email) || '',
    type: this.mapBackendTypeToFrontend(backendMeeting.type),
    date: backendMeeting.date, // Keep as is (YYYY-MM-DD format)
    time: backendMeeting.heure.substring(0, 5), // "09:00:00" -> "09:00"
    duration: backendMeeting.duree, // duree -> duration
    location: backendMeeting.lieu || 'Non spécifié', // lieu -> location
    description: backendMeeting.description || '',
    agenda: backendMeeting.agenda || '',
    status: this.mapBackendStatusToFrontend(backendMeeting.statut),
    notes: backendMeeting.notes || '',
    lienReunion: backendMeeting.lienReunion || '',
    rappelEnvoye: backendMeeting.rappelEnvoye || false,
    createdAt: backendMeeting.dateCreation,
    updatedAt: backendMeeting.dateModification,
    dateHeure: backendMeeting.dateHeure
  };
}

  // Map backend enum types to frontend format
  mapBackendTypeToFrontend(backendType) {
    const typeMapping = {
      'CONSULTATION': 'consultation',
      'SUIVI_PROGRES': 'suivi-progres',
      'SOUTENANCE_THESE': 'soutenance-these',
      'DISCUSSION_RECHERCHE': 'discussion-recherche',
      'REVUE_PROPOSITION': 'revue-proposition',
      'DISCUSSION_METHODOLOGIE': 'discussion-methodologie',
      'REVUE_FINALE': 'revue-finale',
      'AUTRE': 'autre'
    };
    return typeMapping[backendType] || backendType.toLowerCase();
  }

  // Map backend status to frontend format
  mapBackendStatusToFrontend(backendStatus) {
    const statusMapping = {
      'PLANIFIEE': 'a-venir',
      'EN_COURS': 'en-cours',
      'TERMINEE': 'terminee',
      'ANNULEE': 'annulee',
      'REPORTEE': 'reportee',
      'ABSENCE': 'absence'
    };
    return statusMapping[backendStatus] || backendStatus.toLowerCase();
  }

  async apiCall(method, endpoint, data = null) {
    const url = `${this.apiConfig.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: this.apiConfig.headers,
      credentials: this.apiConfig.credentials
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      console.log(`Making ${method} request to: ${url}`);
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - redirect to login
          console.error('Unauthorized access - redirecting to login');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const jsonResponse = await response.json();
        console.log(`API Response from ${endpoint}:`, jsonResponse);
        return jsonResponse;
      } else {
        return null; // For DELETE requests that return no content
      }
      
    } catch (error) {
      console.error(`API call failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }

  getAuthToken() {
    // Get token from localStorage, sessionStorage, or cookies
    return localStorage.getItem('authToken') || 'demo-token';
  }

  // Event Listeners
  initializeEventListeners() {
    // Navigation
    document.querySelectorAll('[data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showSection(link.dataset.section);
      });
    });

    // View toggles
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchView(btn.dataset.view);
      });
    });

    // Calendar navigation
    this.addEventListenerSafe('prev-month', 'click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    this.addEventListenerSafe('next-month', 'click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });

    this.addEventListenerSafe('today-btn', 'click', () => {
      this.currentDate = new Date();
      this.renderCalendar();
    });

    // Filters
    this.addEventListenerSafe('meeting-filter', 'change', (e) => {
      this.filters.period = e.target.value;
      this.renderMeetings();
    });

    this.addEventListenerSafe('student-filter', 'change', (e) => {
      this.filters.student = e.target.value;
      this.renderMeetings();
    });

    // New meeting modal
    this.addEventListenerSafe('new-meeting-btn', 'click', () => {
      this.showNewMeetingModal();
    });

    this.addEventListenerSafe('create-first-meeting', 'click', () => {
      this.showNewMeetingModal();
    });

    this.addEventListenerSafe('close-new-meeting-modal', 'click', () => {
      this.hideNewMeetingModal();
    });

    this.addEventListenerSafe('cancel-meeting', 'click', () => {
      this.hideNewMeetingModal();
    });

    // Meeting form
    this.addEventListenerSafe('new-meeting-form', 'submit', (e) => {
      e.preventDefault();
      this.handleMeetingSubmit();
    });

    // Meeting details modal
    this.addEventListenerSafe('close-modal', 'click', () => {
      this.hideMeetingModal();
    });

    // Confirmation modal
    this.addEventListenerSafe('close-confirm-modal', 'click', () => {
      this.hideConfirmModal();
    });

    this.addEventListenerSafe('confirm-cancel', 'click', () => {
      this.hideConfirmModal();
    });

    // Search
    this.addEventListenerSafe('meeting-search', 'input', (e) => {
      this.debounce(() => this.searchMeetings(e.target.value), 300)();
    });

    // Modal background clicks
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay') || e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    // Sidebar toggle
    this.addEventListenerSafe('open-sidebar', 'click', () => {
      document.querySelector('.sidebar')?.classList.add('active');
    });

    this.addEventListenerSafe('close-sidebar', 'click', () => {
      document.querySelector('.sidebar')?.classList.remove('active');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  addEventListenerSafe(elementId, event, handler) {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener(event, handler);
    }
  }

  // Utility Functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
    });
  }

  showLoading(show) {
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    
    if (loadingState) {
      loadingState.style.display = show ? 'flex' : 'none';
    }
    
    if (emptyState && !show) {
      emptyState.style.display = 'none';
    }
    
    this.isLoading = show;
  }

  showEmptyState(show) {
    const emptyState = document.getElementById('empty-state');
    const loadingState = document.getElementById('loading-state');
    
    if (emptyState) {
      emptyState.style.display = show ? 'flex' : 'none';
    }
    
    if (loadingState) {
      loadingState.style.display = 'none';
    }
  }

  // Navigation
  showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
      section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update navigation
    document.querySelectorAll('[data-section]').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    // Titres de navigation
    const titles = {
      overview: 'Tableau de Bord Encadrant',
      students: 'Mes Étudiants',
      reviews: 'Révisions de Thèses',
      meetings: 'Réunions',
      messages: 'Messages',
      profile: 'Mon Profil',
      settings: 'Paramètres'
    };
    
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
      pageTitle.textContent = titles[sectionId] || 'Tableau de Bord';
    }
  }

  // View Management
  switchView(view) {
    this.currentView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-view="${view}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    // Show/hide views
    document.querySelectorAll('.meeting-view').forEach(viewEl => {
      viewEl.classList.remove('active');
    });
    
    const targetView = document.getElementById(`${view}-view`);
    if (targetView) {
      targetView.classList.add('active');
    }

    if (view === 'calendar') {
      this.renderCalendar();
    } else {
      this.renderMeetingsList();
    }
  }

  // Calendar Functions
  initializeCalendar() {
    this.renderCalendar();
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Mettre à jour l'affichage du mois
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const currentMonthEl = document.getElementById('current-month');
    if (currentMonthEl) {
      currentMonthEl.textContent = `${monthNames[month]} ${year}`;
    }

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Clear calendar
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;
    
    calendarDays.innerHTML = '';

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      const dayEl = this.createCalendarDay(prevDate, true);
      calendarDays.appendChild(dayEl);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEl = this.createCalendarDay(date, false);
      calendarDays.appendChild(dayEl);
    }

    // Add empty cells for days after the last day of the month
    const remainingCells = 42 - (startingDayOfWeek + daysInMonth);
    for (let i = 1; i <= remainingCells && remainingCells < 7; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dayEl = this.createCalendarDay(nextDate, true);
      calendarDays.appendChild(dayEl);
    }
  }

  createCalendarDay(date, isOtherMonth) {
    const dayEl = document.createElement('div');
    dayEl.classList.add('calendar-day');
    
    if (isOtherMonth) {
      dayEl.classList.add('other-month');
    }

    // Vérifier si c'est aujourd'hui
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      dayEl.classList.add('today');
    }

    // Obtenir les réunions pour ce jour
    const dayMeetings = this.getMeetingsForDate(date);
    if (dayMeetings.length > 0) {
      dayEl.classList.add('has-meetings');
    }

    // Créer le numéro du jour
    const dayNumber = document.createElement('div');
    dayNumber.classList.add('day-number');
    dayNumber.textContent = date.getDate();
    dayEl.appendChild(dayNumber);

    // Créer le conteneur des réunions
    const meetingsContainer = document.createElement('div');
    meetingsContainer.classList.add('day-meetings');
    
    dayMeetings.slice(0, 3).forEach(meeting => { // Afficher max 3 réunions
      const meetingEl = document.createElement('div');
      meetingEl.classList.add('calendar-meeting');
      meetingEl.textContent = `${meeting.time} - ${this.truncateText(meeting.title, 20)}`;
      meetingEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showMeetingDetails(meeting);
      });
      meetingsContainer.appendChild(meetingEl);
    });

    // Afficher l'indicateur "plus" s'il y a plus de 3 réunions
    if (dayMeetings.length > 3) {
      const moreEl = document.createElement('div');
      moreEl.classList.add('calendar-meeting');
      moreEl.textContent = `+${dayMeetings.length - 3} autres`;
      moreEl.style.opacity = '0.7';
      meetingsContainer.appendChild(moreEl);
    }

    dayEl.appendChild(meetingsContainer);

    // Ajouter un gestionnaire de clic pour le jour
    dayEl.addEventListener('click', () => {
      this.selectDate(date);
    });

    return dayEl;
  }

  getMeetingsForDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    return this.meetings.filter(meeting => meeting.date === dateStr);
  }

  selectDate(date) {
    this.selectedDate = date;
    // Pourrait implémenter la fonctionnalité de sélection de date ici
    console.log('Date sélectionnée:', date);
  }

  // Meeting Management
  renderMeetings() {
    if (this.isLoading) return;
    
    if (this.currentView === 'calendar') {
      this.renderCalendar();
    } else {
      this.renderMeetingsList();
    }
  }

  renderMeetingsList() {
    const meetingsList = document.getElementById('meetings-list');
    if (!meetingsList) return;
    
    const filteredMeetings = this.getFilteredMeetings();
    
    if (filteredMeetings.length === 0) {
      this.showEmptyState(true);
      meetingsList.innerHTML = '';
      return;
    }

    this.showEmptyState(false);
    
    meetingsList.innerHTML = filteredMeetings.map(meeting => `
      <div class="meeting-item" data-meeting-id="${meeting.id}">
        <div class="meeting-time">
          <div class="meeting-date">${this.formatDate(meeting.date)}</div>
          <div class="meeting-hours">${meeting.time}</div>
        </div>
        <div class="meeting-info">
          <h3 class="meeting-title">${this.escapeHtml(meeting.title)}</h3>
          <div class="meeting-details">
            <strong>Étudiant:</strong> ${this.escapeHtml(meeting.studentName)} • 
            <strong>Type:</strong> ${this.formatMeetingType(meeting.type)} • 
            <strong>Durée:</strong> ${meeting.duration} min
          </div>
          <div class="meeting-meta">
            <span><strong>Lieu:</strong> ${this.escapeHtml(meeting.location)}</span>
          </div>
        </div>
        <div class="meeting-status ${meeting.status}">
          ${this.formatStatus(meeting.status)}
        </div>
        <div class="meeting-actions">
          <button class="btn btn-small btn-secondary" onclick="meetingsManager.editMeeting(${meeting.id})">Modifier</button>
          <button class="btn btn-small btn-secondary" onclick="meetingsManager.showMeetingDetails(${meeting.id})">Voir</button>
        </div>
      </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.meeting-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn')) {
          const meetingId = parseInt(item.dataset.meetingId);
          this.showMeetingDetails(meetingId);
        }
      });
    });
  }

  getFilteredMeetings() {
    let filtered = [...this.meetings];

    // Filtrer par étudiant
    if (this.filters.student !== 'tous') {
      filtered = filtered.filter(meeting => meeting.student === this.filters.student);
    }

    // Filtrer par période
    if (this.filters.period !== 'tous') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(meeting => {
        const meetingDate = new Date(meeting.date);
        
        switch (this.filters.period) {
          case 'aujourdhui':
            return meetingDate.toDateString() === today.toDateString();
          case 'semaine':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return meetingDate >= weekStart && meetingDate <= weekEnd;
          case 'mois':
            return meetingDate.getMonth() === today.getMonth() && 
                   meetingDate.getFullYear() === today.getFullYear();
          case 'a-venir':
            return meetingDate >= today;
          case 'passees':
            return meetingDate < today;
          default:
            return true;
        }
      });
    }

    // Trier par date et heure
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    });

    return filtered;
  }

  searchMeetings(query) {
    if (!query.trim()) {
      this.renderMeetings();
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = this.meetings.filter(meeting => 
      meeting.title.toLowerCase().includes(searchTerm) ||
      meeting.studentName.toLowerCase().includes(searchTerm) ||
      meeting.description.toLowerCase().includes(searchTerm) ||
      meeting.location.toLowerCase().includes(searchTerm) ||
      meeting.type.toLowerCase().includes(searchTerm)
    );

    if (this.currentView === 'list') {
      this.renderFilteredMeetingsList(filtered);
    }
  }

  renderFilteredMeetingsList(meetings) {
    const meetingsList = document.getElementById('meetings-list');
    if (!meetingsList) return;
    
    if (meetings.length === 0) {
      this.showEmptyState(true);
      meetingsList.innerHTML = '';
      return;
    }

    this.showEmptyState(false);
    
    meetingsList.innerHTML = meetings.map(meeting => `
      <div class="meeting-item" data-meeting-id="${meeting.id}">
        <div class="meeting-time">
          <div class="meeting-date">${this.formatDate(meeting.date)}</div>
          <div class="meeting-hours">${meeting.time}</div>
        </div>
        <div class="meeting-info">
          <h3 class="meeting-title">${this.escapeHtml(meeting.title)}</h3>
          <div class="meeting-details">
            <strong>Student:</strong> ${this.escapeHtml(meeting.studentName)} • 
            <strong>Type:</strong> ${this.formatMeetingType(meeting.type)} • 
            <strong>Duration:</strong> ${meeting.duration} min
          </div>
          <div class="meeting-meta">
            <span><strong>Location:</strong> ${this.escapeHtml(meeting.location)}</span>
          </div>
        </div>
        <div class="meeting-status ${meeting.status}">
          ${this.formatStatus(meeting.status)}
        </div>
        <div class="meeting-actions">
          <button class="btn btn-small btn-secondary" onclick="meetingsManager.editMeeting(${meeting.id})">Edit</button>
          <button class="btn btn-small btn-secondary" onclick="meetingsManager.showMeetingDetails(${meeting.id})">View</button>
        </div>
      </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.meeting-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn')) {
          const meetingId = parseInt(item.dataset.meetingId);
          this.showMeetingDetails(meetingId);
        }
      });
    });
  }

  // Modal Management
  showMeetingDetails(meetingId) {
    const meeting = typeof meetingId === 'object' ? meetingId : this.meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    const modal = document.getElementById('meeting-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalTitle || !modalBody) return;

    modalTitle.textContent = meeting.title;
      modalBody.innerHTML = `
      <div class="meeting-details-content">
        <div class="detail-group">
          <h4>Informations Étudiant</h4>
          <p><strong>Nom:</strong> ${this.escapeHtml(meeting.studentName)}</p>
          <p><strong>Email:</strong> ${this.escapeHtml(meeting.studentEmail || 'N/A')}</p>
        </div>
        <div class="detail-group">
          <h4>Détails de la Réunion</h4>
          <p><strong>Date:</strong> ${this.formatDate(meeting.date)}</p>
          <p><strong>Heure:</strong> ${meeting.time}</p>
          <p><strong>Durée:</strong> ${meeting.duration} minutes</p>
          <p><strong>Type:</strong> ${this.formatMeetingType(meeting.type)}</p>
        </div>
        <div class="detail-group">
          <h4>Lieu</h4>
          <p>${this.escapeHtml(meeting.location)}</p>
        </div>
        <div class="detail-group">
          <h4>Statut</h4>
          <p class="meeting-status ${meeting.status}">${this.formatStatus(meeting.status)}</p>
        </div>
        ${meeting.description ? `
          <div class="detail-group">
            <h4>Description/Agenda</h4>
            <p>${this.escapeHtml(meeting.description)}</p>
          </div>
        ` : ''}
        <div class="detail-actions">
          <button class="btn btn-secondary" onclick="meetingsManager.editMeeting(${meeting.id})">Modifier la Réunion</button>
          <button class="btn btn-danger" onclick="meetingsManager.confirmDeleteMeeting(${meeting.id})">Supprimer la Réunion</button>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  hideMeetingModal() {
    const modal = document.getElementById('meeting-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  showNewMeetingModal() {
    const modal = document.getElementById('new-meeting-modal');
    const form = document.getElementById('new-meeting-form');
    const modalTitle = document.getElementById('form-modal-title');
    
    if (!modal || !form || !modalTitle) return;
    if (!this.editingMeeting) {
    // Reset form
    form.reset();
    // this.editingMeeting = null;
    modalTitle.textContent = 'Schedule New Meeting';
    
    // Set default date to today
    const today = new Date();
    const dateInput = document.getElementById('meeting-date');
    if (dateInput) {
      dateInput.value = today.toISOString().split('T')[0];
      dateInput.min = today.toISOString().split('T')[0]; // Prevent past dates
    }
    
    // Set default time to next hour
    const nextHour = new Date(today.getTime() + 60 * 60 * 1000);
    const timeInput = document.getElementById('meeting-time');
    if (timeInput) {
      timeInput.value = nextHour.toTimeString().slice(0, 5);
    }
    
    // Update submit button
    const submitBtn = document.getElementById('submit-meeting');
    if (submitBtn) {
      submitBtn.querySelector('.btn-text').textContent = 'Schedule Meeting';
    }
  }
    
    modal.classList.add('active');
  }

  hideNewMeetingModal() {
    const modal = document.getElementById('new-meeting-modal');
    const form = document.getElementById('new-meeting-form');
    
    if (modal) {
      modal.classList.remove('active');
    }
    
    if (form) {
      form.reset();
    }
    
    this.editingMeeting = null;
  }

  async handleMeetingSubmit() {
    const form = document.getElementById('new-meeting-form');
    const submitBtn = document.getElementById('submit-meeting');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    
    if (!form || !this.validateForm(form)) {
      return;
    }

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline';
    }

    try {
      const formData = new FormData(form);
      const meetingData = this.extractFormData(formData);
      
      if (this.editingMeeting) {
        await this.updateMeeting(this.editingMeeting.id, meetingData);
      } else {
        await this.createMeeting(meetingData);
      }
      
      this.hideNewMeetingModal();
      this.renderMeetings();
      
      const action = this.editingMeeting ? 'updated' : 'created';
      this.showNotification(`Réunion ${action === 'created' ? 'créée' : 'mise à jour'} avec succès !`, 'success');
      
    } catch (error) {
      console.error('Error saving meeting:', error);
      this.showNotification('Échec de l\'enregistrement de la réunion. Veuillez réessayer.', 'error');
    } finally {
      // Reset loading state
      if (submitBtn) {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
      }
    }
  }

  validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#ff6b6b';
        isValid = false;
      } else {
        field.style.borderColor = '#e1e8ed';
      }
    });
    
    if (!isValid) {
      this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
    }
    
    return isValid;
  }

  extractFormData(formData) {
    const studentSelect = document.getElementById('meeting-student');
    const studentName = studentSelect?.options[studentSelect.selectedIndex]?.text || '';
    
    return {
      title: formData.get('title'),
      student: formData.get('student'),
      studentName: studentName,
      studentEmail: this.getStudentEmail(formData.get('student')),
      type: formData.get('type'),
      date: formData.get('date'),
      time: formData.get('time'),
      duration: parseInt(formData.get('duration')),
      location: formData.get('location') || 'TBD',
      description: formData.get('description') || '',
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // getStudentEmail(studentId) {
  //   const student = this.students.find(s => s.id === studentId);
  //   return student ? student.email : '';
  // }
  getStudentEmail(studentId) {
  const student = this.students.find(s => s.id === studentId || s.id === studentId.toString());
  return student ? student.email : '';
}

populateStudentDropdowns(){
  const studentFilter = document.getElementById('student-filter');
  const meetingStudentSelect = document.getElementById('meeting-student');
  if(studentFilter){
    studentFilter.innerHTML = '<option value="tous">Tous les Étudiants</option>';
    this.students.forEach(student => {
      const option = document.createElement('option');
      option.value = student.id;
      option.textContent = student.name;
      studentFilter.appendChild(option);
    });
  }
  if(meetingStudentSelect){
    meetingStudentSelect.innerHTML = '<option value="">Sélectionner l\'Étudiant</option>';

    this.students.forEach(student => {
      const option = document.createElement('option');
      option.value = student.id;
      option.textContent = student.name;
      meetingStudentSelect.appendChild(option);
    });
  }
    
  console.log('Student dropdowns populated with', this.students.length, 'students');

}

transformToBackendFormat(frontendData) {
  return {
    titre: frontendData.title,
    date: frontendData.date,
    heure: frontendData.time + ":00", // Add seconds
    duree: frontendData.duration,
    lieu: frontendData.location,
    description: frontendData.description,
    etudiant: frontendData.studentName, // Use name, not ID
    agenda: frontendData.agenda || "",
    type: this.mapFrontendTypeToBackend(frontendData.type),
    statut: "PLANIFIEE",
    lienReunion: frontendData.lienReunion || "",
    notes: frontendData.notes || "",
    rappelEnvoye: false,
    encadrant: {
      id: parseInt(this.getCurrentEncadrantId())
    }
  };
}

mapFrontendTypeToBackend(frontendType) {
  const typeMapping = {
    'consultation': 'CONSULTATION',
    'suivi-progres': 'SUIVI_PROGRES',
    'soutenance-these': 'SOUTENANCE_THESE',
    'discussion-recherche': 'DISCUSSION_RECHERCHE',
    'revue-proposition': 'REVUE_PROPOSITION'
  };
  return typeMapping[frontendType] || 'CONSULTATION';
}

  async createMeeting(meetingData) {
    try {
      // API call when ready
      // const response = await this.apiCall('POST', this.apiConfig.endpoints.meetings, meetingData);
      // const newMeeting = response.data;
      
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // const newMeeting = {
      //   id: Date.now(),
      //   ...meetingData
      // };
      
      // this.meetings.push(newMeeting);

      const backendData = this.transformToBackendFormat(meetingData);
    
    console.log('Creating meeting with data:', backendData);
    
     const response = await this.apiCall('POST', this.apiConfig.endpoints.meetings, backendData);

     const newMeeting = this.mapBackendToFrontend(response);
    this.meetings.push(newMeeting);

      console.log('Meeting created successfully:', newMeeting);
      
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  }

  async updateMeeting(meetingId, meetingData) {
    try {
      // API call when ready
      // const response = await this.apiCall('PUT', `${this.apiConfig.endpoints.meetings}/${meetingId}`, meetingData);
      // const updatedMeeting = response.data;
      
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // const meetingIndex = this.meetings.findIndex(m => m.id === meetingId);
      // if (meetingIndex !== -1) {
      //   this.meetings[meetingIndex] = {
      //     ...this.meetings[meetingIndex],
      //     ...meetingData,
      //     updatedAt: new Date().toISOString()
      //   };
      // }

      const backendData  = this.transformToBackendFormat(meetingData);
      console.log('Updating meeting with data:', backendData);

      const response = await this.apiCall('PUT', `/api/encadrants/meeting/update/${meetingId}`, backendData);

      const updatedMeeting = this.mapBackendToFrontend(response);
      const meetingIndex = this.meetings.findIndex(m => m.id === meetingId);

      if (meetingIndex !== -1) {
      this.meetings[meetingIndex] = updatedMeeting;
    }
    console.log('Meeting updated successfully:', updatedMeeting);

    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  }

  editMeeting(meetingId) {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    this.editingMeeting = meeting;

    this.populateStudentDropdowns();

    // Fill form with existing data

    console.log('=== DEBUG: editMeeting ===');
  console.log('Meeting data:', meeting);
  console.log('Meeting student value:', meeting.student);

  const studentSelect = document.getElementById('meeting-student');
  if (studentSelect) {
    console.log('Available student options:', 
      Array.from(studentSelect.options).map(opt => ({ value: opt.value, text: opt.textContent }))
    );
  }
    const fields = {
      'meeting-title': meeting.title,
      'meeting-student': meeting.student,
      'meeting-type': meeting.type,
      'meeting-date': meeting.date,
      'meeting-time': meeting.time,
      'meeting-duration': meeting.duration.toString(),
      'meeting-location': meeting.location,
      'meeting-description': meeting.description
    };

    // Object.entries(fields).forEach(([id, value]) => {
    //   const element = document.getElementById(id);
    //   if (element) {
    //     element.value = value;
    //   }
    // });

    Object.entries(fields).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      console.log(`Setting ${id} to:`, value); // ADD THIS DEBUG
      element.value = value;
      console.log(`Actual value set:`, element.value); // ADD THIS DEBUG
    }
  });

    // Update modal title and button
    const modalTitle = document.getElementById('form-modal-title');
    const submitBtn = document.getElementById('submit-meeting');
    
    if (modalTitle) {
      modalTitle.textContent = 'Edit Meeting';
    }
    
    if (submitBtn) {
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) {
        btnText.textContent = 'Update Meeting';
      }
    }
    
    this.hideMeetingModal();
    this.showNewMeetingModal();
  }

  confirmDeleteMeeting(meetingId) {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    this.showConfirmModal(
      'Supprimer la Réunion',
      `Êtes-vous sûr de vouloir supprimer "${meeting.title}" ? Cette action ne peut pas être annulée.`,
      () => this.deleteMeeting(meetingId)
    );
  }

  async deleteMeeting(meetingId) {
    try {
      // API call when ready
      // await this.apiCall('DELETE', `${this.apiConfig.endpoints.meetings}/${meetingId}`);
      
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 500));
       await this.apiCall('DELETE', `/api/encadrants/meeting/delete/${meetingId}`);
    
      
      this.meetings = this.meetings.filter(m => m.id !== meetingId);
      this.hideMeetingModal();
      this.hideConfirmModal();
      this.renderMeetings();
      this.showNotification('Réunion supprimée avec succès !', 'success');
      
    } catch (error) {
      console.error('Error deleting meeting:', error);
      this.showNotification('Échec de la suppression de la réunion. Veuillez réessayer.', 'error');
    }
  }

  showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const titleEl = document.getElementById('confirm-title');
    const messageEl = document.getElementById('confirm-message');
    const confirmBtn = document.getElementById('confirm-action');
    
    if (!modal || !titleEl || !messageEl || !confirmBtn) return;
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    // Remove existing listeners and add new one
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener('click', () => {
      onConfirm();
    });
    
    modal.classList.add('active');
  }

  hideConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  // Utility Functions
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatMeetingType(type) {
    const types = {
      'consultation': 'Consultation',
      'suivi-progres': 'Suivi de Progrès',
      'soutenance-these': 'Soutenance de Thèse',
      'discussion-recherche': 'Discussion de Recherche',
      'revue-proposition': 'Revue de Proposition',
      'discussion-methodologie': 'Discussion Méthodologie',
      'revue-finale': 'Revue Finale',
      'autre': 'Autre'
    };
    return types[type] || type;
  }

  formatStatus(status) {
    const statuses = {
      'a-venir': 'À Venir',
      'en-cours': 'En Cours',
      'terminee': 'Terminée',
      'annulee': 'Annulée',
      'reportee': 'Reportée',
      'absence': 'Absence'
    };
    return statuses[status] || status;
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    }, 100);

    // Remove notification after 4 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }
}

// Initialize the meetings manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.meetingsManager = new MeetingsManager();
});

// Add notification styles dynamically
const notificationStyles = `
  .notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    padding: 1.25rem 1.75rem;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 400px;
    word-wrap: break-word;
  }
  
  .notification.success {
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  }
  
  .notification.error {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  }
  
  .notification.info {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  @media (max-width: 768px) {
    .notification {
      top: 1rem;
      right: 1rem;
      left: 1rem;
      max-width: none;
    }
  }
`;

// Add styles to document
if (!document.getElementById('notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = notificationStyles;
  document.head.appendChild(style);
}