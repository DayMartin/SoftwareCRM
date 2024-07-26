import { Request, Response } from "express";
import queryDatabase from "../database/queryPromise";
// Função para buscar todos os usuários

const parcelasController = {
	getParcelas: async (_: Request, res: Response) => {
		const query = "SELECT * FROM parcelas_venda";

		try {
			const rows = await queryDatabase(query);
			// Verificar se tem Parcela cadastrada
			if (rows === null || rows === undefined) {
				return res
					.status(404)
					.json({ error: "Nenhuma parcelas_venda cadastrada" });
			}
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ error: "Erro ao buscar parcelas_venda" });
		}
	},

	// Função para buscar uma parcela
	getParcela: async (req: Request, res: Response) => {
		const { id } = req.body;
		const query = "SELECT * FROM parcelas_venda WHERE id = ?";

		try {
			const [rows] = await queryDatabase(query, [id]);

			// Verificar se a Parcela foi encontrada
			if (rows === null || rows === undefined) {
				return res
					.status(404)
					.json({ error: "Parcela não encontrado" });
			}

			// Se a Parcela foi encontrado, retornar os dados
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar OS" });
		}
	},

	// Função para buscar uma parcela por id_os
	getParcelaVenda: async (req: Request, res: Response) => {
		const { venda_id } = req.params;
		const query = "SELECT * FROM parcelas_venda WHERE venda_id = ?";

		try {
			const rows = await queryDatabase(query, [venda_id]);

			// Verificar se a parcelas foi encontrada
			if (rows === null || rows === undefined) {
				return res
					.status(404)
					.json({ error: "Parcela não encontrada" });
			}

			// Se a parcelas foi encontrado, retornar os dados
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar Parcela" });
		}
	},

	receberParcela: async (req: Request, res: Response) => {
		const { id } = req.params;
		const { valorPago } = req.body;
	
		if (valorPago === undefined || isNaN(Number(valorPago))) {
			return res.status(400).json({ error: "valorPago é obrigatório e deve ser um número válido." });
		}
	
		const valorPagoNumero = Number(valorPago);
		console.log('valor', valorPagoNumero);
	
		const queryVerificar = "SELECT * FROM parcelas_venda WHERE id = ?";
		const queryPagar = 'UPDATE parcelas_venda SET status= ? WHERE id = ?';
		const atualizarVenda = 'UPDATE venda SET valorPago = ? WHERE id = ?';
		const consultaValor = "SELECT valorPago FROM venda WHERE id = ?";
	
		try {
			const [parcela] = await queryDatabase(queryVerificar, [id]);
			if (!parcela) {
				return res.status(404).json({ error: "Parcela não encontrada" });
			}
	
			const [venda] = await queryDatabase(consultaValor, [parcela.venda_id]);
			if (!venda) {
				return res.status(404).json({ error: "Venda não encontrada" });
			}
	
			const novoValorPago = Number(venda.valorPago) + valorPagoNumero;
			console.log('novoValorPago', novoValorPago);
	
			await queryDatabase(queryPagar, ['pago', id]);
			await queryDatabase(atualizarVenda, [novoValorPago, parcela.venda_id]);
	
			return res.status(200).json({ message: "Parcela recebida com sucesso" });
	
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao pagar Parcela" });
		}
	},
	
	
	pendeciaParcela: async (req: Request, res: Response) => {
		const { id } = req.params;
		const { valorPago } = req.body;

		const queryVerificar = "SELECT * FROM parcelas_venda WHERE id = ?";
		const queryPagar = "UPDATE parcelas_venda SET status= ? WHERE id = ?";
		const atualizarVenda = "UPDATE venda SET valorPago = ? WHERE id = ?";
		const consultaValor = "SELECT valorPago FROM venda WHERE id = ?";

		try {
			const [parcela] = await queryDatabase(queryVerificar, [id]);
			if (!parcela) {
				return res
					.status(404)
					.json({ error: "Parcela não encontrada" });
			}

			// Consultar o valor atual de 'valorPago' na tabela 'venda'
			const [venda] = await queryDatabase(consultaValor, [id]);
			if (!venda) {
				return res.status(404).json({ error: "Venda não encontrada" });
			}

			// Calcular o novo valor de 'valorPago'
			const novoValorPago = venda.valorPago - valorPago;

			// Atualizar o valor de 'valorPago' na tabela 'venda'
			await queryDatabase(queryPagar, ["pendente", id]);
			await queryDatabase(atualizarVenda, [novoValorPago, id]);

			return res
				.status(200)
				.json({ message: "Desfeito receber com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao desfazer o recebimento da Parcela" });
		}
	},

	// Função para deletar uma Parcela
	deleteParcela: async (req: Request, res: Response) => {
		const { id } = req.body;
		const queryVerificar = "SELECT * FROM parcelas_venda WHERE id = ?";
		const queryDeletar = "DELETE FROM parcelas_venda WHERE id = ?";

		try {
			// Verificar se a Parcela existe
			const [rows] = await queryDatabase(queryVerificar, [id]);
			if (rows === null || rows === undefined) {
				return res
					.status(404)
					.json({ error: "Parcela não encontrada" });
			}

			// Se a Parcela existe, então deletá-la
			await queryDatabase(queryDeletar, [id]);
			return res
				.status(200)
				.json({ message: "Parcela deletada com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao deletar a Parcela" });
		}
	},

	// Função para trazer todas as parcelas do dia
	PagamentoDia: async (req: Request, res: Response) => {
		const { diapagamento } = req.body;
		const query = "SELECT * FROM parcelas_venda WHERE dataPagamento = ?";

		try {
			const [rows] = await queryDatabase(query, [diapagamento]);

			// Verificar se a Parcela foi encontrada
			if (rows === null || rows === undefined) {
				return res
					.status(404)
					.json({ error: "Parcela não encontrado" });
			}

			// Se a Parcela foi encontrado, retornar os dados
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar OS" });
		}
	},

	// Função para trazer as parcelas filtradas por mês
	PagamentoMes: async (req: Request, res: Response) => {
		const { mes } = req.body;

		// Extrair o mês do formato 'MM/YYYY'
		const [month, year] = mes.split("/");

		const query = "SELECT * FROM parcelas_venda";

		try {
			const result = await queryDatabase(query);

			// Verificar se o resultado está vazio ou não é um array
			if (!result || !Array.isArray(result) || result.length === 0) {
				return res
					.status(404)
					.json({ error: "Parcelas não encontradas para este mês" });
			}

			// Filtrar as parcelas com base no mês fornecido
			const filteredRows = result.filter((row) => {
				// Extrair o mês e o ano da coluna dataPagamento
				const rowDate = row.dataPagamento.split("/");
				const rowMonth = rowDate[1];
				const rowYear = rowDate[2];

				// Comparar o mês e o ano extraídos com o mês e o ano fornecidos
				return rowMonth === month && rowYear === year;
			});

			// Se as parcelas foram encontradas, retornar os dados filtrados
			return res.status(200).json(filteredRows);
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ error: "Erro ao buscar as parcelas" });
		}
	},

	// Função para trazer o valor total recebido por mês
	PagamentoTotalMes: async (req: Request, res: Response) => {
		const query = "SELECT * FROM parcelas_venda";

		try {
			const result = await queryDatabase(query);

			// Verificar se o resultado está vazio ou não é um array
			if (!result || !Array.isArray(result) || result.length === 0) {
				return res
					.status(404)
					.json({ error: "Parcelas não encontradas para este mês" });
			}

			// Calcular a soma dos valores das parcelas para cada mês
			const monthlySum = result.reduce((acc, row) => {
				const [rowYear, rowMonth] = row.dataPagamento.split("/");
				const key = `${rowYear}/${rowMonth}`;
				const valorParcela = parseFloat(row.valorParcela);

				if (!acc[key]) {
					acc[key] = {
						month: rowMonth,
						year: rowYear,
						total: 0,
					};
				}

				acc[key].total += valorParcela;

				return acc;
			}, {});

			// Converter o objeto em uma matriz de resultados
			const monthlySumArray = Object.values(monthlySum);

			// Se as parcelas foram encontradas, retornar os dados da soma mensal
			return res.status(200).json(monthlySumArray);
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ error: "Erro ao buscar as parcelas" });
		}
	},

	// Função para buscar parcela por status
	PagamentoStatus: async (req: Request, res: Response) => {
		const { status } = req.body;
		const query = "SELECT * FROM parcelas_venda WHERE status = ? ";

		try {
			const rows = await queryDatabase(query, [status]);

			// Verificar se a Parcela foi encontrada
			if (rows === null || rows === undefined) {
				return res
					.status(404)
					.json({ error: "Parcela não encontrada" });
			}

			// Se a Parcela foi encontrado, retornar os dados
			return res.status(200).json(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao buscar OS" });
		}
	},
};

export { parcelasController };
