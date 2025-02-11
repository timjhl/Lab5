document.addEventListener("DOMContentLoaded", function() {
    // Überprüfen, ob ein Benutzer angemeldet ist
    var user = sessionStorage.getItem("loggedInUser");
    if (!user) {
        window.location.href = "index.html";
        return;
    }
    user = JSON.parse(user);
    var defaultTopic = user.interest; // Standardthema aus der Registrierung

    var topics = document.querySelectorAll(".topic");

    // Funktion, die das gewünschte Thema anzeigt und alle anderen ausblendet
    function showTopic(topicId) {
        topics.forEach(function(topic) {
            if (topic.id === topicId) {
                topic.classList.add("active");
            } else {
                topic.classList.remove("active");
            }
        });
    }

    // Standardmäßig wird das Thema angezeigt, das dem Interessensbereich entspricht
    if (window.location.hash) {
        var hashTopic = window.location.hash.substring(1);
        showTopic(hashTopic);
    } else {
        showTopic(defaultTopic);
    }

    // Eventlistener für die Navigationslinks
    var navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(function(link) {
        link.addEventListener("click", function() {
            var topic = this.getAttribute("data-topic");
            // Bestätigung einholen, wenn das ausgewählte Thema nicht dem registrierten Interessensbereich entspricht
            if (topic !== user.interest) {
                var confirmation = confirm("Dieses Thema entspricht nicht Ihrem Interessensbereich. Möchten Sie dennoch fortfahren?");
                if (!confirmation) {
                    return;
                }
            }
            window.location.hash = topic;
            showTopic(topic);
        });
    });

    // Leaflet-Karte initialisieren, sobald Geolocation verfügbar ist
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            // Optional: Aktuelle Systemzeit anzeigen (z.B. in userInfo)
            var currentTime = new Date().toLocaleString();
            document.getElementById("userInfo").innerHTML =
                "<p>Aktuelle Systemzeit: " + currentTime + "</p>";

            // Karte initialisieren: Zoom-Level 13 gibt bereits einen groben Überblick (Städteebene)
            var map = L.map('map').setView([lat, lng], 13);
            // OpenStreetMap-Kacheln einbinden
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap-Mitwirkende'
            }).addTo(map);
            // Marker an der ermittelten Position setzen
            L.marker([lat, lng]).addTo(map)
                .bindPopup("Sie befinden sich hier.")
                .openPopup();
        }, function(error) {
            document.getElementById("userInfo").innerText = "Karte konnte nicht geladen werden.";
        });
    } else {
        document.getElementById("userInfo").innerText = "Geolocation wird von diesem Browser nicht unterstützt.";
    }
});
