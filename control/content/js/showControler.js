import { ContentHandlers } from "./contentHandlers.js";
import Item from "../../../widget/common/entities/Item.js";

let printOutTableContainer = document.getElementById("printOutTable");
let itemsPageDiv = document.getElementById("list-Of-Items-From-DataStore");
let formPage = document.getElementById("formPage");
let title = document.getElementById("title");
let subTitle = document.getElementById("subTitle");


export class ShowControler {

    static newItem;
    static itemForEdit = {};
    static image;
    static coverImage;
    static mySateArr = [];
    static typeOfHandelForm = "add";

    // manage data to be shown in the CP-Page
    static printItems() {
        if (ShowControler.mySateArr.length > 0) {
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
            ShowControler.mySateArr.forEach(ShowControler.printAllItemsInTable)
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
            if (newAdd) {
                newAdd.addEventListener("click", () => ShowControler.showAddModal(true))
            }
        }
    }
    static printAllItemsInTable(itemElement, index) {
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
                    <button id="editItemBtn-${index}" class="btn btn-info stretch margin-left-zero">
                        <span class="cardBtnSpan icon icon-pencil3 link" ></span>
                    </button>
                    <button id="deleteItemBtn-${index}"  class="btn btn-info stretch margin-left-zero">
                        <span class="cardBtnSpan icon icon-cross2 link" ></span>
                    </button>
                </span>
            </td>
        `
        let itemsListTable = document.getElementById("itemsListTable");
        itemsListTable.appendChild(itemRow);

        let deleteBtn = document.getElementById(`deleteItemBtn-${index}`);
        deleteBtn.addEventListener("click", () => ShowControler.deleteRow(index, itemRow, itemElement))

        let editBtn = document.getElementById(`editItemBtn-${index}`);
        editBtn.addEventListener("click", () => ShowControler.editRow(itemElement, index))
    }
    static loading() {
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
    // Modal to add and edit data
    static showAddModal(type) {
        if (type) {
            ShowControler.newItem = new Item();
            itemsPageDiv.style.display = "none";
            formPage.style.display = "block";
        } else {
            ShowControler.emptyData();

            ShowControler.newItem = null;
            itemsPageDiv.style.display = "block";
            formPage.style.display = "none";
            ShowControler.typeOfHandelForm = "add";
            ShowControler.itemForEdit = {};
        }
    }
    static deleteRow(idx, itemRow, item) {
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
                ShowControler.mySateArr.splice(idx, 1);
                ContentHandlers.deactiveItem(item.id, item);
                if (ShowControler.mySateArr.length == 0) {
                    ShowControler.printItems(ShowControler.mySateArr);
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
    static editRow(itemElement, index){
        ShowControler.typeOfHandelForm = "edit";
        ShowControler.itemForEdit = {itemElement, index};
        ShowControler.showAddModal(true);
        ShowControler.addDataToEdit();
    }
    static emptyData() {
        title.value = null;
        subTitle.value = null;
        ShowControler.image.clear();
        ShowControler.coverImage.clear();
        tinymce.activeEditor.setContent('');
    }
    static addDataToEdit(){
        title.value = ShowControler.itemForEdit.itemElement.data.title;
        subTitle.value = ShowControler.itemForEdit.itemElement.data.subtitle;
        ShowControler.image.loadbackground(ShowControler.itemForEdit.itemElement.data.image);
        ShowControler.coverImage.loadbackground(ShowControler.itemForEdit.itemElement.data.coverImage);
        ShowControler.newItem = ShowControler.itemForEdit.itemElement.data;
        tinymce.activeEditor.setContent(ShowControler.itemForEdit.itemElement.data.description || '');
    }
}