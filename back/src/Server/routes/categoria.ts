import { Router, Request, Response } from 'express';
import {categoriaController} from "../controllers/categoriaController";
import { authenticateToken } from '../../middleware/autenticacao';

const router = Router();

router.route("/categoria/all").get(authenticateToken,(req: Request, res: Response) => categoriaController.getCategorias(req, res));
router.route("/categoria/allList").get(authenticateToken,(req: Request, res: Response) => categoriaController.getCategoriasList(req, res));
router.route("/categoria/get").post(authenticateToken,(req: Request, res: Response) => categoriaController.getCategoria(req, res));
router.route("/categoria/create").post(authenticateToken,(req: Request, res: Response) => categoriaController.createCategoria(req, res));
router.route("/categoria/delete/:id").delete(authenticateToken,(req: Request, res: Response) => categoriaController.deleteCategoria(req, res));

export { router as categoriaRouter };
