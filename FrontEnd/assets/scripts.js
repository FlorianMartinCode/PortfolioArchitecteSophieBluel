// Fonction pour afficher les œuvres dans la galerie + dans la modale
function renderWorks(works, categoryId=null) {
  const gallery = document.getElementById('gallery');
  const galleryModalElement = document.getElementById('gallery-modal');
  gallery.innerHTML = '';
  galleryModalElement.innerHTML = '';

  works.forEach(work => {
    if (categoryId != null && categoryId != work.categoryId) {
      // Si une catégorie est spécifiée et ne correspond pas à la catégorie de l'œuvre, ignorer l'œuvre
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

    const figureModalElement = figureElement.cloneNode(true);
    const figcaptionModalElement = figureModalElement.querySelector('figcaption');
    figcaptionModalElement.textContent = 'éditer';


    trashIcon.classList.add('fas', 'fa-trash');
    spanModalDelete.appendChild(trashIcon);
    figureModalElement.appendChild(spanModalDelete);
    galleryModalElement.appendChild(figureModalElement);

    figureElement.dataset.categoryId = work.categoryId;
    figureModalElement.dataset.categoryId = work.categoryId;

    trashIcon.addEventListener('click', deleteImage);
  });
}
function deleteImage(event) {
  const figureElement = event.target.closest('figure');
  figureElement.remove();
}
// Fonction pour afficher les filtres
function renderFilters(categories, works) {

  const optionTous = document.createElement('button');
  optionTous.value = 'tous';
  optionTous.textContent = 'Tous';
  optionTous.classList.add('filter-button');
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
  // Récupération des œuvres et affichage
  var works = await getWorks();
  renderWorks(works);

  // Récupération des catégories et affichage des filtres
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

// Modal
let modal = null

const openModal = function (e) {
  e.preventDefault()
  const target = document.querySelector(e.target.getAttribute('href'))
  target.style.display = null
  target.removeAttribute('aria-hidden')
  target.setAttribute('aria-modal', 'true')
  modal = target
  modal.addEventListener('click',closeModal)
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click',closeModal)
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
  modal = null
}

const stopPropagation = function (e) {
  e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
  }
})