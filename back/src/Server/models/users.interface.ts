export interface UserCreate {
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

export interface UserConsulta {
    id: number;
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