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

// Contas a Receber
router.get('/contas-receber', getContasReceber);
router.post('/contas-receber', createContaReceber);
router.post('/contas-receber/:id/pagar', registrarPagamentoReceber);

// Contas a Pagar
router.get('/contas-pagar', getContasPagar);
router.post('/contas-pagar', createContaPagar);
router.post('/contas-pagar/:id/pagar', registrarPagamentoPagar);

// Fluxo de Caixa
router.get('/fluxo-caixa', getFluxoCaixa);

// Relatórios
router.get('/resumo-financeiro', getResumoFinanceiro);

export default router;