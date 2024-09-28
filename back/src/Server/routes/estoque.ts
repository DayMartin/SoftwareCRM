import { Router, Request, Response } from 'express';
import {estoqueController} from "../controllers/estoqueController";
import upload from '../../middleware/uploadConfig';

const router = Router();
import { authenticateToken } from '../../middleware/autenticacao';


router.route("/estoque/all").get(authenticateToken,(req: Request, res: Response) => estoqueController.getEstoques(req, res));
router.route("/estoque/allList").post(authenticateToken,(req: Request, res: Response) => estoqueController.getEstoquesList(req, res));
router.route("/estoque/allListItem").post(authenticateToken,(req: Request, res: Response) => estoqueController.getListItemProduto(req, res));
router.route("/itemProduto/:idProduto").get(authenticateToken,(req: Request, res: Response) => estoqueController.getItemProduto(req, res));
router.route("/estoque/edit/:id").put(authenticateToken, upload.single('imagem'), (req: Request, res: Response) => estoqueController.editEstoque(req, res));
router.route("/estoque/:id").get(authenticateToken,(req: Request, res: Response) => estoqueController.getEstoque(req, res));
// router.route("/estoque/create").post((req: Request, res: Response) => estoqueController.createEstoque(req, res));
router.route("/estoque/AllMarca/:marca_id").get(authenticateToken,(req: Request, res: Response) => estoqueController.getMarcaEstoque(req, res));
router.route("/estoque/AllFornecedor/:fornecedor_id").get(authenticateToken,(req: Request, res: Response) => estoqueController.getFornecedorEstoque(req, res));
router.route("/estoque/delete/:id").delete(authenticateToken,(req: Request, res: Response) => estoqueController.deleteEstoque(req, res));
router.route("/estoque/create").post(authenticateToken,upload.single('imagem'), (req: Request, res: Response) => {
    estoqueController.createEstoque(req, res);
});
router.route("/graficoEstoque").get(authenticateToken, (req: Request, res: Response) => estoqueController.grafico(req, res));
router.route("/graficoEstoqueTopVendas").get(authenticateToken,(req: Request, res: Response) => estoqueController.graficoTopVendas(req, res));
router.route("/graficoEstoqueTopVendasMes").get(authenticateToken,(req: Request, res: Response) => estoqueController.graficoTopVendasMes(req, res));

export { router as estoqueRouter };
