import { Router } from 'express';
import { 
  getContasReceber,
  createContaReceber,
  registrarPagamentoReceber,
  getContasPagar,
  createContaPagar,
  registrarPagamentoPagar,
  getFluxoCaixa,
  getResumoFinanceiro
} from '../controllers/financeiroController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Financeiro
 *   description: Endpoints para gerenciamento financeiro (contas, fluxo de caixa, relatórios)
 */

/**
 * @swagger
 * /financeiro/contas-receber:
 *   get:
 *     summary: Lista todas as contas a receber
 *     tags: [Financeiro]
 *     responses:
 *       200:
 *         description: Lista de contas a receber
 */

/**
 * @swagger
 * /financeiro/contas-receber:
 *   post:
 *     summary: Cria uma nova conta a receber
 *     tags: [Financeiro]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente
 *               - valor
 *               - vencimento
 *             properties:
 *               cliente:
 *                 type: string
 *               valor:
 *                 type: number
 *               vencimento:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Conta a receber criada com sucesso
 */

/**
 * @swagger
 * /financeiro/contas-receber/{id}/pagar:
 *   post:
 *     summary: Registra pagamento de uma conta a receber
 *     tags: [Financeiro]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da conta a receber
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pagamento registrado com sucesso
 */

/**
 * @swagger
 * /financeiro/contas-pagar:
 *   get:
 *     summary: Lista todas as contas a pagar
 *     tags: [Financeiro]
 *     responses:
 *       200:
 *         description: Lista de contas a pagar
 */

/**
 * @swagger
 * /financeiro/contas-pagar:
 *   post:
 *     summary: Cria uma nova conta a pagar
 *     tags: [Financeiro]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fornecedor
 *               - valor
 *               - vencimento
 *             properties:
 *               fornecedor:
 *                 type: string
 *               valor:
 *                 type: number
 *               vencimento:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Conta a pagar criada com sucesso
 */

/**
 * @swagger
 * /financeiro/contas-pagar/{id}/pagar:
 *   post:
 *     summary: Registra pagamento de uma conta a pagar
 *     tags: [Financeiro]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da conta a pagar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pagamento registrado com sucesso
 */

/**
 * @swagger
 * /financeiro/fluxo-caixa:
 *   get:
 *     summary: Retorna o fluxo de caixa
 *     tags: [Financeiro]
 *     responses:
 *       200:
 *         description: Dados do fluxo de caixa
 */

/**
 * @swagger
 * /financeiro/resumo-financeiro:
 *   get:
 *     summary: Retorna um resumo financeiro geral
 *     tags: [Financeiro]
 *     responses:
 *       200:
 *         description: Dados do resumo financeiro
 */

router.get('/contas-receber', getContasReceber);
router.post('/contas-receber', createContaReceber);
router.post('/contas-receber/:id/pagar', registrarPagamentoReceber);

router.get('/contas-pagar', getContasPagar);
router.post('/contas-pagar', createContaPagar);
router.post('/contas-pagar/:id/pagar', registrarPagamentoPagar);

router.get('/fluxo-caixa', getFluxoCaixa);
router.get('/resumo-financeiro', getResumoFinanceiro);

export default router;
