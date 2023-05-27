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

  // Envoi de la requête de connexion vers l'API
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
      alert('Erreur de connexion : Réponse invalide');
    }
  })
  .catch(error => {
    console.error('Erreur lors de la requête de login:', error);
  });
});