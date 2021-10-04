'use strict';

class Reception {
    constructor(producer, seedType, amountBags) {
        this.producer = producer;
        this.seedType = seedType;
        this.amountBags = amountBags;
        this.physicAnalysis = new Array (amountBags);
        return this;            
    }
}
module.exports = Reception;