export interface Venda{
	cliente_id: number;
	funcionario_id: number;
	QTparcelas: number;
	valorTotal: number;
	valorDesconto: number;
	valorPago: number;
	status: string
}

export interface VendaConsulta{
	id: number,
	cliente_id: number;
	funcionario_id: number;
	QTparcelas: number;
	valorTotal: number;
	valorDesconto: number;
	valorPago: number;
	status: string
}

export interface HistoricVenda {
	id: number;
	id_venda: number;
	acao: string;
}