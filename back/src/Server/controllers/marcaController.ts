import { Request, Response } from 'express';
import queryDatabase from '../database/queryPromise'

// Função para buscar todos as Marca

const marcaController = {

	getMarcas: async (_:Request, res:Response) => {
		const query = "SELECT * FROM marca";

		try {
			const rows = await queryDatabase(query);

			// Verificar se tem Marca cadastrada
			if (rows.length === 0) {
				return res.status(404).json({ error: "Nenhum Marca cadastrada" });
			}
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Marcas" });
		}
	},

	// Função para criar uma nova Marca
	createMarca: async (req:Request, res:Response) => {
		const { nome } = req.body;
		const query = "INSERT INTO marca (nome) VALUES (?)";

		try {
			await queryDatabase(query, [nome]);
			return res.status(201).json({ message: "Marca criada com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao criar Marca" });
		}
	},

	// Função para buscar uma Marca por ID
	getMarca: async (req:Request, res:Response) => {
		const { id } = req.body;
		const query = "SELECT * FROM marca WHERE id = ?";

		try {
			const [rows, fields] = await queryDatabase(query, [id]);

			// Verificar se o Marca foi encontrada
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Marca não encontrada" });
			}
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Categoria" });
		}
	},

	// Função para deletar uma Marca
	deleteMarca: async (req:Request, res:Response) => {
		const { id } = req.body;
		const queryVerificar = "SELECT * FROM marca WHERE id = ?";
		const queryDeletar = "DELETE FROM marca WHERE id = ?";

		try {
			// Verificar se o Marca existe
			const [rows] = await queryDatabase(queryVerificar, [id]);
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Marca não encontrada" });
			}

			// Se a Marca existe, então deletá-la
			await queryDatabase(queryDeletar, [id]);
			return res.status(200).json({ message: "Marca deletada com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao deletar a Marca" });
		}
	}
}

export { marcaController };
