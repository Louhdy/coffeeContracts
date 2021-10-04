/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class CoffeeTraceNoRestrictiveContract extends Contract {

    async createNewReception(ctx, receptionId, reception) {
        const exists = await this.receptionExists(ctx, receptionId);
        if (exists) {
            throw new Error(`The coffee lot ${receptionId} already exists`);
        }
        const asset = { reception };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(receptionId, buffer);
    }

    async receptionExists(ctx, receptionId) {
        const buffer = await ctx.stub.getState(receptionId);
        return (!!buffer && buffer.length > 0);
    }

    async deleterReception(ctx, receptionId) {
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

}

module.exports = CoffeeTraceNoRestrictiveContract;
