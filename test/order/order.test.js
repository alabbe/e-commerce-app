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

  this.afterAll(async function() {
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

});