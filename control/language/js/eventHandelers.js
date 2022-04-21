
import { pointers } from "./pointers.js";
import Language from "../../../widget/common/entities/Language.js";
import { LanguageManagement } from "./languageManagement.js";

export class Handlers{
    static languageState = new Language()

    static setDefaultnput = () => {
        pointers.search.defaultValue = Handlers.languageState.search || '';
        pointers.sortAscend.defaultValue = Handlers.languageState.sortAscending || '';
        pointers.sortDescend.defaultValue = Handlers.languageState.sortDescending || '';
    }

    static loadLanguage = async () => {
        let res = await LanguageManagement.getData();
        if(res){
            Handlers.languageState = res;
            Handlers.setDefaultnput();
        }
    }
    
}