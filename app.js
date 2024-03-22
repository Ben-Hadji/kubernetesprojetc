const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Ceci est une réponse à une requête GET');
});

app.post('/', (req, res) => {
    res.send('Ceci est une réponse à une requête POST');
});

app.listen(3000, () => {
    console.log('Le serveur est en écoute sur le port 3000');
});