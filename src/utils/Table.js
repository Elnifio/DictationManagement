// import Vue from "vue";

const DAYDIFF = 24 * 60 * 60 * 1000;

class Table {
    /**
     * 
     * @param {String} name name of the table
     * @param {Unit[]} words A list of words
     * @param {Integer} showLast history record query length
     */
    constructor(name, words=[], showLast=5) {
        this.name = name;
        this.words = words;
        this.showLast = showLast;
    }

    get dates() {
        return Array.sort(this.words.reduce((accu, curr) => 
            accu.concat(curr.dates.filter(x => accu.indexOf(x) < 0)), []));
    }

    insert(word) {
        this.words.push(new Unit(word));
    }

    delete(unit) {
        let idx = this.words.indexOf(unit);
        if (idx >= 0) {
            this.words.splice(idx, 1);
        } else {
            console.log("Object not found: ");
            console.log(unit);
        }
    }

    /**
     * returns a list of each unit's stats
     */
    get records() {
        return this.words.map(x => x.stats(this.showLast));
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

/**
 * 
 * @param {Integer} date 
 */
function constructRecord(dateInt) {
    let now = new Date();
    let out = {};
    while (dateInt < now) {
        out[new Date(dateInt)] = {correct: 0, wrong: 0};
        dateInt += DAYDIFF;
    }
    return out;
}

class Unit {
    /**
     * 
     * @param {String} spelling the spelling of the word
     * @param {String} highlight Color of background of the word
     * @param {Object} records History records of the word, initialized to be empty object
     * @param {*} annot Annotation of the word, could be neglected?
     */
    constructor(spelling, highlight="white", records={}, annot="") {
        this.spelling = spelling;
        this.highlight = highlight;
        /**
         * Records are of the form {<String>:{wrong: <Natural-Number>, correct: <Natural-Number>}, ...};
         * the String represents the date that this record is added
         */
        this.records = records;
        this.annot = annot;
    }

    zip() {
        return [this.spelling, this.highlight, this.records, this.annot];
    }

    /**
     * 
     * @param {Date} date 
     * @param {Boolean} correct 
     */
    add(date, correct) {
        let entry = (new Date(date.getFullYear(), date.getMonth(), date.getDate()) - 0) + "";
        if (!this.records[entry]) {
            this.records[entry] = {wrong: 0, correct: 0};
        }
        this.records[entry][correct?"correct":"wrong"] += 1;
    }

    delete(date, correct) {
        let entry = (new Date(date.getFullYear(), date.getMonth(), date.getDate()) - 0) + "";
        if (this.records[entry]) {
            this.records[entry][correct?"correct":"wrong"] -= 1;
        }

        if (this.records[entry].correct <= 0 && this.records[entry].wrong <= 0) {
            // Vue.delete(this.records, entry);
            delete this.records[entry];
        }
    }

    query(date) {
        let entry = (new Date(date.getFullYear(), date.getMonth(), date.getDate()) - 0) + "";
        return this.records[entry];
    }

    get dates() {
        return Object.keys(this.records).map(x => new Date(parseInt(x)));
    }

    /**
     * 
     * @param {Integer} history number of days to inspect on
     * @returns Object
     * 
     *  Give statistics about the word:
     *      Count of wrong answers in the past <history> days
     *      Count of right answers in the past <history> days
     *      Raw record in the past <history> days
     */
    stats(history=5) {
        let now = new Date();
        let diff = history * DAYDIFF;
        let historyStatistics = new Date(now - diff);

        let yesterday = new Date(now - DAYDIFF);
        let yesterdayRecord = this.query(yesterday);
        let today = this.query(now);

        let out = {
            history: {correct: 0, wrong: 0},
            yesterday: 
                yesterdayRecord?
                    {   correct: yesterdayRecord.correct, 
                        wrong: yesterdayRecord.wrong}
                    :{correct:0, wrong:0},
            today: today?{correct:today.correct, wrong:today.wrong}:{correct:0,wrong:0},
            raw: constructRecord(historyStatistics - 0), 
            self: this,
        };

        this.dates.filter(x => x > historyStatistics).forEach(date => {
            let rec = this.query(date);
            if (rec) {
                out.history.correct += rec.correct;
                out.history.wrong += rec.wrong;
                out.raw[date] = rec;
            }
        })

        return out;
    }
}

export default {
    Table, unzipUnit, Unit
};