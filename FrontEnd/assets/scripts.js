const gallery = document.getElementById('gallery');
const filterContainer = document.getElementById('filter-container');

function renderWorks(works, categoryId=null) {
    gallery.innerHTML = ''
    works.forEach(work => {
        if(categoryId != null && categoryId != work.categoryId) {
            return
        }
        const figureElement = document.createElement('figure');

        const imgElement = document.createElement('img');
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title;

        const figcaptionElement = document.createElement('figcaption');
        figcaptionElement.textContent = work.title;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);

        gallery.appendChild(figureElement);
        figureElement.dataset.categoryId = work.categoryId;
    });
}

function renderFilters(categories, works) {
    const optionTous = document.createElement('button');
    optionTous.value = 'tous';
    optionTous.textContent = 'Tous';
    optionTous.classList.add('filter-button');
    filterContainer.appendChild(optionTous);
    optionTous.addEventListener('click', function () {
        setActiveButton(optionTous);
        renderWorks(works)
    });
  
    categories.forEach(category => {
        const optionElement = document.createElement('button');
        optionElement.value = category.id;
        optionElement.textContent = category.name;
        optionElement.classList.add('filter-button');
        filterContainer.appendChild(optionElement);
        console.log (optionElement)

        optionElement.addEventListener('click', function () {
            setActiveButton(optionElement);
            renderWorks(works, optionElement.value)
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

var run = async() => {
    async function getWorks() {
        return await fetch('http://localhost:5678/api/works')
        .then(response => response.json())
    }

    async function getCategories() {
        return await fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
    }
    var works = await getWorks()
    renderWorks(works)

    var categories = await getCategories()
    renderFilters(categories, works)
}

run()