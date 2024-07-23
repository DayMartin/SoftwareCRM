import queryDatabase from '../database/queryPromise'

const historicEstoqueService = { 

		// Função para criar um novo Histórico de Estoque
		createHistoricEstoque: async (tipo: string, quantidade:number, estoque_id:number, tipo_id:number) => {
			console.log('Criando histórico de estoque', tipo, quantidade, estoque_id, tipo_id);
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
					const query = "INSERT INTO estoqueHistoric (tipo, quantidade, estoque_id, compra_id) VALUES (?, ?, ?, ?)";

					await queryDatabase(query, [tipo, quantidade, estoque_id, tipo_id]);
					return "Entrada cadastrada com sucesso";
				} else if (tipo === "Saída") {
					const subtracao = extracaoQuantidade - quantidade;
					await queryDatabase(updateEstoque, [subtracao, extracaoId]);
					const query = "INSERT INTO estoqueHistoric (tipo, quantidade, estoque_id, venda_id) VALUES (?, ?, ?, ?)";

					await queryDatabase(query, [tipo, quantidade, estoque_id, tipo_id]);
					return "Saída cadastrada com sucesso";
				} else {
					throw new Error('Tipo de operação inválido');
				}
			} catch (error) {
				console.error('Erro ao criar histórico de estoque', error);
				return "Erro ao criar Histórico";
			}
		}
		
}


export { historicEstoqueService };