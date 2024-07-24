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
    id: string;
    parcela: number;
    valorParcela: number;
    dataPagamento: string;
    status: string;
  }
  
  // Interface para um produto de uma venda
  export interface IProduto {
    quantidade: number;
    id: number;
  }
  
  // Interface para uma venda
  export interface IVenda {
    cliente_id: number;
    funcionario_id: number;
    QTparcelas: number;
    valorTotal: number;
    valorDesconto: number;
    status: string;
    parcelas: IParcela[];
    produtos: IProduto[];
  }

  export interface IVendaDetalhe {
    id: number,
    cliente_id: number;
    funcionario_id: number;
    QTparcelas: number;
    valorTotal: number;
    valorDesconto: number;
    status: string;
    data_criacao: string;

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


export interface IApiResponse {
  consulta: IListagemVenda[]; 
  pagination: {
    totalOrdem: number;
    pageCount: number;
    next?: { page: number };
    prev?: { page: number };
  };
  setor?: string;
  status?: string | string[];
  sala?: string | string[];
  equipe?: string;
  solicitante?: string;
}

// type TUsersComTotalCount = {
//   data: IListagemUsers[];
//   totalCount: number;
// };

const getAll = async (page = 1, filter = ''): Promise<IVendaDetalhe | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/venda/all`;

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

const getByID = async (id: number): Promise<IVenda[] | Error> => {
  try {
    const { data } = await Api.get(`/estoque/${id}`); 

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

const create = async (dados: IVenda): Promise<void | Error> => {
  try {
    await Api.post<IVenda>('estoque/create', dados);

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

const receberById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`user/delete/${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

const refazerReceberById = async (id: string): Promise<void | Error> => {
  try {
    await Api.put(`user/ativar/${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao ativar o usuário.');
  }
};

export const VendasService = {
  getAll,
  create,
  getByID,
  updateById,
  receberById,
  getByHistoricVenda,
  getByVenda,
  refazerReceberById,
  getByHistoric
};
