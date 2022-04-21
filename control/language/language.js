let languageHelper;

const initLanguageHelper = () => {
    languageHelper = new LanguageHelper("#language", languageConfig);
    languageHelper.init();
}

const init = () => {
    initLanguageHelper();
}

init();