let tokenValue = localStorage.token; // Récupère la valeur du token depuis le localStorage
let works = []; // Déclaration et initialisation de la variable "works"

function renderWorks(works, categoryId = null) {
  const gallery = document.getElementById('gallery');
  const galleryModalElement = document.getElementById('gallery-modal');
  gallery.innerHTML = '';
  galleryModalElement.innerHTML = '';

  works.forEach(work => {
    if (categoryId != null && categoryId != work.categoryId) {
      return;
    }

    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const figcaptionElement = document.createElement('figcaption');
    const spanModalDelete = document.createElement('span');
    const trashIcon = document.createElement('i');

    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    figcaptionElement.textContent = work.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    gallery.appendChild(figureElement);

    // Crée les éléments HTML pour la galerie modale avec l'option de suppression
    const figureModalElement = figureElement.cloneNode(true);
    const figcaptionModalElement = figureModalElement.querySelector('figcaption');
    figcaptionModalElement.textContent = 'éditer';

    trashIcon.classList.add('fas', 'fa-trash');
    spanModalDelete.appendChild(trashIcon);
    figureModalElement.appendChild(spanModalDelete);
    galleryModalElement.appendChild(figureModalElement);

    figureElement.dataset.categoryId = work.categoryId;
    figureModalElement.dataset.categoryId = work.categoryId;

    // Ajoute un gestionnaire d'événement pour supprimer une œuvre au clic sur l'icône de corbeille
    trashIcon.addEventListener('click', (e) => {e.preventDefault(); deleteWork(work.id)});
  });
}

