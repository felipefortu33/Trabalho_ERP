import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'test';
process.env.DB_NAME = 'test';
process.env.SECRET_KEY = 'test-secret';

const { default: db } = await import('../config/db.js');
const { default: app } = await import('../app.js');
let server;
let baseUrl;
const authToken = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.SECRET_KEY);
const authHeaders = { Authorization: `Bearer ${authToken}` };

before(() => new Promise((resolve) => {
  server = app.listen(0, () => {
    baseUrl = `http://127.0.0.1:${server.address().port}`;
    resolve();
  });
}));

after(() => new Promise((resolve, reject) => {
  server.close((error) => (error ? reject(error) : resolve()));
}));

test('registra usuario com senha armazenada de forma derivada', async () => {
  let query;
  let params;
  const originalExecute = db.execute;
  db.execute = async (...args) => {
    [query, params] = args;
    return [{ affectedRows: 1 }];
  };

  try {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Usuário Teste',
        email: 'novo@example.com',
        senha: 'secret123',
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.message, 'Usuário registrado com sucesso!');
    assert.match(query, /^INSERT INTO usuarios/);
    assert.equal(params[0], 'Usuário Teste');
    assert.equal(params[1], 'novo@example.com');
    assert.notEqual(params[2], 'secret123');
    assert.equal(await bcrypt.compare('secret123', params[2]), true);
  } finally {
    db.execute = originalExecute;
  }
});

test('faz login e retorna token para credenciais validas', async () => {
  const passwordHash = await bcrypt.hash('secret123', 4);
  const originalExecute = db.execute;
  db.execute = async () => [[{
    id: 7,
    email: 'user@example.com',
    senha: passwordHash,
  }]];

  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', senha: 'secret123' }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.message, 'Login bem-sucedido');
    assert.equal(jwt.verify(body.token, process.env.SECRET_KEY).id, 7);
  } finally {
    db.execute = originalExecute;
  }
});

test('rejeita token invalido em rota protegida', async () => {
  const response = await fetch(`${baseUrl}/clientes`, {
    headers: { Authorization: 'Bearer token-invalido' },
  });

  assert.equal(response.status, 403);
});

test('executa CRUD de clientes autenticado', async () => {
  const originalExecute = db.execute;
  db.execute = async (query) => {
    if (query.startsWith('SELECT * FROM clientes')) {
      return [[{ id: 1, nome: 'Cliente Teste', email: 'cliente@example.com' }]];
    }
    if (query.startsWith('INSERT INTO clientes')) {
      return [{ affectedRows: 1 }];
    }
    if (query.startsWith('UPDATE clientes')) {
      return [{ affectedRows: 1 }];
    }
    if (query.startsWith('DELETE FROM clientes')) {
      return [{ affectedRows: 1 }];
    }
    throw new Error(`Consulta inesperada: ${query}`);
  };

  try {
    const listResponse = await fetch(`${baseUrl}/clientes`, { headers: authHeaders });
    assert.equal(listResponse.status, 200);
    assert.deepEqual(await listResponse.json(), [{ id: 1, nome: 'Cliente Teste', email: 'cliente@example.com' }]);

    const createResponse = await fetch(`${baseUrl}/clientes`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Novo Cliente', email: 'novo@example.com' }),
    });
    assert.equal(createResponse.status, 201);

    const updateResponse = await fetch(`${baseUrl}/clientes/1`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Cliente Atualizado', email: 'atualizado@example.com' }),
    });
    assert.equal(updateResponse.status, 200);

    const deleteResponse = await fetch(`${baseUrl}/clientes/1`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    assert.equal(deleteResponse.status, 200);
  } finally {
    db.execute = originalExecute;
  }
});

test('executa CRUD de produtos autenticado', async () => {
  const originalExecute = db.execute;
  db.execute = async (query) => {
    if (query.startsWith('SELECT * FROM produtos')) {
      return [[{ id: 1, nome: 'Produto Teste', preco: 10, estoque: 3 }]];
    }
    if (query.startsWith('INSERT INTO produtos')) {
      return [{ affectedRows: 1 }];
    }
    if (query.startsWith('SELECT url FROM produtos')) {
      return [[{ url: null }]];
    }
    if (query.includes('UPDATE produtos')) {
      return [{ affectedRows: 1 }];
    }
    if (query.startsWith('DELETE FROM produtos')) {
      return [{ affectedRows: 1 }];
    }
    throw new Error(`Consulta inesperada: ${query}`);
  };

  try {
    const listResponse = await fetch(`${baseUrl}/produtos`, { headers: authHeaders });
    assert.equal(listResponse.status, 200);
    assert.deepEqual(await listResponse.json(), [{ id: 1, nome: 'Produto Teste', preco: 10, estoque: 3 }]);

    const createForm = new FormData();
    createForm.set('nome', 'Novo Produto');
    createForm.set('preco', '12.50');
    createForm.set('estoque', '4');
    const createResponse = await fetch(`${baseUrl}/produtos`, {
      method: 'POST',
      headers: authHeaders,
      body: createForm,
    });
    assert.equal(createResponse.status, 201);

    const updateForm = new FormData();
    updateForm.set('nome', 'Produto Atualizado');
    updateForm.set('descricao', 'Descricao atualizada');
    updateForm.set('categoria', 'Categoria');
    updateForm.set('preco', '15.00');
    updateForm.set('estoque', '5');
    const updateResponse = await fetch(`${baseUrl}/produtos/1`, {
      method: 'PUT',
      headers: authHeaders,
      body: updateForm,
    });
    assert.equal(updateResponse.status, 200);

    const deleteResponse = await fetch(`${baseUrl}/produtos/1`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    assert.equal(deleteResponse.status, 200);
  } finally {
    db.execute = originalExecute;
  }
});
