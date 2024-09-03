export interface CentroTroca {
    id: number;
    venda_id: number;
    item_antigo_codBarra: string;
    item_novo_codBarra: string;
    data_criacao: string;
    motivo: string;
    descricaoTroca: string;
}

export interface TrocaFornecedor { 
    codBarra_item: string;
    id_compra: number;
    fornecedor_id: number;
    status: string;
    data_criacao: string;
    descricaoDefeito: string;
}