export interface Compras{
	funcionario_id: number;
	fornecedor_id: number;
	QTparcelas: number;
	valorTotal: number;
	valorDesconto: number;
	valorTotalDesconto: number;
	valorPago: number;
	status: string
}