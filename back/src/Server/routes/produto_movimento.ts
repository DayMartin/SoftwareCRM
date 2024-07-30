import { Router, Request, Response } from 'express';
import { produtoMovimentoController } from "../controllers/ProdutoMovimentoController";

const router = Router();

router.route("/produto_movimento/venda/:venda_id").get((req, res) => produtoMovimentoController.getVenda(req, res));

export { router as produtoMovimentoRouter };