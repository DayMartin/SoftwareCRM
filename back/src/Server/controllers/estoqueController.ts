import { Request, Response } from 'express';
import queryDatabase from '../database/queryPromise'
import { HistoricProduto } from '../models/historicProduto.interface';

// Função para buscar todos os estoque

const estoqueController = {

	getEstoques: async (_: Request, res: Response) => {
		const query = "SELECT * FROM estoque";
		let countQuery = "SELECT COUNT(*) AS total FROM estoque WHERE 1=1";
		const params: any[] = [];


		try {
			const totalResult = await queryDatabase(countQuery, params);
			const total = totalResult[0].total;
			const rows = await queryDatabase(query);

			// Verificar se tem estoque cadastrada
			if (rows.length === 0) {
				return res.status(404).json({ error: "Nenhum estoque cadastrada" });
			}
			return res.status(200).json({
				rows,
				total,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar estoque" });
		}
	},


	getEstoquesList: async (req: Request, res: Response) => {
		const { page = 1, limit = 5, id, nome } = req.query;
		let query = "SELECT * FROM estoque WHERE 1=1";
		let countQuery = "SELECT COUNT(*) AS total FROM estoque WHERE 1=1";
		const params: any[] = [];

		if (id) {
			query += " AND id = ?";
			countQuery += " AND id = ?";
			params.push(id);
		}

		if (nome) {
			query += " AND nome LIKE ?";
			countQuery += " AND nome LIKE ?";
			params.push(`%${nome}%`);
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
				total,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar registros" });
		}
	},

	// Função para criar um novo Estoque
	createEstoque: async (req: Request, res: Response) => {
		const { nome, quantidade, fornecedor_id, categoria_id, marca_id, valorUnitarioCompra, valorUnitarioVenda, promocao, valor_promocional } = req.body;

		// Verifica se a imagem foi carregada
		const imagem = req.file ? req.file.buffer : null;  // O `multer` armazena o buffer da imagem em `req.file.buffer`

		console.log('imagem', imagem)
		// Query de inserção (adiciona o campo para a imagem como BLOB)
		const query = `
			INSERT INTO estoque 
			(nome, quantidade, fornecedor_id, categoria_id, marca_id, valorUnitarioCompra, valorUnitarioVenda, promocao, valor_promocional, imagem)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;

		try {
			// Execute a query passando os parâmetros
			await queryDatabase(query, [nome, quantidade, fornecedor_id, categoria_id, marca_id, valorUnitarioCompra, valorUnitarioVenda, promocao, valor_promocional, imagem]);
			return res.status(201).json({ message: "Estoque criado com sucesso!" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao criar Estoque" });
		}
	},

	// Função para buscar um Estoque por ID
	getEstoque: async (req: Request, res: Response) => {
		const { id } = req.params;
		const query = "SELECT * FROM estoque WHERE id = ?";

		try {
			const [rows, fields] = await queryDatabase(query, [id]);

			// Verificar se o Estoque foi encontrado
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Estoque não encontrado" });
			}
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Estoque" });
		}
	},

	// Função para buscar um Estoque por categoria
	getMarcaEstoque: async (req: Request, res: Response) => {
		const { marca_id } = req.params;
		const query = "SELECT * FROM estoque WHERE marca_id = ?";

		try {
			const rows = await queryDatabase(query, [marca_id]);

			// Verificar se o Estoque foi encontrado
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Estoque não encontrado" });
			}
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Estoque" });
		}
	},

	// Função para buscar um Estoque por fornecedor
	getFornecedorEstoque: async (req: Request, res: Response) => {
		const { fornecedor_id } = req.params;
		const query = "SELECT * FROM estoque WHERE fornecedor_id = ?";

		try {
			const rows = await queryDatabase(query, [fornecedor_id]);

			// Verificar se o Estoque foi encontrado
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Estoque não encontrado" });
			}
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Estoque" });
		}
	},

	// getListItemProduto: async (req: Request, res: Response) => {
	// 	const { page = 1, limit = 5, estoque_id } = req.query;
	// 	let query = "SELECT * FROM item_produto WHERE 1=1";
	// 	let countQuery = "SELECT COUNT(*) AS total FROM item_produto WHERE 1=1";
	// 	const params: any[] = [];
	// 	console.log('estoque_id', estoque_id)


	// 	if (estoque_id) {
	// 		query += " AND estoque_id = ?";
	// 		countQuery += " AND estoque_id = ?";
	// 		params.push(estoque_id);
	// 	}


	// 	// Consulta de contagem total
	// 	try {
	// 		const totalResult = await queryDatabase( params);
	// 		const total = totalResult[0].total;

	// 		// Consulta de paginação
	// 		query += " LIMIT ? OFFSET ?";
	// 		params.push(parseInt(limit as string));
	// 		params.push((parseInt(page as string) - 1) * parseInt(limit as string));

	// 		const rows = await queryDatabase(query, params);

	// 		console.log('rows', query, params)

	// 		if (!rows || rows.length === 0) {
	// 			return res.status(404).json({ error: "Nenhum registro encontrado" });
	// 		}

	// 		return res.status(200).json({
	// 			rows,
	// 			total, // Retornando a contagem total
	// 		});
	// 	} catch (error) {
	// 		console.error(error);
	// 		return res.status(500).json({ error: "Erro ao buscar registros" });
	// 	}
	// },

	// Função para deletar um Estoque


	getListItemProduto: async (req: Request, res: Response) => {
		const { page = 1, limit = 5, estoque_id } = req.query;
		let query = "SELECT * FROM item_produto WHERE estoque_id = ?";
		const params: any[] = [];
		let countQuery = "SELECT COUNT(*) AS total FROM item_produto WHERE estoque_id = ?";


		try {

			const totalResult = await queryDatabase(countQuery, [estoque_id]);
			const total = totalResult[0].total;
			const rows = await queryDatabase(query, [estoque_id]);

			// Consulta de paginação
			query += " LIMIT ? OFFSET ?";
			params.push(parseInt(limit as string));
			params.push((parseInt(page as string) - 1) * parseInt(limit as string));

			if (!rows || rows.length === 0) {
				return res.status(404).json({ error: "Nenhum registro encontrado" });
			}

			return res.status(200).json({
				rows,
				total

			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar itemProduto" });
		}
	},

	getItemProduto: async (req: Request, res: Response) => {
		const { idProduto } = req.params
		const query = "SELECT * FROM item_produto WHERE estoque_id = ?";
		try {
			const rows = await queryDatabase(query, [idProduto]);

			// Verificar se tem item_produto cadastrada
			if (rows.length === 0) {
				return res.status(404).json({ error: "Nenhum item_produto cadastrada" });
			}
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar item_produto" });
		}
	},


	editEstoque: async (req: Request, res: Response) => {
		const { id } = req.params;
		const { nome, valorUnitarioCompra, valorUnitarioVenda, promocao, valor_promocional } = req.body;

		req.file ? req.file.path : null;
		const imagemTratada = req.file?.buffer


		const produtoExistsQuery = "SELECT * FROM estoque WHERE id = ?";
		const [produtoRows] = await queryDatabase(produtoExistsQuery, [id]);

		if (!produtoRows) {
			return res.status(404).json({ error: "Produto não encontrado" });
		}

		try {

			const updateQuery = `
				UPDATE estoque 
				SET nome = ?, valorUnitarioCompra = ?, valorUnitarioVenda = ?, promocao = ?, valor_promocional = ?, imagem = ?
				WHERE id = ?
			`;
			await queryDatabase(updateQuery, [nome, valorUnitarioCompra, valorUnitarioVenda, promocao, valor_promocional, imagemTratada, id]);

			return res.status(200).json({ message: "Produto atualizado com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao atualizar Produto" });
		}
	},

	deleteEstoque: async (req: Request, res: Response) => {
		const { id } = req.params;
		const queryVerificar = "SELECT * FROM estoque WHERE id = ?";
		const consultarExistencias = "SELECT * FROM estoqueHistoric WHERE estoque_id = ?  "
		const consultarExistenciasVenda = "SELECT * FROM estoqueHistoric WHERE estoque_id = ? AND venda_id = ? "
		const consultarExistenciasCompra = "SELECT * FROM estoqueHistoric WHERE estoque_id = ? AND compra_id = ?"

		const queryDeletar = "DELETE FROM estoque WHERE id = ?";

		try {
			// Verificar se o Estoque existe
			const [rows] = await queryDatabase(queryVerificar, [id]);
			if (rows === null || rows === undefined) {
				return res.status(404).json({ error: "Estoque não encontrado" });
			}

			const produtos: HistoricProduto[] = await queryDatabase(consultarExistencias, [id]);
			if (!produtos || produtos.length === 0) {
				await queryDatabase(queryDeletar, [id]);
				return res.status(200).json({ message: "Produto deletada com sucesso" });
			} else {
				const vendaProdutos = produtos.map(produto => produto.venda_id).join(", ");
				const compraProdutos = produtos.map(produto => produto.compra_id).join(", ");

				const vendas: HistoricProduto[] = await queryDatabase(consultarExistenciasVenda, [id, vendaProdutos]);
				const compras: HistoricProduto[] = await queryDatabase(consultarExistenciasCompra, [id, compraProdutos]);

				const idVenda = vendas.map(venda => venda.venda_id).join(", ");
				const idCompra = compras.map(compra => compra.compra_id).join(", ");

				return res.status(409).json({ message: `Não é possível excluir pois há compras ou vendas atrelados a ele: ID Vendas: ${idVenda}, ID Compras: ${idCompra}` });
			}

		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao deletar o Estoque" });
		}
	},

	grafico: async (req: Request, res: Response) => {
		let queryEstoque = "SELECT * FROM estoque";
		
		try {
			const estoque = await queryDatabase(queryEstoque);
	
			if (!estoque || estoque.length === 0) {
				return res.status(404).json({ error: "Nenhum item no estoque" });
			}
	
			const resultadoFinal: any[] = [];
	
			for (const item of estoque) {
				const estoqueId = item.id;
	
				const queryHistoric = `
					SELECT 
						SUM(quantidade) AS totalVendido,  
						MAX(data_criacao) AS ultimaVenda 
					FROM estoqueHistoric 
					WHERE estoque_id = ? 
					AND tipo = 'Saída'
				`;
				const historicoVendas = await queryDatabase(queryHistoric, [estoqueId]);
	
				const totalVendido = historicoVendas[0]?.totalVendido || 0;
				const ultimaVenda = historicoVendas[0]?.ultimaVenda || 'Nenhuma venda registrada';
	
				resultadoFinal.push({
					produto: item.nome,                 
					totalEmEstoque: item.quantidade, 
					totalVendido: totalVendido,      
					ultimaVenda: ultimaVenda        
				});
			}
	
			return res.status(200).json({
				resultado: resultadoFinal,
			});
	
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar registros" });
		}
	},
	
	graficoTopVendas: async (req: Request, res: Response) => {
		let queryEstoque = "SELECT * FROM estoque";
	
		try {
			const estoque = await queryDatabase(queryEstoque);
	
			if (!estoque || estoque.length === 0) {
				return res.status(404).json({ error: "Nenhum item no estoque" });
			}
	
			const resultadoFinal: any[] = [];
	
			for (const item of estoque) {
				const estoqueId = item.id;
	
				const queryHistoric = `
					SELECT 
						SUM(quantidade) AS totalVendido,  
						MAX(data_criacao) AS ultimaVenda 
					FROM estoqueHistoric 
					WHERE estoque_id = ? 
					AND tipo = 'Saída'
				`;
				const historicoVendas = await queryDatabase(queryHistoric, [estoqueId]);
	
				const totalVendido = historicoVendas[0]?.totalVendido || 0;
				const ultimaVenda = historicoVendas[0]?.ultimaVenda || 'Nenhuma venda registrada';
	
				resultadoFinal.push({
					produto: item.nome,                
					totalEmEstoque: item.quantidade, 
					totalVendido: totalVendido,     
					ultimaVenda: ultimaVenda         
				});
			}
	
			const topVendas = resultadoFinal.sort((a, b) => b.totalVendido - a.totalVendido).slice(0, 5);
	
			return res.status(200).json({
				resultado: topVendas,
			});
	
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar registros" });
		}
	},

	graficoTopVendasMes: async (req: Request, res: Response) => {
		let queryEstoque = "SELECT * FROM estoque";
	
		try {
			const estoque = await queryDatabase(queryEstoque);
	
			if (!estoque || estoque.length === 0) {
				return res.status(404).json({ error: "Nenhum item no estoque" });
			}
	
			const resultadoFinal: any[] = [];
	
			for (const item of estoque) {
				const estoqueId = item.id;
	
				// Obter o mês e o ano atual
				const dataAtual = new Date();
				const anoAtual = dataAtual.getFullYear();
				const mesAtual = dataAtual.getMonth() + 1; 
	
				const queryHistoric = `
					SELECT 
						SUM(quantidade) AS totalVendido,  
						MAX(data_criacao) AS ultimaVenda 
					FROM estoqueHistoric 
					WHERE estoque_id = ? 
					AND tipo = 'Saída'
					AND MONTH(data_criacao) = ? 
					AND YEAR(data_criacao) = ?
				`;
				const historicoVendas = await queryDatabase(queryHistoric, [estoqueId, mesAtual, anoAtual]);
	
				const totalVendido = historicoVendas[0]?.totalVendido || 0;
				const ultimaVenda = historicoVendas[0]?.ultimaVenda || 'Nenhuma venda registrada';
	
				resultadoFinal.push({
					produto: item.nome,                
					totalEmEstoque: item.quantidade, 
					totalVendido: totalVendido,     
					ultimaVenda: ultimaVenda         
				});
			}
	
			const topVendas = resultadoFinal.sort((a, b) => b.totalVendido - a.totalVendido).slice(0, 6);
	
			return res.status(200).json({
				resultado: topVendas,
			});
	
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar registros" });
		}
	},
	
	
}

export { estoqueController };
