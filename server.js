const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const usersFilePath = path.join(__dirname, 'users.json');

// Middleware für JSON-Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien aus dem "public"-Ordner servieren
app.use(express.static('public'));

// GET-Endpunkt, um alle Nutzer abzurufen (für Login)
app.get('/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            // Falls die Datei noch nicht existiert, wird ein leeres Nutzerobjekt zurückgegeben
            if (err.code === 'ENOENT') {
                return res.json({ users: [] });
            }
            return res.status(500).send('Fehler beim Lesen der Nutzerdaten.');
        }
        try {
            const users = JSON.parse(data);
            res.json(users);
        } catch (parseError) {
            res.status(500).send('Fehler beim Parsen der Nutzerdaten.');
        }
    });
});

// POST-Endpunkt für die Registrierung
app.post('/register', (req, res) => {
    const newUser = req.body; // Erwartet, dass das Frontend ein JSON-Objekt sendet

    // Lese die bestehenden Nutzerdaten
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        let users = { users: [] };
        if (!err) {
            try {
                users = JSON.parse(data);
            } catch (parseError) {
                users = { users: [] };
            }
        }
        // (Optional: Überprüfen, ob der Benutzername bereits existiert)
        const duplicate = users.users.find(user => user.username === newUser.username);
        if (duplicate) {
            return res.status(400).json({ message: 'Benutzername existiert bereits.' });
        }

        // Neuen Nutzer hinzufügen
        users.users.push(newUser);
        // Schreibe die aktualisierten Nutzerdaten in die Datei
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Fehler beim Speichern der Nutzerdaten.');
            }
            res.json({ message: 'Registrierung erfolgreich', user: newUser });
        });
    });
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
