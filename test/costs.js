let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let expect = chai.expect;

let User = require('../models/user');
let Cost = require('../models/cost');

chai.use(chaiHttp);

describe('Costs', () => {
    beforeEach((done) => {
		Cost.remove({}, (err) => {
			done();
		});
	});
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
        it('it should return all costs', (done) => {
			var cost = new Cost({
				_id: Date.now(),
                title: 'testTitle',
                description: 'testDescription',
                amount: 100,
                category: 'education',
                date: Date.now(),
                createdAt: Date.now()
			});
			cost.save();
			chai.request(app)
				.get('/users/:userid/costs')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					let returnedCosts = res.body[0];
					returnedCosts.title.should.be.eql(user.title);
					returnedCosts.description.should.be.eql(user.description);
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
        it('it should create a cost', (done) => {
            var user={
                _id: 'testusercost',
                name: 'testuser',
                pass: '123',
                limit: 100,
                email: 'a@a.com',
                costs: [],
                total: 10
            };
            var cost = {
				_id: Date.now(),
                title: 'testTitle',
                description: 'testDescription',
                amount: 100,
                category: 'education',
                date: Date.now(),
                createdAt: Date.now()
			};
			chai.request(app)
				.post('/users/:userid/costs')
				.send(cost)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					Cost.find({_id: cost._id}).exec((err, usere) => {
						users.should.be.a('object');
						done();
				    });
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
        it('it should get a specific cost', (done) => {
			var cost = new Cost({
				_id: Date.now(),
                title: 'testTitle',
                description: 'testDescription',
                amount: 100,
                category: 'education',
                date: Date.now(),
                createdAt: Date.now()
			});
			cost.save();
			chai.request(app)
				.get('/users/testuser/costs/' + cost._id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					done();
				});
		});
    });
    describe('/PUT costs/:costid', () => {
        it('it should update a specific cost', (done) => {
			var cost = new Cost({
				_id: Date.now(),
                title: 'testTitle',
                description: 'testDescription',
                amount: 100,
                category: 'education',
                date: Date.now(),
                createdAt: Date.now()
			});
			var updatedCost = cost;
			cost.save();
			updatedCost.title = "titleUpdated";
			chai.request(app)
				.put('/users/testuser/costs/' + cost._id)
				.send(cost)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
				});
		});
    });
    describe('/DELETE costs/:costid', () => {
        it('it should delete a specific cost', (done) => {
			var cost = new Cost({
				_id: Date.now(),
                title: 'testTitle',
                description: 'testDescription',
                amount: 100,
                category: 'education',
                date: Date.now(),
                createdAt: Date.now()
			});
			cost.save();
			chai.request(app)
				.delete('/users/testuser/costs/' + cost._id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
				});
		});
    });
});