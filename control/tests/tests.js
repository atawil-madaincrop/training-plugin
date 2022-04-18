
import { itemsTests } from "../tests/js/itemsTests.js";
import { languageTests } from "./js/languageTests.js";
import { introductionTests } from "../tests/js/introductionTests.js";

mocha.setup({
    ui: 'bdd',
    checkLeaks: true,
    globals: ['*'],
});

var expect = chai.expect;

const callTestsObject = {
    testItems: new Promise(() => itemsTests(expect)),
    introductionTest: new Promise(() => introductionTests(expect)),
    languageTests: new Promise(() => languageTests(expect)),
}

const callTestsFunc = () => {
    callTestsObject.testItems
        .then(callTestsObject.introductionTest)
        .then(callTestsObject.languageTests)
}

const init = async () => {
    callTestsFunc();
    mocha.run();
}

init();