import { Router, Request, Response } from 'express';
import {centroTrocaController} from "../controllers/centro_trocaController";

const router = Router();

router.route("/troca/all").get((req: Request, res: Response) => centroTrocaController.getTrocas(req, res));
router.route("/troca/create").post((req: Request, res: Response) => centroTrocaController.createTroca(req, res));
router.route("/troca/get").post((req: Request, res: Response) => centroTrocaController.getTrocas(req, res));

export { router as trocaRouter };
