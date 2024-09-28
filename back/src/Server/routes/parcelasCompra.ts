import { Router, Request, Response } from 'express';
import {parcelasCompraController} from "../controllers/parcelasCompraController";
import { authenticateToken } from '../../middleware/autenticacao';

const router = Router();


router.route("/parcelasCompra/all").get(authenticateToken,(req, res) => parcelasCompraController.getParcelas(req, res));
router.route("/parcelasCompra/id/:id").get(authenticateToken,(req, res) => parcelasCompraController.getParcela(req, res));
router.route("/parcelasCompra/compra/:compra_id").get(authenticateToken,(req, res) => parcelasCompraController.getParcelaCompra(req, res));
router.route("/parcelasCompra/receber/:id").put(authenticateToken,(req, res) => parcelasCompraController.receberParcela(req, res));
router.route("/parcelasCompra/pendente/:id").put(authenticateToken,(req, res) => parcelasCompraController.pendeciaParcela(req, res));

router.route("/parcelasCompra/diapagamento").post(authenticateToken,(req, res) => parcelasCompraController.PagamentoDia(req, res));
router.route("/parcelasCompra/mespagamento").post(authenticateToken,(req, res) => parcelasCompraController.PagamentoMes(req, res));
router.route("/parcelasCompra/mestotalpagamento").get(authenticateToken,(req, res) => parcelasCompraController.PagamentoTotalMes(req, res));

router.route("/parcelasCompra/status").post(authenticateToken,(req, res) => parcelasCompraController.PagamentoStatus(req, res));
router.route("/parcelasCompra/delete").delete(authenticateToken,(req, res) => parcelasCompraController.deleteParcela(req, res));

router.route("/parcelasCompra/filtro").post(authenticateToken,(req, res) => parcelasCompraController.Filtro(req, res));


export { router as parcelasCompraRouter };