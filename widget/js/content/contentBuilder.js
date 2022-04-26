import { ContentManagement } from "./contentManagement.js";
import { LanguageBuilder } from "../language/languageBuilder.js";
import { pointers } from "../pointers.js";

export class ContentBuilder {
    static itemsRendered = [];
    static allItemsSorted = [];
    static page = 0;
    static pageSize = 10;

    static loadItems = async () => {
        let res = await ContentManagement.loadItems(this.page, this.pageSize, "");
        this.itemsRendered = res;

        pointers.contentItems.innerHTML = "";
        this.allItemsSorted = [];
        this.printItems(this.itemsRendered);
    }

    static printItems = (addItemsArr) => {
        addItemsArr.forEach(this.print_Item_By_Item);
        this.createLoadMoreContainer(addItemsArr.length);

        this.allItemsSorted = [...addItemsArr, ...this.allItemsSorted]
    }

    static print_Item_By_Item = (item, index) => {
        let row = document.createElement("div");
        row.className = "rowItem"
        row.setAttribute("id", `item-${index}`)
        row.innerHTML = `
            <section class="leftSection">
                <img src="${item.data.image || "./media/imagePlaceHolder.png"}" alt="item image" >
            </section>
            <section class="rightSection">
                <span class="titleSpan">${item.data.title}</span>
                <span class="subTitleSpan">${item.data.subtitle}</span>
            </section>
        `
        pointers.contentItems.appendChild(row);
    }

    static createLoadMoreContainer = (length) => {
        let loadMore = document.createElement("div");
        loadMore.setAttribute("id", "loadMoreDiv");
        if (length >= this.pageSize) {
            loadMore.innerHTML = `
            <button id="loadNewItems">
                Load More Items ...
            </button>
            `;
            pointers.contentItems.appendChild(loadMore)
            let loadNewItems = document.getElementById("loadNewItems");
            loadNewItems.addEventListener("click", this.loadMoreManager);
        } else {
            loadMore.innerHTML = `
            <span>
                No More Items ...
            </span>
            `;
            pointers.contentItems.appendChild(loadMore)
        }
    }

    static loadMoreManager = async () => {
        let loadMoreDiv = document.getElementById("loadMoreDiv");
        loadMoreDiv.remove();

        this.page += 1;
        let res;
        if (pointers.searchInput.value.length > 0) {
            res = await ContentManagement.loadItems(this.page, this.pageSize, pointers.searchInput.value);
        } else {
            res = await ContentManagement.loadItems(this.page, this.pageSize, "");
        }
        this.printItems(res);
    }

    static getSearchData = async (value) => {
        this.page = 0;
        let res = await ContentManagement.loadItems(this.page, this.pageSize, value);
        if (LanguageBuilder.selectedSort) {
            console.log("here we should sort the array");
        }
        this.allItemsSorted = [];
        this.printItems(res);
    }

    static sortItems = () => {
        pointers.contentItems.innerHTML = "";
        let sortedArr = [];
        if (LanguageBuilder.selectedSort == "descending") {
            this.allItemsSorted.sort((a, b) => {
                if (a.data.title?.toUpperCase() < b.data.title?.toUpperCase()) return 1
                else return -1
            })
        } else if (LanguageBuilder.selectedSort == "ascending") {
            this.allItemsSorted.sort((a, b) => {
                if (a.data.title?.toUpperCase() > b.data.title?.toUpperCase()) return 1
                else return -1
            })
        }
        sortedArr = this.allItemsSorted;
        this.allItemsSorted = [];
        this.printItems(sortedArr);
    }


    static init_Content = async()=>{
        await this.loadItems();
        buildfire.datastore.onUpdate(this.loadItems);
    }
}