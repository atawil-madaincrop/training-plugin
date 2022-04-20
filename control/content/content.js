import Item from "../../widget/common/entities/Item.js";
import Items from "../../widget/common/repository/Items.js";
import ContentController from "./content.controller.js";

let searchTableHelper, search, itemsCount;
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const introductionTabLink = document.getElementById("introduction-tab-link");
const emptyState = document.getElementById("empty-state");
const itemsTable = document.getElementById("items-table");
const addSampleDataButton = document.getElementById("add-sample-data");

const initItemsTable = async () => {
    const filterFixed = {
        "$json.deletedOn": { "$eq": null },
    }

    const onRowDelete = async (obj, tr) => {
        await ContentController.deleteItem(obj.id, obj.data);
        checkItemsEmptyState(itemsCount - 1);
    }

    searchButton.onclick = () => {
        search = searchInput.value;
        searchTableHelper.search({
            $or: [
                { "$json.title": { "$regex": search, "$options": "i" } },
                { "$json.subtitle": { "$regex": search, "$options": "i" } },
            ],
        });
    }

    searchTableHelper = new SearchTableHelper("items-table", Items.TAG, searchTableConfig, filterFixed, onRowDelete);
    searchTableHelper.search(null, (res) => {
        checkItemsEmptyState(res && res.length);
    });
}

const initListeners = () => {
    introductionTabLink.onclick = () => navigateToTab("Introduction");
    addSampleDataButton.onclick = () => addDummyItemsData();
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

const init = async () => {
    initItemsTable();
    initListeners();
}

init();