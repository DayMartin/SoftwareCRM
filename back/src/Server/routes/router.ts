import { Router } from 'express';
import { usersRouter } from "./users";
import { servicoRouter } from "./servicos";
import { vendaRouter } from "./venda";
import { compraRouter } from './compra';
import { parcelasRouter } from "./parcelasVenda";
import { estoqueRouter } from './estoque';
import { categoriaRouter } from './categoria';
import { marcaRouter } from './marca';
import { historicEstoqueRouter } from './historicEstoque';
import { produtoMovimentoRouter } from './produto_movimento';

const router = Router();

router.use("/", usersRouter);
router.use("/", servicoRouter);
router.use("/", vendaRouter);
router.use("/", compraRouter)
router.use("/", parcelasRouter);
router.use("/", estoqueRouter);
router.use("/", categoriaRouter);
router.use("/", historicEstoqueRouter);
router.use("/", marcaRouter)
router.use("/", produtoMovimentoRouter)

export { router };
