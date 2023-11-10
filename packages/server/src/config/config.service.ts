import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigService {
  private static singleton?: ConfigService;

  constructor(public readonly config: Record<string, string>) {
    if (ConfigService.singleton) return ConfigService.singleton;

    ConfigService.singleton = this;
  }

  private getValue(key: string, throwOnMissing = true) {
    const value = this.config[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public retrievePort() {
    return this.getValue('PORT');
  }

  public isProduction() {
    return this.getValue('NODE_ENV') === 'production';
  }

  public retrieveTypeormConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      ssl: process.env.POSTGRES_SSL === 'true',
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: false,
    };
  }
}

export const configService = new ConfigService(process.env);
