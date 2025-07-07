/**
 * Dashboard functionality
 * Handles navigation, content loading, and dashboard specific features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {


  // Check if user is logged in
  checkAuthentication();
  
  // Initialize dashboard navigation
  initDashboardNav();
  
  // Initialize dashboard data
  loadDashboardData();

  loadUserDocuments();

  initDashboardEdit();
  initSendMessageForm();
  loadConversations();
  loadDoctoralResources();
});

/**
 * Check if user is authenticated, redirect to login if not
 */
function checkAuthentication() {
   const user = getData('doctolearn_user');
   const doctorant = getData('doctorant');
   const these = getData('these');

  // const token = getData('doctolearn_token');
  //|| !token
  if (!user ) {
    // Redirect to login page
    window.location.href = 'login.html';
    return;
  }
  
  // Load user data into the dashboard
  const userName = document.getElementById('user-name');
  const userRole = document.getElementById('user-role');
  const overviewName = document.getElementById('overview-name');
  
  if (userName) userName.textContent = `${user.firstName} ${user.lastName}`;
  if (userRole) userRole.textContent = 'Doctoral Student';
  if (overviewName) overviewName.textContent = user.firstName;
}

/**
 * Initialize dashboard navigation
 */
function initDashboardNav() {
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  const sections = document.querySelectorAll('.dashboard-section');
  const pageTitle = document.querySelector('.page-title');
  
  // Handle navigation clicks
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetSection = this.getAttribute('data-section');
      
      // Update active nav link
      navLinks.forEach(link => link.classList.remove('active'));
      this.classList.add('active');
      
      // Show target section, hide others
      sections.forEach(section => {
        if (section.id === targetSection) {
          section.classList.add('active');
          
          // Update page title
          if (pageTitle) {
            pageTitle.textContent = this.textContent.trim();
          }
        } else {
          section.classList.remove('active');
        }
      });
      
      // Close sidebar on mobile after navigation
      const sidebar = document.querySelector('.sidebar');
      if (window.innerWidth < 992 && sidebar) {
        sidebar.classList.remove('active');
      }
    });
  });
  
  // Handle card action links that navigate between sections
  const cardActions = document.querySelectorAll('.card-action[data-section]');
  
  cardActions.forEach(action => {
    action.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetSection = this.getAttribute('data-section');
      const targetLink = document.querySelector(`.sidebar-nav a[data-section="${targetSection}"]`);
      
      if (targetLink) {
        targetLink.click();
      }
    });
  });
}

/**
 * Load dashboard data from stored user data
 */
