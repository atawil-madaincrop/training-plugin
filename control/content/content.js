
import { ShowControler } from "./js/showControler.js";
import { EventHandlers } from "./js/eventHandlers.js";

// Get elements from HTML
let addItemBtn = document.getElementById("add-New-Item_btn");
let cancelAdding = document.getElementById("cancel-Adding-Process");
let addItemContainer = document.getElementById("add-New-Item-To-DataStore");
let title = document.getElementById("title");
let subTitle = document.getElementById("subTitle");
let getSearch = document.getElementById("getSearch");
let getSearchInput = document.getElementById("getSearchInput");
let iconPlcaeCancelSearch = document.getElementById("iconPlcaeCancelSearch");
iconPlcaeCancelSearch.style.display = "none";

// Add Events Listener to manage data
addItemBtn.addEventListener('click', () => EventHandlers.showAddModal(true));
cancelAdding.addEventListener('click', () => EventHandlers.showAddModal(false));
addItemContainer.addEventListener('click', EventHandlers.submitNewItem);
title.addEventListener('input', EventHandlers.handelTitle);
subTitle.addEventListener('input', EventHandlers.handelSubTitle);
getSearch.addEventListener('click', EventHandlers.getSearchItems)
getSearchInput.addEventListener('input', EventHandlers.changeIcon)
iconPlcaeCancelSearch.addEventListener('click', EventHandlers.resetSearch)

// Init WYSIWYG
const initTiny = (selector) => {
    tinymce.init({
        selector: selector,
        setup: editor => {
            editor.on('input', (e) => EventHandlers.handelTiny(e));
            editor.on('change', (e) => EventHandlers.handelTiny(e));
        }
    });
}
// Init Thumbnail
const initThumbnail = () => {
    EventHandlers.image = new buildfire.components.images.thumbnail("#image", {
        imageUrl: '',
        title: "List Image & Cover Image *",
        dimensionsLabel: "Recommended: 600x600",
        multiSelection: false
    });
    EventHandlers.coverImage = new buildfire.components.images.thumbnail("#imageCover", {
        imageUrl: '',
        title: "cover",
        dimensionsLabel: "Recommended: 1200x675",
        multiSelection: false
    });

    EventHandlers.image.onDelete = (imageUrl) => {
        EventHandlers.newItem.image = null;
    };
    EventHandlers.coverImage.onDelete = (imageUrl) => {
        EventHandlers.newItem.coverImage = null;
    };

    EventHandlers.image.onChange = (imageUrl) => {
        EventHandlers.newItem.image = imageUrl;
    };
    EventHandlers.coverImage.onChange = (imageUrl) => {
        EventHandlers.newItem.coverImage = imageUrl;
    };
}
// Init all functionality ...
const init = async () => {
    await EventHandlers.loadItems();
    ShowControler.printItems(ShowControler.mySateArr);
    EventHandlers.setAddBtn();

    initTiny("#wysiwygContent");
    initThumbnail();
}

init();