import WidgetController from "./widget.controller.js";
import { pointers } from './js/pointers.js';

let introduction, language, imageCarousel, itemsListView, itemsLoaded, sort, selectedItem, page;

const initCarousel = () => {
    imageCarousel = new buildfire.components.carousel.view(pointers.carousel, introduction.imageCarousel);
    pointers.carouselLoadingState.classList.add('hidden');
}

const initDescription = () => {
    pointers.description.innerHTML = introduction.description;
}

const initLanguageValues = () => {
    pointers.searchInput.placeholder = language.search;
}

const initItemsListView = async () => {
    const filterFixed = {
        "$json.deletedOn": { "$eq": null },
    }

    sort = {
        title: 1,
    }

    itemsListView = new ListViewHelper(pointers.itemsListView, WidgetController.itemsTag(), pointers.widget, filterFixed, sort);
    itemsListView.search(null, sort, () => {
        itemsLoaded = true;
        checkEmptyState();
    });

    itemsListView.onItemClicked((item) => {
        goToDetailsPage(item);
    });
}

const checkEmptyState = () => {
    if (introduction) {
        if (!introduction.imageCarousel || introduction.imageCarousel.length <= 0) {
            pointers.carousel.classList.add('hidden');
        } else {
            pointers.carousel.classList.remove('hidden');
        }

        if (!introduction.description) {
            pointers.description.classList.add('hidden');
        } else {
            pointers.description.classList.remove('hidden');
        }
    }

    if (itemsListView && itemsLoaded) {
        if (itemsListView.listView.items.length <= 0) {
            pointers.itemsListView.classList.add('hidden');
        } else {
            pointers.itemsListView.classList.remove('hidden');
        }
    }

    if (
        pointers.carousel.classList.contains('hidden') &&
        pointers.description.classList.contains('hidden') &&
        pointers.itemsListView.classList.contains('hidden')
    ) {
        pointers.mainEmptyState.classList.remove('hidden');
    } else {
        pointers.mainEmptyState.classList.add('hidden');
    }
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
    initLanguageValues();
    checkEmptyState();
}

const initListeners = () => {
    buildfire.navigation.onBackButtonClick = () => onBackClick();
    pointers.searchInput.onkeyup = (e) => onSearchInputChange(e);
    pointers.iconClear.onclick = (e) => onClearClick(e);
    pointers.iconSort.onclick = (e) => onSortClickr(e);
    pointers.itemImage.onclick = (e) => onItemImageClick(e);
}

const onItemImageClick = () => {
    if (!selectedItem || !selectedItem.data || !selectedItem.data.image) return;
    buildfire.imagePreviewer.show({
        images: [selectedItem.data.image],
    });
}

const onBackClick = () => {
    switch (page) {
        case 'details':
            goToMainPage();
            break;
    }
}

const onSortClickr = () => {
    if (!language) return;

    let listItems = [
        {
            id: 'sortAscending',
            text: language['sortAscending'],
            selected: sort['title'] > 0,
        },
        {
            id: 'sortDescending',
            text: language['sortDescending'],
            selected: sort['title'] < 0,
        },
    ];

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

const goToMainPage = () => {
    page = 'main';
    selectedItem = null;

    pointers.mainPage.classList.add("slide-in");
    pointers.mainPage.classList.remove("hidden");
    pointers.detailsPage.classList.add("hidden");
}

const goToDetailsPage = (item) => {
    page = 'details';
    selectedItem = item;

    pointers.itemImage.src = item.data.image;
    pointers.itemCoverImage.src = item.data.coverImage;
    pointers.itemTitle.innerHTML = item.data.title;
    pointers.itemSubtitle.innerHTML = item.data.subtitle;
    pointers.itemDescription.innerHTML = item.data.description;

    pointers.mainPage.classList.add("hidden");
    pointers.detailsPage.classList.remove("hidden");
}


const onClearClick = () => {
    pointers.searchInput.value = '';
    toggleCarouselAndDescription(false);
    toggleSortAndCancelIcons(false);

    if (itemsListView)
        itemsListView.search(null, sort);
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
            }, sort);
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