export const validateBody = (validate) => (req, res, next) => {
  const errors = validate(req.body || {});

  if (errors.length > 0) {
    return res.status(400).json({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Dados invalidos',
      details: errors,
    });
  }

  next();
};

export const validateAuthBody = (body) => {
  const errors = [];
  const { nome, email, senha } = body;

  if (nome !== undefined && (typeof nome !== 'string' || nome.trim().length < 2)) {
    errors.push({ field: 'nome', message: 'Informe um nome com pelo menos 2 caracteres' });
  }

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Informe um email valido' });
  }

  if (typeof senha !== 'string' || senha.length < 6) {
    errors.push({ field: 'senha', message: 'A senha deve ter pelo menos 6 caracteres' });
  }

  return errors;
};

export const validateRegisterBody = (body) => {
  const errors = validateAuthBody(body);

  if (typeof body.nome !== 'string' || body.nome.trim().length < 2) {
    if (!errors.some(({ field }) => field === 'nome')) {
      errors.push({ field: 'nome', message: 'Informe um nome com pelo menos 2 caracteres' });
    }
  }

  return errors;
};

export const validateIdParam = (req, res, next) => {
  if (!/^\d+$/.test(req.params.id || '') || Number(req.params.id) < 1) {
    return res.status(400).json({
      status: 400,
      code: 'INVALID_ID',
      message: 'ID invalido',
    });
  }

  next();
};

export const validateSearchQuery = (req, res, next) => {
  if (typeof req.query.nome !== 'string' || req.query.nome.trim().length < 1) {
    return res.status(400).json({
      status: 400,
      code: 'INVALID_QUERY',
      message: 'Informe um nome para pesquisa',
    });
  }

  next();
};

export const validateClienteBody = (body) => {
  const errors = [];

  if (typeof body.nome !== 'string' || body.nome.trim().length < 2) {
    errors.push({ field: 'nome', message: 'Informe um nome com pelo menos 2 caracteres' });
  }

  if (body.email !== undefined && body.email !== null && body.email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push({ field: 'email', message: 'Informe um email valido' });
  }

  return errors;
};

export const validateProdutoBody = (body) => {
  const errors = [];
  const preco = Number(body.preco);
  const estoque = Number(body.estoque);

  if (typeof body.nome !== 'string' || body.nome.trim().length < 2) {
    errors.push({ field: 'nome', message: 'Informe um nome com pelo menos 2 caracteres' });
  }

  if (typeof body.descricao !== 'string' || body.descricao.trim().length < 1) {
    errors.push({ field: 'descricao', message: 'Informe uma descricao' });
  }

  if (typeof body.categoria !== 'string' || body.categoria.trim().length < 1) {
    errors.push({ field: 'categoria', message: 'Informe uma categoria' });
  }

  if (!Number.isFinite(preco) || preco < 0) {
    errors.push({ field: 'preco', message: 'Informe um preco valido' });
  }

  if (!Number.isInteger(estoque) || estoque < 0) {
    errors.push({ field: 'estoque', message: 'Informe um estoque inteiro valido' });
  }

  return errors;
};

const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

const isValidDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

export const validatePedidoBody = (body) => {
  const errors = [];
  const statusPermitidos = new Set(['Pendente', 'Concluído', 'Cancelado']);

  if (!isPositiveInteger(body.cliente_id)) {
    errors.push({ field: 'cliente_id', message: 'Informe um cliente valido' });
  }

  if (!isPositiveInteger(body.produto_id)) {
    errors.push({ field: 'produto_id', message: 'Informe um produto valido' });
  }

  if (!isPositiveInteger(body.quantidade)) {
    errors.push({ field: 'quantidade', message: 'A quantidade deve ser maior que zero' });
  }

  if (body.status !== undefined && !statusPermitidos.has(body.status)) {
    errors.push({ field: 'status', message: 'Informe um status de pedido valido' });
  }

  return errors;
};

export const validatePedidoMultiploBody = (body) => {
  const errors = [];

  if (!isPositiveInteger(body.cliente_id)) {
    errors.push({ field: 'cliente_id', message: 'Informe um cliente valido' });
  }

  if (!Array.isArray(body.produtos) || body.produtos.length === 0) {
    errors.push({ field: 'produtos', message: 'Informe pelo menos um produto' });
    return errors;
  }

  body.produtos.forEach((produto, index) => {
    if (!isPositiveInteger(produto.produto_id)) {
      errors.push({ field: `produtos[${index}].produto_id`, message: 'Informe um produto valido' });
    }

    if (!isPositiveInteger(produto.quantidade)) {
      errors.push({ field: `produtos[${index}].quantidade`, message: 'A quantidade deve ser maior que zero' });
    }
  });

  return errors;
};

export const validateContaReceberBody = (body) => {
  const errors = [];

  if (body.pedido_id !== undefined && body.pedido_id !== '' && !isPositiveInteger(body.pedido_id)) {
    errors.push({ field: 'pedido_id', message: 'Informe um pedido valido' });
  }

  if (!isPositiveInteger(body.cliente_id)) {
    errors.push({ field: 'cliente_id', message: 'Informe um cliente valido' });
  }

  if (!Number.isFinite(Number(body.valor)) || Number(body.valor) <= 0) {
    errors.push({ field: 'valor', message: 'Informe um valor maior que zero' });
  }

  if (!isValidDate(body.data_vencimento)) {
    errors.push({ field: 'data_vencimento', message: 'Informe uma data de vencimento valida' });
  }

  return errors;
};

export const validateContaPagarBody = (body) => {
  const errors = [];

  if (typeof body.descricao !== 'string' || body.descricao.trim().length < 2) {
    errors.push({ field: 'descricao', message: 'Informe uma descricao' });
  }

  if (!Number.isFinite(Number(body.valor)) || Number(body.valor) <= 0) {
    errors.push({ field: 'valor', message: 'Informe um valor maior que zero' });
  }

  if (!isValidDate(body.data_vencimento)) {
    errors.push({ field: 'data_vencimento', message: 'Informe uma data de vencimento valida' });
  }

  return errors;
};

export const validatePagamentoBody = (body) => {
  if (!isValidDate(body.data_pagamento)) {
    return [{ field: 'data_pagamento', message: 'Informe uma data de pagamento valida' }];
  }

  return [];
};