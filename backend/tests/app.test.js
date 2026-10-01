import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'test';
process.env.DB_NAME = 'test';
process.env.SECRET_KEY = 'test-secret';

const { default: app } = await import('../app.js');
let server;
let baseUrl;
const authToken = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.SECRET_KEY);

before(() => new Promise((resolve) => {
  server = app.listen(0, () => {
    baseUrl = `http://127.0.0.1:${server.address().port}`;
    resolve();
  });
}));

after(() => new Promise((resolve, reject) => {
  server.close((error) => (error ? reject(error) : resolve()));
}));

test('retorna erro estruturado para login invalido', async () => {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'invalido', senha: '123' }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.code, 'VALIDATION_ERROR');
  assert.equal(body.status, 400);
  assert.ok(Array.isArray(body.details));
});

test('bloqueia rota protegida sem token', async () => {
  const response = await fetch(`${baseUrl}/clientes`);

  assert.equal(response.status, 401);
});

test('retorna 404 para rota inexistente', async () => {
  const response = await fetch(`${baseUrl}/rota-inexistente`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.code, 'NOT_FOUND');
});

test('valida payload de cliente antes de acessar o banco', async () => {
  const response = await fetch(`${baseUrl}/clientes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome: 'A', email: 'invalido' }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.code, 'VALIDATION_ERROR');
  assert.deepEqual(body.details.map(({ field }) => field), ['nome', 'email']);
});

test('valida pedido multiplo antes de acessar o banco', async () => {
  const response = await fetch(`${baseUrl}/pedidos/multiplos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cliente_id: '', produtos: [] }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.code, 'VALIDATION_ERROR');
  assert.equal(body.details.length, 2);
});

test('valida conta a pagar antes de acessar o banco', async () => {
  const response = await fetch(`${baseUrl}/financeiro/contas-pagar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ descricao: '', valor: -1, data_vencimento: 'invalida' }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.code, 'VALIDATION_ERROR');
  assert.equal(body.details.length, 3);
});