const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app');
const userFactory = require('./userFactory');


describe('/api/users routes', function () {

  this.beforeEach(async function () {
    await userFactory.dropUser();
    await userFactory.createUser('user1', 'password1');
    await userFactory.createUser('user2', 'password2');
    await userFactory.createUser('user3', 'password3');
  });

  describe('GET /users', function () {
    it('returns an array of all users', async function () {
      return request(app)
        .get('/api/users/')
        .expect(200)
        .then((response) => {
          expect(response.body.length).to.be.equal(3);
          response.body.forEach((user) => {
            expect(user).to.have.ownProperty('id');
            expect(user).to.have.ownProperty('username');
            expect(user).to.have.ownProperty('password');
          });
        });
    });
  });

  describe('GET /users/{userId}', function () {
    it('returns a single user object', async function () {
      return request(app)
        .get(`/api/users/1`)
        .expect(200)
        .then((response) => {
          const user = response.body;
          expect(user).to.be.an.instanceOf(Object);
          expect(user).to.not.be.an.instanceOf(Array);
        });
    });

    it('returns a full user object', async function () {
      return request(app)
        .get(`/api/users/1`)
        .expect(200)
        .then((response) => {
          let user = response.body;
          expect(user).to.have.ownProperty('id');
          expect(user).to.have.ownProperty('username');
          expect(user).to.have.ownProperty('password');
        });
    });

    it('returned user has the correct id', async function () {
      return request(app)
        .get(`/api/users/1`)
        .expect(200)
        .then((response) => {
          let user = response.body;
          expect(user.id).to.equal(1);
        });
    });

    it('called with a non-numeric ID returns a 400 error', async function () {
      return request(app)
        .get('/api/users/notAnId')
        .expect(400);
    });

    it('called with an invalid ID returns a 404 error', async function () {
      return request(app)
        .get('/api/users/450')
        .expect(404);
    });

  })

  describe('POST /users/register', function () {
    it('should add a new user if all supplied information is correct', async function () {
      let initialUsersArray;
      let newUserObject = {
        username: 'Bob',
        password: 'minion',
      }
      return request(app)
        .get('/api/users')
        .then((response) => {
          initialUsersArray = response.body;
        })
        .then(() => {
          return request(app)
            .post('/api/users/register')
            .send(newUserObject)
            .expect(201);
        })
        .then((response) => response.body)
        .then((createdUsers) => {
          newUserObject.id = createdUsers.id;
          newUserObject.created_at = createdUsers.created_at;
          expect(newUserObject).to.be.deep.equal(createdUsers);
        });
    });
  });

  describe('POST /login', function () {
  });

  describe('PUT /users/{userId}', function () {
    it('updates the correct user and returns it', async function () {
      let initialUser;
      let updatedUserInfo;
      return request(app)
        .get('/api/users/1')
        .then((response) => {
          initialUser = response.body
        })
        .then(() => {
          updatedUserInfo = Object.assign({}, initialUser, { password: '12345' });
          return request(app)
            .put('/api/users/1')
            .send(updatedUserInfo);
        })
        .then((response) => {
          expect(response.body).to.be.deep.equal(updatedUserInfo);
        });
    });

    it('updates the correct user and persists to the database', async function () {
      let initialUser;
      let updatedUserInfo;
      return request(app)
        .get('/api/users/1')
        .then((response) => {
          initialUser = response.body
        })
        .then(() => {
          updatedUserInfo = Object.assign({}, initialUser, { password: 'azerty' });
          return request(app)
            .put('/api/users/1')
            .send(updatedUserInfo);
        })
        .then(() => {
          return request(app)
            .get('/api/users/1');
        })
        .then((response) => response.body)
        .then(userFromDatabase => {
          expect(userFromDatabase.password).to.equal('azerty');
        });
    });

    it('called with a non-numeric ID returns a 400 error', function () {
      return request(app)
        .put('/api/users/notAnId')
        .expect(400);
    });

    it('called with an invalid ID returns a 404 error', function () {
      return request(app)
        .put('/api/users/450')
        .expect(404);
    });

    it('called with an invalid ID does not change the database array', function () {
      let initialUsersArray;
      return request(app)
        .get('/api/users')
        .then((response) => {
          initialUsersArray = response.body;
        })
        .then(() => {
          return request(app)
            .put('/api/users/notAnId')
            .send({ key: 'value' });
        })
        .then(() => {
          return request(app).get('/api/users');
        })
        .then((afterPutResponse) => {
          let postRequestUserArray = afterPutResponse.body;
          expect(initialUsersArray).to.be.deep.equal(postRequestUserArray);
        });
    });
  });
});