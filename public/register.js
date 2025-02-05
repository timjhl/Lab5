document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var firstName = document.getElementById("firstName").value.trim();
    var lastName = document.getElementById("lastName").value.trim();
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;
    var gender = document.querySelector('input[name="gender"]:checked');
    var interest = document.getElementById("interest").value;
    var comments = document.getElementById("comments").value.trim();
    var terms = document.getElementById("terms").checked;

    var feedback = "";

    // Validierung: Nur Buchstaben, "-" und "_" erlaubt, max. 20 Zeichen
    var nameRegex = /^[A-Za-z\-_]{1,20}$/;
    if (!nameRegex.test(firstName)) {
        feedback += "Vorname ungültig. ";
    }
    if (!nameRegex.test(lastName)) {
        feedback += "Nachname ungültig. ";
    }
    if (!nameRegex.test(username)) {
        feedback += "Benutzername ungültig. ";
    }

    // Passwort: 8-20 Zeichen, mindestens eine Zahl und ein Sonderzeichen aus "!#,+-_?"
    if (password.length < 8 || password.length > 20) {
        feedback += "Passwort muss zwischen 8 und 20 Zeichen lang sein. ";
    }
    var digitRegex = /[0-9]/;
    var specialRegex = /[!#,\+\-_\?]/;
    if (!digitRegex.test(password)) {
        feedback += "Passwort muss mindestens eine Zahl enthalten. ";
    }
    if (!specialRegex.test(password)) {
        feedback += "Passwort muss mindestens ein Sonderzeichen (!#,+-_?) enthalten. ";
    }

    if (!gender) {
        feedback += "Bitte Geschlecht auswählen. ";
    }

    if (!terms) {
        feedback += "Bitte akzeptieren Sie die Nutzungsbedingungen. ";
    }

    if (feedback !== "") {
        document.getElementById("feedback").innerText = feedback;
        return;
    }

    // Benutzer-Datenobjekt erstellen
    var userData = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,  // In einer realen Anwendung unbedingt verschlüsseln (z. B. mit bcrypt)
        gender: gender.value,
        interest: interest,
        comments: comments
    };

    // Sende die Registrierungsdaten per POST an den Server
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(result => {
            // Bei erfolgreicher Registrierung: Bestätigung anzeigen und Link zur Login-Seite anbieten
            document.getElementById("feedback").innerHTML =
                "Herzlichen Glückwunsch, " + firstName + " " + lastName + "!<br>" +
                "<a href='index.html'>Jetzt anmelden</a>";
        })
        .catch(error => {
            console.error("Fehler bei der Registrierung:", error);
            document.getElementById("feedback").innerText = "Fehler bei der Registrierung.";
        });
});
