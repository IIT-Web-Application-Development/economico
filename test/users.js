let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let expect = chai.expect;
var bcrypt = require('bcrypt');

let User = require('../models/user');
let Cost = require('../models/cost');

chai.use(chaiHttp);

describe('Users', () => {
    beforeEach((done) => {
		User.remove({}, (err) => {
			done();
		});
	});
    describe('/GET users', () => {
        it('it should return empty array when no user exists.', (done) => {
			chai.request(app)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
        });
        it('it should return access denied for unauthorized user.', (done) => {
			chai.request(app)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                done();
            });
        });
        it('it should return all users', (done) => {
			var user = new User({
				_id: 'testuser',
                name: 'test',
                pass: '123',
                limit: 100,
                email: 'a@a.com',
                costs: [],
                total: 10
			});
			user.save();
			chai.request(app)
				.get('/users')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					let returnedUser = res.body[0];
					returnedUser.name.should.be.eql(user.name);
					returnedUser.email.should.be.eql(user.email);
					done();
				});
		});
    });
    describe('/GET users/:userid', () => {
        it('it should return empty object when no user exists.', (done) => {
			chai.request(app)
            .get('/users/:userid')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
        });
        it('it should return access denied for unauthorized user.', (done) => {
			chai.request(app)
            .get('/users/:userid')
            .end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });
        it('it should get a specific user', (done) => {
			var user = new User({
				_id: 'testuser',
                name: 'test',
                pass: '123',
                limit: 100,
                email: 'a@a.com',
                costs: [],
                total: 10
			});
			user.save();
			chai.request(app)
				.get('/users/' + user._id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					done();
				});
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
        it('it should create a user', (done) => {
            var p;
            bcrypt.hash('123', 10, function(err, hash) {
                if (err) {
                    console.log(err);
                  return next(err);
                }
                p = hash;
                next();
            });
            var user={
                _id: 'testuser',
                name: 'test',
                pass: p,
                limit: 100,
                email: 'a@a.com',
                costs: [],
                total: 10
            };
			chai.request(app)
				.post('/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
                    res.body.should.be.a('object');
                    USer.find({_id: user._id}).exec((err, users) => {
						users.should.be.a('object');
						done();
				    });
				});
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
        it('it should update a specific user', (done) => {
			var user = new User({
				_id: 'testuser',
                name: 'test',
                pass: '123',
                limit: 100,
                email: 'a@a.com',
                costs: [],
                total: 10
			});
			var updatedUser = user;
			user.save();
			updatedUser.name = "nameUpdated";
			chai.request(app)
				.put('/users/' + user._id)
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
				});
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
        it('it should delete a specific user', (done) => {
			var user = new User({
				_id: 'testuser',
                name: 'test',
                pass: '123',
                limit: 100,
                email: 'a@a.com',
                costs: [],
                total: 10
			});
			user.save();
			chai.request(app)
				.delete('/users/' + user._id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					User.find({}).exec((err, users) => {
						res.body.should.be.a('object');
						done();
				    });
				});
		});
    });
});