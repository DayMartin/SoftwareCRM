import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface ICliente {
  cpfcnpj: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  status: string;
}

export interface IListagemCliente {
  id: string;
  cpfcnpj: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  status: string;
  data_criacao: string;
}

export interface IDetalheCliente {
  id: string;
  cpfcnpj: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  status: string;
}

export interface IApiResponse {
  rows: IListagemCliente[]; 
  total: number;
}


const getClienteList = async (page = 1, filterId = ''): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/cliente/all?page=${page}&id=${filterId}`;

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

const getClienteByID = async (id: number): Promise<IListagemCliente | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/cliente/view/${id}`;

    const { data } = await Api.get<IListagemCliente>(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getClientes = async (): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/clientes`;

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

const getCliente = async (): Promise<IListagemCliente[] | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/cliente/list`;
    const { data } = await Api.get<IListagemCliente[]>(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};


const create = async (dados: IDetalheCliente): Promise<void | Error> => {
  try {
    await Api.post<IDetalheCliente>('cliente/create', dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: string, dados: IListagemCliente): Promise<void | Error> => {
  try {
    await Api.put(`cliente/edit/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`cliente/delete/${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

const ativarById = async (id: string): Promise<void | Error> => {
  try {
    await Api.put(`cliente/ativar/${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao ativar o usuário.');
  }
};

export const ClienteService = {
  getClienteList,
  getClientes,
  getClienteByID,
  getCliente,
  create,
  updateById,
  deleteById,
  ativarById,
  
};
