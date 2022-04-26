import {IntroductionBuilder} from "./js/introduction/introductionBuilder.js";
import { ContentBuilder } from "./js/content/contentBuilder.js";
import { pointers } from "./js/pointers.js";

const setLoading = (type) =>{
    pointers.loadingWidget.style.display = `${type}`;
    pointers.loadingItem.style.display = `${type}`;
}
const init = async() => {
    setLoading('block');
    IntroductionBuilder.init();
    await ContentBuilder.loadItems();
    setLoading('none');
}

init();