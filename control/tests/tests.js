

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
}

const callTestsFunc = () => {
    callTestsObject.itemsTests1
        .then(callTestsObject.testItems2)
        .then(callTestsObject.introductionTest)
        .then(callTestsObject.languageTests);
}

const init = async () => {
    callTestsFunc();
    mocha.run();
}

init();