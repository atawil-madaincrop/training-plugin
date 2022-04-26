import {IntroductionBuilder} from "./js/introduction/introductionBuilder.js";
import { ContentBuilder } from "./js/content/contentBuilder.js";
import { pointers } from "./js/pointers.js";
import { LanguageBuilder } from "./js/language/languageBuilder.js";
import { EventHandlers } from "./js/eventHandlers.js";


const setLoading = (type) =>{
    pointers.loadingWidget.style.display = `${type}`;
    pointers.loadingItem.style.display = `${type}`;
}
const init = async() => {
    setLoading('block');
    IntroductionBuilder.init();
    await ContentBuilder.loadItems();
    setLoading('none');

    EventHandlers.init_Events();
    LanguageBuilder.init_Language();
}

init();