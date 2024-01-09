const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app');
const cartFactory = require('./cartFactory');
const userFactory = require('../user/userFactory');
const productFactory = require('../product/productFactory');

let productId;

describe('/api/cart routes', function () {

  this.beforeEach(async function () {
    await cartFactory.dropCart();
    await productFactory.dropProductAndCategory();
    await userFactory.dropUser();

    let user1 = await userFactory.createUser('user1', 'password1');
    let user2 = await userFactory.createUser('user2', 'password2');

    let category = await productFactory.createCategory("Dreamzz");
    let product1 = await productFactory.createProduct('Moto de reve', 'Lego de 567 pieces', 39.00);
    let product2 = await productFactory.createProduct('Super mechant de reve', 'Lego de 345 pieces', 29.99);
    let product3 = await productFactory.createProduct('Blob Z', 'Lego de 897 pieces', 119.99);
    await productFactory.addCategoryToProduct(category.rows[0].id, product1.rows[0].id);
    await productFactory.addCategoryToProduct(category.rows[0].id, product2.rows[0].id);
    await productFactory.addCategoryToProduct(category.rows[0].id, product3.rows[0].id);
    productId = product3.rows[0].id;

    let user1Cart = await cartFactory.createCart(user1.rows[0].id);
    cartFactory.addProductToCart(user1Cart.rows[0].id, product1.rows[0].id, 1);
    cartFactory.addProductToCart(user1Cart.rows[0].id, product2.rows[0].id, 1);

  });

  this.afterAll(async function () {
    await cartFactory.dropCart();
    await productFactory.dropProductAndCategory();
    await userFactory.dropUser();
  });

  describe('GET /cart?user={userId}', function () {
    it('returns a single Cart object of the user 1', async function () {
      return request(app)
        .get(`/api/cart?user=1`)
        .expect(200)
        .then((response) => {
          const cart = response.body;
          expect(cart).to.be.an.instanceOf(Object);
          expect(cart).to.not.be.an.instanceOf(Array);
        });
    });
  });

  describe('GET /cart/{cartId}', function () {
    it('returns a single Cart object', async function () {
      return request(app)
        .get(`/api/cart/1`)
        .expect(200)
        .then((response) => {
          const cart = response.body;
          expect(cart).to.be.an.instanceOf(Object);
          expect(cart).to.not.be.an.instanceOf(Array);
        });
    });

    it('returns a full Cart object', async function () {
      return request(app)
        .get(`/api/cart/1`)
        .expect(200)
        .then((response) => {
          let cart = response.body;
          expect(cart).to.have.ownProperty('id');
          expect(cart).to.have.ownProperty('users_id');
        });
    });

    it('returned order has the correct id', async function () {
      return request(app)
        .get(`/api/cart/1`)
        .expect(200)
        .then((response) => {
          let cart = response.body;
          expect(cart.id).to.equal(1);
        });
    });

    it('called with a non-numeric ID returns a 400 error', async function () {
      return request(app)
        .get('/api/cart/notAnId')
        .expect(400);
    });

    it('called with an invalid ID returns a 404 error', async function () {
      return request(app)
        .get('/api/cart/450')
        .expect(404);
    });

  });

  describe('POST /cart?user={userId}', function () {
    it('called with a non-numeric user ID returns a 400 error', async function () {
      return request(app)
        .post('/api/cart?user=notAnId')
        .expect(400);
    });

    it('called with an invalid user ID returns a 404 error', async function () {
      return request(app)
        .post('/api/cart?user=450')
        .expect(404);
    });

    it('should create a new cart and return it', async function () {
      return request(app)
        .post('/api/cart?user=2')
        .expect(201)
        .then((response) => response.body)
        .then((createdCart) => {
          expect(createdCart).to.have.ownProperty('id');
          expect(createdCart).to.have.ownProperty('users_id');
          expect(createdCart).to.have.ownProperty('created_at');
        });
    });

    it('should add a new cart if all supplied information is correct', async function () {
      let initialCart;
      let newCartObject = {
        users_id: 2
      }
      return request(app)
        .get('/api/cart?user=2')
        .then((response) => {
          initialCart = response.body;
        })
        .then(() => {
          return request(app)
            .post('/api/cart?user=2')
            .send(newCartObject)
            .expect(201);
        })
        .then((response) => response.body)
        .then((createdCart) => {
          newCartObject.id = createdCart.id;
          newCartObject.created_at = createdCart.created_at;
          expect(newCartObject).to.be.deep.equal(createdCart);
        });
    });

    it('should not create a new cart but return an existing one', async function () {

      return request(app)
        .post('/api/cart?user=1')
        .expect(200)
        .then((response) => response.body)
        .then((createdCart) => {
          expect(createdCart).to.have.ownProperty('id');
          expect(createdCart).to.have.ownProperty('users_id');
          expect(createdCart).to.have.ownProperty('created_at');
        });
    });

  });

  describe('POST /cart/products?user={userId}', function () {
    it('it should add a product in the cart', async function () {
      const productToAdd = {
        productId: productId,
        quantity: 2
      };
      return request(app)
        .post('/api/cart/products?user=1')
        .send(productToAdd)
        .expect(201)
        .then((response) => response.body)
        .then((newProduct) => {
          expect(newProduct).to.have.ownProperty('carts_id');
          expect(newProduct).to.have.ownProperty('products_id');
          expect(newProduct).to.have.ownProperty('quantity');
        });

    });
    it('called with a non-numeric user ID returns a 400 error', async function () {
      return request(app)
        .post('/api/cart/products?user=notAnId')
        .expect(400);
    });

    it('called with an invalid user ID returns a 404 error', async function () {
      return request(app)
        .post('/api/cart/products?user=450')
        .expect(404);
    });
  });

  describe('PUT /cart/products/{productId}?user={userId}', function () {
    it('updates the correct product item cart and returns it', async function () {
      let initialProduct;
      let updatedProduct;
      return request(app)
        .get('/api/cart/1?user=1')
        .then((response) => {
          initialProduct = response.body.products[0];
        })
        .then(() => {
          updatedProduct = Object.assign({}, initialProduct, { quantity: 10 });
          return request(app)
            .put('/api/cart/products/1?user=1')
            .send(updatedProduct);
        })
        .then((response) => {
          expect(response.body.quantity).to.be.equal(updatedProduct.quantity);
        });
    });

    it('updates the correct product item and persists to the database', async function () {
      let initialProduct;
      let updatedProduct;
      return request(app)
        .get('/api/cart/1?user=1')
        .then((response) => {
          initialProduct = response.body.products[0];
        })
        .then(() => {
          updatedProduct = Object.assign({}, initialProduct, { quantity: 10 });
          return request(app)
            .put('/api/cart/products/1?user=1')
            .send(updatedProduct);
        })
        .then(() => {
          return request(app)
            .get('/api/cart/1?user=1');
        })
        .then((response) => response.body.products[0])
        .then(productItemFromDatabase => {
          expect(productItemFromDatabase.quantity).to.equal(10);
        });
    });

    it('called with a non-numeric ID returns a 400 error', function () {
      return request(app)
        .put('/api/cart/products/notAnId?user=1')
        .expect(400);
    });

    it('called with an invalid ID returns a 404 error', function () {
      return request(app)
        .put('/api/cart/products/450?user=1')
        .expect(404);
    });
  });

  describe('DELETE /cart/products/{productId}?user={userId}', function () {
    it('deletes the correct product by id', async function() {
      let initialProductsArray;
      return request(app)
        .get('/api/cart?user=1')
        .then((response) => {
          initialProductsArray = response.body.products;
        })
        .then(() => {
          return request(app)
            .delete('/api/cart/products/1?user=1')
            .expect(204);
        })
        .then(() => {
          return request(app)
            .get('/api/cart?user=1');
        })
        .then((response) => response.body.products)
        .then((afterDeleteProductsArray) => {
          expect(afterDeleteProductsArray).to.not.be.deep.equal(initialProductsArray);
          let shouldBeDeletedProduct = afterDeleteProductsArray.find(el => el.id === '1');
          expect(shouldBeDeletedProduct).to.be.undefined;
        });

    });

    it('called with a non-numeric ID returns a 400 error', function() {
      return request(app)
        .delete('/api/cart/products/NotAnId?user=1')
        .expect(400);
    });

    it('called with an invalid ID returns a 404 error', function() {
      return request(app)
        .delete('/api/cart/products/340?user=1')
        .expect(404);
    });

  });

  /* 

  describe('POST /cart/{cartId}/checkout', function () {
    it('passer commmande', async function () {
      return expect(false).to.equal(true);
    });
  });
 */
});