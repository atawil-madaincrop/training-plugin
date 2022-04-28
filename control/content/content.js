import Item from "../../widget/common/entities/Item.js";
import ContentController from "./content.controller.js";

let section, searchTableHelper, search, itemsCount, selectedItem, itemDetailsState, imageThumbnail, coverImageThumbnail, itemDetailsDescriptionEditor;
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
        goToItemDetailsSubPage(obj, "edit");
    }

    const onRowDelete = async (obj, tr) => {
        await ContentController.deleteItem(obj.id);
        checkItemsEmptyState(itemsCount - 1);
    }

    searchTableHelper = new SearchTableHelper("items-table", ContentController.itemsTag(), searchTableConfig, filterFixed, sort, onRowEdit, onRowDelete);

    searchTableHelper.search(null, (res) => {
        checkItemsEmptyState(res && res.length);
    });

    searchTableHelper.onCommand('open-item-detials', (obj, tr) => {
        goToItemDetailsSubPage(obj, "edit");
    });
}

const initThumbnailPickers = () => {
    const onChangeImage = (key, aspectRatio, imageUrl) => {
        if (!selectedItem || selectedItem.data[key] == imageUrl) return;

        let croppedImage = buildfire.imageLib.cropImage(imageUrl, { size: "half_width", aspect: aspectRatio });
        selectedItem.data[key] = croppedImage;

        switch (key) {
            case 'image':
                if (imageThumbnail.imageUrl == croppedImage) return;
                imageThumbnail.loadbackground(croppedImage)
                break;

            case 'coverImage':
                if (coverImageThumbnail.imageUrl == croppedImage) return;
                coverImageThumbnail.loadbackground(croppedImage)
                break;
        }

    }

    const onDeleteImage = (key, imageUrl) => {
        if (!selectedItem) return;
        selectedItem.data[key] = null;
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

    imageThumbnail.onChange = (imageUrl) => onChangeImage('image', '1:1', imageUrl);
    imageThumbnail.onDelete = (imageUrl) => onDeleteImage('image', imageUrl);

    coverImageThumbnail.onChange = (imageUrl) => onChangeImage('coverImage', '16:9', imageUrl);
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
    selectedItem.data.title = itemDetailsTitleInput.value;
    selectedItem.data.subtitle = itemDetailsSubtitleInput.value;
    if (itemDetailsDescriptionEditor) selectedItem.data.description = itemDetailsDescriptionEditor.getContent();

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

    if (!selectedItem.data.image) {
        showError(itemDetailsImagesError, 'Please insert the images.');
        hasError = true;
    } else {
        hideError(itemDetailsImagesError);
    }

    if (!selectedItem.data.coverImage) {
        showError(itemDetailsImagesError, 'Please insert the images.');
        hasError = true;
    } else {
        hideError(itemDetailsImagesError);
    }

    if (hasError) return;

    switch (itemDetailsState) {
        case "edit":
            await ContentController.updateItem(selectedItem.id, selectedItem.data);
            break;
        case "create":
            await ContentController.addItem(selectedItem.data);
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
    section = "items";
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

    sendMessageToWidget();
}

const goToItemDetailsSubPage = (item, state) => {
    section = "item-details";
    selectedItem = item;
    itemDetailsState = state;

    console.log({ selectedItem })
    itemDetailsTitleInput.value = selectedItem?.data.title || '';
    itemDetailsSubtitleInput.value = selectedItem?.data.subtitle || '';
    if (itemDetailsDescriptionEditor) itemDetailsDescriptionEditor.setContent(selectedItem?.data.description || '');
    if (imageThumbnail) imageThumbnail.loadbackground(selectedItem?.data.image || '');
    if (coverImageThumbnail) coverImageThumbnail.loadbackground(selectedItem?.data.coverImage || '');

    itemsPage.classList.add("hidden");
    itemDetailsSubPage.classList.remove("hidden");
    itemDetailsBottomActions.classList.remove("hidden");

    hideError(itemDetailsTitleInputError);
    hideError(itemDetailsSubtitleInputError);
    hideError(itemDetailsImagesError);

    sendMessageToWidget();
}

const showError = (element, text) => {
    element.innerHTML = text;
    element.classList.remove('invisible');
}

const hideError = (element) => {
    element.innerHTML = '';
    element.classList.add('invisible');
}

const sendMessageToWidget = (message) => {
    buildfire.messaging.sendMessageToWidget({
        section: section,
        item: selectedItem,
        ...message,
    });
}

const init = async () => {
    section = "items";

    initItemsTable();
    initThumbnailPickers();
    initListeners();
    initItemDetailsDescriptionEditor();
    sendMessageToWidget();
}

init();