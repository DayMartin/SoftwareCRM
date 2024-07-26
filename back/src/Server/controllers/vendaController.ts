import { Request, Response } from 'express';
import queryDatabase from '../database/queryPromise'
import { historicEstoqueService } from '../services/historicEstoqueService'

// Função para buscar todos os usuários

interface MonthlyCount {
    month: string;
    year: string;
    count: number;
}

const vendaController = {

	getVendas: async (_:Request, res:Response) => {
		const query = "SELECT * FROM venda";

		try {
			const rows = await queryDatabase(query);
			// Verificar se tem venda cadastrada
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Nenhum Venda cadastrado" });
			}
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Venda's" });
		}
	},

	// Função para criar uma nova venda
	createVenda: async (req:Request, res:Response) => {
		const { cliente_id, funcionario_id, QTparcelas, valorTotal, valorDesconto, valorPago, status, parcelas, produtos } = req.body;
		const insertVendaQuery = "INSERT INTO venda (cliente_id, funcionario_id, QTparcelas, valorTotal, valorDesconto, valorPago, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
		const insertFinanceiroQuery = "INSERT INTO parcelas_venda (venda_id, tipoPagamento, parcela, valorParcela, dataPagamento, status) VALUES (?, ?, ?, ?, ?, ?)";

		try {
			// Inserir na tabela 'os'
			const osResult = await queryDatabase(insertVendaQuery, [cliente_id, funcionario_id, QTparcelas, valorTotal, valorDesconto, valorPago, status]);

			// Recuperar o ID da OS recém-criada
			const venda_id = osResult.insertId;

			// Inserir na tabela 'financeiro' para cada parcela
			for (const parcela of parcelas) {
				await queryDatabase(insertFinanceiroQuery, [venda_id, parcela.tipoPagamento, parcela.parcela, parcela.valorParcela, parcela.dataPagamento, parcela.status]);
			}

			console.log(produtos)

			// Inserir estoque e histórico
			for ( const produto of produtos ) { 
				const saveHistoric = await historicEstoqueService.createHistoricEstoque("Saída", produto.quantidade, produto.id, venda_id)
				console.log('produtohistoric', saveHistoric)
			}

			return res.status(201).json({ message: `Venda criada com sucesso` });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao criar Venda" });
		}
	},

	// Função para buscar um usuário
	getVenda: async (req:Request, res:Response) => {
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

	// Função para deletar uma OS
	deleteVenda: async (req:Request, res:Response) => {
		const { id } = req.body;
		const queryVerificar = "SELECT * FROM venda WHERE id = ?";
		const queryDeletar = "DELETE FROM venda WHERE id = ?";

		try {
			// Verificar se a Venda existe
			const [rows] = await queryDatabase(queryVerificar, [id]);
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Venda não encontrada" });
			}

			// Se a Venda existe, então deletá-la
			await queryDatabase(queryDeletar, [id]);
			return res.status(200).json({ message: "Venda deletada com sucesso" });
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