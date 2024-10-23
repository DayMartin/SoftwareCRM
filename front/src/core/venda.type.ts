export interface VendaType{
    cliente_id: number;
    funcionario_id: number;
    QTparcelas: number;
    valorTotal: number;
    valorDesconto: number;
    valorTotalDesconto: number;
    totalPago: number;
    status: string;
    parcelas: {
      parcela: number;
      valorParcela: number;
      dataPagamento: string;
      status: string;
      venda_id: number;
      tipoPagamento: string;
    }[];
    produtos: {
      quantidade: number;
      id: number;
      nameProduto: string;
      valorUnitario: number;
    }[];
}