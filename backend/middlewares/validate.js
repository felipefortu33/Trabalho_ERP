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

  if (!Number.isFinite(preco) || preco < 0) {
    errors.push({ field: 'preco', message: 'Informe um preco valido' });
  }

  if (!Number.isInteger(estoque) || estoque < 0) {
    errors.push({ field: 'estoque', message: 'Informe um estoque inteiro valido' });
  }

  return errors;
};