import queryDatabase from '../database/queryPromise'

const historicEstoqueService = { 

		// Função para criar um novo Histórico de Estoque
		createHistoricEstoque: async (tipo: string, quantidade:number, estoque_id:number, tipo_id:number) => {
			const query = "INSERT INTO estoqueHistoric (tipo, quantidade, estoque_id, tipo_id) VALUES (?, ?, ?, ?)";
			
			// Query para atualizar dados em estoque
			const updateEstoque = "UPDATE estoque SET quantidade = ? WHERE id = ?";
	
			// Consulta os dados atualizados do estoque
			const queryEstoque = "SELECT * FROM estoque WHERE id = ?";
			const [estoqueData] = await queryDatabase(queryEstoque, [estoque_id]);
			const extracaoQuantidade = estoqueData.quantidade
			const extracaoId = estoqueData.id
			// console.log("EXTRAÇÃO DO ID", extracaoId);
			try {
				if ( tipo === "Entrada" ){
	
				const soma = extracaoQuantidade + quantidade
				// console.log("VALOR DA SOMA", soma);
	
				// Atualiza a quantidade do estoque
				await queryDatabase(updateEstoque, [soma, extracaoId]);
	
				// // Insere o histórico do estoque
				await queryDatabase(query, [tipo, quantidade, estoque_id]);
	
				return "Entrada cadastrada com sucesso";
				}
				if ( tipo === "Saída"){
				// console.log("EXTRAÇÃO DA QUANTIDADE", extracaoId);
				const subtracao = extracaoQuantidade - quantidade
				// console.log("VALOR DA SUBTRAÇÃO", subtracao);
	
				// Atualiza a quantidade do estoque
				await queryDatabase(updateEstoque, [subtracao, extracaoId]);
	
				// // Insere o histórico do estoque
				await queryDatabase(query, [tipo, quantidade, estoque_id]);
				return "Saída cadastrada com sucesso";
				}
	
			} catch (error) {
				console.error(error);
				return "Erro ao criar Histórico";
			}
		},
}


export { historicEstoqueService };