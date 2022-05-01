import { ContentManagement } from "./contentManagement.js";
import { LanguageBuilder } from "../language/languageBuilder.js";
import { pointers } from "../pointers.js";

let timer = null;

export class ContentBuilder {
    static itemsRendered = [];
    static allItemsSorted = [];
    static page = 0;
    static pageSize = 10;

    static loadItems = async () => {
        pointers.contentItems.innerHTML = "";

        let res = await ContentManagement.loadItems(this.page, this.pageSize, "");
        this.itemsRendered = res;
        if(res.length > 0){
            pointers.emptyPage.style.display = "none";
            this.allItemsSorted = [];
            this.printItems(this.itemsRendered);
        }
    }

    static printItems = (addItemsArr) => {
        pointers.emptySearchPage.style.display = "none";
        
        addItemsArr.forEach(this.print_Item_By_Item);
        this.createLoadMoreContainer(addItemsArr.length);

        this.allItemsSorted = [...addItemsArr, ...this.allItemsSorted]
    }

    static print_Item_By_Item = (item, index) => {
        let row = document.createElement("div");
        row.className = "margin-zero flexItem-row row stretch padding-bottom-fifteen padding-top-ten padding-left-twenty default-background-hover transition-half"
        row.setAttribute("id", `item-${item.id}-${index}`)
        row.innerHTML = `
            <section class="leftSection border-radius-four">
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
        console.log("Show item 444444444");
        pointers.loadItemsList.style.display = "none";
        pointers.loadItemPage.style.display = "block";

        buildfire.history.push("itemPage", item);

        let images = this.setImagesToBeShown(item);

        pointers.backImage.setAttribute("src", images.coverImage);
        pointers.mainImage.setAttribute("src", images.squareImage);

        pointers.backImage.addEventListener("click", () => this.showImage(item.data.coverImage, images));
        pointers.mainImage.addEventListener("click", () => this.showImage(item.data.image, images));

        pointers.itemContent.innerHTML = `
        <section class="item-Title-Section padding-right-fifteen padding-top-fifteen padding-left-fifteen">
            <span class="row">${item.data.title}</span>
            <span class="row">${item.data.subtitle}</span>
        </section>
        <div class="border-radius-four padding-right-fifteen padding-top-zero padding-bottom-fifteen padding-left-fifteen"> 
            <p> ${item.data.description || ""} </p>
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
        if(res.length > 0){
            if (LanguageBuilder.selectedSort) {
                console.log("here we should sort the array");
            }
            this.allItemsSorted = [];
            this.printItems(res);
        }else{
            pointers.emptySearchPage.style.display = "block";
        }
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

    static showImage = (src, images) => {
        let imageToShow = src || images.coverImage;
        buildfire.imagePreviewer.show(
            {
                images: [imageToShow],
            },
            () => {
                console.log("Image previewer closed");
            }
        );
    }

    static setImagesToBeShown = (item) => {
        let squareImage, coverImage;
        if (item.data.image) {
            squareImage = buildfire.imageLib.resizeImage(
                item.data.image,
                { size: "s", aspect: "1:1" }
            );
        } else {
            squareImage = "./media/empty-image.jpg";
        }
        if (item.data.coverImage) {
            coverImage = buildfire.imageLib.resizeImage(
                item.data.coverImage,
                { size: "full_width", aspect: "9:16" }
            );
        } else {
            coverImage = "./media/empty-cover.jpg";
        }
        return { squareImage, coverImage }
    }

    static backFunction = () => {
        clearTimeout(timer);
        timer = setTimeout(function () {
            buildfire.history.pop();
        }, 50)
    }

    static backPOP_Listener = (breadcrumb) => {
        setTimeout(() => {
            pointers.loadItemsList.style.display = "block";
            pointers.loadItemPage.style.display = "none";
            pointers.loadItemPage.style.animation = "showItem 0.3s";
        }, 200)
        pointers.loadItemPage.style.animation = "hideItem 0.2s";
    }

    static pushNewItem = (item) => {
        console.log("----0", item);
        if (item.id !== this.allItemsSorted[this.allItemsSorted.length - 1].id) {
            pointers.contentItems.innerHTML = "";

            let printedArr = this.allItemsSorted;
            printedArr.push(item);

            this.allItemsSorted = [];
            this.printItems(printedArr);
        }
    }

    static removeItem = (id) => {
        pointers.contentItems.innerHTML = "";

        let printedArr = this.allItemsSorted.filter(item => {
            return item.id != id;
        })

        this.allItemsSorted = [];
        this.printItems(printedArr);
    }

    static update_Content = async () => {
        console.log("updated content will be right here ...");
    }

    static init_Content = async () => {
        await this.loadItems();
    }
}