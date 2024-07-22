import dotenv from 'dotenv';

dotenv.config();


const databaseConfig = {
    config: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'dinahdoria',
        password: process.env.DB_PASS || 'giovana0407 ',
        database: process.env.DB_NAME || 'financeiro'
    }
};

export default databaseConfig;