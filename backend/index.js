const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Servidor rodando com Node.js!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});