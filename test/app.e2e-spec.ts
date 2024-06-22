import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import * as pactum from 'pactum';
import {
  getUserToken,
  invalidEmailCreds,
  invalidPasswordCreds,
  nonExistentAccountCreds,
  testUser2Creds,
  validAuthCreds,
  wrongPasswordCreds,
} from './auth';
import { editUserBody } from './user';
import { SignUpDto } from 'src/auth/dto';
import { createBookmarkBody, editBookmarkBody } from './bookmark';

const baseUrl = 'http://localhost:3333';

describe('App (e2e)', () => {
  ////////////////////////////////////////////
  // INIT ////////////////////////////////////
  ////////////////////////////////////////////

  let app: INestApplication;
  let prisma: DatabaseService;
  let user1Id: number;

  // Helper function to register a user
  const registerUser = async (creds: SignUpDto, tokenName: string) => {
    const signUpUrl = `${baseUrl}/auth/signup`;
    await pactum
      .spec()
      .post(signUpUrl)
      .withBody(creds)
      .stores(tokenName, 'access_token');
  };

  // Helper function to create a bookmark
  const createBookmark = async (tokenName: string) => {
    const createBookmarkUrl = `${baseUrl}/bookmarks/create`;

    await pactum
      .spec()
      .post(createBookmarkUrl)
      .withBody({
        title: `${tokenName}'s bookmark`,
        link: 'https://www.google.com',
      })
      .withBearerToken('$S{user2Token}')
      .stores(`${tokenName}_bookmark`, 'id')
      .expectStatus(HttpStatus.CREATED);
  };

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

    // Seed db with test users
    await registerUser(testUser2Creds, 'user2Token');

    // Create bookmark for test user 2
    await createBookmark('user2Token');
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
          .stores('user1Token', 'access_token');
      });
    });
  });

  // User
  describe('User', () => {
    const userUrl = `${baseUrl}/users`;

    // Get me
    describe('Get user', () => {
      const getUserUrl = userUrl + '/me';

      it('Should get current user', async () => {
        user1Id = await pactum
          .spec()
          .get(getUserUrl)
          .withBearerToken('$S{user1Token}')
          .expectStatus(HttpStatus.OK)
          .stores('user1Id', 'id')
          .returns('id');
      });

      // Shouldn't be able to get user without access token
      it("Shouldn't be able to get user without access token", () => {
        return pactum
          .spec()
          .get(getUserUrl)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
    });

    // Edit
    describe('Edit user', () => {
      const editUserUrl = `${userUrl}/edit`;

      // Should be able to edit your own user
      it('Should be able to edit your own user', () => {
        return pactum
          .spec()
          .patch(editUserUrl)
          .withBearerToken('$S{user1Token}')
          .withBody(editUserBody)
          .expectStatus(HttpStatus.OK);
      });

      // Shouldn't be able to edit without an auth token
      it(" Shouldn't be able to edit without an auth token", () => {
        return pactum
          .spec()
          .patch(editUserUrl)
          .withBody(editUserBody)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  // Bookmars
  describe('Bookmarks', () => {
    const bookmarksUrl = `${baseUrl}/bookmarks`;

    // Create a bookmark
    describe('Create bookmark', () => {
      const createBookmarksUrl = `${bookmarksUrl}/create`;

      // Shouldn't be able to create a bookmark without a token
      it("Shouldn't be able to create a bookmark without a token", () => {
        return pactum
          .spec()
          .post(createBookmarksUrl)
          .withBody(createBookmarkBody)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      // Should be able to create a bookmark with a token
      it('Should be able to create a bookmark with a token', () => {
        return pactum
          .spec()
          .post(createBookmarksUrl)
          .withBody(createBookmarkBody)
          .withBearerToken('$S{user1Token}')
          .expectStatus(HttpStatus.CREATED)
          .stores('user1Token_bookmark', 'id');
      });
    });

    // Update bookmark
    describe('Update bookmark', () => {
      const updateBookmarkUrl = `${bookmarksUrl}/edit`;

      // Should be able to edit a bookmark that the user owns
      it('Should be able to edit a bookmark that the user owns', () => {
        return pactum
          .spec()
          .patch(`${updateBookmarkUrl}/$S{user1Token_bookmark}`)
          .withBody(editBookmarkBody)
          .withBearerToken('$S{user1Token}')
          .expectStatus(HttpStatus.OK);
      });

      // Shouldn't be able to edit a bookmark that the user doesn't own 401
      it("Shouldn't be able to edit a bookmark that the user doesn't own 401", () => {
        return pactum
          .spec()
          .patch(`${updateBookmarkUrl}/$S{user2Token_bookmark}`)
          .withBody(editBookmarkBody)
          .withBearerToken('$S{user1Token}')
          .expectStatus(HttpStatus.UNAUTHORIZED)
          .inspect();
      });

      // Shouldn't be able to edit a bookmark that doesn't exist 400
      it("Shouldn't be able to edit a bookmark that doesn't exist", () => {
        return pactum
          .spec()
          .patch(`${updateBookmarkUrl}/100`)
          .withBody(editBookmarkBody)
          .withBearerToken('$S{user1Token}')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
    });

    // Get bookmarks
    describe('Get bookmarks', () => {
      const getBookmarksUrl = `${bookmarksUrl}/all`;

      // Shouldn't be able to call this route without an auth token
      it("Shouldn't be able to call this route without an auth token", () => {
        return pactum
          .spec()
          .get(getBookmarksUrl)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      // Should be able to get the bookmarks that the user owns
      it('Should be able to get the bookmarks that the user owns', async () => {
        const bookmarks = await pactum
          .spec()
          .get(getBookmarksUrl)
          .withBearerToken('$S{user1Token}')
          .returns('res.body');

        const someBookmarkDoesntBelong = bookmarks.some(
          (bookmark) => bookmark.userId !== user1Id,
        );

        if (someBookmarkDoesntBelong) {
          throw new Error('Got bookmark that doesnt belong to user');
        }
      });
    });

    // Get bookmark by id
    describe('Get bookmark by id', () => {
      const getBookmarkUrl = `${bookmarksUrl}/get`;

      // Should be able to get a bookmark that the user owns
      it('Should be able to get a bookmark that the user owns', () => {
        return pactum
          .spec()
          .get(`${getBookmarkUrl}/$S{user1Token_bookmark}`)
          .withBearerToken('$S{user1Token}')
          .expectStatus(HttpStatus.OK);
      });

      // Shouldn't be able to get another users bookmark
      it("Shouldn't be able to get another users bookmark", () => {
        return pactum
          .spec()
          .get(`${getBookmarkUrl}/$S{user2Token_bookmark}`)
          .withBearerToken('$S{user1Token}')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
    });

    // Delete bookmark
    describe('Delete bookmark', () => {
      const deleteBookmarkUrl = `${bookmarksUrl}/delete`;

      // Shouldn't be able to delete a bookmark without a token
      it("Shouldn't be able to delete a bookmark without a token", () => {
        return pactum
          .spec()
          .delete(`${deleteBookmarkUrl}/$S{user1Token_bookmark}`)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      // Should be able to delete a bookmark that this user owns
      it('Should be able to delete a bookmark that this user owns', () => {
        return pactum
          .spec()
          .delete(`${deleteBookmarkUrl}/$S{user1Token_bookmark}`)
          .withBearerToken('$S{user1Token}')
          .expectStatus(HttpStatus.OK)
          .inspect();
      });

      // Shouldn't be able to delete a bookmark that this user doesn't own
      it("Shouldn't be able to delete a bookmark that this user doesn't own", () => {
        return pactum
          .spec()
          .delete(`${deleteBookmarkUrl}/$S{user2Token_bookmark}`)
          .withBearerToken('$S{user1Token}')
          .expectStatus(HttpStatus.UNAUTHORIZED)
          .inspect();
      });
    });
  });

  ////////////////////////////////////////////
  // Clean up ////////////////////////////////
  ////////////////////////////////////////////

  afterAll(() => {
    app.close();
  });
});
