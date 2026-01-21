import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
export const config = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    platformAdmin: {
        email: process.env.PLATFORM_ADMIN_EMAIL || 'platformadmin@gmail.com',
        password: process.env.PLATFORM_ADMIN_PASSWORD || 'platformadmin123'
    },
    jwt_secret: process.env.JWT_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    salt: process.env.SALT_ROUNDS,
};
