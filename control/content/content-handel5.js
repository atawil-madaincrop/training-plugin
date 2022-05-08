pointers.iconPlcaeCancelSearch.style.display = "none";

// Add Events Listener to manage data
pointers.addItemBtn.addEventListener('click', () => ShowController.showAddModal(true));
pointers.cancelAdding.addEventListener('click', () => {
    clearTimeout(pointers.timer);
    pointers.timer = setTimeout(function () {
        ShowController.showAddModal(false,true)
    }, 50)
});
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
        EventHandlers.handelImage('delete', 'image', imageUrl) 
        
    };
    ShowController.coverImage.onDelete = (imageUrl) => {
        EventHandlers.handelImage('delete', 'coverImage', imageUrl) 
        
    };

    ShowController.image.onChange = (imageUrl) => {
        EventHandlers.handelImage('add', 'image', imageUrl) 
        
    };
    ShowController.coverImage.onChange = (imageUrl) => {
        EventHandlers.handelImage('add', 'coverImage', imageUrl) 
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