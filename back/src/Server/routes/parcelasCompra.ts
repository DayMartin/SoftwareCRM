import { Router, Request, Response } from 'express';
import {parcelasCompraController} from "../controllers/parcelasCompraController";

const router = Router();


router.route("/parcelasCompra/all").get((req, res) => parcelasCompraController.getParcelas(req, res));
router.route("/parcelasCompra/id/:id").get((req, res) => parcelasCompraController.getParcela(req, res));
router.route("/parcelasCompra/compra/:compra_id").get((req, res) => parcelasCompraController.getParcelaCompra(req, res));
router.route("/parcelasCompra/receber/:id").put((req, res) => parcelasCompraController.receberParcela(req, res));
router.route("/parcelasCompra/pendente/:id").put((req, res) => parcelasCompraController.pendeciaParcela(req, res));

router.route("/parcelasCompra/diapagamento").post((req, res) => parcelasCompraController.PagamentoDia(req, res));
router.route("/parcelasCompra/mespagamento").post((req, res) => parcelasCompraController.PagamentoMes(req, res));
router.route("/parcelasCompra/mestotalpagamento").get((req, res) => parcelasCompraController.PagamentoTotalMes(req, res));

router.route("/parcelasCompra/status").post((req, res) => parcelasCompraController.PagamentoStatus(req, res));
router.route("/parcelasCompra/delete").delete((req, res) => parcelasCompraController.deleteParcela(req, res));


export { router as parcelasCompraRouter };