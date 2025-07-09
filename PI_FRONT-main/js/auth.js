/**
 * Authentication related functionality
 * Handles login, registration, and form validation
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {

  const roleSelect = document.getElementById('role');
  if (roleSelect) {
    roleSelect.addEventListener('change', function() {
      if (this.value === 'encadrant') {
        setRequiredOnStep('step-academic', false);
        setRequiredOnStep('step-thesis', false);
      } else {
        setRequiredOnStep('step-academic', true);
        setRequiredOnStep('step-thesis', true);
      }
    });
  } 

  function setRequiredOnStep(stepId, required) {
  const step = document.getElementById(stepId);
  if (!step) return;
  step.querySelectorAll('input, select, textarea').forEach(input => {
    if (required) {
      input.setAttribute('required', 'required');
    } else {
      input.removeAttribute('required');
    }
  });
}

  initResetPasswordForm();
  initForgotPasswordForm();
  initLoginForm();
  initRegistrationForm();
  initPasswordToggle();
  
  // Load research units and doctoral schools
  loadResearchUnits();
  loadDoctoralSchools();
  loadDirectors();
  loadSupervisors();
});

/**
 * Load research units from backend
 */
async function loadResearchUnits() {
  try {
    const response = await fetch('http://localhost:8081/api/unites-recherche');
    const unites = await response.json();
    
    const select = document.getElementById('research-unit');
    if (select) {
      // Clear existing options except the first one (placeholder)
      select.length = 1;
      
      unites.forEach(unite => {
        const option = document.createElement('option');
        option.value = unite.id;
        option.textContent = unite.nom;
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
async function loadDoctoralSchools() {
  try {
    const response = await fetch('http://localhost:8081/api/etablissements');
    const ecoles = await response.json();
    
    // Populate the main doctoral school select (in academic step)
    const select = document.getElementById('doctoral-school');
    if (select) {
      // Clear existing options except the first one (placeholder)
      select.length = 1;
      
      ecoles.forEach(ecole => {
        const option = document.createElement('option');
        option.value = ecole.id;
        option.textContent = ecole.nom;
        select.appendChild(option);
      });
    }

    // Populate the encadrant doctoral school select (in personal step)
    const encadrantSelect = document.getElementById('encadrant-doctoral-school');
    if (encadrantSelect) {
      // Clear existing options except the first one (placeholder)
      encadrantSelect.length = 1;
      
      ecoles.forEach(ecole => {
        const option = document.createElement('option');
        option.value = ecole.id;
        option.textContent = ecole.nom;
        encadrantSelect.appendChild(option);
      });
    }
  } catch (err) {
    console.error('Error loading doctoral schools:', err);
    showToast('Erreur lors du chargement des écoles doctorales', 'error');
  }
}

/**
 * Load directors/supervisors from backend
 */
async function loadDirectors() {
  try {
    const response = await fetch('http://localhost:8081/api/directeurs');
    if (!response.ok) throw new Error('Erreur réseau');
    
    const directeurs = await response.json();
    const select = document.getElementById('director');
    
    if (select) {
      // Réinitialiser le select en gardant la première option
      select.innerHTML = '<option value="">Sélectionnez un directeur de thèse</option>';
      
      directeurs.forEach(directeur => {
        const option = document.createElement('option');
        option.value = directeur.id;
        // Utilisez nomUtilisateur pour le nom complet
        option.textContent = `${directeur.nomUtilisateur} (${directeur.domaine}) - ${directeur.etablissementNom}`;
        select.appendChild(option);
      });
    }
  } catch (err) {
    console.error('Erreur chargement directeurs:', err);
    showToast('Erreur lors du chargement des directeurs', 'error');
  }
}

// et pour supervisor list 
async function loadSupervisors() {
  try {
    const response = await fetch('http://localhost:8081/api/encadrants');
    if (!response.ok) throw new Error('Erreur réseau');
    
    const encadrants = await response.json();
    const select = document.getElementById('supervisor');
    
    if (select) {
      // Réinitialiser le select en gardant la première option
      select.innerHTML = '<option value="">Sélectionnez un superviseur de thèse</option>';
      
      encadrants.forEach(encadrant => {
        const option = document.createElement('option');
        option.value = encadrant.id;
        // Utilisez nomUtilisateur et grade pour le nom complet
        option.textContent = `${encadrant.grade} ${encadrant.nomUtilisateur} (${encadrant.specialite}) - ${encadrant.etablissementNom}`;
        select.appendChild(option);
      });
    }
  } catch (err) {
    console.error('Erreur chargement superviseurs:', err);
    showToast('Erreur lors du chargement des superviseurs', 'error');
  }
}


// the load keyword funtions
async function loadKeywords() {
  const response = await fetch('http://localhost:8081/file/keywords.json');
  if (!response.ok) {
    console.error("Failed to load keywords.json:", response.statusText);
    return [];
  }
  const data = await response.json();
  console.log("Keywords loaded:", data);
  return data;
}
const selectedKeywords = [];
document.addEventListener('DOMContentLoaded', async () => {
  const keywords = await loadKeywords();
  const input = document.getElementById('keywords-input');
  const dropdown = document.getElementById('dropdown-container');
  const selectedKeywordsContainer = document.getElementById('selected-keywords');
  

  // Filter dropdown based on input value
  input.addEventListener('input', function () {
    const searchTerm = input.value.toLowerCase();
    dropdown.innerHTML = "";
    dropdown.classList.remove('hidden');
    const filteredKeywords = keywords.filter(keyword =>
      keyword.toLowerCase().includes(searchTerm)
    );
    filteredKeywords.forEach(keyword => {
      const item = document.createElement('div');
      item.textContent = keyword;
      item.classList.add('dropdown-item');
      item.addEventListener('click', function () {
        if (!selectedKeywords.includes(keyword)) {
          selectedKeywords.push(keyword);
          updateSelectedKeywords();
        }
        dropdown.classList.add('hidden');
        input.value = ""; // Clear the input field after selection
      });
      dropdown.appendChild(item);
    });
  });

  console.log('selectedKeywords');

  // Show dropdown when input is clicked
  input.addEventListener('click', function () {
    dropdown.innerHTML = "";
    dropdown.classList.remove('hidden');
    keywords.forEach(keyword => {
      const item = document.createElement('div');
      item.textContent = keyword;
      item.classList.add('dropdown-item');
      item.addEventListener('click', function () {
        if (!selectedKeywords.includes(keyword)) {
          selectedKeywords.push(keyword);
          updateSelectedKeywords();
        }
        console.log(selectedKeywords);
        dropdown.classList.add('hidden');
        input.value = ""; // Clear the input field after selection
      });
      dropdown.appendChild(item);
    });
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target) && e.target !== input) {
      dropdown.classList.add('hidden');
    }
  });

  // Update the selected keywords below the input field
  function updateSelectedKeywords() {
    selectedKeywordsContainer.innerHTML = "";
    selectedKeywords.forEach(keyword => {
      const tag = document.createElement('span');
      tag.textContent = keyword;
      tag.classList.add('tag');
      tag.addEventListener('click', function () {
        selectedKeywords.splice(selectedKeywords.indexOf(keyword), 1);
        updateSelectedKeywords();
      });
      selectedKeywordsContainer.appendChild(tag);
    });
  }
});
/**
 * Initializes login form handling
 */
function initLoginForm() {
  console.log("initLoginForm called");

  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      console.log("Login form submitted");
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!email || !password) {
        showToast("Please fill in all required fields", "error");
        return;
      }
      
      try {
        const response = await fetch("http://localhost:8081/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          
          localStorage.setItem("doctolearn_user", JSON.stringify(data.user));
          const user = JSON.parse(localStorage.getItem('doctolearn_user'));
          if(user.role == "doctorant"){
          if (data.doctorant) localStorage.setItem("doctorant", JSON.stringify(data.doctorant));
  if (data.these) localStorage.setItem("these", JSON.stringify(data.these));
          
          window.location.href = "dashboard.html";
        } 
        
        else if(user.role == "encadrant"){
         window.location.href = "supervisor-dashboard.html";
        }
        else {
          showToast(data.error || "Login failed", "error");
        }
      } 
    }catch (err) {
        showToast("Network error, please try again later"+err, "error");
      }
    });
  }
}
/**
 * Forgot password form handling
 */
