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

const toggleCarouselAndDescription = (on) => {
    if (on) {
        pointers.carousel.classList.add('hidden');
        pointers.description.classList.add('hidden');
    } else {
        pointers.carousel.classList.remove('hidden');
        pointers.description.classList.remove('hidden');
    }
}

const toggleSortAndCancelIcons = (on) => {
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
        toggleSortAndCancelIcons(true);
        toggleCarouselAndDescription(true);
    } else {
        toggleSortAndCancelIcons(false);
        toggleCarouselAndDescription(false);
    }

    if (itemsListView)
        debounce('search', () => {
            itemsListView.search({
                $or: [
                    { "$json.title": { "$regex": value, "$options": "i" } },
                    { "$json.subtitle": { "$regex": value, "$options": "i" } },
                ],
            });
        }, 500);

}

const debounce = (key, callback, wait) => {
    if (key) clearTimeout(key);
    setTimeout(callback);
}

const init = async () => {
    load();
    initItemsListView();
    initListeners();
}

init();