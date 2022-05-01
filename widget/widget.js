import { IntroductionBuilder } from "./js/introduction/introductionBuilder.js";
import { ContentBuilder } from "./js/content/contentBuilder.js";
import { LanguageBuilder } from "./js/language/languageBuilder.js";
import { EventHandlers } from "./js/eventHandlers.js";


const handlersCollection = async () => {
    EventHandlers.setLoading('block');
    EventHandlers.init_Events();

    LanguageBuilder.init_Language();
    await ContentBuilder.init_Content();

    IntroductionBuilder.init_Introduction();
    EventHandlers.setLoading('none');
}

const handelUpdate = async () => {
    LanguageBuilder.init_Language();
    IntroductionBuilder.appendUpdatedData();
}

const init = async () => {
    handlersCollection();
    buildfire.history.push("mainPage");

    buildfire.datastore.onUpdate(handelUpdate);
    buildfire.navigation.onBackButtonClick = () => ContentBuilder.backFunction();
    
    buildfire.history.onPop((breadcrumb) => {
        ContentBuilder.backPOP_Listener(breadcrumb);
    });
}

init();
