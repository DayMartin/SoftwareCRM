export interface ClienteCreate {
    tipo: string;
    cpfcnpj: string;
    nome: string;
    telefone: string;
    endereco: string;
    email: string;
    status: string;
}

export interface ClienteConsulta {
    id: number;
    tipo: string;
    cpfcnpj: string;
    nome: string;
    telefone: string;
    endereco: string;
    email: string;
    status: string;
}