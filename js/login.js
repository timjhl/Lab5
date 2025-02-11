document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    fetch("/users")
        .then(response => response.json())
        .then(data => {
            var userFound = false;
            for (let user of data.users) {
                if (user.username === username && user.password === password) {
                    userFound = true;
                    // Speichern der Benutzerdaten in der Session
                    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
                    // Weiterleitung zur dynamischen Inhaltsseite
                    window.location.href = "content.html";
                    break;
                }
            }
            if (!userFound) {
                document.getElementById("feedback").innerText = "Benutzername oder Passwort falsch.";
            }
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Nutzerdaten:", error);
        });
});
