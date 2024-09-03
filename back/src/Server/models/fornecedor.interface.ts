export interface FornecedorCreate {
    tipo: string;
    cpfcnpj: string;
    nome: string;
    telefone: string;
    endereco: string;
    email: string;
    status: string;
}

export interface FornecedorConsulta {
    id: number;
    tipo: string;
    cpfcnpj: string;
    nome: string;
    telefone: string;
    endereco: string;
    email: string;
    status: string;
}