function initForgotPasswordForm() {
  const forgotPasswordForm = document.getElementById("forgot-password-form");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      
      if (!email) {
        showToast("Please fill in all required fields", "error");
        return;
      }
      
      try {
        const response = await fetch("http://localhost:8081/forgot-password", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          showToast(
            data.message || "Un lien de réinitialisation a été envoyé à votre email.",
            "success",
          );
        } else {
          showToast(data.error || "Erreur lors de la demande.", "error");
        }
      } catch (err) {
        showToast("Erreur réseau, veuillez réessayer plus tard.", "error");
      }
    });
  }
}

/**
 * Get query parameter from URL
 */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * Initialize reset password form
 */
function initResetPasswordForm() {
  // Set reset token from URL parameter
  const rstokenInput = document.getElementById("rstoken");
  if (rstokenInput) {
    const rstoken = getQueryParam("rstoken");
    if (rstoken) {
      rstokenInput.value = rstoken;
    }
  }

  const resetPasswordForm = document.getElementById("reset-password-form");
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      
      const newpass = document.getElementById("newpass").value;
      const confirmpass = document.getElementById("confirmpass").value;
      const rstoken = document.getElementById("rstoken").value;

      if (!newpass || !confirmpass || !rstoken) {
        showToast("Veuillez remplir tous les champs requis", "error");
        return;
      }
      
      if (newpass !== confirmpass) {
        showToast("Les mots de passe ne correspondent pas", "error");
        return;
      }
      
      try {
        const response = await fetch("http://localhost:8081/reset-password", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ newpass, confirmpass, rstoken }),
        });

        const data = await response.json();
        
        if (response.ok) {
          showToast(
            data.message || "Mot de passe réinitialisé avec succès",
            "success",
          );
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1500);
        } else {
          showToast(
            data.error || "Erreur lors de la réinitialisation du mot de passe",
            "error",
          );
        }
      } catch (err) {
        showToast("Erreur réseau, veuillez réessayer plus tard", "error");
      }
    });
  }
}

