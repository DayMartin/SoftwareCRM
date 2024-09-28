import queryDatabase from '../database/queryPromise'

const userService = {
    async getUserById(userId: number) {
        try {
            const consulta = `SELECT * FROM usuarios WHERE id = ?`;
            const [userRows] = await queryDatabase(consulta, [userId]);

            // Verifique se o usuário foi encontrado
            if (userRows.length === 0) {
                return null; // Retorna null se o usuário não for encontrado
            }

            return userRows[0]; // Retorna o primeiro usuário encontrado
        } catch (error) {
            console.error("Erro ao buscar usuário por ID:", error);
            throw error; // Lança o erro para tratamento posterior
        }
    },
};

export { userService };