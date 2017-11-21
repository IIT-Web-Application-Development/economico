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
        it('it should return empty array when no user exists.', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/POST costs', () => {
        it('it should return costid', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/GET costs/:costid', () => {
        it('it should return empty object when no cost exists.', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/PUT costs/:costid', () => {
        it('it should update specific cost', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
    describe('/DELETE costs/:costid', () => {
        it('it should delete specific cost', (done) => {
			//TODO
			expect(false, 'todo').to.be.true;
		});
    });
});