import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load .env from monorepo root
dotenv.config({ path: join(__dirname, '../../../../.env') });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    // Supabase transaction pooler compatibility
    options: '-c search_path=public',
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
