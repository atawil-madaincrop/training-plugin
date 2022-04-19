import Items from "../../widget/common/repository/Items.js";

const initItemsTable = () => {
    let searchTableHelper = new SearchTableHelper("itemsTable", Items.TAG, searchTableConfig);
    searchTableHelper.search();
}

const init = async () => {
    initItemsTable();
}

init();