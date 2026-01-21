import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_secret: process.env.CLOUDINARY_API_SECRET
    },
    stripe: {
        stripe_secret_key: process.env.STRIPE_SECRET_KEY,
        stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
        client_url: process.env.CLIENT_URL,
    },
    platformAdmin: {
        email: process.env.PLATFORM_ADMIN_EMAIL || 'platformadmin@gmail.com',
        password: process.env.PLATFORM_ADMIN_PASSWORD || 'platformadmin123'
    },
    jwt_secret:process.env.JWT_SECRET,
    jwt_refresh_secret:process.env.JWT_REFRESH_SECRET,
    salt: process.env.SALT_ROUNDS,

}