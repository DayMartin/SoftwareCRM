import { Router, Request, Response } from 'express';
import {clienteController} from "../controllers/clienteController";
import { authenticateToken } from '../../middleware/autenticacao';

const router = Router();

router.route("/cliente/all").post(authenticateToken,(req: Request, res: Response) => clienteController.getClientes(req, res));
router.route("/clientes").post(authenticateToken,(req: Request, res: Response) => clienteController.getClientesCompleto(req, res));
router.route("/cliente/create").post(authenticateToken,(req: Request, res: Response) => clienteController.createCliente(req, res));
router.route("/cliente/list").get(authenticateToken,(req: Request, res: Response) => clienteController.getClientesALL(req, res));
router.route("/cliente/delete/:id").delete(authenticateToken,(req: Request, res: Response) => clienteController.desativarCliente(req, res));
router.route("/cliente/ativar/:id").put(authenticateToken,(req: Request, res: Response) => clienteController.ativarCliente(req, res));
router.route("/cliente/edit/:id").put(authenticateToken,(req: Request, res: Response) => clienteController.editCliente(req, res));
router.route("/cliente/view/:id").get(authenticateToken,(req: Request, res: Response) => clienteController.getCliente(req, res));

export { router as clienteRouter };
