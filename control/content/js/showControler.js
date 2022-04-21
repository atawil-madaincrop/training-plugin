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
    static sortType = "icon-chevron-up";

    // manage data to be shown in the CP-Page
    static loading = () => {
        pointers.printTable.style.display = "none";
        pointers.printWhenEmpty.style.display = "none";
        pointers.printLoading.style.display = "flex";
    }
    static printItems = () => {
        ShowControler.loading();
        if (ShowControler.mySateArr.length > 0) {
            pointers.itemsListTable.innerHTML = "";
            pointers.printTable.style.display = "table";
            pointers.printWhenEmpty.style.display = "none";
            pointers.printLoading.style.display = "none";

            ShowControler.mySateArr.forEach(ShowControler.printAllItemsInTable);
        } else {
            pointers.printTable.style.display = "none";
            pointers.printWhenEmpty.style.display = "flex";
            pointers.printLoading.style.display = "none";
        }
    }
    static printAllItemsInTable(itemElement, index) {
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
                        <span class="cardBtnSpan icon icon-pencil5"></span>
                    </button>
                    <button id="deleteItemBtn-${index}" class="btn stretch margin-left-zero btn_in_list">
                        <span class="cardBtnSpan icon icon-cross2" ></span>
                    </button>
                </span>
            </td>
        `
        
        pointers.itemsListTable.appendChild(itemRow);

        let deleteBtn = document.getElementById(`deleteItemBtn-${index}`);
        deleteBtn.addEventListener("click", () => ShowControler.deleteRow(index, itemRow, itemElement))

        let editTitle = document.getElementById(`titleToChange-${index}`);
        editTitle.addEventListener("click", () => ShowControler.editRow(itemElement, index));
        let editBtn = document.getElementById(`editItemBtn-${index}`);
        editBtn.addEventListener("click", () => ShowControler.editRow(itemElement, index));
    }
    static sortData() {
        pointers.sortSpan.className = `icon ${ShowControler.sortType}`
        if (ShowControler.sortType == "icon-chevron-down") {
            ShowControler.sortType = "icon-chevron-up";
            ShowControler.mySateArr.sort(function (a, b) {
                if (a.data.title?.toLowerCase() < b.data.title?.toLowerCase()) {
                    return -1;
                }
                if (a.data.title?.toLowerCase() > b.data.title?.toLowerCase()) {
                    return 1;
                }
            });
        } else if (ShowControler.sortType == "icon-chevron-up") {
            ShowControler.sortType = "icon-chevron-down";
            ShowControler.mySateArr.sort(function (a, b) {
                if (a.data.title?.toLowerCase() < b.data.title?.toLowerCase()) {
                    return 1;
                }
                if (a.data.title?.toLowerCase() > b.data.title?.toLowerCase()) {
                    return -1;
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
        
        buildfire.dialog.confirm(
            {
                title: "Delete Item",
                message: `Are you sure you want to Delete ${item.data.title} tem`,
            },
            async (err, isConfirmed) => {
              if (err) console.error(err);
          
              if (isConfirmed) {
                //Go back
                itemRow.style.display = "none";
                ShowControler.mySateArr.splice(idx, 1);
                ShowControler.printItems();
                await ContentHandlers.deactiveItem(item.id, item);
              } else {
                //Prevent action
              }
            }
          );
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