import Vue from "vue";

class RecordError {
    constructor(msg) {
        this.msg = msg;
    }

    toString() {
        return "RecordError: " + this.msg;
    } 
}

class Record {
    constructor(dt) {
        this.dt = dt;
        this.records = {};
    }

    get date() {
        return new Date(this.dt.getFullYear(), this.dt.getMonth(), this.dt.getDate());
    }

    insertCorrect(unit) {
        this.records[unit.spelling] = true;
    }

    insertWrong(unit) {
        this.records[unit.spelling] = false;
    }

    modifyUnit(unit, status) {
        if (!this.records[unit.spelling]) throw new RecordError(`Did not find unit: ${unit.spelling}`);
        this.records[unit.spelling] = status;
    }

    deleteUnit(unit) {
        if (this.records[unit.spelling] != undefined) {
            // delete this.records[unit.spelling];
            Vue.delete(this.records, unit.spelling);
        }
    }

    contains(unit) {
        return this.records[unit.spelling] != undefined;
    }

    query(unit) {
        return this.records[unit.spelling];
    }
} 

export default {Record};