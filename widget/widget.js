import WidgetController from "./widget.controller.js";
import { pointers } from './js/pointers.js';

let introduction, imageCarousel, itemsListView;

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

    itemsListView = new ListViewHelper(pointers.itemsListView, WidgetController.itemsTag, pointers.widget, filterFixed);
    itemsListView.init();
}

const load = () => {
    WidgetController.getIntroduction().then((res) => {
        introduction = res.data;
        initCarousel();
        initDescription();

        console.log({ introduction });
    });
}

const init = async () => {
    load();
    initItemsListView();
}

init();