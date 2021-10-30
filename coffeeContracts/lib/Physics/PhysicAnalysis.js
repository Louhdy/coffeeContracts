'use strict';

const Physic = require('./Physic');
const getCurrentDate = require('../Utils');

class PhysicAnalysis {
    constructor(physicalId, amountBags, receptionId) {
        this.uuid = physicalId;
        this.receptionId = receptionId;
        this.analysis = [];
        this.type = 'physical';
        for (let i=0; i < parseInt(amountBags); i++){
            this.analysis.push(new Physic());
        }
        this.updateDate = getCurrentDate();
        return this;
    }
}
module.exports = PhysicAnalysis;