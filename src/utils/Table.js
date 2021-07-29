class Table {
    /**
     * 
     * @param {String} zipped zipped Table storage string
     */
    constructor(name, words) {
        this.name = name;
        this.words = words;
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
    return new Unit(zipped[0], zipped[1], zipped[2]);
}

class Unit {
    constructor(spelling, highlight="white", records = []) {
        this.spelling = spelling;
        this.highlight = highlight;
        this.records = records;
    }

    zip() {
        return [this.spelling, this.highlight, this.records];
    }

    add(entry) {
        this.records.push(entry);
    }

    delete(entry) {
        let idx = this.records.indexOf(entry);
        if (idx >= 0) {
            this.records.splice(idx, 1);
        }
    }

    get dates() {
        return this.records.reduce((accu, curr) => {
            if (!accu[curr]) {
                accu[curr] = 0;
            }
                
        })
    }
}

export default {
    Table, unzipUnit, Unit
};