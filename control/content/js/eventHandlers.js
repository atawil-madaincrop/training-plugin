import { ShowController } from "./showController.js";
import { ContentHandlers } from "./contentHandlers.js";
import { pointers } from "./pointers.js";

let timer = null;

export class EventHandlers {

    // get and print Items in the list
    static loadItems = async () => {
        pointers.formPage.style.display = "none";
        let itemsData = await ContentHandlers.loadItems(0, 10);
        ShowController.mySateArr = itemsData;
    }
    static getSearchItems = async () => {
        if (pointers.getSearchInput.value.length > 0) {
            ShowController.loading();
            let res = await ContentHandlers.searchItems(pointers.getSearchInput.value);
            ShowController.mySateArr = res;
            pointers.iconPlcae.style.display = "none";
            pointers.iconPlcaeCancelSearch.style.display = "inline-block";
        } else {
            this.loadItems();
            this.setAddBtn()
        }
        ShowController.printItems(ShowController.mySateArr);
    }
    static setSearchTyping(e) {
        if (e.target.value.length > 0) {
            pointers.iconPlcae.style.display = "inline-block";
            pointers.iconPlcaeCancelSearch.style.display = "none";
        } else {
            pointers.iconPlcae.style.display = "none";
            pointers.iconPlcaeCancelSearch.style.display = "inline-block";
        }
    }
    static resetSearch = async () => {
        pointers.getSearchInput.value = "";
        ShowController.loading();
        pointers.iconPlcaeCancelSearch.style.display = "none";
        pointers.iconPlcae.style.display = "inline-block";
        await this.loadItems();
        ShowController.printItems();
        this.setAddBtn();
    }
    // handel input data
    static handelTitle = (e) => {
        ShowController.newItem.title = e.target.value;
        this.sendUpdatedItem();
    }
    static handelSubTitle = (e) => {
        ShowController.newItem.subtitle = e.target.value;
        this.sendUpdatedItem();
    }
    static handelTiny = () => {
        ShowController.newItem.description = tinymce.activeEditor.getContent();
        this.sendUpdatedItem();
    }
    // handel form to add and edit items 
    static setAddBtn() {
        let newAdd = document.getElementById("add-New-Item_btn2");
        if (newAdd) {
            newAdd.addEventListener("click", () => ShowController.showAddModal(true))
        }
    }
    static submitNewItem = async () => {
        if (ShowController.newItem.image && ShowController.newItem.coverImage && ShowController.newItem.title) {
            await this.handelSubmitForm();
        } else {
            buildfire.dialog.alert({
                message: "Some Needed Data in Missing!",
            });
        }
    }
    static handelImage = (type, key, imageUrl) => {
        this.sendUpdatedItem();
        if (key == "image") {
            switch (type) {
                case "add":
                    ShowController.newItem.image = imageUrl;
                    EventHandlers.sendUpdatedItem();
                    break;
                case "delete":
                    ShowController.newItem.image = null;
                    EventHandlers.sendUpdatedItem();
                    break;
            }
        } else {
            switch (type) {
                case "add":
                    ShowController.newItem.coverImage = imageUrl;
                    EventHandlers.sendUpdatedItem();
                    break;
                case "delete":
                    ShowController.newItem.coverImage = null;
                    EventHandlers.sendUpdatedItem();
                    break;
            }
        }
    }
    static handelSubmitForm = async () => {
        if (ShowController.typeOfHandelForm == "add") {
            let addedData = await ContentHandlers.addItem(ShowController.newItem);

            ShowController.sendMessage({
                type: "addItem",
                item: addedData
            })

            ShowController.mySateArr.splice(0, 0, addedData)
            ShowController.showAddModal(false);
            ShowController.printItems(ShowController.mySateArr);
        } else if (ShowController.typeOfHandelForm == "edit") {
            let editedData = await ContentHandlers.editItem(ShowController.itemForEdit.itemElement.id, ShowController.newItem);

            ShowController.sendMessage({
                type: "updateItem",
                item: editedData
            })

            ShowController.newItem = editedData.data;
            ShowController.mySateArr.splice(ShowController.itemForEdit.index, 1, editedData);
            ShowController.showAddModal(false);
            ShowController.printItems(ShowController.mySateArr);
        }
    }
    static pushNewRow(item) {
        if (ShowController.mySateArr.length == 1) {
            ShowController.printItems();
        } else {
            let myDate = new Date(item.data.createdOn).toDateString().split(" ");
            let myDateToPrint = `${myDate[1]} ${myDate[2]}, ${myDate[3]}`
            let itemsListTable = document.getElementById("itemsListTable");
            let newRow = `
            <tr>
            <td>
            <div class="img-holder aspect-1-1"><img src=${item.data.image} alt=""></div>
        </td>
        <td>${item.data.title}</td>
        <td>${item.data.subtitle}</td>
        <td class="text-center">${myDateToPrint}<td>
        <td>
            <div class="pull-right">
                <button class="btn bf-btn-icon"><span class="icon icon-pencil3"></span></button>
                <button id="deleteItemBtn-${ShowController.mySateArr.length - 1}" class="btn bf-btn-icon"><span class="icon icon-cross2"></span></button>
            </div>
        </td>
            </tr>
        `
            itemsListTable.appendChild(newRow)
            let deleteBtn = document.getElementById(`deleteItemBtn-${ShowController.mySateArr.length - 1}`);
            deleteBtn.addEventListener("click", () => deleteRow(newRow, item))
        }
    }

    static sendUpdatedItem = () => {
        if (ShowController.typeOfHandelForm == "edit" && ShowController.newItem.title != null) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                ShowController.sendMessage({
                    type: "testUpdatedData",
                    item: { data: ShowController.newItem, id: ShowController.itemForEdit.itemElement?.id || "" }
                })
            }, 500)
        }
    }
}