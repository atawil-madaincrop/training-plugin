
import {ContentHandlers} from "./contentHandlers.js";
let printOutTableContainer = document.getElementById("printOutTable");


export class ShowControler {
    static mySateArr = [];
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
        deleteBtn.addEventListener("click", () => ShowControler.deleteRow(index, itemRow, itemElement))
    }
    static deleteRow(idx, itemRow, item){
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
                ShowControler.mySateArr.splice(idx,1);
                ContentHandlers.deactiveItem(item.id, item);
                if(ShowControler.mySateArr.length ==0){
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
            
        }
    }
}