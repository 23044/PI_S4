/**
 * Profile management functionality
 * Handles profile editing and display
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

 
  // profile loading data from the localStorage
  
 const user = JSON.parse(localStorage.getItem('doctolearn_user'));
  const doctorant = JSON.parse(localStorage.getItem('doctorant'));

  const these = JSON.parse(localStorage.getItem('these'));
  
  // Debug: Log the user object to see its structure
  console.log('User object from localStorage:', user);
  console.log('Available properties:', Object.keys(user || {}));
  loadResearchUnits(doctorant.UniteRechercheNom);
   loadDoctoralSchools(user.etablissementNom);
  if (user) {
    // Handle different possible property names for firstName and lastName
    const firstName = user.firstName || user.firstname || user.FirstName || '';
    const lastName = user.lastName || user.lastname || user.LastName || '';
    
    document.getElementById('edit-firstname').value = firstName;
    document.getElementById('edit-lastname').value = lastName;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-phone').value = user.phoneNumber;
    document.getElementById('edit-birth-date').value = user.birthdate;
    document.getElementById('edit-nationality').value = user.Nationality;
    if(doctorant)
    document.getElementById('edit-matricule').value = doctorant.numeroInscription;

  }

  if(these){
    document.getElementById('edit-enrollment-date').value = these.dateInscription;
    document.getElementById('edit-expected-completion').value = these.dateFinVisee;
  }

  // Initialize profile data
  loadProfileData();
  
  // Initialize profile editing functionality
  initProfileEdit();
});

async function loadResearchUnits(selectedValue) {
  try {
    const response = await fetch('http://localhost:8081/api/unites-recherche');
    const unites = await response.json();
    
    const select = document.getElementById('edit-research-unit');
    if (select) {
      select.innerHTML = ""; // Clear all options
      unites.forEach(unite => {
        const option = document.createElement('option');
        option.value = unite.id;
        option.textContent = unite.nom;
        if (selectedValue && (unite.id == selectedValue || unite.nom == selectedValue)) {
          option.selected = true;
        }
        select.appendChild(option);
      });
    }
  } catch (err) {
    console.error('Error loading research units:', err);
    showToast('Erreur lors du chargement des unités de recherche', 'error');
  }
}

/**
 * Load doctoral schools from backend
 */
async function loadDoctoralSchools(selectedValue) {
  try {
    const response = await fetch('http://localhost:8081/api/etablissements');
    const ecoles = await response.json();
    
    const select = document.getElementById('edit-doctoral-school');
    if (select) {
      select.innerHTML = ""; // Clear all options
      ecoles.forEach(ecole => {
        const option = document.createElement('option');
        option.value = ecole.id;
        option.textContent = ecole.nom;
        if (selectedValue && (ecole.id == selectedValue || ecole.nom == selectedValue)) {
          option.selected = true;
        }
        select.appendChild(option);
      });
    }
  } catch (err) {
    console.error('Error loading doctoral schools:', err);
    showToast('Erreur lors du chargement des écoles doctorales', 'error');
  }
}

/**
 * Load profile data from stored user data
 */
