
import { introductionManagement } from "./js/introductionManagement.js";
import Introduction from "../../widget/common/entities/Introduction.js";


let myIntroduction = new Introduction();

const loadIntroductionDatastore = () => {
    return introductionManagement.load();
}

const wysiwygContentHandler = (description) => {
    myIntroduction.description = description
    introductionManagement.pushItems(myIntroduction)
}

let delay = 1000;
let timer;
const handelWYSIWYG_Data = (e) => {
    clearTimeout(timer);
    timer = setTimeout(x => {
        wysiwygContentHandler(tinymce.activeEditor.getContent());
    }, delay, e)
}

const initTiny = (selector) => {
    tinymce.init({
        selector: selector,
        setup: editor => {
            editor.on('input', (e)=>handelWYSIWYG_Data(e));
            editor.on('change', (e)=>handelWYSIWYG_Data(e));
            
            editor.on('init', (e)=>{
                editor.setContent(myIntroduction.description || '')
            })
        }
    });
}

const initCarousel = (selector) => {
    let editor = new buildfire.components.carousel.editor(selector, myIntroduction.imageCarousel);

    editor.onAddItems = (items) => {
        if (myIntroduction.imageCarousel?.length > 0) {
            myIntroduction.imageCarousel = [...myIntroduction.imageCarousel, ...items]
        } else {
            myIntroduction.imageCarousel = items
        }
        introductionManagement.pushItems(myIntroduction)
    };

    editor.onDeleteItem = (item, index) => {
        myIntroduction.imageCarousel.splice(index, 1)
        introductionManagement.removeItem(myIntroduction)
    };

    editor.onOrderChange = (item, oldIndex, newIndex) => {
        myIntroduction.imageCarousel.splice(oldIndex, 1);
        myIntroduction.imageCarousel.splice(newIndex, 0, item);
        introductionManagement.pushItems(myIntroduction);
    };

    editor.onItemChange = (item, index) => {
        myIntroduction.imageCarousel[index] = item;
        introductionManagement.pushItems(myIntroduction);
    };
}

const init = async () => {
    myIntroduction = await loadIntroductionDatastore();
    initTiny("#wysiwygContent");
    initCarousel(".carousel");
}

init();
