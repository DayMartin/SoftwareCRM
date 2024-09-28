import { Router, Request, Response } from 'express';
import {fornecedorController} from "../controllers/fornecedorController";
import { authenticateToken } from '../../middleware/autenticacao';

const router = Router();

router.route("/fornecedor/all").post(authenticateToken,(req: Request, res: Response) => fornecedorController.getFornecedores(req, res));
router.route("/fornecedor/list").get(authenticateToken,(req: Request, res: Response) => fornecedorController.getFornecedoresALL(req, res));
router.route("/fornecedor/create").post(authenticateToken,(req: Request, res: Response) => fornecedorController.createFornecedor(req, res));
router.route("/fornecedor/delete/:id").delete(authenticateToken,(req: Request, res: Response) => fornecedorController.desativarFornecedor(req, res));
router.route("/fornecedor/ativar/:id").put(authenticateToken,(req: Request, res: Response) => fornecedorController.ativarFornecedor(req, res));
router.route("/fornecedor/edit/:id").put(authenticateToken,(req: Request, res: Response) => fornecedorController.editFornecedor(req, res));

export { router as fornecedorRouter };
