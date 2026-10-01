# Trabalho_ERP

Repositorio para o desenvolvimento de um sistema ERP simples para gerenciar clientes, produtos e pedidos.

## Backend

1. Copie `backend/.env.example` para `backend/.env` e preencha as credenciais do MySQL.
2. Instale as dependencias:

	```bash
	cd backend
	npm install
	```

3. Execute os testes:

	```bash
	npm test
	```

4. Inicie a API:

	```bash
	npm start
	```

## Clientes

- Frontend web: copie `frontend/.env.example` para `frontend/.env` e execute `npm install` e `npm run dev` dentro de `frontend`.
- Aplicativo mobile: copie `android/MeuApp/.env.example` para `android/MeuApp/.env` e execute `npm install` e `npm start` dentro de `android/MeuApp`.

O projeto usa branches `main`, `develop` e `feature/xxx`, com revisao por pull requests.
