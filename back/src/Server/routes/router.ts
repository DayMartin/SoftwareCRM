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
import { clienteRouter } from './cliente';
import { trocaRouter } from './centro_troca';
import { userAuthRouter } from './userAuth';

const router = Router();

router.use("/", userAuthRouter);

// router.use("/users", usersRouter);
// router.use("/servicos", servicoRouter);
// router.use("/fornecedores", fornecedorRouter);
// router.use("/clientes", clienteRouter);
// router.use("/vendas", vendaRouter);
// router.use("/compras", compraRouter);
// router.use("/parcelas-venda", parcelasVendaRouter);
// router.use("/parcelas-compra", parcelasCompraRouter);
// router.use("/estoque", estoqueRouter);
// router.use("/categorias", categoriaRouter);
// router.use("/historico-estoque", historicEstoqueRouter);
// router.use("/marcas", marcaRouter);
// router.use("/movimento-produto", produtoMovimentoRouter);
// router.use("/trocas", trocaRouter);

router.use("/", usersRouter);
router.use("/", servicoRouter);
router.use("/", fornecedorRouter);
router.use("/", clienteRouter);
router.use("/", vendaRouter);
router.use("/", compraRouter);
router.use("/", parcelasVendaRouter);
router.use("/", parcelasCompraRouter);
router.use("/", estoqueRouter);
router.use("/", categoriaRouter);
router.use("/", historicEstoqueRouter);
router.use("/", marcaRouter);
router.use("/", produtoMovimentoRouter);
router.use("/", trocaRouter);

export { router };
