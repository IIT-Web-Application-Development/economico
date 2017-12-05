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
    describe('/POST costs', () => {
        it('it should return access denied for unauthorized user.', (done) => {
			chai.request(app)
            .post('/costs')
            .end((err, res) => {
                res.should.have.status(403);
                done();
            });
		});
    });
    describe('/GET costs/:costid', () => {
        it('it should return empty object when no cost exists.', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/GET costs/:costid', () => {
        it('it should return access denied for unauthorized user.', (done) => {
			chai.request(app)
            .get('/costs/:costid')
            .end((err, res) => {
                res.should.have.status(403);
                done();
            });
		});
    });
    describe('/PUT costs/:costid', () => {
        it('it should update specific cost', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/PUT costs/:costid', () => {
        it('it should return access denied for unauthorized user.', (done) => {
			chai.request(app)
            .put('/costs/:costid')
            .end((err, res) => {
                res.should.have.status(403);
                done();
            });
		});
    });
    describe('/DELETE costs/:costid', () => {
        it('it should delete specific cost', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/DELETE costs/:costid', () => {
        it('it should return access denied for unauthorized user.', (done) => {
			chai.request(app)
            .delete('/costs/:costid')
            .end((err, res) => {
                res.should.have.status(403);
                done();
            });
		});
    });
});