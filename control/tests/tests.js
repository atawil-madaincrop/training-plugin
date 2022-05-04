
import { itemsTests1 } from "../tests/js/itemsTests1.js";
import { itemsTests2 } from "../tests/js/itemsTests2.js";
import { languageTests } from "../tests/js/languageTests.js";
import { introductionTests } from "../tests/js/introductionTests.js";

mocha.setup({
    ui: 'bdd',
    checkLeaks: true,
    globals: ['*'],
});

var expect = chai.expect;

const callTestsObject = {
    itemsTests1: new Promise(() => itemsTests1(expect)),
    itemsTests2: new Promise(() => itemsTests2(expect)),
    introductionTest: new Promise(() => introductionTests(expect)),
    languageTests: new Promise(() => languageTests(expect)),
};

const callTestsFunc = () => {
    callTestsObject.itemsTests1
        .then(callTestsObject.testItems2)
        .then(callTestsObject.introductionTest)
        .then(callTestsObject.languageTests);
};

const init = async () => {
    callTestsFunc();
    mocha.run();
};

init();