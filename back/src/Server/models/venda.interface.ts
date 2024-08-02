export interface Venda{
	cliente_id: number;
	funcionario_id: number;
	QTparcelas: number;
	valorTotal: number;
	valorDesconto: number;
	valorPago: number;
	status: string
}