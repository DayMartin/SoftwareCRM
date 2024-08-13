import { Router, Request, Response } from 'express';
import {usersController} from "../controllers/usersController";

const router = Router();

router.route("/user/all").get((req: Request, res: Response) => usersController.getUsers(req, res));
router.route("/user/create").post((req: Request, res: Response) => usersController.createUser(req, res));
router.route("/user/get").post((req: Request, res: Response) => usersController.getUser(req, res));
router.route("/user/getAlltipo").get((req: Request, res: Response) => usersController.getUserTipo(req, res));
router.route("/user/delete/:id").delete((req: Request, res: Response) => usersController.desativarUser(req, res));
router.route("/user/ativar/:id").put((req: Request, res: Response) => usersController.ativarUser(req, res));
router.route("/user/edit/:id").put((req: Request, res: Response) => usersController.editUser(req, res));

export { router as usersRouter };
