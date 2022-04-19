import Items from "../../widget/common/repository/Items.js";

let search;
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");

const initItemsTable = () => {
    let searchTableHelper = new SearchTableHelper("itemsTable", Items.TAG, searchTableConfig);
    searchTableHelper.search();

    searchButton.onclick = () => {
        search = searchInput.value;
        searchTableHelper.search({
            $or: [
                { "$json.title": { "$regex": search, "$options": "i" } },
                { "$json.subtitle": { "$regex": search, "$options": "i" } },
            ],
            "$json.deletedOn": { "$eq": null },
        });
    }
}

const init = async () => {
    initItemsTable();
}

init();