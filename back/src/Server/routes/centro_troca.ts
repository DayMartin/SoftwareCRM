import { Router, Request, Response } from 'express';
import {centroTrocaController} from "../controllers/centro_trocaController";
import { authenticateToken } from '../../middleware/autenticacao';

const router = Router();

router.route("/troca/all").post(authenticateToken,(req: Request, res: Response) => centroTrocaController.getTrocas(req, res));
router.route("/troca/create").post(authenticateToken,(req: Request, res: Response) => centroTrocaController.createTroca(req, res));
router.route("/troca/get").post(authenticateToken,(req: Request, res: Response) => centroTrocaController.getTrocas(req, res));

export { router as trocaRouter };
