'use strict';

class physicAnalysis {
    constructor(physicalId, initialWeight, humedity, blocks = 0) {
        this.physicalId = physicalId;
        this.initialWeight = initialWeight;
        this.humedity = humedity;
        this.blocks = new Array (blocks);
        return this;            
    }
}
module.exports = physicAnalysis;