function loadProfileData() {
  // const user = getData('doctolearn_user');
  const user = JSON.parse(localStorage.getItem('doctolearn_user'));
  const doctorant = JSON.parse(localStorage.getItem('doctorant'));
  const these = JSON.parse(localStorage.getItem('these'));
  
  
  
  if (!user) return;
  
  // Update profile header
  const profileName = document.getElementById('profile-name');
  const profileSchool = document.getElementById('profile-school');
  const profileStatus = document.getElementById('profile-status');
  
  if (profileName) profileName.textContent = `${user.firstName} ${user.lastName}`;
  // if (profileSchool) profileSchool.textContent = user.doctoralSchool;
  // if (profileStatus) profileStatus.textContent = 'Doctoral Student (Year 2)';
  
  // Update personal information
  const personalInfo = document.getElementById('personal-info');
  if (personalInfo) {
    const infoGroups = personalInfo.querySelectorAll('.info-group');
    
    
    const personalData = {
      'Nom complet': `${user.firstName} ${user.lastName}`,
      'Email': user.email,
      'ID Étudiant': doctorant.numeroInscription,
      'Téléphone': user.phoneNumber, // Demo data
      'Date de naissance': user.birthdate,    // Demo data
      'Nationalité': user.Nationality             // Demo data
    };
    
    infoGroups.forEach(group => {
      const label = group.querySelector('.info-label').textContent;
      const value = group.querySelector('.info-value');
      
      if (personalData[label]) {
        value.textContent = personalData[label];
      }
    });
  }
  
  // Update academic information
  const academicInfo = document.getElementById('academic-info');
  if (academicInfo) {
    const infoGroups = academicInfo.querySelectorAll('.info-group');
    
    // Map user data to info groups
    const academicData = {
      'École doctorale': user.etablissementNom,
      'Unité de recherche': doctorant.UniteRechercheNom,
      'Thesis Director': user.director,
      'Unité de ': user.supervisor,
      'Date inscription': these.dateInscription,
      'Superviseur de thèse':these.encadrant,
      //formatDate(user.enrollmentDate),
      'Fin prévue': these.dateFinVisee // Demo data
    };
    document.getElementById('profile-school').textContent = academicData['École doctorale'];
    
    infoGroups.forEach(group => {
      const label = group.querySelector('.info-label').textContent;
      const value = group.querySelector('.info-value');
      
      if (academicData[label]) {
        value.textContent = academicData[label];
      }
    });
  }
  
  // Update edit form fields
  updateEditFormFields(user,doctorant,these);
}

/**
 * Update edit form fields with user data
 * @param {Object} user - User data object
 */
function updateEditFormFields(user,doctorant,these) {
  // Personal info fields
  // const firstNameInput = document.getElementById('edit-firstname');
  // const lastNameInput = document.getElementById('edit-lastname');
  // const emailInput = document.getElementById('edit-email');
  
  // if (firstNameInput) firstNameInput.value = user.firstName;
  // if (lastNameInput) lastNameInput.value = user.lastName;
  // if (emailInput) emailInput.value = user.email;
  
  // Academic info fields
  // const matriculeInput = document.getElementById('edit-matricule');
  const researchUnitSelect = document.getElementById('edit-research-unit');
  const doctoralSchoolSelect = document.getElementById('edit-doctoral-school');
  
  // if (matriculeInput) matriculeInput.value = user.matricule;
  
  // Set select values (demo data - in real app would use IDs)
  if (researchUnitSelect) {
    const options = researchUnitSelect.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].text === user.researchUnit) {
        researchUnitSelect.selectedIndex = i;
        break;
      }
    }
  }
  
  if (doctoralSchoolSelect) {
    const options = doctoralSchoolSelect.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].text === user.doctoralSchool) {
        doctoralSchoolSelect.selectedIndex = i;
        break;
      }
    }
  }
}

/**
 * Initialize profile editing functionality
 */
