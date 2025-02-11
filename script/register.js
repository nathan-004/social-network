document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre normalement
	
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	
	console.log(username);
	console.log(password);
});