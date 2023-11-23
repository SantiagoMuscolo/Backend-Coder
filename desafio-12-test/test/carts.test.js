const chai = require('chai');
const supertest = require('supertest');
const app = require('../src/index.js');
const expect = chai.expect;
const request = supertest(app);

describe('Carts Router', () => {
  it('debería obtener todos los carritos', (done) => {
    request.get('/api/carts')
      .set('Authorization', 'Bearer token_de_prueba')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('debería crear un nuevo carrito', (done) => {
    request.post('/api/carts')
      .set('Authorization', 'Bearer token_de_prueba')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('cartId');
        done();
      });
  });

  it('debería obtener los productos del carrito', (done) => {
    const cartId = res.body.cartId;

    request.get(`/api/carts/${cartId}`)
      .set('Authorization', 'Bearer token_de_prueba')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('debería agregar un nuevo producto al carrito', (done) => {
    const productId = res.body.productId;

    request.post('/api/carts/products')
      .set('Authorization', 'Bearer token_de_prueba')
      .send({ id: productId })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('message', 'Producto subido exitosamente!');
        done();
      });
  });

  it('debería eliminar un producto del carrito', (done) => {
    const cartId = res.body.cartId;
    const productId = res.body.productId;


    request.delete(`/api/carts/${cartId}/products/${productId}`)
      .set('Authorization', 'Bearer token_de_prueba')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('message', 'Producto eliminado exitosamente');
        done();
      });
  });

  it('debería eliminar todos los productos del carrito', (done) => {
    const cartId = 'tu_id_de_carrito';

    request.delete(`/api/carts/${cartId}`)
      .set('Authorization', 'Bearer token_de_prueba')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('message', 'Productos eliminados exitosamente');
        done();
      });
  });

  it('debería actualizar la cantidad de un producto en el carrito', (done) => {
    const cartId = res.body.cartId;
    const productId = res.body.productId;

    request.put(`/api/carts/${cartId}/products/${productId}`)
      .set('Authorization', 'Bearer token_de_prueba')
      .send({ quantity: 2 })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('message', 'Cantidad de producto actualizada exitosamente');
        done();
      });
  });

  it('debería realizar una compra', (done) => {
    const cartId = res.body.cartId;

    request.put(`/api/carts/${cartId}/purchase`)
      .set('Authorization', 'Bearer tu_token_de_prueba')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('message', 'Compra realizada con éxito');
        done();
      });
  });
});