function initProfileEdit() {
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const editProfileFormContainer = document.getElementById('profile-edit-form'); // This is the container
  const formElement = document.getElementById('edit-profile-form'); // This is the actual form
  
  // Initialize form tabs
  initFormTabs();
  
  // Edit profile button click
  if (editProfileBtn && editProfileFormContainer) {
    editProfileBtn.addEventListener('click', function() {
      editProfileFormContainer.classList.remove('hidden');
    });
  }
  
  // Cancel edit button click
  if (cancelEditBtn && editProfileFormContainer) {
    cancelEditBtn.addEventListener('click', function() {
      editProfileFormContainer.classList.add('hidden');
    });
  }
  
  // Form submission - make sure this is properly attached
  if (formElement) {
    formElement.addEventListener('submit', async function(e) {
      e.preventDefault();
      console.log("Form submission started"); // Debug log
      
      try {
        const user = JSON.parse(localStorage.getItem('doctolearn_user'));
        const doctorant = JSON.parse(localStorage.getItem('doctorant'));
        const these = JSON.parse(localStorage.getItem('these'));

        if (!user || !doctorant || !these) {
          throw new Error('User data not found in localStorage');
        }

        // Get form data
        const formData = new FormData(formElement);
        const uniteRechercheSelect = document.getElementById('edit-research-unit');
        const ecoleDoctoraleSelect = document.getElementById('edit-doctoral-school');
        const dateInscriptionInput = document.getElementById('edit-enrollment-date');
         if (dateInscriptionInput) {
    dateInscriptionInput.value = these.dateInscription || '';
  }
const dateFinViseeInput = document.getElementById('edit-expected-completion');
const birthDateInput = document.getElementById('edit-birth-date');
        // const dateFinVisee = document.getElementById('edit-expected-completion');
        const payload = {
          user: {
            id: user.id,
            firstName: formData.get('firstname'),
            lastName: formData.get('lastname'),
            username: `${formData.get("firstname") || ""} ${formData.get("lastname") || ""}`.trim(),
            email: formData.get('email'),
            phoneNumber: formData.get('phone'),
            // birthDate: formData.get('birth-date'),
            birthDate: birthDateInput ? birthDateInput.value : "",
            nationality: formData.get('nationality'),
            etablissementId: ecoleDoctoraleSelect.value,
            etablissementNom: ecoleDoctoraleSelect.options[ecoleDoctoraleSelect.selectedIndex].text
          },
          doctorant: {
            id: doctorant.id,
            numeroInscription: formData.get('matricule'),
            uniteRechercheId: uniteRechercheSelect.value,
            uniteRechercheNom: uniteRechercheSelect.options[uniteRechercheSelect.selectedIndex].text
          },
          these: {
            id: these.id,
            titre: these.titre,
            resume: these.resume,
            dateSoumission: these.dateSoumission,
            dateInscription: dateInscriptionInput ? dateInscriptionInput.value : "",
            // dateInscription: these.dateInscription,
            // dateFinVisee: dateFinVisee,
            dateFinVisee: dateFinViseeInput ? dateFinViseeInput.value : "",
            dateSoutenance: these.dateSoutenance,
            etatThese: these.etatThese,
            statut: these.statut
          }
        };

        const response = await fetch('http://localhost:8081/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: "include",
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to update profile');
        }

        const updatedProfile = await response.json();

        // Update localStorage
        localStorage.setItem('doctolearn_user', JSON.stringify({
          ...user,
          firstName: updatedProfile.user.firstName,
          lastName: updatedProfile.user.lastName,
          username: updatedProfile.user.username,
          email: updatedProfile.user.email,
          phoneNumber: updatedProfile.user.phoneNumber,
          birthdate: updatedProfile.user.birthdate,
          Nationality: updatedProfile.user.Nationality,
          etablissementNom: updatedProfile.user.etablissementNom,
          etablissementId: updatedProfile.user.etablissementId
        }));

        localStorage.setItem('doctorant', JSON.stringify({
          ...doctorant,
          numeroInscription: updatedProfile.doctorant.numeroInscription,
          UniteRechercheNom: updatedProfile.doctorant.UniteRechercheNom,
          UniteRechercheId: updatedProfile.doctorant.UniteRechercheId
        }));

        localStorage.setItem('these', JSON.stringify({
          ...these,
          dateFinVisee : updatedProfile.these.dateFinVisee
      }));

        // Reload profile data
        loadProfileData();
        
        // Hide edit form
        editProfileFormContainer.classList.add('hidden');
        
        // Show success message
        showToast('Profile updated successfully', 'success');
      } catch (err) {
        console.error('Error updating profile:', err);
        showToast(err.message || 'Failed to update profile', 'error');
      }
    });
  }
}
/**
 * Initialize form tabs
 */
