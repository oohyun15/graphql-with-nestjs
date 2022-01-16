import { ConnectionOptions } from 'typeorm';

const PROD_ENV = 'production';

/*
ormconfig.json
{
  type: 'mysql',
    host: 'localhost',
      port: 3306,
        username: 'root',
          password: '',
            database: 'graphql-with-nestjs',
              entities: [join(__dirname, '**', '*.entity.{ts,js}')],
                synchronize: false,
    }
*/

const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'graphql-with-nestjs',
};

const connectionOptions: ConnectionOptions = {
  type: 'mysql',
  host: config.host,
  port: 3306,
  username: config.user,
  password: config.password,
  database: config.database,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // We are using migrations, synchronize should be set to false.
  synchronize: false,
  dropSchema: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: ['warn', 'error'],
  logger: process.env.NODE_ENV === PROD_ENV ? 'file' : 'debug',
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export = connectionOptions;
