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

const initListeners = () => {
    pointers.searchInput.onkeyup = (e) => onSearchInputChange(e);
}

const toggleSortCancelIcon = (on) => {
    if (on) {
        pointers.iconSort.classList.add('hidden');
        pointers.iconClear.classList.remove('hidden');
    } else {
        pointers.iconSort.classList.remove('hidden');
        pointers.iconClear.classList.add('hidden');
    }
}

const onSearchInputChange = (e) => {
    let value = e.target.value;
    if (value) {
        toggleSortCancelIcon(true);
    } else {
        toggleSortCancelIcon(false);
    }
}

const init = async () => {
    load();
    initItemsListView();
    initListeners();
}

init();