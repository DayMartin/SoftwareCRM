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
import { authenticateToken } from '../../middleware/autenticacao';
import { userAuthRouter } from './userAuth';

const router = Router();

router.use("/", userAuthRouter);

router.use("/users", authenticateToken, usersRouter);
router.use("/servicos", authenticateToken, servicoRouter);
router.use("/fornecedores", authenticateToken, fornecedorRouter);
router.use("/clientes", authenticateToken, clienteRouter);
router.use("/vendas", authenticateToken, vendaRouter);
router.use("/compras", authenticateToken, compraRouter);
router.use("/parcelas-venda", authenticateToken, parcelasVendaRouter);
router.use("/parcelas-compra", authenticateToken, parcelasCompraRouter);
router.use("/estoque", authenticateToken, estoqueRouter);
router.use("/categorias", authenticateToken, categoriaRouter);
router.use("/historico-estoque", authenticateToken, historicEstoqueRouter);
router.use("/marcas", authenticateToken, marcaRouter);
router.use("/movimento-produto", authenticateToken, produtoMovimentoRouter);
router.use("/trocas", authenticateToken, trocaRouter);

export { router };
