
import testItems from "./__Test__Handlers__/itemsTest.js";
import languageTests from "./__Test__Handlers__/languageTest.js";
import introductionTest from "./__Test__Handlers__/introductionTest.js";

let tetMocha = new Mocha();
mocha.setup('bdd');
mocha.setup({
    globals: ['*']
});
mocha.checkLeaks();
let expect = chai.expect;

const callTestsObject = {
    // use main laibraries for testing
    testItems: new Promise(() => testItems(mocha, expect)),
    introductionTest: new Promise(() => introductionTest(mocha, expect)),
    languageTests: new Promise(() => languageTests(tetMocha, expect)),
}

const callTestsFunc = () => {
    callTestsObject.testItems
        .then(callTestsObject.introductionTest)
        .then(callTestsObject.languageTests)
}


callTestsFunc();