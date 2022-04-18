
import {carouselManagement} from "./js/carouselManagement.js";

let viewer;


const appendUpdatedData = async () => {
    let carouselData = await carouselManagement.load();
 
    viewer.loadItems(carouselData)
}

const initComponents = async () => {
    document.getElementById("my_container_div").innerHTML = '<p><span style="background-color: #bfedd2; font-size: 24px;"><strong><em>Hello this is Abed &amp; Alaa!</em></strong></span></p>';

    viewer = new buildfire.components.carousel.view(".carousel");

    appendUpdatedData();
}

const init = async () => {
    initComponents();

    buildfire.datastore.onUpdate(appendUpdatedData);
}

init();