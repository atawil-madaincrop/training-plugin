
import Item from "../../../widget/common/entities/Item.js";
import {ShowControler} from "./showControler.js";
import { ContentHandlers } from "./contentHandlers.js";

let itemsPageDiv = document.getElementById("list-Of-Items-From-DataStore");
let formPage = document.getElementById("formPage");
let title = document.getElementById("title");
let subTitle = document.getElementById("subTitle");
let getSearch = document.getElementById("getSearch");
let getSearchInput = document.getElementById("getSearchInput");
let iconPlcae = document.getElementById("iconPlcaeSearch");
let iconPlcaeCancelSearch = document.getElementById("iconPlcaeCancelSearch");
iconPlcaeCancelSearch.style.display = "none";


export class EventHandlers {

    static newItem;
    static image;
    static coverImage;

    static changeIcon(e) {
        iconPlcae.className = "icon icon-magnifier";
        getSearch.addEventListener('click', EventHandlers.getSearchItems)
    }

    static showAddModal(type) {
        if (type) {
            EventHandlers.newItem = new Item();
            itemsPageDiv.style.display = "none";
            formPage.style.display = "block";
        } else {
            EventHandlers.newItem = null;
            itemsPageDiv.style.display = "block";
            formPage.style.display = "none";
        }
    }

    static setAddBtn() {
        let newAdd = document.getElementById("add-New-Item_btn2");
        if (newAdd) {
            newAdd.addEventListener("click", () => EventHandlers.showAddModal(true))
        }
    }

    static emptyData() {
        title.value = null;
        subTitle.value = null;
        EventHandlers.image.clear();
        EventHandlers.coverImage.clear();
    }

    static handelTitle(e) {
        EventHandlers.newItem.title = e.target.value;
    }
    static handelSubTitle(e) {
        EventHandlers.newItem.subtitle = e.target.value;
    }
    static handelTiny() {
        EventHandlers.newItem.description = tinymce.activeEditor.getContent();
    }


    static loadItems = async () => {
        formPage.style.display = "none";
        let itemsData = await ContentHandlers.loadItems(0, 10);
        ShowControler.mySateArr = itemsData;
    }

    static pushNewRow(item) {
        if (ShowControler.mySateArr.length == 1) {
            ShowControler.printItems();
        } else {
            console.log(">>>>>>>>>>>>>>>", item);
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

    static submitNewItem = async () => {
        if (EventHandlers.newItem.image && EventHandlers.newItem.coverImage) {
            let addedData = await ContentHandlers.addItem(EventHandlers.newItem)
            // ShowControler.mySateArr.push(addedData);
            console.log("item from adding process", addedData);
            ShowControler.mySateArr.splice(0, 0, addedData)
            EventHandlers.emptyData();
            EventHandlers.showAddModal(false);
            ShowControler.printItems(ShowControler.mySateArr);
            // pushNewRow(addedData);
            console.log("my state", ShowControler.mySateArr);
        } else {
            console.log("----- Required Data missing -----");
        }
    }

    static getSearchItems = async () => {
        if (getSearchInput.value.length > 0) {
            ShowControler.loading();
            let res = await ContentHandlers.searchItems(getSearchInput.value);
            ShowControler.mySateArr = res;
            iconPlcae.style.display = "none";
            iconPlcaeCancelSearch.style.display = "inline-block";
        } else {
            EventHandlers.loadItems();
            EventHandlers.setAddBtn()
        }
        ShowControler.printItems(ShowControler.mySateArr);
    }

    static resetSearch() {
        ShowControler.loading();
        getSearchInput.value = "";
        iconPlcaeCancelSearch.style.display = "none";
        iconPlcae.style.display = "inline-block";
        EventHandlers.loadItems();
        ShowControler.printItems(ShowControler.mySateArr);
        EventHandlers.setAddBtn();
    }


}