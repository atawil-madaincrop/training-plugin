import {ShowControler} from "./showControler.js";
import { ContentHandlers } from "./contentHandlers.js";
import {pointers} from "./pointers.js";


export class EventHandlers {

    // get and print Items in the list
    static loadItems = async () => {
        pointers.formPage.style.display = "none";
        let itemsData = await ContentHandlers.loadItems(0, 10);
        ShowControler.mySateArr = itemsData;
    }
    static getSearchItems = async () => {
        if (pointers.getSearchInput.value.length > 0) {
            ShowControler.loading();
            let res = await ContentHandlers.searchItems(pointers.getSearchInput.value);
            ShowControler.mySateArr = res;
            pointers.iconPlcae.style.display = "none";
            pointers.iconPlcaeCancelSearch.style.display = "inline-block";
        } else {
            EventHandlers.loadItems();
            EventHandlers.setAddBtn()
        }
        ShowControler.printItems(ShowControler.mySateArr);
    }
    static resetSearch = async() => {
        pointers.getSearchInput.value = "";
        ShowControler.loading();
        pointers.iconPlcaeCancelSearch.style.display = "none";
        pointers.iconPlcae.style.display = "inline-block";
        await EventHandlers.loadItems();
        ShowControler.printItems();
        EventHandlers.setAddBtn();
    }
    // handel input data
    static handelTitle(e) {
        ShowControler.newItem.title = e.target.value;
    }
    static handelSubTitle(e) {
        ShowControler.newItem.subtitle = e.target.value;
    }
    static handelTiny() {
        ShowControler.newItem.description = tinymce.activeEditor.getContent();
    }
    // handel form to add and edit items 
    static setAddBtn() {
        let newAdd = document.getElementById("add-New-Item_btn2");
        if (newAdd) {
            newAdd.addEventListener("click", () => ShowControler.showAddModal(true))
        }
    }
    static submitNewItem = async () => {
        if (ShowControler.newItem.image && ShowControler.newItem.coverImage) {
            await EventHandlers.handelSubmitForm();
        } else {
            console.log("----- Required Data missing -----");
        }
    }
    static handelSubmitForm = async() => {
        if(ShowControler.typeOfHandelForm == "add"){
            let addedData = await ContentHandlers.addItem(ShowControler.newItem)
            ShowControler.mySateArr.splice(0, 0, addedData)
            ShowControler.emptyData();
            ShowControler.showAddModal(false);
            ShowControler.printItems(ShowControler.mySateArr);
        }else if(ShowControler.typeOfHandelForm == "edit"){
            let editedData = await ContentHandlers.editItem(ShowControler.itemForEdit.itemElement.id,ShowControler.newItem);
            ShowControler.mySateArr.splice(ShowControler.itemForEdit.index, 1, editedData);
            ShowControler.emptyData();
            ShowControler.showAddModal(false);
            ShowControler.printItems(ShowControler.mySateArr);
        }
    }
    static pushNewRow(item) {
        if (ShowControler.mySateArr.length == 1) {
            ShowControler.printItems();
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
                <button id="deleteItemBtn-${ShowControler.mySateArr.length - 1}" class="btn bf-btn-icon"><span class="icon icon-cross2"></span></button>
            </div>
        </td>
            </tr>
        `
            itemsListTable.appendChild(newRow)
            let deleteBtn = document.getElementById(`deleteItemBtn-${ShowControler.mySateArr.length - 1}`);
            deleteBtn.addEventListener("click", () => deleteRow(newRow, item))
        }
    }
}