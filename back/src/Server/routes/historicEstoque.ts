import { Router, Request, Response } from 'express';
import {historicEstoqueController} from "../controllers/historicEstoqueController";

const router = Router();

router.route("/historic/all").get((req: Request, res: Response) => historicEstoqueController.getHistoricEstoques(req, res));
router.route("/historic/get").post((req: Request, res: Response) => historicEstoqueController.getHistoricEstoque(req, res));
router.route("/historic/create").post((req: Request, res: Response) => historicEstoqueController.createHistoricEstoque(req, res));
router.route("/historic/AllEstoque/:estoque_id").get((req: Request, res: Response) => historicEstoqueController.getEstoque(req, res));
router.route("/historic/venda/:venda_id").get((req: Request, res: Response) => historicEstoqueController.getVenda(req, res));
// adicionar historic compra_id
router.route("/historic/delete").delete((req: Request, res: Response) => historicEstoqueController.deleteHistoricEstoque(req, res));

export { router as historicEstoqueRouter };
