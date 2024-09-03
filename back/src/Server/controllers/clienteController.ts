import { Request, Response } from 'express';
// import db from '../database/conn'
import queryDatabase from '../database/queryPromise'
import { ClienteConsulta } from '../models/cliente.interface';


const clienteController = {
    // Função para buscar todos os clientes
    getClientes: async (req: Request, res: Response) => {
        const { page = 1, limit = 10, id, nome } = req.query;

        // Construir a consulta SQL com filtros e paginação
        let query = "SELECT * FROM cliente WHERE 1=1";
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
            const rows: ClienteConsulta = await queryDatabase(query, params);

            if (!rows || rows === undefined) {
                return res.status(404).json({ error: "Nenhum Cliente encontrado" });
            }

            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar Clientes" });
        }
    },

    // Função para criar um novo Cliente
    createCliente: async (req: Request, res: Response) => {
        const {  cpfcnpj, nome, telefone, endereco, email, status } = req.body;
        const query = "INSERT INTO cliente ( cpfcnpj, nome, telefone, endereco, email, status) VALUES ( ?, ?, ?, ?, ?, ?)";

        try {
            // Verifica se o email já está cadastrado
            const emailExistsQuery = "SELECT * FROM cliente WHERE email = ?";
            const [emailRows] = await queryDatabase(emailExistsQuery, [email]);

            if (emailRows) {
                return res.status(400).json({ error: "Cliente já cadastrado" });
            }
            await queryDatabase(query, [ cpfcnpj, nome, telefone, endereco, email, status]);
            return res.status(201).json({ message: `Cliente criado com sucesso` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao criar Cliente" });
        }
    },

    // Função para editar um Cliente existente
    editCliente: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { cpfcnpj, nome, telefone, endereco, email, status } = req.body;

        const clienteExistsQuery = "SELECT * FROM cliente WHERE id = ?";
        const [clienteRows] = await queryDatabase(clienteExistsQuery, [id]);

        if (!clienteRows) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }

        try {
            const emailExistsQuery = "SELECT * FROM cliente WHERE email = ? AND id != ?";
            const [emailRows] = await queryDatabase(emailExistsQuery, [email, id]);

            if (emailRows) {
                return res.status(400).json({ error: "Email já cadastrado por outro Cliente" });
            }

            const updateQuery = `
				UPDATE cliente
				SET cpfcnpj = ?, nome = ?, telefone = ?, endereco = ?, email = ?, status = ? 
				WHERE id = ?
			`;
            await queryDatabase(updateQuery, [cpfcnpj, nome, telefone, endereco, email, status, id]);

            return res.status(200).json({ message: "Cliente atualizado com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao atualizar Cliente" });
        }
    },

    // Função para buscar um Cliente
    getCliente: async (req: Request, res: Response) => {
        const { id } = req.body;
        const query = "SELECT * FROM cliente WHERE id = ?";

        try {
            const [rows] = await queryDatabase(query, [id]);

            // Verificar se o Cliente foi encontrado
            if (rows === null || rows === undefined) {
                return res.status(404).json({ error: "Cliente não encontrado" });
            }

            // Se o Cliente foi encontrado, retornar os dados
            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar Cliente" });
        }
    },

    // Função para desativar um Cliente
    desativarCliente: async (req: Request, res: Response) => {
        const { id } = req.params;
        const queryVerificar = "SELECT * FROM cliente WHERE id = ?";
        const queryDesativar = 'UPDATE financeiro.cliente SET status= ? WHERE id = ?';

        try {
            // Verificar se o Cliente existe
            const [rows] = await queryDatabase(queryVerificar, [id]);
            if (rows === null || rows === undefined) {
                return res.status(404).json({ error: "Cliente não encontrado" });
            }

            // Se o Cliente existe, então deletá-lo
            await queryDatabase(queryDesativar, ['desativado', id]);
            return res.status(200).json({ message: "Cliente desativado com sucesso" });


        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao deletar o Cliente" });
        }
    },

    //Função para Ativar Cliente
    ativarCliente: async (req: Request, res: Response) => {
        const { id } = req.params;
        console.log('id', id)
        const queryVerificar = "SELECT * FROM cliente WHERE id = ?";
        const queryDesativar = 'UPDATE financeiro.cliente SET status= ? WHERE id = ?';

        try {
            // Verificar se o Cliente existe
            const [rows] = await queryDatabase(queryVerificar, [id]);
            if (rows === null || rows === undefined) {
                return res.status(404).json({ error: "Cliente não encontrado" });
            }

            // Se o Cliente existe, então desativa-lo
            await queryDatabase(queryDesativar, ['ativo', id]);
            return res.status(200).json({ message: "Cliente desativado com sucesso" });


        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao deletar o Usuario" });
        }
    },
};

export { clienteController };
