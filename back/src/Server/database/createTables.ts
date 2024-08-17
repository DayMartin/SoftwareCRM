import queryDatabase from "../database/queryPromise";

require("dotenv").config();

export class CreateTables {
	constructor() {}

	// Chamar as funções para criar as tabelas durante a inicialização do banco de dados
	async createAllTables() {
		try {
			await this.createUsuariosTable();
			await this.createCategoriaTable();
			await this.createMarcaTable();
			await this.createEstoqueTable();
			// await this.createServicosTable();
			await this.createVendaTable();
			await this.createCompraTable();
			await this.createParcelasVenda();
			await this.createParcelasCompra();
			await this.createHistoricEstoqueTable();
			await this.createProdutoMovimentoTable();
			await this.createLogs();
			await this.createItemProdutoTable();
		} catch (error) {
			console.error("Erro ao criar as tabelas:", error);
		}
	}

	async createUsuariosTable() {
		try {
			const consulta = `SHOW TABLES LIKE 'usuarios'`;
			// Verifique se a tabela 'usuarios' existe
			const rows = await queryDatabase(consulta);

			// Se a tabela 'usuarios' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE usuarios (
						id INT AUTO_INCREMENT PRIMARY KEY,
						tipo VARCHAR(100),
						cpfcnpj VARCHAR(100),
						nome VARCHAR(100),
						telefone VARCHAR(100),
						endereco VARCHAR(100),
						email VARCHAR(100),
						senha VARCHAR(100),
						status VARCHAR(50),
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
					)
				`);
				console.log("Tabela 'usuarios' criada com sucesso.");
			}
		} catch (error) {
			console.error("Erro ao criar a tabela 'usuarios':", error);
		}
	}

	// async createServicosTable() {
	// 	try {
	// 		// Verifique se a tabela 'servicos' existe
	// 		const rows = await queryDatabase(
	// 			`SHOW TABLES LIKE 'servicos'`
	// 		);

	// 		// Se a tabela 'servicos' não existir, crie-a
	// 		if (rows.length === 0) {
	// 			await queryDatabase(`
	// 				CREATE TABLE servicos (
	// 					id INT AUTO_INCREMENT PRIMARY KEY,
	// 					nome VARCHAR(100),
	// 					descricao VARCHAR(100),
	// 					preco_avulso DECIMAL(10, 2),
	// 					preco_convenio DECIMAL(10, 2),
	// 					status VARCHAR(50),
	// 					data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	// 				)
	// 			`);
	// 			console.log("Tabela 'servicos' criada com sucesso.");
	// 		}
	// 	} catch (error) {
	// 		console.error("Erro ao criar a tabela 'servicos':", error);
	// 	}
	// }

	async createVendaTable() {
		try {
			// Verifique se a tabela 'Venda' existe
			const rows = await queryDatabase(`SHOW TABLES LIKE 'venda'`);

			// Se a tabela 'venda' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE venda (
						id INT AUTO_INCREMENT PRIMARY KEY,
						cliente_id INT,
						funcionario_id INT,
						QTparcelas INT,
						valorTotal DECIMAL(10, 2),
						valorDesconto DECIMAL(10, 2),
						valorTotalDesconto DECIMAL(10, 2),
						valorPago DECIMAL(10, 2),
						status VARCHAR(50),
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
						FOREIGN KEY (funcionario_id) REFERENCES usuarios(id)
					)
				`);
				console.log("Tabela 'venda' criada com sucesso.");
			}
		} catch (error) {
			console.error("Erro ao criar a tabela 'venda':", error);
		}
	}

	async createCompraTable() {
		try {
			// Verifique se a tabela 'compra' existe
			const rows = await queryDatabase(`SHOW TABLES LIKE 'compra'`);

			// Se a tabela 'compra' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE compra (
						id INT AUTO_INCREMENT PRIMARY KEY,
						funcionario_id INT,
						fornecedor_id INT,
						QTparcelas INT,
						valorTotal DECIMAL(10, 2),
						valorDesconto DECIMAL(10, 2),
						valorTotalDesconto DECIMAL(10, 2),
						valorPago DECIMAL(10, 2),
						status VARCHAR(50),
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						FOREIGN KEY (fornecedor_id) REFERENCES usuarios(id),
						FOREIGN KEY (funcionario_id) REFERENCES usuarios(id)
					)
				`);
				console.log("Tabela 'compra' criada com sucesso.");
			}
		} catch (error) {
			console.error("Erro ao criar a tabela 'compra':", error);
		}
	}

	async createParcelasVenda() {
		try {
			// Verifique se a tabela 'parcelas_venda' existe
			const rows = await queryDatabase(
				`SHOW TABLES LIKE 'parcelas_venda'`
			);

			// Se a tabela 'parcelas_venda' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE parcelas_venda (
						id INT AUTO_INCREMENT PRIMARY KEY,
						venda_id INT NOT NULL,
						tipoPagamento VARCHAR(50), 
						parcela INT,
						valorParcela DECIMAL(10, 2),
						dataPagamento VARCHAR(50),
						status VARCHAR(50),
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						FOREIGN KEY (venda_id) REFERENCES venda(id)
					)
				`);
				console.log("Tabela 'parcelas_venda' criada com sucesso.");
			}

			// Libere a conexão
		} catch (error) {
			console.error("Erro ao criar a tabela 'Parcelas':", error);
		}
	}

	async createParcelasCompra() {
		try {
			// Verifique se a tabela 'parcelas_compra' existe
			const rows = await queryDatabase(
				`SHOW TABLES LIKE 'parcelas_compra'`
			);

			// Se a tabela 'parcelas_compra' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE parcelas_compra (
						id INT AUTO_INCREMENT PRIMARY KEY,
						compra_id INT NOT NULL,
						tipoPagamento VARCHAR(50), 
						parcela INT,
						valorParcela DECIMAL(10, 2),
						dataPagamento VARCHAR(50),
						status VARCHAR(50),
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						FOREIGN KEY (compra_id) REFERENCES compra(id)
					)
				`);
				console.log("Tabela 'parcelas_compra' criada com sucesso.");
			}

			// Libere a conexão
		} catch (error) {
			console.error("Erro ao criar a tabela 'Parcelas':", error);
		}
	}

	async createCategoriaTable() {
		try {
			const consulta = `SHOW TABLES LIKE 'categoria'`;
			// Verifique se a tabela 'Categoria' existe
			const rows = await queryDatabase(consulta);

			// Se a tabela 'Categoria' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE categoria (
						id INT AUTO_INCREMENT PRIMARY KEY,
						nome VARCHAR(100),
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
					)
				`);
				console.log("Tabela 'Categoria' criada com sucesso.");
			}
		} catch (error) {
			console.error("Erro ao criar a tabela 'Categoria':", error);
		}
	}

	async createMarcaTable() {
		try {
			const consulta = `SHOW TABLES LIKE 'marca'`;
			// Verifique se a tabela 'Marca' existe
			const rows = await queryDatabase(consulta);

			// Se a tabela 'Marca' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE marca (
						id INT AUTO_INCREMENT PRIMARY KEY,
						nome VARCHAR(100),
						categoria_id INT,
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
					)
				`);
				console.log("Tabela 'Marca' criada com sucesso.");
			}
		} catch (error) {
			console.error("Erro ao criar a tabela 'Marca':", error);
		}
	}

	async createEstoqueTable() {
		try {
			const consulta = `SHOW TABLES LIKE 'estoque'`;
			// Verifique se a tabela 'estoque' existe
			const rows = await queryDatabase(consulta);

			// Se a tabela 'estoque' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE estoque (
						id INT AUTO_INCREMENT PRIMARY KEY,
						nome VARCHAR(100),
						quantidade INT,
						fornecedor_id INT,
						categoria_id INT,
						marca_id INT,
						valorUnitario INT,
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						FOREIGN KEY (fornecedor_id) REFERENCES usuarios(id),
						FOREIGN KEY (categoria_id) REFERENCES categoria(id),
						FOREIGN KEY (marca_id) REFERENCES marca(id)
					)
				`);
				console.log("Tabela 'estoque' criada com sucesso.");
			}
		} catch (error) {
			console.error("Erro ao criar a tabela 'estoque':", error);
		}
	}

	async createHistoricEstoqueTable() {
		try {
			const consulta = `SHOW TABLES LIKE 'estoqueHistoric'`;
			// Verifique se a tabela 'estoqueHistoric' existe
			const rows = await queryDatabase(consulta);

			// Se a tabela 'estoqueHistoric' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE estoqueHistoric (
						id INT AUTO_INCREMENT PRIMARY KEY,
						tipo VARCHAR(50),
						quantidade INT,
						estoque_id INT,
            			venda_id INT,
						compra_id INT,
						fornecedor_id INT,
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						FOREIGN KEY (estoque_id) REFERENCES estoque(id),
						FOREIGN KEY (venda_id) REFERENCES venda(id),
						FOREIGN KEY (compra_id) REFERENCES compra(id),
						FOREIGN KEY (fornecedor_id) REFERENCES usuarios(id)

				)
				`);
				console.log("Tabela 'estoqueHistoric' criada com sucesso.");
			}
		} catch (error) {
			console.error("Erro ao criar a tabela 'estoqueHistoric':", error);
		}
	}

	async createProdutoMovimentoTable() {
		try {
			const consulta = `SHOW TABLES LIKE 'produto_movimento'`;
			// Verifique se a tabela 'produto_movimento' existe
			const rows = await queryDatabase(consulta);

			// Se a tabela 'produto_movimento' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE produto_movimento (
						id INT AUTO_INCREMENT PRIMARY KEY,
						tipo VARCHAR(50),
						quantidade INT,
						estoque_id INT,
            			venda_id INT,
						compra_id INT,
						fornecedor_id INT,
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						FOREIGN KEY (estoque_id) REFERENCES estoque(id),
						FOREIGN KEY (venda_id) REFERENCES venda(id),
						FOREIGN KEY (compra_id) REFERENCES compra(id),
						FOREIGN KEY (fornecedor_id) REFERENCES usuarios(id)

				)
				`);
				console.log("Tabela 'produto_movimento' criada com sucesso.");
			}
		} catch (error) {
			console.error("Erro ao criar a tabela 'produto_movimento':", error);
		}
	}

	async createLogs() {
		try {
			const consulta = `SHOW TABLES LIKE 'logs'`;
			// Verifique se a tabela 'logs' existe
			const rows = await queryDatabase(consulta);

			// Se a tabela 'logs' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE logs (
						id INT AUTO_INCREMENT PRIMARY KEY,
						user_id INT,
						acao VARCHAR(255),
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						FOREIGN KEY (user_id) REFERENCES usuarios(id)
					)
				`);
				console.log("Tabela 'logs' criada com sucesso.");
			}
		} catch (error) {
			console.error("Erro ao criar a tabela 'logs':", error);
		}
	}

	async createItemProdutoTable() {
		try {
			const consulta = `SHOW TABLES LIKE 'item_produto'`;
			// Verifique se a tabela 'item_produto' existe
			const rows = await queryDatabase(consulta);

			// Se a tabela 'item_produto' não existir, crie-a
			if (rows.length === 0) {
				await queryDatabase(`
					CREATE TABLE item_produto (
						id INT AUTO_INCREMENT PRIMARY KEY,
						codBarras VARCHAR(100),
						estoque_id INT,
						data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						FOREIGN KEY (estoque_id) REFERENCES estoque(id)
					)
				`);
				console.log("Tabela 'item_produto' criada com sucesso.");
			}
		} catch (error) {
			console.error("Erro ao criar a tabela 'item_produto':", error);
		}
	}
}
