import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface ICentroTroca {
  venda_id: number;
  compra_id: number;
  estoque_id: number;
  item_antigo_codBarra: number;
  item_novo_codBarra: number;
  motivo: string;
  descricaoTroca: string;
  fornecedor_id: number;
  responseUser: boolean
} 

export interface IDetalheCentroTroca {
  id: number;
  venda_id: number;
  estoque_id: number;
  item_antigo_codBarra: number;
  item_novo_codBarra: number;
  motivo: string;
  descricaoTroca: string;
  send_fornecedor: boolean

} 

export interface IApiResponse {
  rows: IDetalheCentroTroca[]; 
  total: number;
}

const getAll = async (): Promise<[IDetalheCentroTroca] | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/troca/all`;

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
    const urlRelativa = `${Environment.URL_BASE}/troca/all?page=${page}&id=${filter}`;

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


const create = async (dados: ICentroTroca): Promise<void | Error> => {
  try {

    console.log('dados', dados)
    await Api.post<ICentroTroca>('troca/create', dados);

  } catch (error) {
    throw error;
  }
};




export const CentroTrocaService = {
  getAll,
  create,
  getAllList,
};