/**
 * Enhanced registration form handling
 */

function initRegistrationForm() {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    initMultiStepForm();
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("=== REGISTRATION FORM DEBUG START ===");
      
      const formData = new FormData(registerForm);
      
      // Debug: Log all form data
      console.log("All form data:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: "${value}"`);
      }

      // Get school ID from the appropriate field based on role
      const userRole = formData.get("role") || "";
      const schoolId = userRole === "encadrant" 
        ? formData.get("encadrant-doctoral-school") || ""
        : formData.get("doctoral-school") || "";

      const user = {
        firstName: formData.get("firstname") || "",
        lastName: formData.get("lastname") || "",
        // username: formData.get("lastname") || formData.get("firstname") || "",
        username: `${formData.get("firstname") || ""} ${formData.get("lastname") || ""}`.trim(),
        
        password: formData.get("password") || "",
        email: formData.get("email") || "",
        role: formData.get("role") || "",
        phoneNumber: formData.get("phone") || formData.get("phoneNumber") || null,
        nationality: formData.get("nationality") || null,
        birthDate: formData.get("birthdate") || formData.get("birth-date") || formData.get("date-of-birth") || null,
        etablissement: {  // Ajout de l'établissement dans l'objet user
          id: parseInt(schoolId)
        }
      };
      
      console.log("User object:", user);

      let doctorant = null;
      if (user.role === "doctorant") {
        console.log("Processing doctorant role...");
        
        // Get form values
        const matricule = formData.get("matricule") || formData.get("registration-number");
        const startDate = formData.get("start-date") || formData.get("startDate") || formData.get("inscription-date");
        const directorId = formData.get("director") || formData.get("thesis-director") || formData.get("directeur");
        const researchUnitId = formData.get("research-unit") || formData.get("research_unit") || formData.get("unite-recherche");
        
        console.log("Doctorant form values:");
        console.log("- matricule:", matricule);
        console.log("- start-date:", startDate);
        console.log("- director:", directorId);
        console.log("- research-unit:", researchUnitId);
        console.log("- doctoral-school:", schoolId);
        
        // Validation
        if (!matricule || matricule.trim() === "") {
          showToast("Le numéro d'inscription (matricule) est requis", "error");
          return;
        }
        
        if (!startDate || startDate.trim() === "") {
          showToast("L'année d'inscription est requise", "error");
          return;
        }
        
        if (!directorId || directorId.trim() === "") {
          showToast("Veuillez sélectionner un directeur de thèse", "error");
          return;
        }
        
        if (!researchUnitId || researchUnitId.trim() === "") {
          showToast("Veuillez sélectionner une unité de recherche", "error");
          return;
        }

        if (!schoolId || schoolId.trim() === "") {
          showToast("Veuillez sélectionner une école doctorale", "error");
          return;
        }

        doctorant = {
          numeroInscription: matricule.trim(),
          anneeInscription: parseInt(startDate),
          directeur: {
            id: parseInt(directorId)
          },
          uniteRecherche: {
            id: parseInt(researchUnitId)
          }
          // On ne met plus etablissement ici car il est déjà dans user
        };
      }

      let these = null;
      if (user.role === "doctorant") {
        const thesisTitle = formData.get("thesis-title");
        const thesisSummary = formData.get("thesis-summary");
        const thesisStartDate = formData.get("start-date");
        const thesisKeyword = selectedKeywords;
        
        if (!thesisTitle || thesisTitle.trim() === "") {
          showToast("Le titre de la thèse est requis", "error");
          return;
        }
        
        if (!thesisSummary || thesisSummary.trim() === "") {
          showToast("Le résumé de la thèse est requis", "error");
          return;
        }

        these = {
          titre: thesisTitle.trim(),
          resume: thesisSummary.trim(),
          dateInscription: thesisStartDate,
          motCles: thesisKeyword
        };
      }
      let encadrant = null ; 
      if(user.role == "encadrant"){
        encadrant = {
          grade : formData.get("grade") || null ,
          specialite : formData.get("specialite") || null
        }
      }
    
      
      // Enhanced validation
      const requiredFields = [];
      if (!user.firstName || user.firstName.trim() === "") requiredFields.push("Prénom");
      if (!user.email || user.email.trim() === "") requiredFields.push("Email");
      if (!user.password || user.password.trim() === "") requiredFields.push("Mot de passe");
      if (!user.username || user.username.trim() === "") requiredFields.push("Nom d'utilisateur");
      if (!user.role || user.role.trim() === "") requiredFields.push("Rôle");
      
      if (requiredFields.length > 0) {
        showToast(`Champs requis manquants: ${requiredFields.join(", ")}`, "error");
        return;
      }
     if(user.role == "doctorant"){
      // Check terms acceptance
      if (!formData.get("terms")) {
        showToast("Vous devez accepter les conditions générales", "error");
        return;
      }
    }
      if (user.role === "encadrant") {
  if (!formData.get("grade") || formData.get("grade").trim() === "") requiredFields.push("Grade");
  if (!formData.get("specialite") || formData.get("specialite").trim() === "") requiredFields.push("Spécialité");
}

       let requestBody = {
        user
      };

      if(user.role == "doctorant"){
      requestBody = {
        user,
        doctorant,
        these,
      };
    }
    else if(user.role == "encadrant"){
      requestBody = {
        user,
        encadrant
        
      };
    }
    else{
      requestBody = {
        user
      };
    }

      console.log("Final request body:", JSON.stringify(requestBody, null, 2));

      try {
        console.log("Sending registration request...");
        const response = await fetch("http://localhost:8081/register", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          showToast(data.message || "Inscription réussie !", "success");
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1500);
        } else {
          showToast(data.error || "Erreur lors de l'inscription", "error");
        }
      } catch (err) {
        showToast("Erreur réseau, veuillez réessayer plus tard.", "error");
      }
    });
  }
}
// function initRegistrationForm() {
//   const registerForm = document.getElementById("register-form");
//   if (registerForm) {
//     initMultiStepForm();
//     registerForm.addEventListener("submit", async function (e) {
//       e.preventDefault();
//       console.log("=== REGISTRATION FORM DEBUG START ===");
      