function initFormTabs() {
  const tabButtons = document.querySelectorAll('.form-tab');
  const tabContents = document.querySelectorAll('.form-tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tab = this.getAttribute('data-tab');
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Show selected tab content
      tabContents.forEach(content => {
        if (content.id === `tab-${tab}`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}

// ...existing code...

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("doctolearn_user"));
  if (!user) return;

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  // Bloc header (JS déjà donné avant)
  const userNameEl = document.getElementById("user-name");
  const userRoleEl = document.getElementById("user-role");
  const avatarPlaceholder1 = document.querySelector(".avatar-placeholder:not(.large)");

  if (userNameEl) userNameEl.textContent = fullName;
  if (userRoleEl) userRoleEl.textContent = user.role || "Doctorant";
  if (avatarPlaceholder1) avatarPlaceholder1.textContent = initials;

  // Bloc profile-avatar
  const avatarPlaceholder2 = document.querySelector(".avatar-placeholder.large");
  if (avatarPlaceholder2) avatarPlaceholder2.textContent = initials;
});


document.addEventListener("DOMContentLoaded", () => {
  const these = JSON.parse(localStorage.getItem("these"));
  if (!these) return;

  const infoContainer = document.getElementById("thesis-info");
  const editForm = document.getElementById("edit-thesis-form");

  // Affichage des détails
  if (infoContainer && these) {
    infoContainer.querySelector(".info-group:nth-child(1) .info-value").textContent = these.titre || "";
    infoContainer.querySelector(".info-group:nth-child(2) .info-value").textContent = these.resume || "";
    infoContainer.querySelector(".info-group:nth-child(3) .keyword-list").innerHTML = these.motclesString
      ? these.motclesString.split(',').map(m => `<span class="keyword">${m.trim()}</span>`).join('')
      : "<span class='keyword'>Aucun</span>";
    infoContainer.querySelector(".info-group:nth-child(4) .info-value").textContent = new Date(these.dateInscription)
      .toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Remplissage du formulaire d'édition
  if (editForm && these) {
    document.getElementById("edit-thesis-title").value = these.titre || "";
    document.getElementById("edit-thesis-summary").value = these.resume || "";
    document.getElementById("edit-keywords").value = these.motclesString || "";
  }

  // Afficher / cacher formulaire
  const editBtn = document.getElementById("edit-thesis-btn");
  const cancelBtn = document.getElementById("cancel-thesis-edit");
  const editBlock = document.getElementById("thesis-edit-form");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      editBlock.classList.remove("hidden");
      infoContainer.classList.add("hidden");
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      editBlock.classList.add("hidden");
      infoContainer.classList.remove("hidden");
    });
  }

  // Sauvegarde modifications
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titre = document.getElementById("edit-thesis-title").value;
    const resume = document.getElementById("edit-thesis-summary").value;
    const motcles = document.getElementById("edit-keywords").value;

    // MAJ localStorage
    const updatedThese = {
      ...these,
      titre: titre,
      resume: resume,
      motclesString: motcles
    };

    localStorage.setItem("these", JSON.stringify(updatedThese));

    // Rafraîchir affichage
    infoContainer.querySelector(".info-group:nth-child(1) .info-value").textContent = titre;
    infoContainer.querySelector(".info-group:nth-child(2) .info-value").textContent = resume;
    infoContainer.querySelector(".info-group:nth-child(3) .keyword-list").innerHTML = motcles
      ? motcles.split(',').map(m => `<span class="keyword">${m.trim()}</span>`).join('')
      : "<span class='keyword'>Aucun</span>";

    editBlock.classList.add("hidden");
    infoContainer.classList.remove("hidden");

    showToast("Thèse mise à jour avec succès", "success");
  });
});

