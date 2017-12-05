let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let expect = chai.expect;

let User = require('../models/user');
let Cost = require('../models/cost');

chai.use(chaiHttp);

describe('Users', () => {
    describe('/GET users', () => {
        it('it should return empty array when no user exists.', (done) => {
			chai.request(app)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
		});
    });
    describe('/GET users', () => {
        it('it should return access denied for unauthorized user.', (done) => {
			chai.request(app)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(403);
                done();
            });
		});
    });
    describe('/POST users', () => {
        it('it should return userid', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/POST users', () => {
        it('it should return access denied for unauthorized user.', (done) => {
			chai.request(app)
            .post('/users')
            .end((err, res) => {
                res.should.have.status(403);
                done();
            });
		});
    });
    describe('/GET users/:userid', () => {
        it('it should return empty object when no user exists.', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/GET users/:userid', () => {
        it('it should return access denied for unauthorized user.', (done) => {
			chai.request(app)
            .get('/users/:userid')
            .end((err, res) => {
                res.should.have.status(403);
                done();
            });
		});
    });
    describe('/PUT users/:userid', () => {
        it('it should update specific user', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/PUT users/:userid', () => {
        it('it should return access denied for unauthorized user.', (done) => {
			chai.request(app)
            .put('/users/:userid')
            .end((err, res) => {
                res.should.have.status(403);
                done();
            });
		});
    });
    describe('/DELETE users/:userid', () => {
        it('it should delete specific user', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/DELETE users/:userid', () => {
        it('it should return access denied for unauthorized user.', (done) => {
			chai.request(app)
            .delete('/users/:userid')
            .end((err, res) => {
                res.should.have.status(403);
                done();
            });
		});
    });
});