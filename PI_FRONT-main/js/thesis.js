document.addEventListener('DOMContentLoaded', function () {
  loadThesisData();
  initThesisEdit();
  initDocumentUpload();
  loadUserDocuments();
});

function loadThesisData() {
  const user = getData('doctolearn_user');
  if (!user) return;

  const thesisTitle = document.querySelector('#thesis-info .info-value:first-child');
  if (thesisTitle) thesisTitle.textContent = user.thesisTitle;

  const editThesisTitle = document.getElementById('edit-thesis-title');
  if (editThesisTitle) editThesisTitle.value = user.thesisTitle;
}

function initThesisEdit() {
  const editThesisBtn = document.getElementById('edit-thesis-btn');
  const cancelThesisEdit = document.getElementById('cancel-thesis-edit');
  const thesisInfo = document.getElementById('thesis-info');
  const thesisEditForm = document.getElementById('thesis-edit-form');
  const editThesisForm = document.getElementById('edit-thesis-form');

  if (editThesisBtn && thesisInfo && thesisEditForm) {
    editThesisBtn.addEventListener('click', function () {
      thesisInfo.classList.add('hidden');
      thesisEditForm.classList.remove('hidden');
    });
  }

  if (cancelThesisEdit && thesisInfo && thesisEditForm) {
    cancelThesisEdit.addEventListener('click', function () {
      thesisInfo.classList.remove('hidden');
      thesisEditForm.classList.add('hidden');
    });
  }

  if (editThesisForm) {
    editThesisForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(editThesisForm);
      const userData = getData('doctolearn_user');

      if (userData) {
        userData.thesisTitle = formData.get('thesis-title');
        storeData('doctolearn_user', userData);

        const thesisTitleElement = document.querySelector('#thesis-info .info-value:first-child');
        if (thesisTitleElement) thesisTitleElement.textContent = userData.thesisTitle;

        const dashboardThesisTitle = document.getElementById('thesis-title');
        if (dashboardThesisTitle) dashboardThesisTitle.textContent = userData.thesisTitle;

        thesisInfo.classList.remove('hidden');
        thesisEditForm.classList.add('hidden');
        showToast('Thesis information updated successfully', 'success');
      }
    });
  }
}

function initDocumentUpload() {
  const uploadBtn = document.getElementById('upload-document-btn');
  const cancelUploadBtn = document.getElementById('cancel-upload');
  const uploadForm = document.getElementById('upload-document-form');
  const documentUploadForm = document.getElementById('document-upload-form');
  const fileInput = document.getElementById('document-file');
  const uploadPlaceholder = document.querySelector('.upload-placeholder');

  if (uploadBtn && uploadForm) {
    uploadBtn.addEventListener('click', function () {
      uploadForm.classList.remove('hidden');
    });
  }

  if (cancelUploadBtn && uploadForm) {
    cancelUploadBtn.addEventListener('click', function () {
      uploadForm.classList.add('hidden');
      if (documentUploadForm) documentUploadForm.reset();
      if (uploadPlaceholder) {
        uploadPlaceholder.innerHTML = `
          <span class="upload-icon"></span>
          <span class="upload-text">Drag and drop your file here, or click to browse</span>
        `;
      }
    });
  }

  if (fileInput && uploadPlaceholder) {
    fileInput.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        uploadPlaceholder.innerHTML = `
          <span class="upload-icon"></span>
          <span class="upload-text">${file.name} (${formatFileSize(file.size)})</span>
        `;
      }
    });
  }

  if (documentUploadForm) {
    documentUploadForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(documentUploadForm);
      const title = formData.get('document-title');
      const type = formData.get('document-type');
      const file = formData.get('document-file');

      if (!title || !type || !file || file.size === 0) {
        showToast('Please fill in all required fields and upload a file', 'error');
        return;
      }

      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('title', title);
        uploadFormData.append('type', type);

        const response = await fetch('http://localhost:8081/api/files/upload', {
          method: 'POST',
          body: uploadFormData,
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'File upload failed');
        }

        // Utiliser la nouvelle fonction pour ajouter le document
        addDocumentToList(title, new Date().toISOString(), file.name, file.type);
        uploadForm.classList.add('hidden');
        documentUploadForm.reset();
        uploadPlaceholder.innerHTML = `
          <span class="upload-icon"></span>
          <span class="upload-text">Drag and drop your file here, or click to browse</span>
        `;
        showToast('Document uploaded successfully', 'success');

      } catch (error) {
        // showToast(Error uploading file: ${error.message}, 'error');
        showToast(`Error uploading file: ${error.message}`, 'error');
      }
    });
  }
}


// 🔧 Fonction unifiée pour ajouter un document avec event listeners
function addDocumentToList(title, date, filename, fileType) {
  const documentList = document.querySelector('.document-list');
  if (!documentList) return;

  // Déterminer l'icône à afficher
  let iconClass = 'word-icon';
  const ext = filename.toLowerCase();
  if (ext.endsWith('.pdf') || fileType.includes('pdf')) {
    iconClass = 'pdf-icon';
  }

  // Créer l'élément HTML
  const documentItem = document.createElement('div');
  documentItem.className = 'document-item';
  documentItem.innerHTML = `
    <div class="document-icon ${iconClass}"></div>
    <div class="document-info">
      <h4>${title}</h4>
      <p>Téléversé le ${formatDate(date)}</p>
    </div>
    <div class="document-actions">
      <a href="#" class="document-action download">Télécharger</a>
      <a href="#" class="document-action view">Voir</a>
    </div>
  `;

  // 📎 Attacher les événements aux boutons
  const downloadBtn = documentItem.querySelector('.download');
  const viewBtn = documentItem.querySelector('.view');

  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadFile(filename);
    });
  }

  if (viewBtn) {
    viewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      viewFile(filename);
    });
  }

  // Ajouter au DOM
  documentList.insertBefore(documentItem, documentList.firstChild);

  // Effet d'apparition
  setTimeout(() => {
    documentItem.style.transition = 'background-color 0.3s ease';
    documentItem.style.backgroundColor = 'rgba(30, 64, 175, 0.05)';
    setTimeout(() => {
      documentItem.style.backgroundColor = '';
    }, 1500);
  }, 10);
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 🔧 Fonction pour charger les documents existants
async function loadUserDocuments() {
  try {
    const response = await fetch("http://localhost:8081/api/files/my", {
      credentials: "include"
    });

    if (!response.ok) throw new Error("Échec du chargement des fichiers");

    const files = await response.json();

    files.forEach(file => {
      const title = file.title || file.fileName || "Sans titre";
      const filename = file.fileName || "inconnu.docx";
      const date = file.uploadDate || new Date().toISOString();
      const fileType = file.fileType || "";

      // Utiliser la fonction unifiée
      addDocumentToList(title, date, filename, fileType);
    });

  } catch (error) {
    console.error("Erreur chargement fichiers :", error);
    showToast("Impossible de charger les fichiers", "error");
  }
}

/// ...existing code...

// 📥 Fonction pour télécharger un fichier
function downloadFile(fileName) {
  const url = `http://localhost:8081/api/files/download/${encodeURIComponent(fileName)}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 👀 Fonction pour voir un fichier
function viewFile(fileName) {
  const url = `http://localhost:8081/api/files/download/${encodeURIComponent(fileName)}`;
  window.open(url, '_blank');
}