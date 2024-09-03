import queryDatabase from '../database/queryPromise'

const historicEstoqueService = {

	// Função para criar um novo Histórico de Estoque
	createHistoricEstoque: async (tipo: string, quantidade: number, estoque_id: number, tipo_id: number, fornecedor_id?: number) => {
		console.log('Criando histórico de estoque', tipo, quantidade, estoque_id, tipo_id, fornecedor_id);
		const updateEstoque = "UPDATE estoque SET quantidade = ? WHERE id = ?";
		const queryEstoque = "SELECT * FROM estoque WHERE id = ?";

		try {
			const [estoqueData] = await queryDatabase(queryEstoque, [estoque_id]);
			console.log('Dados do estoque', estoqueData);
			if (!estoqueData) {
				throw new Error('Dados do estoque não encontrados');
			}

			const extracaoQuantidade = estoqueData.quantidade;
			const extracaoId = estoqueData.id;

			if (tipo === "Entrada") {
				const soma = extracaoQuantidade + quantidade;
				await queryDatabase(updateEstoque, [soma, extracaoId]);
				const query = "INSERT INTO estoqueHistoric (tipo, quantidade, estoque_id, compra_id, fornecedor_id) VALUES (?, ?, ?, ?, ?)";

				await queryDatabase(query, [tipo, quantidade, estoque_id, tipo_id,fornecedor_id]);
				return "Entrada cadastrada com sucesso";
			} else if (tipo === "Saída") {
				const subtracao = extracaoQuantidade - quantidade;
				await queryDatabase(updateEstoque, [subtracao, extracaoId]);
				const query = "INSERT INTO estoqueHistoric (tipo, quantidade, estoque_id, venda_id) VALUES (?, ?, ?, ?)";

				await queryDatabase(query, [tipo, quantidade, estoque_id, tipo_id,]);
				return "Saída cadastrada com sucesso";
			} else if (tipo === "Defeito") {
				const subtracao = extracaoQuantidade - quantidade;
				await queryDatabase(updateEstoque, [subtracao, extracaoId]);
				const query = "INSERT INTO estoqueHistoric (tipo, quantidade, estoque_id, defeito_id, fornecedor_id) VALUES (?, ?, ?, ?, ?)";

				await queryDatabase(query, [tipo, quantidade, estoque_id, tipo_id, fornecedor_id ]);
				return "Defeito cadastrado com sucesso";
			} 
			
			else {
				throw new Error('Tipo de operação inválido');
			}
		} catch (error) {
			console.error('Erro ao criar histórico de estoque', error);
			return "Erro ao criar Histórico";
		}
	},

	deleteHistoricEstoque: async (tipo: string, tipo_id: number) => {
		console.log('Deletando histórico de estoque', tipo, tipo_id);
		const queryEstoque = "SELECT * FROM estoque WHERE id = ?";
		const colunaTipo = tipo === "Compra" ? 'compra_id' : 'venda_id';
		const queryHistoric = `SELECT * FROM estoqueHistoric WHERE ${colunaTipo} = ?`;

		console.log('TIPO', queryHistoric)

		try {
			const estoqueHistoricData = await queryDatabase(queryHistoric, [tipo_id]);
			console.log('Dados do estoque', estoqueHistoricData);
			
			if (!Array.isArray(estoqueHistoricData) || estoqueHistoricData.length === 0) {
				throw new Error('Dados do estoque não encontrados');
			}
	
			for (const item of estoqueHistoricData) {
				const extracaoProdutoID = item.estoque_id;
				const extracaoQuantidadeID = item.quantidade;
	
				console.log(`Produto ID: ${extracaoProdutoID}, Quantidade: ${extracaoQuantidadeID}`);
	
				const [estoqueData] = await queryDatabase(queryEstoque, [extracaoProdutoID]);
				console.log('Dados do estoque', estoqueData);
	
				if (!estoqueData) {
					throw new Error('Dados do estoque não encontrados');
				}
	
				const extrairQuantidadeAtual = estoqueData.quantidade;
	
				if (tipo === "Compra") {
					const subtracao = extrairQuantidadeAtual - extracaoQuantidadeID;
	
					if (isNaN(subtracao)) {
						throw new Error(`Quantidade resultante não é um número válido: ${subtracao}`);
					}
	
					const updateEstoque = "UPDATE estoque SET quantidade = ? WHERE id = ?";
					await queryDatabase(updateEstoque, [subtracao, extracaoProdutoID]);
	
					const deleteHistoric = "DELETE FROM estoqueHistoric WHERE id = ?";
					await queryDatabase(deleteHistoric, [item.id]);
	
					console.log("Entrada removida com sucesso");
				} else if (tipo === "Venda") {
					const soma = extrairQuantidadeAtual + extracaoQuantidadeID;
	
					if (isNaN(soma)) {
						throw new Error(`Quantidade resultante não é um número válido: ${soma}`);
					}
	
					const updateEstoque = "UPDATE estoque SET quantidade = ? WHERE id = ?";
					await queryDatabase(updateEstoque, [soma, extracaoProdutoID]);
	
					const deletedeleteHistoric = "DELETE FROM estoqueHistoric WHERE id = ?";
					await queryDatabase(deletedeleteHistoric, [item.id]);
	
					console.log("Saída removida com sucesso");
				} else {
					throw new Error('Tipo de operação inválido');
				}
			}
	
			return "Operação concluída com sucesso";
		} catch (error) {
			console.error('Erro ao criar histórico de estoque', error);
			return "Erro ao criar Histórico";
		}
	},
	
}

export { historicEstoqueService };