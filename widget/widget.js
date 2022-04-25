import WidgetController from "./widget.controller.js";
import { pointers } from './js/pointers.js';

let introduction, language, imageCarousel, itemsListView;

const initCarousel = () => {
    imageCarousel = new buildfire.components.carousel.view(pointers.carousel, introduction.imageCarousel);
}

const initDescription = () => {
    pointers.description.innerHTML = introduction.description;
}

const initItemsListView = async () => {
    const filterFixed = {
        "$json.deletedOn": { "$eq": null },
    }

    itemsListView = new ListViewHelper(pointers.itemsListView, WidgetController.itemsTag(), pointers.widget, filterFixed);
    itemsListView.init();
}

const load = async () => {
    const promises = [
        WidgetController.getIntroduction(),
        WidgetController.getLanguage(),
    ];

    await Promise.all(promises).then((values) => {
        introduction = values[0].data;
        language = values[1].data;

        console.log({ introduction, language });
    });

    initCarousel();
    initDescription();
}

const init = async () => {
    load();
    initItemsListView();
}

init();