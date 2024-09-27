import { Router, Request, Response } from 'express';
import {usersController} from "../controllers/usersController";

const router = Router();

router.route("/login").post((req: Request, res: Response) => usersController.loginUser(req, res));
router.route("/user/create").post((req: Request, res: Response) => usersController.createUser(req, res));

export { router as userAuthRouter };
