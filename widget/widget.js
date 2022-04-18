
import {introductionManagement} from "./js/introductionManagement.js";
import Introduction from "./common/entities/Introduction.js"

let viewer;
let myIntroduction = new Introduction();
let my_container_div = document.getElementById("my_container_div");


const appendUpdatedData = async () => {
    myIntroduction = await introductionManagement.load();
    viewer.loadItems(myIntroduction.imageCarousel);

    my_container_div.innerHTML = myIntroduction.description

}

const initComponents = async () => {
    viewer = new buildfire.components.carousel.view(".carousel");

    appendUpdatedData();
}

const init = async () => {
    initComponents();

    buildfire.datastore.onUpdate(appendUpdatedData);
}

init();