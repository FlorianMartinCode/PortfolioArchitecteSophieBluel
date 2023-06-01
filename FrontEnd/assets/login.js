// Gestion de l'événement du bouton de connexion
document.getElementById('btnConnexion').addEventListener('click', function(event) {
  event.preventDefault();

  // Récupération des valeurs des champs email et password
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Création de l'objet contenant les données de connexion
  const loginData = {
    email: email,
    password: password
  };

  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
  .then(response => response.json())
  .then(data => {
    // Vérification de la réponse de l'API
    if (data.userId && data.token) {
      const token = data.token;

      // Stockage du token dans le localStorage
      localStorage.setItem('token', token);

      // Redirection vers la page d'accueil
      window.location.href = './index.html';
    } else {
      const errorContainer = document.getElementById('error-container');
      const error = document.createElement('p');
		  error.innerText = 'email ou mot de passe incorrect';
		  error.style.textAlign = 'center';
		  error.style.color = 'red';
		  error.style.marginBottom = '35px';
      errorContainer.appendChild(error)
    }
  })
  .catch(error => {
    console.error('Erreur lors de la requête de login:', error);
  });
});