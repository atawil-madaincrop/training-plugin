
 class ContentBuilder {
    static itemsRendered = [];
    static allItemsSorted = [];
    static page = 0;
    static pageSize = 10;
    static emptyPageState;

    static loadItems = async () => {
        pointers.contentItems.innerHTML = "";

        let res = await ContentManagement.loadItems(this.page, this.pageSize, "");
        this.itemsRendered = res;
        if (res.length > 0) {
            pointers.emptyPage.style.display = "none";
            this.allItemsSorted = [];
            this.printItems(this.itemsRendered);
        } else {
            pointers.emptyPage.style.display = this.emptyPageState;
        }
    }

    static printItems = (addItemsArr) => {
        clearTimeout(pointers.timer);
        pointers.timer = setTimeout(() => {
            pointers.emptySearchPage.style.display = "none";

            addItemsArr.forEach(ContentBuilder.print_Item_By_Item);
            ContentBuilder.createLoadMoreContainer(addItemsArr.length);

            ContentBuilder.allItemsSorted = [...addItemsArr, ...ContentBuilder.allItemsSorted]
        }, 50)
    }

    static print_Item_By_Item = (item, index) => {
        let row = document.createElement("div");
        row.className = "margin-zero flexItem-row row stretch padding-bottom-fifteen padding-top-ten padding-left-twenty default-background-hover transition-half"
        row.setAttribute("id", `item-${item.id}-${index}`)
        row.innerHTML = `
            <section class="leftSection border-radius-four">
                <img class="border-radius-four" src="${item.data?.image || "./media/imagePlaceHolder.png"}" alt="item image" >
            </section>
            <section class="flexItem-col margin-left-fifteen">
                <span class="titleSpan">${item.data?.title}</span>
                <span class="subTitleSpan">${item.data?.subtitle}</span>
            </section>
        `
        pointers.contentItems.appendChild(row);
        let myItem = document.getElementById(`item-${item.id}-${index}`);
        myItem.addEventListener("click", () => this.showItemPage(item))
    }

    static showItemPage = (item) => {
        buildfire.history.get(
            {},
            (err, result) => {
                if (result[result.length - 1].label !== "itemPage") {
                    buildfire.history.push("itemPage", item);
                }
                pointers.loadItemsList.style.display = "none";
                pointers.loadItemPage.style.display = "block";

                let images = this.setImagesToBeShown(item);

                pointers.backImage.setAttribute("src", images.coverImage);
                pointers.mainImage.setAttribute("src", images.squareImage);

                pointers.backImage.addEventListener("click", () => this.showImage(item.data?.coverImage, images));
                pointers.mainImage.addEventListener("click", () => this.showImage(item.data?.image, images));

                pointers.itemContent.innerHTML = `
                    <section class="item-Title-Section padding-right-fifteen padding-top-fifteen padding-left-fifteen">
                        <span class="row">${item.data?.title}</span>
                        <span class="row">${item.data?.subtitle}</span>
                    </section>
                    <div class="border-radius-four padding-right-fifteen padding-top-zero padding-bottom-fifteen padding-left-fifteen"> 
                        <p> ${item.data?.description || ""} </p>
                    </div>
                    `;
            }
        );
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
        if (res.length > 0) {
            if (LanguageBuilder.selectedSort) {
            }
            this.allItemsSorted = [];
            this.printItems(res);
        } else {
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
        if (item.data?.image) {
            squareImage = buildfire.imageLib.resizeImage(
                item.data?.image,
                { size: "s", aspect: "1:1" }
            );
        } else {
            squareImage = "./media/empty-image.jpg";
        }
        if (item.data?.coverImage) {
            coverImage = buildfire.imageLib.resizeImage(
                item.data?.coverImage,
                { size: "full_width", aspect: "9:16" }
            );
        } else {
            coverImage = "./media/empty-cover.jpg";
        }
        return { squareImage, coverImage }
    }

    static backFunction = () => {

        clearTimeout(pointers.timer);
        pointers.timer = setTimeout(function () {
            buildfire.history.pop();
        }, 50)
    }

    static backPOP_Listener = (breadcrumb) => {
        switch (breadcrumb.label) {
            case "Plugin":
                buildfire.history.get(
                    {},
                    (err, result) => {
                        if (result.length <= 1) {
                            buildfire.history.push("Plugin");
                        }
                    }
                );
                buildfire.history.push("mainPage");
            case "mainPage":
                setTimeout(() => {
                    pointers.loadItemsList.style.display = "block";
                    pointers.loadItemPage.style.display = "none";
                    pointers.loadItemPage.style.animation = "showItem 0.3s";
                }, 200)
                pointers.loadItemPage.style.animation = "hideItem 0.2s";
                break;

            default:
                console.log("<-- No Back Avilable -->");
                break;
        }
    }

    static pushNewItem = (item) => {
        clearTimeout(pointers.timer);
        pointers.timer = setTimeout(()=>{
            if (item?.id !== this.allItemsSorted[0]?.id) {
                pointers.contentItems.innerHTML = "";
    
                let printedArr = this.allItemsSorted.map(item=>item);
                printedArr.splice(0, 0, item);
    
                this.allItemsSorted = [];
                if(printedArr.length > 1){
                    this.printItems(printedArr);
                }else{
                    this.init_Content(this.emptyPageState);
                }
            }
        }, 50)
    }

    static removeItem = (id) => {
        clearTimeout(pointers.timer);
        pointers.timer = setTimeout(()=>{
            pointers.contentItems.innerHTML = "";
            let printedArr = this.allItemsSorted.filter(item => {
                return item.id != id;
            })
    
            this.allItemsSorted = [];
            if (printedArr.length > 0) {
                this.printItems(printedArr);
            } else {
                this.init_Content(this.emptyPageState);
            }
        },50)
    }

    static update_Content = (itemEle) => {
        pointers.contentItems.innerHTML = "";

        let printedArr = this.allItemsSorted.filter(item => {
            return item.id != itemEle.id;
        })
        printedArr.splice(0, 0, itemEle)

        this.allItemsSorted = [];
        this.printItems(printedArr);
    }

    static init_Content = async (_emptyPageState) => {
        this.emptyPageState = _emptyPageState;
        await this.loadItems();
    }
}