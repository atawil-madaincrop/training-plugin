import WidgetController from "./widget.controller.js";
import { pointers } from './js/pointers.js';

let introduction, items, imageCarousel, itemsListView;

const initCarousel = () => {
    imageCarousel = new buildfire.components.carousel.view(pointers.carousel, introduction.imageCarousel);
}

const initDescription = () => {
    pointers.description.innerHTML = introduction.description;
}

const initItemsListView = () => {
    itemsListView = new ListViewHelper(pointers.itemsListView, itemsToListViewStructure(items));
    itemsListView.init();
}

const itemsToListViewStructure = (items) => {
    return items.map((item) => {
        return {
            id: item.id,
            title: item.data.title,
            subtitle: item.data.subtitle,
            imageUrl: item.data.image,
        }
    });
}

const load = () => {
    WidgetController.getIntroduction().then((res) => {
        introduction = res.data;
        initCarousel();
        initDescription();

        console.log({ introduction });
    });

    WidgetController.getItems().then((res) => {
        items = res;
        initItemsListView();

        console.log({ items });
    });
}

const init = async () => {
    load();
}

init();