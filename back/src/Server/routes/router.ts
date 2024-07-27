import { Router } from 'express';
import { usersRouter } from "./users";
import { servicoRouter } from "./servicos";
import { vendaRouter } from "./venda";
import { parcelasRouter } from "./parcelas";
import { estoqueRouter } from './estoque';
import { categoriaRouter } from './categoria';
import { marcaRouter } from './marca';
import { historicEstoqueRouter } from './historicEstoque';

const router = Router();

router.use("/", usersRouter);
router.use("/", servicoRouter);
router.use("/", vendaRouter);
router.use("/", parcelasRouter);
router.use("/", estoqueRouter);
router.use("/", categoriaRouter);
router.use("/", historicEstoqueRouter);
router.use("/", marcaRouter)

export { router };
