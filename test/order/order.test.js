const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app');
const orderFactory = require('./orderFactory');
const userFactory = require('../user/userFactory');
const productFactory = require('../product/productFactory');


describe('/api/orders routes', function () {

  this.beforeEach(async function () {
    await orderFactory.dropOrder();
    await productFactory.dropProductAndCategory();
    await userFactory.dropUser();

    let user1 = await userFactory.createUser('user1', 'password1');

    let category = await productFactory.createCategory("Dreamzz");
    let product1 = await productFactory.createProduct('Moto de reve', 'Lego de 567 pieces', 39.00);
    let product2 = await productFactory.createProduct('Super mechant de reve', 'Lego de 345 pieces', 29.99);
    let product3 = await productFactory.createProduct('Blob Z', 'Lego de 897 pieces', 119.99);
    await productFactory.addCategoryToProduct(category.rows[0].id, product1.rows[0].id);
    await productFactory.addCategoryToProduct(category.rows[0].id, product2.rows[0].id);
    await productFactory.addCategoryToProduct(category.rows[0].id, product3.rows[0].id);

    let order1 = await orderFactory.createOrder(user1.rows[0].id, 39.00, 'PENDING');
    let order2 = await orderFactory.createOrder(user1.rows[0].id, 149.98, 'PENDING');
    orderFactory.addProductToOrder(order1.rows[0].id, product1.rows[0].id);
    orderFactory.addProductToOrder(order2.rows[0].id, product2.rows[0].id);
    orderFactory.addProductToOrder(order2.rows[0].id, product3.rows[0].id);

  });

  this.afterAll(async function () {
    await orderFactory.dropOrder();
    await productFactory.dropProductAndCategory();
    await userFactory.dropUser();
  });

  describe('GET /orders/{orderId}', function () {
    it('returns a single order object', async function () {
      return request(app)
        .get(`/api/orders/1`)
        .expect(200)
        .then((response) => {
          const order = response.body;
          expect(order).to.be.an.instanceOf(Object);
          expect(order).to.not.be.an.instanceOf(Array);
        });
    });

    it('returns a full order object', async function () {
      return request(app)
        .get(`/api/orders/1`)
        .expect(200)
        .then((response) => {
          let order = response.body;
          expect(order).to.have.ownProperty('id');
          expect(order).to.have.ownProperty('users_id');
          expect(order).to.have.ownProperty('total');
          expect(order).to.have.ownProperty('created_at');
          expect(order).to.have.ownProperty('status');
          expect(order.products.length).to.be.equal(1);
        });
    });

    it('returned order has the correct id', async function () {
      return request(app)
        .get(`/api/orders/1`)
        .expect(200)
        .then((response) => {
          let order = response.body;
          expect(order.id).to.equal(1);
        });
    });

    it('called with a non-numeric ID returns a 400 error', async function () {
      return request(app)
        .get('/api/orders/notAnId')
        .expect(400);
    });

    it('called with an invalid ID returns a 404 error', async function () {
      return request(app)
        .get('/api/orders/450')
        .expect(404);
    });

  }),

    describe('GET /orders', function () {


      it('returns an array of all orders', async function () {
        return request(app)
          .get('/api/orders?user=1')
          .expect(200)
          .then((response) => {
            expect(response.body.length).to.be.equal(2);
            response.body.forEach((order) => {
              expect(order).to.have.ownProperty('id');
              expect(order).to.have.ownProperty('users_id');
              expect(order).to.have.ownProperty('total');
              expect(order).to.have.ownProperty('created_at');
              expect(order).to.have.ownProperty('status');
            });
          });
      });

    });

  describe('PUT /orders/{orderId}', function () {
    it('updates the correct order and returns it', async function () {
      let initialOrder;
      let updatedOrder;
      return request(app)
        .get('/api/orders/1')
        .then((response) => {
          initialOrder = response.body
        })
        .then(() => {
          updatedOrder = Object.assign({}, initialOrder, { status: 'COMPLETE' });
          return request(app)
            .put('/api/orders/1')
            .send(updatedOrder);
        })
        .then((response) => {
          expect(response.body).to.be.deep.equal(updatedOrder);
        });
    });

    it('updates the correct order and persists to the database', async function () {
      let initialOrder;
      let updatedOrder;
      return request(app)
        .get('/api/orders/1')
        .then((response) => {
          initialOrder = response.body
        })
        .then(() => {
          updatedOrder = Object.assign({}, initialOrder, { status: 'COMPLETE' });
          return request(app)
            .put('/api/orders/1')
            .send(updatedOrder);
        })
        .then(() => {
          return request(app)
            .get('/api/orders/1');
        })
        .then((response) => response.body)
        .then(userFromDatabase => {
          expect(userFromDatabase.status).to.equal('COMPLETE');
        });
    });

    it('called with a non-numeric ID returns a 400 error', function () {
      return request(app)
        .put('/api/orders/notAnId')
        .expect(400);
    });

    it('called with an invalid ID returns a 404 error', function () {
      return request(app)
        .put('/api/orders/450')
        .expect(404);
    });

    it('called with an invalid ID does not change the database array', async function () {
      let initialOrdersArray;
      return request(app)
        .get('/api/orders')
        .then((response) => {
          initialOrdersArray = response.body;
        })
        .then(() => {
          return request(app)
            .put('/api/orders/notAnId')
            .send({ key: 'value' });
        })
        .then(() => {
          return request(app).get('/api/orders');
        })
        .then((afterPutResponse) => {
          let postRequestUserArray = afterPutResponse.body;
          expect(initialOrdersArray).to.be.deep.equal(postRequestUserArray);
        });
    });
  });

});