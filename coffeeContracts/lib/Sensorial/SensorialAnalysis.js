'use strict';

const Sensorial = require('./Sensorial');
const getCurrentDate = require('../Utils');

class SensorialAnalysis {
    constructor(sensorialId, amountBags, receptionId) {
        this.uuid = sensorialId;
        this.receptionId = receptionId;
        this.analysis = [];
        this.type = 'sensorial';
        for (let i=0; i < parseInt(amountBags); i++){
            this.analysis.push(new Sensorial());
        }
        this.updateDate =  getCurrentDate();
        return this;
    }
}
module.exports = SensorialAnalysis;