// Fonction pour supprimer une œuvre en utilisant une requête DELETE
const deleteWork = async (id) => {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenValue}` // Utilise la valeur du token dans l'en-tête de la requête
    }
  });

  if (response.ok) {
    const works = await getWorks();
    renderWorks(works);
  } else {
    console.log('Erreur lors de la suppression du travail');
  }
};

const deleteGallery = async () => {
  const works = await getWorks();

  for (const work of works) {
    await deleteWork(work.id);
  }

  const updatedWorks = await getWorks();
  renderWorks(updatedWorks);
};
document.getElementById('delete-gallery').addEventListener('click', deleteGallery);

function renderFilters(categories, works) {
  const optionTous = document.createElement('button');
  optionTous.value = 'tous';
  optionTous.textContent = 'Tous';
  optionTous.classList.add('filter-button', 'active');
  filterContainer.appendChild(optionTous);

  optionTous.addEventListener('click', function () {
    setActiveButton(optionTous);
    renderWorks(works);
  });

  categories.forEach(category => {
    const optionElement = document.createElement('button');
    optionElement.value = category.id;
    optionElement.textContent = category.name;
    optionElement.classList.add('filter-button');
    filterContainer.appendChild(optionElement);

    optionElement.addEventListener('click', function () {
      setActiveButton(optionElement);
      renderWorks(works, optionElement.value);
    });
  });
}

function setActiveButton(button) {
  const buttons = document.querySelectorAll('.filter-button');
  buttons.forEach(btn => {
    if (btn === button) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Fonction pour récupérer les œuvres à partir de l'API
async function getWorks() {
  return await fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    works = data; // Met à jour les œuvres récupérées dans la variable "works"
    renderWorks(works); // Appelle la fonction pour afficher les œuvres
    return data; // Retourne les données récupérées
  });
}

// Fonction pour récupérer les catégories à partir de l'API
async function getCategories() {
  return await fetch('http://localhost:5678/api/categories')
    .then(response => response.json());
}

// Fonction principale pour exécuter les opérations au chargement de la page
var run = async() => {
  var works = await getWorks();
  renderWorks(works);

  var categories = await getCategories();
  renderFilters(categories, works);
}

run();

const loginElement = document.getElementById('logout');
if (localStorage.getItem('token')) {
  loginElement.textContent = 'logout';
} else {
  loginElement.textContent = 'login';
}

loginElement.addEventListener('click', () => {
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token');
    loginElement.textContent = 'Login';
  }
});

const editionDiv = document.querySelector('.edition');
if (localStorage.getItem('token')) {
  editionDiv.style.display = 'flex';
} else {
  editionDiv.style.display = 'none';
}

const filterContainer = document.getElementById('filter-container');
if (localStorage.getItem('token')) {
  filterContainer.style.display = 'none';
} else {
  filterContainer.style.display = 'flex';
}

const modifDivs = document.querySelectorAll('.modif');
if (localStorage.getItem('token')) {
  modifDivs.forEach(div => {
    div.style.display = 'block';
  });
} else {
  modifDivs.forEach(div => {
    div.style.display = 'none';
  });
}

// Code pour les fonctionnalités modales
let modal = null;
let addModal;

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute('href'));
  modal.style.display = null;
  modal.removeAttribute('aria-hidden');
  modal.setAttribute('aria-modal', 'true');
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

const openAddModal = function (e) {
  e.preventDefault();
  const addModal = document.getElementById('add-modal');
  const galleryModal = document.getElementById('modal');
  galleryModal.style.display = 'none';
  addModal.style.display = null;
  addModal.removeAttribute('aria-hidden');
  addModal.setAttribute('aria-modal', 'true');
  modal = addModal;
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};
document.querySelector('.ajt-photo a').addEventListener('click', openAddModal);

const retourModal = function (e) {
  e.preventDefault();
  const galleryModal = document.getElementById('modal');
  const addImgContainer = document.querySelector('.add-img');

  const imagePreview = addImgContainer.querySelector('img.photo-preview');
  if (imagePreview) {
    addImgContainer.removeChild(imagePreview);
  }

  const elementsToShow = addImgContainer.querySelectorAll('i, label, p');
  elementsToShow.forEach(element => {
    element.style.display = null;
  });

  galleryModal.style.display = null;
  addModal.style.display = 'none';
  addModal.setAttribute('aria-hidden', 'true');
  addModal.removeAttribute('aria-modal');
  modal = galleryModal;
  modal.removeEventListener('click', closeModal);
  resetForm();
};

const retourButton = document.querySelector('.js-modal-retour');
retourButton.addEventListener('click', retourModal);

function closeModal(event) {
  if (event) {
    event.preventDefault();
  }
  
  const addImgContainer = document.querySelector('.add-img');

  const imagePreview = addImgContainer.querySelector('img.photo-preview');
  if (imagePreview) {
    addImgContainer.removeChild(imagePreview);
  }

  const elementsToShow = addImgContainer.querySelectorAll('i, label, p');
  elementsToShow.forEach(element => {
    element.style.display = "null";
  });

  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
  modal = null;
  resetForm();
  resetAddImgContainer();
};

function resetForm() {
  const form = document.getElementById('add-form');
  form.reset();

  const selectElement = document.getElementById('choix');
  selectElement.value = 'vide';
}

// Gestionnaire d'événement pour le chargement de la page
window.addEventListener('load', function() {
  addModal = document.getElementById('add-modal');
});

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
});

const stopPropagation = function (e) {
  e.stopPropagation();
};

window.addEventListener('keydown', function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

const addImgContainer = document.querySelector('.add-img');
const photoFileInput = document.getElementById('photo-file');

photoFileInput.addEventListener('change', (e) => {
  const selectedFile = e.target.files[0];

  const elementsToHide = addImgContainer.querySelectorAll('i, label, p');
  elementsToHide.forEach(element => {
    element.style.display = 'none';
  });

  const imagePreview = document.createElement('img');
  imagePreview.classList.add('photo-preview');
  imagePreview.src = URL.createObjectURL(selectedFile);
  addImgContainer.appendChild(imagePreview);
});

// Appele la fonction handleSubmit() lorsque le bouton "Valider" est cliqué
document.getElementById("add-form").addEventListener("submit", function (e) {
  e.preventDefault();
  handleSubmit();
});

function handleSubmit() {
  // Récupérer les valeurs des champs du formulaire
  var titre = document.getElementById("titre").value;
  var categorie = document.getElementById("choix").value;
  var photoFile = document.getElementById("photo-file").files[0];

  // Vérifier si les champs sont remplis
  var photoFile = document.getElementById("photo-file").files[0];

  if (photoFile.size > 4 * 1024 * 1024) {
    console.error("La taille du fichier dépasse la limite de 4 Mo.");
    return;
  }
  // Créer un objet FormData pour envoyer les données du formulaire
  var formData = new FormData();
  formData.append("title", titre);
  formData.append("category", categorie);
  formData.append("image", photoFile);

  // Récupérer le jeton d'authentification
  var token = tokenValue;

  // Ajouter l'en-tête d'authentification à la requête
  var headers = new Headers();
  headers.append("Authorization", "Bearer " + token);

  // Effectuer la requête POST avec les données du formulaire et l'en-tête d'authentification
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: headers,
  })
    .then(function (response) {
      if (response.status === 201) {
        console.log("Nouvelle œuvre envoyée avec succès !");
        return response.json(); // Récupérer les données renvoyées par le serveur
      } else {
        console.error(
          "Erreur lors de l'envoi de l'œuvre. Statut de la réponse :",
          response.status
        );
      }
    })
    .then(function (newWork) {
      // Ajouter la nouvelle œuvre à la liste des œuvres existantes
      works.push(newWork);
      // Afficher les œuvres mises à jour dans la galerie
      renderWorks(works);

      var retourButton = document.querySelector(".js-modal-retour");
      retourButton.click(); // Simuler un clic sur le bouton "Retour"

      // Fermer la modal lors d'un clic en dehors d'elle
      document.addEventListener("click", function (event) {
      var modal = document.querySelector(".js-modal");
      if (!modal.contains(event.target)) {
      // Clic en dehors de la modal
      var closeButton = document.querySelector(".js-modal-close");
      closeButton.dispatchEvent(new Event("click")); // Simuler un événement de clic sur le bouton de fermeture
      }
      });

      // Réinitialise l'état du bouton "Valider" à gris
      var submitButton = document.querySelector("#submit-button");
      submitButton.disabled = true;
      submitButton.classList.remove("button-active");
    });
}

document.getElementById("titre").addEventListener("keyup", function () {
  checkForm();
});
document.getElementById("choix").addEventListener("change", function () {
  checkForm();
});
document.getElementById("photo-file").addEventListener("change", function () {
  checkForm();
});

function checkForm() {
  var titre = document.getElementById("titre").value;
  var choix = document.getElementById("choix").value;
  var photoFile = document.getElementById("photo-file").files[0];
  var submitButton = document.querySelector("#submit-button");
  var errorMessage = document.getElementById("error-message");

  if (titre && choix && photoFile && choix !== "vide") {
    if (photoFile.size <= 4 * 1024 * 1024) {
      if (isImageValid(photoFile)) {
        submitButton.disabled = false;
        submitButton.classList.add("button-active");

        errorMessage.style.display = "none";
      } else {
        submitButton.disabled = true;
        submitButton.classList.remove("button-active");

        errorMessage.textContent = "L'image n'est pas au format JPG ou PNG.";
        errorMessage.style.display = "block";
      }
    } else {
      submitButton.disabled = true;
      submitButton.classList.remove("button-active");

      errorMessage.textContent = "La taille de l'image dépasse 4 Mo.";
      errorMessage.style.display = "block";
    }
  } else {
    // Au moins un champ est vide, le bouton est désactivé
    submitButton.disabled = true;
    submitButton.classList.remove("button-active");

    errorMessage.style.display = "none";
  }
}

function isImageValid(file) {
  const validExtensions = ['.jpg', '.png'];
  const fileName = file.name.toLowerCase();
  return validExtensions.some(ext => fileName.endsWith(ext));
}

document.querySelector(".js-modal-retour").addEventListener("click", hideErrorMessage);
document.querySelector(".js-modal-close").addEventListener("click", hideErrorMessage);

function hideErrorMessage() {
  let errorMessage = document.getElementById("error-message");
  errorMessage.style.display = "none";
}

function resetAddImgContainer() {
  const addImgContainer = document.querySelector('.add-img');

  // Supprimer l'image de prévisualisation
  const imagePreview = addImgContainer.querySelector('img.photo-preview');
  if (imagePreview) {
    addImgContainer.removeChild(imagePreview);
  }

  // Réinitialiser l'affichage des éléments i, label et p
  const elementsToShow = addImgContainer.querySelectorAll('i, label, p');
  elementsToShow.forEach(element => {
    element.style.display = null;
  });
}