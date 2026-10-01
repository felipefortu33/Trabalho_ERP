import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAuthBody,
  validateClienteBody,
  validateContaPagarBody,
  validateContaReceberBody,
  validatePagamentoBody,
  validatePedidoMultiploBody,
  validateProdutoBody,
  validateRegisterBody,
} from '../middlewares/validate.js';

test('rejeita cadastro com nome, email e senha invalidos', () => {
  const errors = validateRegisterBody({ nome: 'A', email: 'invalido', senha: '123' });

  assert.deepEqual(errors.map(({ field }) => field), ['nome', 'email', 'senha']);
});

test('aceita login valido', () => {
  assert.deepEqual(validateAuthBody({ email: 'user@example.com', senha: 'secret123' }), []);
});

test('valida cliente e produto', () => {
  assert.deepEqual(validateClienteBody({ nome: 'Cliente Teste', email: 'user@example.com' }), []);
  assert.deepEqual(validateProdutoBody({ nome: 'Produto Teste', preco: '10.50', estoque: '3' }), []);
  assert.equal(validateProdutoBody({ nome: '', preco: '-1', estoque: '1.5' }).length, 3);
});

test('valida pedido com multiplos produtos', () => {
  assert.deepEqual(validatePedidoMultiploBody({
    cliente_id: '1',
    produtos: [{ produto_id: '2', quantidade: '3' }],
  }), []);
  assert.equal(validatePedidoMultiploBody({ cliente_id: '', produtos: [] }).length, 2);
});

test('valida contas e pagamentos financeiros', () => {
  assert.deepEqual(validateContaReceberBody({
    cliente_id: '1',
    valor: '10.50',
    data_vencimento: '2026-10-15',
  }), []);
  assert.deepEqual(validateContaPagarBody({
    descricao: 'Internet',
    valor: '100',
    data_vencimento: '2026-10-15',
  }), []);
  assert.deepEqual(validatePagamentoBody({ data_pagamento: '2026-10-15' }), []);
  assert.equal(validatePagamentoBody({ data_pagamento: '15/10/2026' }).length, 1);
});