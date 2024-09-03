import { Router } from 'express';
import { usersRouter } from "./users";
import { servicoRouter } from "./servicos";
import { vendaRouter } from "./venda";
import { compraRouter } from './compra';
import { parcelasVendaRouter } from "./parcelasVenda";
import { estoqueRouter } from './estoque';
import { categoriaRouter } from './categoria';
import { marcaRouter } from './marca';
import { historicEstoqueRouter } from './historicEstoque';
import { produtoMovimentoRouter } from './produto_movimento';
import { parcelasCompraRouter } from './parcelasCompra';
import { fornecedorRouter } from './fornecedor';

const router = Router();

router.use("/", usersRouter);
router.use("/", servicoRouter);
router.use("/", fornecedorRouter);
router.use("/", vendaRouter);
router.use("/", compraRouter)
router.use("/", parcelasVendaRouter);
router.use("/", parcelasCompraRouter);
router.use("/", estoqueRouter);
router.use("/", categoriaRouter);
router.use("/", historicEstoqueRouter);
router.use("/", marcaRouter)
router.use("/", produtoMovimentoRouter)

export { router };
