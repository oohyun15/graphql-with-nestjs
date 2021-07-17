import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    await app.init();
  });

  describe("/graphql (POST)", () => {
    it('addUser', () => {
      return request(app.getHttpServer())
        .post("/graphql")
        .send({
          operationName: null,
          variables: {
            "createUserDto": {
              "firstName": "Yonghyun",
              "lastName": "Kim"
            }
          },
          query: `
          mutation addUser ($createUserDto: CreateUserDto!) {
            addUser (createUserDto: $createUserDto) {
                id
                firstName
                lastName
                isActive
            }
        }`,
        })
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
