const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(bodyParser.json());

// Criação da tabela de usuários
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
});

// Rota para registro
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function(err) {
        if (err) {
            return res.status(400).send('Erro ao registrar usuário');
        }
        res.status(200).send('Usuário registrado com sucesso');
    });
});
app.get('/test', (req, res) => {
    res.send('Rota de teste funcionando!');
});

// Rota para login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err || !row) {
            return res.status(401).send('Usuário ou senha inválidos');
        }
        res.status(200).send('Login bem-sucedido');
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});