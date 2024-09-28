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
  porcentoComissao: number;
}

export interface IListagemUser {
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
  porcentoComissao: number;

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
  porcentoComissao: number;

}

export interface IApiResponse {
  rows: IListagemUser[]; 
  total: number;
}

const getAll = async (page = 1, filterId = '', filterName = ''): Promise<IListagemUser | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/user/all?page=${page}&filterId=${filterId}&filterName=${filterName}`;

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


const getUsers = async (): Promise<IListagemUser[] | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/user/list`;
    const { data } = await Api.get<IListagemUser[]>(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getUsersList = async (page = 1, filterId = '', filterName = ''): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/user/getAlltipoList?page=${page}&id=${filterId}&nome=${filterName}`;

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

// const getByEmail = async (email: string): Promise<IDetalheUsers | Error> => {
//   try {
//     const { data } = await Api.get(`/auth/register/email?email=${email}`); 

//     if (data) {
//       return data;
//     }

//     return new Error('Erro ao consultar o registro.');
//   } catch (error) {
//     console.error(error);
//     return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
//   }
// };

const create = async (dados: IDetalheUsers): Promise<void | Error> => {
  try {
    await Api.post<IDetalheUsers>('/user/create', dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: string, dados: IListagemUser): Promise<void | Error> => {
  try {
    await Api.put(`user/edit/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`/user/delete/${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

const ativarById = async (id: string): Promise<void | Error> => {
  try {
    await Api.put(`/user/ativar/${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao ativar o usuário.');
  }
};

export const UsersService = {
  getUsersList,
  create,
  updateById,
  deleteById,
  // getByEmail,
  ativarById,
  getUsers,
  getAll
};
