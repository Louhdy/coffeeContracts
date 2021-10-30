/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
let Reception = require('./Reception');
let PhysicAnalysis = require('./PhysicalAnalisis');

class CoffeeTraceNoRestrictiveContract extends Contract {

    async createNewReception(ctx, receptionId, reception) {
        const exists = await this.receptionExists(ctx, receptionId);        
        if (exists) {
            throw new Error(`The coffee lot ${receptionId} already exists`);
        }        
        let newReception = await new Reception(receptionId, reception.producer, reception.seedType, reception.amountBags);
        const asset = { newReception };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(receptionId, buffer);
    }

    async receptionExists(ctx, receptionId) {
        const buffer = await ctx.stub.getState(receptionId);
        return (!!buffer && buffer.length > 0);
    }

    async deleteReception(ctx, receptionId) {
        const exists = await this.receptionExists(ctx, receptionId);
        if (!exists) {
            throw new Error(`The coffee lot ${receptionId} does not exist`);
        }
        await ctx.stub.deleteState(receptionId);
    }

    async readReception(ctx, receptionId) {
        const exists = await this.receptionExists(ctx, receptionId);
        if (!exists) {
            throw new Error(`The coffee lot ${receptionId} does not exist`);
        }
        const buffer = await ctx.stub.getState(receptionId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async getAllReceptions(ctx) {
        let queryString = {
            selector: {}
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
            } catch (err) {
                console.log(err);
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

module.exports = CoffeeTraceNoRestrictiveContract;
