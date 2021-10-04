/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');

async function getCollectionName(ctx) {
    const mspid = ctx.clientIdentity.getMSPID();
    const collectionName = `_implicit_org_${mspid}`;
    return collectionName;
}

class CoffeTraceSmartContractsContract extends Contract {

    async coffeTraceSmartContractsExists(ctx, coffeTraceSmartContractsId) {
        const collectionName = await getCollectionName(ctx);
        const data = await ctx.stub.getPrivateDataHash(collectionName, coffeTraceSmartContractsId);
        return (!!data && data.length > 0);
    }

    async createCoffeTraceSmartContracts(ctx, coffeTraceSmartContractsId) {
        const exists = await this.coffeTraceSmartContractsExists(ctx, coffeTraceSmartContractsId);
        if (exists) {
            throw new Error(`The asset coffe trace smart contracts ${coffeTraceSmartContractsId} already exists`);
        }

        const privateAsset = {};

        const transientData = ctx.stub.getTransient();
        if (transientData.size === 0 || !transientData.has('privateValue')) {
            throw new Error('The privateValue key was not specified in transient data. Please try again.');
        }
        privateAsset.privateValue = transientData.get('privateValue').toString();

        const collectionName = await getCollectionName(ctx);
        await ctx.stub.putPrivateData(collectionName, coffeTraceSmartContractsId, Buffer.from(JSON.stringify(privateAsset)));
    }

    async readCoffeTraceSmartContracts(ctx, coffeTraceSmartContractsId) {
        const exists = await this.coffeTraceSmartContractsExists(ctx, coffeTraceSmartContractsId);
        if (!exists) {
            throw new Error(`The asset coffe trace smart contracts ${coffeTraceSmartContractsId} does not exist`);
        }
        let privateDataString;
        const collectionName = await getCollectionName(ctx);
        const privateData = await ctx.stub.getPrivateData(collectionName, coffeTraceSmartContractsId);
        privateDataString = JSON.parse(privateData.toString());
        return privateDataString;
    }

    async updateCoffeTraceSmartContracts(ctx, coffeTraceSmartContractsId) {
        const exists = await this.coffeTraceSmartContractsExists(ctx, coffeTraceSmartContractsId);
        if (!exists) {
            throw new Error(`The asset coffe trace smart contracts ${coffeTraceSmartContractsId} does not exist`);
        }
        const privateAsset = {};

        const transientData = ctx.stub.getTransient();
        if (transientData.size === 0 || !transientData.has('privateValue')) {
            throw new Error('The privateValue key was not specified in transient data. Please try again.');
        }
        privateAsset.privateValue = transientData.get('privateValue').toString();

        const collectionName = await getCollectionName(ctx);
        await ctx.stub.putPrivateData(collectionName, coffeTraceSmartContractsId, Buffer.from(JSON.stringify(privateAsset)));
    }

    async deleteCoffeTraceSmartContracts(ctx, coffeTraceSmartContractsId) {
        const exists = await this.coffeTraceSmartContractsExists(ctx, coffeTraceSmartContractsId);
        if (!exists) {
            throw new Error(`The asset coffe trace smart contracts ${coffeTraceSmartContractsId} does not exist`);
        }
        const collectionName = await getCollectionName(ctx);
        await ctx.stub.deletePrivateData(collectionName, coffeTraceSmartContractsId);
    }

    async verifyCoffeTraceSmartContracts(ctx, mspid, coffeTraceSmartContractsId, objectToVerify) {

        // Convert provided object into a hash
        const hashToVerify = crypto.createHash('sha256').update(objectToVerify).digest('hex');
        const pdHashBytes = await ctx.stub.getPrivateDataHash(`_implicit_org_${mspid}`, coffeTraceSmartContractsId);
        if (pdHashBytes.length === 0) {
            throw new Error('No private data hash with the key: ' + coffeTraceSmartContractsId);
        }

        const actualHash = Buffer.from(pdHashBytes).toString('hex');

        // Compare the hash calculated (from object provided) and the hash stored on public ledger
        if (hashToVerify === actualHash) {
            return true;
        } else {
            return false;
        }
    }


}

module.exports = CoffeTraceSmartContractsContract;
