import { Request, Response } from "express";
// import db from '../database/conn'
import queryDatabase from "../database/queryPromise";
import { FornecedorConsulta } from "../models/fornecedor.interface";

const fornecedorController = {
	// Função para buscar todos os usuários
	getFornecedores: async (req: Request, res: Response) => {
		const { page = 1, limit = 5, id } = req.query;

		// Construir a consulta SQL com filtros e paginação
		let query = "SELECT * FROM fornecedor WHERE 1=1";
		const params: any[] = [];

		if (id) {
			query += " AND id = ?";
			params.push(id);
		}

		let countQuery = "SELECT COUNT(*) AS total FROM fornecedor WHERE 1=1";
		const countParams: any[] = [];

		if (id) {
			countQuery += " AND id = ?";
			countParams.push(Number(id));
		}

		const offset =
			(parseInt(page as string) - 1) * parseInt(limit as string);
		query += " LIMIT ? OFFSET ?";
		params.push(parseInt(limit as string), offset);

		try {
			// Executar a consulta para obter os registros
			const rows: FornecedorConsulta = await queryDatabase(query, params);

			// Executar a consulta para contar o total de registros
			const countResult = await queryDatabase(countQuery, countParams);
			const total = countResult[0]?.total || 0;

			if (!rows || rows === undefined) {
				return res
					.status(404)
					.json({ error: "Fornecedor não encontrado" });
			}

			// Retornar os registros e o total
			return res.status(200).json({ rows, total });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Fornecedor" });
		}
	},

	// Função para criar um novo Fornecedor
	createFornecedor: async (req: Request, res: Response) => {
		const { cpfcnpj, nome, telefone, endereco, email, status } = req.body;
		const query =
			"INSERT INTO fornecedor ( cpfcnpj, nome, telefone, endereco, email, status) VALUES ( ?, ?, ?, ?, ?, ?)";

		try {
			// Verifica se o email já está cadastrado
			const emailExistsQuery = "SELECT * FROM fornecedor WHERE email = ?";
			const [emailRows] = await queryDatabase(emailExistsQuery, [email]);

			if (emailRows) {
				return res
					.status(400)
					.json({ error: "Fornecedor já cadastrado" });
			}
			await queryDatabase(query, [
				cpfcnpj,
				nome,
				telefone,
				endereco,
				email,
				status,
			]);
			return res
				.status(201)
				.json({ message: `Fornecedor criado com sucesso` });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao criar Fornecedor" });
		}
	},

	// Função para editar um Fornecedor existente
	editFornecedor: async (req: Request, res: Response) => {
		const { id } = req.params;
		const { cpfcnpj, nome, telefone, endereco, email, status } = req.body;

		const fornecedorExistsQuery = "SELECT * FROM fornecedor WHERE id = ?";
		const [fornecedorRows] = await queryDatabase(fornecedorExistsQuery, [
			id,
		]);

		if (!fornecedorRows) {
			return res.status(404).json({ error: "Fornecedor não encontrado" });
		}

		try {
			const emailExistsQuery =
				"SELECT * FROM fornecedor WHERE email = ? AND id != ?";
			const [emailRows] = await queryDatabase(emailExistsQuery, [
				email,
				id,
			]);

			if (emailRows) {
				return res
					.status(400)
					.json({
						error: "Email já cadastrado por outro Fornecedor",
					});
			}

			const updateQuery = `
				UPDATE fornecedor 
				SET cpfcnpj = ?, nome = ?, telefone = ?, endereco = ?, email = ?, status = ? 
				WHERE id = ?
			`;
			await queryDatabase(updateQuery, [
				cpfcnpj,
				nome,
				telefone,
				endereco,
				email,
				status,
				id,
			]);

			return res
				.status(200)
				.json({ message: "Fornecedor atualizado com sucesso" });
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ error: "Erro ao atualizar Fornecedor" });
		}
	},

	// Função para buscar um Fornecedor
	getFornecedor: async (req: Request, res: Response) => {
		const { id } = req.body;
		const query = "SELECT * FROM fornecedor WHERE id = ?";

		try {
			const [rows] = await queryDatabase(query, [id]);

			// Verificar se o Fornecedor foi encontrado
			if (rows === null || rows === undefined) {
				return res
					.status(404)
					.json({ error: "Fornecedor não encontrado" });
			}

			// Se o Fornecedor foi encontrado, retornar os dados
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Fornecedor" });
		}
	},

	// Função para buscar todos os fornecedores
	getFornecedoresALL: async (req: Request, res: Response) => {
		try {
			const query = "SELECT * FROM fornecedor";
			const rows = await queryDatabase(query);

			// Verificar se rows é um array
			if (!Array.isArray(rows)) {
				return res
					.status(500)
					.json({ error: "Erro inesperado: Dados não são um array" });
			}

			// Retornar os dados encontrados
			return res.status(200).json(rows);
		} catch (error) {
			console.error("Erro ao buscar fornecedores:", error);
			return res
				.status(500)
				.json({ error: "Erro ao buscar fornecedores" });
		}
	},

	// Função para desativar um Fornecedor
	desativarFornecedor: async (req: Request, res: Response) => {
		const { id } = req.params;
		const queryVerificar = "SELECT * FROM fornecedor WHERE id = ?";
		const queryDesativar =
			"UPDATE financeiro.fornecedor SET status= ? WHERE id = ?";

		try {
			// Verificar se o Fornecedor existe
			const [rows] = await queryDatabase(queryVerificar, [id]);
			if (rows === null || rows === undefined) {
				return res
					.status(404)
					.json({ error: "Fornecedor não encontrado" });
			}

			// Se o Fornecedor existe, então deletá-lo
			await queryDatabase(queryDesativar, ["desativado", id]);
			return res
				.status(200)
				.json({ message: "Fornecedor desativado com sucesso" });
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ error: "Erro ao deletar o Fornecedor" });
		}
	},

	//Função para Ativar Fornecedor
	ativarFornecedor: async (req: Request, res: Response) => {
		const { id } = req.params;
		console.log("id", id);
		const queryVerificar = "SELECT * FROM fornecedor WHERE id = ?";
		const queryDesativar =
			"UPDATE financeiro.fornecedor SET status= ? WHERE id = ?";

		try {
			// Verificar se o Fornecedor existe
			const [rows] = await queryDatabase(queryVerificar, [id]);
			if (rows === null || rows === undefined) {
				return res
					.status(404)
					.json({ error: "Fornecedor não encontrado" });
			}

			// Se o Fornecedor existe, então desativa-lo
			await queryDatabase(queryDesativar, ["ativo", id]);
			return res
				.status(200)
				.json({ message: "Fornecedor desativado com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao deletar o Usuario" });
		}
	},
};

export { fornecedorController };
