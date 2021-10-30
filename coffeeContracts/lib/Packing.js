'use strict';

const getCurrentDate = require('./Utils');

class Packing {
    constructor(packingId, receptionId) {
        this.uuid = packingId;
        this.receptionId = receptionId;
        this.type = 'packing';
        this.updateDate = getCurrentDate();
        this.packageType = null;
        this.presentation = null;
        this.amount = null;
        this.recomendations = null;
        return this;
    }
}
module.exports = Packing ;