
import { languageManagement } from "./languageManagement.js";
import {language} from "../../common/config/defaultLanguage.js";

export class LanguageBuilder{
    static selectedSort;
    static language;

    static loadLanguage = async () => {
        let res = await languageManagement.load();
        if(res){
            this.language = res;
        }else{
            this.language = language;
        }
    }

    static setSelectedSort = (type) => {
        this.selectedSort = type;
    }

    static init_Language = () => {
        this.loadLanguage();
    }
}