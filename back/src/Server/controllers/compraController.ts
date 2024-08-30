import { Request, Response } from 'express';
import queryDatabase from '../database/queryPromise'
import { historicEstoqueService } from '../services/historicEstoqueService'
import { parcelasService } from '../services/parcelasService';
import { Compras } from '../models/compras.interface'; 


interface MonthlyCount {
	month: string;
	year: string;
	count: number;
}

const compraController = {

	getCompras: async (req: Request, res: Response) => {
		const { page = 1, limit = 5, id } = req.query;
		let query = "SELECT * FROM compra WHERE 1=1";
		let countQuery = "SELECT COUNT(*) AS total FROM compra WHERE 1=1";
		const params: any[] = [];

		if (id) {
			query += " AND id = ?";
			countQuery += " AND id = ?";
			params.push(id);
		}

		// Consulta de contagem total
		try {
			const totalResult = await queryDatabase(countQuery, params);
			const total = totalResult[0].total;

			// Consulta de paginação
			query += " LIMIT ? OFFSET ?";
			params.push(parseInt(limit as string));
			params.push((parseInt(page as string) - 1) * parseInt(limit as string));

			const rows = await queryDatabase(query, params);

			if (!rows || rows.length === 0) {
				return res.status(404).json({ error: "Nenhum registro encontrado" });
			}

			return res.status(200).json({
				rows,
				total, // Retornando a contagem total
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar registros" });
		}
	},

	// Função para criar uma nova Compra
	createCompra: async (req: Request, res: Response) => {
		const { fornecedor_id, funcionario_id, QTparcelas, valorTotal, valorDesconto, valorPago, valorTotalDesconto, status, parcelas, produtos, ItemProduto } = req.body;
		const insertCompraQuery = "INSERT INTO compra (fornecedor_id, funcionario_id, QTparcelas, valorTotal, valorDesconto, valorPago, valorTotalDesconto, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		const insertFinanceiroQuery = "INSERT INTO parcelas_compra (compra_id, tipoPagamento, parcela, valorParcela, dataPagamento, status) VALUES (?, ?, ?, ?, ?, ?)";
		const insertProdutoMovimento = "INSERT INTO produto_movimento (tipo, quantidade, estoque_id, compra_id) VALUES (?, ?, ?, ?)";
		const insertItemProduto = 'INSERT INTO item_produto (codBarras, estoque_id) VALUE (?,?)'
		try {
			// Inserir na tabela 'compra'
			const compraResult = await queryDatabase(insertCompraQuery, [fornecedor_id, funcionario_id, QTparcelas, valorTotal, valorDesconto, valorPago, valorTotalDesconto, status]);

			// Recuperar o ID da OS recém-criada
			const compra_id = compraResult.insertId;

			// Inserir na tabela 'financeiro' para cada parcela
			for (const parcela of parcelas) {
				await queryDatabase(insertFinanceiroQuery, [compra_id, parcela.tipoPagamento, parcela.parcela, parcela.valorParcela, parcela.dataPagamento, parcela.status]);
			}

			console.log(produtos)

			// Inserir estoque e histórico
			for (const produto of produtos) {
				const saveHistoric = await historicEstoqueService.createHistoricEstoque("Entrada", produto.quantidade, produto.id, compra_id, fornecedor_id)
				console.log('produtohistoric', saveHistoric)
				const tipo = "Entrada"
				await queryDatabase(insertProdutoMovimento, [tipo, produto.quantidade, produto.id, compra_id]);

				// inserir item_produto
				for (const Item of ItemProduto){
					console.log('ItemProduto', ItemProduto)
					console.log('ItemProduto', Item.codBarra)
					await queryDatabase(insertItemProduto, [Item.codBarra, produto.id ])
				}
			}


			return res.status(201).json({ message: `Compra criada com sucesso` });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao criar Compra" });
		}
	},

	// Função para buscar uma compra
	getCompra: async (req: Request, res: Response) => {
		const { id } = req.body;
		const query = "SELECT * FROM compra WHERE id = ?";

		try {
			const [rows] = await queryDatabase(query, [id]);

			// Verificar se a compra foi encontrada
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "compra não encontrado" });
			}

			// Se a compra foi encontrado, retornar compra dados
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Venda" });
		}
	},

	getComprasListFornecedor: async (req: Request, res: Response) => {
		const { page = 1, limit = 5, id, fornecedor_id } = req.query;
		let query = "SELECT * FROM compra WHERE 1=1";
		let countQuery = "SELECT COUNT(*) AS total FROM compra WHERE 1=1";
		const params: any[] = [];

		if (id) {
			query += " AND id = ?";
			countQuery += " AND id = ?";
			params.push(id);
		}

		if (fornecedor_id) {
			query += " AND fornecedor_id = ?";
			countQuery += " AND fornecedor_id = ?";
			params.push(fornecedor_id);
		}


		// Consulta de contagem total
		try {
			const totalResult = await queryDatabase(countQuery, params);
			const total = totalResult[0].total;

			// Consulta de paginação
			query += " LIMIT ? OFFSET ?";
			params.push(parseInt(limit as string));
			params.push((parseInt(page as string) - 1) * parseInt(limit as string));

			const rows = await queryDatabase(query, params);

			if (!rows || rows.length === 0) {
				return res.status(404).json({ error: "Nenhum registro encontrado" });
			}

			return res.status(200).json({
				rows,
				total, // Retornando a contagem total
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar registros" });
		}
	},

	// Função para deletar uma Compra
	deleteCompra: async (req: Request, res: Response) => {
		const { id } = req.body;
		const queryVerificar = "SELECT * FROM compra WHERE id = ?";
		const queryDeletar = "UPDATE compra SET status= ? WHERE id = ?";

		try {
			// Verificar se a compra existe
			const [rows] = await queryDatabase(queryVerificar, [id]);
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "compra não encontrada" });
			}
			const tipo = 'Compra'
			const queryHistoric = await historicEstoqueService.deleteHistoricEstoque(tipo, id)

			console.log('Chamando o serviço historic delete', queryHistoric)

			const queryParcelas = await parcelasService.deleteParcelas(id, tipo)
			console.log('Chamando o serviço queryParcelas delete', queryParcelas)

			// Se a Compra existe, então cancela-la
			const status = 'cancelado';
			await queryDatabase(queryDeletar, [status, id]);

			//NECESSARIO EXCLUIR CONTAS A PAGAR
			return res.status(200).json({ message: "Compra cancelada com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao deletar a Compra" });
		}
	},

	// Função para buscar quantidade de consultas por mês
	// consultaMes: async (_: Request, res: Response) => {
	// 	const query = "SELECT * FROM os";

	// 	try {
	// 		const rows: any[] = await queryDatabase(query);

	// 		// Verificar se há OSs cadastradas
	// 		if (!rows || rows.length === 0) {
	// 			return res.status(404).json({ error: "Nenhuma OS cadastrada" });
	// 		}

	// 		// Calcular a contagem de documentos por mês
	// 		const monthlyCount: { [key: string]: MonthlyCount } = rows.reduce((acc, row) => {
	// 			const [ rowYear, rowMonth] = row.dataServico.split('/');
	// 			const key = `${rowYear}/${rowMonth}`;

	// 			if (!acc[key]) {
	// 				acc[key] = {
	// 					month: rowMonth,
	// 					year: rowYear,
	// 					count: 0
	// 				};
	// 			}

	// 			acc[key].count++;

	// 			return acc;
	// 		}, {});

	// 		// Converter o objeto em uma matriz de resultados
	// 		const monthlyCountArray = Object.values(monthlyCount);

	// 		// Se houver OSs cadastradas, retornar os dados da contagem mensal
	// 		return res.status(200).json(monthlyCountArray);
	// 	} catch (error) {
	// 		console.error(error);
	// 		return res.status(500).json({ error: "Erro ao buscar OS's" });
	// 	}
	// },


	// Função para buscar consultas agendadas hoje
}

export { compraController };