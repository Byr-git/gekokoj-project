const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api', (req, res) => {
    res.json({
        mensaje: 'API de Gekokoj funcionando'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});