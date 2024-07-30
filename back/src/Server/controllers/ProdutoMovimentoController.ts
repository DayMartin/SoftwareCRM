import { Request, Response } from 'express';
import queryDatabase from '../database/queryPromise'

// Função para buscar todos os historicos de estoque

const produtoMovimentoController = {

	// Função para buscar um Histórico de Estoque por ID do estoque
	getVenda: async (req: Request, res: Response) => {
		const { venda_id } = req.params;
		const query = "SELECT * FROM produto_movimento WHERE venda_id = ?";

		try {
			const rows = await queryDatabase(query, [venda_id]);

			// Verificar se o Estoque foi encontrado
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "produto_movimento não encontrado" });
			}
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar produto_movimento" });
		}
	},

	// Função para deletar um Estoque
	deleteHistoricEstoque: async (req: Request, res: Response) => {
		const { id } = req.body;
		const queryVerificar = "SELECT * FROM estoqueHistoric WHERE id = ?";
		const queryDeletar = "DELETE FROM estoqueHistoric WHERE id = ?";

		try {
			// Verificar se o Histórico de Estoque existe
			const [rows] = await queryDatabase(queryVerificar, [id]);
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Histórico de Estoque não encontrado" });
			}

			// Se o Histórico de Estoque existe, então deletá-lo
			await queryDatabase(queryDeletar, [id]);
			return res.status(200).json({ message: "Histórico de Estoque deletado com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao deletar o Estoque" });
		}
	}
}

export { produtoMovimentoController };
