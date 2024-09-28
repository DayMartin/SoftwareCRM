import { Router, Request, Response } from 'express';
import {parcelasVendaController} from "../controllers/parcelasVendaController";
import { authenticateToken } from '../../middleware/autenticacao';

const router = Router();


router.route("/parcelas/all").get(authenticateToken,(req, res) => parcelasVendaController.getParcelas(req, res));
router.route("/parcelas/id/:id").get(authenticateToken,(req, res) => parcelasVendaController.getParcela(req, res));
router.route("/parcelas/venda/:venda_id").get(authenticateToken,(req, res) => parcelasVendaController.getParcelaVenda(req, res));
router.route("/parcelas/receber/:id").put(authenticateToken,(req, res) => parcelasVendaController.receberParcela(req, res));
router.route("/parcelas/pendente/:id").put(authenticateToken,(req, res) => parcelasVendaController.pendeciaParcela(req, res));

router.route("/parcelas/diapagamento").post(authenticateToken,(req, res) => parcelasVendaController.PagamentoDia(req, res));
router.route("/parcelas/mespagamento").post(authenticateToken,(req, res) => parcelasVendaController.PagamentoMes(req, res));
router.route("/parcelas/mestotalpagamento").get(authenticateToken,(req, res) => parcelasVendaController.PagamentoTotalMes(req, res));

router.route("/parcelas/status").post(authenticateToken,(req, res) => parcelasVendaController.PagamentoStatus(req, res));
router.route("/parcelas/delete").delete(authenticateToken,(req, res) => parcelasVendaController.deleteParcela(req, res));

router.route("/parcelas/filtro").post(authenticateToken,(req, res) => parcelasVendaController.Filtro(req, res));


export { router as parcelasVendaRouter };