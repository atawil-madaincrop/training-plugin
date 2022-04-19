import { contentHandlers } from "./js/contentHandlers.js";
import Item from "../../widget/common/entities/Item.js"

let printOutTableContainer = document.getElementById("printOutTable");
let itemsPageDiv = document.getElementById("list-Of-Items-From-DataStore");
let addItemContainer = document.getElementById("add-New-Item-To-DataStore");
let formPage = document.getElementById("formPage");
let addItemBtn = document.getElementById("add-New-Item_btn");
let cancelAdding = document.getElementById("cancel-Adding-Process");
let title = document.getElementById("title");
let subTitle = document.getElementById("subTitle");
let getSearch = document.getElementById("getSearch");
let getSearchInput = document.getElementById("getSearchInput");
let iconPlcae = document.getElementById("iconPlcaeSearch");
let iconPlcaeCancelSearch = document.getElementById("iconPlcaeCancelSearch");
iconPlcaeCancelSearch.style.display="none";
let image, coverImage;

const thumbnailData = document.getElementsByClassName("thumbnail-picker");

let myState = [];
let newItem;

function loading(){
        printOutTableContainer.innerHTML = `
        <div class="well empty-state-lg">
        <div class="container">
          <div class="row">
            <h5 class="text-center">Loading ...</h5>
          </div>
        </div>
      </div>
        `
}
async function loadItems(){
    formPage.style.display = "none";
    let itemsData = await contentHandlers.loadItems(0, 100);
    myState = itemsData;
}
function showAddModal(type){
    if (type) {
        newItem = new Item();
        itemsPageDiv.style.display = "none";
        formPage.style.display = "block";
    } else {
        newItem = null;
        itemsPageDiv.style.display = "block";
        formPage.style.display = "none";
    }
}
function deleteRow(idx, itemRow, item){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            // our Code ==>
            itemRow.style.display = "none";
            myState.splice(idx,1);
            contentHandlers.deactiveItem(item.id, item);
            if(myState.length ==0){
                printItems();
            }
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
      })
}
function printAllItemsInTable(itemElement, index){
    let myDate = new Date(itemElement.data.createdOn).toDateString().split(" ");
    let myDateToPrint = `${myDate[1]} ${myDate[2]}, ${myDate[3]}`

    let itemRow = document.createElement('tr');
    itemRow.innerHTML = `
    <td>
        <div class="img-holder aspect-1-1"><img src=${itemElement.data.image} alt=""></div>
    </td>
    <td class="text-primary"><a class="link">${itemElement.data.title}</a></td>
    <td>${itemElement.data.subtitle}</td>
    <td class="text-center">${myDateToPrint}<td>
    <td>
        <span class="input-group-btn col-md-12">
            <button id="getSearch" class="btn btn-info stretch margin-left-zero">
                <span class="cardBtnSpan icon icon-pencil3 link" ></span>
            </button>
            <button id="deleteItemBtn-${index}" id="getSearch" class="btn btn-info stretch margin-left-zero">
                <span class="cardBtnSpan icon icon-cross2 link" ></span>
            </button>
          </span>
    </td>
    `
    let itemsListTable = document.getElementById("itemsListTable");
    itemsListTable.appendChild(itemRow);

    let deleteBtn = document.getElementById(`deleteItemBtn-${index}`);
    deleteBtn.addEventListener("click", () => deleteRow(index, itemRow, itemElement))
}

function printItems(){
    if (myState.length > 0) {
        printOutTableContainer.innerHTML = `
        <table class="table table-bf">
            <thead>
                <td></td>
                <th><h5>Title <span class="icon icon-chevron-down"></span></h5></th>
                <th><h5>Subtitle</h5></th>
                <th><h5 class="text-center">Date of Creation</h5></th>
            </thead>
            <tbody id="itemsListTable">
            </tbody>
        </table>
        `;
        myState.forEach(printAllItemsInTable)
    } else {
        printOutTableContainer.innerHTML = `
        <div class="well empty-state-lg">
        <div class="container">
          <div class="row">
            <h5 class="text-center">You haven't added anything yet.</h5>
          </div>
          <div class="row">
            <h5 class="text-center">Add sample data to preview this feature.</h5>
          </div>
          <div class="row">
            <div class="container">
              <div class="col-md-10">
                <button id="add-New-Item_btn2" class="btn btn-success stretch"><span class="icon icon-plus margin-right-ten"></span>Add
                  Sample Data</button>
              </div>
            </div>
          </div>
        </div>
      </div>
        `
        let newAdd = document.getElementById("add-New-Item_btn2");
        newAdd.addEventListener("click", ()=>showAddModal(true))
    }
}

