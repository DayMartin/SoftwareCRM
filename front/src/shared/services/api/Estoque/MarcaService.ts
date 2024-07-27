import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface AddMarca {
  nome: string;
}
export interface ViewMarca {
  id: number;
  nome: string;
}


const createMarca = async (dados: AddMarca): Promise<void | Error> => {
  try {
    await Api.post<AddMarca>('marca/create', dados);

  } catch (error) {
    throw error;
  }
};

const consultaMarca = async (page = 1, filter = ''): Promise<[ViewMarca] | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/marca/all`;

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


export const MarcaService = {
  createCategoria: createMarca,
  consultaCategoria: consultaMarca
};
