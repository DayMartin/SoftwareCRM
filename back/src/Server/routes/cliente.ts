import { Router, Request, Response } from 'express';
import {clienteController} from "../controllers/clienteController";

const router = Router();

router.route("/cliente/all").post((req: Request, res: Response) => clienteController.getClientes(req, res));
router.route("/clientes").post((req: Request, res: Response) => clienteController.getClientesCompleto(req, res));
router.route("/cliente/create").post((req: Request, res: Response) => clienteController.createCliente(req, res));
router.route("/cliente/list").get((req: Request, res: Response) => clienteController.getClientesALL(req, res));
router.route("/cliente/delete/:id").delete((req: Request, res: Response) => clienteController.desativarCliente(req, res));
router.route("/cliente/ativar/:id").put((req: Request, res: Response) => clienteController.ativarCliente(req, res));
router.route("/cliente/edit/:id").put((req: Request, res: Response) => clienteController.editCliente(req, res));

export { router as clienteRouter };
