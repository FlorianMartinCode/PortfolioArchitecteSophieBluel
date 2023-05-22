// Récupération des éléments DOM
const gallery = document.getElementById('gallery');
const filterContainer = document.getElementById('filter-container');

// Appel à l'API pour obtenir les données des œuvres
fetch('http://localhost:5678/api/works')
    .then(response => response.json()) // Convertit la réponse en format JSON
    .then(data => {
        console.log (data)
        parcourirTableau(data); // Appelle la fonction pour afficher les données des œuvres
})

// Fonction pour parcourir les données des œuvres et les afficher
function parcourirTableau(data) {
    data.forEach(works => {

        const figureElement = document.createElement('figure');

        const imgElement = document.createElement('img');
        imgElement.src = works.imageUrl;
        imgElement.alt = works.title;

        const figcaptionElement = document.createElement('figcaption');
        figcaptionElement.textContent = works.title;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);

        gallery.appendChild(figureElement);
        figureElement.dataset.categoryId = works.categoryId; // Associe l'ID de catégorie à l'attribut data-categoryId de l'élément
    });
}

// Appel à l'API pour obtenir les données des catégories
fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        FilterOptions(data); // Appelle la fonction pour créer les options de filtrage
});

// Fonction pour créer les options de filtrage
function FilterOptions(categories) {
    const optionTous = document.createElement('button');
    optionTous.value = 'tous';
    optionTous.textContent = 'Tous';
    filterContainer.appendChild(optionTous);
    console.log (optionTous)
    optionTous.addEventListener('click', function () {
        allImages(optionTous.value);
    });
  
    categories.forEach(category => {
        const optionElement = document.createElement('button');
        optionElement.value = category.id;
        optionElement.textContent = category.name;
        filterContainer.appendChild(optionElement);
        console.log (optionElement)

        optionElement.addEventListener('click', function () {
            filterImagesCategory(optionElement.value);
        });
    });
}

// Fonction pour afficher toutes les images ou filtrer par catégorie
function allImages(categoryId) {
    const allImages = Array.from(document.querySelectorAll('#gallery figure'));
    allImages.forEach(image => {
        if (categoryId === 'tous') {
            image.style.display = 'block';
        } else {
            const imageCategory = image.dataset.categoryId;
            if (imageCategory === categoryId) {
                image.style.display = 'block';
            } else {
                image.style.display = 'none';
            }
        }
    });
}

// Fonction pour filtrer les images par catégorie
function filterImagesCategory(categoryId) {
    const allImages = Array.from(document.querySelectorAll('#gallery figure'));
    allImages.forEach(image => {
        const imageCategory = image.dataset.categoryId;
        if (imageCategory === categoryId || categoryId === 'tous') {
            image.style.display = 'block';
        } else {
            image.style.display = 'none';
        }
    });
}
