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
        row.className = "flexItem-row row stretch padding-bottom-fifteen padding-top-ten padding-left-twenty default-background-hover transition-half"
        row.setAttribute("id", `item-${item.id}-${index}`)
        row.innerHTML = `
            <section class="leftSection border-radius-four margin-left-fifteen">
                <img class="border-radius-four" src="${item.data.image || "./media/imagePlaceHolder.png"}" alt="item image" >
            </section>
            <section class="flexItem-col margin-left-fifteen">
                <span class="titleSpan">${item.data.title}</span>
                <span class="subTitleSpan">${item.data.subtitle}</span>
            </section>
        `
        pointers.contentItems.appendChild(row);
        let myItem = document.getElementById(`item-${item.id}-${index}`);
        console.log(`item-${item.id}-${index}`);
        myItem.addEventListener("click", () => this.showItemPage(item))
    }

    static showItemPage = (item) => {
        pointers.loadItemsList.style.display = "none";
        pointers.loadItemPage.style.display = "block";
        
        let squareImage, coverImage; 
        if(item.data.image){
            squareImage = buildfire.imageLib.resizeImage(
                item.data.image,
                { size: "s", aspect: "1:1" }
              );
        }else{
            squareImage = "./media/empty-image.jpg";
        }
        if(item.data.coverImage){
            coverImage = buildfire.imageLib.resizeImage(
                item.data.coverImage,
                { size: "full_width", aspect: "9:16" }
            );
        }else{
            coverImage = "./media/empty-cover.jpg";
        }
       

        pointers.backImage.setAttribute("src", coverImage)
        pointers.mainImage.setAttribute("src", squareImage)
        pointers.itemContent.innerHTML = `
        <section class="item-Title-Section">
            <span class="row">${item.data.title}</span>
            <span class="row">${item.data.subtitle}</span>
        </section>
        <div class="border-radius-four wysiwyg-Container"> 
            
            <p> ${item.data.description || "<p class='text-center'>WYSIWYG Content</p>"} </p>
        </div>
        `;
    }

    static createLoadMoreContainer = (length) => {
        let loadMore = document.createElement("div");
        loadMore.setAttribute("id", "loadMoreDiv");
        if (length >= this.pageSize) {
            loadMore.innerHTML = `
            <img class="loadMoreGIF" src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator.gif" alt="Load More Items" >
            `;
            pointers.contentItems.appendChild(loadMore);
            pointers.itemsContainer.addEventListener("scroll", this.loadMoreManager);
        } else {
            loadMore.innerHTML = `
            <span>
                No More Items ...
            </span>
            `;
            pointers.contentItems.appendChild(loadMore);
            pointers.itemsContainer.removeEventListener("scroll", this.loadMoreManager);
        }
    }

    static loadMoreManager = async () => {
        if ((pointers.itemsContainer.scrollTop / document.documentElement.clientHeight) * 100 > 40) {

            this.page += 1;
            let res;
            if (pointers.searchInput.value.length > 0) {
                res = await ContentManagement.loadItems(this.page, this.pageSize, pointers.searchInput.value);
            } else {
                res = await ContentManagement.loadItems(this.page, this.pageSize, "");
            }
            document.getElementById("loadMoreDiv").remove()
            this.printItems(res);
        }
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


    static init_Content = async () => {
        await this.loadItems();
    }
}