function pushNewRow(item){
    if (myState.length == 1) {
        printItems();
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
                <button id="deleteItemBtn-${myState.length - 1}" class="btn bf-btn-icon"><span class="icon icon-cross2"></span></button>
            </div>
        </td>
            </tr>
        `
        itemsListTable.appendChild(newRow)
        let deleteBtn = document.getElementById(`deleteItemBtn-${myState.length - 1}`);
        deleteBtn.addEventListener("click", () => deleteRow(newRow, item))
    }
}

function emptyData(){
    title.value = null;
    subTitle.value = null;
    image.clear();
    coverImage.clear();
}

function handelTitle(e){
    newItem.title = e.target.value;
}
function handelSubTitle(e){
    newItem.subtitle = e.target.value;
}
function handelTiny(){
    newItem.description = tinymce.activeEditor.getContent();
}
async function submitNewItem (){
    if (newItem.image && newItem.coverImage) {
        let addedData = await contentHandlers.addItem(newItem)
        // myState.push(addedData);
        console.log("item from adding process", addedData);
        myState.splice(0, 0, addedData)
        emptyData();
        showAddModal(false);
        printItems();
        // pushNewRow(addedData);
        console.log("my state", myState);
    } else {
        console.log("----- Required Data missing -----");
    }
}


async function getSearchItems(){
    if (getSearchInput.value.length > 0) {
        loading();
        let res = await contentHandlers.searchItems(getSearchInput.value);
        myState = res;
        iconPlcae.style.display = "none";
        iconPlcaeCancelSearch.style.display="inline-block";
    } else {
        loadItems();
    }
    printItems();
}

function resetSearch() {
    loading();
    getSearchInput.value = "";
    iconPlcaeCancelSearch.style.display="none";
    iconPlcae.style.display = "inline-block";
    loadItems();
    printItems();
}

function changeIcon(e){
    iconPlcae.className = "icon icon-magnifier";
    getSearch.addEventListener('click', getSearchItems)
}

addItemBtn.addEventListener('click', () => showAddModal(true));
cancelAdding.addEventListener('click', () => showAddModal(false));
addItemContainer.addEventListener('click', submitNewItem);
title.addEventListener('input', handelTitle);
subTitle.addEventListener('input', handelSubTitle);
getSearch.addEventListener('click', getSearchItems)
getSearchInput.addEventListener('input', changeIcon)
iconPlcaeCancelSearch.addEventListener('click', resetSearch)


const initTiny = (selector) => {
    tinymce.init({
        selector: selector,
        setup: editor => {
            editor.on('input', (e) => handelTiny(e));
            editor.on('change', (e) => handelTiny(e));
        }
    });
}

const initThumbnail = () => {
    image = new buildfire.components.images.thumbnail("#image", {
        imageUrl: '',
        title: "List Image & Cover Image *",
        dimensionsLabel: "Recommended: 600x600",
        multiSelection: false
    });
    coverImage = new buildfire.components.images.thumbnail("#imageCover", {
        imageUrl: '',
        title: "cover",
        dimensionsLabel: "Recommended: 1200x675",
        multiSelection: false
    });

    image.onDelete = (imageUrl) => {
        newItem.image = null;
    };
    coverImage.onDelete = (imageUrl) => {
        newItem.coverImage = null;
    };

    image.onChange = (imageUrl) => {
        newItem.image = imageUrl;
    };
    coverImage.onChange = (imageUrl) => {
        newItem.coverImage = imageUrl;
    };
}

const init = async () => {
    await loadItems();
    printItems();

    initTiny("#wysiwygContent");
    initThumbnail();
}

init();