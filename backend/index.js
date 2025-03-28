import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'seu_segredo';

app.use(cors());
app.use(bodyParser.json());

// Banco de Dados
const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'erp_db'
});

const tables = [
    `CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        contato VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS produtos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        estoque INT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT,
        produto_id INT,
        data DATETIME,
        quantidade INT,
        FOREIGN KEY(cliente_id) REFERENCES clientes(id),
        FOREIGN KEY(produto_id) REFERENCES produtos(id)
    )`
];

for (const query of tables) {
    await db.execute(query);
}

// Rota de Registro
app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);

    try {
        await db.execute('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashedPassword]);
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

// Rota de Login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(senha, user.senha))) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Rota para buscar clientes
app.get('/clientes', authenticateToken, async (req, res) => {
    const [clientes] = await db.execute('SELECT * FROM clientes');
    res.json(clientes);
});

// Rota para listar produtos
app.get('/produtos', authenticateToken, async (req, res) => {
    const [produtos] = await db.execute('SELECT * FROM produtos');
    res.json(produtos);
});

// Rota para listar pedidos
app.get('/pedidos', authenticateToken, async (req, res) => {
    const [pedidos] = await db.execute(`
        SELECT p.id, c.nome AS cliente_nome, pr.nome AS produto_nome, p.quantidade, p.data 
        FROM pedidos p 
        JOIN clientes c ON p.cliente_id = c.id 
        JOIN produtos pr ON p.produto_id = pr.id
    `);
    res.json(pedidos);
});

// Rota para adicionar produtos
app.post('/produtos', authenticateToken, async (req, res) => {
    const { nome, preco, estoque } = req.body;
    try {
        await db.execute('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)', [nome, preco, estoque]);
        res.status(201).json({ message: 'Produto adicionado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar produto' });
    }
});

// Rota para adicionar clientes
app.post('/clientes', authenticateToken, async (req, res) => {
    const { nome, contato } = req.body;
    try {
        await db.execute('INSERT INTO clientes (nome, contato) VALUES (?, ?)', [nome, contato]);
        res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
});

// Rota para criar pedidos
app.post('/pedidos', authenticateToken, async (req, res) => {
    const { cliente_id, produto_id, quantidade } = req.body;
    const data = new Date();

    try {
        // Verificar se o produto tem estoque suficiente
        const [produto] = await db.execute('SELECT estoque FROM produtos WHERE id = ?', [produto_id]);
        if (produto[0].estoque < quantidade) {
            return res.status(400).json({ error: 'Estoque insuficiente para o pedido' });
        }

        // Inserir pedido
        await db.execute('INSERT INTO pedidos (cliente_id, produto_id, data, quantidade) VALUES (?, ?, ?, ?)', 
            [cliente_id, produto_id, data, quantidade]);
        
        // Atualizar o estoque
        await db.execute('UPDATE produtos SET estoque = estoque - ? WHERE id = ?', [quantidade, produto_id]);

        res.status(201).json({ message: 'Pedido criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar pedido' });
    }
});

// Iniciando servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