//       const formData = new FormData(registerForm);
      
//       // Debug: Log all form data
//       console.log("All form data:");
//       for (let [key, value] of formData.entries()) {
//         console.log(`${key}: "${value}"`);
//       }

//       // Debug: Check if specific fields exist
//       console.log("Checking specific fields:");
//       console.log("- birthdate field exists:", formData.has("birthdate"));
//       console.log("- birth-date field exists:", formData.has("birth-date"));
//       console.log("- date-of-birth field exists:", formData.has("date-of-birth"));
//       console.log("- director field exists:", formData.has("director"));
//       console.log("- thesis-director field exists:", formData.has("thesis-director"));
//       console.log("- research-unit field exists:", formData.has("research-unit"));
//       console.log("- research_unit field exists:", formData.has("research_unit"));

//       const user = {
//         firstName: formData.get("firstname") || "",
//         lastName: formData.get("lastname") || formData.get("firstname") || "",
//         username: formData.get("username") || "",
//         password: formData.get("password") || "",
//         email: formData.get("email") || "",
//         role: formData.get("role") || "",
//         // Optional fields - try multiple possible field names
//         phoneNumber: formData.get("phone") || formData.get("phoneNumber") || null,
//         nationality: formData.get("nationality") || null,
//         birthDate: formData.get("birthdate") || formData.get("birth-date") || formData.get("date-of-birth") || null
//       };
      
