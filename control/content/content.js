import Item from "../../widget/common/entities/Item.js";
import ContentController from "./content.controller.js";

let searchTableHelper, search, itemsCount, selectedItemId, selectedItem, state, imageThumbnail, coverImageThumbnail, itemDetailsDescriptionEditor;
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const introductionTabLink = document.getElementById("introduction-tab-link");
const emptyState = document.getElementById("empty-state");
const itemsTable = document.getElementById("items-table");
const addItemButton = document.getElementById("add-item-button");
const addSampleDataButton = document.getElementById("add-sample-data");
const itemsPage = document.getElementById("items-page");
const itemDetailsSubPage = document.getElementById("item-details-sub-page");
const itemDetailsBottomActions = document.getElementById("item-details-bottom-actions");
const itemDetailsCancleButton = document.getElementById("item-details-cancel-button");
const itemDetailsSaveButton = document.getElementById("item-details-save-button");
const itemDetailsTitleInput = document.getElementById("item-details-title-input");
const itemDetailsSubtitleInput = document.getElementById("item-details-subtitle-input");
const itemDetailsTitleInputError = document.getElementById("item-details-title-input-error");
const itemDetailsSubtitleInputError = document.getElementById("item-details-subtitle-input-error");
const itemDetailsImagesError = document.getElementById("item-details-images-error");

const initItemsTable = async () => {
    const filterFixed = {
        "$json.deletedOn": { "$eq": null },
    }

    const sort = {
        title: 1,
    }

    const onRowEdit = (obj, tr) => {
        goToItemDetailsSubPage(obj.id, obj.data, "edit");
    }

    const onRowDelete = async (obj, tr) => {
        await ContentController.deleteItem(obj.id, obj.data);
        checkItemsEmptyState(itemsCount - 1);
    }

    searchTableHelper = new SearchTableHelper("items-table", ContentController.itemsTag(), searchTableConfig, filterFixed, sort, onRowEdit, onRowDelete);

    searchTableHelper.search(null, (res) => {
        checkItemsEmptyState(res && res.length);
    });

    searchTableHelper.onCommand('open-item-detials', (obj, tr) => {
        goToItemDetailsSubPage(obj.id, obj.data, "edit");
    });
}

const initThumbnailPickers = () => {
    const onChangeImage = (key, imageUrl) => {
        if (!selectedItem) return;
        selectedItem[key] = imageUrl;
    }

    const onDeleteImage = (key, imageUrl) => {
        if (!selectedItem) return;
        selectedItem[key] = null;
    }

    imageThumbnail = new buildfire.components.images.thumbnail("#image-thumbnail", {
        imageUrl: '',
        title: " ",
        dimensionsLabel: "Recommended: 600 x 600px",
        multiSelection: false
    });

    coverImageThumbnail = new buildfire.components.images.thumbnail("#cover-image-thumbnail", {
        imageUrl: '',
        title: " ",
        dimensionsLabel: "Recommended: 1200x675px",
        multiSelection: false
    });

    imageThumbnail.onChange = (imageUrl) => onChangeImage('image', imageUrl);
    imageThumbnail.onDelete = (imageUrl) => onDeleteImage('image', imageUrl);

    coverImageThumbnail.onChange = (imageUrl) => onChangeImage('coverImage', imageUrl);
    coverImageThumbnail.onDelete = (imageUrl) => onDeleteImage('coverImage', imageUrl);
}

const initListeners = () => {
    introductionTabLink.onclick = () => navigateToTab("Introduction");
    addItemButton.onclick = () => onAddItemClick();
    addSampleDataButton.onclick = () => addDummyItemsData();
    searchButton.onclick = () => onItemsSearch();
    itemDetailsSaveButton.onclick = () => onItemDetailsSave();
    itemDetailsCancleButton.onclick = () => goToItemsPage();
}

const onAddItemClick = () => {
    goToItemDetailsSubPage(null, new Item(), "create");
}

