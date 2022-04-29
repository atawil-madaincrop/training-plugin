import Item from "../../widget/common/entities/Item.js";
import ContentController from "./content.controller.js";

let section, searchTableHelper, search, itemsCount, selectedItem, itemDetailsState, imageThumbnail, coverImageThumbnail, itemDetailsDescriptionEditor;
const body = document.querySelector("body");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const introductionTabLink = document.getElementById("introduction-tab-link");
const emptyState = document.getElementById("empty-state");
const itemsTable = document.getElementById("items-table");
const addItemButton = document.getElementById("add-item-button");
const addSampleDataButton = document.getElementById("add-sample-data");
const itemsPage = document.getElementById("items-page");
const itemsFixedPart = document.getElementById("items-fixed-part");
const itemDetailsSubPage = document.getElementById("item-details-sub-page");
const itemDetailsBottomActions = document.getElementById("item-details-bottom-actions");
const itemDetailsCancleButton = document.getElementById("item-details-cancel-button");
const itemDetailsSaveButton = document.getElementById("item-details-save-button");
const itemDetailsTitleInput = document.getElementById("item-details-title-input");
const itemDetailsSubtitleInput = document.getElementById("item-details-subtitle-input");

const initItemsTable = async () => {
    const filterFixed = {
        "$json.deletedOn": { "$eq": null },
    }

    const sort = {
        title: 1,
    }

    const onRowEdit = (obj, tr) => {
        goToItemDetailsSubPage(obj, "edit", true);
    }

    const onRowDelete = async (obj, tr) => {
        await ContentController.deleteItem(obj.id);
        checkItemsEmptyState(itemsCount - 1);
    }

    searchTableHelper = new SearchTableHelper("items-table", ContentController.itemsTag(), searchTableConfig, filterFixed, sort, onRowEdit, onRowDelete);

    searchTableHelper.search(null, (res) => {
        checkItemsEmptyState(res && res.length);
        tableResize();
    });

    searchTableHelper.onCommand('open-item-detials', (obj, tr) => {
        goToItemDetailsSubPage(obj, "edit", true);
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

        validateItemForm();
    }

    const onDeleteImage = (key, imageUrl) => {
        if (!selectedItem) return;

        selectedItem.data[key] = null;
        validateItemForm();
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

const initItemDetailsDescriptionEditor = async () => {
    await tinymce.init({
        selector: "#item-details-description",
        setup: (editor) => {
            itemDetailsDescriptionEditor = editor;
        },
    });
}

const initListeners = () => {
    window.onresize = () => tableResize();
    buildfire.messaging.onReceivedMessage = (message) => onMessageHandler(message);
    introductionTabLink.onclick = () => navigateToTab("Introduction");
    addItemButton.onclick = () => onAddItemClick();
    addSampleDataButton.onclick = () => addDummyItemsData();
    searchButton.onclick = () => onItemsSearch();
    itemDetailsSaveButton.onclick = () => onItemDetailsSave();
    itemDetailsCancleButton.onclick = () => goToItemsPage(true);
    itemDetailsTitleInput.onkeyup = (e) => validateItemForm();
    itemDetailsSubtitleInput.onkeyup = (e) => validateItemForm();
}

const onAddItemClick = () => {
    goToItemDetailsSubPage({ data: {} }, 'create', false);
}

const onItemDetailsSave = async () => {
    if (!validateItemForm()) return;

    switch (itemDetailsState) {
        case "edit":
            await ContentController.updateItem(selectedItem.id, selectedItem.data);
            break;
        case "create":
            await ContentController.addItem(selectedItem.data);
            break;
    }

    goToItemsPage(true);
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

const validateItemForm = () => {
    let hasError = false;
    selectedItem.data.title = itemDetailsTitleInput.value;
    selectedItem.data.subtitle = itemDetailsSubtitleInput.value;
    if (itemDetailsDescriptionEditor) selectedItem.data.description = itemDetailsDescriptionEditor.getContent();

    if (!itemDetailsTitleInput.checkValidity()) {
        hasError = true;
    }

    if (!itemDetailsSubtitleInput.checkValidity()) {
        hasError = true;
    }

    if (!selectedItem.data.image) {
        hasError = true;
    }

    if (!selectedItem.data.coverImage) {
        hasError = true;
    }

    itemDetailsSaveButton.disabled = hasError;
    return !hasError;
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

const goToItemsPage = (notifyWidget) => {
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

    if (notifyWidget)
        sendMessageToWidget();
}

const goToItemDetailsSubPage = (item, state, notifyWidget) => {
    section = "item-details";
    selectedItem = item;
    itemDetailsState = state;

    itemDetailsTitleInput.value = selectedItem?.data.title || '';
    itemDetailsSubtitleInput.value = selectedItem?.data.subtitle || '';
    if (itemDetailsDescriptionEditor) itemDetailsDescriptionEditor.setContent(selectedItem?.data.description || '');
    if (imageThumbnail) imageThumbnail.loadbackground(selectedItem?.data.image || '');
    if (coverImageThumbnail) coverImageThumbnail.loadbackground(selectedItem?.data.coverImage || '');

    itemsPage.classList.add("hidden");
    itemDetailsSubPage.classList.remove("hidden");
    itemDetailsBottomActions.classList.remove("hidden");

    validateItemForm();

    if (notifyWidget)
        sendMessageToWidget();
}

const tableResize = () => {
    const thead = itemsTable.querySelector('thead');
    const tbody = itemsTable.querySelector('tbody');

    const bodyHeight = getAbsoluteHeight(body);
    const itemsFixedPartHeight = getAbsoluteHeight(itemsFixedPart);
    const theadHeight = getAbsoluteHeight(thead);

    tbody.style.maxHeight = (bodyHeight - itemsFixedPartHeight - theadHeight) + 'px';
}

function getAbsoluteHeight(el) {
    el = (typeof el === 'string') ? document.querySelector(el) : el;

    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    const margin = parseFloat(styles['marginTop']) +
        parseFloat(styles['marginBottom']);

    return parseFloat(rect.height.toFixed(2)) + margin;
}

const sendMessageToWidget = (message) => {
    buildfire.messaging.sendMessageToWidget({
        section: section,
        item: selectedItem,
        ...message,
    });
}

const onMessageHandler = (message) => {
    if (message.section)
        switch (message.section) {
            case 'items':
                goToItemsPage(false);
                break;
            case 'item-details':
                if (!message.item) return;
                goToItemDetailsSubPage(message.item, 'edit', false);
                break;
        }
}

const init = async () => {
    section = "items";

    initItemsTable();
    initThumbnailPickers();
    initListeners();
    initItemDetailsDescriptionEditor();
}

init();