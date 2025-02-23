import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'reflect-metadata';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  logging: true,
  synchronize: false,
  migrationsTransactionMode: 'each',
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
