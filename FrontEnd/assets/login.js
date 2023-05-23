document.getElementById('btnConnexion').addEventListener('click', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

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
    if (data.userId && data.token) {
      const token = data.token;

      localStorage.setItem('token', token);

      window.location.href = './index.html';
    } else {
      alert('Erreur de connexion : Réponse invalide');
    }
  })
  .catch(error => {
    console.error('Erreur lors de la requête de login:', error);
  });
});