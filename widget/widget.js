import {IntroductionBuilder} from "./js/introduction/introductionBuilder.js";
import { ContentBuilder } from "./js/content/contentBuilder.js";
import { LanguageBuilder } from "./js/language/languageBuilder.js";
import { EventHandlers } from "./js/eventHandlers.js";



const init = async() => {
    EventHandlers.setLoading('block');
    IntroductionBuilder.init_Introduction();
    await ContentBuilder.init_Content();
    EventHandlers.setLoading('none');

    EventHandlers.init_Events();
    LanguageBuilder.init_Language();
}

init();