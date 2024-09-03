import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IFornecedor {
  cpfcnpj: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  status: string;
}

export interface IListagemFornecedor {
  id: string;
  cpfcnpj: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  status: string;
  data_criacao: string;
}

export interface IDetalheFornecedor {
  id: string;
  cpfcnpj: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  status: string;
}

export interface IApiResponse {
  rows: IListagemFornecedor[]; 
  total: number;
}


const getFornecedorList = async (page = 1, filterId = ''): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/fornecedor/all?page=${page}&id=${filterId}`;

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

const getFornecedor = async (): Promise<IListagemFornecedor[] | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/fornecedor/list`;
    const { data } = await Api.get<IListagemFornecedor[]>(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};


const create = async (dados: IDetalheFornecedor): Promise<void | Error> => {
  try {
    await Api.post<IDetalheFornecedor>('fornecedor/create', dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: string, dados: IListagemFornecedor): Promise<void | Error> => {
  try {
    await Api.put(`fornecedor/edit/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`fornecedor/delete/${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

const ativarById = async (id: string): Promise<void | Error> => {
  try {
    await Api.put(`fornecedor/ativar/${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao ativar o usuário.');
  }
};

export const FornecedorService = {
  getFornecedorList,
  getFornecedor,
  create,
  updateById,
  deleteById,
  ativarById,
  
};
