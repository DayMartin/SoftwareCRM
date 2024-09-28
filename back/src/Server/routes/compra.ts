import { Router, Request, Response } from 'express';
import {compraController} from "../controllers/compraController";
import { authenticateToken } from '../../middleware/autenticacao';

const router = Router();

router.route("/compra/all").get(authenticateToken,(req, res) => compraController.getCompras(req, res));
router.route("/venda/allFornecedor").post(authenticateToken,(req, res) => compraController.getComprasListFornecedor(req, res));
router.route("/compra/create").post(authenticateToken,(req, res) => compraController.createCompra(req, res));
router.route("/compra/get/:id").post(authenticateToken,(req, res) => compraController.getCompra(req, res));
// router.route("/venda/totalmes").get((req, res) => vendaController.consultaMes(req, res));

router.route("/compra/delete").put(authenticateToken,(req, res) => compraController.deleteCompra(req, res));
router.route("/compra/filtro").post(authenticateToken,(req, res) => compraController.Filtro(req, res));


export { router as compraRouter };