import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IEstoque {
  nome: string;
  quantidade: number;
  fornecedor_id: number;
  categoria_id: number;
  marca_id: number;
  valorUnitario: number;
}

export interface IListagemEstoque {
  id: string;
  nome: string;
  quantidade: number;
  fornecedor_id: number;
  categoria_id: number;
  marca_id: number;

}

export interface IDetalheEstoque {
  id: number;
  nome: string;
  quantidade: number;
  fornecedor_id: number;
  categoria_id: number;
  marca_id: number;
  data_criacao: string;
  valorUnitario: number;

}

export interface IDetalheHistoric {
  id: number;
  tipo: string;
  quantidade: number;
  estoque_id: number;
  venda_id: number;
  compra_id: number;
  data_criacao: string;
  fornecedor_id: number

}

export interface AddCategoria {
  nome: string;
}
export interface ViewCategoria {
  id: number;
  nome: string;
}


export interface IApiResponse {
  rows: IDetalheEstoque[]; 
  total: number;
}

const getAll = async (): Promise<[IDetalheEstoque] | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/estoque/all`;

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
    const urlRelativa = `${Environment.URL_BASE}/estoque/all?page=${page}&id=${filter}`;

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

const getByID = async (id: number): Promise<IDetalheEstoque[] | Error> => {
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

const getByFornecedor = async (id: number): Promise<IDetalheEstoque[] | Error> => {
  try {
    const { data } = await Api.get(`/estoque/AllFornecedor/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const getBymarca = async (id: number): Promise<IDetalheEstoque[] | Error> => {
  try {
    const { data } = await Api.get(`/estoque/AllMarca/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const getByHistoric = async (id: number): Promise<IDetalheHistoric[] | Error> => {
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

const create = async (dados: IEstoque): Promise<void | Error> => {
  try {
    await Api.post<IEstoque>('estoque/create', dados);

  } catch (error) {
    throw error;
  }
};

const updateById = async (id: string, dados: IDetalheEstoque): Promise<void | Error> => {
  try {
    await Api.put(`user/edit/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteEstoqueById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`estoque/delete/${id}`); 
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao apagar o registro.';
    return new Error(errorMessage);
  }
};

const ativarById = async (id: string): Promise<void | Error> => {
  try {
    await Api.put(`user/ativar/${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao ativar o usuário.');
  }
};

export const EstoqueService = {
  getAll,
  create,
  getByID,
  updateById,
  deleteEstoqueById,
  getBymarca,
  getByFornecedor,
  ativarById,
  getByHistoric,
  getAllList

};
