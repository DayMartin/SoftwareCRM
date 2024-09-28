import { Router, Request, Response } from 'express';
import {servicosController} from "../controllers/servicoController";
import { authenticateToken } from '../../middleware/autenticacao';

const router = Router();

router.route("/servicos/all").get(authenticateToken,(req, res) => servicosController.getService(req, res));
router.route("/servicos/create").post(authenticateToken,(req, res) => servicosController.createServico(req, res));
router.route("/servicos/get").post(authenticateToken,(req, res) => servicosController.getServico(req, res));
router.route("/servicos/delete").delete(authenticateToken,(req, res) => servicosController.deleteServico(req, res));


export { router as servicoRouter };
