import 'dotenv/config';

const required = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  }

  return value;
};

export const env = {
  port: Number(process.env.PORT || 5000),
  dbHost: required('DB_HOST'),
  dbUser: required('DB_USER'),
  dbPassword: required('DB_PASSWORD'),
  dbName: required('DB_NAME'),
  secretKey: required('SECRET_KEY'),
};