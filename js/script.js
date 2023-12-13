// ------------
// VARIABLES
// ------------

// Formulaire et ses inputs
const formulaire = document.getElementById("formulaire");
const nom = document.getElementById("nom");
const prenom = document.getElementById("prenom");
const email = document.getElementById("email");
const message = document.getElementById("message");

// Messages d'erreur par input
const erreurNom = document.getElementById("erreur_nom");
const erreurPrenom = document.getElementById("erreur_prenom");
const erreurEmail = document.getElementById("erreur_email");
const erreurMessage = document.getElementById("erreur_message");

// Boutons et message global
const boutonAnnuler = document.getElementById("bouton_annuler");
const boutonEnvoyer = document.getElementById("bouton_envoyer");
const messageGlobal = document.getElementById("message_global");

// Regex email
const regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

// Erreurs sur les données ?
let erreurs = false;

// ------------
// FONCTIONS
// ------------

// Teste le nom rentré
function testNom() {
  if (nom.value === "") {
    erreurs = true;
    return "Veuillez saisir un nom";
  } else if (nom.value.length <= 2) {
    erreurs = true;
    return "Veuillez saisir un nom valide";
  } else {
    return "";
  }
}

// Teste le prénom rentré
function testPrenom() {
  if (prenom.value === "") {
    erreurs = true;
    return "Veuillez saisir un prénom";
  } else if (prenom.value.length <= 2) {
    erreurs = true;
    return "Veuillez saisir un prénom valide";
  } else {
    return "";
  }
}

// Teste l'email rentré
function testEmail() {
  if (email.value === "") {
    erreurs = true;
    return "Veuillez saisir un email";
  } else if (!regexEmail.test(email.value)) {
    erreurs = true;
    return "Veuillez saisir un email valide";
  } else {
    return "";
  }
}

// Teste le message rentré
function testMessage() {
  if (message.value === "") {
    erreurs = true;
    return "Veuillez saisir un message";
  } else {
    return "";
  }
}

// -------------------
// EVENTS LISTENERS
// -------------------

// Input nom
nom.addEventListener("input", () => {
  // Enlève le message global
  messageGlobal.innerHTML = "";

  // Formatage basique
  nom.value = nom.value.toUpperCase();

  // Affiche les erreurs
  erreurNom.innerHTML = testNom();
});

// Input prénom
prenom.addEventListener("input", () => {
  // Enlève le message global
  messageGlobal.innerHTML = "";

  // Formatage basique
  prenom.value =
    prenom.value.charAt(0).toUpperCase() +
    prenom.value.substring(1, prenom.value.length).toLowerCase();

  // Affiche les erreurs
  erreurPrenom.innerHTML = testPrenom();
});

// Input email
email.addEventListener("input", () => {
  // Enlève le message global
  messageGlobal.innerHTML = "";

  // Formatage basique
  email.value = email.value.toLowerCase();

  // Affiche les erreurs
  erreurEmail.innerHTML = testEmail();
});

// Input message
message.addEventListener("input", () => {
  // Enlève le message global
  messageGlobal.innerHTML = "";

  // Affiche les erreurs
  erreurMessage.innerHTML = testMessage();
});

// Clic bouton annuler
boutonAnnuler.addEventListener("click", () => {
  // Cache les messages individuels
  erreurNom.style.display = "none";
  erreurPrenom.style.display = "none";
  erreurEmail.style.display = "none";
  erreurMessage.style.display = "none";

  // Supprime le message global
  messageGlobal.innerHTML = "";
});

// Clic bouton envoyer
boutonEnvoyer.addEventListener("click", (e) => {
  e.preventDefault();

  // Enlève les espaces parasites
  nom.value = nom.value.trim();
  prenom.value = prenom.value.trim();
  email.value = email.value.trim();
  message.value = message.value.trim();

  // Détecte les erreurs
  erreurs = false;
  erreurNom.innerHTML = testNom();
  erreurPrenom.innerHTML = testPrenom();
  erreurEmail.innerHTML = testEmail();
  erreurMessage.innerHTML = testMessage();

  // Par défaut, mets le message global en rouge et affiche les messages individuels
  messageGlobal.style.color = "red";
  erreurNom.style.display = "inline";
  erreurPrenom.style.display = "inline";
  erreurEmail.style.display = "inline";
  erreurMessage.style.display = "inline";

  // S'il n'y a pas d'erreurs côté front
  if (!erreurs) {
    let contact = new FormData(formulaire);
    fetch("php/traitement.php", {
      method: "POST",
      body: contact,
      dataType: "JSON",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // S'il n'y a pas d'erreurs côté back
        if (data.success) {
          // Affichage message global
          messageGlobal.innerHTML = "Données insérées avec succès";
          messageGlobal.style.color = "green";

          // On n'affiche plus les messages d'erreur individuels (utile si on veut envoyer un deuxième formulaire)
          erreurNom.style.display = "none";
          erreurPrenom.style.display = "none";
          erreurEmail.style.display = "none";
          erreurMessage.style.display = "none";

          // On supprime les valeurs rentrées par l'utilisateur
          nom.value = "";
          prenom.value = "";
          email.value = "";
          message.value = "";
        }

        // Sinon
        else {
          // Affichage message global
          messageGlobal.innerHTML = "Données déjà envoyées précédemment";
        }
      })
      .catch((error) => {
        // Affichage de l'erreur en console et en front
        console.error(error);
        messageGlobal.innerHTML = "Erreur technique, veuillez réessayer";
      });
  }

  // Sinon
  else {
    // Affichage message global
    messageGlobal.innerHTML = "Données incorrectes";
  }
});
