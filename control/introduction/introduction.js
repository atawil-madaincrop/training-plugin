
import { carouselManagement } from "./js/carouselManagement.js";


let carouselData = [];

const loadCarouselDatastore = () => {
    return carouselManagement.load();
}

const initTiny = (selector) => {
    tinymce.init({
        selector: selector,
    });
}

const initCarousel = (selector) => {
    let editor = new buildfire.components.carousel.editor(selector, carouselData);

    editor.onAddItems = (items) => {
        if (carouselData) {
            carouselData = [...carouselData, ...items]
        } else {
            carouselData = [items]
        }
        carouselManagement.pushItems(carouselData)
    };

    editor.onDeleteItem = (item, index) => {
        carouselData.splice(index, 1)
        carouselManagement.removeItem(carouselData)
    };

    editor.onOrderChange = (item, oldIndex, newIndex) => {
        carouselData.splice(oldIndex, 1);
        carouselData.splice(newIndex, 0, item);
        carouselManagement.pushItems(carouselData);
    };

    editor.onItemChange = (item, index) => {
        carouselData[index] = item;
        carouselManagement.pushItems(carouselData);
    };
}

const init = async () => {
    carouselData = await loadCarouselDatastore();
    initTiny("#wysiwygContent");
    initCarousel(".carousel");
}

init();
