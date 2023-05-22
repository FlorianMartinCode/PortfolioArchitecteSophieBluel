const gallery = document.getElementById('gallery');
const filterContainer = document.getElementById('filter-container');

//  l'appel à l'API 
// Envoie une requête à l'API pour obtenir les données /...
fetch('http://localhost:5678/api/works')
// Gére la réponse de la requête, la réponse de la requête est convertie en format JSON
    .then(response => response.json())
    // Gére les données JSON obtenues, prend une fonction de rappel qui reçoit les données JSON en tant que paramètre, que nous avons nommé data
    .then(data => {
        // Affichage des données JSON
        // console.log (data)
        parcourirTableau(data);
})

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

        figureElement.dataset.categoryId = works.categoryId;
        gallery.appendChild(figureElement);
    });
}

//  l'appel à l'API
fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        FilterOptions(data);
});

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
            // Filtrer les images en fonction de la catégorie sélectionnée
            filterImagesCategory(optionElement.value);
        });
    });
}

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
