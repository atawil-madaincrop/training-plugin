import Item from "../../widget/common/entities/Item.js";
import Items from "../../widget/common/repository/Items.js";
import ContentController from "./content.controller.js";

let searchTableHelper, search, itemsCount, selectedItem, imageThumbnail, coverImageThumbnail, itemDetailsDescriptionEditor;
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const introductionTabLink = document.getElementById("introduction-tab-link");
const emptyState = document.getElementById("empty-state");
const itemsTable = document.getElementById("items-table");
const addSampleDataButton = document.getElementById("add-sample-data");
const itemsPage = document.getElementById("items-page");
const itemDetailsSubPage = document.getElementById("item-details-sub-page");
const itemDetailsBottomActions = document.getElementById("item-details-bottom-actions");
const itemDetailsCancleButton = document.getElementById("item-details-cancel-button");

const initItemsTable = async () => {
    const filterFixed = {
        "$json.deletedOn": { "$eq": null },
    }

    const onRowEdit = (obj, tr) => {
        gotToItemDetailsSubPage(obj);
    }

    const onRowDelete = async (obj, tr) => {
        await ContentController.deleteItem(obj.id, obj.data);
        checkItemsEmptyState(itemsCount - 1);
    }

    searchTableHelper = new SearchTableHelper("items-table", Items.TAG, searchTableConfig, filterFixed, onRowEdit, onRowDelete);
    searchTableHelper.search(null, (res) => {
        checkItemsEmptyState(res && res.length);
    });
}

const initListeners = () => {
    introductionTabLink.onclick = () => navigateToTab("Introduction");
    addSampleDataButton.onclick = () => addDummyItemsData();
    searchButton.onclick = () => onItemsSearch();
    itemDetailsCancleButton.onclick = () => goToItemsPage();
}

const initThumbnailPickers = () => {
    imageThumbnail = new buildfire.components.images.thumbnail("#image-thumbnail", {
        imageUrl: '',
        title: "Icon",
        dimensionsLabel: "400x400",
        multiSelection: false
    });

    imageThumbnail.init("#image-thumbnail");
}

const initItemDetailsDescriptionEditor = async () => {
    const onEditorUpdate = tinymce.util.Delay.debounce((e) => {
        // introduction.description = editor.getContent();
        // IntroductionController.saveIntroduction(introduction);
    }, 500);

    let editor;

    await tinymce.init({
        selector: "#item-details-description",
        setup: (e) => editor = e,
    });

    // editor.setContent(introduction.description);
    editor.on('keyup', onEditorUpdate);
    editor.on('change', onEditorUpdate);
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
        ContentController.addItem(new Item({ title: 'item 1', subtitle: 'item subtitle 1' })),
        ContentController.addItem(new Item({ title: 'item 2', subtitle: 'item subtitle 2' })),
        ContentController.addItem(new Item({ title: 'item 3', subtitle: 'item subtitle 3' })),
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
    selectedItem = null;

    itemsPage.classList.add("slide-in");
    itemsPage.classList.remove("hidden");
    itemDetailsSubPage.classList.add("hidden");
    itemDetailsBottomActions.classList.add("hidden");
}

const gotToItemDetailsSubPage = (item) => {
    selectedItem = item;

    itemsPage.classList.add("hidden");
    itemDetailsSubPage.classList.remove("hidden");
    itemDetailsBottomActions.classList.remove("hidden");
}

const init = async () => {
    initItemsTable();
    initThumbnailPickers();
    initListeners();
    initItemDetailsDescriptionEditor();
}

init();