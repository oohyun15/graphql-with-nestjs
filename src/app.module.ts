import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import connectionOptions from './ormconfig';
import { WebtoonsModule } from './webtoons/webtoons.module';

@Module({
  imports: [
    UsersModule,
    WebtoonsModule,
    TypeOrmModule.forRoot(connectionOptions),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      debug: false,
      playground: true,
    }),
  ],
})
export class AppModule {}
