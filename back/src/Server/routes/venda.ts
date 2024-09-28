import { Router, Request, Response } from 'express';
import {vendaController} from "../controllers/vendaController";
import { authenticateToken } from '../../middleware/autenticacao';

const router = Router();

router.route("/venda/all").get(authenticateToken,(req, res) => vendaController.getVendas(req, res));
router.route("/venda/allCliente").post(authenticateToken,(req, res) => vendaController.getVendasListCliente(req, res));
router.route("/venda/create").post(authenticateToken,(req, res) => vendaController.createVenda(req, res));
router.route("/venda/get").post(authenticateToken,(req, res) => vendaController.getVenda(req, res));
router.route("/venda/view/:id").get(authenticateToken,(req, res) => vendaController.getVendaByID(req, res));
// router.route("/venda/totalmes").get((req, res) => vendaController.consultaMes(req, res));
router.route("/venda/delete").put(authenticateToken,(req, res) => vendaController.deleteVenda(req, res));
router.route("/venda/comissaoVendedor").post(authenticateToken,(req, res) => vendaController.getVendasVendedor(req, res));
router.route("/venda/comissaoVendedorTotal").post(authenticateToken,(req, res) => vendaController.getVendasVendedorTotal(req, res));
router.route("/venda/mes").get(authenticateToken,(req, res) => vendaController.getVendasMes(req, res));
router.route("/venda/dia").get(authenticateToken,(req, res) => vendaController.getVendasDia(req, res));
router.route("/venda/compare").get(authenticateToken,(req, res) => vendaController.getVendasCompare(req, res));

router.route("/venda/filtro").post(authenticateToken,(req, res) => vendaController.Filtro(req, res));


export { router as vendaRouter };