const chai = require('chai');
const supertest = require('supertest');
const app = require('../src/index.js');
const expect = chai.expect;
const request = supertest(app);

describe('Sessions Router', () => {
  it('debería registrar un usuario', (done) => {
    request.post('/api/sessions/register')
      .set('Authorization', 'Bearer token_de_prueba')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('status', 'OK');
        expect(res.body).to.have.property('message', 'Usuario registrado');
        done();
      });
  });

  it('debería iniciar sesión', (done) => {
    request.post('/api/sessions/login')
      .set('Authorization', 'Bearer token_de_prueba')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('status', 200);
        expect(res.body).to.have.property('message', 'Usuario registrado');
        done();
      });
  });

  it('debería solicitar restablecimiento de contraseña', (done) => {
    request.post('/api/sessions/forgot-password')
      .set('Authorization', 'Bearer token_de_prueba')
      .send({ email: 'ejemplo@dominio.com' })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('message', 'Correo de restablecimiento enviado con éxito');
        done();
      });
  });

  it('debería obtener información del usuario actual', (done) => {
    request.use('/api/sessions/current')
      .set('Authorization', 'Bearer token_de_prueba')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('nombre');
        expect(res.body).to.have.property('correo');
        done();
      });
  });

  it('debería cerrar sesión', (done) => {
    request.post('/api/sessions/logout')
      .set('Authorization', 'Bearer tu_token_de_prueba')
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});
