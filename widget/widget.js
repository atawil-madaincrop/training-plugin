import WidgetController from "./widget.controller.js";
import { pointers } from './js/pointers.js';

let introduction, items, imageCarousel;

const initCarousel = () => {
    imageCarousel = new buildfire.components.carousel.view(pointers.carousel, introduction.imageCarousel);
}

const initDescription = () => {
    pointers.description.innerHTML = introduction.description;
}

const load = async () => {
    const promises = [
        WidgetController.getIntroduction(),
        WidgetController.getItems(),
    ];

    await Promise.all(promises).then((values) => {
        introduction = values[0].data;
        items = values[1];
    });

    console.log({ introduction, items });
}

const init = async () => {
    await load();
    initDescription();
    initCarousel();
}

init();