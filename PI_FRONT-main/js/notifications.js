document.addEventListener("DOMContentLoaded", () => {
  fetchNotifications();
});

function fetchNotifications() {
  fetch("http://localhost:8081/api/doctorant/notifications", {
    method: "GET",
    credentials: "include" // ⚠️ Nécessaire pour que le cookie JWT soit envoyé
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des notifications");
      }
      return response.json();
    })
    .then(data => {
      afficherEcheances(data.echeances);
      afficherMessages(data.messagesNonLus);
    })
    .catch(error => {
      console.error("Erreur :", error);
    });
}

function afficherEcheances(echeances) {
  const container = document.getElementById("echeances-container");
  container.innerHTML = "";

  if (echeances.length === 0) {
    container.innerHTML = "<p>Aucune échéance urgente.</p>";
    return;
  }

  echeances.forEach(ech => {
    const div = document.createElement("div");
    div.className = "alert alert-warning";
    div.innerHTML = `
      <strong>${ech.titre}</strong><br>
      ${ech.description}<br>
      <small>Limite: ${ech.dateLimite}</small>
    `;
    container.appendChild(div);
  });
}

function afficherMessages(messages) {
  const container = document.getElementById("messages-container");
  container.innerHTML = "";

  if (messages.length === 0) {
    container.innerHTML = "<p>Aucun message non lu.</p>";
    return;
  }

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "alert alert-info";
    div.innerHTML = `
      <strong>Message de ${msg.senderName || "Expéditeur inconnu"}</strong><br>
      ${msg.content}<br>
      <small>Reçu le: ${msg.timestamp}</small>
    `;
    container.appendChild(div);
  });
}
