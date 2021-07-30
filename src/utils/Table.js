import Vue from "vue";

class Table {
    /**
     * 
     * @param {zipped} zipped zipped Table storage string
     */
    constructor(name, words, showLast=5) {
        this.name = name;
        this.words = words;
        this.showLast = showLast;
    }

    get dates() {
        return Array.sort(this.words.reduce((accu, curr) => 
            accu.concat(curr.dates.filter(x => accu.indexOf(x) < 0)), []));
    }

    // TODO: Finish this: a record of all table entries
    get records() {
        return this.words.reduce((accu, curr) => {
            return 0;
        })
    }

    zip() {
        return []
    }
}

/**
 * 
 * @param {Object[]} zipped 
 */
function unzipUnit(zipped) {
    return new Unit(zipped[0], zipped[1], zipped[2], zipped[3]);
}

class Unit {
    constructor(spelling, highlight="white", records={}, annot="") {
        this.spelling = spelling;
        this.highlight = highlight;
        this.records = records;
        this.annot = annot;
    }

    zip() {
        return [this.spelling, this.highlight, this.records, this.annot];
    }

    add(entry) {
        if (!this.records[entry]) {
            this.records[entry] = 0;
        }
        this.records[entry] += 1;
    }

    delete(entry) {
        if (this.records[entry] > 0) {
            this.records[entry] -= 1;
        }

        if (this.records[entry] <= 0) {
            Vue.delete(this.records, entry);
        }
    }

    get dates() {
        return Object.keys(this.records);
    }
}

export default {
    Table, unzipUnit, Unit
};