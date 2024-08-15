import { Router, Request, Response } from 'express';
import { marcaController } from '../controllers/marcaController';

const router = Router();

router.route("/marca/all").get((req: Request, res: Response) => marcaController.getMarcas(req, res));
router.route("/marca/allList").post((req: Request, res: Response) => marcaController.getMarcasList(req, res));
router.route("/marca/get/:id").post((req: Request, res: Response) => marcaController.getMarca(req, res));
router.route("/marca/getCategoria/:categoria_id").get((req: Request, res: Response) => marcaController.getMarcaCategoria(req, res));
router.route("/marca/create").post((req: Request, res: Response) => marcaController.createMarca(req, res));
router.route("/marca/delete/:id").delete((req: Request, res: Response) => marcaController.deleteMarca(req, res));

export { router as marcaRouter };
