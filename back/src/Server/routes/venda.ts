import { Router, Request, Response } from 'express';
import {vendaController} from "../controllers/vendaController";

const router = Router();

router.route("/venda/all").get((req, res) => vendaController.getVendas(req, res));
router.route("/venda/allCliente").post((req, res) => vendaController.getVendasListCliente(req, res));
router.route("/venda/create").post((req, res) => vendaController.createVenda(req, res));
router.route("/venda/get").post((req, res) => vendaController.getVenda(req, res));
router.route("/venda/view/:id").get((req, res) => vendaController.getVendaByID(req, res));
// router.route("/venda/totalmes").get((req, res) => vendaController.consultaMes(req, res));
router.route("/venda/delete").put((req, res) => vendaController.deleteVenda(req, res));
router.route("/venda/comissaoVendedor").post((req, res) => vendaController.getVendasVendedor(req, res));
router.route("/venda/mes").get((req, res) => vendaController.getVendasMes(req, res));
router.route("/venda/dia").get((req, res) => vendaController.getVendasDia(req, res));
router.route("/venda/compare").get((req, res) => vendaController.getVendasCompare(req, res));


export { router as vendaRouter };