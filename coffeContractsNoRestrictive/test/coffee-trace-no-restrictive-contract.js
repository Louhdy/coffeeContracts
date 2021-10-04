/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { CoffeeTraceNoRestrictiveContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('CoffeeTraceNoRestrictiveContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new CoffeeTraceNoRestrictiveContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"coffee trace no restrictive 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"coffee trace no restrictive 1002 value"}'));
    });

    describe('#coffeeTraceNoRestrictiveExists', () => {

        it('should return true for a coffee trace no restrictive', async () => {
            await contract.coffeeTraceNoRestrictiveExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a coffee trace no restrictive that does not exist', async () => {
            await contract.coffeeTraceNoRestrictiveExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createCoffeeTraceNoRestrictive', () => {

        it('should create a coffee trace no restrictive', async () => {
            await contract.createCoffeeTraceNoRestrictive(ctx, '1003', 'coffee trace no restrictive 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"coffee trace no restrictive 1003 value"}'));
        });

        it('should throw an error for a coffee trace no restrictive that already exists', async () => {
            await contract.createCoffeeTraceNoRestrictive(ctx, '1001', 'myvalue').should.be.rejectedWith(/The coffee trace no restrictive 1001 already exists/);
        });

    });

    describe('#readCoffeeTraceNoRestrictive', () => {

        it('should return a coffee trace no restrictive', async () => {
            await contract.readCoffeeTraceNoRestrictive(ctx, '1001').should.eventually.deep.equal({ value: 'coffee trace no restrictive 1001 value' });
        });

        it('should throw an error for a coffee trace no restrictive that does not exist', async () => {
            await contract.readCoffeeTraceNoRestrictive(ctx, '1003').should.be.rejectedWith(/The coffee trace no restrictive 1003 does not exist/);
        });

    });

    describe('#updateCoffeeTraceNoRestrictive', () => {

        it('should update a coffee trace no restrictive', async () => {
            await contract.updateCoffeeTraceNoRestrictive(ctx, '1001', 'coffee trace no restrictive 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"coffee trace no restrictive 1001 new value"}'));
        });

        it('should throw an error for a coffee trace no restrictive that does not exist', async () => {
            await contract.updateCoffeeTraceNoRestrictive(ctx, '1003', 'coffee trace no restrictive 1003 new value').should.be.rejectedWith(/The coffee trace no restrictive 1003 does not exist/);
        });

    });

    describe('#deleteCoffeeTraceNoRestrictive', () => {

        it('should delete a coffee trace no restrictive', async () => {
            await contract.deleteCoffeeTraceNoRestrictive(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a coffee trace no restrictive that does not exist', async () => {
            await contract.deleteCoffeeTraceNoRestrictive(ctx, '1003').should.be.rejectedWith(/The coffee trace no restrictive 1003 does not exist/);
        });

    });

});
