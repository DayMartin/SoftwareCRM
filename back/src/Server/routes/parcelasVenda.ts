import { Router, Request, Response } from 'express';
import {parcelasController} from "../controllers/parcelasVendaController";

const router = Router();


router.route("/parcelas/all").get((req, res) => parcelasController.getParcelas(req, res));
router.route("/parcelas/id").post((req, res) => parcelasController.getParcela(req, res));
router.route("/parcelas/venda/:venda_id").get((req, res) => parcelasController.getParcelaVenda(req, res));
router.route("/parcelas/receber/:id").put((req, res) => parcelasController.receberParcela(req, res));
router.route("/parcelas/pendente/:id").put((req, res) => parcelasController.pendeciaParcela(req, res));

router.route("/parcelas/diapagamento").post((req, res) => parcelasController.PagamentoDia(req, res));
router.route("/parcelas/mespagamento").post((req, res) => parcelasController.PagamentoMes(req, res));
router.route("/parcelas/mestotalpagamento").get((req, res) => parcelasController.PagamentoTotalMes(req, res));

router.route("/parcelas/status").post((req, res) => parcelasController.PagamentoStatus(req, res));
router.route("/parcelas/delete").delete((req, res) => parcelasController.deleteParcela(req, res));


export { router as parcelasRouter };