//       console.log("User object:", user);

//       let doctorant = null;
//       if (user.role === "doctorant") {
//         console.log("Processing doctorant role...");
        
//         // Get form values - try multiple possible field names
//         const matricule = formData.get("matricule") || formData.get("registration-number");
//         const startDate = formData.get("start-date") || formData.get("startDate") || formData.get("inscription-date");
//         const directorId = formData.get("director") || formData.get("thesis-director") || formData.get("directeur");
//         const researchUnitId = formData.get("research-unit") || formData.get("research_unit") || formData.get("unite-recherche");
//         const schoolId = formData.get("doctoral-school") || "";
        
//         console.log("Doctorant form values:");
//         console.log("- matricule:", matricule);
//         console.log("- start-date:", startDate);
//         console.log("- director:", directorId);
//         console.log("- research-unit:", researchUnitId);
//         console.log("- doctoral-school:", schoolId);
        
//         // Additional debugging - check what director related fields exist
//         console.log("All director-related fields:");
//         const directorFields = [];
//         for (let [key, value] of formData.entries()) {
//           if (key.toLowerCase().includes('director') || key.toLowerCase().includes('directeur')) {
//             directorFields.push(`${key}: "${value}"`);
//           }
//         }
//         console.log(directorFields);
        
//         // Validation with specific error messages
//         if (!matricule || matricule.trim() === "") {
//           showToast("Le numéro d'inscription (matricule) est requis", "error");
//           console.error("Missing matricule field");
//           return;
//         }
        
