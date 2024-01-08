const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app');
const productFactory = require('./productFactory');


describe('/api/products routes', function () {

  this.beforeEach(async function () {
    await productFactory.dropProductAndCategory();

    let category = await productFactory.createCategory("Dreamzz");
    let product1 = await productFactory.createProduct('Moto de reve', 'Lego de 567 pieces', 39.00);
    let product2 = await productFactory.createProduct('Super mechant de reve', 'Lego de 345 pieces', 29.99);
    let product3 = await productFactory.createProduct('Blob Z', 'Lego de 897 pieces', 119.99);
    await productFactory.addCategoryToProduct(category.rows[0].id, product1.rows[0].id);
    await productFactory.addCategoryToProduct(category.rows[0].id, product2.rows[0].id);
    await productFactory.addCategoryToProduct(category.rows[0].id, product3.rows[0].id);
  });

  this.afterAll(async function() {
    await productFactory.dropProductAndCategory();
  });

  describe('GET /products/{productId}', function () {
    it('returns a single product object', function () {
      return request(app)
        .get(`/api/products/1`)
        .expect(200)
        .then((response) => {
          const product = response.body;
          expect(product).to.be.an.instanceOf(Object);
          expect(product).to.not.be.an.instanceOf(Array);
        });
    });

    it('returns a full product object', function () {
      return request(app)
        .get(`/api/products/1`)
        .expect(200)
        .then((response) => {
          let product = response.body;
          expect(product).to.have.ownProperty('id');
          expect(product).to.have.ownProperty('name');
          expect(product).to.have.ownProperty('description');
          expect(product).to.have.ownProperty('price');
        });
    });

    it('returned product has the correct id', async function () {
      return request(app)
        .get(`/api/products/1`)
        .expect(200)
        .then((response) => {
          let product = response.body;
          expect(product.id).to.equal(1);
        });
    });

    it('called with a non-numeric ID returns a 400 error', async function () {
      return request(app)
        .get('/api/products/notAnId')
        .expect(400);
    });

    it('called with an invalid ID returns a 404 error', async function () {
      return request(app)
        .get('/api/products/450')
        .expect(404);
    });

  }),

    describe('GET /products?category={categoryId}', function () {


      it('returns an array of all products of the category 1', async function () {
        return request(app)
          .get('/api/products?category=1')
          .expect(200)
          .then((response) => {
            expect(response.body.length).to.be.equal(3);
            response.body.forEach((product) => {
              expect(product).to.have.ownProperty('id');
              expect(product).to.have.ownProperty('name');
              expect(product).to.have.ownProperty('description');
              expect(product).to.have.ownProperty('price');
            });
          });
      });

      it('called with a non-numeric ID returns a 400 error', function () {
        return request(app)
          .get('/api/products?category=notAnId')
          .expect(400);
      });

      it('called with an empty ID returns a 400 error', function () {
        return request(app)
          .get('/api/products?category=')
          .expect(400);
      });

    });

});