import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';

process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'test';
process.env.DB_NAME = 'test';
process.env.SECRET_KEY = 'test-secret';

const { default: app } = await import('../app.js');
let server;
let baseUrl;

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