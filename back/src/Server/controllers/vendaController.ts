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
		const { cliente_id, funcionario_id, QTparcelas, valorTotal, valorDesconto, valorPago, valorTotalDesconto, status, parcelas, produtos, ItemProduto } = req.body;
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

			// for ( const item of ItemProduto	) { 

			// 	try {
			// 		const itemExistsQuery = "SELECT * FROM item_produto WHERE codBarras = ?";
			// 		const idItem = item.codBarra
			// 		const [itemRows] = await queryDatabase(itemExistsQuery, [idItem]);
			
			// 		if (!itemRows) {
			// 			return res.status(404).json({ error: "item_produto não encontrado" });
			// 		}
	
			// 		const status = 'vendido'
	
			// 		const updateQuery = `
			// 		UPDATE item_produto 
			// 		SET status = ?, venda_id = ?
			// 		WHERE codBarras = ?
			// 	`;
			// 			await queryDatabase(updateQuery, [status, venda_id, item.codBarra ]);
			// 	} catch (error) {
			// 		console.error('Erro ao editar item_produto', error)
			// 	}
		
			// }

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

	getVendasListCliente: async (req: Request, res: Response) => {
		const { page = 1, limit = 5, id, cliente_id } = req.query;
		let query = "SELECT * FROM venda WHERE 1=1";
		let countQuery = "SELECT COUNT(*) AS total FROM venda WHERE 1=1";
		const params: any[] = [];

		if (id) {
			query += " AND id = ?";
			countQuery += " AND id = ?";
			params.push(id);
		}

		if (cliente_id) {
			query += " AND cliente_id = ?";
			countQuery += " AND cliente_id = ?";
			params.push(cliente_id);
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

	getVendasVendedor: async (req: Request, res: Response) => {
		const { page = 1, limit = 5, funcionario_id, data_inicio, data_fim } = req.body;
		let query = "SELECT * FROM venda WHERE status <> 'cancelado'";
		let countQuery = "SELECT COUNT(*) AS total FROM venda WHERE status <> 'cancelado'";
		const params: any[] = [];
	
		console.log('funcionario_id', funcionario_id)
		let dataInicioFormatada = data_inicio ? new Date(`${data_inicio}T00:00:00.000Z`).toISOString() : null;
		let dataFimFormatada = data_fim ? new Date(`${data_fim}T23:59:59.999Z`).toISOString() : null;
	
		// Filtro por funcionário
		if (funcionario_id) {
			query += " AND funcionario_id = ?";
			countQuery += " AND funcionario_id = ?";
			params.push(funcionario_id);
		}
	
		// Filtro por data de venda (entre data_inicio e data_fim)
		if (data_inicio && data_fim) {
			query += " AND data_criacao BETWEEN ? AND ?";
			countQuery += " AND data_criacao BETWEEN ? AND ?";
			params.push(dataInicioFormatada, dataFimFormatada);
		}
	
		// Consulta de contagem total
		try {
			const totalResult = await queryDatabase(countQuery, params);
			const total = totalResult[0].total;
	
			// Consulta de paginação
			query += " LIMIT ? OFFSET ?";
			params.push(parseInt(limit as string));
			params.push((parseInt(page as string) - 1) * parseInt(limit as string));
	
			// Obtenção das vendas
			const vendas = await queryDatabase(query, params);
	
			console.log('vendas', vendas)
	
			if (!vendas || vendas.length === 0) {
				return res.status(404).json({ error: "Nenhum registro encontrado" });
			}
	
			// Obter a porcentagem de comissão do cliente
			let porcentoComissao = 0;
			if (funcionario_id) {
				const funcionarioQuery = "SELECT porcentoComissao FROM usuarios WHERE id = ?";
				const funcionarioResult = await queryDatabase(funcionarioQuery, [funcionario_id]);
				console.log('funcionarioResult', funcionarioResult)
				porcentoComissao = funcionarioResult[0]?.porcentoComissao || 0;
			}
	
			// Calcular comissão e valor total de comissão
			let totalComissao = 0;
			const vendasComComissao = vendas.map((venda: VendaConsulta) => {
				const comissao = (venda.valorTotalDesconto * porcentoComissao) / 100;
				totalComissao += comissao;
				return {
					...venda,
					comissao
				};
			});
	
			return res.status(200).json({
				vendas: vendasComComissao,
				total,
				totalComissao
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar registros" });
		}
	},

	getVendasMes: async (_: Request, res: Response) => {
	
		// Obter o mês atual
		const now = new Date();
		const primeiroDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);
		const ultimoDiaMes = new Date(now.getFullYear(), now.getMonth() + 1, 0);
	
		// Formatar as datas para ISO strings
		const dataInicioFormatada = primeiroDiaMes.toISOString();
		const dataFimFormatada = ultimoDiaMes.toISOString();
	
		let query = "SELECT * FROM venda WHERE status <> 'cancelado' AND data_criacao BETWEEN ? AND ?";
		let countQuery = "SELECT COUNT(*) AS total FROM venda WHERE status <> 'cancelado' AND data_criacao BETWEEN ? AND ?";
		const params: any[] = [dataInicioFormatada, dataFimFormatada];
	
		try {
			// Consulta de contagem total
			const totalResult = await queryDatabase(countQuery, params);
			const total = totalResult[0].total;

			// Obtenção das vendas
			const vendas = await queryDatabase(query, params);
	
			if (!vendas || vendas.length === 0) {
				return res.status(404).json({ error: "Nenhum registro encontrado" });
			}
	
			return res.status(200).json({
				total,
				// vendas
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar registros" });
		}
	},
	
	getVendasDia: async (_: Request, res: Response) => {

		// Obter o dia atual
		const now = new Date();
		const inicioDia = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0); // 00:00:00 do dia atual
		const fimDia = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999); // 23:59:59 do dia atual
	
		// Formatar as datas para ISO strings
		const dataInicioFormatada = inicioDia.toISOString();
		const dataFimFormatada = fimDia.toISOString();
	
		let query = "SELECT * FROM venda WHERE status <> 'cancelado' AND data_criacao BETWEEN ? AND ?";
		let countQuery = "SELECT COUNT(*) AS total FROM venda WHERE status <> 'cancelado' AND data_criacao BETWEEN ? AND ?";
		const params: any[] = [dataInicioFormatada, dataFimFormatada];
	
		try {
			// Consulta de contagem total
			const totalResult = await queryDatabase(countQuery, params);
			const total = totalResult[0].total;
	
			// Obtenção das vendas
			const vendas = await queryDatabase(query, params);
	
			if (!vendas || vendas.length === 0) {
				return res.status(404).json({ error: "Nenhum registro encontrado" });
			}
	
			return res.status(200).json({
				total,
				vendas
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar registros" });
		}
	},
	
	getVendasCompare: async (_: Request, res: Response) => {
		// Obter a data atual
		const now = new Date();
	  
		// Obter o primeiro e último dia do mês atual
		const primeiroDiaMesAtual = new Date(now.getFullYear(), now.getMonth(), 1);
		const ultimoDiaMesAtual = new Date(now.getFullYear(), now.getMonth() + 1, 0);
	  
		// Obter o primeiro e último dia do mês anterior
		const primeiroDiaMesPassado = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const ultimoDiaMesPassado = new Date(now.getFullYear(), now.getMonth(), 0);
	  
		// Formatar as datas para ISO strings
		const dataInicioMesAtual = primeiroDiaMesAtual.toISOString();
		const dataFimMesAtual = ultimoDiaMesAtual.toISOString();
		const dataInicioMesPassado = primeiroDiaMesPassado.toISOString();
		const dataFimMesPassado = ultimoDiaMesPassado.toISOString();
	  
		// Consultas SQL para contagem de vendas
		const countQuery = "SELECT COUNT(*) AS total FROM venda WHERE status <> 'cancelado' AND data_criacao BETWEEN ? AND ?";
	  
		try {
		  // Consulta para o mês atual
		  const totalMesAtualResult = await queryDatabase(countQuery, [dataInicioMesAtual, dataFimMesAtual]);
		  const totalMesAtual = totalMesAtualResult[0].total;
	  
		  // Consulta para o mês passado
		  const totalMesPassadoResult = await queryDatabase(countQuery, [dataInicioMesPassado, dataFimMesPassado]);
		  const totalMesPassado = totalMesPassadoResult[0].total;
	  
		  // Comparação entre o mês atual e o mês passado
		  const comparacao = totalMesAtual - totalMesPassado;
	  
		  return res.status(200).json({
			totalMesAtual,
			totalMesPassado,
			diferenca: comparacao,
			porcentagem: ((totalMesAtual - totalMesPassado) / totalMesPassado) * 100 || 0, // Para evitar divisão por zero
		  });
		} catch (error) {
		  console.error(error);
		  return res.status(500).json({ error: "Erro ao buscar registros" });
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

}

export { vendaController };