import { Request, Response } from 'express';
// import db from '../database/conn'
import queryDatabase from '../database/queryPromise'
import { CentroTroca } from '../models/centro_troca.interface'; 


const centroTrocaController = {
    // Função para buscar todos os CentroTroca
    getTrocas: async (req: Request, res: Response) => {
        const { page = 1, limit = 10, id, nome } = req.query;

        // Construir a consulta SQL com filtros e paginação
        let query = "SELECT * FROM centro_troca WHERE 1=1";
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
            const rows: CentroTroca = await queryDatabase(query, params);

            if (!rows || rows === undefined) {
                return res.status(404).json({ error: "Nenhum centro_troca encontrado" });
            }

            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar centro_troca" });
        }
    },

    // Função para criar um novo Troca
    createTroca: async (req: Request, res: Response) => {
        const {  venda_id, item_antigo_codBarra, item_novo_codBarra, motivo, descricaoTroca } = req.body;
        const query = "INSERT INTO centro_troca ( venda_id, item_antigo_codBarra, item_novo_codBarra, motivo, descricaoTroca) VALUES ( ?, ?, ?, ?, ?)";

        try {

            await queryDatabase(query, [ venda_id, item_antigo_codBarra, item_novo_codBarra, motivo, descricaoTroca]);
            return res.status(201).json({ message: `Troca criado com sucesso` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao criar Troca" });
        }
    },

    // Função para editar um Troca existente
    // editTroca: async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const { venda_id, item_antigo_codBarra, item_novo_codBarra, motivo, descricaoTroca } = req.body;

    //     const trocaExistsQuery = "SELECT * FROM centro_troca WHERE id = ?";
    //     const [trocaRows] = await queryDatabase(trocaExistsQuery, [id]);

    //     if (!trocaRows) {
    //         return res.status(404).json({ error: "Troca não encontrado" });
    //     }

    //     try {
    //         const updateQuery = `
	// 			UPDATE centro_troca 
	// 			SET venda_id = ?, item_antigo_codBarra = ?, item_novo_codBarra = ?, motivo = ?, descricaoTroca = ?
	// 			WHERE id = ?
	// 		`;
    //         await queryDatabase(updateQuery, [venda_id, item_antigo_codBarra, item_novo_codBarra, motivo, descricaoTroca]);

    //         return res.status(200).json({ message: "Fornecedor atualizado com sucesso" });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ error: "Erro ao atualizar Fornecedor" });
    //     }
    // },

    // Função para buscar uma Troca
    getTroca: async (req: Request, res: Response) => {
        const { id } = req.body;
        const query = "SELECT * FROM centro_troca WHERE id = ?";

        try {
            const [rows] = await queryDatabase(query, [id]);

            // Verificar se o centro_troca foi encontrado
            if (rows === null || rows === undefined) {
                return res.status(404).json({ error: "centro_troca não encontrado" });
            }

            // Se o centro_troca foi encontrado, retornar os dados
            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar centro_troca" });
        }
    },

};

export { centroTrocaController };
