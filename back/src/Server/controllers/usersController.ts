import { Request, Response } from 'express';
// import db from '../database/conn'
import queryDatabase from '../database/queryPromise'


const usersController = {
    // Função para buscar todos os usuários
    getUsers: async (_: Request, res: Response) => {
        const query = "SELECT * FROM usuarios";

        try {
            const rows  = await queryDatabase(query);
            // Verificar se tem serviço cadastrado
            if (rows === null || rows === undefined) {
                return res.status(404).json({ error: "Nenhum usuário cadastrado" });
            }
            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
    },

    // Função para criar um novo usuário
    createUser: async (req: Request, res: Response) => {
        const { tipo, cpfcnpj, nome, telefone, endereco, email, senha, status } = req.body;
        const query = "INSERT INTO usuarios (tipo, cpfcnpj, nome, telefone, endereco, email, senha, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            // Verifica se o email já está cadastrado
            const emailExistsQuery = "SELECT * FROM usuarios WHERE email = ?";
            const [emailRows] = await queryDatabase(emailExistsQuery, [email]);

            if (emailRows) {
                return res.status(400).json({ error: "Usuário já cadastrado" });
            }
            await queryDatabase(query, [tipo, cpfcnpj, nome, telefone, endereco, email, senha, status]);
            return res.status(201).json({ message: `Usuário criado com sucesso` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao criar usuário" });
        }
    },

	// Função para editar um usuário existente
	editUser: async (req: Request, res: Response) => {
		const { id } = req.params;
		const { tipo, cpfcnpj, nome, telefone, endereco, email, senha, status } = req.body;

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

			const updateQuery = `
				UPDATE usuarios 
				SET tipo = ?, cpfcnpj = ?, nome = ?, telefone = ?, endereco = ?, email = ?, senha = ?, status = ? 
				WHERE id = ?
			`;
			await queryDatabase(updateQuery, [tipo, cpfcnpj, nome, telefone, endereco, email, senha, status, id]);

			return res.status(200).json({ message: "Usuário atualizado com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao atualizar usuário" });
		}
	},


    // Função para buscar um usuário
    getUser: async (req: Request, res: Response) => {
        const { id } = req.body;
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
};

export { usersController };
