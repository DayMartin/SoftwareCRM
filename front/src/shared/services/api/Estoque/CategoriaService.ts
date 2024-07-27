import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface AddCategoria {
  nome: string;
}
export interface ViewCategoria {
  id: number;
  nome: string;
}


const createCategoria = async (dados: AddCategoria): Promise<void | Error> => {
  try {
    await Api.post<AddCategoria>('categoria/create', dados);

  } catch (error) {
    throw error;
  }
};

const consultaCategoria = async (page = 1, filter = ''): Promise<[ViewCategoria] | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/categoria/all`;

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


export const CategoriaService = {
  createCategoria,
  consultaCategoria
};
