export const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 404,
    code: 'NOT_FOUND',
    message: 'Rota nao encontrada',
    error: 'Rota nao encontrada',
  });
};

export const sendInternalError = (res, error, message) => {
  console.error(error);
  return res.status(500).json({
    status: 500,
    code: 'INTERNAL_ERROR',
    message,
    error: message,
  });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  const isUploadError = error.name === 'MulterError';
  const status = isUploadError ? 400 : (error.statusCode || 500);
  const isServerError = status >= 500;

  if (isServerError) {
    console.error(error);
  }

  res.status(status).json({
    status,
    code: isUploadError ? 'INVALID_UPLOAD' : (error.code || (isServerError ? 'INTERNAL_ERROR' : 'REQUEST_ERROR')),
    message: isServerError ? 'Erro interno do servidor' : error.message,
    error: isServerError ? 'Erro interno do servidor' : error.message,
  });
};