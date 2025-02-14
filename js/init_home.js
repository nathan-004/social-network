
if (sessionStorage.getItem("connected")) {
    var username = sessionStorage.getItem("username");
}
else {
    window.location.href = "html/login.html"; // Par rapport au HTML
}

