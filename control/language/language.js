import Language from "../../widget/common/entities/Language.js";
import LanguageController from "./language.controller.js";

let language, languageHelper;

const initLanguageHelper = async () => {
    const onInputUpdate = async (key, value) => {
        language[key] = value;
        await LanguageController.saveLanguage(language);
    }

    languageHelper = new LanguageHelper("#language", languageConfig, language, onInputUpdate);
    languageHelper.init();
}

const load = async () => {
    const promises = [
        LanguageController.getLanguage(),
    ];

    await Promise.all(promises).then((values) => {
        language = new Language(values[0]?.data);
    });
}

const init = async () => {
    await load();
    initLanguageHelper();
}

init();