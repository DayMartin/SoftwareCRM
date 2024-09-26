import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IParcela {
    id: number;
    parcela: number;
    valorParcela: number;
    dataPagamento: string;
    status: string;
    venda_id: number;
    tipoPagamento: string;
  }

  export interface IParcelaCreate {
    parcela: number;
    valorParcela: number;
    dataPagamento: string;
    status: string;
    tipoPagamento: string;
  }
  
  export interface IApiResponse {
    rows: IParcela[]; 
    total: number;
  }

// type TUsersComTotalCount = {
//   data: IListagemUsers[];
//   totalCount: number;
// };

const getAll = async (page = 1, filter = ''): Promise<IParcela | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/parcelas/all`;

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
    const urlRelativa = `${Environment.URL_BASE}/parcelas/all?page=${page}&id=${filter}`;

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

const getByID = async (id: number): Promise<IParcela[] | Error> => {
  try {
    const { data } = await Api.get(`/parcelas/id/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const receberById = async (id: number, idvenda: number, valorPago: number): Promise<void | Error> => {
  try {
    await Api.put(`parcelas/receber/${id}`, {valorPago, idvenda}); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao receber a parcela.');
  }
};

const refazerReceberById = async (id: number, valorPago: number): Promise<void | Error> => {
  try {
    await Api.put(`parcelas/pendente/${id}`, {valorPago}); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao definir parcela como pendente.');
  }
};

const filtro = async (
  page = 1,
  filtro: string,
  dado: string
): Promise<IApiResponse | Error> => {
  try {

    const urlRelativa = `${Environment.URL_BASE}/parcelas/filtro`;
    const body = { page, filtro, dado, }
    const { data } = await Api.post<IApiResponse>(urlRelativa, body);

    return data;
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const diaPagamento = async (page = 1, filter = ''): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/parcelas/diapagamento?page=${page}&dataPagamento=${filter}`;

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

export const ParcelasService = {
  getAll,
  getByID,
  receberById,
  refazerReceberById,
  getAllList,
  filtro,
  diaPagamento
};
