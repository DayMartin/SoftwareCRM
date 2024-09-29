import { Request, Response } from 'express';
// import db from '../database/conn'
import queryDatabase from '../database/queryPromise'
import { UserConsulta } from '../models/users.interface';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import jwt from 'jsonwebtoken'; 

dotenv.config();

const JWT_SECRET = process.env.HASH || "UHSUDHK38DSUHDSKJDUSBCBUUH3";
const JWT_EXPIRATION = "1h";
const SALT_ROUNDS = 10

const usersController = {
    // Função para buscar todos os usuários
    getUsers: async (req: Request, res: Response) => {
        const { page = 1, limit = 10, id, nome } = req.query;

        // Construir a consulta SQL com filtros e paginação
        let query = "SELECT * FROM usuarios WHERE 1=1";
        const params: any[] = [];

        if (id) {
            query += " AND id = ?";
            params.push(id);
        }

        if (nome) {
            query += " AND nome LIKE ?";
            params.push(`%${nome}%`);
        }

        query += " LIMIT ? OFFSET ?";
        params.push(parseInt(limit as string));
        params.push((parseInt(page as string) - 1) * parseInt(limit as string));

        try {
            const rows: UserConsulta = await queryDatabase(query, params);

            if (!rows || rows === undefined) {
                return res.status(404).json({ error: "Nenhum usuário encontrado" });
            }

            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
    },

    // Função para criar um novo usuário
    createUser: async (req: Request, res: Response) => {
        const { tipo, cpfcnpj, nome, telefone, endereco, email, senha, status, porcentoComissao } = req.body;
        const query = "INSERT INTO usuarios (tipo, cpfcnpj, nome, telefone, endereco, email, senha, status, porcentoComissao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
        try {
            // Verifica se o email já está cadastrado
            const emailExistsQuery = "SELECT * FROM usuarios WHERE email = ?";
            const [emailRows] = await queryDatabase(emailExistsQuery, [email]);
    
            if (emailRows) {
                return res.status(400).json({ error: "Usuário já cadastrado" });
            }
    
            // Gera um hash para a senha
            const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);
    
            // Insere o usuário no banco de dados com a senha hash
            await queryDatabase(query, [tipo, cpfcnpj, nome, telefone, endereco, email, hashedPassword, status, porcentoComissao]);
    
            return res.status(201).json({ message: `Usuário criado com sucesso` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao criar usuário" });
        }
    },

    // Função para editar um usuário existente
    editUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { tipo, cpfcnpj, nome, telefone, endereco, email, senha, status, porcentoComissao } = req.body;
    
        const userExistsQuery = "SELECT * FROM usuarios WHERE id = ?";
        const [userRows] = await queryDatabase(userExistsQuery, [id]);
    
        if (!userRows) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
    
        try {
            const emailExistsQuery = "SELECT * FROM usuarios WHERE email = ? AND id != ?";
            const [emailRows] = await queryDatabase(emailExistsQuery, [email, id]);
    
            if (emailRows) {
                return res.status(400).json({ error: "Email já cadastrado por outro usuário" });
            }
    
            let updatedPassword = userRows.senha; // Mantém a senha atual se não for alterada
    
            // Se uma nova senha foi fornecida, faça o hash
            if (senha) {
                updatedPassword = await bcrypt.hash(senha, SALT_ROUNDS);
            }
    
            const updateQuery = `
                UPDATE usuarios 
                SET tipo = ?, cpfcnpj = ?, nome = ?, telefone = ?, endereco = ?, email = ?, senha = ?, status = ?, porcentoComissao = ?
                WHERE id = ?
            `;
            await queryDatabase(updateQuery, [tipo, cpfcnpj, nome, telefone, endereco, email, updatedPassword, status, porcentoComissao, id]);
    
            return res.status(200).json({ message: "Usuário atualizado com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao atualizar usuário" });
        }
    },

    // Função para buscar um usuário
    getUser: async (req: Request, res: Response) => {
        const { id } = req.body;
		console.log('id', id)
        const query = "SELECT * FROM usuarios WHERE id = ?";

        try {
            const [rows] = await queryDatabase(query, [id]);

            // Verificar se o usuário foi encontrado
            if (rows === null || rows === undefined) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Se o usuário foi encontrado, retornar os dados
            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar usuário" });
        }
    },

    // Função para buscar todos os users
    getUsersALL: async (req: Request, res: Response) => {
        try {
            const query = "SELECT * FROM usuarios";
            const rows = await queryDatabase(query);

            // Verificar se rows é um array
            if (!Array.isArray(rows)) {
                return res.status(500).json({ error: "Erro inesperado: Dados não são um array" });
            }

            // Retornar os dados encontrados
            return res.status(200).json(rows);
        } catch (error) {
            console.error("Erro ao buscar users:", error);
            return res.status(500).json({ error: "Erro ao buscar users" });
        }
    },
    // Função para buscar usuários por tipo
    getUserTipoList: async (req: Request, res: Response) => {
        const { page = 1, limit = 5, id = '' } = req.query;

        let query = "SELECT * FROM usuarios WHERE 1=1";
        const params: any[] = [];


        if (id) {
            query += " AND id = ?";
            params.push(Number(id));
        }

        // Contar o total de registros
        let countQuery = "SELECT COUNT(*) AS total FROM usuarios WHERE 1=1";
        const countParams: any[] = [];


        if (id) {
            countQuery += " AND id = ?";
            countParams.push(Number(id));
        }

        const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
        query += " LIMIT ? OFFSET ?";
        params.push(parseInt(limit as string), offset);

        try {
            // Executar a consulta para obter os registros
            const rows: UserConsulta = await queryDatabase(query, params);

            // Executar a consulta para contar o total de registros
            const countResult = await queryDatabase(countQuery, countParams);
            const total = countResult[0]?.total || 0;

            if (!rows || rows === undefined) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Retornar os registros e o total
            return res.status(200).json({ rows, total });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
    },
    // Função para buscar usuários por tipo
    getUserTipo: async (req: Request, res: Response) => {
        const { tipo } = req.body;
        const query = "SELECT * FROM usuarios WHERE tipo = ?";

        try {
            const rows = await queryDatabase(query, tipo);

            // Verificar se algum usuário foi encontrado
            if (!rows || rows.length === 0) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Se os usuários foram encontrados, retornar os dados
            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
    },

    // Função para desativar um Usuario
    desativarUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        const queryVerificar = "SELECT * FROM usuarios WHERE id = ?";
        const queryDesativar = 'UPDATE financeiro.usuarios SET status= ? WHERE id = ?';

        try {
            // Verificar se o Usuario existe
            const [rows] = await queryDatabase(queryVerificar, [id]);
            if (rows === null || rows === undefined) {
                return res.status(404).json({ error: "Usuario não encontrado" });
            }

            // Se o Usuario existe, então deletá-lo
            await queryDatabase(queryDesativar, ['desativado', id]);
            return res.status(200).json({ message: "Usuario desativado com sucesso" });


        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao deletar o Usuario" });
        }
    },

    //Função para Ativar usuário
    ativarUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        console.log('id', id)
        const queryVerificar = "SELECT * FROM usuarios WHERE id = ?";
        const queryDesativar = 'UPDATE financeiro.usuarios SET status= ? WHERE id = ?';

        try {
            // Verificar se o Usuario existe
            const [rows] = await queryDatabase(queryVerificar, [id]);
            if (rows === null || rows === undefined) {
                return res.status(404).json({ error: "Usuario não encontrado" });
            }

            // Se o Usuario existe, então deletá-lo
            await queryDatabase(queryDesativar, ['ativo', id]);
            return res.status(200).json({ message: "Usuario desativado com sucesso" });


        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao deletar o Usuario" });
        }
    },

    loginUser: async (req: Request, res: Response) => {
        const { email, senha } = req.body;
    
        try {
            const userExistsQuery = "SELECT * FROM usuarios WHERE email = ?";
            const [userRows] = await queryDatabase(userExistsQuery, [email]);
    
            if (!userRows) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
    
            const user = userRows; 
    
            const isPasswordValid = await bcrypt.compare(senha, user.senha);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Senha incorreta" });
            }
    
            const token = jwt.sign(
                { id: user.id, email: user.email}, 
                JWT_SECRET,
                { expiresIn: JWT_EXPIRATION } 
            );

            return res.status(200).json({
                message: "Login bem-sucedido",
                token, 
                user: { id: user.id, email: user.email, nome: user.nome } 
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao realizar login" });
        }
    }
};

export { usersController };
