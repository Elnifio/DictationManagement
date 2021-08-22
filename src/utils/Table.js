const DAYDIFF = 24 * 60 * 60 * 1000;
import Intl from "./Intl";
import Record from "./Record";

class Table {
    /**
     * 
     * @param {String} name name of the table
     * @param {Unit[]} words A list of words
     * @param {Record.Record[]} records a list of records
     * @param {Integer} showLast history record query length
     */
    constructor(name, words=[], records=[], showLast=5) {
        this.name = name;
        this.words = words;
        this.records = records;
        this.showLast = showLast;
        this.mode = Intl.Mode.edit;
        this.last = this.records.pop();
    }

    performHighlight(defaultColor="blue") {
        this.words.forEach(word => {
            if (this.last.contains(word)) {
                if (!this.last.query(word)) {
                    word.highlight = defaultColor;
                }
            }
        });
    }

    clearHighlight(unit) {
        unit.resetHighlight();
    }

    clearAllHighlights() {
        this.words.forEach(unit => unit.resetHighlight());
    }

    storeLast(lastrec) {
        this.last = lastrec;
    }

    initiateRecord() {
        if (this.last) this.records.push(this.last);
        this.last = new Record.Record(new Date());
    }

    discardLast() {
        this.last = this.records.pop();
    }

    recordCorrect(unit) {
        this.last.insertCorrect(unit);
    }

    recordWrong(unit) {
        this.last.insertWrong(unit);
    }

    deleteRecord(unit) {
        this.last.deleteUnit(unit);
    }

    queryRecord(unit) {
        if (this.last) {
            return this.last.query(unit);
        } else {
            return undefined;
        }
    }

    get dates() {
        return this.records
            .map(curr => new Date(curr.dt.getFullYear(), curr.dt.getMonth(), curr.dt.getDay()) - 0)
            .reduce((accu, curr) => {
                if (!accu.includes(curr)) {
                    accu.push(curr);
                }
            }, []);
        // return Array.sort(this.words.reduce((accu, curr) => 
        //     accu.concat(curr.dates.filter(x => accu.indexOf(x) < 0)), []));
    }

    contains(word) {
        return this.words.filter(unit => unit.spelling == word).length != 0;
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
    get statistics() {
        return this.words.map(x => {
            x.reset();
            this.records.forEach(rec => {
                if (rec.contains(x)) {
                    x.add(rec.date, rec.query(x));
                }
            });
            let lastStatus = undefined;
            if (this.last.contains(x)) {
                x.add(this.last.date, this.last.query(x));
            }

            if (this.mode != Intl.Mode.dictation && this.last.contains(x)) {
                lastStatus = this.last.query(x);
            } else if (this.mode == Intl.Mode.dictation && this.records.length > 0) {
                if (this.records[this.records.length - 1].contains(x)) {
                    lastStatus = this.records[this.records.length - 1].query(x);
                }
            }
            let out = x.stats(this.showLast);
            out.lastRecord = lastStatus;
            return out;
        });
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
        this.editing = false;
    }

    zip() {
        return [this.spelling, this.highlight, this.records, this.annot];
    }

    reset() {
        this.records = {};
    }

    resetHighlight() {
        this.highlight = "white";
    }

    /**
     * 
     * @param {Date} date 
     * @param {Boolean} correct 
     */
    add(date, correct) {
        let entry = date - 0;
        if (!this.records[entry]) {
            this.records[entry] = {wrong: 0, correct: 0};
        }
        this.records[entry][correct?"correct":"wrong"] += 1;
    }

    delete(date, correct) {
        let entry = date - 0;
        if (this.records[entry]) {
            this.records[entry][correct?"correct":"wrong"] -= 1;
        }

        if (this.records[entry].correct <= 0 && this.records[entry].wrong <= 0) {
            // Vue.delete(this.records, entry);
            delete this.records[entry];
        }
    }

    query(start, end) {
        start = start - 0;
        end = end - 0;
        let counter = {correct: 0, wrong: 0};
        Object.keys(this.records).forEach(x => {
            let converted = parseInt(x);
            if (converted >= start && converted < end) {
                counter.correct += this.records[x].correct;
                counter.wrong += this.records[x].wrong;
            }
        })
        return counter;
    }

    get dates() {
        let out = [];
        Object.keys(this.records).forEach(x => {
            let converted = new Date(parseInt(x));
            converted = new Date(converted.getFullYear(), converted.getMonth(), converted.getDay());
            if (out.filter(k => k == converted - 0).length == 0) out.push(converted);
        });
        return out;
        // return Object.keys(this.records).map(x => new Date(parseInt(x)));
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
        let startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let diff = history * DAYDIFF;
        let historyStatistics = new Date(startToday - diff);

        let yesterday = new Date(startToday - DAYDIFF);
        let yesterdayRecord = this.query(yesterday, startToday);
        let today = this.query(startToday, now);

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