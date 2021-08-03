import Table from "./src/utils/Table.js";
const testunit = true;

function testUnit() {
    let Unit = Table.Unit;
    let a = new Unit("123", false);
    console.log(a.stats());
    console.log("--------");
    const DAYDIFF = 24 * 60 * 60 * 1000;
    let now = new Date();
    a.add(now, true);
    a.add(now, false);
    a.add(now, true);
    a.add(new Date(now - DAYDIFF));
    console.log(a.records);
    console.log("--------");
    console.log(a.stats());
    console.log("--------");
    a.add(new Date(now - DAYDIFF * 10), false);
    console.log(a.stats());
    console.log("--------");
    console.log(a.stats(14));
}

if (testunit) {
    testUnit();
}


