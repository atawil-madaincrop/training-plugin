import { ContentHandlers } from "./contentHandlers.js";
import Item from "../../../widget/common/entities/Item.js";
import { pointers } from "./pointers.js"



export class ShowControler {

    static newItem;
    static itemForEdit = {};
    static image;
    static coverImage;
    static mySateArr = [];
    static typeOfHandelForm = "add";
    static sortType = "icon-chevron-down";

    // manage data to be shown in the CP-Page
    static printItems() {
        if (ShowControler.mySateArr.length > 0) {
            pointers.printOutTableContainer.innerHTML = `
        <table class="table table-bf">
            <thead>
                <td></td>
                <th><h5>Title <span id="sortSpan" class="icon ${ShowControler.sortType}"></span></h5></th>
                <th><h5>subTitle</h5></th>
                <th><h5 class="text-center">Date of Creation</h5></th>
            </thead>
            <tbody id="itemsListTable">
            </tbody>
        </table>
        `;
            ShowControler.mySateArr.forEach(ShowControler.printAllItemsInTable);
            let sortSpan = document.getElementById("sortSpan")
            sortSpan.addEventListener('click', () => ShowControler.sortData());

        } else {
            pointers.printOutTableContainer.innerHTML = `
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
                <div class="img-holder aspect-1-1"><img class="images_in_List" src=${itemElement.data.image} alt=""></div>
            </td>
            <td class="text-primary"><a class="link">${itemElement.data.title}</a></td>
            <td>${itemElement.data.subtitle}</td>
            <td class="text-center">${myDateToPrint}<td>
            <td>
                <span class="input-group-btn col-md-12">
                    <button id="editItemBtn-${index}" class="btn stretch margin-left-zero btn_in_list">
                        <span class="cardBtnSpan icon icon-pencil3" ></span>
                    </button>
                    <button id="deleteItemBtn-${index}" class="btn stretch margin-left-zero btn_in_list">
                        <span class="cardBtnSpan icon icon-cross2" ></span>
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
        pointers.printOutTableContainer.innerHTML = `
        <div class="well empty-state-lg">
        <div class="container">
          <div class="row">
            <h5 class="text-center">Loading ...</h5>
          </div>
        </div>
      </div>
        `
    }
    static sortData() {
        let sortSpan = document.getElementById("sortSpan");
        if (ShowControler.sortType == "icon-chevron-down") {
            ShowControler.sortType = "icon-chevron-up";
            ShowControler.mySateArr.sort(function (a, b) {
                if (a.data.title.toLowerCase() < b.data.title.toLowerCase()) {
                    return 1;
                }
                if (a.data.title.toLowerCase() > b.data.title.toLowerCase()) {
                    return -1;
                }
            });
        } else if (ShowControler.sortType == "icon-chevron-up") {
            ShowControler.sortType = "icon-chevron-down";
            ShowControler.mySateArr.sort(function (a, b) {
                if (a.data.title.toLowerCase() < b.data.title.toLowerCase()) {
                    return -1;
                }
                if (a.data.title.toLowerCase() > b.data.title.toLowerCase()) {
                    return 1;
                }
            });
        }
        ShowControler.printItems();
    }
    // Modal to add and edit data
    static showAddModal(type) {
        if (type) {
            ShowControler.newItem = new Item();
            pointers.itemsPageDiv.style.display = "none";
            formPage.style.display = "block";
        } else {
            ShowControler.emptyData();

            ShowControler.newItem = null;
            pointers.itemsPageDiv.style.display = "block";
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
    static editRow(itemElement, index) {
        ShowControler.typeOfHandelForm = "edit";
        ShowControler.itemForEdit = { itemElement, index };
        ShowControler.showAddModal(true);
        ShowControler.addDataToEdit();
    }
    static emptyData() {
        pointers.title.value = null;
        pointers.subTitle.value = null;
        ShowControler.image.clear();
        ShowControler.coverImage.clear();
        tinymce.activeEditor.setContent('');
    }
    static addDataToEdit() {
        pointers.title.value = ShowControler.itemForEdit.itemElement.data.title;
        pointers.subTitle.value = ShowControler.itemForEdit.itemElement.data.subtitle;
        ShowControler.image.loadbackground(ShowControler.itemForEdit.itemElement.data.image);
        ShowControler.coverImage.loadbackground(ShowControler.itemForEdit.itemElement.data.coverImage);
        ShowControler.newItem = ShowControler.itemForEdit.itemElement.data;
        tinymce.activeEditor.setContent(ShowControler.itemForEdit.itemElement.data.description || '');
    }
}