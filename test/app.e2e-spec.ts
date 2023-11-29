import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';

process.env.NODE_ENV = 'test';
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await moduleFixture.close();
    await app.close();
  });
  it('GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('POST /login', () => {
    it('Can login', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .set({
          username: 'samuel',
          password: 'password',
        });
      expect(status).toBe(200);
    });
  });

  describe('POST /signup', () => {
    it('Can login', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .set({
          username: 'samuel',
          password: 'password',
        });
      expect(status).toBe(201);
    });
  });

  describe('POST /api/v1/auth/signup', () => {
    it('Can signup', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/api/v1/auth/signup/')
        .send({
          username: 'samuel',
          password: 'password',
        });

      expect(status).toBe(201);
    });

    it('Should throw error while creating product without bearer token', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/api/v1/product/')
        .send({
          name: 'crayon',
          quantity: 23,
          inStock: false,
          description: 'used for painting',
        });
      expect(status).toBe(401);
    });

    it('Should not be able to post to a different endpoint', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/product/create')
        .send({
          name: 'crayon',
          quantity: 23,
          inStock: false,
          description: 'used for painting',
        });

      const resBody = res?.body;

      expect(resBody.statusCode).toBe(404);
    });
  });
});
