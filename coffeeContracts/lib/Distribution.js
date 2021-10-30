'use strict';

const getCurrentDate = require('./Utils');

class Distribution {
    constructor(distributionId, receptionId) {
        this.uuid = distributionId;
        this.receptionId = receptionId;
        this.type = 'distribution';
        this.updateDate = getCurrentDate();
        this.sended = null;
        this.distributor = null;
        this.expectedDate = null;
        return this;
    }
}
module.exports = Distribution;