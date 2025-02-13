document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre normalement
	
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
	
    console.log(username);
    console.log(password);

    fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    .then(response => response.text()) // Convertir la réponse en texte
    .then(data => {
        document.getElementById("errorMessage").style.display = "block";
    })
    .catch(error => console.error("Erreur :", error));
});