//         if (!startDate || startDate.trim() === "") {
//           showToast("L'année d'inscription est requise", "error");
//           console.error("Missing start-date field");
//           return;
//         }
        
//         if (!directorId || directorId.trim() === "") {
//           showToast("Veuillez sélectionner un directeur de thèse", "error");
//           console.error("Missing director field - available fields:", [...formData.keys()]);
//           return;
//         }
        
//         if (!researchUnitId || researchUnitId.trim() === "") {
//           showToast("Veuillez sélectionner une unité de recherche", "error");
//           console.error("Missing research-unit field");
//           return;
//         }

//         if (!schoolId || schoolId.trim() === "") {
//           showToast("Veuillez sélectionner une école doctorale", "error");
//           console.error("Missing doctoral-school field");
//           return;
//         }

//         doctorant = {
//           numeroInscription: matricule.trim(),
//           anneeInscription: parseInt(startDate),
//           directeur: {
//             id: parseInt(directorId)
//           },
//           uniteRecherche: {
//             id: parseInt(researchUnitId)
//           },
//           etablissement: {
//             id: parseInt(schoolId)
//           }
//         };
        
//         console.log("Doctorant object:", doctorant);
//       }

//       let these = null;
//       if (user.role === "doctorant") {
//         console.log("Processing these data...");
        
//         const thesisTitle = formData.get("thesis-title");
//         const thesisSummary = formData.get("thesis-summary");
//         const thesisStartDate = formData.get("start-date");
        
//         console.log("These form values:");
//         console.log("- thesis-title:", thesisTitle);
//         console.log("- thesis-summary length:", thesisSummary ? thesisSummary.length : 0);
//         console.log("- thesis start-date:", thesisStartDate);
        
//         if (!thesisTitle || thesisTitle.trim() === "") {
//           showToast("Le titre de la thèse est requis", "error");
//           return;
//         }
        
//         if (!thesisSummary || thesisSummary.trim() === "") {
//           showToast("Le résumé de la thèse est requis", "error");
//           return;
//         }

//         these = {
//           titre: thesisTitle.trim(),
//           resume: thesisSummary.trim(),
//           dateInscription: thesisStartDate,
//         };
        
//         console.log("These object:", these);
//       }

//       // Enhanced validation
//       const requiredFields = [];
//       if (!user.firstName || user.firstName.trim() === "") requiredFields.push("Prénom");
//       if (!user.email || user.email.trim() === "") requiredFields.push("Email");
//       if (!user.password || user.password.trim() === "") requiredFields.push("Mot de passe");
//       if (!user.username || user.username.trim() === "") requiredFields.push("Nom d'utilisateur");
//       if (!user.role || user.role.trim() === "") requiredFields.push("Rôle");
      
//       if (requiredFields.length > 0) {
//         showToast(`Champs requis manquants: ${requiredFields.join(", ")}`, "error");
//         return;
//       }

//       // Check terms acceptance
//       if (!formData.get("terms")) {
//         showToast("Vous devez accepter les conditions générales", "error");
//         return;
//       }

//       const requestBody = {
//         user,
//         doctorant,
//         these,
//       };

//       console.log("Final request body:", JSON.stringify(requestBody, null, 2));

//       try {
//         console.log("Sending registration request...");
//         const response = await fetch("http://localhost:8081/register", {
//           method: "POST",
//           headers: {
//             "content-type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         });
        
//         console.log("Response status:", response.status);
//         console.log("Response headers:", [...response.headers.entries()]);
        
//         const data = await response.json();
//         console.log("Response data:", data);
        
