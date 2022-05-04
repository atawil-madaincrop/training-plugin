import { ContentHandlers } from "./contentHandlers.js";
import Item from "../../../widget/common/entities/Item.js";
import { pointers } from "./pointers.js"


let oldItem;

export class ShowController {

    static newItem;
    static itemForEdit = {};
    static image;
    static coverImage;
    static mySateArr = [];
    static typeOfHandelForm = "add";
    static sortType = "icon-chevron-up";

    // manage data to be shown in the CP-Page
    static loading = () => {
        pointers.printTable.style.display = "none";
        pointers.printWhenEmpty.style.display = "none";
        pointers.printLoading.style.display = "flex";
    }
    static printItems = () => {
        this.loading();
        if (this.mySateArr.length > 0) {
            pointers.itemsListTable.innerHTML = "";
            pointers.printTable.style.display = "table";
            pointers.printWhenEmpty.style.display = "none";
            pointers.printLoading.style.display = "none";

            this.mySateArr.forEach(this.printAllItemsInTable);
        } else {
            pointers.printTable.style.display = "none";
            pointers.printWhenEmpty.style.display = "flex";
            pointers.printWhenEmpty.style.flexDirection = "column";
            pointers.printLoading.style.display = "none";
        }
    }
    static printAllItemsInTable = (itemElement, index) => {
        let myDate = new Date(itemElement.data.createdOn).toDateString().split(" ");
        let myDateToPrint = `${myDate[1]} ${myDate[2]}, ${myDate[3]}`

        let itemRow = document.createElement('tr');
        let imageToPrint = itemElement.data.image || "./media/imagePlaceHolder.png"
        itemRow.innerHTML = `
            <td>
                <div class="img-holder aspect-1-1">
                    <img class="images_in_List" src=${imageToPrint} alt="">
                </div>
            </td>
            <td class="text-primary"><a id="titleToChange-${index}" class="link">${itemElement.data.title}</a></td>
            <td>${itemElement.data.subtitle}</td>
            <td class="text-center">${myDateToPrint}<td>
            <td>
                <span class="input-group-btn col-md-12">
                    <button id="editItemBtn-${index}" class="btn stretch margin-left-zero btn_in_list">
                        <span class="cardBtnSpan icon icon-pencil"></span>
                    </button>
                    <button id="deleteItemBtn-${index}" class="btn stretch margin-left-zero btn_in_list">
                        <span class="cardBtnSpan icon icon-cross2" ></span>
                    </button>
                </span>
            </td>
        `

        pointers.itemsListTable.appendChild(itemRow);

        let deleteBtn = document.getElementById(`deleteItemBtn-${index}`);
        deleteBtn.addEventListener("click", () => this.deleteRow(index, itemRow, itemElement))

        let editTitle = document.getElementById(`titleToChange-${index}`);
        editTitle.addEventListener("click", () => this.editRow(itemElement, index));
        let editBtn = document.getElementById(`editItemBtn-${index}`);
        editBtn.addEventListener("click", () => this.editRow(itemElement, index));
    }
    static sortData = () => {
        pointers.sortSpan.className = `icon ${this.sortType}`
        if (this.sortType == "icon-chevron-down") {
            this.sortType = "icon-chevron-up";
            this.mySateArr.sort(function (a, b) {
                if (a.data.title?.toLowerCase() < b.data.title?.toLowerCase()) {
                    return -1;
                }
                if (a.data.title?.toLowerCase() > b.data.title?.toLowerCase()) {
                    return 1;
                }
            });
        } else if (this.sortType == "icon-chevron-up") {
            this.sortType = "icon-chevron-down";
            this.mySateArr.sort(function (a, b) {
                if (a.data.title?.toLowerCase() < b.data.title?.toLowerCase()) {
                    return 1;
                }
                if (a.data.title?.toLowerCase() > b.data.title?.toLowerCase()) {
                    return -1;
                }
            });
        }
        this.printItems();
    }
    // Modal to add and edit data
    static showAddModal = (type, cancelCase) => {
        if (type) {
            this.newItem = new Item();
            pointers.itemsPageDiv.style.display = "none";
            formPage.style.display = "block";
        } else {
            if (cancelCase && this.typeOfHandelForm !== "add") {
                this.mySateArr[oldItem.index].data = {
                    ...this.mySateArr[oldItem.index].data,
                    ...oldItem
                }
            }
            this.newItem = new Item();
            this.itemForEdit = {};

            this.emptyData();
            this.sendMessage({
                type: "closeItemPage"
            })
            pointers.itemsPageDiv.style.display = "block";
            formPage.style.display = "none";
            this.typeOfHandelForm = "add";
        }
        this.printItems();
    }
    static deleteRow = (idx, itemRow, item) => {

        buildfire.dialog.confirm(
            {
                title: "Delete Item",
                message: `Are you sure you want to Delete ${item.data.title} tem`,
            },
            async (err, isConfirmed) => {
                if (err) console.error(err);

                if (isConfirmed) {
                    //Go back
                    this.sendMessage({
                        type: "deleteItem",
                        itemID: item.id
                    })
                    itemRow.style.display = "none";
                    this.mySateArr.splice(idx, 1);
                    this.printItems();
                    await ContentHandlers.deactiveItem(item.id, item);
                } else {
                    //Prevent action
                }
            }
        );
    }
    static editRow = (itemElement, index) => {
        oldItem = {
            title: itemElement.data.title,
            subtitle: itemElement.data.subtitle,
            image: itemElement.data.image,
            coverImage: itemElement.data.coverImage,
            index: index
        }
        this.sendMessage({
            type: "openItem",
            item: itemElement
        })
        this.typeOfHandelForm = "edit";
        this.itemForEdit = { itemElement, index };
        this.showAddModal(true);
        this.addDataToEdit();
    }
    static emptyData = () => {
        pointers.title.value = null;
        pointers.subTitle.value = null;
        this.image.clear();
        this.coverImage.clear();
        tinymce.activeEditor.setContent('');
    }
    static addDataToEdit = () => {
        pointers.title.value = this.itemForEdit.itemElement.data.title;
        pointers.subTitle.value = this.itemForEdit.itemElement.data.subtitle;
        this.image.loadbackground(this.itemForEdit.itemElement.data.image);
        this.coverImage.loadbackground(this.itemForEdit.itemElement.data.coverImage);
        this.newItem = this.itemForEdit.itemElement.data;

        tinymce.activeEditor.setContent(this.itemForEdit.itemElement.data.description || '');
    }

    static sendMessage = (item) => {
        buildfire.messaging.sendMessageToWidget(item);
    }
}
