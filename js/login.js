let scrollCount = 0;

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre normalement
	
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log(username, password);

    // Fetch fonction asyncrone -> Javascript ne va pas attendre que la fonction doit finie avant d'éxécuter la suite
    fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    .then(response => response.json()) // Convertir la réponse en json
    .then(data => {
        if (data.code != 0) {
            document.getElementById("errorMessage").style.display = "block";
            document.getElementById("errorMessage").innerText = data.message;
        }
        else {
            document.getElementById("errorMessage").style.display = "none";
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("connected", true);
            window.location.href = "../index.html";
        }
    })
    .catch(error => console.error(error));

});

function calculateText(texte) {
	let newText = "";
	
	for (let i = 1; i < texte.length; i++) {
		newText += texte[i];
	}
	
	newText += texte[0];

	return newText;
}

document.addEventListener("scroll", function(event) {
    scrollCount += 1;
    if (scrollCount % 3 == 0) {
	    let idx = 0;
	    document.querySelectorAll('.texte').forEach(element => {
		    element.textContent = calculateText(element.innerHTML);
		    console.log(element.innerHTML);
	    });
    }
});