//         if (response.ok) {
//           console.log("Registration successful!");
//           showToast(data.message || "Inscription réussie !", "success");
//           setTimeout(() => {
//             window.location.href = "login.html";
//           }, 1500);
//         } else {
//           console.error("Registration failed:", data);
//           showToast(data.error || "Erreur lors de l'inscription", "error");
//         }
//       } catch (err) {
//         console.error("Network error:", err);
//         showToast("Erreur réseau, veuillez réessayer plus tard.", "error");
//       }
      
//       console.log("=== REGISTRATION FORM DEBUG END ===");
//     });
//   }
// }

/**
 * Initializes multi-step form navigation
 */
function initMultiStepForm() {
  const nextButtons = document.querySelectorAll(".btn-next");
  const prevButtons = document.querySelectorAll(".btn-prev");

  if (nextButtons.length > 0) {
    nextButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const activeStep = document.querySelector(".form-step.active");
        let nextStep = activeStep.nextElementSibling;

        while (nextStep && !nextStep.classList.contains("form-step")) {
          nextStep = nextStep.nextElementSibling;
        }

        if (nextStep) {
          if (validateStep(activeStep)) {
            activeStep.classList.remove("active");
            nextStep.classList.add("active");

            const currentStepData = activeStep.id.split("-")[1];
            const nextStepData = nextStep.id.split("-")[1];

            const currentProgress = document.querySelector(
              `.progress-step[data-step="${currentStepData}"]`,
            );
            const nextProgress = document.querySelector(
              `.progress-step[data-step="${nextStepData}"]`,
            );

            if (currentProgress && nextProgress) {
              currentProgress.classList.remove("active");
              nextProgress.classList.add("active");
            }
          }
        }
      });
    });
  }

  if (prevButtons.length > 0) {
    prevButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const activeStep = document.querySelector(".form-step.active");
        let prevStep = activeStep.previousElementSibling;

        while (prevStep && !prevStep.classList.contains("form-step")) {
          prevStep = prevStep.previousElementSibling;
        }

        if (prevStep) {
          activeStep.classList.remove("active");
          prevStep.classList.add("active");

          const currentStepData = activeStep.id.split("-")[1];
          const prevStepData = prevStep.id.split("-")[1];

          const currentProgress = document.querySelector(
            `.progress-step[data-step="${currentStepData}"]`,
          );
          const prevProgress = document.querySelector(
            `.progress-step[data-step="${prevStepData}"]`,
          );

          if (currentProgress && prevProgress) {
            currentProgress.classList.remove("active");
            prevProgress.classList.add("active");
          }
        }
      });
    });
  }
}

/**
 * Validates a form step
 */
function validateStep(step) {
  const requiredInputs = step.querySelectorAll(
    "input[required], select[required], textarea[required]",
  );
  let isValid = true;

  requiredInputs.forEach((input) => {
    // Skip validation for hidden inputs (encadrant fields when hidden)
    const parentDiv = input.closest('#encadrant-fields');
    if (parentDiv && parentDiv.style.display === 'none') {
      return; // Skip this input
    }
    
    if (!input.value.trim()) {
      isValid = false;

      input.classList.add("error");
      input.style.borderColor = "var(--color-error)";

      input.addEventListener(
        "input",
        function () {
          if (this.value.trim()) {
            this.classList.remove("error");
            this.style.borderColor = "";
          }
        },
        { once: true },
      );
    }
  });

  if (!isValid) {
    showToast("Please fill in all required fields", "error");
  }

  return isValid;
}

/**
 * Initializes password toggle functionality
 */
function initPasswordToggle() {
  const toggleButtons = document.querySelectorAll("#toggle-password");

  toggleButtons.forEach((button) => {
    if (button) {
      button.addEventListener("click", function () {
        const passwordInput = this.closest(".form-group").querySelector(
          'input[type="password"], input[type="text"]',
        );

        if (passwordInput) {
          if (passwordInput.type === "password") {
            passwordInput.type = "text";
            this.classList.add("show");
          } else {
            passwordInput.type = "password";
            this.classList.remove("show");
          }
        }
      });
    }
  });
}