async function loadDashboardData() {


  try {
    const response = await fetch("http://localhost:8081/api/dashboard-info", {
      method: "GET",
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    document.getElementById("overview-name").textContent = data.firstName || "Utilisateur";
    document.getElementById("user-name").textContent = (data.firstName + " " + data.lastName) || "Utilisateur";
    document.getElementById("user-role").textContent = (data.role) || "Utilisateur";

    const anneeEl = document.querySelector('.stat-icon.enrollment-icon').parentElement.querySelector('.stat-value');
    if (anneeEl) anneeEl.textContent = data.anneeInscription;

    const statutEl = document.querySelector('.stat-icon.thesis-status-icon').parentElement.querySelector('.stat-value');
    if (statutEl) statutEl.textContent = "En cours";

    const etapeEl = document.querySelector('.stat-icon.research-icon').parentElement.querySelector('.stat-value');
    if (etapeEl) etapeEl.textContent = "Rédaction de thèse";

    document.getElementById("thesis-title").textContent = data.titreThese;
    document.getElementById("thesis-abstract").textContent = data.resumeThese;

    const dateSoumission = document.getElementById("thesis-date");
    if (data.dateInscription && dateSoumission) {
      const formatted = new Date(data.dateInscription).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      dateSoumission.textContent = formatted;
    }
  } catch (err) {
    console.error("Erreur lors du chargement du tableau de bord :", err);
  }


  try{
  // const user = getData('doctolearn_user');
  const user = JSON.parse(localStorage.getItem('doctolearn_user'));
    const doctorant = JSON.parse(localStorage.getItem('doctorant'));
    const these = JSON.parse(localStorage.getItem('these'));
   const motClesString = these.motClesString;
const motClesArray = motClesString.split(",");

console.log(these);

  const theseInfo = document.getElementById('thesis-info');
  console.log("these infoooo1",theseInfo);
   console.log("these infoooo2",theseInfo);
  if(theseInfo){
//     if (these && these.statut) {
//   updateTimelineFromStatut(these.statut);
//   console.log('these.status:'+these.statut);
// }
    console.log(theseInfo);
    // const infoGroups = theseInfo.querySelectorAll('info-group');
    const infoGroups = theseInfo.querySelectorAll('.info-group'); 
    console.log(infoGroups);
    console.log('Info Groups:', infoGroups);
    const theseData = {
          'Titre' : these.titre,
            'Résumé' : these.resume,
            // 'Mots-clés' : motClesArray,
            'Date d`enregistrement' : these.dateInscription
            
            

    };
    infoGroups.forEach(group => {
      const label = group.querySelector('.info-label').textContent;
      const value = group.querySelector('.info-value');
        console.log('Label:', label); // Debugging log
    console.log('Value Element:', value); // Debu
      if(label && theseData[label]){
      value.textContent = theseData[label];
      }
      if(label === 'Mots-clés' ){
        const keywordList = group.querySelector('.keyword-list')
        console.log("keyword query selec ", keywordList);
        if(keywordList){
          keywordList.innerHTML="";
          motClesArray.forEach(keyword => {
            const keywordSpan = document.createElement('span');
            keywordSpan.className = 'keyword';
            keywordSpan.textContent = keyword.trim();
            keywordList.appendChild(keywordSpan);
          });
        }
      }
    });

  }
  if (these && these.statut) {
      updateTimeLineFromStatus(these.statut);
      console.log('these hhhhhhhhhhhhhhelp status:'+these.statut);
    }
}
catch (error) {
    console.error('Error loading dashboard data:', error);
  }
  
  // if (user) {
  //   // Update thesis data
  //   const thesisTitle = document.getElementById('thesis-title');
  //   if (thesisTitle) thesisTitle.textContent = user.thesisTitle;
  // }
}


function initDashboardEdit(){
  const editTheseBtn = document.getElementById('edit-thesis-btn');
  const cancelTheseBtn = document.getElementById('cancel-thesis-edit');
  const editTheseFormContainer = document.getElementById('thesis-edit-form');
  const formElement = document.getElementById('edit-thesis-form');
  console.log(editTheseBtn);
  console.log(cancelTheseBtn);
  console.log(editTheseFormContainer);
  console.log(formElement);
  if(editTheseBtn && editTheseFormContainer){
    editTheseBtn.addEventListener('click', function(){
      editTheseFormContainer.classList.remove('hidden');
      const these = JSON.parse(localStorage.getItem('these'));
      console.log('these edit ', these);
      if(these){
        document.getElementById('edit-thesis-title').value = these.titre || '';
        document.getElementById('edit-thesis-summary').value = these.resume || '';
        document.getElementById('edit-keywords').value = these.motClesString || '';
      }
    });

  }

  if(cancelTheseBtn && editTheseFormContainer){
    cancelTheseBtn.addEventListener('click', function(){
      editTheseFormContainer.classList.add('hidden');
    });
  }

  if(formElement){
    formElement.addEventListener('submit', async function(e) {
      e.preventDefault;
      try{
       const these = JSON.parse(localStorage.getItem('these'));
       if(!these){
       throw new Error('these n`est pas trouver dans local sstorge');

       }
       const formData = new FormData(formElement);
       const updatedTitre = document.getElementById('edit-thesis-title').value;

       const updatedResume = document.getElementById('edit-thesis-summary').value;
       const updatedMotClesString = document.getElementById('edit-keywords').value;

       console.log("updated mot cles"+updatedMotClesString);
       const updatedMotClesArray = updatedMotClesString.split(',').map(keyword => keyword.trim());

console.log("Updated Mots-Clés Array:", updatedMotClesArray);
// console.log("mottt", these.motClesString);
       const payload = {
          // id: these.id,
          titre : updatedTitre,
          resume: updatedResume,
          motCles: updatedMotClesArray
        
       }

       const response = await fetch(`http://localhost:8081/api/theses/update/${these.id}`,{
        method : 'PUT',
        headers : {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(payload)
       });
       if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Echec de mis a jour de thesee');

       }
       const updateTheseDetails = await response.json();
  console.log("Server Response:", updateTheseDetails);
       localStorage.setItem('these', JSON.stringify({
        ...these,
        titre: updateTheseDetails.titre,
        resume: updateTheseDetails.resume,
        motClesString: updateTheseDetails.motClesString
       }));

       loadDashboardData();

       editTheseFormContainer.classList.add('hidden');
       showToast('Les details de these on eter mis a jour avec success', 'success');




      } catch(err){
        console.error('error mis a jour de details de these');
        showToast(err.message || 'error mis a jour de details de these', 'error');
      }
    });
  }


  


}


function updateTimeLineFromStatus(statut){

  const statValue = document.querySelector('.stat-value.status-in-progress');
console.log('statValue:', statValue, 'statut:', statut);
if (statValue) {
  statValue.textContent = statut;
}

   const statusToIndex = {
    'EnCours': 1,
    'Soumise': 3,
    'Validee': 5,
    'Archivee': 5
   }

   const currentIndex = statusToIndex[statut] ?? 0;

   const timelineItems = document.querySelectorAll('.thesis-timeline .timeline-item');
   timelineItems.forEach((item, idx)=>{
    item.classList.remove('active', 'completed', 'current');
    if(idx<currentIndex){
      item.classList.add('completed');
    }
    else if(idx === currentIndex){
      item.classList.add('active', 'current');
    }

   })

}




function initSendMessageForm() {
  const form = document.getElementById("sendMessageForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const to = document.getElementById("receiverEmail").value.trim();
    const content = document.getElementById("messageContent").value.trim();
    const file = document.getElementById("fileInput").files[0];

    if (!to || (!content && !file)) {
      showToast("Veuillez remplir tous les champs ou sélectionner un fichier", "error");
      return;
    }

    try {
      if (file) {
        const formData = new FormData();
        formData.append("to", to);
        formData.append("file", file);
        await fetch("http://localhost:8081/api/messages/send-file", {
          method: "POST",
          credentials: "include",
          body: formData
        });
      } else {
        await fetch("http://localhost:8081/api/messages/send", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to, content })
        });
      }
      form.reset();
      loadConversation(to);
      loadConversations();
    } catch (err) {
      console.error("Erreur envoi message", err);
      showToast("Erreur lors de l'envoi du message", "error");
    }
  });
}

