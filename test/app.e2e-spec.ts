import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";

describe('App (e2e', () => {

  ////////////////////////////////////////////
  // INIT ////////////////////////////////////
  ////////////////////////////////////////////

  let app: INestApplication;

  // Init app module
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule,]
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    )

    await app.init();

  });

  ////////////////////////////////////////////
  // TESTS ///////////////////////////////////
  ////////////////////////////////////////////


  it.todo('Hello');

  ////////////////////////////////////////////
  // Clean up ////////////////////////////////
  ////////////////////////////////////////////

  afterAll(() => {
    app.close();
  })
})

