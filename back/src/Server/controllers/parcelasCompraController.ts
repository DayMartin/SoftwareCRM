import { Request, Response } from "express";
import queryDatabase from "../database/queryPromise";
// Função para buscar todos os usuários

const parcelasCompraController = {
	getParcelas: async (req: Request, res: Response) => {
		const { page = 1, limit = 5, id } = req.query;
		let query = "SELECT * FROM parcelas_compra WHERE 1=1";
		let countQuery = "SELECT COUNT(*) AS total FROM parcelas_compra WHERE 1=1";
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

	// Função para buscar uma parcela
	getParcela: async (req: Request, res: Response) => {
		const { id } = req.params;
		const query = "SELECT * FROM parcelas_compra WHERE id = ?";

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
	getParcelaCompra: async (req: Request, res: Response) => {
		const { compra_id } = req.params;
		const query = "SELECT * FROM parcelas_compra WHERE compra_id = ?";

		try {
			const rows = await queryDatabase(query, [compra_id]);

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
		const { valorPago, idcompra } = req.body;

		if (valorPago === undefined || isNaN(Number(valorPago))) {
			return res.status(400).json({ error: "valorPago é obrigatório e deve ser um número válido." });
		}

		const valorPagoNumero = Number(valorPago);
		console.log('valor', valorPagoNumero);

		const queryVerificar = "SELECT * FROM parcelas_compra WHERE id = ?";
		const atualizarStatus = 'UPDATE parcelas_compra SET status= ? WHERE id = ?';
		const atualizarCompra = 'UPDATE compra SET valorPago = ? WHERE id = ?';
		const consultaValor = "SELECT valorPago FROM compra WHERE id = ?";
		const consultarTotal = "SELECT valorTotalDesconto FROM compra WHERE id = ?";
		const atualizarCompraStatus = 'UPDATE compra SET status = ? WHERE id = ?';
		const atualizarDataPago = 'UPDATE parcelas_compra SET dataPago= ? WHERE id = ?'

		try {
			const [parcela] = await queryDatabase(queryVerificar, [id]);
			if (!parcela) {
				return res.status(404).json({ error: "Parcela não encontrada" });
			}

			const [compra] = await queryDatabase(consultaValor, [parcela.compra_id]);
			if (!compra) {
				return res.status(404).json({ error: "Compra não encontrada" });
			}

			const novoValorPago = Number(compra.valorPago) + valorPagoNumero;
			// console.log('novoValorPago', novoValorPago);
			const dataPago = new Date()

			await queryDatabase(atualizarCompra, [novoValorPago, parcela.compra_id]);
			await queryDatabase(atualizarStatus, ['pago', id]);
			await queryDatabase(atualizarDataPago, [dataPago, id]);


			const consultarNovoPago = await queryDatabase(consultaValor, [parcela.compra_id]);
			const consultarValorTotal = await queryDatabase(consultarTotal, [parcela.compra_id]);

			const valorPago = parseFloat(consultarNovoPago[0].valorPago);
			const valorTotal = parseFloat(consultarValorTotal[0].valorTotalDesconto);

			await queryDatabase(atualizarCompraStatus, ['parcial', idcompra]);

			if (valorPago == valorTotal) {
				await queryDatabase(atualizarCompraStatus, ['pago', idcompra]);
			}

			return res.status(200).json({ message: "Parcela recebida com sucesso" });

		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao pagar Parcela" });
		}
	},


	pendeciaParcela: async (req: Request, res: Response) => {
		const { id } = req.params;
		const { valorPago } = req.body;

		const queryVerificar = "SELECT * FROM parcelas_compra WHERE id = ?";
		const queryPagar = "UPDATE parcelas_compra SET status= ? WHERE id = ?";
		const atualizarCompra = "UPDATE compra SET valorPago = ? WHERE id = ?";
		const consultaValor = "SELECT valorPago FROM compra WHERE id = ?";
		const atualizarCompraStatus = 'UPDATE compra SET status = ? WHERE id = ?';
		const atualizarDataPago = 'UPDATE parcelas_compra SET dataPago= ? WHERE id = ?'

		try {
			const [parcela] = await queryDatabase(queryVerificar, [id]);
			if (!parcela) {
				return res
					.status(404)
					.json({ error: "Parcela não encontrada" });
			}

			// Consultar o valor atual de 'valorPago' na tabela 'compra'
			const [compra] = await queryDatabase(consultaValor, [parcela.compra_id]);
			if (!compra) {
				return res.status(404).json({ error: "compra não encontrada" });
			}

			// Calcular o novo valor de 'valorPago'
			const novoValorPago = compra.valorPago - valorPago;

			if (novoValorPago === 0.00) {
				await queryDatabase(atualizarCompraStatus, ["pendente", parcela.compra_id]);
			} else {
				await queryDatabase(atualizarCompraStatus, ["parcial", parcela.compra_id]);

			}

			// Atualizar o valor de 'valorPago' na tabela 'compra'
			await queryDatabase(queryPagar, ["pendente", id]);
			await queryDatabase(atualizarCompra, [novoValorPago, parcela.compra_id]);
			await queryDatabase(atualizarDataPago, ['', id]);


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
		const queryVerificar = "SELECT * FROM parcelas_compra WHERE id = ?";
		const queryDeletar = "DELETE FROM parcelas_compra WHERE id = ?";

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
		const { page = 1, limit = 5, dataPagamento } = req.body;
		let query = "SELECT * FROM parcelas_compra WHERE 1=1";
		let countQuery = "SELECT COUNT(*) AS total FROM parcelas_compra WHERE 1=1";
		const params: any[] = [];

		if (dataPagamento) {
			query += " AND dataPagamento = ?";
			countQuery += " AND dataPagamento = ?";
			params.push(dataPagamento);
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

	// Função para trazer as parcelas filtradas por mês
	PagamentoMes: async (req: Request, res: Response) => {
		const { mes } = req.body;

		// Extrair o mês do formato 'MM/YYYY'
		const [month, year] = mes.split("/");

		const query = "SELECT * FROM parcelas_compra";

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
		const query = "SELECT * FROM parcelas_compra";

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
		const query = "SELECT * FROM parcelas_compra WHERE status = ? ";

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

	Filtro: async (req: Request, res: Response) => {
		const { filtro, dado, page = 1, limit = 5 } = req.body;

		let query = "SELECT * FROM parcelas_compra WHERE 1=1";
		let countQuery = "SELECT COUNT(*) AS total FROM parcelas_compra WHERE 1=1";
		const params: any[] = [];

		if (filtro && dado) {
			query += ` AND ${filtro} = ?`;
			countQuery += ` AND ${filtro} = ?`;
			params.push(dado);
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
};

export { parcelasCompraController };
