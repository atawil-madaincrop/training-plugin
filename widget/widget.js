import WidgetController from "./widget.controller.js";
import { pointers } from './js/pointers.js';

let introduction, language, imageCarousel, itemsListView, itemsLoaded, sort, selectedItem, section, searchMode, onDatastoreUpdate;

const initCarousel = () => {
    if (!imageCarousel) {
        imageCarousel = new buildfire.components.carousel.view(pointers.carousel, introduction.imageCarousel, "WideScreen");
    } else {
        imageCarousel.loadItems(introduction.imageCarousel);
    }

    pointers.carouselLoadingState.classList.add('hidden');
}

const initDescription = () => {
    pointers.description.innerHTML = introduction.description;
}

const initLanguageValues = () => {
    pointers.searchInput.placeholder = language.search || '';
}

const initItemsListView = async () => {
    const filterFixed = {
        "$json.deletedOn": { "$eq": null },
    }

    sort = {
        title: 1,
    }

    itemsListView = new ListViewHelper(pointers.itemsListView, WidgetController.itemsTag(), pointers.content, filterFixed, sort);
    itemsSearch(null, sort);

    itemsListView.onItemClicked((listViewItem) => {
        goToDetailsPage(listViewItem.data, true);
    });
}

const itemsSearch = (filter, sort, callback) => {
    itemsLoaded = false;
    pointers.itemsListView.classList.add('hidden');
    pointers.itemsListViewLoadingState.classList.remove('hidden');
    itemsListView.search(filter, sort, () => {
        itemsLoaded = true;
        pointers.itemsListViewLoadingState.classList.add('hidden');
        checkEmptyState();
        if (callback) callback();
    });
}

const checkEmptyState = () => {
    if (introduction && !searchMode) {
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
        itemsLoaded &&
        pointers.carousel.classList.contains('hidden') &&
        pointers.description.classList.contains('hidden')
    ) {
        pointers.itemsListView.classList.add('solo');
        pointers.itemsListViewLoadingState.classList.add('solo');
    } else {
        pointers.itemsListView.classList.remove('solo');
        pointers.itemsListViewLoadingState.classList.remove('solo');
    }

    if (
        itemsLoaded &&
        pointers.carousel.classList.contains('hidden') &&
        pointers.description.classList.contains('hidden') &&
        pointers.itemsListView.classList.contains('hidden')
    ) {
        pointers.content.classList.add('hidden');
        pointers.mainEmptyState.classList.remove('hidden');
    } else {
        pointers.content.classList.remove('hidden');
        pointers.mainEmptyState.classList.add('hidden');
    }
}

const checkItemDetailsEmptyState = () => {
    if (selectedItem.data.image) {
        pointers.itemImage.src = selectedItem.data.image;
        pointers.itemImage.classList.remove("hidden");
        pointers.itemImageEmptyState.classList.add("hidden");
    } else {
        pointers.itemImage.src = '';
        pointers.itemImage.classList.add("hidden");
        pointers.itemImageEmptyState.classList.remove("hidden");
    }

    if (selectedItem.data.coverImage) {
        pointers.itemCoverImage.src = selectedItem.data.coverImage;
        pointers.itemCoverImage.classList.remove("hidden");
        pointers.itemCoverImageEmptyState.classList.add("hidden");
    } else {
        pointers.itemCoverImage.src = '';
        pointers.itemCoverImage.classList.add("hidden");
        pointers.itemCoverImageEmptyState.classList.remove("hidden");
    }

    if (
        pointers.itemImage.classList.contains('hidden') &&
        pointers.itemCoverImage.classList.contains('hidden')
    ) {
        pointers.itemImagesContainer.classList.add('hidden');
    } else {
        pointers.itemImagesContainer.classList.remove('hidden');
    }

    if (selectedItem.data.title) {
        pointers.itemTitle.classList.remove("hidden");
    } else {
        pointers.itemTitle.classList.add("hidden");
    }

    if (selectedItem.data.subtitle) {
        pointers.itemSubtitle.classList.remove("hidden");
    } else {
        pointers.itemSubtitle.classList.add("hidden");
    }

    if (selectedItem.data.description) {
        pointers.itemDescription.classList.remove("hidden");
    } else {
        pointers.itemDescription.classList.add("hidden");
    }

    if (
        pointers.itemTitle.classList.contains('hidden') &&
        pointers.itemSubtitle.classList.contains('hidden') &&
        pointers.itemDescription.classList.contains('hidden') &&
        pointers.itemImagesContainer.classList.contains('hidden')
    ) {
        pointers.itemDetailsEmptyState.classList.remove('hidden');
    } else {
        pointers.itemDetailsEmptyState.classList.add('hidden');
    }
}

