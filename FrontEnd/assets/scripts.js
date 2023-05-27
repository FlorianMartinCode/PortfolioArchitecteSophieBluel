// Récupération de l'élément de la galerie et du conteneur de filtres
const gallery = document.getElementById('gallery');
const filterContainer = document.getElementById('filter-container');

// Vérification de la présence du token dans le localStorage
if (localStorage.getItem('token')) {
  // Si le token est présent, masquer le conteneur de filtres
  filterContainer.style.display = 'none';
} else {
  // Sinon, afficher le conteneur de filtres
  filterContainer.style.display = 'flex';
}

// Fonction pour afficher les œuvres dans la galerie
function renderWorks(works, categoryId=null) {
  gallery.innerHTML = '';

  works.forEach(work => {
    if (categoryId != null && categoryId != work.categoryId) {
      // Si une catégorie est spécifiée et ne correspond pas à la catégorie de l'œuvre, ignorer l'œuvre
      return;
    }

    // Création des éléments HTML pour chaque œuvre
    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const figcaptionElement = document.createElement('figcaption');

    // Attribution des attributs et du contenu aux éléments
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    figcaptionElement.textContent = work.title;

    // Ajout des éléments à la structure de la galerie
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    gallery.appendChild(figureElement);

    // Attribution de l'ID de catégorie à l'élément de la figure
    figureElement.dataset.categoryId = work.categoryId;
  });
}

// Fonction pour afficher les filtres
function renderFilters(categories, works) {
  // Création du bouton "Tous"
  const optionTous = document.createElement('button');
  optionTous.value = 'tous';
  optionTous.textContent = 'Tous';
  optionTous.classList.add('filter-button');
  filterContainer.appendChild(optionTous);

  // Gestion de l'événement du bouton "Tous"
  optionTous.addEventListener('click', function () {
    setActiveButton(optionTous);
    renderWorks(works);
  });

  // Création des boutons pour chaque catégorie
  categories.forEach(category => {
    const optionElement = document.createElement('button');
    optionElement.value = category.id;
    optionElement.textContent = category.name;
    optionElement.classList.add('filter-button');
    filterContainer.appendChild(optionElement);

    // Gestion de l'événement de chaque bouton de catégorie
    optionElement.addEventListener('click', function () {
      setActiveButton(optionElement);
      renderWorks(works, optionElement.value);
    });
  });
}

// Fonction pour activer le bouton sélectionné
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

// Fonction asynchrone pour récupérer les œuvres depuis l'API
async function getWorks() {
  return await fetch('http://localhost:5678/api/works')
    .then(response => response.json());
}

// Fonction asynchrone pour récupérer les catégories depuis l'API
async function getCategories() {
  return await fetch('http://localhost:5678/api/categories')
    .then(response => response.json());
}

// Fonction principale asynchrone pour exécuter les opérations
var run = async() => {
  // Récupération des œuvres et affichage initial
  var works = await getWorks();
  renderWorks(works);

  // Récupération des catégories et affichage des filtres
  var categories = await getCategories();
  renderFilters(categories, works);
}

run();

// Gestion de l'élément de connexion/déconnexion
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

// Gestion de l'affichage de la section d'édition
const editionDiv = document.querySelector('.edition');
if (localStorage.getItem('token')) {
  editionDiv.style.display = 'flex';
} else {
  editionDiv.style.display = 'none';
}

// Gestion de l'affichage des éléments de modification
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