/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { CoffeeContractsContract } = require('..');
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

describe('CoffeeContractsContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new CoffeeContractsContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"coffee contracts 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"coffee contracts 1002 value"}'));
    });

    describe('#coffeeContractsExists', () => {

        it('should return true for a coffee contracts', async () => {
            await contract.coffeeContractsExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a coffee contracts that does not exist', async () => {
            await contract.coffeeContractsExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createCoffeeContracts', () => {

        it('should create a coffee contracts', async () => {
            await contract.createCoffeeContracts(ctx, '1003', 'coffee contracts 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"coffee contracts 1003 value"}'));
        });

        it('should throw an error for a coffee contracts that already exists', async () => {
            await contract.createCoffeeContracts(ctx, '1001', 'myvalue').should.be.rejectedWith(/The coffee contracts 1001 already exists/);
        });

    });

    describe('#readCoffeeContracts', () => {

        it('should return a coffee contracts', async () => {
            await contract.readCoffeeContracts(ctx, '1001').should.eventually.deep.equal({ value: 'coffee contracts 1001 value' });
        });

        it('should throw an error for a coffee contracts that does not exist', async () => {
            await contract.readCoffeeContracts(ctx, '1003').should.be.rejectedWith(/The coffee contracts 1003 does not exist/);
        });

    });

    describe('#updateCoffeeContracts', () => {

        it('should update a coffee contracts', async () => {
            await contract.updateCoffeeContracts(ctx, '1001', 'coffee contracts 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"coffee contracts 1001 new value"}'));
        });

        it('should throw an error for a coffee contracts that does not exist', async () => {
            await contract.updateCoffeeContracts(ctx, '1003', 'coffee contracts 1003 new value').should.be.rejectedWith(/The coffee contracts 1003 does not exist/);
        });

    });

    describe('#deleteCoffeeContracts', () => {

        it('should delete a coffee contracts', async () => {
            await contract.deleteCoffeeContracts(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a coffee contracts that does not exist', async () => {
            await contract.deleteCoffeeContracts(ctx, '1003').should.be.rejectedWith(/The coffee contracts 1003 does not exist/);
        });

    });

});
