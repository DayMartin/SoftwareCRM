import { Request, Response } from 'express';
import queryDatabase from '../database/queryPromise'
import { Marca } from '../models/marca.interface';
import { Produto } from '../models/produto.interface';

// Função para buscar todos as Marca

const marcaController = {

	getMarcas: async (_: Request, res: Response) => {
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
	createMarca: async (req: Request, res: Response) => {
		const { nome, categoria_id } = req.body;
		const query = "INSERT INTO marca (nome, categoria_id ) VALUES (?,?)";

		try {
			await queryDatabase(query, [nome, categoria_id]);
			return res.status(201).json({ message: "Marca criada com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao criar Marca" });
		}
	},

	// Função para buscar uma Marca por ID
	getMarca: async (req: Request, res: Response) => {
		const { id } = req.params;
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

	// Função para buscar uma Marca por categoria
	getMarcaCategoria: async (req: Request, res: Response) => {
		const { categoria_id } = req.params;
		const query = "SELECT * FROM marca WHERE categoria_id = ?";

		try {
			const rows = await queryDatabase(query, [categoria_id]);

			// Verificar se o Marca foi encontrada
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Marca não encontrada" });
			}
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Marca por categoria" });
		}
	},

	// Função para deletar uma Marca
	deleteMarca: async (req: Request, res: Response) => {
		const { id } = req.params;
		const queryVerificar = "SELECT * FROM marca WHERE id = ?";
		const consultarExistencias = "SELECT * FROM estoque WHERE marca_id = ?"
		const queryDeletar = "DELETE FROM marca WHERE id = ?";

		try {
			// Verificar se o Marca existe
			const rows: [Marca[]] = await queryDatabase(queryVerificar, [id]);
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Marca não encontrada" });
			}

			const linhas: Produto[] = await queryDatabase(consultarExistencias, [id]);
			if (!linhas || linhas.length === 0) {
			  await queryDatabase(queryDeletar, [id]);
			  return res.status(200).json({ message: "Marca deletada com sucesso" });
			} else {
			  const nomesProdutos = linhas.map(linha => linha.nome).join(", ");
			  return res.status(409).json({ message: `Não é possível excluir pois há os seguintes Produtos atreladas a esta Marca: ${nomesProdutos}` });
			}

		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao deletar a Marca" });
		}
	}
}

export { marcaController };
