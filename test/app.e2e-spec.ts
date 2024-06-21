import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { DatabaseService } from "../src/database/database.service";
import * as pactum from 'pactum';
import { validAuthCreds } from "./auth";

describe('App (e2e', () => {

  ////////////////////////////////////////////
  // INIT ////////////////////////////////////
  ////////////////////////////////////////////

  let app: INestApplication;
  let prisma: DatabaseService;

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

    // Get the prisma service
    prisma = app.get(DatabaseService);

    // Clean the db before running tests
    await prisma.cleanDb();

    await app.init();

    await app.listen(3333);
  });

  ////////////////////////////////////////////
  // TESTS ///////////////////////////////////
  ////////////////////////////////////////////

  // Auth
  describe('Auth', () => {

    // Sign up
    describe('Sign up', () => {

      // Should be able to sign up
      it('Should be able to sign up', () => {
        return pactum
        .spec()
        .post('http://localhost:3333/auth/signup')
        .withBody(validAuthCreds)
        .expectStatus(HttpStatus.CREATED);
      });
      

      // Shouldn't be able to sign up with an existing email

      // Shouldn't be able to sign up without strong password

      // Shouldn't be able to sign up without valid email


    });


    // Login
    describe('Login', () => {

    });

  })

  // User
  describe('User', () => {
    
    // Get me
    describe('Get user', () => {

    })

    // Edit
    describe('Edit user', () => {

    })
    

  })


  // Bookmars
  describe('Bookmarks', () => {

    // Create a bookmark
    describe('Create bookmark', () => {

    });

    // Update bookmark
    describe('Update bookmark', () => {

    })

    // Get bookmarks
    describe('Get bookmarks', () => {

    })

    // Get bookmark by id
    describe('Get bookmark by id', () => {

    })

    // Delete bookmark
    describe('Delete bookmark', () => {

    })

  })
  

  ////////////////////////////////////////////
  // Clean up ////////////////////////////////
  ////////////////////////////////////////////

  afterAll(() => {
    app.close();
  })



})

