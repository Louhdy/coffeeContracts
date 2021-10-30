/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const Reception = require('./Reception');
const PhysicAnalysis = require('./Physics/PhysicAnalysis');
const SensorialAnalysis = require('./Sensorial/SensorialAnalysis');
const Toast = require('./Toast');
const Packing = require('./Packing');
const Distribution = require('./Distribution');
const { v4: uuidv4 } = require('uuid');

class CoffeeContractsContract extends Contract {
    async updateObjectById(ctx, uuid, args) {
        args = JSON.parse(args);
        const exists = await this.objectExists(ctx, uuid);
        if (!exists) {
            let response = {};
            response.error = `The object with ${uuid} does not exist`;
            return response;
        }
        const buffer = Buffer.from(JSON.stringify(args));
        await ctx.stub.putState(uuid, buffer);
    }
    async getObjectById (ctx, uuid) {
        const exists = await this.objectExists(ctx, uuid);
        if (!exists) {
            let response = {};
            response.error = `The object with ${uuid} does not exist`;
            return response;
        }
        const buffer = await ctx.stub.getState(uuid);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }
    async createNewReception(ctx, uuid, args) {
        args = JSON.parse(args);
        let exists = await this.objectExists(ctx, uuid);
        while(exists) {
            uuid = uuidv4().toString();
            exists = await this.objectExists(ctx, uuid);
        }        
        const physicalId = await this.createNewPhysicalAnalisis(ctx, args.physicalId, args.amountBags, uuid);
        const sensorialId = await this.createNewSensorialAnalysis(ctx, args.sensorialId, args.amountBags, uuid);
        const toastId = await this.createNewToast(ctx, args.toastId, uuid);
        const packingId = await this.createNewPacking(ctx, args.packingId, uuid);
        const distributionId = await this.createNewDistribution(ctx, args.distributionId, uuid);
        const newReception = new Reception(uuid, args.id, args.producer, args.seed, args.amountBags, physicalId, sensorialId, toastId, packingId, distributionId);
        const asset = { newReception };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(uuid, buffer);
    }
    async createNewPhysicalAnalisis(ctx, physicalId, amountBags, receptionId ) {
        const exists = await this.objectExists(ctx, physicalId);
        while(exists) {
            physicalId = uuidv4().toString();
            exists = await this.objectExists(ctx, physicalId);
        }
        let newPhysical = new PhysicAnalysis(physicalId, amountBags, receptionId);
        const asset = { newPhysical };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(physicalId, buffer);
        return physicalId;
    }
    async createNewSensorialAnalysis(ctx, sensorialId, amountBags, receptionId) {
        const exists = await this.objectExists(ctx, sensorialId);
        while(exists) {
            sensorialId = uuidv4().toString();
            exists = await this.objectExists(ctx, sensorialId);
        }
        let newSensorial = new SensorialAnalysis(sensorialId, amountBags, receptionId);
        const asset = { newSensorial };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(sensorialId, buffer);
        return sensorialId;
    }
    async createNewToast(ctx, toastId, receptionId) {
        const exists = await this.objectExists(ctx, toastId);
        while(exists) {
            toastId = uuidv4().toString();
            exists = await this.objectExists(ctx, toastId);
        }
        let newToast = new Toast(toastId, receptionId);
        const asset = { newToast };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(toastId, buffer);
        return toastId;
    }
    async createNewPacking(ctx, packingId, receptionId) {
        const exists = await this.objectExists(ctx, packingId);
        while(exists) {
            packingId = uuidv4().toString();
            exists = await this.objectExists(ctx, packingId);
        }
        let newPacking = new Packing(packingId, receptionId);
        const asset = { newPacking };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(packingId, buffer);
        return packingId;
    }
    async createNewDistribution(ctx, distributionId, receptionId) {
        const exists = await this.objectExists(ctx, distributionId);
        while(exists) {
            distributionId = uuidv4().toString();
            exists = await this.objectExists(ctx, distributionId);
        }
        let newDistribution = new Distribution(distributionId, receptionId);
        const asset = { newDistribution };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(distributionId, buffer);
        return distributionId;
    }
    async objectExists(ctx, uuid) {
        const buffer = await ctx.stub.getState(uuid);
        return (!!buffer && buffer.length > 0);
    }

    async deleteReception(ctx, uuid) {
        const exists = await this.objectExists(ctx, uuid);
        if (!exists) {
            throw new Error(`The coffee lot ${uuid} does not exist`);
        }
        await ctx.stub.deleteState(uuid);
    }
    async getAllReceptions(ctx) {
        let queryString = {
            'selector': {
                'newReception.type':'reception'
            }
        };
        let queryResults = await this.getByQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    }

    async getByQueryString(ctx, queryString) {
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        let allResults = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            let res = await resultsIterator.next();
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                jsonRes.Key = res.value.key;
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (error) {
                    console.log(error);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await resultsIterator.close();
                console.info(allResults);
                console.log(JSON.stringify(allResults));
                return JSON.stringify(allResults);
            }
        }
    }
}

module.exports = CoffeeContractsContract;
