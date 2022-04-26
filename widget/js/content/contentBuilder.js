import { ContentManagement } from "./contentManagement.js";
import { pointers } from "../pointers.js";

export class ContentBuilder {
    static itemsRendered = [];
    static page = 0;
    static pageSize = 10;

    static loadItems = async () => {
        let res = await ContentManagement.loadItems(this.page, this.pageSize);
        this.itemsRendered = res;
        
        pointers.contentItems.innerHTML = "";
        this.printItems(this.itemsRendered);
    }

    static printItems = (addItemsArr) => {
        addItemsArr.forEach(this.print_Item_By_Item);
        this.createLoadMoreContainer(addItemsArr.length);
    }

    static print_Item_By_Item = (item,index) => {
        let row = document.createElement("div");
        row.className = "rowItem"
        row.setAttribute("id", `item-${index}`)
        row.innerHTML = `
            <section class="leftSection">
                <img src="${item.data.image || "../media/imagePlaceHolder.png"}" alt="item image" >
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
        if(length >= this.pageSize){
            loadMore.innerHTML = `
            <button id="loadNewItems">
                Load More Items ...
            </button>
            `;
            pointers.contentItems.appendChild(loadMore)
            let loadNewItems = document.getElementById("loadNewItems");
            loadNewItems.addEventListener("click", this.loadMoreManager);
        }else{
            loadMore.innerHTML = `
            <span>
                No More Items ...
            </span>
            `;
            pointers.contentItems.appendChild(loadMore)
        }
    }

    static loadMoreManager = async() => {
        console.log("clicked -----");
        let loadMoreDiv = document.getElementById("loadMoreDiv");
        loadMoreDiv.remove();

        this.page = this.pageSize;
        this.pageSize += 10;
        let res = await ContentManagement.loadItems(this.page, this.pageSize);
        this.printItems(res);
    }

}