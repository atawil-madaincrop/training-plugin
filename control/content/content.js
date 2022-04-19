import Items from "../../widget/common/repository/Items.js";
import ContentController from "./content.controller.js";

let search;
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const introductionTabLink = document.getElementById("introduction-tab-link");

const initItemsTable = async () => {
    const filterFixed = {
        "$json.deletedOn": { "$eq": null },
    }

    const onRowDelete = async (obj, tr) => {
        await ContentController.deleteItem(obj.id, obj.data);
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

    let searchTableHelper = new SearchTableHelper("itemsTable", Items.TAG, searchTableConfig, filterFixed, onRowDelete);
    searchTableHelper.search();
}

const initIntroductionTabLinkListener = () => {
    introductionTabLink.onclick = () => navigateToTab("Introduction");
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
    initIntroductionTabLinkListener();
}

init();