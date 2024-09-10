import { Router, Request, Response } from 'express';
import {estoqueController} from "../controllers/estoqueController";
import upload from '../../middleware/uploadConfig';

const router = Router();

router.route("/estoque/all").get((req: Request, res: Response) => estoqueController.getEstoques(req, res));
router.route("/estoque/allList").post((req: Request, res: Response) => estoqueController.getEstoquesList(req, res));
router.route("/estoque/allListItem").post((req: Request, res: Response) => estoqueController.getListItemProduto(req, res));
router.route("/itemProduto/:idProduto").get((req: Request, res: Response) => estoqueController.getItemProduto(req, res));
router.route("/estoque/edit/:id").put(upload.single('imagem'), (req: Request, res: Response) => estoqueController.editEstoque(req, res));
router.route("/estoque/:id").get((req: Request, res: Response) => estoqueController.getEstoque(req, res));
// router.route("/estoque/create").post((req: Request, res: Response) => estoqueController.createEstoque(req, res));
router.route("/estoque/AllMarca/:marca_id").get((req: Request, res: Response) => estoqueController.getMarcaEstoque(req, res));
router.route("/estoque/AllFornecedor/:fornecedor_id").get((req: Request, res: Response) => estoqueController.getFornecedorEstoque(req, res));
router.route("/estoque/delete/:id").delete((req: Request, res: Response) => estoqueController.deleteEstoque(req, res));
router.route("/estoque/create").post(upload.single('imagem'), (req: Request, res: Response) => {
    estoqueController.createEstoque(req, res);
});

export { router as estoqueRouter };
