import WidgetController from "./widget.controller.js";
import { pointers } from './js/pointers.js';

let introduction, language, imageCarousel, itemsListView, sort;

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

    sort = {
        title: 1,
    }

    itemsListView = new ListViewHelper(pointers.itemsListView, WidgetController.itemsTag(), pointers.widget, filterFixed, sort);
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
    pointers.iconClear.onclick = (e) => onClearClick(e);
    pointers.iconSort.onclick = (e) => openDrawer(e);
}

const openDrawer = () => {
    if (!language) return;

    let keys = ['sortAscending', 'sortDescending'];
    let listItems = [];
    keys.forEach((key) => {
        if (!language[key]) return;
        let text = language[key];
        let selected = key == 'sortAscending';
        listItems.push({ id: key, text, selected });
    });

    buildfire.components.drawer.open(
        {
            allowSelectAll: false,
            enableFilter: false,
            listItems: listItems,
            height: '13.6rem',
        },
        (err, res) => {
            if (err) return console.error(err);

            switch (res.id) {
                case 'sortAscending':
                    if (sort.title < 0) {
                        sort.title = 1;
                        itemsListView.search(null, sort);
                    }
                    break;

                case 'sortDescending':
                    if (sort.title > 0) {
                        sort.title = -1;
                        itemsListView.search(null, sort);
                    }
                    break;
            }

            buildfire.components.drawer.closeDrawer();
        }
    );
}

const onClearClick = () => {
    pointers.searchInput.value = '';
    toggleCarouselAndDescription(false);
    toggleSortAndCancelIcons(false);

    if (itemsListView)
        itemsListView.search();
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