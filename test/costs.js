let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let expect = chai.expect;

let User = require('../models/user');
let Cost = require('../models/cost');

chai.use(chaiHttp);

describe('Costs', () => {
    describe('/GET costs', () => {
        it('it should return empty object when no cost exists.', (done) => {
			chai.request(app)
            .get('/users/:userid/costs')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
		});
    });
    describe('/POST costs', () => {
        it('it should return object when no cost exists', (done) => {
			chai.request(app)
            .post('/users/:userid/costs')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
		});
    });
    describe('/GET costs/:costid', () => {
        it('it should return empty object when no cost exists.', (done) => {
			chai.request(app)
            .get('/users/:userid/costs/:costid')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
		});
    });
    describe('/PUT costs/:costid', () => {
        it('it should update specific cost', (done) => {
			chai.request(app)
            .put('/users/:userid/costs/:costid')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
		});
    });
    describe('/DELETE costs/:costid', () => {
        it('it should delete specific cost', (done) => {
			chai.request(app)
            .delete('/users/:userid/costs/:costid')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
		});
    });
});