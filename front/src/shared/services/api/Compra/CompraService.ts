import { Environment } from '../../../environment';
import { Api } from '../axios-config';
import { IDetalheHistoric } from '../Estoque/EstoqueService';

export interface ICompra {
  nome: string;
  quantidade: number;
  fornecedor_id: number;
  categoria_id: number;
}

export interface IListagemCompra {
  id: string;
  nome: string;
  quantidade: number;
  fornecedor_id: number;
  categoria_id: number;

}

// Interface para uma parcela de uma compra_id
export interface IParcela {
    id: number;
    parcela: number;
    valorParcela: number;
    dataPagamento: string;
    status: string;
    compra_id: number;
    tipoPagamento: string;
  }

  export interface IParcelaCreate {
    parcela: number;
    valorParcela: number;
    dataPagamento: string;
    status: string;
    tipoPagamento: string;
  }
  
  // Interface para um produto de uma compra_id
  export interface IProduto {
    quantidade: number;
    id: number;
  }

  export interface ItemProduto {
    codBarras: string;
    estoque_id: number
  }
  
  // Interface para uma compra
  export interface ICompra {
    fornecedor_id: number;
    funcionario_id: number;
    QTparcelas: number;
    valorTotal: number;
    valorDesconto: number;
    valorTotalDesconto: number;
    status: string;
    parcelas: IParcelaCreate[];
    produtos: IProduto[];
    ItemProduto: ItemProduto[];
  }

  export interface ICompraDetalhe {
    id: number,
    fornecedor_id: number;
    funcionario_id: number;
    QTparcelas: number;
    valorTotal: number;
    valorDesconto: number;
    valorPago: number;
    status: string;
    data_criacao: string;
    valorTotalDesconto: number;

  }


export interface IApiResponse {
  rows: ICompraDetalhe[]; 
  total: number;
}

const getAll = async (page = 1, filter = ''): Promise<ICompraDetalhe | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/compra/all`;

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
    const urlRelativa = `${Environment.URL_BASE}/compra/all?page=${page}&id=${filter}`;

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

const getAllListFornecedor = async (page = 1, filter = '', cliente_id: number): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/compra/allCliente?page=${page}&id=${filter}&cliente_id=${cliente_id}`;

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

const getByID = async (id: number): Promise<ICompra[] | Error> => {
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

const getByCompra = async (id: number): Promise<IParcela[] | Error> => {
  try {
    const { data } = await Api.get(`/parcelasCompra/compra/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const getByHistoricCompra = async (id: number): Promise<IDetalheHistoric[] | Error> => {
  try {
    const { data } = await Api.get(`/historic/compra/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const getByHistoric = async (id: number): Promise<ICompra[] | Error> => {
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
    const { data } = await Api.get(`/produto_movimento/compra/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: ICompra): Promise<void | Error> => {
  try {
    await Api.post<ICompra>('compra/create', dados);
    console.log('dados', dados)

  } catch (error) {
    throw error;
  }
};

const updateById = async (id: string, dados: ICompra): Promise<void | Error> => {
  try {
    await Api.put(`user/edit/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteCompra = async (id: number): Promise<void | Error> => {
  try {
    await Api.put(`compra/delete`, { id }); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao cancelar compra.');
  }
};


export const CompraService = {
  getAll,
  create,
  getByID,
  updateById,
  getByHistoricCompra,
  getByCompra,
  getByHistoric,
  deleteCompra,
  getByProdutoMovimento,
  getAllList,
  getAllListFornecedor
};