let selectedContact = null;

async function loadConversations() {
  try {
    const response = await fetch("http://localhost:8081/api/messages/conversations", { credentials: "include" });
    const list = await response.json();
    const ul = document.getElementById("conversationList");
    ul.innerHTML = "";

    list.forEach(c => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${c.contactEmail}</strong><br><small>${c.lastMessage}</small>`;
      li.addEventListener("click", () => {
        selectedContact = c.contactEmail;
        document.getElementById("receiverEmail").value = selectedContact;
        document.getElementById("chatHeader").innerHTML = `<h3>Conversation avec ${selectedContact}</h3>`;
        loadConversation(selectedContact);
      });
      ul.appendChild(li);
    });
  } catch (err) {
    console.error("Erreur lors du chargement des conversations", err);
    showToast("Impossible de charger les conversations", "error");
  }
}

async function loadConversation(withEmail) {
  try {
    const response = await fetch(`http://localhost:8081/api/messages/conversation?with=${encodeURIComponent(withEmail)}`, {
      credentials: "include"
    });
    const messages = await response.json();
    const chatWindow = document.getElementById("chatWindow");
    chatWindow.innerHTML = "";

    messages.forEach(msg => {
      const div = document.createElement("div");
      div.style.textAlign = msg.from === selectedContact ? "left" : "right";
      div.innerHTML = `
        <div style="display:inline-block; padding: 5px; border-radius: 5px; background-color: #eee; margin: 5px;">
          ${msg.content.includes("uploads/") ? `<img src="${msg.content}" style="max-width:100px;">` : msg.content}
          <br><small>${new Date(msg.timestamp).toLocaleString()}</small>
        </div>
      `;
      chatWindow.appendChild(div);
    });

    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (err) {
    console.error("Erreur lors du chargement des messages", err);
    showToast("Impossible de charger la conversation", "error");
  }
}

document.getElementById("toggleNewConversation").addEventListener("click", () => {
  const form = document.getElementById("newConversationForm");
  form.classList.toggle("hidden");
});

