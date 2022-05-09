
const handlersCollection = async () => {
    EventHandlers.setLoading('block');
    EventHandlers.init_Events();
    LanguageBuilder.init_Language();
    let emptyPageState = await IntroductionBuilder.init_Introduction();
    await ContentBuilder.init_Content(emptyPageState);
    EventHandlers.setLoading('none');
}
const handelUpdate = async () => {
    LanguageBuilder.init_Language();
    let emptyPageState = await IntroductionBuilder.appendUpdatedData();
    ContentBuilder.emptyPageState = emptyPageState;
    if (ContentBuilder.allItemsSorted.length == 0) {
        pointers.emptyPage.style.display = emptyPageState;
    }
}
const init = async () => {
    handlersCollection();
    buildfire.history.push("mainPage");
    buildfire.datastore.onUpdate(handelUpdate);
}

init();