import { Router, Request, Response } from 'express';
import {vendaController} from "../controllers/vendaController";

const router = Router();

router.route("/venda/all").get((req, res) => vendaController.getVendas(req, res));
router.route("/venda/create").post((req, res) => vendaController.createVenda(req, res));
router.route("/venda/get").post((req, res) => vendaController.getVenda(req, res));
// router.route("/venda/totalmes").get((req, res) => vendaController.consultaMes(req, res));

router.route("/venda/delete").put((req, res) => vendaController.deleteVenda(req, res));


export { router as vendaRouter };