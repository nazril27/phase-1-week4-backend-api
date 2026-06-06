import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
        url: process.env.DATABASE_URL
    }
};

