const chai = require('chai');
const supertest = require('supertest');
const app = require('../src/index.js');

const expect = chai.expect;
const request = supertest(app);

describe('Router de Productos', () => {
  it('debería obtener todos los productos', (done) => {
    request.get('/api/products')
      .set('Authorization', 'Bearer tu_token_de_prueba')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('debería obtener un producto específico por ID', (done) => {
    const productId = res.body.productId;

    request.get(`/api/products/${productId}`)
      .set('Authorization', 'Bearer tu_token_de_prueba')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('productId', productId);
        done();
      });
  });

  it('debería agregar un nuevo producto', (done) => {
    const newProduct = {
      title: 'Nuevo Producto',
      description: 'Descripción del nuevo producto',
      price: 19.99,
      code: '12345',
      stock: 50,
    };

    request.post('/api/products')
      .set('Authorization', 'Bearer tu_token_de_prueba')
      .send(newProduct)
      .expect(201)
      .end((err, res) => {
        expect(res.body).to.have.property('productId');
        done();
      });
  });

  it('debería actualizar un producto existente', (done) => {
    const productId = res.body.productId;
    const updatedProduct = {
      title: 'Producto Actualizado',
      price: 29.99,
    };

    request.put(`/api/products/${productId}`)
      .set('Authorization', 'Bearer tu_token_de_prueba')
      .send(updatedProduct)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('productId', productId);
        expect(res.body).to.have.property('title', updatedProduct.title);
        expect(res.body).to.have.property('price', updatedProduct.price);
        done();
      });
  });

  it('debería eliminar un producto existente', (done) => {
    const productId = res.body.productId;

    request.delete(`/api/products/${productId}`)
      .set('Authorization', 'Bearer tu_token_de_prueba')
      .expect(204) 
      .end((err, res) => {
        done();
      });
  });
});