const removeItemDetailsShimmers = () => {
    pointers.itemImageEmptyState.classList.remove("shimmer");
    pointers.itemCoverImageEmptyState.classList.remove("shimmer");
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
    buildfire.datastore.onUpdate((event) => onDatastoreUpdateHandler(event));
    buildfire.navigation.onBackButtonClick = () => onBackClick();
    buildfire.messaging.onReceivedMessage = (message) => onMessageHandler(message);
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
    switch (section) {
        case 'item-details':
            goToMainPage(true);
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
                        itemsSearch(null, sort);
                    }
                    break;

                case 'sortDescending':
                    if (sort.title > 0) {
                        sort.title = -1;
                        itemsSearch(null, sort);
                    }
                    break;
            }

            buildfire.components.drawer.closeDrawer();
        }
    );
}

const goToMainPage = (notifyControl) => {
    section = 'items';
    selectedItem = null;

    pointers.mainPage.classList.add("slide-in");
    pointers.mainPage.classList.remove("hidden");
    pointers.detailsPage.classList.add("hidden");

    if (notifyControl)
        sendMessageToControl();
}

const goToDetailsPage = (item, notifyControl) => {
    section = 'item-details';
    selectedItem = item;

    if (pointers.itemImage.src) pointers.itemImage.src = item.data.image;
    if (pointers.itemCoverImage.src) pointers.itemCoverImage.src = item.data.coverImage;
    pointers.itemTitle.innerHTML = item.data.title;
    pointers.itemSubtitle.innerHTML = item.data.subtitle;
    pointers.itemDescription.innerHTML = item.data.description;

    pointers.mainPage.classList.add("hidden");
    pointers.detailsPage.classList.remove("hidden");

    removeItemDetailsShimmers();
    checkItemDetailsEmptyState();

    if (notifyControl)
        sendMessageToControl();
}


const onClearClick = () => {
    pointers.searchInput.value = '';
    toggleCarouselAndDescription(false);
    toggleSortAndCancelIcons(false);

    if (itemsListView)
        itemsSearch(null, sort);

    pointers.itemsListView.classList.remove('search-mode');
    pointers.itemsListViewLoadingState.classList.remove('search-mode');
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
        searchMode = true;
        pointers.itemsListView.classList.add('search-mode');
        pointers.itemsListViewLoadingState.classList.add('search-mode');
        toggleSortAndCancelIcons(true);
        toggleCarouselAndDescription(true);
    } else {
        searchMode = false;
        pointers.itemsListView.classList.remove('search-mode');
        pointers.itemsListViewLoadingState.classList.remove('search-mode');
        toggleSortAndCancelIcons(false);
        toggleCarouselAndDescription(false);
    }

    if (itemsListView) {
        if (
            !pointers.carousel.classList.contains('hidden') ||
            !pointers.description.classList.contains('hidden')
        ) {
            pointers.itemsListView.classList.remove('solo');
            pointers.itemsListViewLoadingState.classList.remove('solo');
        }

        pointers.itemsListView.classList.add('hidden');
        pointers.itemsListViewLoadingState.classList.remove('hidden');

        debounce('search', () => {
            itemsSearch({
                $or: [
                    { "$json.title": { "$regex": value, "$options": "i" } },
                    { "$json.subtitle": { "$regex": value, "$options": "i" } },
                ],
            }, sort);
        }, 500);
    }
}

const debounce = (key, callback, wait) => {
    if (key) clearTimeout(key);
    setTimeout(callback, wait);
}

const onDatastoreUpdateHandler = (event) => {
    switch (event.tag) {
        case WidgetController.introductionTag():
            onIntroductionUpdate(event.data);
            break;

        case WidgetController.languageTag():
            onLanguageUpdate(event.data);
            break;

        case WidgetController.itemsTag():
            onItemsUpdate(event.data);
            break;
    }

    checkEmptyState();
}

const onIntroductionUpdate = (data) => {
    introduction = data;
    initCarousel();
    initDescription();
}

const onLanguageUpdate = (data) => {
    language = data;
    initLanguageValues();
}

const onItemsUpdate = (data) => {
    itemsSearch(null, sort);
}

const sendMessageToControl = (message) => {
    buildfire.messaging.sendMessageToControl({
        section: section,
        item: selectedItem,
        ...message,
    });
}

const onMessageHandler = (message) => {
    if (message.section)
        switch (message.section) {
            case 'items':
                goToMainPage(false);
                break;
            case 'item-details':
                if (!message.item) return;
                goToDetailsPage(message.item, false);
                break;
        }
}

const init = async () => {
    load();
    initItemsListView();
    initListeners();
}

init();