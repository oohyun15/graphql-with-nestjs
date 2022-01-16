import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { ExternalsModule } from './externals/externals.module';
import connectionOptions from './ormconfig';

@Module({
  imports: [
    UsersModule,
    ExternalsModule,
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
