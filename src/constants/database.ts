export const DATABASE_CONSTANTS = {
  HOST: process.env.DB_HOST || 'db.xxxxx.supabase.co',
  PORT: parseInt(process.env.DB_PORT, 10) || 5432,
  USERNAME: process.env.DB_USER || 'postgres',
  PASSWORD: process.env.DB_PASS || 'your_password',
  DATABASE: process.env.DB_NAME || 'your_database',
};
