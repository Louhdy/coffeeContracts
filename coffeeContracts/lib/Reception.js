'use strict';
const getCurrentDate = require('./Utils');

class Reception {
    constructor(uuid, id, producer, seedType, amountBags, physicalId, sensorialId, toastId, packingId, distributionId) {
        this.uuid = uuid;
        this.id = parseInt(id);
        this.producer = producer;
        this.seedType = seedType;
        this.amountBags = parseInt(amountBags);
        this.physicalId = physicalId;
        this.sensorialId = sensorialId;
        this.toastId = toastId;
        this.packingId = packingId;
        this.distributionId = distributionId;
        this.type = 'reception';
        this.creationDate =  getCurrentDate();
        return this;
    }
}
module.exports = Reception;