import { Router, Request, Response } from 'express';
import { produtoMovimentoController } from "../controllers/ProdutoMovimentoController";
import { authenticateToken } from '../../middleware/autenticacao';

const router = Router();

router.route("/produto_movimento/venda/:venda_id").get(authenticateToken,(req, res) => produtoMovimentoController.getVenda(req, res));
router.route("/produto_movimento/compra/:compra_id").get(authenticateToken,(req, res) => produtoMovimentoController.getCompra(req, res));

export { router as produtoMovimentoRouter };