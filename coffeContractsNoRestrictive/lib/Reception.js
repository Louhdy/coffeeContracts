'use strict';

class Reception {
    constructor(receptionId, producer, seedType, amountBags) {
        this.receptionId = receptionId;
        this.producer = producer;
        this.seedType = seedType;
        this.amountBags = amountBags;
        this.physicAnalysis = new Array (amountBags);
        return this;            
    }
}
module.exports = Reception;