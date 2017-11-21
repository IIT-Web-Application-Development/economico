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
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/POST users', () => {
        it('it should return userid', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/GET users/:userid', () => {
        it('it should return empty object when no user exists.', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/PUT users/:userid', () => {
        it('it should update specific user', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/DELETE users/:userid', () => {
        it('it should delete specific user', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
});