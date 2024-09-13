import { Environment } from '../../../environment';
import { Api } from '../axios-config';
import { IDetalheHistoric } from '../Estoque/EstoqueService';

export interface IVenda {
  nome: string;
  quantidade: number;
  fornecedor_id: number;
  categoria_id: number;
}

export interface IListagemVenda {
  id: string;
  nome: string;
  quantidade: number;
  fornecedor_id: number;
  categoria_id: number;

}

// Interface para uma parcela de uma venda
export interface IParcela {
    id: number;
    parcela: number;
    valorParcela: number;
    dataPagamento: string;
    status: string;
    venda_id: number;
    tipoPagamento: string;
  }

  export interface IParcelaCreate {
    parcela: number;
    valorParcela: number;
    dataPagamento: string;
    status: string;
    tipoPagamento: string;
  }
  
  // Interface para um produto de uma venda
  export interface IProduto {
    quantidade: number;
    nameProduto: string;
    valorUnitario: number;
    id: number;
  }
  
  // Interface para uma venda
  export interface IVenda {
    id: number;
    cliente_id: number;
    funcionario_id: number;
    QTparcelas: number;
    valorTotal: number;
    valorDesconto: number;
    valorTotalDesconto: number;
    status: string;
    parcelas: IParcelaCreate[];
    produtos: IProduto[];
    ItemProduto	: SetarItemProduto[];
    data_criacao: string;

  }

  export interface IVendaDetalhe {
    id: number,
    cliente_id: number;
    funcionario_id: number;
    QTparcelas: number;
    valorTotal: number;
    valorDesconto: number;
    valorTotalDesconto: number;
    valorPago: number;
    status: string;
    data_criacao: string;
    comissao: number
  }


// export interface IDetalheHistoric {
//   id: number;
//   tipo: string;
//   quantidade: number;
//   estoque_id: number;
//   venda_id: number;
//   compra_id: number;
//   data_criacao: string;

// }

export interface SetarItemProduto {
    id: number;
    codBarras: string;
}


export interface IApiResponse {
  rows: IVendaDetalhe[]; 
  total: number;
}

export interface ComissaoVendedor {
  vendas: IVendaDetalhe[]
  total: number;
  totalComissao: number;
}

export interface VendasCompare {
  totalMesAtual: number; 
  totalMesPassado: number
  diferenca: number;
  porcentagem: number
}

const getAllMes = async (): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/venda/mes`;

    const { data } = await Api.get(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getAllDia = async (): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/venda/dia`;

    const { data } = await Api.get(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getCompare = async (): Promise<VendasCompare | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/venda/compare`;

    const { data } = await Api.get(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getAllList = async (page = 1, filter = ''): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/venda/all?page=${page}&id=${filter}`;

    const { data } = await Api.get<IApiResponse>(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getAllListCliente = async (page = 1, filter = '', cliente_id: number): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/venda/allCliente?page=${page}&id=${filter}&cliente_id=${cliente_id}`;

    const { data } = await Api.post<IApiResponse>(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getByID = async (id: number): Promise<IVenda | Error> => {
  try {
    const { data } = await Api.get(`/venda/view/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const getByVenda = async (id: number): Promise<IParcela[] | Error> => {
  try {
    const { data } = await Api.get(`/parcelas/venda/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const getByHistoricVenda = async (id: number): Promise<IDetalheHistoric[] | Error> => {
  try {
    const { data } = await Api.get(`/historic/venda/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const getByHistoric = async (id: number): Promise<IVenda[] | Error> => {
  try {
    const { data } = await Api.get(`/historic/AllEstoque/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const getByProdutoMovimento = async (id: number): Promise<IDetalheHistoric[] | Error> => {
  try {
    const { data } = await Api.get(`/produto_movimento/venda/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: IVenda): Promise<void | Error> => {

  console.log('dados', dados)
  try {
    await Api.post<IVenda>('venda/create', dados);

  } catch (error) {
    throw error;
  }
};

const updateById = async (id: string, dados: IVenda): Promise<void | Error> => {
  try {
    await Api.put(`user/edit/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteVenda = async (id: number): Promise<void | Error> => {
  try {
    await Api.put(`venda/delete`, { id }); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao cancelar venda.');
  }
};

const getComissaoVendedor = async (
  page = 1,
  limit = 5,
  funcionario_id: number | null = null,
  data_inicio: string | '',
  data_fim: string | ''
): Promise<ComissaoVendedor | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/venda/comissaoVendedor`;

    // Construa o corpo da requisição
    const requestBody = {
      page,
      limit,
      funcionario_id,
      data_inicio,
      data_fim
    };

    // Envie a requisição POST com o corpo correto
    const { data } = await Api.post<ComissaoVendedor>(urlRelativa, requestBody);

    return data;
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};


export const VendasService = {
  getAllMes,
  getAllDia,
  getCompare,
  create,
  getByID,
  updateById,
  getByHistoricVenda,
  getByVenda,
  getByHistoric,
  deleteVenda,
  getByProdutoMovimento,
  getAllList,
  getAllListCliente,
  getComissaoVendedor
};
