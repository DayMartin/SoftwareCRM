import { Router, Request, Response } from 'express';
import {parcelasVendaController} from "../controllers/parcelasVendaController";

const router = Router();


router.route("/parcelas/all").get((req, res) => parcelasVendaController.getParcelas(req, res));
router.route("/parcelas/id/:id").get((req, res) => parcelasVendaController.getParcela(req, res));
router.route("/parcelas/venda/:venda_id").get((req, res) => parcelasVendaController.getParcelaVenda(req, res));
router.route("/parcelas/receber/:id").put((req, res) => parcelasVendaController.receberParcela(req, res));
router.route("/parcelas/pendente/:id").put((req, res) => parcelasVendaController.pendeciaParcela(req, res));

router.route("/parcelas/diapagamento").post((req, res) => parcelasVendaController.PagamentoDia(req, res));
router.route("/parcelas/mespagamento").post((req, res) => parcelasVendaController.PagamentoMes(req, res));
router.route("/parcelas/mestotalpagamento").get((req, res) => parcelasVendaController.PagamentoTotalMes(req, res));

router.route("/parcelas/status").post((req, res) => parcelasVendaController.PagamentoStatus(req, res));
router.route("/parcelas/delete").delete((req, res) => parcelasVendaController.deleteParcela(req, res));

router.route("/parcelas/filtro").post((req, res) => parcelasVendaController.Filtro(req, res));


export { router as parcelasVendaRouter };