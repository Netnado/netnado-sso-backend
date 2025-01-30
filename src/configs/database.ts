import { DATABASE_CONSTANTS } from '../constants/database';

export default {
  type: 'postgres',
  host: DATABASE_CONSTANTS.HOST,
  port: DATABASE_CONSTANTS.PORT,
  username: DATABASE_CONSTANTS.USERNAME,
  password: DATABASE_CONSTANTS.PASSWORD,
  database: DATABASE_CONSTANTS.DATABASE,
  synchronize: false,
  logging: true,
};
