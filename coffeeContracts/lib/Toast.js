'use strict';

const getCurrentDate = require('./Utils');

class Toast {
    constructor(toastId, receptionId) {
        this.uuid = toastId;
        this.receptionId = receptionId;
        this.type = 'toast';
        this.updateDate =  getCurrentDate();
        this.toastType = null;
        this.ground = null;
        this.weight = null;
        return this;
    }
}
module.exports = Toast;