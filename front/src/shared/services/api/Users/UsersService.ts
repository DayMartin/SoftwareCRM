import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IUser {
  tipo: string;
  cpfcnpj: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  senha: string;
  status: string;
}

export interface IListagemCliente {
  id: string;
  tipo: string;
  cpfcnpj: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  status: string;
  data_criacao: string;
  senha: string;
}

export interface IDetalheUsers {
  id: string;
  tipo: string;
  cpfcnpj: string;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  senha: string;
  status: string;
}

export interface IApiResponse {
  consulta: IListagemCliente[]; 
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

const getAll = async (page = 1, filter = ''): Promise<IDetalheUsers | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/user/all`;

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

const getClientes = async (tipo: string): Promise<IListagemCliente[] | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/user/getAlltipo`;
    const params = { tipo: tipo };
    const { data } = await Api.post<IListagemCliente[]>(urlRelativa, params);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};


const getByEmail = async (email: string): Promise<IDetalheUsers | Error> => {
  try {
    const { data } = await Api.get(`/auth/register/email?email=${email}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: IDetalheUsers): Promise<void | Error> => {
  try {
    await Api.post<IDetalheUsers>('user/create', dados);

  } catch (error) {
    throw error;
  }
};


const updateById = async (id: string, dados: IListagemCliente): Promise<void | Error> => {
  try {
    await Api.put(`user/edit/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`user/delete/${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
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


export const UsersService = {
  getAll,
  create,
  updateById,
  deleteById,
  getByEmail,
  getClientes,
  ativarById
};