document.getElementById("startConversationBtn").addEventListener("click", () => {
  const email = document.getElementById("newConversationEmail").value.trim();
  if (!email) {
    alert("Veuillez saisir l'email du destinataire.");
    return;
  }

  selectedContact = email;
  document.getElementById("receiverEmail").value = email;
  document.getElementById("chatHeader").innerHTML = `<h3>Conversation avec ${email}</h3>`;
  document.getElementById("chatWindow").innerHTML = "<p>Commencez la conversation…</p>";

  document.getElementById("newConversationForm").classList.add("hidden");
  document.getElementById("newConversationEmail").value = "";
});


async function loadUserDocuments() {
  try {
    const response = await fetch("http://localhost:8081/api/files/my", {
      credentials: "include"
    });

    if (!response.ok) throw new Error("Échec du chargement des fichiers");

    const files = await response.json();

    files.forEach(file => {
      addDocumentToList(
        file.fileName,
        file.uploadDate || new Date().toISOString(),
        file.fileName
      );
    });

  } catch (error) {
    console.error("Erreur chargement fichiers :", error);
    showToast("Impossible de charger les fichiers", "error");
  }
}
function addDocumentToList(title, uploadDate, fileName) {
  const list = document.querySelector(".document-list");
  if (!list) return;

  const formattedDate = new Date(uploadDate).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const iconClass = fileName.endsWith('.pdf') ? 'pdf-icon' : 'word-icon';

  const item = document.createElement("div");
  item.classList.add("document-item");
  item.innerHTML = `
    <div class="document-icon ${iconClass}"></div>
    <div class="document-info">
      <h4>${title}</h4>
      <p>Téléversé le ${formattedDate}</p>
    </div>
    <div class="document-actions">
      <a href="http://localhost:8081/api/files/download/${fileName}" class="document-action download" target="_blank">Télécharger</a>
      <a href="http://localhost:8081/api/files/view/${fileName}" class="document-action view" target="_blank">Voir</a>
    </div>
  `;
  list.appendChild(item);
}



document.addEventListener("DOMContentLoaded", () => {
  const staticItems = document.querySelectorAll(".document-list .document-item");

  staticItems.forEach(item => {
    const title = item.querySelector("h4")?.textContent?.trim();

    // Liste des titres à supprimer
    const staticTitles = [
      "Proposition de thèse",
      "Chapitre Revue de littérature",
      "Brouillon Méthodologie",
      "Analyse des données"
    ];

    if (staticTitles.includes(title)) {
      item.remove(); // Supprime cet élément du DOM
    }
  });
});


// ...existing code...

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("doctolearn_user"));
  if (!user) return;

  const userNameEl = document.getElementById("user-name");
  const userRoleEl = document.getElementById("user-role");
  const avatarPlaceholder = document.querySelector(".avatar-placeholder");

  // Nom complet
  const fullName = `${user.firstName} ${user.lastName}`;
  if (userNameEl) userNameEl.textContent = fullName;

  // Rôle
  if (userRoleEl) userRoleEl.textContent = user.role || "Doctorant";

  // Initiales (ex: "Mariem Nemin" -> "MN")
  if (avatarPlaceholder && user.firstName && user.lastName) {
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    avatarPlaceholder.textContent = initials;
  }
});


async function loadDoctoralResources() {
  try {
    const response = await fetch('http://localhost:8080/api/ressources/all');
    if (!response.ok) {
      throw new Error("Échec de récupération des ressources doctorales");
    }

    const data = await response.json();
    const ressources = data.ressources;

    // Vérifie qu'il y a bien au moins 3 ressources
    if (ressources.length < 3) {
      console.warn("Moins de 3 ressources trouvées !");
      return;
    }

    // Injecte les liens dynamiques
    document.getElementById("telecharger-link").href = ressources[0].lien;
    document.getElementById("voir-link").href = ressources[1].lien;
    document.getElementById("acceder-link").href = ressources[2].lien;

    // Ajoute des attributs spécifiques si besoin
    document.getElementById("telecharger-link").setAttribute("download", "");
    document.getElementById("voir-link").setAttribute("target", "_blank");
    document.getElementById("voir-link").setAttribute("rel", "noopener noreferrer");
    document.getElementById("acceder-link").setAttribute("target", "_blank");
    document.getElementById("acceder-link").setAttribute("rel", "noopener noreferrer");

  } catch (error) {
    console.error("Erreur lors du chargement des ressources doctorales :", error.message);
  }
}