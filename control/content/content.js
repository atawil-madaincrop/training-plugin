import { ShowController } from "./js/showController.js";
import { EventHandlers } from "./js/eventHandlers.js";


// Get elements from HTML
import { pointers } from "./js/pointers.js";
pointers.iconPlcaeCancelSearch.style.display = "none";

// Add Events Listener to manage data
pointers.addItemBtn.addEventListener('click', () => ShowController.showAddModal(true));
pointers.cancelAdding.addEventListener('click', () => ShowController.showAddModal(false));
pointers.addItemContainer.addEventListener('click', EventHandlers.submitNewItem);
pointers.title.addEventListener('input', EventHandlers.handelTitle);
pointers.subTitle.addEventListener('input', EventHandlers.handelSubTitle);
pointers.getSearch.addEventListener('click', EventHandlers.getSearchItems);
pointers.iconPlcaeCancelSearch.addEventListener('click', EventHandlers.resetSearch);
pointers.sortSpan.addEventListener('click', ShowController.sortData);
pointers.getSearchInput.addEventListener('input', EventHandlers.setSearchTyping)

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
    ShowController.image = new buildfire.components.images.thumbnail("#image", {
        imageUrl: '',
        title: "List Image & Cover Image *",
        dimensionsLabel: "Recommended: 600x600",
        multiSelection: false
    });
    ShowController.coverImage = new buildfire.components.images.thumbnail("#imageCover", {
        imageUrl: '',
        title: "cover",
        dimensionsLabel: "Recommended: 1200x675",
        multiSelection: false
    });

    ShowController.image.onDelete = (imageUrl) => {
        ShowController.newItem.image = null;
        // EventHandlers.sendUpdatedItem();
    };
    ShowController.coverImage.onDelete = (imageUrl) => {
        ShowController.newItem.coverImage = null;
        // EventHandlers.sendUpdatedItem();
    };

    ShowController.image.onChange = (imageUrl) => {
        ShowController.newItem.image = imageUrl;
        // EventHandlers.sendUpdatedItem();
    };
    ShowController.coverImage.onChange = (imageUrl) => {
        ShowController.newItem.coverImage = imageUrl;
        // EventHandlers.sendUpdatedItem();
    };
}
// Init all functionality ...
const init = async () => {
    await EventHandlers.loadItems();
    ShowController.printItems();
    EventHandlers.setAddBtn();

    initTiny("#wysiwygContent");
    initThumbnail();
}
init();