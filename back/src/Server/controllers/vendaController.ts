import { Request, Response } from 'express';
import queryDatabase from '../database/queryPromise'
import { historicEstoqueService } from '../services/historicEstoqueService'
import { parcelasService } from '../services/parcelasService';
import { VendaConsulta } from '../models/venda.interface';

interface MonthlyCount {
	month: string;
	year: string;
	count: number;
}

const vendaController = {

	getVendas: async (req: Request, res: Response) => {
		const { page = 1, limit = 5, id } = req.query;
		let query = "SELECT * FROM venda WHERE 1=1";
		let countQuery = "SELECT COUNT(*) AS total FROM venda WHERE 1=1";
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

	// Função para criar uma nova venda
	createVenda: async (req: Request, res: Response) => {
		const { cliente_id, funcionario_id, QTparcelas, valorTotal, valorDesconto, valorPago, valorTotalDesconto, status, parcelas, produtos } = req.body;
		const insertVendaQuery = "INSERT INTO venda (cliente_id, funcionario_id, QTparcelas, valorTotal, valorDesconto, valorPago, valorTotalDesconto, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		const insertFinanceiroQuery = "INSERT INTO parcelas_venda (venda_id, tipoPagamento, parcela, valorParcela, dataPagamento, status) VALUES (?, ?, ?, ?, ?, ?)";
		const insertProdutoMovimento = "INSERT INTO produto_movimento (tipo, quantidade, estoque_id, venda_id) VALUES (?, ?, ?, ?)";

		try {
			// Inserir na tabela 'os'
			const osResult = await queryDatabase(insertVendaQuery, [cliente_id, funcionario_id, QTparcelas, valorTotal, valorDesconto, valorPago, valorTotalDesconto, status]);

			// Recuperar o ID da OS recém-criada
			const venda_id = osResult.insertId;

			// Inserir na tabela 'financeiro' para cada parcela
			for (const parcela of parcelas) {
				await queryDatabase(insertFinanceiroQuery, [venda_id, parcela.tipoPagamento, parcela.parcela, parcela.valorParcela, parcela.dataPagamento, parcela.status]);
			}

			console.log(produtos)

			// Inserir estoque e histórico
			for (const produto of produtos) {
				const saveHistoric = await historicEstoqueService.createHistoricEstoque("Saída", produto.quantidade, produto.id, venda_id)
				console.log('produtohistoric', saveHistoric)
				const tipo = "Saída"
				await queryDatabase(insertProdutoMovimento, [tipo, produto.quantidade, produto.id, venda_id]);

			}

			return res.status(201).json({ message: `Venda criada com sucesso` });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao criar Venda" });
		}
	},

	// Função para buscar uma compra
	getVenda: async (req: Request, res: Response) => {
		const { id } = req.body;
		const query = "SELECT * FROM venda WHERE id = ?";

		try {
			const [rows] = await queryDatabase(query, [id]);

			// Verificar se a Venda foi encontrada
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Venda não encontrado" });
			}

			// Se a Venda foi encontrado, retornar Venda dados
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Venda" });
		}
	},

	// Função para deletar uma Compra
	deleteVenda: async (req: Request, res: Response) => {
		const { id } = req.body;
		const queryVerificar = "SELECT * FROM venda WHERE id = ?";
		const queryDeletar = "UPDATE venda SET status= ? WHERE id = ?";

		try {
			// Verificar se a Venda existe
			const [rows] = await queryDatabase(queryVerificar, [id]);
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Venda não encontrada" });
			}
			const tipo = 'Venda'
			const queryHistoric = await historicEstoqueService.deleteHistoricEstoque(tipo, id)

			console.log('Chamando o serviço historic delete', queryHistoric)

			const queryParcelas = await parcelasService.deleteParcelas(id, tipo)
			console.log('Chamando o serviço queryParcelas delete', queryParcelas)

			// Se a Venda existe, então cancela-la
			const status = 'cancelado';
			await queryDatabase(queryDeletar, [status, id]);

			//NECESSARIO EXCLUIR CONTAS A PAGAR
			return res.status(200).json({ message: "Venda cancelada com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao deletar a Venda" });
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

export { vendaController };