const onItemDetailsSave = async () => {
    let hasError = false;
    selectedItem.title = itemDetailsTitleInput.value;
    selectedItem.subtitle = itemDetailsSubtitleInput.value;
    if (itemDetailsDescriptionEditor) selectedItem.description = itemDetailsDescriptionEditor.getContent();

    if (!itemDetailsTitleInput.checkValidity()) {
        showError(itemDetailsTitleInputError, 'Please insert the title.');
        hasError = true;
    } else {
        hideError(itemDetailsTitleInputError);
    }

    if (!itemDetailsSubtitleInput.checkValidity()) {
        showError(itemDetailsSubtitleInputError, 'Please insert the subtitle.');
        hasError = true;
    } else {
        hideError(itemDetailsSubtitleInputError);
    }

    if (!selectedItem.image) {
        showError(itemDetailsImagesError, 'Please insert the images.');
        hasError = true;
    } else {
        hideError(itemDetailsImagesError);
    }

    if (!selectedItem.coverImage) {
        showError(itemDetailsImagesError, 'Please insert the images.');
        hasError = true;
    } else {
        hideError(itemDetailsImagesError);
    }

    if (hasError) return;

    switch (state) {
        case "edit":
            await ContentController.updateItem(selectedItemId, selectedItem);
            break;
        case "create":
            await ContentController.addItem(selectedItem);
            break;
    }

    goToItemsPage();
}

const initItemDetailsDescriptionEditor = async () => {
    await tinymce.init({
        selector: "#item-details-description",
        setup: (editor) => {
            itemDetailsDescriptionEditor = editor;
        },
    });
}

const onItemsSearch = () => {
    search = searchInput.value;

    if (searchTableHelper)
        searchTableHelper.search({
            $or: [
                { "$json.title": { "$regex": search, "$options": "i" } },
                { "$json.subtitle": { "$regex": search, "$options": "i" } },
            ],
        });
}

const checkItemsEmptyState = (count) => {
    itemsCount = count;
    if (itemsCount > 0) {
        itemsTable.classList.remove("hidden");
        emptyState.classList.add("hidden");
    } else {
        itemsTable.classList.add("hidden");
        emptyState.classList.remove("hidden");
    }
}

const addDummyItemsData = () => {
    const promises = [
        ContentController.addItem(new Item({ title: 'item 1', subtitle: 'item subtitle 1', image: "https://placekitten.com/400", coverImage: "https://placekitten.com/800/400" })),
        ContentController.addItem(new Item({ title: 'item 2', subtitle: 'item subtitle 2', image: "https://placekitten.com/400", coverImage: "https://placekitten.com/800/400" })),
        ContentController.addItem(new Item({ title: 'item 3', subtitle: 'item subtitle 3', image: "https://placekitten.com/400", coverImage: "https://placekitten.com/800/400" })),
    ];

    Promise.all(promises).then((values) => {
        if (searchTableHelper)
            searchTableHelper.search(null, (res) => {
                checkItemsEmptyState(res && res.length);
            });
    });
}

const navigateToTab = (tab) => {
    buildfire.navigation.navigateToTab(
        {
            tabTitle: tab,
        },
        (err) => {
            if (err) return console.error(err);
        }
    );
}

const goToItemsPage = () => {
    selectedItemId = null;
    selectedItem = null;

    itemsPage.classList.add("slide-in");
    itemsPage.classList.remove("hidden");
    itemDetailsSubPage.classList.add("hidden");
    itemDetailsBottomActions.classList.add("hidden");

    if (searchTableHelper)
        searchTableHelper.search(null, (res) => {
            checkItemsEmptyState(res && res.length);
        });

    if (imageThumbnail) imageThumbnail.clear();
    if (coverImageThumbnail) coverImageThumbnail.clear();
}

const goToItemDetailsSubPage = (id, item, newState) => {
    selectedItemId = id;
    selectedItem = item;
    state = newState;

    itemDetailsTitleInput.value = item?.title || '';
    itemDetailsSubtitleInput.value = item?.subtitle || '';
    if (itemDetailsDescriptionEditor) itemDetailsDescriptionEditor.setContent(item?.description || '');
    if (imageThumbnail) imageThumbnail.loadbackground(selectedItem?.image || '');
    if (coverImageThumbnail) coverImageThumbnail.loadbackground(selectedItem?.coverImage || '');

    itemsPage.classList.add("hidden");
    itemDetailsSubPage.classList.remove("hidden");
    itemDetailsBottomActions.classList.remove("hidden");

    hideError(itemDetailsTitleInputError);
    hideError(itemDetailsSubtitleInputError);
    hideError(itemDetailsImagesError);
}

const showError = (element, text) => {
    element.innerHTML = text;
    element.classList.remove('invisible');
}

const hideError = (element) => {
    element.innerHTML = '';
    element.classList.add('invisible');
}

const init = async () => {
    initItemsTable();
    initThumbnailPickers();
    initListeners();
    initItemDetailsDescriptionEditor();
}

init();