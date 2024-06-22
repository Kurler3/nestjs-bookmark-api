import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import * as pactum from 'pactum';
import {
  invalidEmailCreds,
  invalidPasswordCreds,
  nonExistentAccountCreds,
  validAuthCreds,
  wrongPasswordCreds,
} from './auth';
import { editUserBody } from './user';

const baseUrl = 'http://localhost:3333';

describe('App (e2e)', () => {
  ////////////////////////////////////////////
  // INIT ////////////////////////////////////
  ////////////////////////////////////////////

  let app: INestApplication;
  let prisma: DatabaseService;

  // Init app module
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

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
      const signUpUrl = `${baseUrl}/auth/signup`;

      // Should be able to sign up
      it('Should be able to sign up', () => {
        return pactum
          .spec()
          .post(signUpUrl)
          .withBody(validAuthCreds)
          .expectStatus(HttpStatus.CREATED);
      });

      // Shouldn't be able to sign up with an existing email
      it("Shouldn't be able to sign up with an existing email", () => {
        return pactum
          .spec()
          .post(signUpUrl)
          .withBody(validAuthCreds)
          .expectStatus(HttpStatus.FORBIDDEN);
      });

      // Shouldn't be able to sign up without strong password
      it("Shouldn't be bale to sign up without strong password", () => {
        return pactum
          .spec()
          .post(signUpUrl)
          .withBody(invalidPasswordCreds)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      // Shouldn't be able to sign up without valid email
      it("Shouldn't be able to sign up without valid email", () => {
        return pactum
          .spec()
          .post(signUpUrl)
          .withBody(invalidEmailCreds)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
    });

    // Login
    describe('Login', () => {
      const loginUrl = `${baseUrl}/auth/login`;

      // Shouldn't be able to login with non existing account (wrong email)
      it("Shouldn't be able to login with non existing account (wrong email)", () => {
        return pactum
          .spec()
          .post(loginUrl)
          .withBody(nonExistentAccountCreds)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      // Shouldn't be able to login without correct password
      it("Shouldn't be able to login without correct password", () => {
        return pactum
          .spec()
          .post(loginUrl)
          .withBody(wrongPasswordCreds)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      // Should be able to login with correct credentials
      it('Should be able to login with correct credentials', () => {
        return pactum
          .spec()
          .post(loginUrl)
          .withBody(validAuthCreds)
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'access_token');
      });
    });
  });

  // User
  describe('User', () => {
    const userUrl = `${baseUrl}/users`;

    // Get me
    describe('Get user', () => {

      const getUserUrl = userUrl + '/me';

      it('Should get current user', () => {
        return pactum
        .spec()
        .get(getUserUrl)
        .withBearerToken('$S{userAt}')
        .expectStatus(HttpStatus.OK)
        .inspect()
      })

      // Shouldn't be able to get user without access token
      it('Shouldn\'t be able to get user without access token', () => {
        return pactum
        .spec()
        .get(getUserUrl)
        .expectStatus(HttpStatus.UNAUTHORIZED);
      })

    });

    // Edit
    describe('Edit user', () => {

        const editUserUrl = `${userUrl}/edit`

        // Should be able to edit your own user
        it('Should be able to edit your own user', () => {

            return pactum
            .spec()
            .patch(editUserUrl)
            .withBearerToken('$S{userAt}')
            .withBody(editUserBody)
            .expectStatus(HttpStatus.OK)
        })

        // Shouldn't be able to edit without an auth token
        it(' Shouldn\'t be able to edit without an auth token', () => {
          return pactum
          .spec()
          .patch(editUserUrl)
          .withBody(editUserBody)
          .expectStatus(HttpStatus.UNAUTHORIZED)
      })

    });
  });

  //TODO Bookmars
  describe('Bookmarks', () => {

    // Create a bookmark
    describe('Create bookmark', () => {});

    // Update bookmark
    describe('Update bookmark', () => {});

    // Get bookmarks
    describe('Get bookmarks', () => {});

    // Get bookmark by id
    describe('Get bookmark by id', () => {});

    // Delete bookmark
    describe('Delete bookmark', () => {});
    
  });

  ////////////////////////////////////////////
  // Clean up ////////////////////////////////
  ////////////////////////////////////////////

  afterAll(() => {
    app.close();
  });
});
