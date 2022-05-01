

import { ContentBuilder } from "./content/contentBuilder.js";
import { LanguageBuilder } from "./language/languageBuilder.js";
import { pointers } from "./pointers.js";


let delay = 1000;
let timer;
export class EventHandlers {

    static resetSearchState = () => {
        this.setLoadingSearch('none');
        pointers.emptySearchPage.style.display = "none";

        pointers.introductionContainer.style.display = "block";
        pointers.clearIcon.style.display = "none";
        pointers.sortIcon.style.display = "block";

        pointers.contentItems.innerHTML = "";
        ContentBuilder.printItems(ContentBuilder.itemsRendered);
    }

    static setSearchState = () => {
        pointers.introductionContainer.style.display = "none";
        pointers.sortIcon.style.display = "none";
        pointers.clearIcon.style.display = "block";
    }

    static searchInputHandler = (e) => {
        pointers.emptySearchPage.style.display = "none";

        clearTimeout(timer);
        this.setLoadingSearch('block');
        pointers.contentItems.innerHTML = "";
        if (e.target.value.length > 0) {
            this.setSearchState();
            timer = setTimeout(async x => {
                await ContentBuilder.getSearchData(e.target.value);
                this.setLoadingSearch("none")
            }, delay, e)
        } else {
            this.resetSearchState();
        }
    }

    static clearSearchData = () => {
        pointers.searchInput.value = null;
        this.resetSearchState();
    }

    static setSortItems = () => {
        buildfire.components.drawer.open(
            {
                isHTML: true,
                listItems: [
                    { text: LanguageBuilder.language.sortAscending, selected: LanguageBuilder.selectedSort == "ascending" },
                    { text: LanguageBuilder.language.sortDescending, selected: LanguageBuilder.selectedSort == "descending" },
                ]
            },
            (err, result) => {
                if (err) return console.error(err);
                buildfire.components.drawer.closeDrawer();
                if (result.text == LanguageBuilder.language.sortAscending) {
                    LanguageBuilder.selectedSort = "ascending";
                } else if (result.text = LanguageBuilder.language.sortDescending) {
                    LanguageBuilder.selectedSort = "descending";
                }
                ContentBuilder.sortItems();
            }
        );

    }

    static setLoading = (type) => {
        pointers.loadingWidget.style.display = `${type}`;
    }

    static setLoadingSearch = (type) => {
        pointers.loadingSearch.style.display = `${type}`;
    }

    static messagingHandler = () => {
        buildfire.messaging.onReceivedMessage = (message) => {
            switch (message?.type) {
                case "openItem":
                    ContentBuilder.showItemPage(message.item);
                    break;
                case "closeItemPage":
                    ContentBuilder.backFunction();
                    break;
                case "updateItem":
                    ContentBuilder.update_Content(message.item)
                    break;
                case "testUpdatedData":
                    ContentBuilder.showItemPage(message.item);
                    break;
                case "addItem":
                    ContentBuilder.pushNewItem(message.item);
                    break;
                case "deleteItem":
                    ContentBuilder.removeItem(message.itemID);
                    break;
            }
        };
    }

    static init_Events = () => {
        pointers.searchInput.addEventListener("input", this.searchInputHandler);
        pointers.clearIcon.addEventListener("click", this.clearSearchData);
        pointers.sortIcon.addEventListener("click", this.setSortItems);

        this.messagingHandler();
    }
}