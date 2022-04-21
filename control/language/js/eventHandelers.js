
import { pointers } from "./pointers.js";
import { LanguageManagement } from "./languageManagement.js";
import Language from "../../../widget/common/entities/Language.js";



export class Handlers {
    static languageState = new Language();

    delay = 1000;
    timer;

    static setDefaultInput = () => {
        pointers.search.defaultValue = this.languageState.search || '';
        pointers.sortAscend.defaultValue = this.languageState.sortAscending || '';
        pointers.sortDescend.defaultValue = this.languageState.sortDescending || '';
    }

    static loadLanguage = async () => {
        let res = await LanguageManagement.getData();
        if (res) {
            this.languageState = res;
            this.setDefaultInput();
        }
    }

    static saveLanguage = (e) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(async x => {
            await LanguageManagement.saveData(this.languageState);
        }, this.delay, e)
    }

    static handelInputSearch = (e) => {
        this.languageState.search = e.target.value;
        this.saveLanguage(e);
    }

    static handelInputAscend = (e) => {
        this.languageState.sortAscending = e.target.value;
        this.saveLanguage(e);
    }

    static handelInputDescend = (e) => {
        this.languageState.sortDescending = e.target.value;
        this.saveLanguage(e);
    }
}
