import { Router, Request, Response } from 'express';
import {historicEstoqueController} from "../controllers/historicEstoqueController";
import { authenticateToken } from '../../middleware/autenticacao';

const router = Router();

router.route("/historic/all").get(authenticateToken,(req: Request, res: Response) => historicEstoqueController.getHistoricEstoques(req, res));
router.route("/historic/get").post(authenticateToken,(req: Request, res: Response) => historicEstoqueController.getHistoricEstoque(req, res));
router.route("/historic/create").post(authenticateToken,(req: Request, res: Response) => historicEstoqueController.createHistoricEstoque(req, res));
router.route("/historic/AllEstoque/:estoque_id").get(authenticateToken,(req: Request, res: Response) => historicEstoqueController.getEstoque(req, res));
router.route("/historic/AllEstoqueList").post(authenticateToken,(req: Request, res: Response) => historicEstoqueController.getEstoquesList(req, res));
router.route("/historic/venda/:venda_id").get(authenticateToken,(req: Request, res: Response) => historicEstoqueController.getVenda(req, res));
router.route("/historic/compra/:compra_id").get(authenticateToken,(req: Request, res: Response) => historicEstoqueController.getCompra(req, res));

// adicionar historic compra_id
router.route("/historic/delete").delete((req: Request, res: Response) => historicEstoqueController.deleteHistoricEstoque(req, res));

export { router as historicEstoqueRouter };
