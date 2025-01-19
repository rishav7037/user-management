import { Injectable } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';

export const config = () => ({
  logger: {
    logLevel: process.env.OMS_LOG_LEVEL,
  },
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env[`POSTGRES_USER`],
    password: process.env[`POSTGRES_PASSWORD`],
    database: process.env.POSTGRES_DB,
  },
  jwtSecret: process.env[`JWT_SECRET`] || 'secret',
});

export const ORM_CONFIGS: DataSourceOptions = {
  type: 'postgres',
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
    __dirname + '/../entity/*.entity{.ts,.js}',
  ],
  extra: {
    application_name: 'oms_connection',
    statement_timeout: 420000,
    query_timeout: 420000,
    max: 10,
  },
  logging: true,
  synchronize: false,
  database: config().postgres.database || 'app_db',
  host: config().postgres.host || 'localhost',
  port: config().postgres.port || 5432,
  username: config().postgres.username || 'root',
  password: config().postgres.password || 'root',
  migrations: ['dist/migrations/*.js'],
};
@Injectable()
export class ConfigsService {
  private readonly config: { [key: string]: any };

  constructor() {
    this.config = config();
  }

  get(key: string, config = this.config): any {
    const keys: string[] = key.split('.');
    if (keys.length === 1) {
      console.log(config[key]);
      return config[key];
    }
    const configs = config[keys[0]];
    return this.get(keys.slice(1).join('.'), configs);
  }

  set(key: string, value: any, config = this.config): any {
    const keys: string[] = key.split('.');
    if (keys.length === 1) {
      return (config[key] = value);
    }
    const configs = config[keys[0]];
    return this.set(keys.slice(1).join('.'), value, configs);
  }
}
