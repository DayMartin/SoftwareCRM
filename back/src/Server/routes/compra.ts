import { Router, Request, Response } from 'express';
import {compraController} from "../controllers/compraController";

const router = Router();

router.route("/compra/all").get((req, res) => compraController.getCompras(req, res));
router.route("/compra/create").post((req, res) => compraController.createCompra(req, res));
router.route("/compra/get/:id").post((req, res) => compraController.getCompra(req, res));
// router.route("/venda/totalmes").get((req, res) => vendaController.consultaMes(req, res));

router.route("/compra/delete").delete((req, res) => compraController.deleteCompra(req, res));


export { router as compraRouter };