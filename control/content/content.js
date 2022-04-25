import { ShowControler } from "./js/showControler.js";
import { EventHandlers } from "./js/eventHandlers.js";


// Get elements from HTML
import { pointers } from "./js/pointers.js";
pointers.iconPlcaeCancelSearch.style.display = "none";

// Add Events Listener to manage data
pointers.addItemBtn.addEventListener('click', () => ShowControler.showAddModal(true));
pointers.cancelAdding.addEventListener('click', () => ShowControler.showAddModal(false));
pointers.addItemContainer.addEventListener('click', EventHandlers.submitNewItem);
pointers.title.addEventListener('input', EventHandlers.handelTitle);
pointers.subTitle.addEventListener('input', EventHandlers.handelSubTitle);
pointers.getSearch.addEventListener('click', EventHandlers.getSearchItems);
pointers.iconPlcaeCancelSearch.addEventListener('click', EventHandlers.resetSearch);
pointers.sortSpan.addEventListener('click', ShowControler.sortData);
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
    ShowControler.image = new buildfire.components.images.thumbnail("#image", {
        imageUrl: '',
        title: "List Image & Cover Image *",
        dimensionsLabel: "Recommended: 600x600",
        multiSelection: false
    });
    ShowControler.coverImage = new buildfire.components.images.thumbnail("#imageCover", {
        imageUrl: '',
        title: "cover",
        dimensionsLabel: "Recommended: 1200x675",
        multiSelection: false
    });

    ShowControler.image.onDelete = (imageUrl) => {
        ShowControler.newItem.image = null;
    };
    ShowControler.coverImage.onDelete = (imageUrl) => {
        ShowControler.newItem.coverImage = null;
    };

    ShowControler.image.onChange = (imageUrl) => {
        ShowControler.newItem.image = imageUrl;
    };
    ShowControler.coverImage.onChange = (imageUrl) => {
        ShowControler.newItem.coverImage = imageUrl;
    };
}
// Init all functionality ...
const init = async () => {
    await EventHandlers.loadItems();
    ShowControler.printItems();
    EventHandlers.setAddBtn();

    initTiny("#wysiwygContent");
    initThumbnail();
}
init();